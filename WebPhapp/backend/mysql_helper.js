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
    }
}
