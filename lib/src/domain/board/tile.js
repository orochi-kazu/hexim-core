export const tile = (extraParams = {}) => {
  const neighbours = []
  const setNeighbours = (newNeighbours) => {
    while (neighbours.length > 0) {
      neighbours.pop()
    }
    newNeighbours.forEach(it => neighbours.push(it))
  }

  return Object.freeze({
    __debugReadOnly: {},
    neighbours,
    setNeighbours,
    ...extraParams
  })
}
