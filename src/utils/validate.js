export const checkAmount = value => {
  const amount = Number(value)
  if (value === "" || value === null || value === undefined || isNaN(amount)) return "Please enter a valid amount"
  if (amount <= 0) return "Amount must be greater than zero"
  if (amount > 10000000) return "Amount is too large"
  if (Math.round(amount * 100) / 100 !== amount) return "Only two decimal places are allowed"
  return ""
}
export const checkEmail = email => /^\S+@\S+\.\S+$/.test(email.trim())
