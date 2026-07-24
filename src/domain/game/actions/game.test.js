import { mapMode, mapSize } from '../../params'
import { actionID, game } from './game'
import { convertToAndFromJSON } from './__test__'

describe('game actions', () => {
  describe('start game', () => {
    const seed = '2024-06-09T23:43:08.789+11:00'
    const actual = game.startGame({
      seed,
      players: { human: ['Fred', 'Steve'], ai: ['Columbus'] },
      map: { mode: mapMode.shared, size: mapSize.m }
    })

    it('replicates all params into the structure', () => {
      expect(actual).toEqual({
        id: actionID.startGame,
        seed,
        players: { human: ['Fred', 'Steve'], ai: ['Columbus'] },
        map: { mode: mapMode.shared, size: mapSize.m }
      })
    })

    it('serialises to JSON consistently', () => {
      expect(convertToAndFromJSON(actual)).toEqual({
        id: 'startGame',
        seed,
        players: { human: ['Fred', 'Steve'], ai: ['Columbus'] },
        map: { mode: 'shared', size: 'm' }
      })
    })
  })
})
