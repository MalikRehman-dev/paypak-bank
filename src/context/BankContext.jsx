import { createContext, useContext, useState } from "react"
import { checkAmount } from "../utils/validate"
const BankContext = createContext()
export const useBank = () => useContext(BankContext)
const seedUsers = [
  { id: "u1", name: "Ali Khan", email: "ali@paypak.com", phone: "03001234567", password: "123456", accountNumber: "PK10000001", balance: 50000, createdAt: "2026-01-01T09:00:00.000Z" },
  { id: "u2", name: "Sara Ahmed", email: "sara@paypak.com", phone: "03111234567", password: "123456", accountNumber: "PK10000002", balance: 25000, createdAt: "2026-01-02T09:00:00.000Z" },
  { id: "u3", name: "Usman Raza", email: "usman@paypak.com", phone: "03211234567", password: "123456", accountNumber: "PK10000003", balance: 10000, createdAt: "2026-01-03T09:00:00.000Z" }
]
const tx = (ref, userId, type, amount, balanceAfter, date, status = "Completed", otherName = "", otherAccount = "") => ({ ref, userId, type, amount, status, otherName, otherAccount, balanceAfter, date })
const seedTransactions = [
  tx("TXN1000009", "u1", "Withdrawal", 90000, 50000, "2026-01-16T18:00:00.000Z", "Failed"),
  tx("TXN1000008", "u1", "Withdrawal", 2000, 50000, "2026-01-15T10:15:00.000Z"),
  tx("TXN1000007", "u2", "Deposit", 2000, 25000, "2026-01-14T16:00:00.000Z"),
  tx("TXN1000006", "u2", "Transfer Received", 3000, 23000, "2026-01-12T14:00:00.000Z", "Completed", "Ali Khan", "PK10000001"),
  tx("TXN1000006", "u1", "Transfer Sent", 3000, 52000, "2026-01-12T14:00:00.000Z", "Completed", "Sara Ahmed", "PK10000002"),
  tx("TXN1000005", "u1", "Deposit", 15000, 55000, "2026-01-10T09:30:00.000Z"),
  tx("TXN1000004", "u3", "Withdrawal", 2000, 10000, "2026-01-08T12:00:00.000Z"),
  tx("TXN1000003", "u3", "Deposit", 12000, 12000, "2026-01-07T11:00:00.000Z"),
  tx("TXN1000002", "u2", "Deposit", 20000, 20000, "2026-01-06T10:00:00.000Z"),
  tx("TXN1000001", "u1", "Deposit", 40000, 40000, "2026-01-05T09:00:00.000Z")
]
const read = (key, fallback) => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const round = n => Math.round(n * 100) / 100
const makeRef = () => "TXN" + Date.now().toString().slice(-7) + Math.floor(100 + Math.random() * 900)
const makeTx = (user, type, amount, status, extra = {}) => ({
  ref: makeRef(),
  userId: user.id,
  type,
  amount,
  status,
  otherName: "",
  otherAccount: "",
  balanceAfter: user.balance,
  date: new Date().toISOString(),
  ...extra
})
export function BankProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = read("pp_users", null)
    if (saved) return saved
    write("pp_users", seedUsers)
    return seedUsers
  })
  const [transactions, setTransactions] = useState(() => {
    const saved = read("pp_transactions", null)
    if (saved) return saved
    write("pp_transactions", seedTransactions)
    return seedTransactions
  })
  const [currentId, setCurrentId] = useState(() => read("pp_session", null))
  const [toast, setToast] = useState(null)
  const currentUser = users.find(u => u.id === currentId) || null
  const myTransactions = transactions.filter(t => t.userId === currentId)
  const otherUsers = users.filter(u => u.id !== currentId).map(u => ({ id: u.id, name: u.name, accountNumber: u.accountNumber }))
  const findRecipient = value => {
    const found = users.find(u => u.accountNumber === value.trim().toUpperCase())
    return found ? { id: found.id, name: found.name, accountNumber: found.accountNumber } : null
  }
  const notify = (message, type = "success") => {
    const id = Date.now()
    setToast({ id, message, type })
    setTimeout(() => setToast(t => (t && t.id === id ? null : t)), 3000)
  }
  const fresh = () => ({ list: read("pp_users", []), txs: read("pp_transactions", []) })
  const saveAll = (newUsers, newTxs) => {
    const oldUsers = localStorage.getItem("pp_users")
    try {
      write("pp_users", newUsers)
      write("pp_transactions", newTxs)
    } catch {
      if (oldUsers) localStorage.setItem("pp_users", oldUsers)
      return false
    }
    setUsers(newUsers)
    setTransactions(newTxs)
    return true
  }
  const failed = { ok: false, message: "Something went wrong, nothing was changed" }
  const register = ({ name, email, phone, password }) => {
    const { list } = fresh()
    const cleanEmail = email.trim().toLowerCase()
    if (list.some(u => u.email === cleanEmail)) return { ok: false, message: "This email is already registered" }
    let accountNumber
    do {
      accountNumber = "PK" + Math.floor(10000000 + Math.random() * 90000000)
    } while (list.some(u => u.accountNumber === accountNumber))
    const user = { id: "u" + Date.now(), name: name.trim(), email: cleanEmail, phone: phone.trim(), password, accountNumber, balance: 0, createdAt: new Date().toISOString() }
    const newList = [...list, user]
    write("pp_users", newList)
    setUsers(newList)
    return { ok: true, message: "Account created successfully" }
  }
  const login = (email, password) => {
    const list = read("pp_users", [])
    const user = list.find(u => u.email === email.trim().toLowerCase() && u.password === password)
    if (!user) return { ok: false, message: "Incorrect email or password" }
    setUsers(list)
    setTransactions(read("pp_transactions", []))
    write("pp_session", user.id)
    setCurrentId(user.id)
    return { ok: true, message: "Welcome back, " + user.name }
  }
  const logout = () => {
    localStorage.removeItem("pp_session")
    setCurrentId(null)
  }
  const deposit = value => {
    const error = checkAmount(value)
    if (error) return { ok: false, message: error }
    const { list, txs } = fresh()
    const user = list.find(u => u.id === currentId)
    if (!user) return { ok: false, message: "Please login again" }
    const amount = Number(value)
    const updated = { ...user, balance: round(user.balance + amount) }
    const newList = list.map(u => (u.id === user.id ? updated : u))
    const saved = saveAll(newList, [makeTx(updated, "Deposit", amount, "Completed"), ...txs])
    return saved ? { ok: true, message: "Deposit successful" } : failed
  }
  const withdraw = value => {
    const error = checkAmount(value)
    if (error) return { ok: false, message: error }
    const { list, txs } = fresh()
    const user = list.find(u => u.id === currentId)
    if (!user) return { ok: false, message: "Please login again" }
    const amount = Number(value)
    if (amount > user.balance) {
      saveAll(list, [makeTx(user, "Withdrawal", amount, "Failed"), ...txs])
      return { ok: false, message: "Insufficient balance" }
    }
    const updated = { ...user, balance: round(user.balance - amount) }
    const newList = list.map(u => (u.id === user.id ? updated : u))
    const saved = saveAll(newList, [makeTx(updated, "Withdrawal", amount, "Completed"), ...txs])
    return saved ? { ok: true, message: "Withdrawal successful" } : failed
  }
  const transfer = (toId, value) => {
    const error = checkAmount(value)
    if (error) return { ok: false, message: error }
    if (!toId) return { ok: false, message: "Please select a recipient" }
    const { list, txs } = fresh()
    const sender = list.find(u => u.id === currentId)
    const receiver = list.find(u => u.id === toId)
    if (!sender) return { ok: false, message: "Please login again" }
    if (!receiver) return { ok: false, message: "Recipient does not exist" }
    if (receiver.id === sender.id) return { ok: false, message: "You cannot transfer money to yourself" }
    const amount = Number(value)
    const ref = makeRef()
    if (amount > sender.balance) {
      saveAll(list, [makeTx(sender, "Transfer Sent", amount, "Failed", { ref, otherName: receiver.name, otherAccount: receiver.accountNumber }), ...txs])
      return { ok: false, message: "Insufficient balance" }
    }
    const newSender = { ...sender, balance: round(sender.balance - amount) }
    const newReceiver = { ...receiver, balance: round(receiver.balance + amount) }
    const newList = list.map(u => (u.id === sender.id ? newSender : u.id === receiver.id ? newReceiver : u))
    const sentTx = makeTx(newSender, "Transfer Sent", amount, "Completed", { ref, otherName: receiver.name, otherAccount: receiver.accountNumber })
    const receivedTx = makeTx(newReceiver, "Transfer Received", amount, "Completed", { ref, otherName: sender.name, otherAccount: sender.accountNumber })
    const saved = saveAll(newList, [sentTx, receivedTx, ...txs])
    return saved ? { ok: true, message: "Transfer successful. Reference: " + ref } : failed
  }
  const updateProfile = (name, phone) => {
    const { list, txs } = fresh()
    const newList = list.map(u => (u.id === currentId ? { ...u, name: name.trim(), phone: phone.trim() } : u))
    const saved = saveAll(newList, txs)
    return saved ? { ok: true, message: "Profile updated" } : failed
  }
  const value = { currentUser, myTransactions, otherUsers, findRecipient, toast, notify, register, login, logout, deposit, withdraw, transfer, updateProfile }
  return <BankContext.Provider value={value}>{children}</BankContext.Provider>
}
