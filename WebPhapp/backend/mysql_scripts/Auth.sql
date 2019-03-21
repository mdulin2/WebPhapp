-- Ran on 3/20/2019 at 11:00pm

 -- Passwords can be hashed with bcrypt, salted with a random seed value that is the size of the hashing algorithm output or larger.
CREATE TABLE users (
	ID int NOT NULL AUTO_INCREMENT,
	role VARCHAR(50) NOT NULL,
	role_id int NOT NULL,
	username VARCHAR(255) NOT NULL,
	password VARCHAR (512) NOT NULL,
	PRIMARY KEY(ID, username)

);

-- salt is associated with a userID
CREATE TABLE salts (
	ID int NOT NULL,
	salt VARCHAR (255) NOT NULL ,
    PRIMARY KEY (ID),
    FOREIGN KEY (ID) REFERENCES users(ID)
);
-- For keeping track of the role id for each class of user. 
CREATE TABLE Role_Id_Count (
	role VARCHAR(50) NOT NULL,
	id_number int NOT NULL,
	PRIMARY KEY(role)
);

INSERT INTO Role_Id_Count(role, id_number)
VALUES("Admin",0),
("Prescriber",0),
("Dispenser",0),
("Patient",0),
("Government",0);


-- UPDATE Role_Id_Count as R SET R.id_number = (R.id_number +1) WHERE R.role = ?; SELECT id_number FROM Role_Id_Count WHERE role = ?;

-- select id_number from Role_Id_Count WHERE role = "Patient";
