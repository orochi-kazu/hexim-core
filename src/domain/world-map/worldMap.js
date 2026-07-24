import { deckWithPool, drawnPool } from '../deck'
import { mapMode } from '../params'
import { buildIsolatedBoard, buildSharedBoard } from './boardFactory'
import { buildTilesDeck } from './tilesDeckFactory'

export const buildWorldMap = (randTiles, playerCount, mode, size, { wrapping }) => {
  const boardsWithoutTiles = buildBoards(playerCount, mode, size, { wrapping })
  const tilePoolSize = tilePoolSizeFor(playerCount, mode)
  const boards = buildTileDecksForBoards(boardsWithoutTiles, randTiles, tilesLabeller(mode), tilePoolSize)
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

const tilePoolSizeFor = (playerCount, mode) => {
  const playersPerBoard = {
    [mapMode.shared]: playerCount,
    [mapMode.isolated]: 1
  }[mode]

  if (playersPerBoard === undefined) {
    logAndThrow('Failed to calculate player count per board', { mode })
  }
  return playersPerBoard + 1
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

const buildTileDecksForBoards = (boards, randTiles, labelForI, tilePoolSize) =>
  boards.map((board, i) => {
    const { deck } = buildTilesDeck(randTiles, labelForI(i), board.tilesCount)
    const pool = drawnPool(tilePoolSize)

    return {
      board,
      tiles: deckWithPool(deck, pool)
    }
  })

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
