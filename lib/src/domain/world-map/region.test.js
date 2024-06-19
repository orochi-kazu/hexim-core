import { mapSize, tileTypes } from '../params'
import { buildSharedBoard } from './boardFactory'
import { region } from './region'

describe('region', () => {
  const thisPlayer = Object.freeze({ name: 'Me' })
  const anotherPlayer = Object.freeze({ name: 'Someone else' })

  const buildBoard = () => buildSharedBoard(2, mapSize.xs, { wrapping: false }).board
  const prepTileForAdd = ({ board, x, y, type, player = thisPlayer }) => {
    const tile = board[x][y]
    tile.setType(type)
    tile.setPlayer(player)
    return tile
  }
  const initWithTile = ({ x, y, type }) => {
    const board = buildBoard()
    const startingTile = prepTileForAdd({ board, x, y, type })
    const r = region(startingTile)

    return { board, startingTile, r }
  }

  describe('initial state', () => {
    const region = initWithTile({ x: 3, y: 3, type: tileTypes.field }).r

    it('has a single tile', () => {
      expect(region.__debugReadOnly.tiles.size).toEqual(1)
      expect(region.tiles().length).toEqual(1)
    })

    it('has the original tile type', () => {
      expect(region.type).toEqual(tileTypes.field)
    })

    it('has the original player', () => {
      expect(region.player).toEqual(thisPlayer)
      expect(region.player).not.toEqual(anotherPlayer)
    })

    it('has a single turn', () => {
      expect(region.turnCount()).toEqual(1)
    })
  })

  describe('add', () => {
    const type = tileTypes.city

    it("aborts if the tile's type doesn't match the region's", () => {
      const { board, r } = initWithTile({ x: 4, y: 5, type })
      const addTile = prepTileForAdd({ board, x: 3, y: 5, type: tileTypes.wilderness })

      const added = r.add(addTile)
      expect(added).toEqual(false)
    })

    it("aborts if the tile's player doesn't match the region's", () => {
      const { board, r } = initWithTile({ x: 5, y: 4, type })
      const addTile = prepTileForAdd({ board, x: 6, y: 4, type, player: anotherPlayer })

      const added = r.add(addTile)
      expect(added).toEqual(false)
    })

    it('aborts if the tile is already owned by the region', () => {
      const { startingTile, r } = initWithTile({ x: 2, y: 3, type })

      const added = r.add(startingTile)
      expect(added).toEqual(false)
    })

    it("aborts if the tile doesn't touch the region", () => {
      const { board, r } = initWithTile({ x: 2, y: 2, type })
      const addTile = prepTileForAdd({ board, x: 6, y: 6, type })

      const added = r.add(addTile)
      expect(added).toEqual(false)
    })

    it('adds the tile when possible, updates turn count', () => {
      const { board, r } = initWithTile({ x: 4, y: 4, type })
      const addTile = prepTileForAdd({ board, x: 3, y: 4, type })

      const added = r.add(addTile)
      expect(added).toEqual(true)
      expect(r.turnCount()).toEqual(3)
    })
  })

  describe('tiles', () => {
    const type = tileTypes.wilderness

    it('keeps track of tiles as the region grows', () => {
      const { board, r } = initWithTile({ x: 1, y: 1, type })

      const additions = [
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 3, y: 4 },
        { x: 4, y: 4 }
      ]

      additions.forEach(({ x, y }, i) => {
        const addTile = prepTileForAdd({ board, x, y, type })
        const added = r.add(addTile)

        expect(added).toEqual(true)
        expect(r.tiles().length).toEqual(i + 2)
      })
    })
  })

  describe('turn count', () => {
    const type = tileTypes.city

    it('adds turns as the region grows', () => {
      const { board, r } = initWithTile({ x: 1, y: 1, type })

      const additions = [
        { x: 2, y: 1, t: 3 },
        { x: 3, y: 1, t: 5 },
        { x: 4, y: 1, t: 7 },
        { x: 1, y: 2, t: 9 },
        { x: 2, y: 2, t: 13 },
        { x: 3, y: 2, t: 17 },
        { x: 4, y: 2, t: 21 },
        { x: 1, y: 3, t: 24 },
        { x: 2, y: 3, t: 28 },
        { x: 3, y: 3, t: 32 },
        { x: 4, y: 3, t: 35 },
        { x: 1, y: 4, t: 37 },
        { x: 2, y: 4, t: 41 },
        { x: 3, y: 4, t: 45 },
        { x: 4, y: 4, t: 49 }
      ]

      additions.forEach(({ x, y, t }) => {
        const addTile = prepTileForAdd({ board, x, y, type })
        const added = r.add(addTile)

        expect(added).toEqual(true)
        expect(r.turnCount()).toEqual(t)
      })
    })
  })
})
