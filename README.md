
# Machinemelder.nl 🚀

Welkom bij het **Machinemelder.nl** project! Dit project helpt gebruikers om te controleren of de statiegeldmachines in hun buurt werken. We willen de frustratie wegnemen van kapotte machines en samen zorgen voor een soepelere ervaring voor iedereen. 💡


## Inhoudsopgave 📖

1. [Introductie](#introductie)
2. [Benodigde Subscripties en API Sleutels](#benodigde-subscripties-en-api-sleutels-📑)
   - [MapTiler](#maptiler)
   - [Stripe (Optioneel)](#stripe-optioneel)
3. [Setup met Devcontainer in VSCode](#setup-met-devcontainer-in-vscode-🐳)
   - [Vereisten](#vereisten)
   - [Snelstart met Docker Compose en Devcontainer](#snelstart-met-docker-compose-en-devcontainer-🛳️)
4. [Handmatige Setup](#handmatige-setup-🛠️)
   - [Stap 1: Opzetten van een lokale MariaDB/MySQL database](#stap-1-opzetten-van-een-lokale-mariadbmysql-database-🗄️)
   - [Stap 3: Importeren van Database en Testdata](#stap-3-importeren-van-database-en-testdata-📂)
   - [Stap 3: Project starten met Next.js](#stap-3-project-starten-met-nextjs-💻)
5. [Contributing](#contributing-🤝)
6. [License](#license-📜)

## Benodigde Subscripties en API Sleutels 📑

### MapTiler

Voor de kaartfunctionaliteit heb je een MapTiler API sleutel nodig:

- **Registreer bij MapTiler**: Ga naar [MapTiler.com](https://www.maptiler.com/) om een account aan te maken.
- **Genereer je API sleutel**: Voeg de gegenereerde sleutel toe aan uw `.env` bestand:
  ```bash
  NEXT_PUBLIC_MAP_TILE_API_KEY=''
  ```

### Stripe (Optioneel)

Als je de betalingsfunctionaliteit wilt testen, heb je toegang tot Stripe nodig:

- **Registreer bij Stripe**: Ga naar [Stripe.com](https://stripe.com/) om een account aan te maken.
- **Genereer je API sleutels**: Voeg de gegenereerde sleutels toe aan het `.env` bestand:
  ```bash
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=''
  STRIPE_SECRET_KEY=''
  ```

Stripe biedt testkaarten waarmee je betalingen kunt simuleren tijdens de ontwikkeling. Meer informatie hierover vind je in de [Stripe documentatie](https://stripe.com/docs/testing).


## Setup met Devcontainer in VSCode 🐳

### Vereisten

1. [Docker](https://www.docker.com/get-started)
2. [Visual Studio Code](https://code.visualstudio.com/)
3. [Devcontainer-extensie voor VSCode](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Snelstart met Docker Compose en Devcontainer 🛳️

1. **Open het project in Visual Studio Code**: 
   - Clone je geforkte repository lokaal.

2. **Open de Command Palette in VSCode**:
   - Druk `Ctrl + Shift + P` of `Cmd + Shift + P` op Mac.
   - Typ en selecteer `Dev Containers: Open Folder in Container...`.

3. **Setup met Devcontainer**:
   - VSCode zal `docker-compose` gebruiken om de Node- en MariaDB-omgeving op te zetten en de database automatisch met testdata te vullen.
   - De mariadb draait op poort `3036`, en machinemelder.nl standaard op `3000`.
   - Verder wordt de vscode [sqltools extensie](https://vscode-sqltools.mteixeira.dev/en/drivers.html) geinstalleerd en geconfigureerd voor de aangemaakte database.

4. **Maak een .env bestand aan**:
    - Creer een `.env` in de hoofdfolder met de volgende inhoud (vergeet de keys niet):
        ```
        NEXT_PUBLIC_MAP_TILE_API_KEY='HIERJEKEYVANTILE'
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='optioneelpublishedkeystripehier'
        STRIPE_SECRET_KEY='optioneelsecretkeystripehier'
        MYSQL_HOST=localhost
        MYSQL_PORT=3306
        MYSQL_USER=user
        MYSQL_PASSWORD=password
        MYSQL_DATABASE=statiegeld_test
        ```
        
5. **Start de ontwikkelserver**:
   - Binnen de devcontainer: 
     ```bash
     npm run dev
     ```
   - Open [http://localhost:3000](http://localhost:3000) in je browser.

---

## Handmatige Setup 🛠️

*Optional:* Indien je verkiest om de setup handmatig uit te voeren zonder Docker, volg deze stappen:


### Stap 1: Opzetten van een lokale MariaDB/MySQL database 🗄️

Je hebt een lokale MariaDB of MySQL database nodig om het project te draaien. Volg deze stappen om snel een database op te zetten met **MySQL Workbench**:

1. **Download MySQL Workbench** van [deze link](https://dev.mysql.com/downloads/workbench/) en installeer het.
2. Maak een nieuwe (local) verbinding en vul de gegevens in het `.env` bestand.
3. Nadat de verbinding is gemaakt, kun je eenvoudig databases aanmaken en beheren in MySQL Workbench.


### Stap 3: Importeren van Database en Testdata 📂

In de repository vind je een map genaamd `TestData`. Deze map bevat twee MySQL-bestanden:

- `table_definitions.sql`: Dit bestand bevat de structuur van de database.
- `test_data.sql`: Dit bestand bevat voorbeelddata voor testing.

Volg deze stappen om de database in te stellen:

1. Open MySQL Workbench en maak een nieuwe database aan met de naam `statiegeld_test` en zet die in de `.env` onder `MYSQL_DATABASE`.
2. Voer eerst de bestanden uit in `/statiegeld_test` om de tabellen aan te maken. [Tutorial](https://stackoverflow.com/a/15885375/11595909)
3. Daarna voer je de `meldingen_data.sql` & `supermarkets_data.sql` bestanden uit om de database te vullen met testdata.

Nu is je database klaar voor gebruik! 🎉


### Stap 3: Project starten met Next.js 💻

Om het project lokaal te draaien, volg je deze stappen:

1. Installeer de benodigde dependencies:
   ```bash
   npm install
   ```

2. Zorg dat je database en omgevingsvariabelen correct zijn ingesteld zoals beschreven in de eerdere stappen.

3. Start de ontwikkelserver:
   ```bash
   npm run dev
   ```

4. Open je browser en ga naar [http://localhost:3000](http://localhost:3000) om de applicatie te bekijken.

Nu kun je lokaal werken aan Machinemelder.nl! 🎉


## Contributing 🤝

🎉 **We zouden het geweldig vinden als je wilt bijdragen aan Machinemelder.nl!** 🎉

### Hoe kun je bijdragen?

1. **Fork** deze repository.
2. Maak een nieuwe feature branch (`git checkout -b feature/my-feature`).
3. Voer je wijzigingen door en commit deze (`git commit -m 'Add awesome feature'`).
4. Push je branch naar je fork (`git push origin feature/my-feature`).
5. Open een **Pull Request** en beschrijf wat je hebt toegevoegd of verbeterd.

Ik ben enorm dankbaar voor alle hulp die ik krijg om dit project beter te maken! Samen kunnen we iets heel moois neerzetten en anderen helpen om hun winkelervaring te verbeteren. 🙏

Voel je vrij om bugs te rapporteren, nieuwe ideeën te delen, of te helpen met documentatie. Elke bijdrage wordt gewaardeerd! 💖

Groetjes 
GijsSi 🚀

## License 📜

Dit project valt onder de [MIT License](LICENSE).
