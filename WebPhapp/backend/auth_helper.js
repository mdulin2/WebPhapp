// https://github.com/auth0/node-jsonwebtoken

const settings = require('./settings.js');

/*
Verify that a jwt is valid.
Args:
    token: A json web token in a base64 encoded format.
Returns:
    False is faulty in some way or the decoded jwt otherwise.
*/
function verifyToken(token){
    // imports
    var jwt = require('jsonwebtoken');
    var fs = require('fs');
    var publicKey = fs.readFileSync('public.pem');  // get public key

    return jwt.verify(token, publicKey, function(error,decoded) {
        if(error && error.name === 'TokenExpiredError'){
            console.log('Token expired...');
            return false
        }
        else if(error && error.name === 'JsonWebTokenError'){
            console.log('Invalid Web Token...' + error.message);
            return false
        }
        else if(error == null){
            return decoded;
        }
        return decoded;
    });
}
module.exports = {


    /*
    Create a new jwt token.
    Args:
        userId: The userId of the user
        role: The type of user
    Returns: jwt
        The json web token (jwt) will be returned in a base64 encoded format. The object looks like:
            {
                role: 'Patient|Admin|Dispenser|Prescriber|Government',
                sub: '7', // A ID assocaited with the user
                iat: 1551327715, //Issue time
                exp: 1551331315, // expiration
            }
    */
    createToken : function(userId, role) {
        // imports
        var jwt = require('jsonwebtoken');
        var fs = require('fs');
        var privateKey = fs.readFileSync('private.pem');

        var jwtSetup = {
            role: role.toString(),
            sub: userId.toString(),
        }

        // Expires after 24 hours. This is in the form of seconds since Jan 1st 1970
        // Automatically adds the iat claim.
        var token = jwt.sign(jwtSetup, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60});

        return token;
    },

    /*
    This is meant to serve as a middleware between all authenticated requests. For more info on this, go to     http://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api#role-js
        Args:
            roles: An array of acceptable roles of Object Type 'Role' for the route.
            req: request
            res: response
            next: A function to move onto the next part
        Returns:
            Adds the token to the req object, if successful.
    */
    checkAuth : function(roles) {
        return (req,res,next) => {

            if(settings.env === 'test'){
                // Note: Not setting the request variable to have 'token'.
                req.token = '';
                next();
                return;
            }

            var jwt_token = req.cookies['auth_token'];
            if(jwt_token == 'undefined'){
                res.status(400).send(false);
                return;
            }

            const token = verifyToken(jwt_token);
            // All verified data passed this if statement.
            if(token === false){
                res.status(400).send(false);
                return;
            }

            //role check
            const checkRole = roles.filter(validatedRole => validatedRole === token.role);

            if(checkRole.length !== 1 && token.role !== 'Admin'){
                res.status(400).send(false);
                return;
            }

            // Adds the token to the request object to be used in the next function.
            req.token = token;
            next();
        }
    }
};
