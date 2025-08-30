/** @import http from "http" */
/** @import {HandlerFunction} from "../types.js" */

import { CanLogin, dbCon} from "../database.js"
import { GetBodyFromRequest, Handle400, SetJsonReturn } from "../utils.js"

/** @type {HandlerFunction} */

export const LoginHandler = async (req, res, route) => {

  const body = await GetBodyFromRequest(req,20);

  // console.log(JSON.stringify(body))

  /** @type {unknown} */
  const parsedBody = JSON.parse(body || '{}');

  if (
    parsedBody === null ||
    typeof parsedBody !== "object"  || 
    Array.isArray(parsedBody) ||
    !("username" in parsedBody) ||
    !("password" in parsedBody) ||
    typeof parsedBody.password !== 'string' || 
    typeof parsedBody.username !== 'string'
  ) {

    Handle400(req, res)

    return;
  }

  parsedBody
  

  SetJsonReturn(res)

  res.end(JSON.stringify({
    message: "Message: " + CanLogin(dbCon, parsedBody.username, parsedBody.password)
  }))

  return;
}