DROP DATABASE ProjectWebsite;
CREATE DATABASE ProjectWebsite;

USE ProjectWebsite;

CREATE TABLE Account (
	userid INT NOT NULL AUTO_INCREMENT UNIQUE,
	username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL,
	password TEXT NOT NULL,
	money DECIMAL(15,3) NOT NULL DEFAULT 0 CHECK(money >= 0),
	revenue DECIMAL(15,3) NOT NULL DEFAULT 0 CHECK(revenue >= 0),
	avatarpath TEXT NOT NULL DEFAULT "public\\image\\system\\default_user.png",
	Verify BOOLEAN NOT NULL DEFAULT false,
	createtime DATETIME NOT NULL DEFAULT NOW(),
	permissionid VARCHAR(255) NOT NULL DEFAULT 'member',
	bio VARCHAR(255),
	penalty INT,
	PRIMARY KEY(userid)
);

ALTER TABLE Account AUTO_INCREMENT = 10000000;

CREATE TABLE Permission (
	permissionname VARCHAR(255) NOT NULL UNIQUE,
	acceptproductmanagement BOOLEAN NOT NULL DEFAULT false,
	acceptproductmanagementall BOOLEAN NOT NULL DEFAULT false,
	acceptcensorproduct BOOLEAN NOT NULL DEFAULT false,
	acceptcensorcooperate BOOLEAN NOT NULL DEFAULT false,
	acceptaccountmanagement BOOLEAN NOT NULL DEFAULT false,
	acceptviewchart BOOLEAN NOT NULL,
	acceptviewchartall BOOLEAN NOT NULL,
	PRIMARY KEY(permissionname)
);

CREATE TABLE Product (
	productid VARCHAR(255) NOT NULL UNIQUE,
	sellerid VARCHAR(255) NOT NULL,
	producttitle VARCHAR(255) NOT NULL,
	productsubtitle VARCHAR(255) NOT NULL,
	information TEXT,
	productcontent TEXT NOT NULL,
	price DECIMAL(15,3) NOT NULL CHECK(price > 0),
	quantity INT NOT NULL CHECK(quantity >= 0),
	producticonpath TEXT NOT NULL,
	productpath VARCHAR(255) NOT NULL,
	createtime DATETIME NOT NULL DEFAULT NOW(),
	status VARCHAR(255) NOT NULL,
    totalsold INT NOT NULL DEFAULT 0 CHECK(totalsold >= 0),
    ratingstar DECIMAL(2, 1) NOT NULL DEFAULT 0,
    EvaluateTotal INT NOT NULL DEFAULT 0,
	PRIMARY KEY(productid)
);

CREATE TABLE Cart (
	cartid INT NOT NULL AUTO_INCREMENT UNIQUE,
	userid INT NOT NULL,
	productid VARCHAR(255) NOT NULL,
	PRIMARY KEY(cartid)
);

CREATE TABLE Penalty (
	penaltyid INT NOT NULL AUTO_INCREMENT UNIQUE,
	penaltyreason VARCHAR(255) NOT NULL,
	penaltystart DATETIME NOT NULL,
	penaltyend DATETIME NOT NULL,
	penaltyby INT NOT NULL,
	PRIMARY KEY(penaltyid)
);

CREATE TABLE PurchaseHistory (
	historyid INT NOT NULL AUTO_INCREMENT UNIQUE,
	userid INT NOT NULL,
	productid VARCHAR(255) NOT NULL,
	totalprice DECIMAL(15,3) NOT NULL CHECK(totalprice > 0),
	totalquantity INT NOT NULL CHECK(totalquantity > 0),
	PRIMARY KEY(historyid)
);

CREATE TABLE Evaluate (
	evaluateid INT NOT NULL AUTO_INCREMENT UNIQUE,
	userid INT NOT NULL,
	productid VARCHAR(255) NOT NULL,
	rating DECIMAL(2,1) NOT NULL CHECK(rating >= 1 AND rating <= 5),
	comment TEXT,
	createtime DATETIME DEFAULT NOW(),
	PRIMARY KEY(evaluateid)
);

