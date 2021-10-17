//BACK UP FILE ONLY >>> NOT USING THIS FILE AT ALL for GRAPHQL
const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/falling'
const pgp = require('pg-promise')();
const db = {}
db.conn = pgp(connectionString);

//DOES NOT NEED ANYTHING BELOW LINE 5 at all!

// async function rebuild() {
//     try {
//         client.connect();
//         await createTables();
//         console.log("Finished Rebuild")
//     } catch(error) {
//         console.error("Rebuild Error")
//         throw error;
//     }
// };

const createTables = () => {
    try {
        await client.query(`
        
        CREATE TABLE people(
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(90) NOT NULL,
            lastname VARCHAR(90) NOT NULL
            )
        `)

        await client.query(`
        CREATE TABLE emails (
            id SERIAL PRIMARY KEY,
            email VARCHAR (255) NOT NULL,
            person INTEGER REFERENCES people (id),
            "primary" BOOLEAN DEFAULT false
            )
        `)

    } catch(error) {
        console.error('Error Building Tables');
        throw error;
    }
};

module.exports = client;