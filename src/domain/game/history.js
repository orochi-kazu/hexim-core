import { toJSONEntries } from './actions'
import shortHash from 'short-hash'

export const phase = Object.freeze({
  worldMap: Symbol('worldMap'),
  regions: Symbol('regions')
})

export const actionWithHash = (action, parents) => {
  const parts = deterministicActionParts(action, parents)
  const hash = shortHash(JSON.stringify(parts))
  return Object.freeze({ ...action, hash })
}

export const deterministicActionParts = (action, parents) => [
  ...toJSONEntries(action),
  ['parents', parents.map(it => it.hash)]
].toSorted()
