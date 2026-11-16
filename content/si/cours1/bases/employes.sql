-- title: Table Employes (chapitre 5)
-- ref: 117 | II. B. 1. CREATE TABLE
-- schema:
--   Employes(EmployeID, Nom, Email, DateEmbauche)
CREATE TABLE Employes(EmployeID INT PRIMARY KEY, Nom VARCHAR(100), Email VARCHAR(100), DateEmbauche DATE);
INSERT INTO Employes VALUES (1,'Martin','martin@exemple.fr','2019-04-01'),(2,'Bernard','bernard@exemple.fr','2020-09-15'),
 (3,'Thomas','thomas@exemple.fr','2024-02-01'),(4,'Petit','petit@exemple.fr','2024-06-10'),(5,'Robert','robert@exemple.fr','2021-01-04');
