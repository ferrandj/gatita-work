-- title: Cas LADORÉ (application no 14)
-- ref: 94 | Application no 14 — Cas LADORÉ
-- note: Dans les corrigés du cours, la table LIGNE est aussi appelée [Ligne facture] avec la quantité Q : les deux écritures marchent ici.
-- schema:
--   CLIENT(NumClient, Titre, Nom, Prenom, Adresse, CP, Ville, Date_Creation)
--   FACTURE(NumFacture, Date_Facture, #NumClient)
--   LIGNE(#NumFacture, #NumArticle, Quantite)
--   ARTICLE(NumArticle, Libelle, PV_TTC, Marque, #CodeFam)
--   FAMILLE(CodeFam, LibelleFam)
CREATE TABLE FAMILLE(CodeFam TEXT PRIMARY KEY, LibelleFam TEXT);
CREATE TABLE ARTICLE(NumArticle TEXT PRIMARY KEY, Libelle TEXT, PV_TTC REAL, Marque TEXT, CodeFam TEXT);
CREATE TABLE CLIENT(NumClient INTEGER PRIMARY KEY, Titre TEXT, Nom TEXT, Prenom TEXT, Adresse TEXT, CP TEXT, Ville TEXT, Date_Creation TEXT);
CREATE TABLE FACTURE(NumFacture INTEGER PRIMARY KEY, Date_Facture TEXT, NumClient INTEGER);
CREATE TABLE LIGNE(NumFacture INTEGER, NumArticle TEXT, Quantite INTEGER, PRIMARY KEY(NumFacture, NumArticle));
CREATE VIEW [Ligne facture] AS SELECT NumFacture, NumArticle, Quantite AS Q FROM LIGNE;
INSERT INTO FAMILLE VALUES ('INL','Ladoréons'),('ACC','Accordéons'),('BAN','Bandonéons'),('ACS','Accessoires'),('MO','Main-d''œuvre');
INSERT INTO ARTICLE VALUES
 ('L-100','Ladoréon Junior',890,'Ladoré','INL'),
 ('L-200','Ladoréon Soprani Classic',1450,'Ladoré','INL'),
 ('L-300','Ladoréon Concert',2390,'Ladoré','INL'),
 ('A-120','Accordéon Soprani 120 basses',3200,'Soprani','ACC'),
 ('A-080','Accordéon Hohner Bravo 80',1290,'Hohner','ACC'),
 ('A-048','Accordéon Paolo Soprani 48 basses',990,'Soprani','ACC'),
 ('B-144','Bandonéon Arnold 144 voix',4100,'Arnold','BAN'),
 ('B-110','Bandonéon d''étude 110 voix',1650,'Hohner','BAN'),
 ('E-010','Etui rigide accordéon',189,'Ladoré','ACS'),
 ('E-011','Etui souple ladoréon',59,'Ladoré','ACS'),
 ('S-001','Sangles cuir',45,'Hohner','ACS'),
 ('P-005','Pochette de chiffons',6.5,'Ladoré','ACS'),
 ('P-006','Huile pour soufflet',5,'Ladoré','ACS'),
 ('MO-1H','Main-d''œuvre réparation (1 h)',60,'Ladoré','MO'),
 ('MO-ACC','Révision complète accordéon',240,'Ladoré','MO');
INSERT INTO CLIENT VALUES
 (1,'M.','Martin','Paul','12 rue des Lilas','75010','Paris','2017-03-12'),
 (2,'Mme','Durand','Claire','5 bd Voltaire','75011','Paris','2018-06-01'),
 (3,'M.','Bernard','Luc','8 quai Saint-Antoine','69002','Lyon','2019-10-15'),
 (4,'Mme','Petit','Sophie','3 rue Nationale','59000','Lille','2016-01-20'),
 (5,'M.','Moreau','Hugo','22 rue du Faubourg Saint-Denis','75010','Paris','2020-02-03'),
 (6,'Mme','Leroy','Emma','17 cours Lafayette','69003','Lyon','2019-09-01'),
 (7,'M.','Garnier','Louis','9 place du Marché','33000','Bordeaux','2015-05-05'),
 (8,'Mme','Roux','Alice','41 rue de la Paix','13001','Marseille','2021-11-30');
INSERT INTO FACTURE VALUES
 (1001,'2018-12-05',1),(1002,'2019-01-10',1),(1003,'2019-01-25',2),(1004,'2019-03-14',3),(1005,'2019-06-30',1),
 (1006,'2019-07-02',4),(1007,'2019-10-08',2),(1008,'2019-10-21',5),(1009,'2019-11-12',6),(1010,'2020-02-15',3),(1011,'2020-05-20',5);
INSERT INTO LIGNE VALUES
 (1001,'L-100',1),(1001,'E-011',1),
 (1002,'A-080',1),(1002,'S-001',2),
 (1003,'L-200',1),(1003,'E-010',1),(1003,'P-005',3),
 (1004,'MO-1H',2),(1004,'P-006',1),
 (1005,'B-144',1),
 (1006,'A-048',1),(1006,'E-010',1),
 (1007,'L-300',1),(1007,'MO-ACC',1),
 (1008,'P-005',5),(1008,'P-006',2),
 (1009,'A-120',1),(1009,'S-001',1),
 (1010,'MO-1H',1),
 (1011,'L-200',1);
