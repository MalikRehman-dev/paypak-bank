import { useRef, useState } from "react"
import Field from "./Field"
import { useBank } from "../context/BankContext"
import { checkAmount } from "../utils/validate"
const quick = [500, 1000, 5000, 10000]
export default function AmountForm({ title, buttonText, hint, maxAmount, onSubmit }) {
  const { notify } = useBank()
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const lock = useRef(false)
  const submit = e => {
    e.preventDefault()
    if (lock.current) return
    const problem = checkAmount(amount)
    if (problem) return setError(problem)
    lock.current = true
    setLoading(true)
    const result = onSubmit(amount)
    notify(result.message, result.ok ? "success" : "error")
    setError(result.ok ? "" : result.message)
    if (result.ok) setAmount("")
    setTimeout(() => {
      lock.current = false
      setLoading(false)
    }, 700)
  }
  return (
    <div className="card form-card">
      <h3>{title}</h3>
      {hint && <p className="hint">{hint}</p>}
      <form onSubmit={submit}>
        <Field label="Amount (Rs)" name="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} error={error} placeholder="Enter amount" />
        <div className="chips">
          {quick.map(q => (
            <button type="button" key={q} className="chip" onClick={() => setAmount(String(q))}>{q}</button>
          ))}
          {maxAmount > 0 && <button type="button" className="chip" onClick={() => setAmount(String(maxAmount))}>All</button>}
        </div>
        <button className="btn full" disabled={loading}>{loading ? "Processing..." : buttonText}</button>
      </form>
    </div>
  )
}
