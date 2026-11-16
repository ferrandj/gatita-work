-- title: Application BASILE (exercices autocorrigés 2 et 3)
-- ref: 128 | Exercices autocorrigés — Exercice 3 Requêtes en SQL
-- note: Recruteurs, candidats, domaines, missions et propositions reprennent les exemples des pages 125-126 ; les autres lignes sont inventées. TailleMemoire est en Mo.
-- schema:
--   CANDIDAT(NumCand, nom, prenom, dateNaiss, numPortable, adresse, CP, ville, courriel, sexe, tempsTrajetMax, permis, salaireMini)
--   RECRUTEUR(CodeRec, raisonSociale, nomResp, prenomResp, adresse, CP, ville)
--   DOMAINE(NumDom, libelle)
--   MISSION(IdMission, intitule, description, dateDepot, dateDebut, dateFin, tarifHoraire, #CodeRec, #NumDom)
--   PROPOSER(#IdMission, #NumCand, DateProposition, Reponse, DateHeureReponse)
--   PREFERER(#NumCand, #NumDom)
--   FICHIER(NumFic, Nom, description, dateCreation, TailleMemoire, #CodeType, #NumCand)
CREATE TABLE CANDIDAT(NumCand INTEGER PRIMARY KEY, nom TEXT, prenom TEXT, dateNaiss TEXT, numPortable TEXT, adresse TEXT, CP TEXT, ville TEXT, courriel TEXT, sexe TEXT, tempsTrajetMax INTEGER, permis TEXT, salaireMini REAL);
CREATE TABLE RECRUTEUR(CodeRec INTEGER PRIMARY KEY, raisonSociale TEXT, nomResp TEXT, prenomResp TEXT, adresse TEXT, CP TEXT, ville TEXT);
CREATE TABLE DOMAINE(NumDom INTEGER PRIMARY KEY, libelle TEXT);
CREATE TABLE MISSION(IdMission INTEGER PRIMARY KEY, intitule TEXT, description TEXT, dateDepot TEXT, dateDebut TEXT, dateFin TEXT, tarifHoraire REAL, CodeRec INTEGER, NumDom INTEGER);
CREATE TABLE PROPOSER(IdMission INTEGER, NumCand INTEGER, DateProposition TEXT, Reponse TEXT, DateHeureReponse TEXT, PRIMARY KEY(IdMission, NumCand));
CREATE TABLE PREFERER(NumCand INTEGER, NumDom INTEGER, PRIMARY KEY(NumCand, NumDom));
CREATE TABLE FICHIER(NumFic TEXT PRIMARY KEY, Nom TEXT, description TEXT, dateCreation TEXT, TailleMemoire REAL, CodeType TEXT, NumCand INTEGER);
INSERT INTO RECRUTEUR VALUES (1443,'DUMOND SA','Dumond','Pascale','5 av Foch','75016','PARIS'),(1444,'Restaurant Gino','Paolo','Gino','Place de la Mairie','25200','MONTBELIARD'),
 (1445,'STR SARL','Rodain','Roland','67 avenue Republique','75011','PARIS'),(1446,'Propre & Net','Lucas','Sarah','4 rue Neuve','95380','LOUVRES');
INSERT INTO DOMAINE VALUES (1,'Hôtellerie'),(2,'Restauration'),(3,'Événementiel'),(4,'BTP'),(5,'Secrétariat'),(6,'Garde-enfants'),(7,'Nettoyage');
INSERT INTO CANDIDAT VALUES
 (56728,'FABRE','Laurent','1965-09-15','060010XXXX','6 rue Neuve','95380','LOUVRES','jf953@gmail.com','M',60,'B',12),
 (56729,'EL DOUIBIA','Karim','1994-07-06','078989XXXX','15 bd Leclerc','25200','SOCHAUX','k.ed@outlook.fr','M',50,NULL,11.5),
 (56730,'GARCIA','Laure','1997-10-15','075565XXXX','2 rue Noyers','25250','ETRAPPE','lgar252@live.fr','F',20,'B',11),
 (56731,'LEBEAU','Arthur','1997-07-23','070909XXXX','10 rue de Paris','22000','SAINT-BRIEUC','a.leb22@live.fr','M',50,'B',12.5),
 (52666,'JOSSELIN','Marc','1990-03-02','061122XXXX','3 rue Haute','25200','MONTBELIARD','m.joss@mail.fr','M',90,'B',13),
 (65787,'PEREZ','Ana','1999-12-01','064455XXXX','8 rue du Lac','75011','PARIS','ana.p@mail.fr','F',75,NULL,12),
 (89822,'MARTY','Chloé','2000-05-30','067788XXXX','21 rue Vaugirard','75015','PARIS','c.marty@mail.fr','F',40,'B',11.5),
 (5766,'BRUN','Théo','1995-08-08','069900XXXX','2 impasse Verte','75020','PARIS','t.brun@mail.fr','M',120,'B',12);
INSERT INTO MISSION VALUES
 (16787,'Cuisinier','Cuisinier spécialisé…','2018-06-14','2018-06-15','2018-06-15',15.00,1444,2),
 (16788,'Animateur','Animation culturelle…','2018-06-14','2018-06-18','2018-06-22',13.99,1443,3),
 (16789,'Serveur','Serveur/serveuse…','2018-06-15','2018-06-20','2018-06-24',11.99,1444,2),
 (1244,'Agent d''entretien','Nettoyage de bureaux…','2019-04-20','2019-05-02','2019-05-30',12.50,1446,7),
 (1250,'Réceptionniste','Accueil hôtel…','2019-03-01','2019-03-10','2019-04-10',12.00,1443,1),
 (1262,'Plongeur','Plonge en cuisine…','2019-02-11','2019-02-12','2019-02-28',11.00,1444,2);
INSERT INTO PROPOSER VALUES
 (16787,56729,'2018-06-14','O','2018-06-14 13:14'),(16787,65787,'2018-06-14',NULL,NULL),(16787,52666,'2018-06-14','N','2018-06-14 14:05'),
 (16788,89822,'2018-06-14','O','2018-06-15 23:15'),(1244,5766,'2019-04-25',NULL,NULL),(1244,56728,'2019-05-10',NULL,NULL),
 (1250,65787,'2019-03-02','N','2019-03-02 10:00'),(1262,56729,'2019-02-11','O','2019-02-11 09:30');
INSERT INTO PREFERER VALUES (56729,2),(52666,2),(52666,7),(65787,2),(65787,1),(89822,3),(5766,7),(56728,7),(56731,4);
INSERT INTO FICHIER VALUES ('F124565','Bulpayejos.pdf','bulletin de paye mars 2019 de Josselin','2019-03-03',2.5,'T2',52666),
 ('F124566','CV_Josselin.pdf','CV','2019-01-10',48,'T1',52666),('F124567','Diplome_Josselin.pdf','diplôme','2019-01-10',12,'T3',52666),
 ('F124570','CV_Perez.pdf','CV','2019-02-01',30,'T1',65787),('F124571','Permis_Perez.pdf','permis','2019-02-01',35,'T4',65787),
 ('F124580','CV_Marty.pdf','CV','2019-02-05',8,'T1',89822);
