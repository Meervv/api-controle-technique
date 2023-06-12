async function processData() {
    try {
        const result = await parseData();

        document.cookie = `list_communes=${JSON.stringify(result.unique_communes)}; expires=${new Date(Date.now() + 3600000).toUTCString()}; path=/`; // Ajouter les données au cookie
        document.cookie = `garage_adresses=${JSON.stringify(result.garage_adresses)}; expires=${new Date(Date.now() + 3600000).toUTCString()}; path=/`; // Ajouter les données au cookie

        const communeTableBody = document.getElementById("commune-title"); // Récupérer le corps du tableau
        const sortedCommunes = [...result.unique_communes].sort((a, b) => a.localeCompare(b)); // Trier les communes par ordre alphabétique

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const tbody = document.createElement('tbody');

        //créer les éléments html
        const thCommune = document.createElement('th');
        const thGarages = document.createElement('th');
        const thPrix = document.createElement('th');
        const thPrixMin = document.createElement('th');
        const thPrixMax = document.createElement('th');
        const thTypeVehicule = document.createElement('th');
        const thAdresse = document.createElement('th');

        //ajouter les classes aux th
        thCommune.className = 'commune_th';
        thGarages.className = 'garage_th';
        thPrix.className = 'prix_th';
        thPrixMin.className = 'prixmin_th';
        thPrixMax.className = 'prixmax_th';
        thTypeVehicule.className = 'type_th';
        thAdresse.className = 'adresse_th';

        //ajouter le texte aux th
        thCommune.textContent = 'Commune';
        thGarages.textContent = 'Garages';
        thPrix.textContent = 'Prix';
        thPrixMin.textContent = 'Prix contre visite min';
        thPrixMax.textContent = 'Prix contre visite max';
        thTypeVehicule.textContent = 'Type véhicule';
        thAdresse.textContent = 'Adresse';

        //ajouter les th au tr
        tr.appendChild(thCommune);
        tr.appendChild(thGarages);
        tr.appendChild(thPrix);
        tr.appendChild(thPrixMin);
        tr.appendChild(thPrixMax);
        tr.appendChild(thTypeVehicule);
        tr.appendChild(thAdresse);

        for (const commune of sortedCommunes) {
            const garages = result.garages_by_commune[commune]; // Récupérer les garages de la commune

            let isFirstRow = true; // Variable pour savoir si c'est la première ligne
            
            for (const garage of garages) {
                const newRow = document.createElement('tr'); // Créer une nouvelle ligne

                const communeCell = document.createElement('td'); // Créer une cellule pour la commune
                communeCell.textContent = commune; // Ajouter le nom de la commune à la cellule
                newRow.appendChild(communeCell); // Ajouter la cellule à la ligne

                const garagesCell = document.createElement('td');
                garagesCell.textContent = `${garage}`;
                newRow.appendChild(garagesCell);
                
                const prix = result.garages_prix[garage];
                const prixCell = document.createElement('td');
                newRow.appendChild(prixCell);
                prixCell.classList.add("prix-tr");
                        
                const contreVisiteMinCell = document.createElement('td');
                newRow.appendChild(contreVisiteMinCell);
                contreVisiteMinCell.classList.add("min-tr"); // Ajouter la classe à la ligne

                const contreVisiteMaxCell = document.createElement('td');
                newRow.appendChild(contreVisiteMaxCell);
                contreVisiteMaxCell.classList.add("max-tr");

                const typeVehiculeCell = document.createElement('td');
                newRow.appendChild(typeVehiculeCell);
                typeVehiculeCell.classList.add("type-tr"); // Ajouter la classe à la ligne

                const adresseCell = document.createElement('td');
                newRow.appendChild(adresseCell);
                adresseCell.classList.add("adresse-tr"); // Ajouter la classe à la ligne
                        
                if (prix) {
                    const prixDiv = document.createElement('div');
                    prixDiv.textContent = `${prix} €`;
                    prixCell.appendChild(prixDiv);
                }
                if (result.garage_prix_contre_visite_min[garage]) {
                    const contreVisiteMinDiv = document.createElement('div');
                    const contreVisiteMins = [...result.garage_prix_contre_visite_min[garage]];
                    const contreVisiteMinText = contreVisiteMins.join(' €, ') + ' €';
                    contreVisiteMinDiv.textContent = contreVisiteMinText;
                    contreVisiteMinCell.appendChild(contreVisiteMinDiv);
                }
                if (result.garage_prix_contre_visite_max[garage]) {
                    const contreVisiteMaxDiv = document.createElement('div');
                    const contreVisiteMaxs = [...result.garage_prix_contre_visite_max[garage]];
                    const contreVisiteMaxText = contreVisiteMaxs.join(' €, ') + ' €';
                    contreVisiteMaxDiv.textContent = contreVisiteMaxText;
                    contreVisiteMaxCell.appendChild(contreVisiteMaxDiv);
                }
                if (result.garage_type_vehicule[garage]) {
                    const typeVehiculeDiv = document.createElement('div');
                    const vehiculeTypes = [...result.garage_type_vehicule[garage]];
                    const energieTypes = result.garage_type_energie[garage] ? [...result.garage_type_energie[garage]] : [];
                    const vehiculeText = vehiculeTypes.join(', ');
                    const vehiculeLabels  = vehiculeTypes.map(type => `${type}${energieTypes.length > 0 ? ` (${energieTypes.join(", ")})` : ""}`);
                    typeVehiculeDiv.innerHTML = vehiculeLabels.join('<br>');
                    typeVehiculeCell.appendChild(typeVehiculeDiv);
                }
                if (result.garage_adresses[garage]) {
                    const adresseDiv = document.createElement('div');
                    const adresses = [...result.garage_adresses[garage]];
                    const adresseText = adresses.join(', ');
                    adresseDiv.textContent = adresseText;
                    adresseCell.appendChild(adresseDiv);
                }
                if (isFirstRow) {
                    newRow.style.borderTop = '1px solid black';
                    isFirstRow = false;
                }
                tbody.appendChild(newRow); 
            }
        }
        //ajouter le tr au thead
        thead.appendChild(tr);
        //ajouter le thead au table
        table.appendChild(thead);
        // Ajouter le corps du tableau au tableau
        table.appendChild(tbody);
        // Ajouter le tableau au body
        document.body.appendChild(table);
    }
    catch (error) {
        console.log(error);
    }
}