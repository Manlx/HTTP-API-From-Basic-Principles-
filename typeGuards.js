/** @import {
 * AuthToken,
 * CreateType,
 * LoginBody,
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
 * Generates a function to prove that some object based type is a specific sub object type
 * @template { Object<string,typeOfReturn> | Object<number,typeOfReturn> } ProvenType
 * @param {CreateType<ProvenType>} exampleObject
 * @returns {(data: unknown) => data is ProvenType}
 */
export function GenerateObjectTypeProof(exampleObject){

  const keys = Object.keys(exampleObject)
  
  return /** @type { (data: unknown) => data is ProvenType } */ ((data) => {

    if (!isObject(data)) {

      return false;
    }

    for (let i = 0; i < keys.length; i++) {

      const currentKey = keys[i];
      const keyValueType = exampleObject[currentKey];

      if (
        !(currentKey in data) ||
        typeof data[currentKey] !== keyValueType
      ){

        return false;
      }
    }

    return true;
  })

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