import { genTree } from '../gen-tree'
import { buildWorldMap } from './worldMap'
import { mapMode, mapSize } from '../game'

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
      expect(tiles.deck.remainingCount()).toEqual(100)
      expect(tiles.__debugReadOnly.tiles.length).toEqual(100)
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
      const allTiles = actual.boards.map(it => it.tiles)
      expectAllUnique(allTiles)
      expectAllUnique(allTiles.map(it => it.__debugReadOnly.randDeck.__debugReadOnly.seed))

      actual.boards.forEach(({ board, tiles }) => {
        expect(board.tilesCount).toEqual(64)
        expect(tiles.deck.remainingCount()).toEqual(64)
        expect(tiles.__debugReadOnly.tiles.length).toEqual(64)
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
      expect(tiles.deck.remainingCount()).toEqual(484)
      expect(tiles.__debugReadOnly.tiles.length).toEqual(484)
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
