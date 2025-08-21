# Zadání

Vytvořte webovou aplikaci, sloužící studentům pro prodej použitých učebnic.


## Hlavní funkcionality
Student po přihlášení může vytvořit příspěvek o prodeji své učebnice  
Student po přihlášení může zobrazit příspěvky a filtrovat/řadit je


## Podrobné zadání
- Přihlášení do aplikace bude řešeno pomocí SSO (Single Sign On), prostřednictvím Office 365 účtu s využitím technologie OAuth 2.0
- Příspěvek bude obsahovat název, datum vytvoření, 3 fotky učebnice, dále informace o předmětu/ech, pro které je učebnice určena, o ročníku/cích, ve kterých student učebnici potřebuje, stav učebnice a finálně cenu. Cena bude stanovena buď pevně nebo bude reprezentována jako rozmezí od-do
- Student si příspěvky může prohlížet, může je řadit "Od nejnovějšího" (default) nebo "Od nejlevnějšího"
- Student může též příspěvky filtrovat dle předmětu, ročníku, stavu nebo rozmezí ceny od-do (Pro příspěvky, kde je cena vyjádřena rozmezím s bude spodní hranice porovnávat s max cenou a vrchní hranice porovnávat s min cenou)
- Student, který příspěvek vytvořil by měl mít možnost ho smazat (např. z důvodu úspěšného prodeje), jinak by se měly příspěvky mazat po 1 měsíci (v základu) nebo po době vymezené uživatelem (lze omezit)
- Uživatelé by měli mít možnost smazat vlastní účet, mělo by zde být i automatické mazání účtů pro účty, které nebyly přihlášeny posledních 15 měsíců
- Finálně by zde měl být admin, tento bude mít své stránky, na které bude mít přístup jen on. Admin může mazat jakýkoli příspěvek i mazat všechny příspěvky jakéhokoliv uživatele. Dále má také možnost smazat uživatelský účet a zařadit ho na blacklist. Takový uživatel pak nikdy nedostane přístup na platformu, samozřejmě lze uživatele také vymazat z blacklistu.
- Nakonec má admin možnost přidávat, či odebírat vyučovací předměty.


# Řešení


## Využité technologie - tech stack

### MongoDB
Jakožto NoSQL databáze nám MongoDB poskytuje jisté funkcionality, které by jinak byly obtížněji implementovatelné (ať už datové typy array a object nebo funkcionality jako TTL index). Kromě toho se vyhneme dlouhým a náročným JOINům s využitím MongoDB principu "embed before reference", tzn. kde je to možné, vyhněme se referencím. Návrh tento přístup odráží.

### Express.js
Jednoduchý framework pro vytváření web backend API.

### React.js
Nejpopulárnější frontend framework pro vytváření proměnlivých UI.

### Node.js
Javascriptový runtime, který budeme používat pro spouštění samotných frontend a backend serverů.

### nginx
Reverse proxy, za kterou schováme naše frontend a backend servery.

### Docker
Nástroj pro kontejnerizaci aplikací, s jeho pomocí naše aplikace poběží v jakémkoli environmentu.

### Mantine
Knihovna pro react, která usnadňuje vývoj UI.

### Typescript
Jazyk založený na javascriptu, který přidává typování. Budeme jej používat jak na frontendu, tak na backendu.

### PostCSS
Nástroj pro tranformaci CSS, dovolí nám psát více čitelné CSS a přidává funkce jako moduly, možnost importů a nesting

### Git
Populární vezrovací nástroj
