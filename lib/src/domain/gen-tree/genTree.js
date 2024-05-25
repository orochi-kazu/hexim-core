import prng from 'prng'

export const genTree = (seed, label) => {
  const randChild = prng.LFib4(seed).uint32
  const randData = prng.LFib4(randChild()).uint32

  const children = []
  const generateChild = (childLabel) => {
    children.push(genTree(randChild(), childLabel))
  }

  const data = []
  const generateDatum = (datumLabel) => {
    data.push({ value: randData(), label: datumLabel })
  }

  return {
    __debugReadOnly: { seed, randChild, randData },
    label,
    children,
    data,
    generateChild,
    generateDatum
  }
}
