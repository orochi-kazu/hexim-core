import { genTree } from './genTree'

describe('genTree', () => {
  describe('generateChild', () => {
    it('adds children deterministically', () => {
      const tree = genTree('seed0', 'label0')

      tree.generateChild('child0')

      expect(tree.children).toHaveLength(1)
      expect(tree.children[0].__debugReadOnly.seed).toEqual(3345432423)

      tree.generateChild('child1')

      expect(tree.children).toHaveLength(2)
      expect(tree.children[1].__debugReadOnly.seed).toEqual(2771409906)
    })
  })

  describe('generateDatum', () => {
    it('adds data deterministically', () => {
      const tree = genTree('seed0', 'label0')

      tree.generateDatum('datum0')

      expect(tree.data).toHaveLength(1)
      expect(tree.data[0].value).toEqual(3605112092)

      tree.generateDatum('datum1')

      expect(tree.data).toHaveLength(2)
      expect(tree.data[1].value).toEqual(2529661778)
    })
  })
})
