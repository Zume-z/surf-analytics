export const twoDec = (value: any) => {
  return (Math.round(Number(value) * 100) / 100).toFixed(2)
}
