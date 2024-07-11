export const deckWithPool = (deck, drawnPool) => {
  const drawToLimit = () => {
    while (drawnPool.canAdd() && deck.remainingCount() > 0) {
      drawnPool.add(deck.draw())
    }
  }

  const claim = datum => {
    const success = drawnPool.claim(datum)
    if (success) {
      drawToLimit()
    }
    return success
  }

  drawToLimit()

  return Object.freeze({
    __debugReadOnly: { drawToLimit },
    deck,
    drawnPool,
    claim
  })
}
