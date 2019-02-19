/*
 * Connection strings for remote database connection.
 * DO NOT PUSH THIS FILE TO GITHUB. BAD THINGS WILL HAPPEN TO YOU.
 * 
 *  Location:
 *      WebPhapp/WebPhapp/backend/connections.js
 *  Maintainer:
 *      Jacob Krantz. If you can't connect, let me know. It should always be live.
 */

var connections = {
    // MySQL DB connection on AWS
    MySQL: false,

    // true if use blockchain, false if use dummy data (JSON)
    Blockchain: false
};

module.exports = connections;
