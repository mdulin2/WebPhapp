/*
Functions that leverage the MySQL DB connection
*/

module.exports = {

    /*
    Given a list of drugIDs, looks up drug names in the MySQL DB.
    Args:
        drugIDs list <(int or string)>
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns (answer) which is a list of rows.
        Answer can be unpacked in a call to .then((answer) => { ... })
        Each row contains:
            row.ID (int)  the drugID in the pharmacopeia
            row.NAME (string) the name of the drug
    */
    getDrugNamesFromIDs: function(drugIDs, connection) {
        /*
        Example of a prepared statement.
        Use the question mark(?) to denote the values you want to replace.
        Then, as a second parameter, include an array of the values to replace.
        */
        var q = `
        SELECT ID, NAME
        FROM seniordesign1.pharmacopeia
        WHERE ID IN ( ? )
        `;

        return new Promise((resolve, reject) => {
            var values = [drugIDs.map(id => id.toString())];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Insert a user into the DB
    Args:
        username: Username to insert
        password: The salted and hashed password
        role: The type of user being inserted
        connection: MySQL Connection object
    Returns: Promise.
        Upon resolution, returns the insertion ID of the row.
    */
    insertUser: function(username, password, role, connection) {
        var q = `
        INSERT INTO users (role, username, password)
        VALUES (?,?,?);
        SELECT LAST_INSERT_ID();
        `;

        return new Promise((resolve, reject) => {
            var values = [role.toString(),username,password];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },


    /*
    Insert the salt into the DB
    Args:
        userID: userID to insert
        salt: Salt value for the user
        connection: MySQL Connection object
    Returns: Promise.
        Nothing is inside of the promise.
    */
    insertSalt: function(userID, salt, connection){
        var q = `
        INSERT INTO salts
        VALUES (?,?);
        `;

        return new Promise((resolve, reject) => {
            var values = [userID,salt];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Get the value of a salt, given the username
    Args:
        username: the username of the user
        connection: MySQL Connection object
    Returns: Promise
        Upon resolution the salt of a given user.
    */
    getSaltByUsername: function(username, connection){
        var q = `
        SELECT salt
        FROM salts s, users u
        WHERE s.id = u.id AND u.username = ?
        LIMIT 1;
        `;
        return new Promise((resolve, reject) => {
            var values = [username];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },

    /*
    Get the username and password
    Args:
        username: the username of the user
        password: Password that has been salted and hashed
        connection: MySQL Connection object
    Returns: Promise
        Upon resolution the user with the username and password
    */
    getUserValidation: function(username, password, connection){
        var q = `
        SELECT id, role
        FROM users
        WHERE username = ? AND password = ?
        `;
        return new Promise((resolve, reject) => {
            var values = [username,password];
            connection.query(q, values, (error, rows, fields) => {
                if (error) reject(error);
                resolve({rows, fields});
            });
        });
    },
}
