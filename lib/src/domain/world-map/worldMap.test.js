import { genTree } from '../gen-tree'
import { buildWorldMap } from './worldMap'
import { mapMode, mapSize } from '../params'

describe('worldMap', () => {
  const randTiles = genTree('randTiles', 'randTiles')
  describe('buildWorldMap', () => {
    test.each([
      { mode: mapMode.isolated, wrapping: true },
      { mode: mapMode.shared, wrapping: true },
      { mode: mapMode.isolated, wrapping: false },
      { mode: mapMode.shared, wrapping: false }
    ])('yields a single map for a single player', ({ mode, wrapping }) => {
      const actual = buildWorldMap(
        randTiles,
        1,
        mode,
        mapSize.m,
        { wrapping }
      )

      expect(actual.boards.length).toEqual(1)
      const { board, tiles } = actual.boards[0]

      expect(board.tilesCount).toEqual(100)
      expect(tiles.drawnPool.all().length).toEqual(2)
      expect(tiles.deck.remainingCount()).toEqual(98)
    })

    it('gives each isolated player a unique board & deck of tiles', () => {
      const players = 5
      const actual = buildWorldMap(
        randTiles,
        players,
        mapMode.isolated,
        mapSize.s,
        { wrapping: false }
      )

      expect(actual.boards.length).toEqual(players)
      expectAllUnique(actual.boards)
      expectAllUnique(actual.boards.map(it => it.board))
      const allTiles = actual.boards.map(it => it.tiles.deck)
      expectAllUnique(allTiles)

      actual.boards.forEach(({ board, tiles }) => {
        expect(board.tilesCount).toEqual(64)
        expect(tiles.drawnPool.all().length).toEqual(2)
        expect(tiles.deck.remainingCount()).toEqual(62)
      })
    })

    it('gives all shared players a single board & tiles to share', () => {
      const players = 3
      const actual = buildWorldMap(
        randTiles,
        players,
        mapMode.shared,
        mapSize.l,
        { wrapping: true }
      )

      expect(actual.boards.length).toEqual(1)
      const { board, tiles } = actual.boards[0]

      expect(board.tilesCount).toEqual(484)
      expect(tiles.drawnPool.all().length).toEqual(4)
      expect(tiles.deck.remainingCount()).toEqual(480)
    })

    it('throws if mode is invalid', () => {
      expect(() => {
        buildWorldMap(
          randTiles,
          3,
          'unexpected mode',
          mapSize.xl,
          { wrapping: false }
        )
      }).toThrow(/Failed to initialise/)
    })
  })
})

const expectAllUnique = (list) => {
  list.forEach(i => {
    expect(list.filter(it => it === i).length).toEqual(1)
  })
}
