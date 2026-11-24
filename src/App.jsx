import { Routes, Route, Navigate } from "react-router-dom"
import { useBank } from "./context/BankContext"
import Layout from "./components/Layout"
import Toast from "./components/Toast"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Deposit from "./pages/Deposit"
import Withdraw from "./pages/Withdraw"
import Transfer from "./pages/Transfer"
import Transactions from "./pages/Transactions"
import Account from "./pages/Account"
function Protected({ children }) {
  const { currentUser } = useBank()
  return currentUser ? children : <Navigate to="/login" replace />
}
function Guest({ children }) {
  const { currentUser } = useBank()
  return currentUser ? <Navigate to="/" replace /> : children
}
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Guest><Login /></Guest>} />
        <Route path="/register" element={<Guest><Register /></Guest>} />
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route index element={<Dashboard />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  )
}
