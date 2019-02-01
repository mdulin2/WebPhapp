/*
 * Create the Pharmacopeia table and insert some items. ID starts at 11.
 * Ran on AWS on 2/1/19
 */

USE seniordesign1;

CREATE TABLE `pharmacopeia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;


INSERT INTO seniordesign1.pharmacopeia
	(name)
VALUES
	("Xanax1"),
	("Xanax2"),
	("Vicodin"),
	("Synthroid"),
	("Delasone"),
	("Amoxil"),
	("Neurontin"),
	("Lipitor"),
	("Prinivil"),
	("Glucophage");
