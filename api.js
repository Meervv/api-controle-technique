async function fetchData() {
    try {
        let rows = 500;
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

async function parseData() {
    const allData = await fetchData();
    
    let list_communes = []; // Tableau pour stocker les communes
    let garages_prix = {}; // Tableau pour stocker les prix
    let garage_type_vehicule = {}; // Tableau pour stockerles types de véhicules
    let garages_by_commune = {}; // Tableau pour stocker par commune
    let garage_type_energie = {}; // Tableau pour stocker  les types d'énergie
    let garage_prix_contre_visite_min = {}; // Tableau pour stocker les prix de contre-visite min
    let garage_prix_contre_visite_max = {}; // Tableau pour stocker les prix de contre-visite max
    let garage_adresses = {}; // Tableau pour stocker les adresses

    const unique_communes = new Set(); // Ensemble pour stocker les communes uniques

    for (let i = 0; i < allData.length; i++) {
        if (allData[i].fields.cct_code_dept === "Eure") {
            let commune = allData[i].fields.cct_code_commune; // Récupérer le nom de la commune
            let garage = allData[i].fields.cct_denomination;// Récupérer le nom du garage
            let prix = allData[i].fields.prix_visite;
            let type_vehicule = allData[i].fields.cat_vehicule_libelle;
            let type_energie = allData[i].fields.cat_energie_libelle;
            let contre_visite_min = allData[i].fields.prix_contre_visite_min;
            let contre_visite_max = allData[i].fields.prix_contre_visite_max;
            let adresse = allData[i].fields.cct_adresse;

            if (prix) { // Vérifier si le prix existe
                garages_prix[garage] = prix; // Ajouter le prix au tableau
            }
            if (!garage_type_vehicule[garage]) { // Vérifier si le garage existe
                garage_type_vehicule[garage] = new Set([type_vehicule]); // Ajouter le type de véhicule unique au tableau
            } else {
                garage_type_vehicule[garage].add(type_vehicule);
            }
            if (!garage_type_energie[garage]) {
                garage_type_energie[garage] = new Set([type_energie]);
            } else {
                garage_type_energie[garage].add(type_energie);
            }
            if (!garage_prix_contre_visite_min[garage]) {
                garage_prix_contre_visite_min[garage] = new Set([contre_visite_min]);
            } else {
                garage_prix_contre_visite_min[garage].add(contre_visite_min);
            }
            if (!garage_prix_contre_visite_max[garage]) {
                garage_prix_contre_visite_max[garage] = new Set([contre_visite_max]);
            } else {
                garage_prix_contre_visite_max[garage].add(contre_visite_max);
            }
            if (!garages_by_commune[commune]) {
                garages_by_commune[commune] = new Set([garage]);
            } else {
                garages_by_commune[commune].add(garage);
            }
            if (!garage_adresses[garage]) {
                garage_adresses[garage] = new Set([adresse]);
            } else {
                garage_adresses[garage].add(adresse);
            }
            unique_communes.add(commune); // Ajouter la commune à l'ensemble
        }
    }
    return {
        unique_communes,
        garages_prix,
        garage_type_vehicule,
        garages_by_commune,
        garage_type_energie,
        garage_prix_contre_visite_min,
        garage_prix_contre_visite_max,
        garage_adresses
    };
}