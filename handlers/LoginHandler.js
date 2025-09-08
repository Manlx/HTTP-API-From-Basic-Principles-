/** @import http from "http" */

/** @import {
 * AsyncRouteHandlerFunction,
 * RouteHandlerFunction
 * } from "../types.js" */

import { 
  CanLogin, 
  CreateUserSessionToken, 
  dbCon, 
} from "../database.js"

import { 
  isLoginBody 
} from "../typeGuards.js";

import { 
  GetBodyFromRequest, 
  Handle400, 
  Handle401, 
  SetJsonReturn 
} from "../utils.js"

export const LoginHandler = /** @type {AsyncRouteHandlerFunction<'/login'>} */ async (req, res, route) => {

  const body = await GetBodyFromRequest(req,20);

  const parsedBody = JSON.parse(body || '{}')

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
    token,
  ] = CreateUserSessionToken(dbCon,accountId);
  
  SetJsonReturn(res)

  res.end(JSON.stringify({
    token: token
  }))

  return;
}