CREATE TABLE Picture (
	pictureid INT NOT NULL AUTO_INCREMENT UNIQUE,
	productid VARCHAR(255) NOT NULL,
	picturepath TEXT NOT NULL,
	PRIMARY KEY(pictureid)
);

ALTER TABLE Account
ADD FOREIGN KEY(permissionid) REFERENCES Permission(permissionname)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Cart
ADD FOREIGN KEY(userid) REFERENCES Account(userid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Cart
ADD FOREIGN KEY(productid) REFERENCES Product(productid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Account
ADD FOREIGN KEY(penalty) REFERENCES Penalty(penaltyid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE PurchaseHistory
ADD FOREIGN KEY(productid) REFERENCES Product(productid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE PurchaseHistory
ADD FOREIGN KEY(userid) REFERENCES Account(userid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Picture
ADD FOREIGN KEY(productid) REFERENCES Product(productid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Evaluate
ADD FOREIGN KEY(productid) REFERENCES Product(productid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Evaluate
ADD FOREIGN KEY(userid) REFERENCES Account(userid)
ON UPDATE NO ACTION ON DELETE NO ACTION;

-- member permission
INSERT INTO Permission (permissionname)
VALUE ("member");

-- seller permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptviewchart)
VALUE ("seller", true, true);

-- active moderator permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptcensorproduct, acceptviewchart, acceptviewchartall)
VALUE ("moderator", true, true, true, true);

-- developer permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptproductmanagementall, acceptviewchart, acceptviewchartall)
VALUE ("developer", true, true, true, true);

-- active admim permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptproductmanagementall, acceptviewchart, acceptviewchartall, acceptcensorproduct, acceptcensorcooperate, acceptaccountmanagement)
VALUE ("admin", true, true, true, true, true, true, true);


DELIMITER //

CREATE TRIGGER update_product_rating_after_insert
AFTER INSERT ON Evaluate
FOR EACH ROW
BEGIN
    UPDATE Product
    SET ratingstar = (
        SELECT AVG(rating)
        FROM Evaluate
        WHERE productid = NEW.productid
    ),
    EvaluateTotal = EvaluateTotal + 1
    WHERE productid = NEW.productid;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_product_rating_after_delete
AFTER DELETE ON Evaluate
FOR EACH ROW
BEGIN
    UPDATE Product
    SET ratingstar = COALESCE(
        (SELECT AVG(rating)
         FROM Evaluate
         WHERE productid = OLD.productid),
        0
    ),
    EvaluateTotal = GREATEST(EvaluateTotal - 1, 0)
    WHERE productid = OLD.productid;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_product_rating_after_update
AFTER UPDATE ON Evaluate
FOR EACH ROW
BEGIN
    IF OLD.productid <> NEW.productid OR OLD.rating <> NEW.rating THEN
        UPDATE Product
        SET ratingstar = COALESCE(
            (SELECT AVG(rating)
             FROM Evaluate
             WHERE productid = OLD.productid),
            0
        )
        WHERE productid = OLD.productid;
        
        UPDATE Product
        SET ratingstar = (
            SELECT AVG(rating)
            FROM Evaluate
            WHERE productid = NEW.productid
        )
        WHERE productid = NEW.productid;
    END IF;
END //

DELIMITER ;

SELECT * FROM Account;
SELECT * FROM Permission;
SELECT * FROM Picture;
SELECT * FROM Product;
SELECT * FROM Cart;
SELECT * FROM Penalty;
SELECT * FROM PurchaseHistory;
SELECT * FROM Apply;
SELECT * FROM Recruitment;
SELECT * FROM Evaluate;

DELETE FROM Picture;
DELETE FROM Evaluate;
DELETE FROM Cart;
DELETE FROM PurchaseHistory;
DELETE FROM Product;

