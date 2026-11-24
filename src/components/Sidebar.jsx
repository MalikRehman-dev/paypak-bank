import { NavLink, useNavigate } from "react-router-dom"
import { useBank } from "../context/BankContext"
const links = [["/", "Dashboard"], ["/deposit", "Deposit"], ["/withdraw", "Withdraw"], ["/transfer", "Transfer"], ["/transactions", "Transactions"], ["/account", "Account Settings"]]
export default function Sidebar({ open, onClose }) {
  const { logout, notify } = useBank()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    notify("Logged out successfully")
    navigate("/login")
  }
  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <div className="brand">PayPak</div>
      <nav>
        {links.map(([to, name]) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={onClose}>{name}</NavLink>
        ))}
      </nav>
      <button className="btn logout" onClick={handleLogout}>Logout</button>
    </aside>
  )
}
