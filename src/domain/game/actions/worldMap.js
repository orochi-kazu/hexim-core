export const actionID = Object.freeze({
  buyWorldTile: Symbol('buyWorldTile'),
  placeWorldTile: Symbol('placeWorldTile')
})

const buyWorldTile = ({ player, type }) => Object.freeze({
  id: actionID.buyWorldTile,
  player,
  type
})

const placeWorldTile = ({ player, type, x, y }) => Object.freeze({
  id: actionID.placeWorldTile,
  player,
  type,
  x,
  y
})

export const worldMap = Object.freeze({
  buyWorldTile,
  placeWorldTile
})
