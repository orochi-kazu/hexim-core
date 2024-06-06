import { mapMode } from '../game'
import { buildIsolatedBoard, buildSharedBoard } from './boardFactory'
import { buildTilesDeck } from './tilesDeckFactory'

export const buildWorldMap = (randTiles, playerCount, mode, size, { wrapping }) => {
  const boardsWithoutTiles = buildBoards(playerCount, mode, size, { wrapping })
  const boards = buildTileDecksForBoards(boardsWithoutTiles, randTiles, tilesLabeller(mode))
  return Object.freeze({ boards })
}

const buildBoards = (playerCount, mode, size, { wrapping }) => {
  const builder = {
    [mapMode.shared]: buildSharedBoards,
    [mapMode.isolated]: buildIsolatedBoards
  }[mode] ?? (() => [])

  const boards = builder(playerCount, size, { wrapping })

  if (!boards || boards.length <= 0) {
    logAndThrow('Failed to initialise boards for config', { playerCount, mode, size })
  }
  return boards
}

const tilesLabeller = (mode) => {
  const labeller = {
    [mapMode.shared]: () => 'shared tiles',
    [mapMode.isolated]: (i) => `isolated tiles ${i}`
  }[mode]

  if (!labeller) {
    logAndThrow('Failed to intuit labeller', { mode })
  }
  return labeller
}

const buildTileDecksForBoards = (boards, randTiles, labelForI) =>
  boards.map((board, i) => ({
    board,
    tiles: buildTilesDeck(randTiles, labelForI(i), board.tilesCount)
  }))

const buildSharedBoards = (playerCount, size, { wrapping }) =>
  [buildSharedBoard(playerCount, size, { wrapping })]

const buildIsolatedBoards = (playerCount, size, { wrapping }) =>
  Array(playerCount).keys().map(_ =>
    buildIsolatedBoard(size, { wrapping })
  ).toArray()

const logAndThrow = (message, params) => {
  console.error(message, params)
  throw Error(`${message} ${params}`)
}
