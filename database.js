/** @import {
 * UserSessionTokenDataGram
 * } from "./types.js" */

import sqllite from "node:sqlite"
import fs from "fs"
import { isUserDataGram, isUserSessionTokenDataGram } from "./typeGuards.js"
import { LogCustom } from "./utils.js"
import { config } from "./config.js"
import { generateToken } from "./jwt.js"

const dbFilePath = './dataStore.db'

/**
 * Resets the database
 * @param {sqllite.DatabaseSync} dbCon 
 */
export function ResetDB(dbCon) {

  if (dbCon.isOpen){
    
    dbCon.close()
  }

  if (fs.existsSync(dbFilePath)){

    fs.rmSync(dbFilePath)
  }

  dbCon.open();

  // Gen 1 Creation
  dbCon.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      Id INTEGER PRIMARY KEY, 
      UserName TEXT UNIQUE, 
      DisplayName TEXT, 
      Password TEXT, 
      IsDeleted INTEGER
    )
  `);

  dbCon.exec(`
    CREATE TABLE IF NOT EXISTS ToDoCategories (
      Id INTEGER PRIMARY KEY, 
      Description TEXT
    )
  `);

  dbCon.exec(`
    CREATE TABLE IF NOT EXISTS ToDoItemUserStatus (
      Id INTEGER PRIMARY KEY, 
      Status TEXT
    )
  `);

  // Gen 2 Creation

  dbCon.exec(`
    CREATE TABLE IF NOT EXISTS ToDoItems (
      Id INTEGER PRIMARY KEY, 
      DisplayName TEXT, 
      ToDoType INTEGER, 
      FOREIGN KEY(ToDoType) REFERENCES ToDoCategories(Id)
    )
  `);

  dbCon.exec(`
    CREATE TABLE IF NOT EXISTS UserSessionTokens (
      Id INTEGER PRIMARY KEY, 
      UserId INTEGER,
      Token TEXT,
      IssuedAt INTEGER,
      ExpiredAt INTEGER,
      IsInvalidated INTEGER,
      FOREIGN KEY(UserId) REFERENCES Users(Id)
    )
  `);

  // Gen 3 Creation

  dbCon.exec(`
    CREATE TABLE IF NOT EXISTS UserToDoItems (
      Id INTEGER PRIMARY KEY, 
      UserId INTEGER, 
      ToDoId INTEGER, 
      IsDeleted INTEGER, 
      CreatedOn INTEGER, 
      CompletedOn INTEGER, 
      CurrentStatus INTEGER, 
      FOREIGN KEY (UserId) REFERENCES Users(Id),
      FOREIGN KEY (ToDoId) REFERENCES ToDoItems(Id),
      FOREIGN KEY (CurrentStatus) REFERENCES ToDoItemUserStatus(Id)
    )
  `);

  const toDoItemUserStatusInsert = dbCon.prepare(`
    INSERT INTO ToDoItemUserStatus (
      Status
    ) VALUES (
      ?
    )
  `);

  toDoItemUserStatusInsert.run('Doing')
  toDoItemUserStatusInsert.run('Done')
  toDoItemUserStatusInsert.run('Back Log')
  toDoItemUserStatusInsert.run('Pending')

  const usersInsert = dbCon.prepare(`
    INSERT INTO Users (
      UserName,
      DisplayName,
      Password,
      IsDeleted
    ) VALUES (
      ?,
      ?,
      ?,
      ?
    )
  `)

  usersInsert.run('JacoPretorius', 'xXJacoXx', 'myPassword1234',0)
  usersInsert.run('DanielDavidson', 'Dany_D', 'DannyBigD',0)
  usersInsert.run('Jeckob', 'J-Man', 'Jeckob1997',0)

  const toDoCategoriesInsert = dbCon.prepare(`
    INSERT INTO ToDoCategories (
      Description
    ) VALUES (
     ?
    )
  `)

  toDoCategoriesInsert.run('Shopping')
  toDoCategoriesInsert.run('Cleaning')
  toDoCategoriesInsert.run('Maintenance')
  toDoCategoriesInsert.run('Admin')

  dbCon.exec(`
    INSERT INTO ToDoItems (
      DisplayName,
      ToDoType
    ) VALUES (
      'Buy Shoes',
      (
        SELECT Id 
        FROM ToDoCategories 
        WHERE Description = 'Shopping'
      )
    )
  `)

  dbCon.exec(`
    INSERT INTO ToDoItems (
      DisplayName,
      ToDoType
    ) VALUES (
      'Kitchen',
      (
        SELECT Id 
        FROM ToDoCategories 
        WHERE Description = 'Cleaning'
      )
    )
  `)

  dbCon.exec(`
    INSERT INTO ToDoItems (
      DisplayName,
      ToDoType
    ) VALUES (
      'Gutters',
      (
        SELECT Id 
        FROM ToDoCategories 
        WHERE Description = 'Maintenance'
      )
    )
  `)
  
  dbCon.close()
}

/**
 * Get all the users
 * @param {sqllite.DatabaseSync} dbCon 
 */
export function GetUsers(dbCon){

  if (!dbCon.isOpen){

    dbCon.open()
  }

  return dbCon.prepare(`SELECT * FROM users`).all();
}

/**
 * Get all the users
 * @param {sqllite.DatabaseSync} dbCon 
 */
export function GetToDoItems(dbCon){

  if (!dbCon.isOpen){

    dbCon.open()
  }

  return dbCon.prepare(`
    SELECT
      ToDoItems.Id,
      ToDoItems.DisplayName,
      ToDoCategories.Description
    FROM ToDoItems
    INNER JOIN ToDoCategories
    ON ToDoItems.ToDoType = ToDoCategories.Id
  `).all();
}

/**
 * Sees if a user can log in with a given password and username
 * @param {sqllite.DatabaseSync} dbCon 
 * @param {string} username 
 * @param {string} password 
 * @returns {[true, number] | [false, undefined]}
 */
export function CanLogin(dbCon, username, password) {

  if (!dbCon.isOpen){
    
    dbCon.open();
  }

  const findUserByUsernameAndPassword = dbCon.prepare(
    `
      SELECT *
      FROM Users
      WHERE Users.UserName = ? AND Users.Password = ?   
    `
  )

  const res = findUserByUsernameAndPassword.get(username, password)

  if (res && isUserDataGram(res)) {
    
    return [true, Number(res.Id) || -1];
  }

  return [false, undefined ];
}

/**
 * Sees if a user can log in with a given password and username
 * @param {sqllite.DatabaseSync} dbCon 
 * @param {number} UserId
 * @returns {[true, UserSessionTokenDataGram] | [false, undefined]}
 */
export function GetUserSessionToken(dbCon, UserId) {

  if (!dbCon.isOpen){
    
    dbCon.open();
  }

  const findUserSessionTokenByUserId = dbCon.prepare(
    `
      SELECT *
      FROM UserSessionTokens
      WHERE UserSessionTokens.UserId = ?
      ORDER BY UserSessionTokens.Id DESC
    `
  )

  const res = findUserSessionTokenByUserId.get(UserId)

  if (res && isUserSessionTokenDataGram(res)) {
    
    return [true, res];
  }

  return [false, undefined ];
}

/**
 * Creates a token and adds it to the UserSessionToken in the database
 * @param {sqllite.DatabaseSync} dbCon 
 * @param {number} UserId
 * @returns {[string,number | bigint]}
 */
export function CreateUserSessionToken(dbCon, UserId) {

  if (!dbCon.isOpen){
    
    dbCon.open();
  }

  const setAllPreviousTokensToInvalidated = dbCon.prepare(`
    UPDATE UserSessionTokens
    SET IsInvalidated = 1
    WHERE UserId = ? AND IsInvalidated <> 1
  `);

  const changes = setAllPreviousTokensToInvalidated.run(UserId);

  LogCustom.Info(`Token invalidation for user: ${UserId}, invalidated: ${changes.changes} tokens.`)

  const createdAt = Date.now();
  const expireAt = Date.now() + config.tokenLifeTime;

  const token = generateToken({
    expiresAt: expireAt,
    issuedAt: createdAt,
    userId: UserId
  })

  const insertUserSessionToken = dbCon.prepare(`
    INSERT INTO UserSessionTokens(
      UserId,
      Token,
      IssuedAt,
      ExpiredAt,
      IsInvalidated
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `);

  const insertRes = insertUserSessionToken.run(
    UserId,
    token,
    createdAt,
    expireAt,
    0
  );

  LogCustom.Info(`Created inserted a new token for ${UserId} and ${insertRes.changes} were inserted, last id being ${insertRes.lastInsertRowid}`)
  
  return [
    token,
    changes.changes
  ]

}

export const dbCon = new sqllite.DatabaseSync(dbFilePath,{open: true})