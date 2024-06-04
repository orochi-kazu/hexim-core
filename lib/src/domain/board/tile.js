export const tile = (extraParams = {}, debugParams = {}) => {
  const neighbours = []
  const setNeighbours = (newNeighbours) => {
    while (neighbours.length > 0) {
      neighbours.pop()
    }
    newNeighbours.forEach(it => neighbours.push(it))
  }

  return Object.freeze({
    __debugReadOnly: { ...debugParams },
    neighbours,
    setNeighbours,
    ...extraParams
  })
}
