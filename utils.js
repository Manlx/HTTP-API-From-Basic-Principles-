/** @import http from "http" */
/** @import {AuthToken, LogCustomType, LogLevel, RouteHandler} from "./types.js" */

import { config } from "./config.js";
import { dbCon, GetUserSessionTokenByUserIdAndToken } from "./database.js";
import { decodeToken, generateToken, validateToken, verifyToken } from "./jwt.js";

/**
 * @param {http.IncomingMessage} req 
 * @param {string} templatePath
 * @returns {boolean}
 */
export function MatchUrl(req, templatePath){

  const incomingPath = GetUrlPath(req);

  const incomingSubPaths = incomingPath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  const templateSubPaths = templatePath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  if (incomingSubPaths.length !== templateSubPaths.length){
  
    return false;
  }

  for (let i = 0; i < templateSubPaths.length; i++) {

    const templateSubPath = templateSubPaths[i];

    if (templateSubPath.includes(':') || templateSubPath.includes('{') < templateSubPath.includes('}')){
    
      continue;
    }

    if (templateSubPath.toLowerCase() !== incomingSubPaths[i].toLowerCase()){
      
      return false
    }
  }

  return true;
}

/**
 * Extracts the Url Path from the request object
 * @param {http.IncomingMessage} req 
 * @returns {string}
 */
export function GetUrlPath(req){

  return (req.url || '').split('?')[0]
}

/**
 * Extracts the queryParams and returns a map of the value keys
 * @param {http.IncomingMessage} req 
 * @returns {Map<string, string>}
 */
export function QueryParams(req){

  const queryParams = new Map();

  const url = req.url;

  if (!url || !url.includes('?')){

    return queryParams;
  }

  console.log(url)

  const [,rawParams] = url.split('?');

  const paramKeyValueArr = rawParams.split('&');

  paramKeyValueArr.forEach(paramKeyValue => {

    const [key,value] = paramKeyValue.split('=');

    if (!key || !value){

      return;
    }

    queryParams.set(key,value)
  })

  return queryParams
}

/**
 * @param {http.IncomingMessage} req 
 * @param {string} templatePath
 * @returns {Map<string, string>}
 */
export function GetPathParams(req, templatePath){

  const pathParams = new Map();

  const incomingPath = GetUrlPath(req);

  const incomingSubPaths = incomingPath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  const templateSubPaths = templatePath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  if (incomingSubPaths.length !== templateSubPaths.length){
  
    return pathParams;
  }

  templateSubPaths.forEach((subPath, index)=> {

    if (subPath.startsWith(':')){

      pathParams.set(subPath.replaceAll(':',''), incomingSubPaths[index])

      return;
    }

    if (subPath.startsWith('{') && subPath.endsWith('}')){

      pathParams.set(subPath.replace('{','').replace('}',''), incomingSubPaths[index])

      return;
    }
  })

  return pathParams;
}

/**
 * Sets the status to 200 and content type to JSON
 * @param {http.ServerResponse<http.IncomingMessage>} res
 */
export function SetJsonReturn(res){

  res.writeHead(
    200,
    {
      "content-type": "text/json"
    }
  )
}

/**
 * Sets the status to 404 and send response
 * @param {http.ServerResponse<http.IncomingMessage>} res
 */
export function Send404(res){

  res.writeHead( 404 )

  res.end();
}

/**
 * Takes and incoming request and response object and 
 * @param {RouteHandler[]} routes 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse<http.IncomingMessage>} res
 * @returns {boolean}
 */
export function HandelRoute(routes, req, res) {

  for (let i = 0; i < routes.length; i++){

    const currentRoute = routes[i]

    if (MatchUrl(req,currentRoute.route)){

      currentRoute.handler(req,res, currentRoute.route)

      return true;
    }
  }

  return false;
}

/**
 * Creates a token for a given userId
 * @param {number} userId 
 * @returns {[false, undefined] | [true, string]}
 */
export function MakeToken(userId){

  const newToken = generateToken({
    expiresAt: Date.now() + config.tokenLifeTime,
    issuedAt: Date.now(),
    userId: userId
  })

  return [
    true,
    newToken
  ]
}

