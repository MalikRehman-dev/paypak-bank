import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useBank } from "../context/BankContext"
import Field from "../components/Field"
import { checkEmail } from "../utils/validate"
export default function Register() {
  const { register, login, notify } = useBank()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" })
  const [errors, setErrors] = useState({})
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = e => {
    e.preventDefault()
    const found = {}
    if (form.name.trim().length < 3) found.name = "Name must be at least 3 characters"
    if (!checkEmail(form.email)) found.email = "Enter a valid email"
    if (!/^\d{10,15}$/.test(form.phone.trim())) found.phone = "Phone must be 10 to 15 digits"
    if (form.password.length < 6) found.password = "Password must be at least 6 characters"
    if (form.confirm !== form.password) found.confirm = "Passwords do not match"
    setErrors(found)
    if (Object.keys(found).length) return
    const result = register(form)
    if (!result.ok) return setErrors({ form: result.message })
    login(form.email, form.password)
    notify(result.message)
    navigate("/")
  }
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-brand">PayPak</h1>
        <p className="auth-sub">Create your account</p>
        {errors.form && <div className="form-error">{errors.form}</div>}
        <form onSubmit={submit}>
          <Field label="Full Name" name="name" value={form.name} onChange={change} error={errors.name} placeholder="Your name" />
          <Field label="Email" name="email" value={form.email} onChange={change} error={errors.email} placeholder="you@example.com" />
          <Field label="Phone" name="phone" value={form.phone} onChange={change} error={errors.phone} placeholder="03001234567" />
          <Field label="Password" name="password" type="password" value={form.password} onChange={change} error={errors.password} placeholder="At least 6 characters" />
          <Field label="Confirm Password" name="confirm" type="password" value={form.confirm} onChange={change} error={errors.confirm} placeholder="Repeat password" />
          <button className="btn full">Register</button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
