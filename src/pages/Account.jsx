import { useState } from "react"
import { useBank } from "../context/BankContext"
import Field from "../components/Field"
import { money, formatDate } from "../utils/format"
export default function Account() {
  const { currentUser, updateProfile, notify } = useBank()
  const [name, setName] = useState(currentUser.name)
  const [phone, setPhone] = useState(currentUser.phone)
  const [errors, setErrors] = useState({})
  const submit = e => {
    e.preventDefault()
    const found = {}
    if (name.trim().length < 3) found.name = "Name must be at least 3 characters"
    if (!/^\d{10,15}$/.test(phone.trim())) found.phone = "Phone must be 10 to 15 digits"
    setErrors(found)
    if (Object.keys(found).length) return
    const result = updateProfile(name, phone)
    notify(result.message, result.ok ? "success" : "error")
  }
  const rows = [["Account Number", currentUser.accountNumber], ["Email", currentUser.email], ["Phone", currentUser.phone], ["Balance", money(currentUser.balance)], ["Member Since", formatDate(currentUser.createdAt)]]
  return (
    <div>
      <h2 className="page-title">Account Settings</h2>
      <div className="card section">
        <h3>{currentUser.name}</h3>
        <div className="info-list">
          {rows.map(([label, value]) => (
            <div className="info-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="card form-card">
        <h3>Edit Profile</h3>
        <form onSubmit={submit}>
          <Field label="Full Name" name="name" value={name} onChange={e => setName(e.target.value)} error={errors.name} />
          <Field label="Phone" name="phone" value={phone} onChange={e => setPhone(e.target.value)} error={errors.phone} />
          <button className="btn full">Save Changes</button>
        </form>
      </div>
    </div>
  )
}
