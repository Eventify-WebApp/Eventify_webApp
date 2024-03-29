import mysql from 'mysql2';
import dotenv from 'dotenv'

dotenv.config({path: 'api/.env'})

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
    
}).promise()

async function insert_Spectator(Name, Surname, Email, Password){

    const result = await pool.query(`INSERT INTO Spectator (Name, Surname, Email, Password) VALUES (?, ?, ?, ?)`, [Name, Surname, Email, Password]);
    return result
}

async function get_Spectator(Email){

    const result = await pool.query(`SELECT * FROM Spectator WHERE Email=?`, [Email]);
    return result[0]
}




async function get_Landlord(Email){

    const result = await pool.query(`SELECT * FROM Landlord WHERE Email=?`, [Email]);
    return result[0]
}

async function insert_Landlord(Name, Surname, Address, DateofBirth, Email, Password){

    const result = await pool.query(`INSERT INTO Landlord (Name, Surname, Address, DateofBirth, Email, Password) VALUES (?, ?, ?, ?, ?, ?)`, 
    [Name, Surname, Address, DateofBirth, Email, Password]);
    return result
}


async function insert_Performer(Name, Surname, Artist, Category, Email, Password){

    const Category_id = await get_CategoryID(Category);
    const result = await pool.query(`INSERT INTO Performer (Name, Surname, Artist, CategoryID, Email, Password) VALUES (?, ?, ?, ?, ?, ?)`, [Name, Surname, Artist, Category_id, Email, Password]);
    return result
}

async function get_Performer(Email){

    const result = await pool.query(`SELECT * FROM Spectator WHERE Email=?`, [Email]);
    return result[0]
}


async function insert_Venue(Name, Capacity, Address, Category, Landlord_id){

    const Category_id = await get_CategoryID(Category);
    const result = await pool.query(`INSERT INTO Venue (Name, Capacity, Address, CategoryID, LandlordID) VALUES (?, ?, ?, ?, ?)`, 
    [Name, Capacity, Address, Category_id, Landlord_id]);
    return result
}

async function get_Venue(pageNumber, pageSize) {
  const offset = (pageNumber - 1) * pageSize;

  const result = await pool.query(
    `SELECT Name, Capacity, Address FROM Venue ORDER BY ID LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );

  return result[0];
}



async function get_CategoryID(Category){
    console.log(Category)
    const Category_id = await pool.query(`SELECT ID FROM Category WHERE Name = ?`, [Category]);
    
    return Category_id[0][0].ID;

}


export {insert_Spectator, get_Spectator, insert_Landlord, get_Landlord, insert_Venue, get_Performer, insert_Performer, get_Venue};