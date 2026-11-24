import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useBank } from "../context/BankContext"
const tabs = [["/", "🏠", "Home"], ["/transfer", "💸", "Send"], ["/transactions", "🧾", "History"], ["/account", "👤", "Account"]]
export default function Layout() {
  const { currentUser } = useBank()
  const [open, setOpen] = useState(false)
  return (
    <div className="layout">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="backdrop" onClick={() => setOpen(false)}></div>}
      <div className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)}>☰</button>
          <span className="top-brand">PayPak</span>
          <span className="top-name">Hello, {currentUser.name}</span>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
      <nav className="bottom-nav">
        {tabs.map(([to, icon, name]) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <span>{icon}</span>
            <small>{name}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
