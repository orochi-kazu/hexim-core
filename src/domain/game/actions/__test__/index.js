import { toJSON } from '../action'

export const convertToAndFromJSON = action =>
  JSON.parse(JSON.stringify(toJSON(action)))
