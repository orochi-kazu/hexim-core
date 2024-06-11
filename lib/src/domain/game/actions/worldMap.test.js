import { tileTypes } from '../../params'
import { actionID, worldMap } from './worldMap'
import { convertToAndFromJSON } from './__test__'

describe('worldMap actions', () => {
  describe('buy world tile', () => {
    const params = { player: 'Jimothy', type: tileTypes.field }
    const actual = worldMap.buyWorldTile(params)

    it('replicates all params into the structure', () => {
      expect(actual).toEqual({
        id: actionID.buyWorldTile,
        player: 'Jimothy',
        type: tileTypes.field
      })
    })

    it('serialises to JSON consistently', () => {
      expect(convertToAndFromJSON(actual)).toEqual({
        id: 'buyWorldTile',
        player: 'Jimothy',
        type: 'field'
      })
    })
  })

  describe('place world tile', () => {
    const params = { player: 'Samanthony', type: tileTypes.city, x: 17, y: 23 }
    const actual = worldMap.placeWorldTile(params)

    it('replicates all params into the structure', () => {
      expect(actual).toEqual({
        id: actionID.placeWorldTile,
        player: 'Samanthony',
        type: tileTypes.city,
        x: 17,
        y: 23
      })
    })

    it('serialises to JSON consistently', () => {
      expect(convertToAndFromJSON(actual)).toEqual({
        id: 'placeWorldTile',
        player: 'Samanthony',
        type: 'city',
        x: 17,
        y: 23
      })
    })
  })
})
