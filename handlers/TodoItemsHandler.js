/** @import http from "http" */

import { dbCon, GetToDoItems, GetUsers } from "../database.js"
import { SetJsonReturn } from "../utils.js"

/** @type {(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, route: string ) => void} */

export const TodoItemsHandler = (req, res, route) => {

  SetJsonReturn(res)

  res.end(JSON.stringify(GetToDoItems(dbCon)))
}