import { Wave } from '../interfaces'

const interferences = {
  intHalved: { label: 'Score Halved', value: 'intHalved' },
  intZeroed: { label: 'Score Zeroed', value: 'intZeroed' },
  intPenaltyOne: { label: 'Interference Penalty One', value: 'intPenaltyOne' },
  intPenaltyTwo: { label: 'Interference Penalty Two', value: 'intPenaltyTwo' },
  intPenaltyThree: { label: 'Interference Penalty Three', value: 'intPenaltyThree' },
}

export const getInterference = (wave: Wave) => {
  return wave.intHalved
    ? interferences.intHalved
    : wave.intZeroed
    ? interferences.intZeroed
    : wave.intPenaltyOne
    ? interferences.intPenaltyOne
    : wave.intPenaltyTwo
    ? interferences.intPenaltyTwo
    : wave.intPenaltyThree
    ? interferences.intPenaltyThree
    : undefined
}

