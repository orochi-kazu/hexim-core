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

export const buildIsolatedBoard = (size, { wrapping }) => {
  const l = isolatedSizes[size]
  const { board } = hexBoard(worldPolarity, l, l, { wrapping })

  return Object.freeze({
    __debugReadOnly: { l },
    board,
    tilesCount: l * l
  })
}

export const buildSharedBoard = (playerCount, size, { wrapping }) => {
  const isoL = isolatedSizes[size]
  const tilesTarget = isoL * isoL * playerCount
  const lTarget = Math.ceil(Math.sqrt(tilesTarget))
  const l = lTarget % 2 === 0 ? lTarget : lTarget + 1

  const { board } = hexBoard(worldPolarity, l, l, { wrapping })

  return Object.freeze({
    __debugReadOnly: { isoL, tilesTarget, lTarget, l },
    board,
    tilesCount: l * l
  })
}
