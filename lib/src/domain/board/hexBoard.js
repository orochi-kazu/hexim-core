import { tile } from './tile'

export const tilePolarity = Object.freeze({
  horizontal: Symbol('horizontal'),
  vertical: Symbol('vertical')
})

const neighbourDirections = Object.freeze({
  [tilePolarity.horizontal]: Object.freeze({
    w: Symbol('west'),
    nnw: Symbol('northNorthWest'),
    nne: Symbol('northNorthEast'),
    e: Symbol('east'),
    sse: Symbol('southSouthEast'),
    ssw: Symbol('southSouthWest')
  }),
  [tilePolarity.vertical]: Object.freeze({
    n: Symbol('north'),
    ene: Symbol('eastNorthEast'),
    ese: Symbol('eastSouthEast'),
    s: Symbol('south'),
    wsw: Symbol('westSouthWest'),
    wnw: Symbol('westNorthWest')
  })
})

export const hexBoard = (polarity, width, height, { wrapping }) => {
  if (wrapping) {
    if (polarity === tilePolarity.horizontal && height % 2 !== 0) {
      throw Error(`Board height must be a multiple of 2 to wrap (received ${height})`)
    }
    if (polarity === tilePolarity.vertical && width % 2 !== 0) {
      throw Error(`Board width must be a multiple of 2 to wrap (received ${width})`)
    }
  }

  const neighbourlessBoard = buildBoardWithNeighbourlessTiles(width, height)
  const board = addBoardNeighbours(neighbourlessBoard, polarity, { wrapping })

  return Object.freeze({
    __debugReadOnly: { dirs: neighbourDirections[polarity] },
    board
  })
}

const buildBoardWithNeighbourlessTiles = (width, height) =>
  Array(width).keys().map(x =>
    Array(height).keys().map(y =>
      tile({}, { x, y })
    ).toArray()
  ).toArray()

const addBoardNeighbours = (board, polarity, { wrapping }) => {
  const w = board.length
  const h = board[0].length

  const maybeWrap = (xy, l) => {
    let n = xy
    if (wrapping) {
      if (n < 0) { n += l }
      if (n >= l) { n -= l }
    }
    return n >= 0 && n < l ? n : undefined
  }
  const maybeWrapX = x => maybeWrap(x, w)
  const maybeWrapY = y => maybeWrap(y, h)

  const maybeNeighbour = (x, y) =>
    [x, y].includes(undefined) ? undefined : board[x][y]

  const dirs = neighbourDirections[polarity]
  board.forEach((col, x) => col.forEach((t, y) => {
    const neighbours = Object.values(dirs).map(d => {
      const evenX = x % 2 === 0
      const oddX = !evenX
      const evenY = y % 2 === 0
      const oddY = !evenY

      switch (true) {
        // horizontal polarity
        case d === dirs.w:
          return maybeNeighbour(maybeWrapX(x - 1), y)

        case d === dirs.nnw && evenY:
          return maybeNeighbour(maybeWrapX(x - 1), maybeWrapY(y - 1))
        case d === dirs.nnw && oddY:
          return maybeNeighbour(x, maybeWrapY(y - 1))

        case d === dirs.nne && evenY:
          return maybeNeighbour(x, maybeWrapY(y - 1))
        case d === dirs.nne && oddY:
          return maybeNeighbour(maybeWrapX(x + 1), maybeWrapY(y - 1))

        case d === dirs.e:
          return maybeNeighbour(maybeWrapX(x + 1), y)

        case d === dirs.sse && evenY:
          return maybeNeighbour(x, maybeWrapY(y + 1))
        case d === dirs.sse && oddY:
          return maybeNeighbour(maybeWrapX(x + 1), maybeWrapY(y + 1))

        case d === dirs.ssw && evenY:
          return maybeNeighbour(maybeWrapX(x - 1), maybeWrapY(y + 1))
        case d === dirs.ssw && oddY:
          return maybeNeighbour(x, maybeWrapY(y + 1))

        // vertical polarity
        case d === dirs.n:
          return maybeNeighbour(x, maybeWrapY(y - 1))

        case d === dirs.ene && evenX:
          return maybeNeighbour(maybeWrapX(x + 1), maybeWrapY(y - 1))
        case d === dirs.ene && oddX:
          return maybeNeighbour(maybeWrapX(x + 1), y)

        case d === dirs.ese && evenX:
          return maybeNeighbour(maybeWrapX(x + 1), y)
        case d === dirs.ese && oddX:
          return maybeNeighbour(maybeWrapX(x + 1), maybeWrapY(y + 1))

        case d === dirs.s:
          return maybeNeighbour(x, maybeWrapY(y + 1))

        case d === dirs.wsw && evenX:
          return maybeNeighbour(maybeWrapX(x - 1), y)
        case d === dirs.wsw && oddX:
          return maybeNeighbour(maybeWrapX(x - 1), maybeWrapY(y + 1))

        case d === dirs.wnw && evenX:
          return maybeNeighbour(maybeWrapX(x - 1), maybeWrapY(y - 1))
        case d === dirs.wnw && oddX:
          return maybeNeighbour(maybeWrapX(x - 1), y)

        default:
          return undefined
      }
    }).filter(it => it !== undefined)

    t.setNeighbours(neighbours)
  }))
  return board
}
