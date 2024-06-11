export const toJSON = (action) =>
  Object.fromEntries(Object.entries(action).map(([k, v]) => {
    if (typeof v === 'symbol') {
      return [k, v.description]
    }
    if (v instanceof Array) {
      return [k, [...v]]
    }
    if (v instanceof Object) {
      return [k, { ...toJSON(v) }]
    }
    return [k, v]
  }))
