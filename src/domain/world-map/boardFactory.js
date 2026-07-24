import { mapSize } from '../params'
import { hexBoard, tilePolarity } from '../board'

const worldPolarity = tilePolarity.horizontal

const isolatedSizes = Object.freeze({
  [mapSize.xs]: 6,
  [mapSize.s]: 8,
  [mapSize.m]: 10,
  [mapSize.l]: 12,
  [mapSize.xl]: 14
})

const tileExtrasBuilder = ({ x, y }) => {
  const key = Object.freeze({ x, y })

  let tileType
  const type = () => tileType
  const setType = t => { tileType = t }

  let tilePlayer
  const player = () => tilePlayer
  const setPlayer = p => { tilePlayer = p }

  return Object.freeze({ key, type, setType, player, setPlayer })
}

export const buildIsolatedBoard = (size, { wrapping }) => {
  const l = isolatedSizes[size]
  const { tiles, tilesCount } = hexBoard(worldPolarity, l, l, { wrapping, tileExtrasBuilder })

  return Object.freeze({
    __debugReadOnly: { l },
    tiles,
    tilesCount
  })
}

export const buildSharedBoard = (playerCount, size, { wrapping }) => {
  const isoL = isolatedSizes[size]
  const tilesTarget = isoL * isoL * playerCount
  const lTarget = Math.ceil(Math.sqrt(tilesTarget))
  const l = lTarget % 2 === 0 ? lTarget : lTarget + 1

  const { tiles, tilesCount, tilesMatching } =
    hexBoard(worldPolarity, l, l, { wrapping, tileExtrasBuilder })

  return Object.freeze({
    __debugReadOnly: { isoL, tilesTarget, lTarget, l },
    tiles,
    tilesCount,
    tilesMatching
  })
}
