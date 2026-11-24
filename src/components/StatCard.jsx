export default function StatCard({ title, value, color }) {
  return (
    <div className={"card stat " + color}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  )
}
