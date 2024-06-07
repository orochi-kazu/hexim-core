import { mapMode, mapSize } from '../params'
import { buildGame } from './game'
import { key } from './treeKeys'

const childLabels = (tree) => tree.children.map(it => it.label)

describe('buildGame', () => {
  describe('buildGameTree', () => {
    it('initialises base game tree (isolated boards)', () => {
      const game = buildGame({
        seed: 'seed00',
        players: { human: ['human0', 'human1'], ai: ['ai0', 'ai1'] },
        map: { mode: mapMode.isolated, size: mapSize.xs }
      })

      const { players, worldMap, __debugReadOnly: { tree } } = game

      expect(players.human).toEqual(['human0', 'human1'])
      expect(players.ai).toEqual(['ai0', 'ai1'])

      expect(worldMap.boards.length).toEqual(4)

      expect(tree.children).toHaveLength(3)
      expect(childLabels(tree))
        .toEqual([key.players.id, key.worldMap.id, key.regions.id])

      expect(childLabels(tree.findChild(key.players.id)))
        .toEqual(['human0', 'human1', 'ai0', 'ai1'])

      const randMap = tree.findChild(key.worldMap.id)
      expect(childLabels(randMap)).toEqual([key.worldMap.tiles.id])
      const randTiles = randMap.findChild(key.worldMap.tiles.id)
      expect(childLabels(randTiles))
        .toEqual([0, 1, 2, 3].map(it => `isolated tiles ${it}`))

      expect(childLabels(tree.findChild(key.regions.id)))
        .toEqual(['human0', 'human1', 'ai0', 'ai1'])
    })
  })
})
