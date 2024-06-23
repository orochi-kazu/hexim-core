import { mapSize, tileTypes } from '../params'
import { buildSharedBoard } from './boardFactory'
import { regionRepo } from './regionRepo'

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

      const tile1 = repo.claimSpot(tileTypes.wilderness, { x: 3, y: 9 })
      const tile2 = repo2.claimSpot(tileTypes.field, { x: 8, y: 4 })

      expect(tile1.type()).toEqual(tileTypes.wilderness)
      expect(tile1.player()).toEqual(player1)
      expect(tile2.type()).toEqual(tileTypes.field)
      expect(tile2.player()).toEqual(player2)
    })

    it("cannot claim spots if type isn't specified", () => {
      const { repo } = buildSubject()

      expect(() => { repo.claimSpot(undefined, { x: 0, y: 0 }) })
        .toThrow(/Cannot claim/)
    })

    it('cannot claim unavailable spots', () => {
      const { repo, repo2 } = buildSubject()
      repo.claimSpot(tileTypes.wilderness, { x: 3, y: 9 })

      expect(() => { repo2.claimSpot(tileTypes.field, { x: 3, y: 9 }) })
        .toThrow(/Cannot claim/)
    })

    it('cannot claim non-adjacent spots', () => {
      const { repo } = buildSubject()
      repo.claimSpot(tileTypes.wilderness, { x: 3, y: 9 })

      expect(() => { repo.claimSpot(tileTypes.wilderness, { x: 6, y: 10 }) })
        .toThrow(/Cannot claim/)
    })
  })

  const buildSubjectWithClaimedSpots = () => {
    const { board, repo, repo2 } = buildSubject()
    const tileParams = [
      { x: 4, y: 4, type: tileTypes.city, repo },
      { x: 12, y: 4, type: tileTypes.field, repo: repo2 },
      { x: 5, y: 4, type: tileTypes.field, repo },
      { x: 12, y: 5, type: tileTypes.field, repo: repo2 },
      { x: 6, y: 4, type: tileTypes.wilderness, repo },
      { x: 12, y: 6, type: tileTypes.field, repo: repo2 },
      { x: 7, y: 4, type: tileTypes.city, repo },
      { x: 12, y: 7, type: tileTypes.field, repo: repo2 },
      { x: 8, y: 4, type: tileTypes.field, repo },
      { x: 12, y: 8, type: tileTypes.field, repo: repo2 },
      { x: 9, y: 4, type: tileTypes.wilderness, repo }
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
      const type = tileTypes.city
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

      expect(repo.claimableSpotsToGrow(tileTypes.city).length).toEqual(0)
      expect(repo.claimableSpotsToGrow(tileTypes.field).length).toEqual(0)
      expect(repo.claimableSpotsToGrow(tileTypes.wilderness).length).toEqual(0)
    })

    it('yields some spots', () => {
      const { repo, repo2 } = buildSubjectWithClaimedSpots()

      expect(repo.claimableSpotsToGrow(tileTypes.city).length).toEqual(9)
      expect(repo.claimableSpotsToGrow(tileTypes.field).length).toEqual(8)
      expect(repo.claimableSpotsToGrow(tileTypes.wilderness).length).toEqual(9)

      expect(repo2.claimableSpotsToGrow(tileTypes.city).length).toEqual(0)
      expect(repo2.claimableSpotsToGrow(tileTypes.field).length).toEqual(14)
      expect(repo2.claimableSpotsToGrow(tileTypes.wilderness).length).toEqual(0)
    })

    it('yields nothing if map is full', () => {
      const type = tileTypes.city
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
