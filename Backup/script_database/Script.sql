CREATE TABLE Account (
	userid INT NOT NULL AUTO_INCREMENT UNIQUE,
	username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
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
	acceptaccountmanagement BOOLEAN NOT NULL DEFAULT false,
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
    discount INT NOT NULL DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    discountcount INT NOT NULL DEFAULT 0 CHECK (discountcount >= 0),
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
	createtime DATE NOT NULL DEFAULT NOW(),
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

CREATE TABLE OTP (
	otpid INT NOT NULL AUTO_INCREMENT UNIQUE,
	otpcode VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL,
	PRIMARY KEY(otpid)
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
ALTER TABLE OTP
ADD FOREIGN KEY(email) REFERENCES Account(email)
ON UPDATE NO ACTION ON DELETE NO ACTION;