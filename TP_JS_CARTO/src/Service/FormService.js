const STORAGE_NAME = 'form_data';

class FormService {

//méthode qui va sauvergarder les données du formulaire dans le local storage
saveStorage(formData){
  //convertir l'objet en chaine de caractères
  const serializedData = JSON.stringify(formData);

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