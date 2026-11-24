import { money, formatDate, isIncoming } from "../utils/format"
const detail = t => (t.otherName ? (t.type === "Transfer Sent" ? "To " : "From ") + t.otherName + " (" + t.otherAccount + ")" : "-")
export default function TransactionTable({ transactions }) {
  if (transactions.length === 0) return <p className="empty">No transactions found</p>
  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date and Time</th>
              <th>Status</th>
              <th>Details</th>
              <th>Balance After</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => {
              const incoming = isIncoming(t.type)
              const amountClass = t.status === "Failed" ? "failed" : incoming ? "in" : "out"
              return (
                <tr key={t.ref + t.type + t.userId + t.date}>
                  <td>{t.ref}</td>
                  <td><span className={"arrow " + (incoming ? "in" : "out")}>{incoming ? "↓" : "↑"}</span> {t.type}</td>
                  <td className={"amount " + amountClass}>{incoming ? "+" : "-"}{money(t.amount)}</td>
                  <td>{formatDate(t.date)}</td>
                  <td><span className={"badge " + t.status.toLowerCase()}>{t.status}</span></td>
                  <td>{detail(t)}</td>
                  <td>{t.status === "Failed" ? "-" : money(t.balanceAfter)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="tx-list">
        {transactions.map(t => {
          const incoming = isIncoming(t.type)
          const amountClass = t.status === "Failed" ? "failed" : incoming ? "in" : "out"
          return (
            <div className="tx-item" key={"m" + t.ref + t.type + t.userId + t.date}>
              <span className={"tx-icon " + (incoming ? "in" : "out")}>{incoming ? "↓" : "↑"}</span>
              <div className="tx-info">
                <strong>{t.type}</strong>
                <small>{t.otherName ? detail(t) : t.ref}</small>
                <small>{formatDate(t.date)}</small>
                {t.otherName && <small>Ref: {t.ref}</small>}
              </div>
              <div className="tx-right">
                <span className={"amount " + amountClass}>{incoming ? "+" : "-"}{money(t.amount)}</span>
                <span className={"badge " + t.status.toLowerCase()}>{t.status}</span>
                {t.status !== "Failed" && <small>Bal: {money(t.balanceAfter)}</small>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
