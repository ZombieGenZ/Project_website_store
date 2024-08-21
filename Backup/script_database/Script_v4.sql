DROP DATABASE ProjectWebsite;
CREATE DATABASE ProjectWebsite;

USE ProjectWebsite;

CREATE TABLE Account (
	userid INT NOT NULL AUTO_INCREMENT UNIQUE,
	username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL,
	password TEXT NOT NULL,
	money DECIMAL(15, 3) NOT NULL DEFAULT 0 CHECK(money >= 0),
	revenue DECIMAL(15, 3) NOT NULL DEFAULT 0 CHECK(revenue >= 0),
	avatarpath TEXT NOT NULL,
	Verify BOOLEAN NOT NULL DEFAULT false,
	permissionid VARCHAR(255) NOT NULL DEFAULT 'member',
	penalty INT,
	PRIMARY KEY(userid)
);

ALTER TABLE Account AUTO_INCREMENT = 10000000;

CREATE TABLE Permission (
	permissionname VARCHAR(255) NOT NULL UNIQUE,
	acceptproductmanagement BOOLEAN NOT NULL DEFAULT false,
	acceptproductmanagementall BOOLEAN NOT NULL DEFAULT false,
	acceptvouchermanagement BOOLEAN NOT NULL DEFAULT false,
	acceptvouchermanagementall BOOLEAN NOT NULL DEFAULT false,
	acceptcensorproduct BOOLEAN NOT NULL DEFAULT false,
	acceptcensorcooperate BOOLEAN NOT NULL DEFAULT false,
	acceptaccountmanagement BOOLEAN NOT NULL DEFAULT false,
	acceptviewchart BOOLEAN NOT NULL,
	acceptviewchartall BOOLEAN NOT NULL,
	badge VARCHAR(255),
	PRIMARY KEY(permissionname)
);

CREATE TABLE Badge (
	badgename VARCHAR(255) NOT NULL UNIQUE,
	badgeicon VARCHAR(255) NOT NULL,
	PRIMARY KEY(badgename)
);

CREATE TABLE Product (
	productid VARCHAR(255) NOT NULL UNIQUE,
	sellerid INT NOT NULL,
	producttitle VARCHAR(255) NOT NULL,
	productsubtitle VARCHAR(255) NOT NULL,
	information TEXT,
	productcontent TEXT NOT NULL,
	price DECIMAL(15, 3) NOT NULL CHECK(price > 0),
	quantity INT NOT NULL CHECK(quantity > 0),
	producticonpath TEXT NOT NULL,
	productpath VARCHAR(255) NOT NULL,
	status VARCHAR(255) NOT NULL,
	PRIMARY KEY(productid)
);

CREATE TABLE Voucher (
	voucherid INT NOT NULL AUTO_INCREMENT UNIQUE,
	productid VARCHAR(255) NOT NULL,
	vouchertitle VARCHAR(255) NOT NULL,
	vouchercode VARCHAR(255) NOT NULL,
	voucherdiscount DECIMAL(4, 1) NOT NULL CHECK(voucherdiscount >= 0 AND voucherdiscount <= 100),
	voucherquantity INT NOT NULL CHECK(voucherquantity > 0),
	PRIMARY KEY(voucherid)
);

CREATE TABLE Cart (
	cartid INT NOT NULL AUTO_INCREMENT UNIQUE,
	userid INT NOT NULL,
	productid VARCHAR(255) NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
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
	totalprice DECIMAL(15, 3) NOT NULL CHECK(totalprice > 0),
	totalquantity INT NOT NULL CHECK(totalquantity > 0),
	voucherid INT,
	PRIMARY KEY(historyid)
);

CREATE TABLE Apply (
	applyid INT NOT NULL AUTO_INCREMENT UNIQUE,
	recruitmentid INT NOT NULL,
	userid INT NOT NULL,
	answer1 TEXT,
	answer2 TEXT,
	answer3 TEXT,
	answer4 TEXT,
	answer5 TEXT,
	answer6 TEXT,
	answer7 TEXT,
	answer8 TEXT,
	answer9 TEXT,
	answer10 TEXT,
	answer11 TEXT,
	answer12 TEXT,
	answer13 TEXT,
	answer14 TEXT,
	answer15 TEXT,
	PRIMARY KEY(applyid)
);

CREATE TABLE Recruitment (
	recruitmentid INT NOT NULL AUTO_INCREMENT UNIQUE,
	position VARCHAR(255) NOT NULL,
	quantity INT NOT NULL,
	question1 TEXT,
	question2 TEXT,
	question3 TEXT,
	question4 TEXT,
	question5 TEXT,
	question6 TEXT,
	question7 TEXT,
	question8 TEXT,
	question9 TEXT,
	question10 TEXT,
	question11 TEXT,
	question12 TEXT,
	question13 TEXT,
	question14 TEXT,
	question15 TEXT,
	PRIMARY KEY(recruitmentid)
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
ALTER TABLE Permission
ADD FOREIGN KEY(badge) REFERENCES Badge(badgename)
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
ALTER TABLE Voucher
ADD FOREIGN KEY(productid) REFERENCES Product(productid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE PurchaseHistory
ADD FOREIGN KEY(productid) REFERENCES Product(productid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE PurchaseHistory
ADD FOREIGN KEY(voucherid) REFERENCES Voucher(voucherid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE PurchaseHistory
ADD FOREIGN KEY(userid) REFERENCES Account(userid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Apply
ADD FOREIGN KEY(recruitmentid) REFERENCES Recruitment(recruitmentid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Apply
ADD FOREIGN KEY(userid) REFERENCES Account(userid)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE Picture
ADD FOREIGN KEY(productid) REFERENCES Product(productid)
ON UPDATE NO ACTION ON DELETE NO ACTION;

-- badge
INSERT INTO Badge (badgename, badgeicon)
VALUES ("developer", '<i class="fa-solid fa-screwdriver-wrench developer"></i>'),
	   ("admin", '<i class="fa-solid fa-shield-halved manage"></i> ');

-- member permission
INSERT INTO Permission (permissionname)
VALUE ("member");

-- seller permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptvouchermanagement, acceptviewchart)
VALUE ("seller", true, true, true);

-- active moderator permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptvouchermanagement, acceptcensorproduct, acceptviewchart, acceptviewchartall)
VALUE ("moderator", true, true, true, true, true);

-- developer permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptproductmanagementall, acceptvouchermanagement, acceptvouchermanagementall, acceptviewchart, acceptviewchartall, badge)
VALUE ("developer", true, true, true, true, true, true, "developer");

-- active admim permission
INSERT INTO Permission (permissionname, acceptproductmanagement, acceptproductmanagementall, acceptvouchermanagement, acceptvouchermanagementall, acceptviewchart, acceptviewchartall, acceptcensorproduct, acceptcensorcooperate, acceptaccountmanagement, badge)
VALUE ("admin", true, true, true, true, true, true, true, true, true, "admin");

SELECT * FROM Account;
SELECT * FROM Permission;
SELECT * FROM Badge;
SELECT * FROM Picture;
SELECT * FROM Product;
SELECT * FROM Voucher;
SELECT * FROM Cart;
SELECT * FROM Penalty;
SELECT * FROM PurchaseHistory;
SELECT * FROM Apply;
SELECT * FROM Recruitment;

DELETE FROM PICTURE;
DELETE FROM PRODUCT;