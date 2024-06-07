import { tileTypes } from '../params'
import { genTree } from '../gen-tree'
import { buildTilesDeck } from './tilesDeckFactory'

const countByType = (deck, type) => deck.__debugReadOnly.tiles
  .filter(it => it === type).length

describe('tilesDeckFactory', () => {
  describe('buildSharedTilesDeck', () => {
    it('gets small perfect distributions right', () => {
      const actual = buildTilesDeck(genTree('tiles', 'tiles'), 'deck', 5)

      expect(countByType(actual, tileTypes.field)).toEqual(2)
      expect(countByType(actual, tileTypes.wilderness)).toEqual(2)
      expect(countByType(actual, tileTypes.city)).toEqual(1)
    })

    it('gets large perfect distributions right', () => {
      const actual = buildTilesDeck(genTree('tiles', 'tiles'), 'deck', 500)

      expect(countByType(actual, tileTypes.field)).toEqual(200)
      expect(countByType(actual, tileTypes.wilderness)).toEqual(200)
      expect(countByType(actual, tileTypes.city)).toEqual(100)
    })

    it('gets small imperfect (r-up) distributions right', () => {
      const actual = buildTilesDeck(genTree('tiles', 'tiles'), 'deck', 9)

      expect(countByType(actual, tileTypes.field)).toEqual(4)
      expect(countByType(actual, tileTypes.wilderness)).toEqual(4)
      expect(countByType(actual, tileTypes.city)).toEqual(1)
    })

    it('gets small imperfect (r-down) distributions right', () => {
      const actual = buildTilesDeck(genTree('tiles', 'tiles'), 'deck', 16)

      expect(countByType(actual, tileTypes.field)).toEqual(6)
      expect(countByType(actual, tileTypes.wilderness)).toEqual(6)
      expect(countByType(actual, tileTypes.city)).toEqual(4)
    })

    it.only('gets large imperfect (r-up) distributions right', () => {
      const actual = buildTilesDeck(genTree('tiles', 'tiles'), 'deck', 104)

      expect(countByType(actual, tileTypes.field)).toEqual(42)
      expect(countByType(actual, tileTypes.wilderness)).toEqual(42)
      expect(countByType(actual, tileTypes.city)).toEqual(20)
    })

    it('gets large imperfect (r-down) distributions right', () => {
      const actual = buildTilesDeck(genTree('tiles', 'tiles'), 'deck', 91)

      expect(countByType(actual, tileTypes.field)).toEqual(36)
      expect(countByType(actual, tileTypes.wilderness)).toEqual(36)
      expect(countByType(actual, tileTypes.city)).toEqual(19)
    })
  })
})
