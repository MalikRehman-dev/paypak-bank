import { useBank } from "../context/BankContext"
import AmountForm from "../components/AmountForm"
import { money } from "../utils/format"
export default function Withdraw() {
  const { withdraw, currentUser } = useBank()
  return (
    <div>
      <h2 className="page-title">Withdraw</h2>
      <AmountForm title="Withdraw Funds" buttonText="Withdraw" hint={"Available balance: " + money(currentUser.balance)} maxAmount={currentUser.balance} onSubmit={withdraw} />
    </div>
  )
}
