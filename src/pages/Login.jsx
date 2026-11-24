import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useBank } from "../context/BankContext"
import Field from "../components/Field"
import { checkEmail } from "../utils/validate"
export default function Login() {
  const { login, notify } = useBank()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = e => {
    e.preventDefault()
    const found = {}
    if (!form.email.trim()) found.email = "Email is required"
    else if (!checkEmail(form.email)) found.email = "Enter a valid email"
    if (!form.password) found.password = "Password is required"
    setErrors(found)
    if (Object.keys(found).length) return
    const result = login(form.email, form.password)
    if (result.ok) {
      notify(result.message)
      navigate("/")
    } else {
      setErrors({ form: result.message })
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-brand">PayPak</h1>
        <p className="auth-sub">Login to your account</p>
        {errors.form && <div className="form-error">{errors.form}</div>}
        <form onSubmit={submit}>
          <Field label="Email" name="email" value={form.email} onChange={change} error={errors.email} placeholder="you@example.com" />
          <Field label="Password" name="password" type="password" value={form.password} onChange={change} error={errors.password} placeholder="Enter password" />
          <button className="btn full">Login</button>
        </form>
        <p className="auth-link">No account? <Link to="/register">Register here</Link></p>
        <p className="demo">Demo: ali@paypak.com / 123456</p>
      </div>
    </div>
  )
}
