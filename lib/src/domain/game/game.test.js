import { buildGame } from './game'

const childLabels = (tree) => tree.children.map(it => it.label)

describe('buildGame', () => {
  describe('buildGameTree', () => {
    it('initialises base game tree', () => {
      const game = buildGame('seed00', ['human0', 'human1'], ['ai0', 'ai1'])
      const tree = game.__debugReadOnly.tree

      expect(tree.children).toHaveLength(3)
      expect(childLabels(tree))
        .toEqual(['players', 'world map', 'regions by player'])

      expect(childLabels(tree.findChild('players')))
        .toEqual(['human0', 'human1', 'ai0', 'ai1'])

      expect(childLabels(tree.findChild('world map')))
        .toEqual(['tiles'])

      expect(childLabels(tree.findChild('regions by player')))
        .toEqual(['human0', 'human1', 'ai0', 'ai1'])
    })
  })
})
