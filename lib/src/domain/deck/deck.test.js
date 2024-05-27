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
        expect(d.__debugReadOnly.drawnCount).toEqual(0)
        expect(d.remainingCount).toEqual(count)
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
        const d = deck(next, list, drawn)

        expect(d.__debugReadOnly.list).toHaveLength(count)
        expect(d.__debugReadOnly.drawnCount).toEqual(drawn ?? 0)
        expect(d.remainingCount).toEqual(rem ?? count)
      }
    )
  })

  test.todo('shuffle')

  test.todo('draw')
})
