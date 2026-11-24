export default function Field({ label, name, type = "text", value, onChange, error, placeholder }) {
  return (
    <div className={"field" + (error ? " has-error" : "")}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} />
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}
