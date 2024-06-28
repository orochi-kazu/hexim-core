import { mapSize, tileTypes } from '../params'
import { buildSharedBoard } from './boardFactory'
import { regionRepo } from './regionRepo'

const { field, wilderness, city } = tileTypes

describe('region repo', () => {
  const player1 = { name: 'Steve' }
  const player2 = { name: 'Dave' }

  const buildSubject = (playerCount = 2, size = mapSize.m) => {
    const board = buildSharedBoard(playerCount, size, { wrapping: true })
    const repo = regionRepo(player1, board)
    const repo2 = regionRepo(player2, board)
    return { board, repo, repo2 }
  }

  describe('claim spot', () => {
    it('claims available spots', () => {
      const { repo, repo2 } = buildSubject()

      const tile1 = repo.claimSpot(wilderness, { x: 3, y: 9 })
      const tile2 = repo2.claimSpot(field, { x: 8, y: 4 })

      expect(tile1.type()).toEqual(wilderness)
      expect(tile1.player()).toEqual(player1)
      expect(tile2.type()).toEqual(field)
      expect(tile2.player()).toEqual(player2)
    })

    it("cannot claim spots if type isn't specified", () => {
      const { repo } = buildSubject()

      expect(() => { repo.claimSpot(undefined, { x: 0, y: 0 }) })
        .toThrow(/Cannot claim/)
    })

    it('cannot claim unavailable spots', () => {
      const { repo, repo2 } = buildSubject()
      repo.claimSpot(wilderness, { x: 3, y: 9 })

      expect(() => { repo2.claimSpot(field, { x: 3, y: 9 }) })
        .toThrow(/Cannot claim/)
    })

    it('cannot claim non-adjacent spots', () => {
      const { repo } = buildSubject()
      repo.claimSpot(wilderness, { x: 3, y: 9 })

      expect(() => { repo.claimSpot(wilderness, { x: 6, y: 10 }) })
        .toThrow(/Cannot claim/)
    })

    it('grows existing regions', () => {
      const { repo } = buildSubject()
      expect(repo.allRegions().length).toEqual(0)

      const claims = [
        { type: wilderness, x: 3, y: 9, r: 1 },
        { type: wilderness, x: 4, y: 9, r: 1 },
        { type: city, x: 3, y: 10, r: 2 },
        { type: wilderness, x: 4, y: 10, r: 2 },
        { type: wilderness, x: 5, y: 9, r: 2 }
      ]
      claims.forEach(({ type, x, y, r }) => {
        repo.claimSpot(type, { x, y })
        expect(repo.allRegions().length).toEqual(r)
      })

      expect(repo.allRegions().map(it => it.type)).toEqual([wilderness, city])
    })

    it('merges 2 regions', () => {
      const { repo } = buildSubject()
      expect(repo.allRegions().length).toEqual(0)

      const claims = [
        { type: field, x: 1, y: 2 },
        { type: field, x: 2, y: 2 },
        { type: field, x: 1, y: 1 },
        { type: city, x: 2, y: 1 },
        { type: field, x: 3, y: 1 },
        { type: field, x: 4, y: 1 }
      ]
      claims.forEach(({ type, x, y }) => {
        repo.claimSpot(type, { x, y })
      })
      expect(repo.allRegions().length).toEqual(3)
      expect(repo.allRegions().map(it => it.type)).toEqual([field, city, field])

      repo.claimSpot(field, { x: 3, y: 2 })

      expect(repo.allRegions().length).toEqual(2)
      expect(repo.allRegions().map(it => it.type)).toEqual([field, city])
    })

    it('merges 3 regions', () => {
      const { repo } = buildSubject()
      expect(repo.allRegions().length).toEqual(0)

      const claims = [
        { type: field, x: 1, y: 2 },
        { type: field, x: 2, y: 2 },
        { type: field, x: 1, y: 1 },
        { type: city, x: 2, y: 1 },
        { type: field, x: 3, y: 1 },
        { type: field, x: 4, y: 1 },
        { type: wilderness, x: 4, y: 2 },
        { type: field, x: 3, y: 3 }
      ]
      claims.forEach(({ type, x, y }) => {
        repo.claimSpot(type, { x, y })
      })
      expect(repo.allRegions().length).toEqual(5)
      expect(repo.allRegions().map(it => it.type))
        .toEqual([field, city, field, wilderness, field])

      repo.claimSpot(field, { x: 3, y: 2 })

      expect(repo.allRegions().length).toEqual(3)
      expect(repo.allRegions().map(it => it.type)).toEqual([field, city, wilderness])
    })
  })

  describe('merge regions (private)', () => {
    it('refuses to merge regions of different types', () => {
      const { repo } = buildSubject()
      expect(repo.allRegions().length).toEqual(0)

      const claims = [
        { type: field, x: 2, y: 2 },
        { type: city, x: 2, y: 1 },
        { type: wilderness, x: 3, y: 2 }
      ]
      claims.forEach(({ type, x, y }) => {
        repo.claimSpot(type, { x, y })
      })
      expect(repo.allRegions().length).toEqual(3)
      expect(repo.allRegions().map(it => it.type))
        .toEqual([field, city, wilderness])

      expect(() => {
        repo.__debugReadOnly.mergeRegions(repo.allRegions())
      }).toThrow(/Failed to merge/)

      expect(repo.allRegions().length).toEqual(3)
    })

    it('refuses to merge regions of different players', () => {
      const { repo, repo2 } = buildSubject()
      expect(repo.allRegions().length).toEqual(0)
      expect(repo2.allRegions().length).toEqual(0)

      repo.claimSpot(wilderness, { x: 2, y: 2 })
      repo2.claimSpot(wilderness, { x: 2, y: 1 })

      expect(repo.allRegions().length).toEqual(1)
      expect(repo2.allRegions().length).toEqual(1)

      expect(() => {
        const list = [
          ...repo.allRegions(),
          ...repo2.allRegions()
        ]
        repo.__debugReadOnly.mergeRegions(list)
      }).toThrow(/Failed to merge/)

      expect(repo.allRegions().length).toEqual(1)
      expect(repo2.allRegions().length).toEqual(1)
    })
  })

  const buildSubjectWithClaimedSpots = () => {
    const { board, repo, repo2 } = buildSubject()
    const tileParams = [
      { x: 4, y: 4, type: city, repo },
      { x: 12, y: 4, type: field, repo: repo2 },
      { x: 5, y: 4, type: field, repo },
      { x: 12, y: 5, type: field, repo: repo2 },
      { x: 6, y: 4, type: wilderness, repo },
      { x: 12, y: 6, type: field, repo: repo2 },
      { x: 7, y: 4, type: city, repo },
      { x: 12, y: 7, type: field, repo: repo2 },
      { x: 8, y: 4, type: field, repo },
      { x: 12, y: 8, type: field, repo: repo2 },
      { x: 9, y: 4, type: wilderness, repo }
    ]
    tileParams.forEach(({ x, y, type, repo }) => {
      repo.claimSpot(type, { x, y })
    })
    return { board, repo, repo2 }
  }

  describe('claimable spots', () => {
    it('yields all free board spaces if there are no player regions', () => {
      const { board, repo } = buildSubject()

      expect(repo.claimableSpots().length).toEqual(board.tilesCount)
    })

    it('yields many spots', () => {
      const { repo, repo2 } = buildSubjectWithClaimedSpots()

      expect(repo.claimableSpots().length).toEqual(16)
      expect(repo2.claimableSpots().length).toEqual(14)
    })

    it('yields nothing if map is full', () => {
      const type = city
      const { repo } = buildSubject(1, mapSize.xs)
      for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
          repo.claimSpot(type, { x, y })
        }
      }
      expect(repo.claimableSpots().length).toEqual(0)
    })
  })

  describe('claimable spots to grow', () => {
    it('yields nothing if there are no player regions', () => {
      const { repo } = buildSubject()

      expect(repo.claimableSpotsToGrow(city).length).toEqual(0)
      expect(repo.claimableSpotsToGrow(field).length).toEqual(0)
      expect(repo.claimableSpotsToGrow(wilderness).length).toEqual(0)
    })

    it('yields some spots', () => {
      const { repo, repo2 } = buildSubjectWithClaimedSpots()

      expect(repo.claimableSpotsToGrow(city).length).toEqual(9)
      expect(repo.claimableSpotsToGrow(field).length).toEqual(8)
      expect(repo.claimableSpotsToGrow(wilderness).length).toEqual(9)

      expect(repo2.claimableSpotsToGrow(city).length).toEqual(0)
      expect(repo2.claimableSpotsToGrow(field).length).toEqual(14)
      expect(repo2.claimableSpotsToGrow(wilderness).length).toEqual(0)
    })

    it('yields nothing if map is full', () => {
      const type = city
      const { repo } = buildSubject(1, mapSize.xs)
      for (let x = 0; x < 6; x++) {
        for (let y = 0; y < 6; y++) {
          repo.claimSpot(type, { x, y })
        }
      }
      expect(repo.claimableSpotsToGrow(type).length).toEqual(0)
    })
  })
})
