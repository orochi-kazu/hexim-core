import { deck } from '../deck'
import { tileTypes } from '../game'

const tileDeckWeights = [
  [tileTypes.field, 20],
  [tileTypes.wilderness, 20],
  [tileTypes.city, 10]
]

export const buildTilesDeck = (randTiles, label, tilesCount) => {
  const randDeck = randTiles.generateChild(label)
  const tiles = buildTilesDistribution(tilesCount, tileDeckWeights)

  return Object.freeze({
    __debugReadOnly: { randDeck, tiles },
    deck: deck(randDeck.nextDatum, tiles)
  })
}

const buildTilesDistribution = (count, weights) => {
  const totalWeight = tileDeckWeights.map(([_, v]) => v).reduce((acc, it) => acc + it)
  const tiles = []
  const finalWeightType = weights[weights.length - 1][0]
  tileDeckWeights.forEach(([type, weight]) => {
    const countForType = type === finalWeightType
      ? count - tiles.length
      : Math.round(weight / totalWeight * count)

    tiles.push(...makeTiles(type, countForType))
  })
  return tiles
}

const makeTiles = (type, count) => Array(count).keys().map(_ => type).toArray()
