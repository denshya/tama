import json, sys
from collections import Counter

def analyze_trace(path):
    with open(path) as f:
        data = json.load(f)
    events = data['traceEvents']

    # ── 1. Timeline ──────────────────────────────────────────────
    dom_loading_ts = None
    mod_eval_start = None
    mod_eval_dur = None
    render_ts = None
    fcp_ts = None

    for e in events:
        name = e.get('name', '')
        if name == 'domLoading':
            dom_loading_ts = e['ts']
        if name == 'v8.evaluateModule':
            mod_eval_start = e['ts']
            mod_eval_dur = e['dur']
        if name == 'ResourceSendRequest':
            st = e.get('args', {}).get('data', {}).get('stackTrace', [])
            for frame in st if isinstance(st, list) else []:
                if '_target_script.ts' in frame.get('url', ''):
                    render_ts = e['ts']
                    break
        if name == 'firstContentfulPaint':
            fcp_ts = e['ts']
        if name == 'firstPaint' and not fcp_ts:
            fcp_ts = e['ts']

    print(f"domLoading:             {dom_loading_ts}")
    if mod_eval_start:
        print(f"Module eval start:      {mod_eval_start}  ({(mod_eval_start-dom_loading_ts)/1000:.2f}ms after domLoading)")
        print(f"Module eval duration:   {mod_eval_dur}µs ({mod_eval_dur/1000:.3f}ms)")
    if render_ts and mod_eval_start:
        print(f"Rendered log:           {render_ts}  ({(render_ts-mod_eval_start)/1000:.3f}ms from module start)")
    if fcp_ts and dom_loading_ts:
        print(f"FCP:                    {fcp_ts}  ({(fcp_ts-dom_loading_ts)/1000:.2f}ms from domLoading)")

    # ── 2. CPU profile samples in eval window ──────────────────
    if not mod_eval_start or not mod_eval_dur:
        return

    eval_end = mod_eval_start + mod_eval_dur

    all_nodes = {}
    for e in events:
        if e.get('name') == 'ProfileChunk':
            for n in e.get('args', {}).get('data', {}).get('cpuProfile', {}).get('nodes', []):
                if n['id'] not in all_nodes:
                    all_nodes[n['id']] = n

    def get_func_name(node_id):
        seen = set()
        while node_id and node_id not in seen:
            seen.add(node_id)
            if node_id in all_nodes:
                n = all_nodes[node_id]
                cf = n.get('callFrame', {})
                fn = cf.get('functionName', '') or '(anonymous)'
                url = cf.get('url', '')
                short = url.split('/')[-1] if '/' in url else url
                return f"{fn} [{short}]" if short else fn
        return f"node_{node_id}"

    window_samples = []
    for e in events:
        if e.get('name') == 'ProfileChunk':
            chunk_ts = e['ts']
            d = e.get('args', {}).get('data', {})
            td = d.get('timeDeltas', [])
            cp = d.get('cpuProfile', {})
            samples = cp.get('samples', [])

            sample_ts = chunk_ts
            for i, delta in enumerate(td):
                sample_ts += delta
                if i < len(samples) and mod_eval_start <= sample_ts <= eval_end:
                    window_samples.append((sample_ts, samples[i]))

    print(f"\nCPU samples in eval window: {len(window_samples)}")

    if not window_samples:
        return

    leaf_counts = Counter()
    for ts, sid in window_samples:
        leaf_counts[get_func_name(sid)] += 1

    total = len(window_samples)
    idle = leaf_counts.get('(idle) []', 0)
    program = leaf_counts.get('(program) []', 0)
    non_idle = total - idle - program

    print(f"  Idle:      {idle:3d} ({idle/total*100:5.1f}%)")
    print(f"  Program:   {program:3d} ({program/total*100:5.1f}%)")
    print(f"  Non-idle:  {non_idle:3d} ({non_idle/total*100:5.1f}%)")
    print(f"\n  Active frames ({non_idle} samples):")
    for fn, count in leaf_counts.most_common(15):
        if fn not in ('(idle) []', '(program) []'):
            pct = count / non_idle * 100
            print(f"    {fn:55s} {count:3d} ({pct:4.1f}%)")

    # ── 3. Grouped breakdown ──────────────────────────────────
    if non_idle > 0:
        groups = {
            "Tama inflation": ['inflate', 'inflateIntrinsic', 'inflateJSX', 'inflateElement',
                               'inflateComponent', 'inflateIterable', 'inflateChildren',
                               'WebInflator', 'initWith', 'MountObserver', 'Group', 'Element', 'Element2'],
            "Inferno render": ['render', 'createComponent', 'createVNode', 'createTextVNode',
                               'normalize', 'mountComponent', 'mountElement', 'mountProps',
                               'patchProp', 'patchStyle', 'patchEvent'],
            "DOM APIs": ['createElement', 'createElementNS', 'appendChild', 'setAttribute',
                         'removeChild', 'insertBefore', 'replaceChild'],
        }
        print(f"\n  Grouped breakdown (% of non-idle):")
        for label, funcs in groups.items():
            g_count = sum(c for fn, c in leaf_counts.items()
                          if any(f.split(' [')[0] == fn.split(' [')[0] for f in funcs) or any(f in fn for f in funcs))
            if g_count > 0:
                print(f"    {label:20s} {g_count:3d} ({g_count/non_idle*100:4.1f}%)")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 analyze-trace.py <path-to-trace.json>")
        sys.exit(1)
    analyze_trace(sys.argv[1])
