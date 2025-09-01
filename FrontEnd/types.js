/**
 * @typedef { "undefined" | "object" | "function" | "boolean" | "number" | "bigint" | "string" | "symbol" | "unknown"} typeOfReturn
 */

/**
 * Derives the string representation of a type similar to the `typeof` operator.
 *
 * @template T The type to analyze.
 * @typedef {T extends string
 *   ? Extract<typeOfReturn, 'string'>
 *   : T extends undefined
 *   ? Extract<typeOfReturn, 'undefined'>
 *   : T extends Function
 *   ? Extract<typeOfReturn, 'function'>
 *   : T extends number
 *   ? Extract<typeOfReturn, 'number'>
 *   : T extends boolean
 *   ? Extract<typeOfReturn, 'boolean'>
 *   : T extends bigint
 *   ? Extract<typeOfReturn, 'bigint'>
 *   : T extends symbol
 *   ? Extract<typeOfReturn, 'symbol'>
 *   : T extends object
 *   ? Extract<typeOfReturn, 'object'>
 *   : "unknown"} stringTypeOf
 */

/**
 * Creates a new type where each property's value is the `stringTypeOf`
 * representation of the original property's type.
 *
 * @template {object} T The object type to transform.
 * @typedef {{
 *   [key in keyof T]: stringTypeOf<T[key]>
 * }} CreateType
 */

/**
 * @typedef {object} LoginRes
 * @prop {string} token
 */

/**
 * @typedef {object} LoginNegativeRes
 * @prop {string} message
 */

export {}