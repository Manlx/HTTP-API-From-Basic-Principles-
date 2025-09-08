/** @import {
 * RouteHandlerFunction
 * } from "../types.js" */

import { dbCon, GetUsers } from "../database.js"
import { GetPathParams, SetJsonReturn } from "../utils.js"

export const UsersHandler = /** @type {RouteHandlerFunction<'/login'>} */ (req, res, route) => {

  SetJsonReturn(res)

  const temp = GetPathParams(req, '/users/:id/:toDoListItemId/bookmark')
  
  res.end(JSON.stringify(GetUsers(dbCon)))
}