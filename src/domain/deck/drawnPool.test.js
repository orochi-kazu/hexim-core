import { tileTypes } from '../params'
import { drawnPool } from './drawnPool'

describe('drawnPool', () => {
  describe('canAdd', () => {
    it('is true if limit is undefined', () => {
      const subject = drawnPool()
      expect(subject.canAdd()).toEqual(true)
    })

    it('is true if count is under limit', () => {
      const subject = drawnPool(5)
      expect(subject.canAdd()).toEqual(true)
    })

    it('is false if count is at limit', () => {
      const subject = drawnPool(0)
      expect(subject.canAdd()).toEqual(false)
    })
  })

  describe('add', () => {
    it('accepts additions when limit is undefined', () => {
      const subject = drawnPool()
      expect(subject.all().length).toEqual(0)

      for (let i = 0; i < 400; ++i) {
        const type = [
          tileTypes.wilderness,
          tileTypes.city,
          tileTypes.field
        ][i % 3]
        const datum = { type, i }
        const success = subject.add(datum)

        expect(success).toEqual(true)
        const all = subject.all()
        const count = all.length
        expect(count).toEqual(i + 1)
        expect(all[count - 1]).toEqual(datum)
      }
    })

    it('accepts additions when count is under limit', () => {
      const subject = drawnPool(3)

      for (let i = 0; i < 3; ++i) {
        const success = subject.add({ type: tileTypes.city })
        expect(success).toEqual(true)
      }
      expect(subject.all().length).toEqual(3)
    })

    it('rejects additions when count is at limit', () => {
      const subject = drawnPool(5)

      for (let i = 0; i < 5; ++i) {
        const success = subject.add({ type: tileTypes.field })
        expect(success).toEqual(true)
      }
      expect(subject.all().length).toEqual(5)

      const success = subject.add({ type: tileTypes.wilderness })
      expect(success).toEqual(false)
      expect(subject.all().length).toEqual(5)
    })
  })

  describe('claim', () => {
    it('allows claim if present in pool', () => {
      const subject = drawnPool()
      const datum = { type: tileTypes.field }
      subject.add(datum)
      expect(subject.all().length).toEqual(1)

      const success = subject.claim(datum)

      expect(success).toEqual(true)
      expect(subject.all().length).toEqual(0)
    })

    it('rejects claim if pool is empty', () => {
      const subject = drawnPool()

      const success = subject.claim({ type: tileTypes.city })

      expect(success).toEqual(false)
      expect(subject.all().length).toEqual(0)
    })

    it('rejects claim if not present in pool', () => {
      const subject = drawnPool()
      subject.add({ type: tileTypes.wilderness })
      expect(subject.all().length).toEqual(1)

      const success = subject.claim({ type: tileTypes.field })

      expect(success).toEqual(false)
      expect(subject.all().length).toEqual(1)
    })
  })

  describe('all', () => {
    it('returns a copy, which does not affect the original', () => {
      const subject = drawnPool()
      const datum = { type: tileTypes.field }
      subject.add(datum)
      expect(subject.all().length).toEqual(1)

      const all = subject.all()

      all.push(datum)

      expect(all.length).toEqual(2)
      expect(subject.all().length).toEqual(1)
    })
  })
})
