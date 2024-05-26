import prng from 'prng'

export const genTree = (seed, label) => {
  const randChild = prng.LFib4(seed).uint32
  const randData = prng.LFib4(randChild()).uint32

  const children = []
  const generateChild = (childLabel) => {
    const newChild = genTree(randChild(), childLabel)
    children.push(newChild)
    return newChild
  }

  const dataHistory = []
  const nextDatum = () => {
    const newDatum = randData()
    dataHistory.push(newDatum)
    return newDatum
  }

  return {
    __debugReadOnly: { seed, randChild, randData, dataHistory },
    label,
    children,
    generateChild,
    nextDatum
  }
}
