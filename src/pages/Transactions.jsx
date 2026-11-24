import { useState } from "react"
import { useBank } from "../context/BankContext"
import TransactionTable from "../components/TransactionTable"
const perPage = 8
export default function Transactions() {
  const { myTransactions } = useBank()
  const [type, setType] = useState("All")
  const [status, setStatus] = useState("All")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("date-desc")
  const [page, setPage] = useState(1)
  const update = setter => e => {
    setter(e.target.value)
    setPage(1)
  }
  const text = search.trim().toLowerCase()
  const filtered = myTransactions
    .filter(t => type === "All" || t.type === type)
    .filter(t => status === "All" || t.status === status)
    .filter(t => !text || t.ref.toLowerCase().includes(text) || t.otherName.toLowerCase().includes(text))
    .sort((a, b) => {
      if (sort === "date-asc") return new Date(a.date) - new Date(b.date)
      if (sort === "amount-desc") return b.amount - a.amount
      if (sort === "amount-asc") return a.amount - b.amount
      return new Date(b.date) - new Date(a.date)
    })
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * perPage, current * perPage)
  return (
    <div>
      <h2 className="page-title">Transaction History</h2>
      <div className="card section">
        <div className="filters">
          <input placeholder="Search by reference or name" value={search} onChange={update(setSearch)} />
          <select value={type} onChange={update(setType)}>
            <option>All</option>
            <option>Deposit</option>
            <option>Withdrawal</option>
            <option>Transfer Sent</option>
            <option>Transfer Received</option>
          </select>
          <select value={status} onChange={update(setStatus)}>
            <option>All</option>
            <option>Completed</option>
            <option>Failed</option>
          </select>
          <select value={sort} onChange={update(setSort)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount high to low</option>
            <option value="amount-asc">Amount low to high</option>
          </select>
        </div>
        <TransactionTable transactions={visible} />
        <div className="pagination">
          <button className="btn btn-outline btn-small" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
          <span>Page {current} of {pages}</span>
          <button className="btn btn-outline btn-small" disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
        </div>
      </div>
    </div>
  )
}
