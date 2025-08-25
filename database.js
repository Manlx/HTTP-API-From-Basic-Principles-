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

  dbCon.exec(`
    CREATE TABLE IF NOT EXISTS ToDoItems (
      Id INTEGER PRIMARY KEY, 
      DisplayName TEXT, 
      ToDoType INTEGER, 
      FOREIGN KEY(ToDoType) REFERENCES ToDoCategories(Id)
    )
  `);

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

  // const userInsert = dbCon.prepare("INSERT INTO users(name, email) values (?, ?)");

  // userInsert.run('Person A','PersonA@gmail.com')

  // userInsert.run('Person B','PersonB@gmail.com')

  // userInsert.run('Person C','PersonC@gmail.com')

  // userInsert.run('Person C','PersonC@gmail.com')

  // const selectAllUsers = dbCon.prepare(`SELECT * FROM users;`)

  // console.log(dbCon.prepare(`SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;`).all())
  // console.log(dbCon.prepare(`SELECT * FROM ToDoItemUserStatus`).all())
  // console.log(dbCon.prepare(`SELECT * FROM Users`).all())
  // console.log(dbCon.prepare(`SELECT * FROM ToDoCategories`).all())
  console.log(dbCon.prepare(`SELECT * FROM ToDoItems`).all())
  
  dbCon.close()
}

export const dbCon = new sqllite.DatabaseSync(dbFilePath,{open: true})