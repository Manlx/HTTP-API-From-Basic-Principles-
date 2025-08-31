/** @import http from "http" */

import { 
  dbCon, 
  GetAllUserSessionTokens 
} from "../database.js"

import { 
  SetJsonReturn 
} from "../utils.js"

/** @type {(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, route: string ) => void} */

export const UserSessionTokenHandler = (req, res, route) => {

  SetJsonReturn(res)

  res.end(JSON.stringify(GetAllUserSessionTokens(dbCon)))
}