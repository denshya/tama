import "./happydom"

import { barplot, bench, group, run } from "mitata"
import { State, StateArray, StateReconciler } from "@denshya/reactive"
import { WebInflator } from "../build"


const inflator = new WebInflator

interface Row { id: State<number>, label: State<string> }

const makeRows = (count: number, offset = 0): Row[] =>
	Array.from({ length: count }, (_, index) => ({ id: new State(index + offset), label: new State(`item ${index + offset}`) }))

group("List reconciliation — 1,000 rows via reconciled map", () => {
	const rows = new StateArray<Row>([])
	rows.reconciler = StateReconciler.IDENTITY

	const rowViews = rows.map(row => (
		<tr class="row">
			<td class="col-md-1">{row.id}</td>
			<td class="col-md-4"><a class="label">{row.label}</a></td>
		</tr>
	))

	const table = inflator.inflate(<table><tbody>{rowViews}</tbody></table>) as HTMLElement
	document.body.append(table)
	const tbody = table.querySelector("tbody")!

	const original = makeRows(1_000)
	rows.set(original)
	if (tbody.children.length !== 1_000) throw new Error("setup failed: " + tbody.children.length)

	const filtered = original.filter((_, index) => index !== 500)

	barplot(() => {
		bench("remove one row (999 identity survivors)", () => {
			rows.set(filtered)
			rows.set(original)
		})

		bench("replace all rows (1,000 new items, patch in place)", () => {
			rows.set(makeRows(1_000))
		})

		bench("append 1,000 rows", () => {
			const current = rows.get()
			rows.set([...current, ...makeRows(1_000, current.length)])
			rows.set(current)
		})

		bench("clear all rows", () => {
			rows.set([])
			rows.set(original)
		})

		bench("select row (fine-grained className)", () => {
			const rowNode = tbody.children[500] as HTMLElement
			rowNode.className = "danger"
			rowNode.className = ""
		})
	})
})

run()
