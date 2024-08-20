CREATE DATABASE ProjectWebsite;

USE ProjectWebsite;

CREATE TABLE Account (
	userid VARCHAR(255) NOT NULL UNIQUE,
	username VARCHAR(20) NOT NULL UNIQUE,
	email VARCHAR(20) NOT NULL UNIQUE,
	password TEXT NOT NULL,
	permissionid VARCHAR(255) NOT NULL,
	PRIMARY KEY(userid)
);

CREATE TABLE Permission (
	permissionid VARCHAR(255) NOT NULL UNIQUE,
	permissionname VARCHAR(255) NOT NULL,
	acceptall BOOLEAN NOT NULL DEFAULT false,
	acceptproductmanagement BOOLEAN NOT NULL DEFAULT false,
	acceptproductmanagementall BOOLEAN NOT NULL DEFAULT false,
	acceptvouchermanagement BOOLEAN NOT NULL DEFAULT false,
	acceptvouchermanagementall BOOLEAN NOT NULL DEFAULT false,
	acceptcensorproduct BOOLEAN NOT NULL DEFAULT false,
	acceptcensorcooperate BOOLEAN NOT NULL DEFAULT false,
	acceptaccountmanagement BOOLEAN NOT NULL DEFAULT false,
	badge VARCHAR(255),
	PRIMARY KEY(permissionid)
);

-- member permission
INSERT INTO Permission (permissionid, permissionname)
VALUE ("member", "Khách hàng");

-- seller permission
INSERT INTO Permission (permissionid, permissionname, acceptproductmanagement, acceptvouchermanagement)
VALUE ("seller", "Người bán", true, true);

-- non-active moderator permission
INSERT INTO Permission (permissionid, permissionname, acceptproductmanagement, acceptvouchermanagement, acceptcensorproduct, badge)
VALUE ("moderator", "Người kiểm duyệt", true, true, true, "moderator-active-badge");

-- non-active developer permission
INSERT INTO Permission (permissionid, permissionname, acceptall, badge)
VALUE ("developer", "Chuyên viên kỹ thuật", true, "developer-active-badge");

-- non-active admim permission
INSERT INTO Permission (permissionid, permissionname, acceptall, badge)
VALUE ("admin", "Quản trị viên", true, "moderator-active-badge");

-- active moderator permission
INSERT INTO Permission (permissionid, permissionname, acceptproductmanagement, acceptvouchermanagement, acceptcensorproduct, badge)
VALUE ("moderator-active", "Người kiểm duyệt", true, true, true, "moderator-active-badge");

-- active developer permission
INSERT INTO Permission (permissionid, permissionname, acceptall, badge)
VALUE ("developer-active", "Chuyên viên kỹ thuật", true, "developer-active-badge");

-- active admim permission
INSERT INTO Permission (permissionid, permissionname, acceptall, badge)
VALUE ("admin-active", "Quản trị viên", true, "moderator-active-badge");

CREATE TABLE Badge (
	badgename VARCHAR(255) NOT NULL UNIQUE,
	badgeiconclass VARCHAR(255) NOT NULL,
	badgecolorclass VARCHAR(255) NOT NULL,
    verify BOOLEAN DEFAULT false,
	PRIMARY KEY(badgename)
);

-- non-active badge
INSERT INTO Badge (badgename, badgeiconclass, badgecolorclass)
VALUES ("moderator-badge", "fa-solid fa-screwdriver-wrench", "manage"),
	   ("developer-badge", "fa-solid fa-shield-halved manage", "developer");

-- active badge
INSERT INTO Badge (badgename, badgeiconclass, badgecolorclass, verify)
VALUES ("moderator-active-badge", "fa-solid fa-screwdriver-wrench", "manage", true),
	   ("developer-active-badge", "fa-solid fa-shield-halved manage", "developer", true);

ALTER TABLE Account
ADD FOREIGN KEY(permissionid) REFERENCES Permission(permissionid)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE Permission
ADD FOREIGN KEY(badge) REFERENCES Badge(badgename)
ON UPDATE CASCADE ON DELETE CASCADE;

SELECT * FROM account;
SELECT * FROM permission;
SELECT * FROM badge;