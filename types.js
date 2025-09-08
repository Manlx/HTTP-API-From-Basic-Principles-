/** @import http from "http" */
/**
 * @typedef {| "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"} HTTPMethods
 */

/**
 * @typedef {object} AuthToken
 * @prop {number} userId
 * @prop {number} issuedAt
 * @prop {number} expiresAt
 */


/**
 * @namespace DataStructures
 * @description A collection of utility functions.
 */

/**
 * @typedef {object} UserDataGram
 * @prop {number} Id
 * @prop {string} UserName
 * @prop {string} DisplayName
 * @prop {string} Password
 * @prop {number} IsDeleted
 */

/**
 * @typedef {object} UserSessionTokenDataGram
 * @prop {number} Id
 * @prop {number} UserId
 * @prop {string} Token
 * @prop {number} IssuedAt
 * @prop {number} ExpiredAt
 * @prop {number} IsInvalidated
 */

/**
 * @memberof DataStructures
 * @typedef {"Yes"|"No"} Answers
 */

/**
 * @template {string} [Routes='']
 * @typedef {object} RouteHandler
 * @prop {Routes} route
 * @prop {RouteHandlerFunction<Routes>} handler
 */

/**
 * @template {string} [Routes='']
 * @typedef {object} AsyncRouteHandler
 * @prop {Routes} route
 * @prop {AsyncRouteHandlerFunction<Routes>} handler
 */

/** @typedef {(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, route: string ) => Promise<void>} HandlerFunction */

/**
 * @typedef {object} LoginBody
 * @prop {string} UserName
 * @prop {string} Password
 */

/**
 * @typedef { "undefined" | "object" | "function" | "boolean" | "number" | "bigint" | "string" | "symbol" | "unknown"} typeOfReturn
 */

/**
 * Derives the string representation of a type similar to the `typeof` operator.
 *
 * @template T The type to analyze.
 * @typedef {T extends string
 * ? Extract<typeOfReturn, 'string'>
 * : T extends undefined
 * ? Extract<typeOfReturn, 'undefined'>
 * : T extends Function
 * ? Extract<typeOfReturn, 'function'>
 * : T extends number
 * ? Extract<typeOfReturn, 'number'>
 * : T extends boolean
 * ? Extract<typeOfReturn, 'boolean'>
 * : T extends bigint
 * ? Extract<typeOfReturn, 'bigint'>
 * : T extends symbol
 * ? Extract<typeOfReturn, 'symbol'>
 * : T extends RecursiveObject
 * ? CreateType<T>
 * : "unknown"} stringTypeOf
 */

/**
 * @typedef { {[key in string | number]: RecursiveObject | number | string | boolean | undefined | null | symbol }} RecursiveObject
 */

/**
 * Creates a new type where each property's value is the `stringTypeOf`
 * representation of the original property's type.
 *
 * @template {RecursiveObject} T The object type to transform.
 * @typedef {{
 *   [key in keyof T]: stringTypeOf<T[key]>
 * }} CreateType
 */

/**
 * @typedef {'Error' | 'Info' | 'Debug' | 'Warning' | 'All'} LogLevel
 */

/**
 * @typedef {object} Config
 * @prop {number} tokenLifeTime
 * @prop {LogLevel[]} customLogLevel
 */

/**
 * @typedef {{[key in LogLevel]: (msg: any)=> void}} LogCustomType
 */

/**
 * @template {string} T
 * @typedef { T extends `${infer subPath}/${infer rest}`
 * ? subPath extends `:${infer param}`
   * ? {[key in param]: string} & ExtractPathParams<rest>
   * : ExtractPathParams<rest>
 * : T extends `:${infer lastParam}`
  * ? {[key in lastParam]: string}
  * : {}
 * } ExtractPathParams
 */

/**
 * @template {string} [URLPath='']
 * @typedef {(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, route: URLPath ) => Promise<void>} AsyncRouteHandlerFunction 
 * */

/**
 * @template {string} [URLPath='']
 * @typedef {(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, route: URLPath ) => void} RouteHandlerFunction 
 * */
export default {};