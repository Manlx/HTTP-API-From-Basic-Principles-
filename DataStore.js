import sqllite from "node:sqlite"
import fs from "fs"

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

  dbCon.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");

  dbCon.exec("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT, description TEXT)");
  
  const userInsert = dbCon.prepare("INSERT INTO users(name, email) values (?, ?)");

  userInsert.run('Person A','PersonA@gmail.com')

  userInsert.run('Person B','PersonB@gmail.com')

  userInsert.run('Person C','PersonC@gmail.com')

  userInsert.run('Person C','PersonC@gmail.com')

  const selectAllUsers = dbCon.prepare(`SELECT * FROM users;`)
  
  dbCon.close()
}

export const dbCon = new sqllite.DatabaseSync(dbFilePath,{open: true})