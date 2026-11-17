-- title: Professeurs de l’école
-- ref: 77 | I. Les requêtes : syntaxe de base
-- note: Les trois professeurs hors de Paris sont ceux de l’exemple du cours ; les autres lignes sont inventées.
-- schema:
--   PROFESSEUR(NomProf, PrenomProf, Ville)
CREATE TABLE PROFESSEUR(NomProf TEXT, PrenomProf TEXT, Ville TEXT);
INSERT INTO PROFESSEUR VALUES ('Bambou','Ken','Nanterre'),('Marlaud','Christian','Noisy-le-Sec'),('Moreau','Charles','Neuilly'),
 ('Dupuis','Anne','Paris'),('Lambert','Marc','Paris'),('Chevalier','Nora','Paris');
