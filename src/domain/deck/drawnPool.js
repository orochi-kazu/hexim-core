export const drawnPool = limit => {
  const pool = []

  const canAdd = () => limit === undefined || pool.length < limit

  const add = datum => {
    if (canAdd()) {
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
    canAdd,
    add,
    claim,
    all: () => [...pool],
    limit
  })
}
