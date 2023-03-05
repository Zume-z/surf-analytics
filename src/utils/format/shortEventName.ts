export const shortEventName = (eventName: string) => {
  if (!eventName) return ''
  eventName = eventName.replace("Women's", '')
  eventName = eventName.replace('Drug Aware', '')
  eventName = eventName.replace('Commonwealth Bank', '')
  eventName = eventName.replace('TSB Bank', '')
  eventName = eventName.replace("O'Neill Coldwater Classic Santa Cruz", "O'Neill Coldwater Classic")
  eventName = eventName.replace('Boost Mobile', 'Boost')
  return eventName
}
