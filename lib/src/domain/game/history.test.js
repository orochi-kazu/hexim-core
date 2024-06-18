import { mapMode, mapSize, tileTypes } from '../params'
import { game, worldMap } from './actions'
import { actionWithHash, deterministicActionParts } from './history'

describe('history', () => {
  describe('push', () => {
    it('', () => {})
  })

  describe('action with hash', () => {
    it('adds a hash', () => {
      const action = game.startGame({
        seed: '2024-06-16T12:36:48.012+11:00',
        players: {
          human: [
            { name: 'Trungo' },
            { name: 'Jimbob' }
          ],
          ai: [
            { name: 'Kublai', version: '2024-06-15' },
            { name: 'Amer', version: '2024-06-16' }
          ]
        },
        map: { mode: mapMode.isolated, size: mapSize.l }
      })
      const players = []

      const actual = actionWithHash(action, players)

      expect(actual.hash).toEqual('2908d0db')
    })

    it('changes hash drastically for small action differences', () => {
      const action1 = worldMap.buyWorldTile({ player: 'Bob', type: tileTypes.wilderness })
      const action2 = worldMap.buyWorldTile({ player: 'Böb', type: tileTypes.wilderness })
      const parents = []

      const actual1 = actionWithHash(action1, parents)
      const actual2 = actionWithHash(action2, parents)

      expect(actual1.hash).toEqual('f144f05d')
      expect(actual2.hash).toEqual('10e4d204')
    })

    it('changes hash drastically for small parents differences', () => {
      const action = worldMap.placeWorldTile({ player: 'Helga', type: tileTypes.city })
      const parents1 = [{ hash: '11112222' }, { hash: '33334444' }]
      const parents2 = [{ hash: '91112222' }, { hash: '33334444' }]

      const actual1 = actionWithHash(action, parents1)
      const actual2 = actionWithHash(action, parents2)

      expect(actual1.hash).toEqual('66fb69c0')
      expect(actual2.hash).toEqual('ea3543c8')
    })
  })

  describe('deterministic action parts', () => {
    it('yields startGame parts sorted by key', () => {
      const action = game.startGame({
        seed: '2024-06-12T11:32:59.123+11:00',
        players: {
          human: [
            { name: 'Steve' },
            { name: 'Fred' }
          ],
          ai: [
            { name: 'Genghis', version: '2024-06-12' },
            { name: 'Cook', version: '2024-06-13' }
          ]
        },
        map: { mode: mapMode.shared, size: mapSize.m }
      })

      const actual = deterministicActionParts(action, [])

      expect(actual).toEqual([
        ['id', 'startGame'],
        ['map', [
          ['mode', 'shared'],
          ['size', 'm']
        ]],
        ['parents', []],
        ['players', [
          ['ai', [
            { name: 'Genghis', version: '2024-06-12' },
            { name: 'Cook', version: '2024-06-13' }
          ]],
          ['human', [
            { name: 'Steve' },
            { name: 'Fred' }
          ]]
        ]],
        ['seed', '2024-06-12T11:32:59.123+11:00']
      ])
    })

    it('yields buyWorldTile parts sorted by key', () => {
      const action = worldMap.buyWorldTile({
        player: 'Steve',
        type: tileTypes.city
      })

      const actual = deterministicActionParts(action, [{ hash: 'a0b1c2d' }])

      expect(actual).toEqual([
        ['id', 'buyWorldTile'],
        ['parents', ['a0b1c2d']],
        ['player', 'Steve'],
        ['type', 'city']
      ])
    })

    it('yields placeWorldTile parts sorted by key', () => {
      const action = worldMap.placeWorldTile({
        player: 'Steve',
        x: 9,
        y: 8,
        type: tileTypes.field
      })

      const actual = deterministicActionParts(action, [{ hash: '987fde6' }])

      expect(actual).toEqual([
        ['id', 'placeWorldTile'],
        ['parents', ['987fde6']],
        ['player', 'Steve'],
        ['type', 'field'],
        ['x', 9],
        ['y', 8]
      ])
    })
  })
})
