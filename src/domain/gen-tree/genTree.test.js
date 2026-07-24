import { genTree } from './genTree'

describe('genTree', () => {
  describe('generateChild', () => {
    it('adds children deterministically', () => {
      const tree = genTree('seed0', 'label0')

      const child0 = tree.generateChild('child0')

      expect(tree.children).toHaveLength(1)
      expect(tree.children[0]).toBe(child0)
      expect(child0.label).toEqual('child0')
      expect(child0.__debugReadOnly.seed).toEqual(3345432423)

      const child1 = tree.generateChild('child1')

      expect(tree.children).toHaveLength(2)
      expect(tree.children[1]).toBe(child1)
      expect(child1.label).toEqual('child1')
      expect(child1.__debugReadOnly.seed).toEqual(2771409906)
    })
  })

  describe('nextDatum', () => {
    it('adds data deterministically', () => {
      const tree = genTree('seed0', 'label0')

      const value0 = tree.nextDatum('value0')

      expect(tree.__debugReadOnly.dataHistory).toHaveLength(1)
      expect(tree.__debugReadOnly.dataHistory[0]).toBe(value0)
      expect(value0).toEqual(3605112092)

      const value1 = tree.nextDatum('value1')

      expect(tree.__debugReadOnly.dataHistory).toHaveLength(2)
      expect(tree.__debugReadOnly.dataHistory[1]).toBe(value1)
      expect(value1).toEqual(2529661778)
    })
  })
})
