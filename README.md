# Vinci Predictions
Le logiciel a été développé pour la visualisation des données de rendements et de prédictions du projet [VINCI](https://vincisudoe.eu).

## Technologies
### Partie utilisateurs
La partie utilisateurs (Front) a été développée avec [Angular 14](https://angular.io/). Il répond à tous les critères de la technologie. Certains composants s'appuient sur [PrimeNG](https://www.primefaces.org/).

### Partie données
La gestion des données ainsi que l'hébergement sont assurés par Firebase :
- 'Firestore' stocke les données en version NoSQL. Ceci comprend : les traductions, les comptes utilisateurs, les données à visualiser ainsi que les paramètres de configuration ;
- 'Authentication' gère les comptes utilisateurs pour l'identification des utilisateurs (Firestore pour les niveaux d'accès) ;
- 'Hosting' pour l'hébergement de l'[application et la gestion du domaine](https://vinciplateforme.web.app/)

## Code et documentation
Le code et la documentation sont inclus dans le présent dépôt. Il peuvent être téléchargés.  
Le code est commenté, la documentation reprend l'ensemble des explications sur le code.
