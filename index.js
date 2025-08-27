"use strict"
// Import the HTTP module
/** @import {HTTPMethods} from "./types.js" */

import http from "http"

import { dbCon, GetToDoItems, GetUsers, ResetDB } from "./database.js";
import { GetPathParams, MatchUrl, QueryParams, SetJsonReturn } from "./utils.js";
import { generateToken, validateToken, verifyToken } from "./jwt.js";

const PORT = 1337;

/** @type {{[key in HTTPMethods]: ((req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>)=>void) | undefined}} */
const MethodToHandler = {

  GET: (req,res) => {

    if (MatchUrl(req, '/users')) {

      SetJsonReturn(res)
      
      res.end(JSON.stringify(GetUsers(dbCon)))
    }

    if (MatchUrl(req, '/ToDoItems')) {

      SetJsonReturn(res)

      res.end(JSON.stringify(GetToDoItems(dbCon)))
    }

    const UserToDoItemsURLPath = '/UserToDoItems/:UserId'

    if (MatchUrl(req, UserToDoItemsURLPath)) {

      const pathParams = GetPathParams(req, UserToDoItemsURLPath)

      SetJsonReturn(res)

      res.end(JSON.stringify(GetToDoItems(dbCon)))
    }
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

const token = generateToken({
  expiresAt: Date.now() - 5 * 1000 * 60,
  issuedAt: Date.now(),
  userId: 1
})

console.log(validateToken(token))