/**
 * Sends a default not found message for the request method
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage>} res
 */
export function HandleRoutNotFound(req, res){


  SetJsonReturn(res);

  res.end(
    JSON.stringify(
      {
        message: `No route for this method (${req.method || 'No method passed'}) was found`
      },
      null,
      2
    )
  )
}

/**
 * Sends a default message for a bad request
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage>} res
 * @param {string} [message]
 */
export function Handle400(req, res, message){

  res.writeHead(
    400,{
      "content-type": "text/json"
    }
  )

  res.end(
    JSON.stringify(
      {
        message: `Bad Request (${req.method || 'No method passed'})${!!message ? '. ': '.' }${message}`
      },
      null,
      2
    )
  )
}

/**
 * Sends a default message for a 404 response
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage>} res
 * @param {string} [message]
 */
export function Handle404(req, res, message){

  res.writeHead(
    404,{
      "content-type": "text/json"
    }
  )

  res.end(
    JSON.stringify(
      {
        message: `Response Not Found (${req.method || 'No method passed'})${!!message ? '. ': '.' }${message}`
      },
      null,
      2
    )
  )
}

/**
 * Sends a default message for a 401 response
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage>} res
 * @param {string} [message]
 */
export function Handle401(req, res, message){

  res.writeHead(
    401,{
      "content-type": "text/json"
    }
  )

  res.end(
    JSON.stringify(
      {
        message: `User is not authorized (${req.method || 'No method passed'})${!!message ? '. ': '.' }${message}`
      },
      null,
      2
    )
  )
}

/**
 * This will take an incoming req and return a promise with the data.
 * If the request times out there will be no data 
 * @param {http.IncomingMessage} req 
 * @param {number} timeout 
 * @returns {Promise<string|undefined>}
 */
export async function GetBodyFromRequest(req, timeout) {

  return new Promise((resolve,reject)=>{
    
    let currentBody = '';

    const timeOutId = setTimeout(() => {

      reject(undefined)

    },timeout)
  
    req.on('data', (incomingData)=>{
  
      currentBody += incomingData
    })
  
    req.on('end', () =>{

      clearTimeout(timeOutId)
  
      resolve(currentBody)
    })
  })
}

/**
 * Creates a function that accepts a message and only logs message at the created level
 * @param {LogLevel} logLevel 
 * @returns {(message: any) => void}
 */
function CreateCustomLog(logLevel) {

  return (message) => {

    customLog(message, logLevel)
  }
}

/** @type {LogCustomType} */
export const LogCustom = {
  All: CreateCustomLog('All'),
  Debug: CreateCustomLog('Debug'),
  Error: CreateCustomLog('Error'),
  Info: CreateCustomLog('Info'),
  Warning: CreateCustomLog('Warning'),
}

/**
 * Logs a message to the STDOUT given that in the config the required loglevel is met or Log Level is set to All
 * @param {any} message 
 * @param {LogLevel} logLevel 
 */
export function customLog(message, logLevel) {

  if (config.customLogLevel.includes('All') || config.customLogLevel.includes(logLevel) ){

    console.log(message)
  }
}


/**
 * Middleware to check authorization before continuing down the chain.
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage>} res
 * @returns {boolean}
 */
export function authorizationHandler(req,res){

  let authToken = req.headers.authorization;

  if (!authToken){

    Handle401(req,res, 'No auth token presented')

    return false;
  }

  authToken = authToken.replace('Bearer ','');

  if (!validateToken(authToken) || !verifyToken(authToken)) {

    Handle401(req,res, 'Token is invalid')

    return false;
  }

  const [
    isValidToken,
    tokenObject
  ] = decodeToken(authToken)

  if (!isValidToken) {

    Handle401(req,res, 'Token is invalid')

    return false;
  }

  const [
    doWeHaveUserSessionToken,
    userSessionToken
  ] = GetUserSessionTokenByUserIdAndToken(dbCon, tokenObject.userId, authToken);

  if (!doWeHaveUserSessionToken) {

    Handle401(req,res, 'Token was not issued by us.')

    return false;
  }

  if (userSessionToken.IsInvalidated){

    Handle401(req,res, 'Session has been invalidated.')

    return false;
  }

  return true;
}
