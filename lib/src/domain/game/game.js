import { genTree } from '../gen-tree/genTree'

export const buildGame = (seed, humanPlayerNames, aiPlayerNames) => {
  const tree = buildGameTree(seed, humanPlayerNames, aiPlayerNames)

  return {
    __debugReadOnly: { seed, tree },
    humanPlayerNames,
    aiPlayerNames,
    replayMoves: (moves) => { console.log(moves) }
  }
}

const buildGameTree = (seed, humanPlayerNames, aiPlayerNames) => {
  const tree = genTree(seed)
  const allPlayerNames = [...humanPlayerNames, ...aiPlayerNames]

  const randPlayers = tree.generateChild('players')
  allPlayerNames.forEach(it => {
    randPlayers.generateChild(it)
  })

  const randWorld = tree.generateChild('world map')
  const randWorldTiles = randWorld.generateChild('tiles')
  console.log(randWorldTiles)

  const randPlayerRegions = tree.generateChild('regions by player')
  allPlayerNames.forEach(it => {
    randPlayerRegions.generateChild(it)
  })

  return tree
}
