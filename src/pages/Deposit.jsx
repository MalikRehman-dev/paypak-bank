import { useBank } from "../context/BankContext"
import AmountForm from "../components/AmountForm"
import { money } from "../utils/format"
export default function Deposit() {
  const { deposit, currentUser } = useBank()
  return (
    <div>
      <h2 className="page-title">Deposit</h2>
      <AmountForm title="Deposit Funds" buttonText="Deposit" hint={"Current balance: " + money(currentUser.balance)} onSubmit={deposit} />
    </div>
  )
}
