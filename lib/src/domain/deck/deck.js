export const deck = (
  nextDatum,
  initialList,
  { initialDrawnCount = 0, shuffleOnceRemainingCountIs = 0 } = {}
) => {
  const list = [...initialList]
  let drawnCount = initialDrawnCount
  let remainingCount = list.length - initialDrawnCount

  const shuffle = () => {
    drawnCount = 0
    remainingCount = list.length
    nextDatum() // calling shuffle changes the "order"
  }

  const nextDrawIndex = () =>
    drawnCount + (nextDatum() % remainingCount)

  const draw = () => {
    if (remainingCount <= shuffleOnceRemainingCountIs) {
      shuffle()
    }
    const i = nextDrawIndex()

    const drawn = list[i]
    list[i] = list[drawnCount]
    list[drawnCount] = drawn

    drawnCount++
    remainingCount--

    return drawn
  }

  return {
    __debugReadOnly: { list, drawnCount: () => drawnCount, nextDrawIndex },
    remainingCount: () => remainingCount,
    draw,
    shuffle
  }
}
