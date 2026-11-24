import { useState } from "react"
import { Link } from "react-router-dom"
import { useBank } from "../context/BankContext"
import StatCard from "../components/StatCard"
import TransactionTable from "../components/TransactionTable"
import { money } from "../utils/format"
const actions = [["/transfer", "💸", "Send Money"], ["/deposit", "➕", "Deposit"], ["/withdraw", "🏧", "Withdraw"], ["/transactions", "🧾", "History"], ["/account", "👤", "Account"]]
export default function Dashboard() {
  const { currentUser, myTransactions, otherUsers } = useBank()
  const [hidden, setHidden] = useState(false)
  const done = myTransactions.filter(t => t.status === "Completed")
  const total = type => done.filter(t => t.type === type).reduce((sum, t) => sum + t.amount, 0)
  return (
    <div>
      <div className="hero">
        <p className="hero-hello">Assalam o Alaikum,</p>
        <h2>{currentUser.name}</h2>
        <div className="balance-card">
          <p>Available Balance</p>
          <div className="balance-row">
            <h1>{hidden ? "Rs ••••••" : money(currentUser.balance)}</h1>
            <button className="eye" onClick={() => setHidden(!hidden)}>{hidden ? "🙈" : "👁"}</button>
          </div>
          <p className="acc-no">Account: {currentUser.accountNumber}</p>
        </div>
      </div>
      <div className="actions">
        {actions.map(([to, icon, name]) => (
          <Link className="action" to={to} key={to}>
            <span className="action-icon">{icon}</span>
            <span>{name}</span>
          </Link>
        ))}
      </div>
      <div className="stats mini-stats">
        <StatCard title="Total Deposited" value={money(total("Deposit"))} color="blue" />
        <StatCard title="Total Withdrawn" value={money(total("Withdrawal"))} color="red" />
        <StatCard title="Total Transferred" value={money(total("Transfer Sent"))} color="gold" />
      </div>
      <div className="card section">
        <h3>Send Money To</h3>
        {otherUsers.length === 0 && <p className="empty">No other users yet</p>}
        <div className="people">
          {otherUsers.map(u => (
            <Link className="person" key={u.id} to={"/transfer?to=" + u.accountNumber}>
              <span className="avatar">{u.name[0]}</span>
              <strong>{u.name}</strong>
              <small>{u.accountNumber}</small>
            </Link>
          ))}
        </div>
      </div>
      <div className="card section">
        <div className="section-head">
          <h3>Recent Transactions</h3>
          <Link to="/transactions" className="link">View all</Link>
        </div>
        <TransactionTable transactions={myTransactions.slice(0, 5)} />
      </div>
    </div>
  )
}
