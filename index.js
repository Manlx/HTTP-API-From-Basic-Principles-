"use strict"

/** @import {
 * HTTPMethods, 
 * RouteHandler
 * } from "./types.js" */

import 
  http 
from "http"

import { 
  dbCon, 
  ResetDB 
} from "./database.js";

import { 
  authorizationHandler,
  HandelRoute, 
  Handle404, 
  HandleRouteNotFound404, 
} from "./utils.js";

import { 
  LoginHandler, 
  TodoItemsHandler, 
  UsersHandler, 
  UserToDoItemsHandler,
  UserSessionTokenHandler,
  HandleFrontend
} from "./handlers/index.js";


const PORT = 1337;

/** @type {{[key in HTTPMethods]: ((req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void) | undefined}} */
const MethodToHandler = {

  GET: (req, res) => {

      const wasUI = HandelRoute(
      [
        {
          handler: HandleFrontend,
          route: '/ui/*'
        }
      ],
      req,
      res
    )

    if (wasUI){

      return;
    }

    if (!authorizationHandler(req,res)){

      return;
    }

    /** @type {RouteHandler<any>[]} */
    const routes = [
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
        route: '/userToDoItem/:userId'
      },
      {
        handler: UserSessionTokenHandler,
        route: '/userSessionTokens'
      }
    ];


    // const wasHandled = /** @type { typeof HandelRoute<'/users' | '/login' | '/todoItems' | '/userToDoItem/:userId' | '/userSessionTokens'> }*/ (HandelRoute)(
    const wasHandled = HandelRoute(
      routes,
      req,
      res
    )

    if (!wasHandled) {

      HandleRouteNotFound404(req,res)
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

      HandleRouteNotFound404(req,res)
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