async function fetchData() {
    try {
        let rows = 1000;
        let start = 0;
        let apiUrl = `https://data.economie.gouv.fr/api/records/1.0/search/?dataset=controle_techn&q=&rows=${rows}&start=${start}&facet=cct_code_dept&facet=code_postal&facet=cct_code_commune&facet=cct_denomination&facet=cat_vehicule_libelle&facet=cat_energie_libelle&facet=prix_visite&facet=prix_contre_visite_min&facet=prix_contre_visite_max`;
        let allData = []; // Tableau pour stocker toutes les données récupérées
        const cache = new Map(); // Créer un cache pour stocker les données récupérées
        let data = {}; // Définir la variable "data" avec une valeur par défaut
    
        for (let i = 0; i < 20; i++) {
          if (cache.has(apiUrl)) { // Vérifier si les données sont déjà dans le cache
            allData.push(...cache.get(apiUrl).records); // Ajouter les données du cache au tableau
          }
          else { // Boucle pour récupérer les données (20 itérations pour un total de 10 000 enregistrements)
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error(`Erreur HTTP ${response.status}`);
            }
            data = await response.json(); // Mettre à jour la variable "data"
            allData.push(...data.records); // Ajouter les données récupérées au tableau
            cache.set(apiUrl, data); // Ajouter les données au cache
          }
          if (data.records.length < rows) { // Si le nombre de données récupérées est inférieur à 500, il n'y a plus de données à récupérer
            break;
          }
          start += rows; // Augmenter le paramètre "start" de 500 pour récupérer le lot suivant
          apiUrl = `https://data.economie.gouv.fr/api/records/1.0/search/?dataset=controle_techn&q=&rows=${rows}&start=${start}&facet=cct_code_dept&facet=code_postal&facet=cct_code_commune&facet=cct_denomination&facet=cat_vehicule_libelle&facet=cat_energie_libelle&facet=prix_visite&facet=prix_contre_visite_min&facet=prix_contre_visite_max`;
        }
        return allData;
    }
    catch (error) {
        console.log(error);
    }
}
