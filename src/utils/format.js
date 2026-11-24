export const money = n => "Rs " + Number(n).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const formatDate = iso => new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
export const isIncoming = type => type === "Deposit" || type === "Transfer Received"
