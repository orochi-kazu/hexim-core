import { region } from './region'

export const regionRepo = (player, board) => {
  const regions = []

  const allRegions = () => [...regions]
  const regionsByType = type => regions.filter(it => it.type === type)

  const claimableSpots = () => {
    const free = freeNeighboursFor(allRegions())
    if (free.size > 0) {
      return setToList(free)
    }
    return board.tilesMatching(it => it.type() === undefined)
  }

  const claimableSpotsToGrow = type => setToList(
    freeNeighboursFor(regionsByType(type))
  )

  const freeNeighboursFor = candidateRegions => {
    const spotSet = new Set()
    candidateRegions.forEach(r => {
      r.findFreeNeighbors().forEach(n => { spotSet.add(n) })
    })
    return spotSet
  }

  const canClaimSpot = (type, { x, y }) => {
    if (type === undefined) {
      return false
    }
    const tile = board.tiles[x][y]
    const growAvailable = claimableSpotsToGrow(type)
    if (growAvailable.includes(tile)) {
      return true
    }

    if (claimableSpots(type).includes(tile)) {
      return true
    }

    return false
  }

  const regionsNeighouring = (tile, type) =>
    regionsByType(type).filter(r => r.findFreeNeighbors().has(tile))

  const claimSpot = (type, { x, y }) => {
    if (!canClaimSpot(type, { x, y })) {
      logAndThrow('Cannot claim an unavailable spot', { type, x, y })
    }

    const tile = board.tiles[x][y]
    const neighbourRegions = regionsNeighouring(tile, type)
    tile.setPlayer(player)
    tile.setType(type)

    if (neighbourRegions.length === 0) {
      regions.push(region(tile))
    } else {
      neighbourRegions[0].add(tile)
      // if (neighbourRegions.length > 1) {
      //   mergeRegions(neighbourRegions)
      // }
    }

    return tile
  }

  // const mergeRegions = () => {}

  return Object.freeze({
    __debugReadOnly: { board, regions, freeNeighboursFor, regionsNeighouring, canClaimSpot },
    player,
    allRegions,
    regionsByType,
    claimableSpots,
    claimableSpotsToGrow,
    claimSpot
  })
}

const setToList = set => {
  const list = []
  for (const s of set) {
    list.push(s)
  }
  return list
}

const logAndThrow = (message, params) => {
  console.error(message, params)
  throw Error(`${message} ${params}`)
}
