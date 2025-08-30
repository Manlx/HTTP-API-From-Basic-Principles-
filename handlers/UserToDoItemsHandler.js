/** @import http from "http" */

import { dbCon, GetToDoItems, GetUsers } from "../database.js"
import { GetPathParams, SetJsonReturn } from "../utils.js"

/** @type {(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, route: string ) => void} */

export const UserToDoItemsHandler = (req, res, route) => {

  const pathParams = GetPathParams(req, route)

  SetJsonReturn(res)

  res.end(JSON.stringify(GetToDoItems(dbCon)))
}