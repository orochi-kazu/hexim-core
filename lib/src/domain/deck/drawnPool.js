export const drawnPool = limit => {
  const pool = []

  const add = datum => {
    if (limit === undefined || pool.length < limit) {
      pool.push(datum)
      return true
    }
    return false
  }

  const claim = datum => {
    const i = pool.indexOf(datum)
    if (i >= 0) {
      pool.splice(i, 1)
      return true
    }
    return false
  }

  return Object.freeze({
    __debugReadOnly: { pool },
    add,
    claim,
    all: () => [...pool],
    limit
  })
}
