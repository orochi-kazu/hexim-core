export const actionID = Object.freeze({
  startGame: Symbol('startGame')
})

const startGame = ({
  seed,
  players: { human, ai },
  map: { mode, size }
}) => Object.freeze({
  id: actionID.startGame,
  seed,
  players: { human: [...human], ai: [...ai] },
  map: { mode, size }
})

export const game = Object.freeze({
  startGame
})
