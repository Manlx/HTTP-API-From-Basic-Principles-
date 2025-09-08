/** @import {
 * AuthToken,
 * CreateType,
 * LoginBody,
 RecursiveObject,
 * typeOfReturn,
 * UserDataGram,
 UserSessionTokenDataGram
 * } from "./types.js" */

/**
 * Proves variable contains object type
 * @param {unknown} possibleObject 
 * @returns {possibleObject is object}
 */
export function isObject(possibleObject) {
  
  return typeof possibleObject === "object" && !Array.isArray(possibleObject)
}

/**
 * Proves variable is of RecursiveObject type
 * @param {unknown} possibleObject 
 * @returns {possibleObject is RecursiveObject}
 */
export function isRecursiveObject(possibleObject) {
  
  return typeof possibleObject === "object" && !Array.isArray(possibleObject)
}

/**
 * Generates a function to prove that some object based type is a specific sub object type
 * @template { RecursiveObject } ProvenType
 * @param {CreateType<ProvenType>} exampleObject
 * @returns {(data: unknown) => data is ProvenType}
 */
export const GenerateObjectTypeProof = (exampleObject) => {

  const keys = Object.keys(exampleObject)
  
  return /** @type { (data: unknown) => data is ProvenType} */ ((data) => {

    if (typeof data === 'string') {

      try {
        data = JSON.parse(data)
      } catch (error) {
        
        return false;
      }
    }

    if (!isObject(data)) {

      return false;
    }

    // we are `as ProvenType` a lot but that is because we are assuming an optimistic take on the proof
    for (let i = 0; i < keys.length; i++) {

      const currentKey = keys[i];
      const keyValueType = exampleObject[currentKey];

      if (
        !(currentKey in data) ||
        (
          typeof data[currentKey] !== keyValueType &&
          typeof data[currentKey] !== 'object'
        )
      ){

        return false;
      }

      if (isRecursiveObject(exampleObject[currentKey])) {

        const currentSubObject = data[currentKey]

        return GenerateObjectTypeProof(exampleObject[currentKey])(currentSubObject) 
      }
    }

    return true;
  });

}


export const isLoginBody = /** @type {typeof GenerateObjectTypeProof<LoginBody>} */(GenerateObjectTypeProof)({
  Password: 'string',
  UserName: 'string'
})

export const isUserDataGram = /** @type {typeof GenerateObjectTypeProof<UserDataGram>} */(GenerateObjectTypeProof)({
  DisplayName: 'string',
  Id: 'number',
  IsDeleted: 'number',
  Password: 'string',
  UserName: 'string'
})

export const isUserSessionTokenDataGram = /** @type {typeof GenerateObjectTypeProof<UserSessionTokenDataGram>} */(GenerateObjectTypeProof)({
  ExpiredAt: 'number',
  Id: 'number',
  IsInvalidated: 'number',
  IssuedAt: 'number',
  Token: 'string',
  UserId: 'number'
})

export const isAuthTokenObject = /** @type {typeof GenerateObjectTypeProof<AuthToken>} */(GenerateObjectTypeProof)({
  expiresAt: 'number',
  issuedAt: 'number',
  userId: 'number'
})