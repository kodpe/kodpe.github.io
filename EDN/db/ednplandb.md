
### Base de données - Cours
```
https://ecampusontario.pressbooks.pub/adm1770sandbox/chapter/bases-de-donnees/

Entity Relationship Diagram (ERD)
https://www.lucidchart.com/pages/er-diagrams

https://openclassrooms.com/fr/courses/5671741-design-the-logical-model-of-your-relational-database
```

Plan pour ma nouvelle DB :

- une liste d'utilisateur,

### UN USER

Pour chaque utilisateur :
- un identifiant unique
- un nom (string)
- un token unique permanent (pour se connecter)
- Plusieurs segments de revisions possibles
- Une table compteur d'item
- Une liste de jours libres
- Une table d'affinite pour les matieres
- une table de mois (liste de mois potentiellement sur plusieurs annees)
- un parametre objectif nombre de revisions par item

Pour chaque item d'une table compteur d'item :
- un identifiant unique
- un edn id
- une quantité (nombre d'occurences de revisions)

Pour chaque jour libre :
- un identifiant unique
- une date
- un label

Pour la table d'affinite pour chaque matiere :
- un identifiant unique
- un edn matiere id
- un affinity level -1 / 0 / 1 (mauvaise / neutre / bonne)

Pour la table de mois chaque mois :
- un identifiant unique
- une date mois / annee (01-26)
- un nombre d'heure

### UN SEGMENT

un segment = periode de revision avec :
- un identifiant unique
- une date de debut
- une date de fin
- un etat actif / inactif
- une liste d'items
- une liste de pratiques
- une liste de matieres

Pour chaque item de chaque segment :
- un identifiant unique
- un edn id
- un etat done / undone
- une date

Pour chaque matiere de la liste de matiere :
- un identifiant unique
- un edn matiere id

Pour chaque pratique d'une liste de pratique :
- un identifiant unique
- un label
- un mode (unique, daily, hebdo)
- si unique une date
- si hebdo une variable pour representer un ou plusieurs jour de la semaine (LMMJVSD mask)

```
User
 ├── Segments
 │     ├── Segment Items
 │     ├── Segment Matieres
 │     └── Segment Practices
 │
 ├── Free Days
 ├── Months
 ├── Affinities
 └── Item Counters
 ```


### Types atomiques
 | Type | Déclarer | Modifier | Comparer | Itérer | Convertir |
 |-|-|-|-|-|-|
 |`int`|`var a int`|a = 42|a|b|
 |`byte`|`var a int`|a += 1|a|b|
 |`rune`|`var a int`|a += 1|a|b|
 |`string`|`var a int`|a += 1|a|b|
 |`[]rune`|`var a int`|a += 1|a|b|
 |`[]byte`|`var a int`|a += 1|a|b|
 |`[]int`|`var a int`|a += 1|a|b|
 |`[]string`|`var a int`|a += 1|a|b|

### Types slices (tableaux / listes)

### Types composées (structures)
 | Type | Déclarer | Modifier | Comparer | Itérer | Convertir |
 |-|-|-|-|-|-|
 |`string`|`var a string`|a += 1|a|boucle for|

 ###
```
1, 9, 13, 15, 22, 23, 24, 25

26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50

51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 73, 74, 75

76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 95, 96, 97, 98, 100

102, 104, 105, 106, 107, 110, 114, 118, 120, 121, 122, 124

137, 142, 144, 146, 147, 148, 149, 150

151, 154, 155, 156, 158, 159, 161, 163, 164, 168

176, 177, 186, 187, 188, 189

201, 203, 204, 207, 212, 213, 214, 215, 219, 220, 224

230, 238, 240, 241, 242, 243, 245, 247, 248, 249, 250

253, 254, 255, 256, 258, 269, 260, 264, 269, 271, 274

278, 283, 285, 286, 289, 297, 300

306, 312

329, 331, 332, 334, 336, 337, 343, 344, 345, 346, 348

351, 252, 353, 354, 356, 357, 359, 364, 365
```