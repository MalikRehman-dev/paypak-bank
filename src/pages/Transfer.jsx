import { useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useBank } from "../context/BankContext"
import Field from "../components/Field"
import Modal from "../components/Modal"
import { checkAmount } from "../utils/validate"
import { money } from "../utils/format"
export default function Transfer() {
  const { otherUsers, currentUser, findRecipient, transfer, notify } = useBank()
  const [params] = useSearchParams()
  const [account, setAccount] = useState(params.get("to") || "")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const lock = useRef(false)
  const typed = account.trim().toUpperCase()
  const receiver = typed ? findRecipient(typed) : null
  const next = e => {
    e.preventDefault()
    if (!typed) return setError("Please enter recipient account number")
    if (!receiver) return setError("Recipient does not exist")
    if (receiver.id === currentUser.id) return setError("You cannot transfer money to yourself")
    const problem = checkAmount(amount)
    if (problem) return setError(problem)
    if (Number(amount) > currentUser.balance) return setError("Insufficient balance")
    setError("")
    setShowModal(true)
  }
  const confirm = () => {
    if (lock.current) return
    lock.current = true
    setLoading(true)
    setShowModal(false)
    const result = transfer(receiver.id, amount)
    notify(result.message, result.ok ? "success" : "error")
    if (result.ok) {
      setAmount("")
      setAccount("")
    }
    setTimeout(() => {
      lock.current = false
      setLoading(false)
    }, 700)
  }
  return (
    <div>
      <h2 className="page-title">Transfer Money</h2>
      <div className="card form-card">
        <h3>Send Money</h3>
        <p className="hint">Available balance: {money(currentUser.balance)}</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={next}>
          <Field label="Recipient Account Number" name="account" value={account} onChange={e => setAccount(e.target.value)} placeholder="e.g. PK10000002" />
          {typed && receiver && receiver.id !== currentUser.id && <p className="found">Account holder: {receiver.name}</p>}
          {typed && !receiver && <p className="error-text not-found">No account found with this number</p>}
          <Field label="Amount (Rs)" name="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
          <button className="btn full" disabled={loading}>{loading ? "Processing..." : "Continue"}</button>
        </form>
      </div>
      <div className="card section">
        <h3>Quick Select</h3>
        {otherUsers.length === 0 && <p className="empty">No other users available</p>}
        <div className="user-grid">
          {otherUsers.map(u => (
            <div key={u.id} className={"user-item pick" + (typed === u.accountNumber ? " selected" : "")} onClick={() => setAccount(u.accountNumber)}>
              <div>
                <strong>{u.name}</strong>
                <p>{u.accountNumber}</p>
              </div>
              {typed === u.accountNumber && <span className="tick">✓</span>}
            </div>
          ))}
        </div>
      </div>
      <Modal open={showModal} title="Confirm Transfer" onClose={() => setShowModal(false)} onConfirm={confirm} confirmText="Send Money">
        {receiver && <p>You are sending <strong>{money(amount || 0)}</strong> to <strong>{receiver.name}</strong> ({receiver.accountNumber}).</p>}
      </Modal>
    </div>
  )
}
