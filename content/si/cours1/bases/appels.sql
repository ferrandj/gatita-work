-- title: Suivi client : appels et techniciens
-- ref: 82 | II. A. 1. Version antérieure — MRD suivi client
-- note: Le schéma du cours appelle la date « Date » mais ses requêtes écrivent DateAppel : ici la colonne s’appelle DateAppel.
-- schema:
--   CLIENT(NumCli, DenomCli, RueCli, CodePostal, VilleCli, TelCli)
--   APPEL(NumAppel, DateAppel, Heure, #NumCli, #CodeLog, #NumTech)
--   TECHNICIEN(NumTech, NomTech, PrenomTech)
--   LOGICIEL(CodeLog, NomLog)
CREATE TABLE CLIENT(NumCli INTEGER PRIMARY KEY, DenomCli TEXT, RueCli TEXT, CodePostal TEXT, VilleCli TEXT, TelCli TEXT);
CREATE TABLE TECHNICIEN(NumTech INTEGER PRIMARY KEY, NomTech TEXT, PrenomTech TEXT);
CREATE TABLE LOGICIEL(CodeLog TEXT PRIMARY KEY, NomLog TEXT);
CREATE TABLE APPEL(NumAppel INTEGER PRIMARY KEY, DateAppel TEXT, Heure TEXT, NumCli INTEGER, CodeLog TEXT, NumTech INTEGER);
INSERT INTO CLIENT VALUES (1,'Boulangerie Dupain','4 rue Haute','75004','Paris','0142000001'),(2,'Garage Moteur','10 av. de Lyon','69007','Lyon','0478000002'),
 (3,'Cabinet Conseil Plus','2 place Bellecour','69002','Lyon','0472000003'),(4,'Fleurs & Co','7 rue Verte','44000','Nantes','0240000004');
INSERT INTO TECHNICIEN VALUES (1,'Hugo','Victor'),(2,'Valjean','Jean'),(3,'Javert','Marie');
INSERT INTO LOGICIEL VALUES ('CPT','ComptaFacile'),('PAI','PaieExpress'),('STK','StockPro');
INSERT INTO APPEL VALUES (101,'2025-04-04','09:10',1,'CPT',1),(102,'2025-04-04','11:30',2,'STK',1),(103,'2025-04-04','14:00',3,'PAI',2),
 (104,'2025-04-12','10:00',1,'CPT',2),(105,'2025-04-12','15:45',4,'STK',2),(106,'2025-04-12','16:20',4,'STK',3),(107,'2025-04-15','08:55',2,'PAI',1);
