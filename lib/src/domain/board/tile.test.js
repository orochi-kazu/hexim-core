import { tile } from './tile'

describe('tile', () => {
  it('starts with no neighbours', () => {
    const actual = tile()
    expect(actual.neighbours.length).toEqual(0)
  })

  it('setNeighbours replaces neighbours', () => {
    const actual = tile()

    actual.setNeighbours(['a', 'b', 'c'])
    expect(actual.neighbours).toEqual(['a', 'b', 'c'])

    actual.setNeighbours(['d', 'e', 'f'])
    expect(actual.neighbours).toEqual(['d', 'e', 'f'])
  })

  it('includes extra params', () => {
    const actual = tile({ lol: 'face', fish: 'hats' })

    expect(actual.lol).toEqual('face')
    expect(actual.fish).toEqual('hats')
  })

  it('extra params close over provided state', () => {
    let type
    const actual = tile({
      setType: (newType) => { type = newType },
      type: () => type
    })

    expect(actual.type()).toEqual(undefined)
    actual.setType('defined')
    expect(actual.type()).toEqual('defined')
    expect(type).toEqual('defined')
  })
})
