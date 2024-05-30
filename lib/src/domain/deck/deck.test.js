import { deck } from './deck'

describe('deck', () => {
  const initialDeck10 = 'abcdefghij'
  const initialDeck13 = 'abcdefghijklm'

  describe('initial state', () => {
    test.each([
      { list: initialDeck10, count: 10 },
      { list: initialDeck13, count: 13 }
    ])(
      'has matching drawn and remaining counts [$count, default]',
      ({ list, count }) => {
        const next = jest.fn()
        const d = deck(next, list)

        expect(d.__debugReadOnly.list).toHaveLength(count)
        expect(d.__debugReadOnly.drawnCount()).toEqual(0)
        expect(d.remainingCount()).toEqual(count)
      }
    )

    test.each([
      { list: initialDeck10, count: 10, drawn: 2, rem: 8 },
      { list: initialDeck13, count: 13, drawn: 10, rem: 3 },
      { list: initialDeck10, count: 10, drawn: 9, rem: 1 },
      { list: initialDeck13, count: 13, drawn: 13, rem: 0 }
    ])(
      'has matching drawn and remaining counts [$count, $drawn, $rem]',
      ({ list, count, drawn, rem }) => {
        const next = jest.fn()
        const d = deck(next, list, { initialDrawnCount: drawn })

        expect(d.__debugReadOnly.list).toHaveLength(count)
        expect(d.__debugReadOnly.drawnCount()).toEqual(drawn)
        expect(d.remainingCount()).toEqual(rem)
      }
    )
  })

  describe('shuffle', () => {
    it('always progresses through the rng', () => {
      const next = jest.fn()
      const d = deck(next, initialDeck13)

      const shuffleCount = 5
      for (let i = 1; i <= shuffleCount; i++) {
        d.shuffle()
        expect(next).toHaveBeenCalledTimes(i)
      }
    })

    it('puts the entire deck back in scope for drawing', () => {
      const next = jest.fn()
      const d = deck(next, initialDeck13, { initialDrawnCount: 10 })
      expect(d.__debugReadOnly.drawnCount()).toEqual(10)
      expect(d.remainingCount()).toEqual(3)

      d.shuffle()
      expect(d.__debugReadOnly.drawnCount()).toEqual(0)
      expect(d.remainingCount()).toEqual(13)

      d.draw()
      d.draw()
      expect(d.__debugReadOnly.drawnCount()).toEqual(2)
      expect(d.remainingCount()).toEqual(11)

      d.shuffle()
      expect(d.__debugReadOnly.drawnCount()).toEqual(0)
      expect(d.remainingCount()).toEqual(13)
    })
  })

  describe('draw', () => {
    it('decreases remaining count', () => {
      const next = jest.fn(() => 0)
      const d = deck(next, initialDeck10)

      const drawnA = d.draw()

      expect(drawnA).toEqual('a')
      expect(d.remainingCount()).toEqual(9)

      const drawnB = d.draw()

      expect(drawnB).toEqual('b')
      expect(d.remainingCount()).toEqual(8)
    })

    it('increases drawn count', () => {
      const next = jest.fn()
      const d = deck(next, initialDeck10)

      next.mockReturnValue(d.remainingCount() - 1 + initialDeck10.length)
      const drawnJ = d.draw()

      expect(drawnJ).toEqual('j')
      expect(d.__debugReadOnly.drawnCount()).toEqual(1)

      next.mockReturnValue(d.remainingCount() - 1)
      const drawnA = d.draw()

      expect(drawnA).toEqual('a')
      expect(d.__debugReadOnly.drawnCount()).toEqual(2)
    })

    it('shuffles if remaining count gets too low', () => {
      const next = jest.fn(() => 0)
      const d = deck(next, initialDeck10, { initialDrawnCount: 4, shuffleOnceRemainingCountIs: 4 })

      d.draw()
      d.draw()

      expect(d.__debugReadOnly.drawnCount()).toEqual(6)
      expect(d.remainingCount()).toEqual(4)

      d.draw()

      expect(d.__debugReadOnly.drawnCount()).toEqual(1)
      expect(d.remainingCount()).toEqual(9)
    })

    it('shuffles every draw if limit is too high', () => {
      const next = jest.fn(() => 0)
      const d = deck(next, initialDeck13, { shuffleOnceRemainingCountIs: 20 })

      for (let i = 0; i < 4; i++) {
        d.draw()
        expect(d.__debugReadOnly.drawnCount()).toEqual(1)
        expect(d.remainingCount()).toEqual(12)
      }
    })

    it('draws every item before shuffling if limit is 0', () => {
      const next = jest.fn(() => 0)
      const d = deck(next, initialDeck10)

      const drawn = []
      for (let i = 1; i <= initialDeck10.length; i++) {
        drawn.push(d.draw())
        expect(d.__debugReadOnly.drawnCount()).toEqual(i)
        expect(d.remainingCount()).toEqual(initialDeck10.length - i)
      }

      expect(drawn.join('')).toEqual(initialDeck10)

      d.draw()
      expect(d.__debugReadOnly.drawnCount()).toEqual(1)
      expect(d.remainingCount()).toEqual(9)
    })
  })
})
