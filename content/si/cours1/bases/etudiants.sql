-- title: Étudiants, devoirs (jointures et sous-requêtes)
-- ref: 83 | II. A. 2. Version SQL 92 — INNER JOIN
-- schema:
--   ETUDIANT(Code, Nom, Prenom)
--   DEVOIR(NumDev, Date)
--   PASSER(#Code, #NumDev, Note)
CREATE TABLE ETUDIANT(Code INTEGER PRIMARY KEY, Nom TEXT, Prenom TEXT);
CREATE TABLE DEVOIR(NumDev INTEGER PRIMARY KEY, Date TEXT);
CREATE TABLE PASSER(Code INTEGER, NumDev INTEGER, Note REAL, PRIMARY KEY(Code, NumDev));
INSERT INTO ETUDIANT VALUES (1,'Lemoine','Julie'),(2,'Benali','Sami'),(3,'Fontaine','Léa'),(4,'Nguyen','Tom'),(5,'Robert','Inès'),(6,'Caron','Hugo');
INSERT INTO DEVOIR VALUES (1,'2024-11-15'),(2,'2025-01-20'),(3,'2025-03-10');
INSERT INTO PASSER VALUES (1,1,12),(1,2,15),(1,3,17),(2,1,9),(2,2,11),(3,1,14),(4,2,8),(4,3,10),(5,1,16);
