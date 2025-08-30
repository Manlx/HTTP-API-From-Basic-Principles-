/** @import http from "http" */
/** @import {HandlerFunction} from "../types.js" */

import { CanLogin, dbCon, GetUserSessionToken} from "../database.js"
import { isLoginBody } from "../typeGuards.js";
import { GetBodyFromRequest, Handle400, Handle401, Handle404, MakeToken, SetJsonReturn } from "../utils.js"

/** @type {HandlerFunction} */

export const LoginHandler = async (req, res, route) => {

  const body = await GetBodyFromRequest(req,20);

  const parsedBody = JSON.parse(body || '{}')

  console.log(parsedBody)

  if (!isLoginBody(parsedBody)){

    Handle400(req,res, 'Invalid body')

    return;
  }

  const [
    validLogin,
    accountId
  ] = CanLogin(dbCon, parsedBody.UserName, parsedBody.Password);

  if (!validLogin) {

    Handle401(req,res, 'Login failed.')
    
    return;
  }

  const [
    hasToken,
    lastSessionToken
  ] = GetUserSessionToken(dbCon, accountId);

  if (hasToken) {

    // Check if last token is expired

      if (lastSessionToken.IsInvalidated) {

        // If the last session has been invalidated, we can create a new session.
      }

    return;
  }

  
  SetJsonReturn(res)

  res.end(JSON.stringify({
    token: MakeToken(accountId)
  }))

  return;
}