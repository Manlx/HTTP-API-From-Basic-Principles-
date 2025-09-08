/** @import {
 * RouteHandlerFunction
 * } from "../types.js" */

import { dbCon, GetToDoItems, GetUsers } from "../database.js"
import { GetPathParams, SetJsonReturn } from "../utils.js"



export const UserToDoItemsHandler = /** @type {RouteHandlerFunction<'/userToDoItem/:userId'>} */((req, res, route) => {

  const pathParams = GetPathParams(req, route)

  SetJsonReturn(res)

  res.end(JSON.stringify(GetToDoItems(dbCon)))
})