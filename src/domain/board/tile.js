export const tile = (extraParams = {}, debugParams = {}) => {
  const neighbours = []

  const setNeighbours = (newNeighbours) => {
    neighbours.splice(0)
    neighbours.push(...newNeighbours)
  }

  return Object.freeze({
    __debugReadOnly: { ...debugParams },
    neighbours,
    setNeighbours,
    ...extraParams
  })
}
