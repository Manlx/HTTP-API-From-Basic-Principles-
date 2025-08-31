/** @import {AuthToken} from "./types.js" */

import { buffer } from "stream/consumers"

import Crypto from "node:crypto"

// Obviously don't do this, but I am lazy
const MySecret = "This is my secret, lol"

/**
 * Encrypt data using SHA256 with our secret
 * @param {string} string 
 * @returns {string}
 */
function encrypt(string) {

  return Crypto.createHmac('sha256', MySecret).update(string).digest('base64')
}

/**
 * Generate token from token body
 * @param {AuthToken} token 
 */
export function generateToken(token){

  const stringToken = JSON.stringify(token)

  const base64Token = Buffer.from(stringToken).toString('base64')

  const encryptedToken = encrypt(base64Token);
  
  return `${base64Token}.${encryptedToken}`
}

/**
 * Verify that the signature was written by us. 
 * Tokens can be verified but no longer valid
 * @param {string} token 
 * @returns {boolean}
 */
export function verifyToken(token){

  if (!token.includes('.')){

    return false;
  }

  const [
    body,
    signature
  ] = token.split('.')

  const encryptedBody = encrypt(body);

  return encryptedBody === signature;
}

/**
 * Validates that the token provided is still valid
 * Tokens can be valid but not verified
 * @param {string} token 
 */
export function validateToken(token){

  if (!token.includes('.')){

    return false
  }

  try {
    const [bodyBase64] = token.split('.');

    const rawBody = Buffer.from(bodyBase64, 'base64').toString('utf-8');

    const body = JSON.parse(rawBody);

    if (
      !(
        'userId' in body &&
        'issuedAt' in body &&
        'expiresAt' in body
      )
    ){

      return false;
    }

    if (Date.now() > body['expiresAt']){

      return false;
    }

    return true;
    
  } catch (error) {
    
    return false;
  }
}


/**
 * Decodes a verified token
 * @param {string} token 
 * @returns {[true, AuthToken] | [false, undefined]}
 */
export function decodeToken(token) {

  const [tokenBase64] = token.split('.');

  const rawToken = Buffer.from(tokenBase64, 'base64').toString('utf-8');

  const tokenObject = JSON.parse(rawToken);

  if (!isAuthTokenObject(tokenObject)){

    return [false, undefined];
  }


  return [
    true,
    tokenObject
  ]
}