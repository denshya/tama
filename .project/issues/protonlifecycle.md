---
id: 27
status: done
milestone: Lifecycle
~github: pinely-international/tama#70
---

```tsx
interface FSM {
  onEnter?(): void
  onExit?(): void
}

class Logic1 implements FSM {
  state = new State("")
  private abortController = new AbortController

  onEnter() {
    this.abortController = new AbortController
    window.addEventListener("pointermove", event => this.state.set(event.x), { signal: this.abortController.signal })
  }

  onExit() {
    this.abortController.abort()
  }
}

function logic2Startup(signal: AbortSignal) {
  const state = new State("")
  window.addEventListener("pointermove", event => state.set(event.x), { signal })

  return { state }
}

class Logic3 {
  state = new State("")

  startup(signal: AbortSignal) {
    window.addEventListener("pointermove", event => this.state.set(event.x), { signal })
  }
}

function Component() {
  this.lifecycle = new Proton.Lifecycle

  // Two main events to listen for.
  this.lifecycle.when("awake").subscribe(...)
  this.lifecycle.when("pause").subscribe(...)

  this.lifecycle.adopt(signal => {
    // Called when on awake.
    window.addEventListener("pointermove", event => x.set(event.x), { signal })
    // When paused, signal aborts or removes the listener.
  })

  // Can pass arrays and return the same values (just for quick wrapping).
  const [logic1, logic2] = this.lifecycle.adopt([new Logic1, logic2Startup])
  // Can pass records and return the same values (just for quick wrapping).
  const { logic1, logic2 } = this.lifecycle.adopt({ logic1: new Logic1, logic2: logic2Startup })
  // Can pass value directly (just for quick wrapping).
  const logic1 = this.lifecycle.adopt(new Logic1)
  logic1.state.set("new")

  const logic3 = new Logic3
  // Can pass the function to adopt the lifecycle awareness without wrapping.
  this.lifecycle.adopt(signal => logic3.startup(signal))
  logic3.state.set("new")

  const x = new State(0)

  logic1.state.sets(x)
  logic2.state.sets(x)
  logic3.state.sets(x)

  return <div>{x}</div>
}
```

```tsx
import { Proton } from "@denshya/proton"

// 1. Create QueryClient
const queryClient = new QueryClient()

// 2. Define your fetch function
async function fetchTodos() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function App(this: AppComponent) {
  const artistsResource = new ResourceQuery({
    queryKey: ["artists"],
    queryFn: ({ signal }) => api<Artist[]>("/artists", { method: "GET", signal }),
  })
  const { data: artists, isFetched } = artistsResource

  const { data: artists, isFetched } = this.resource.query({
    queryKey: ["artists"],
    queryFn: ({ signal }) => api<Artist[]>("/artists", { method: "GET", signal }),
  })


  this.lifecycle = new StateFSM
  this.lifecycle.adopt(artistsResource)

  this.lifecycle.next()

  const alive = State.from(this.lifecycle)



    // 3. Create the query
  const observer = new QueryObserver(queryClient, {
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 1000 * 60,
  })

  const todos = State.from(observer)
  todos.teardown.add(() => {})
  todos.lifecycle.add(this.lifecycle)
  // 4. Subscribe to updates
  todos.subscribe(todos => {
    if (todos.isLoading) {
      console.log('Loading...')
    } else if (todos.isError) {
      console.error('Error:', todos.error)
    } else {
      console.log('Data:', todos.data)
    }
  })

  // 5. Trigger the fetch
  observer.refetch()
  
  return "Hello World!"
}

export default App
```

```tsx
import { State, StateArray } from "@denshya/reactive"
import {
  QueryClient,
  QueryObserver,
} from '@tanstack/query-core'

// 1. Create QueryClient
const queryClient = new QueryClient()

// 2. Define your fetch function
async function fetchTodos() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

// 3. Create the query
const observer = new QueryObserver(queryClient, {
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 1000 * 60,
})


function App() {
  const result = new State<any>()
  observer.subscribe(a => result.set(a))

  const items = new StateArray(result.$.data.to(x => x ?? []))

  return (
    <div>
     {items.map(item => (
        <div style={{ display: "grid" }}>
          <input type="checkbox" checked={item.completed} />
          <span>ID: {item.id}</span>
          <span>UserID: {item.userId}</span>
          <span>Title: {item.title}</span>
        </div>
      ))}
    </div>
  )
}

export default App
```
