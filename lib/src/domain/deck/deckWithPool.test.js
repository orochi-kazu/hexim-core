import { genTree } from '../gen-tree/genTree'
import { deck } from './deck'
import { deckWithPool } from './deckWithPool'
import { drawnPool } from './drawnPool'

describe('deckWithPool', () => {
  const rand = () => genTree('deckWithPool', 'deckWithPool')

  const limit = 3
  const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const buildSubject = () => deckWithPool(
    deck(rand().nextDatum, data),
    drawnPool(limit)
  )

  it('draws to limit upon initialisation', () => {
    const subject = buildSubject()

    expect(subject.drawnPool.all().length).toEqual(limit)
    expect(subject.deck.remainingCount()).toEqual(data.length - limit)
  })

  describe('claim', () => {
    it('allows claim if present in pool', () => {
      const subject = buildSubject()
      expect(subject.drawnPool.all()).toEqual(['g', 'e', 'f'])

      const success = subject.claim('g')

      expect(success).toEqual(true)
      expect(subject.drawnPool.all().length).toEqual(limit)
    })

    it('rejects claim if pool is empty', () => {
      const subject = buildSubject()

      for (let i = 0; i < data.length; ++i) {
        expect(subject.drawnPool.all().length).toEqual(Math.min(data.length - i, limit))
        subject.claim(subject.drawnPool.all()[0])
      }

      const success = subject.claim(subject.drawnPool.all()[0])
      expect(success).toEqual(false)
      expect(subject.drawnPool.all().length).toEqual(0)
    })

    it('rejects claim if not present in pool', () => {
      const subject = buildSubject()
      expect(subject.drawnPool.all()).toEqual(['g', 'e', 'f'])

      const success = subject.claim('x')

      expect(success).toEqual(false)
      expect(subject.drawnPool.all().length).toEqual(limit)
    })
  })
})
