const STORAGE_NAME = 'form_data';

class FormService {

   // Méthode pour récupérer les données du localstorage
  readStorage() {
    // Tableau pour stocker les notes récupérer
    let arrNote = []

    // Récupération des données depuis le localstorage en utilisant le nom de la clé
    const serializedData = localStorage.getItem(STORAGE_NAME);

    // Su aucune donnée n'est trouver, on retourne un tableau vide
    if (!serializedData) return arrNote

    // Tentative de parsing des données récupérées
    try {
        arrNote = JSON.parse(serializedData) || []
    }catch(error) {
        // En cas d'erreur lors du parsing (données corrompues ou invalides)
        // On supprime les données du localstorage
        localStorage.removeItem(STORAGE_NAME)
    }

    return arrNote
  }

  //méthode qui va sauvergarder les données du formulaire dans le local storage
  saveStorage(newMarker){
     //récupération des données existantes
  const existingMarkers = JSON.parse(localStorage.getItem(STORAGE_NAME)) || [];

  //ajout du nouveau marker aux données existantes
  existingMarkers.push(newMarker);
  //convertir l'objet en chaine de caractères
  const serializedData = JSON.stringify(existingMarkers);

  //tentative de sauvergades des données dans le local storage
  try{
    localStorage.setItem(STORAGE_NAME, serializedData);
  
  } catch(error){
    console.log('Error saving data', error);
    return false;
  }
  }

}

export default FormService;