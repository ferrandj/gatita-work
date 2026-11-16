-- title: Vendeurs et secteurs (RIGHT / LEFT JOIN)
-- ref: 85 | II. A. 2. c. RIGHT JOIN
-- schema:
--   VENDEURS(nom, #secteur_id)
--   SECTEURS(id_secteur, nom_zone)
CREATE TABLE SECTEURS(id_secteur INTEGER PRIMARY KEY, nom_zone TEXT);
CREATE TABLE VENDEURS(nom TEXT, secteur_id INTEGER);
INSERT INTO SECTEURS VALUES (1,'Nord'),(2,'Sud'),(3,'Est'),(4,'Ouest');
INSERT INTO VENDEURS VALUES ('Alice',1),('Bruno',1),('Chloé',2),('Driss',4);
