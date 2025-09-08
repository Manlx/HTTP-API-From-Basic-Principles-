/** @import {
 * RouteHandlerFunction
 * } from "../types.js" */

import { dbCon, GetToDoItems, GetUsers } from "../database.js"
import { SetJsonReturn } from "../utils.js"

export const TodoItemsHandler = /** @type {RouteHandlerFunction<'/todoItems'>} */ (req, res, route) => {

  SetJsonReturn(res)

  res.end(JSON.stringify(GetToDoItems(dbCon)))
}