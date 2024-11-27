const calculateChange = (coins, amount) => {
  coins.sort((a, b) => b - a) // Sort coins in descending order
  
  const change = []
    
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i]
      
    if (amount >= coin) {
      const count = Math.floor(amount / coin)
      for (let j = 0; j < count; j++) {
        change.push(coin)
      }
      amount -= coin * count
    }
  }
    
  return change
}
  
module.exports = calculateChange