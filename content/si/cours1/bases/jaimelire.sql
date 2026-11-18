-- title: Bibliothèque JaimeLire (application no 13)
-- ref: 90 | Application no 13 — Bibliothèque JaimeLire
-- schema:
--   ADHERENT(NumAdh, NomAdh, PrenAdh, RueAdh, VilleAdh, #NumAdhParent)
CREATE TABLE ADHERENT(NumAdh INTEGER PRIMARY KEY, NomAdh TEXT, PrenAdh TEXT, RueAdh TEXT, VilleAdh TEXT, NumAdhParent INTEGER);
INSERT INTO ADHERENT VALUES (1,'Durand','Michel','3 rue du Pont','Tours',NULL),(2,'Durand','Lucie','3 rue du Pont','Tours',1),
 (3,'Durand','Paul','3 rue du Pont','Tours',1),(4,'Simon','Nadia','8 rue Basse','Blois',NULL),(5,'Simon','Yanis','8 rue Basse','Blois',4),
 (6,'Perrin','Gilles','1 allée des Roses','Tours',NULL);
