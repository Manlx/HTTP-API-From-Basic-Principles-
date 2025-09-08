/** @import {
 * RouteHandlerFunction
 * } from "../types.js" */

import { 
  dbCon, 
  GetAllUserSessionTokens 
} from "../database.js"

import { 
  SetJsonReturn 
} from "../utils.js"

export const UserSessionTokenHandler = /** @type {RouteHandlerFunction<'/userSessionTokens'>} */(req, res, route) => {

  SetJsonReturn(res)

  res.end(JSON.stringify(GetAllUserSessionTokens(dbCon)))
}