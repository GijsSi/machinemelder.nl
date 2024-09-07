
# Machinemelder.nl 🚀

Welkom bij het **Machinemelder.nl** project! Dit project helpt gebruikers om te controleren of de statiegeldmachines in hun buurt werken. We willen de frustratie wegnemen van kapotte machines en samen zorgen voor een soepelere ervaring voor iedereen. 💡

---

## Getting Started 🛠️

### Stap 1: Aanmaken van een MapTiler API Key 🗺️

Om de kaartfunctionaliteit te laten werken, moet je een API key aanmaken op [MapTiler.com](https://www.maptiler.com/). Voeg deze API key toe aan je `.env` bestand onder:

```bash
NEXT_PUBLIC_MAP_TILE_API_KEY=''
```

### Stap 2: Opzetten van een lokale MariaDB/MySQL database 🗄️

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

### Stap 4: Betalingen testen met Stripe 💳

Om betalingen te testen, moet je een account aanmaken op [Stripe.com](https://stripe.com/). Vraag daar je API keys aan en vul ze in je `.env` bestand:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

Stripe biedt testkaarten waarmee je betalingen kunt simuleren tijdens de ontwikkeling. Meer informatie hierover vind je in de [Stripe documentatie](https://stripe.com/docs/testing).

### Stap 5: Project starten met Next.js 💻

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
