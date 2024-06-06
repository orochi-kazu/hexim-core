import { mapSize } from '../game'
import { buildSharedBoard, buildIsolatedBoard } from './boardFactory'

describe('boardFactory', () => {
  describe('buildIsolatedBoard', () => {
    test.each([
      { size: mapSize.xs, l: 6, tiles: 36 },
      { size: mapSize.m, l: 10, tiles: 100 },
      { size: mapSize.xl, l: 14, tiles: 196 }
    ])(
      'builds board with traceable size ($size)',
      ({ size, l, tiles }) => {
        const actual = buildIsolatedBoard(size, { wrapping: false })

        expect(actual.__debugReadOnly.l).toEqual(l)
        expect(actual.tilesCount).toEqual(tiles)
      }
    )
  })

  describe('shared and isolated boards are equivalent for 1 player', () => {
    test.each([
      { size: mapSize.xs, l: 6, tiles: 36 },
      { size: mapSize.m, l: 10, tiles: 100 },
      { size: mapSize.xl, l: 14, tiles: 196 }
    ])(
      'builds board with traceable size ($size)',
      ({ size, l, tiles }) => {
        const actual = buildSharedBoard(1, size, { wrapping: false })

        expect(actual.__debugReadOnly.l).toEqual(l)
        expect(actual.tilesCount).toEqual(tiles)
      }
    )
  })

  describe('buildSharedBoard', () => {
    test.each([
      { players: 5, size: mapSize.xs, isoL: 6, tilesTarget: 180, lTarget: 14, l: 14, tiles: 196 },
      { players: 4, size: mapSize.m, isoL: 10, tilesTarget: 400, lTarget: 20, l: 20, tiles: 400 },
      { players: 3, size: mapSize.xl, isoL: 14, tilesTarget: 588, lTarget: 25, l: 26, tiles: 676 }
    ])(
      'builds board with traceable size ($size)',
      ({ players, size, isoL, tilesTarget, lTarget, l, tiles }) => {
        const actual = buildSharedBoard(players, size, { wrapping: false })

        expect(actual.__debugReadOnly).toEqual({ isoL, tilesTarget, lTarget, l })
        expect(actual.tilesCount).toEqual(tiles)
      }
    )
  })
})
