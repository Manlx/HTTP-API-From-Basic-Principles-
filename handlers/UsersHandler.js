/** @import http from "http" */

import { dbCon, GetUsers } from "../database.js"
import { SetJsonReturn } from "../utils.js"

/** @type {(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, route: string ) => void} */

export const UsersHandler = (req, res, route) => {

  SetJsonReturn(res)
  
  res.end(JSON.stringify(GetUsers(dbCon)))
}