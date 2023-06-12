async function parseData() {
    const allData = await fetchData(departement);
    
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
        if (allData[i].fields.cct_code_dept === departement) {
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