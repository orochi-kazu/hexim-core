export const region = (startingTile) => {
  const player = startingTile.player()
  const type = startingTile.type()

  const tileList = [startingTile]
  const tiles = new Map()
  tiles.set(startingTile.key, startingTile)

  const owns = tile => tiles.has(tile.key)

  const neighbourCount = tile => tile.neighbours.filter(it => owns(it)).length

  const addTileAndTurns = (tile, neighbours) => {
    tileList.push(tile)
    tiles.set(tile.key, tile)
    turns += 1 + neighbours
  }

  const add = tile => {
    if (tile.type() !== type || tile.player() !== player) {
      return false
    }
    const neighbours = neighbourCount(tile)
    if (owns(tile) || neighbours < 1) {
      return false
    }

    addTileAndTurns(tile, neighbours)
    return true
  }

  const subsumeRegion = other => {
    if (other.type !== type || other.player !== player) {
      return false
    }

    other.tiles().forEach(tile => {
      addTileAndTurns(tile, neighbourCount(tile))
    })
    return true
  }

  const findFreeNeighbors = () => {
    const s = new Set()
    tileList.forEach(it => {
      const free = it.neighbours.filter(it => it.type() === undefined)
      free.forEach(f => { s.add(f) })
    })
    return s
  }

  let turns = 1
  const turnCount = () => turns

  return Object.freeze({
    __debugReadOnly: { tiles, owns, neighbourCount, addTileAndTurns },
    player,
    type,
    add,
    subsumeRegion,
    tiles: () => [...tileList],
    turnCount,
    findFreeNeighbors
  })
}
