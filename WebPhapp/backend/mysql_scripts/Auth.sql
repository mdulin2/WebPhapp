/*
 * Create the users and salts table and insert some items.
 * Ran on AWS on 2/25/19
 */
 CREATE TABLE users (
	ID int NOT NULL AUTO_INCREMENT,
	role VARCHAR(50) NOT NULL,
	username VARCHAR(255) NOT NULL,
	password VARCHAR (512) NOT NULL,
	PRIMARY KEY(ID, username)

);

// salt is associated with a userID
CREATE TABLE salts (
	ID int NOT NULL,
	salt VARCHAR (255) NOT NULL ,
    PRIMARY KEY (ID),
    FOREIGN KEY (ID) REFERENCES users(ID)
);
