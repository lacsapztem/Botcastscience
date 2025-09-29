# Botcastscience

Botcastscience est un serveur permettant de communiquer avec le discord de Podcast Science
Son but premier est de collecter les images postées dans un channel Discord et la diffuser sur une page Web suscpetible d'etre diffusée pendant les live Youtube via OBS
Certaine fonctionnalités ont été rajoutées afin de permettre une utilisation pour diffuser les illustrations pendant les radios-dessinées
D'autres fonctionnalités comme une commande issue de l'ancienne chatroom n'ont d'autres raisons d'etre que l'exploration des API discord et la nostalgie

## Diffusion des images

### Les commandes

La diffusion d'image est lancée en lançant la commande `/scanimage` depuis un channel discord. Un booleen est demandé en parametre pour définir si l'image affichée est mise à jour quand une nouvelle image arrive ou si celle ci est juste ajoutée à la suite
En retour, le bot confirme le lancement du scan et indique l'URL où se trouve la page diffusant les images
Si l'on veut modifier le comportement en cas de nouvelle image, il suffit de relancer la commande
Plusieurs channels peuvent etre scannés simultanement, dans ce cas, chacun aura sa propre page de diffusion

La commande `/stopscanimage` permet d'arreter le scan du channel où la commande est appelé

La commande `/imageurl` permet de récuperer l'URL de la page de diffusion pour un channel en cours de scan


### La page de diffusion

La page de diffusion affiché est divisée en 2 parties :
* L'image en cours de visualisation
* Une barre permettant de prévisualiser les images suivantes et précédente
Il est possible de se déplacer dans la liste d'image avec les flèches droite et gauche
La flèche vers le bas affiche des infos de débug dans la console du navigateur

Il est aussi possible de naviger avec des barres/boutons lattérale ne s'affichant que si le curseur se déplace vers le bord de la fenetre

La navigation via le swipe est possible en swipant vers les la droite et la gauche
Il est également possible en passer l'image en plein écran en swipant vers le haut et repasser en mode normal en swipant vers le bas

Il est possible d'ouvrir plusieurs pages en parallele. Dans ce cas, chaque page affichera la meme image et la navigation dans une page se refletera sur les autres, permettant ainsi un mode "télécommande"


## Divers

La commande `/tchin` permet permet de trinquer avec un autre utilisateur du discord

## TODO

* Limiter le scanimage au groupe podcasteur => Admin fait
* gestion d'une demande de changement de curseur au serveur avant le changement (prevoir ackno des client avant auorisation du changement suivant, quid des clients qui ne réponde pas) => remplacer par une ou des files d'atteente
* Commenter + doc
* possibilité de bloquer les changements en in et en out (et de les rattraper)
* un fichier de conf avec les boissons
