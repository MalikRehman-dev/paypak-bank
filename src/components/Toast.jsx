import { useBank } from "../context/BankContext"
export default function Toast() {
  const { toast } = useBank()
  if (!toast) return null
  return <div className={"toast " + toast.type}>{toast.message}</div>
}
