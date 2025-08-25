"use strict"
// Import the HTTP module
/** @import {HTTPMethods} from "./types.js" */

import http from "http"

import { dbCon, ResetDB } from "./database.js";
import { GetPathParams, MatchUrl, QueryParams } from "./utils.js";

const PORT = 1337;

/** @type {{[key in HTTPMethods]: ((req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>)=>void) | undefined}} */
const MethodToHandler = {

  GET: (req,res) => {
  
    res.writeHead(
      200,{ 
      'Content-Type': 'text/json' 
    });

    console.log(QueryParams(req))

    console.log(GetPathParams(req, '/{userId}'))

    const urlPath = '/user/:id/name'

    console.log(`Path matches with ${urlPath} ${MatchUrl(req, urlPath)}`)

    res.end(JSON.stringify({
      Message:"Hello",
      Method: req.method
    }))
  },
  CONNECT: undefined,
  DELETE: undefined,
  HEAD: undefined,
  OPTIONS: undefined,
  PATCH: undefined,
  POST: undefined,
  PUT: undefined,
  TRACE: undefined,
}

// Create a server object
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type

  if (!req.method) {

    return;
  }

  const methodHandler = MethodToHandler[req.method]

  if (!methodHandler){

    res.statusCode = 404;
    res.writeHead(
      404,
      "Method not found",
      {
        "content-type": "text/json"
      }
    ),

    res.end(JSON.stringify({
      message: "Method not found"
    }))
  }

  methodHandler(req, res);
});

// Define the port to listen on const PORT = 3000;

// Start the server and listen on the specified port
server.listen(PORT, 'localhost', () => {

  console.log(`Server running at http://localhost:${PORT}/`);
});

ResetDB(dbCon)