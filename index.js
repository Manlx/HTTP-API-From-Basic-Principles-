"use strict"
// Import the HTTP module
/** @import {HTTPMethods} from "./types.js" */

import http from "http"

import { 
  dbCon, 
  GetToDoItems, 
  GetUsers, 
  ResetDB 
} from "./database.js";

import { 
  authorizationHandler,
  GetPathParams, 
  HandelRoute, 
  Handle404, 
  HandleRoutNotFound, 
  MatchUrl, 
  QueryParams, 
  SetJsonReturn 
} from "./utils.js";

import { 
  generateToken, 
  validateToken, 
  verifyToken 
} from "./jwt.js";

import { 
  LoginHandler, 
  TodoItemsHandler, 
  UsersHandler, 
  UserToDoItemsHandler 
} from "./handlers/index.js";


const PORT = 1337;

/** @type {{[key in HTTPMethods]: ((req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>)=>void) | undefined}} */
const MethodToHandler = {

  GET: (req, res) => {

    if (!authorizationHandler(req,res)){

      return;
    }

    const wasHandled = HandelRoute(
      [
        {
          handler: UsersHandler,
          route: '/users'
        },
        {
          handler: LoginHandler,
          route: '/login'
        },
        {
          handler: TodoItemsHandler,
          route: '/todoItems'
        },
        {
          handler: UserToDoItemsHandler,
          route: '/userToDoItem'
        }
      ],
      req,
      res
    )

    if (!wasHandled) {

      HandleRoutNotFound(req,res)
    }
  },
  POST: (req, res) => {

    const wasHandled = HandelRoute(
      [
        {
          handler: LoginHandler,
          route: '/login'
        },
      ],
      req,
      res
    )

    if (!wasHandled) {

      HandleRoutNotFound(req,res)
    }
  },
  CONNECT: undefined,
  DELETE: undefined,
  HEAD: undefined,
  OPTIONS: undefined,
  PATCH: undefined,
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

    Handle404(req,res, "No handler was found for Method")
  }

  methodHandler(req, res);
});

// Define the port to listen on const PORT = 3000;

// Start the server and listen on the specified port
server.listen(PORT, 'localhost', () => {

  console.log(`Server running at http://localhost:${PORT}/`);
});

ResetDB(dbCon)