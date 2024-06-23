import { hexBoard, tilePolarity } from './hexBoard'

describe('hexBoard', () => {
  describe('tiles', () => {
    test.each([
      { p: tilePolarity.horizontal, w: 2, h: 16, wrapping: false },
      { p: tilePolarity.vertical, w: 8, h: 2, wrapping: false },
      { p: tilePolarity.horizontal, w: 2, h: 10, wrapping: true },
      { p: tilePolarity.vertical, w: 12, h: 2, wrapping: true }
    ])(
      'is indexable within width and height ($p $w x $h wrap=$wrapping)',
      ({ p, w, h, wrapping }) => {
        const actual = hexBoard(p, w, h, { wrapping }).tiles

        expect(actual.length).toEqual(w)
        expect(actual[0].length).toEqual(h)
        expect(actual[1].length).toEqual(h)
        expect(actual[0][0].__debugReadOnly).toEqual({ x: 0, y: 0 })
        expect(actual[w - 1][h - 1].__debugReadOnly).toEqual({ x: w - 1, y: h - 1 })
      }
    )

    it('has correct neighbour directions for horizontal polarity', () => {
      const actual = hexBoard(tilePolarity.horizontal, 2, 2, { wrapping: true })

      expect(Object.keys(actual.__debugReadOnly.dirs)).toEqual([
        'w', 'nnw', 'nne', 'e', 'sse', 'ssw'
      ])
    })

    it('has correct neighbour directions for vertical polarity', () => {
      const actual = hexBoard(tilePolarity.vertical, 2, 2, { wrapping: true })

      expect(Object.keys(actual.__debugReadOnly.dirs)).toEqual([
        'n', 'ene', 'ese', 's', 'wsw', 'wnw'
      ])
    })

    describe('without wrapping', () => {
      const wrapping = false

      describe('horizontal polarity', () => {
        const w = 8
        const h = 8
        const actual = hexBoard(tilePolarity.horizontal, w, h, { wrapping }).tiles

        test('corners have 2 or 3 neighbours', () => {
          expect(actual[0][0].neighbours.length).toEqual(2)
          expect(actual[w - 1][0].neighbours.length).toEqual(3)
          expect(actual[0][h - 1].neighbours.length).toEqual(3)
          expect(actual[w - 1][h - 1].neighbours.length).toEqual(2)
        })

        test('top & bottom sides have 4 neighbours', () => {
          expect(actual[w / 2][0].neighbours.length).toEqual(4)
          expect(actual[w / 2][h - 1].neighbours.length).toEqual(4)
        })

        test('left & right sides have 3 or 5 neighbours', () => {
          expect(actual[0][2].neighbours.length).toEqual(3)
          expect(actual[0][3].neighbours.length).toEqual(5)

          expect(actual[w - 1][5].neighbours.length).toEqual(3)
          expect(actual[w - 1][6].neighbours.length).toEqual(5)
        })

        test('central locations have 6 neighbours', () => {
          const xy = [1, 2, 3, 4, 5, 6]
          xy.forEach(x => xy.forEach(y => {
            expect(actual[x][y].neighbours.length).toEqual(6)
          }))
        })
      })

      describe('vertical polarity', () => {
        const w = 12
        const h = 12
        const actual = hexBoard(tilePolarity.vertical, w, h, { wrapping }).tiles

        test('corners have 2 or 3 neighbors', () => {
          expect(actual[0][0].neighbours.length).toEqual(2)
          expect(actual[w - 1][0].neighbours.length).toEqual(3)
          expect(actual[0][h - 1].neighbours.length).toEqual(3)
          expect(actual[w - 1][h - 1].neighbours.length).toEqual(2)
        })

        test('top & bottom sides have 3 or 5 neighbours', () => {
          expect(actual[4][0].neighbours.length).toEqual(3)
          expect(actual[5][0].neighbours.length).toEqual(5)

          expect(actual[7][h - 1].neighbours.length).toEqual(3)
          expect(actual[8][h - 1].neighbours.length).toEqual(5)
        })

        test('left & right sides have 4 neighbours', () => {
          expect(actual[0][h / 2].neighbours.length).toEqual(4)
          expect(actual[w - 1][h / 2].neighbours.length).toEqual(4)
        })
      })
    })

    describe('with wrapping', () => {
      const wrapping = true

      describe('horizontal polarity', () => {
        const p = tilePolarity.horizontal

        test('all locations have 6 neighbours', () => {
          const wh = 12
          const actual = hexBoard(p, wh, wh, { wrapping }).tiles

          const xy = [0, 1, 2, 5, 6, 9, 10, 11]
          xy.forEach(x => xy.forEach(y => {
            expect(actual[x][y].neighbours.length).toEqual(6)
          }))
        })

        it('throws if height is uneven', () => {
          const w = 8
          const h = 9
          const actual = () => hexBoard(p, w, h, { wrapping })

          expect(actual).toThrow(/height must be a multiple of 2/)
        })
      })

      describe('vertical polarity', () => {
        const p = tilePolarity.vertical

        test('all locations have 6 neighbours', () => {
          const wh = 14
          const actual = hexBoard(p, wh, wh, { wrapping }).tiles

          const xy = [0, 1, 2, 6, 7, 11, 12, 13]
          xy.forEach(x => xy.forEach(y => {
            expect(actual[x][y].neighbours.length).toEqual(6)
          }))
        })

        it('throws if width is uneven', () => {
          const w = 11
          const h = 6
          const actual = () => hexBoard(p, w, h, { wrapping })

          expect(actual).toThrow(/width must be a multiple of 2/)
        })
      })
    })
  })

  describe('tiles count', () => {
    const countTiles = tiles => tiles.reduce((acc, it) => acc + it.length, 0)

    it('is accurate when board is square', () => {
      const board = hexBoard(tilePolarity.horizontal, 8, 8, { wrapping: true })
      expect(board.tilesCount).toEqual(64)
      expect(countTiles(board.tiles)).toEqual(64)
    })

    it('is accurate when board is tall', () => {
      const board = hexBoard(tilePolarity.vertical, 4, 12, { wrapping: true })
      expect(board.tilesCount).toEqual(48)
      expect(countTiles(board.tiles)).toEqual(48)
    })

    it('is accurate when board is wide', () => {
      const board = hexBoard(tilePolarity.horizontal, 10, 6, { wrapping: true })
      expect(board.tilesCount).toEqual(60)
      expect(countTiles(board.tiles)).toEqual(60)
    })
  })

  describe('tiles matching filter condition', () => {
    it('returns nothing if no matches found', () => {
      const board = hexBoard(tilePolarity.vertical, 6, 6, {
        wrapping: true,
        tileExtrasBuilder: () => ({ match: false })
      })
      expect(board.tilesMatching(it => it.match).length).toEqual(0)
    })

    it('returns correct matches if some match', () => {
      const board = hexBoard(tilePolarity.vertical, 6, 6, {
        wrapping: true,
        tileExtrasBuilder: ({ x }) => ({ match: x % 3 === 0 })
      })
      expect(board.tilesMatching(it => it.match).length).toEqual(12)
    })

    it('returns all tiles if all match', () => {
      const board = hexBoard(tilePolarity.vertical, 6, 6, {
        wrapping: true,
        tileExtrasBuilder: () => ({ match: true })
      })
      expect(board.tilesMatching(it => it.match).length).toEqual(36)
    })
  })
})
