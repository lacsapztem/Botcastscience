# Botcastscience


Botcastscience est un serveur permettant de communiquer avec le Discord de Podcast Science.  
Son but premier est de collecter les images postées dans un channel Discord et de les diffuser sur une page web susceptible d’être affichée pendant les lives YouTube via OBS.  
Certaines fonctionnalités ont été ajoutées afin de permettre une utilisation pour diffuser les illustrations pendant les radios-dessinées.  
D’autres fonctionnalités, comme une commande issue de l’ancienne chatroom, n’ont d’autre raison d’être que l’exploration des API Discord et la nostalgie.



## Diffusion des images


### Les commandes

La diffusion d’images est lancée avec la commande `/scanimage` depuis un channel Discord.  
Un booléen est demandé en paramètre pour définir si l’image affichée doit être mise à jour lorsqu’une nouvelle image arrive, ou si celle-ci est simplement ajoutée à la suite.  

En retour, le bot confirme le lancement du scan et indique l’URL où se trouve la page diffusant les images.  
Si l’on veut modifier le comportement en cas de nouvelle image, il suffit de relancer la commande.  
Plusieurs channels peuvent être scannés simultanément : dans ce cas, chacun aura sa propre page de diffusion.  

La commande `/stopscanimage` permet d’arrêter le scan du channel où la commande est appelée.  

La commande `/imageurl` permet de récupérer l’URL de la page de diffusion pour un channel en cours de scan.  


### La page de diffusion

La page de diffusion affichée est divisée en 2 parties :  
* L’image en cours de visualisation  
* Une barre permettant de prévisualiser les images suivantes et précédentes  

Il est possible de se déplacer dans la liste d’images avec les flèches droite et gauche.  
La flèche vers le bas affiche des informations de debug dans la console du navigateur.  

Il est aussi possible de naviguer avec des barres/boutons latéraux, qui ne s’affichent que si le curseur se déplace vers le bord de la fenêtre.  

La navigation via le swipe est possible vers la droite et la gauche.  
Il est également possible de passer l’image en plein écran en swipant vers le haut, et de revenir en mode normal en swipant vers le bas.  

Il est possible d’ouvrir plusieurs pages en parallèle. Dans ce cas, chaque page affichera la même image, et la navigation dans une page se reflétera sur les autres, permettant ainsi un mode “télécommande”.  



## Divers

La commande `/tchin` permet de trinquer avec un autre utilisateur du Discord.  



## Structure du projet

L'ensemble du code se trouve dans le dossier `src/` et se trouve découpée en 2 parties principales :
- le client dont le code se trouve intégralement dans le dossier `src/client/`
- le serveur dont le code se compose de tout les fichiers ne se trouvant pas dans le repertoire client


### Partie Serveur

Le point d'entrée du serveur est le fichier `srv/app.js`, il lance le serveur express et gère le routage de celui-ci.
Par ailleurs, ce fichier instancie également la partie "serveur" du bot via la commande `botcastscience.startBot();`
Les routes utiles sont les suivantes :
   - `/channel/:channelId/` : Permet d'accéder au client d'afficher les images d'un channel. Elle utilise le moteur de rendu "ejs" et appel le fichier de vue `src/client/views/index.ejs` 
   - `/:channelId/updatecursor/` : Est appelé par le client quand celui-ci souhaite mettre à jour le curseur indiquant l'image à afficher
   - `/:channelId/imglist` : Permet au client de télécharger un JSON contenant les images disponiple pour un Channel
   - `/:channelId/events` : Permet au client d'initier et maintenir une connection qui permettra au serveur d'envoyer des informations au client 

Le reste des fichiers du serveurs composent les interfaces avec Discord et de trouvent dans le repertoire `srv/discordInterface`
* les fichiers présents dans le repertoire `srv/discordInterface/utility` contiennent chacun la définition et le code executé en cas d'appel pour chaque commande dites "slash" dans les serveurs discord où le bot est installé.
* Le fichier `srv/discordInterface/commandRegDiscord.js` enregistre les commandes présente dans le dossier utility sur les serveurs dont l'identifiant est présent dans la variable d'environnement DISCORD_SERVERS (ces serveurs doivent avoir installé l'application botcastcience). Ce fichier est executé par la commande `npm run registerDiscordCommand`
* `srv/discordInterface/imageHarvester.js` : Ce fichier comporte les fonctions permettant de récupérer les nouvelles images et gerer la connexion à discord
* `srv/discordInterface/botcastscience.js` : Ce fichier permet de faire une interface pour les fonctions précédentes en exportant un objet ayant comme membre les fonctions nécessaire au code de `app.js`. Elle exporte également la fonction `startBot()` qui permet de lancer le bot


### Partie Client

La partie client est écrite en JS et utilise React
La vue se trouve dans `src/client/views/index.ejs`. Elle charge les bibliotèques nécessaires, le fichier `src/client/views/public/css/style.css` ainsi qu'un fichier "botcastsience.js" qui ne correspond à aucun fichier réel. Ce fichier est généré par le middleware 'webpack' chargé dans app.js a partir des composants se trouvant dans `src/client/views/components`



## Configuration

La configuration se fait via des variables d'environnements :
* Variables permettant de générer l'url de consultation 
  - PORT
  - SERVER_ADDRESS
  - PROTO
* Variables permettant de se connecter à Discord
  - APP_ID
  - DISCORD_TOKEN
  - PUBLIC_KEY
* Variables permettant de définir les channels et les serveur
  - DISCORD_CHANNEL : channel pour lesquel le scan est lancé automatiquement (existe surtout pour le dev)
  - DISCORD_SERVERS



## TODO

* Limiter le `scanimage` au groupe podcasteurs → fait (admin)  
* Gestion d’une demande de changement de curseur au serveur avant le changement (prévoir un ackno des clients avant l’autorisation du changement suivant ; quid des clients qui ne répondent pas) → remplacer par une ou plusieurs files d’attente  
* Commenter + documenter  
* Possibilité de bloquer les changements en entrée et en sortie (et de les rattraper)  
* Un fichier de configuration avec les boissons  
* Securiser l'accés aux route "events" et "updatecursor"
* Voir si la variable d'environnement "DISCORD_SERVERS" ne peux pas etre remplacée par une liste des serveurs où est installé l'application