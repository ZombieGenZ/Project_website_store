DROP DATABASE ProjectWebsite;
CREATE DATABASE ProjectWebsite;

USE ProjectWebsite;

CREATE TABLE Account (
	userid VARCHAR(255) NOT NULL UNIQUE,
	username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL,
	password TEXT(65535) NOT NULL,
	money DECIMAL(15, 3) NOT NULL DEFAULT 0 CHECK(money >= 0),
	Verify BOOLEAN NOT NULL DEFAULT false,
	permissionid VARCHAR(255) NOT NULL DEFAULT 'member',
	penalty VARCHAR(255),
	PRIMARY KEY(userid)
);

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
	sellerid VARCHAR(255) NOT NULL,
	producttitle VARCHAR(255) NOT NULL,
	productsubtitle VARCHAR(255) NOT NULL,
	productcontent TEXT(65535) NOT NULL,
	price DECIMAL(15, 3) NOT NULL CHECK(price > 0),
	quantity INT NOT NULL CHECK(quantity > 0),
	status VARCHAR(255) NOT NULL,
	PRIMARY KEY(productid)
);

CREATE TABLE Voucher (
	voucherid VARCHAR(255) NOT NULL UNIQUE,
	productid VARCHAR(255) NOT NULL,
	vouchertitle VARCHAR(255) NOT NULL,
	vouchercode VARCHAR(255) NOT NULL,
	voucherdiscount DECIMAL(4,1) NOT NULL CHECK(voucherdiscount >= 0.0 AND voucherdiscount  <=  100.0),
	voucherquantity INT NOT NULL CHECK(voucherquantity > 0),
	PRIMARY KEY(voucherid)
);

CREATE TABLE Cart (
	cartid INT NOT NULL AUTO_INCREMENT UNIQUE,
	userid VARCHAR(255) NOT NULL,
	productid VARCHAR(255) NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
	PRIMARY KEY(cartid)
);

CREATE TABLE Penalty (
	penaltyid VARCHAR(255) NOT NULL UNIQUE,
	penaltyreason VARCHAR(255) NOT NULL,
	penaltystart DATETIME NOT NULL,
	penaltyend DATETIME NOT NULL,
	penaltyby VARCHAR(255) NOT NULL,
	PRIMARY KEY(penaltyid)
);

CREATE TABLE PurchaseHistory (
	historyid VARCHAR(255) NOT NULL UNIQUE,
	userid VARCHAR(255) NOT NULL,
	productid VARCHAR(255) NOT NULL,
	totalprice DECIMAL(15, 3) NOT NULL CHECK(totalprice > 0),
	totalquantity INT NOT NULL CHECK(totalquantity > 0),
	voucherid VARCHAR(255),
	PRIMARY KEY(historyid)
);

CREATE TABLE Apply (
	applyid VARCHAR(255) NOT NULL UNIQUE,
	recruitmentid VARCHAR(255) NOT NULL,
	userid VARCHAR(255) NOT NULL,
	answer1 TEXT(65535),
	answer2 TEXT(65535),
	answer3 TEXT(65535),
	answer4 TEXT(65535),
	answer5 TEXT(65535),
	answer6 TEXT(65535),
	answer7 TEXT(65535),
	answer8 TEXT(65535),
	answer9 TEXT(65535),
	answer10 TEXT(65535),
	answer11 TEXT(65535),
	answer12 TEXT(65535),
	answer13 TEXT(65535),
	answer14 TEXT(65535),
	answer15 TEXT(65535),
	PRIMARY KEY(applyid)
);

CREATE TABLE Recruitment (
	recruitmentid VARCHAR(255) NOT NULL UNIQUE,
	position VARCHAR(255) NOT NULL,
	quantity INT NOT NULL,
	question1 TEXT(65535),
	question2 TEXT(65535),
	question3 TEXT(65535),
	question4 TEXT(65535),
	question5 TEXT(65535),
	question6 TEXT(65535),
	question7 TEXT(65535),
	question8 TEXT(65535),
	question9 TEXT(65535),
	question10 TEXT(65535),
	question11 TEXT(65535),
	question12 TEXT(65535),
	question13 TEXT(65535),
	question14 TEXT(65535),
	question15 TEXT(65535),
	PRIMARY KEY(recruitmentid)
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

-- test Penalty
INSERT INTO Penalty
VALUE ("test", "Khóa tài khaonr", NOW(), NOW(), "111ec122-564a-4fbb-a0b4-42b7e1a10d8e");

SELECT * FROM Account;
SELECT * FROM Permission;
SELECT * FROM Badge;
SELECT * FROM Product;
SELECT * FROM Voucher;
SELECT * FROM Cart;
SELECT * FROM Penalty;
SELECT * FROM PurchaseHistory;
SELECT * FROM Apply;
SELECT * FROM Recruitment;

SELECT * FROM Account;
SELECT * FROM Penalty;