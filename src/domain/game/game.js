import { genTree } from '../gen-tree'
import { key } from './treeKeys'
import { buildWorldMap } from '../world-map'

export const buildGame = ({ seed, players, map }) => {
  const tree = buildGameTree(seed, players.human, players.ai)

  const worldMap = buildWorldMap(
    tree.findChild(key.worldMap.id).findChild(key.worldMap.tiles.id),
    players.human.length + players.ai.length,
    map.mode,
    map.size,
    { wrapping: false }
  )

  return Object.freeze({
    __debugReadOnly: { seed, tree },
    players,
    worldMap
  })
}

const buildGameTree = (seed, humanPlayerNames, aiPlayerNames) => {
  const tree = genTree(seed)
  const allPlayerNames = [...humanPlayerNames, ...aiPlayerNames]

  const randPlayers = tree.generateChild(key.players.id)
  allPlayerNames.forEach(it => {
    randPlayers.generateChild(it)
  })

  const randWorld = tree.generateChild(key.worldMap.id)
  randWorld.generateChild(key.worldMap.tiles.id)

  const randPlayerRegions = tree.generateChild(key.regions.id)
  allPlayerNames.forEach(it => {
    randPlayerRegions.generateChild(it)
  })

  return tree
}
