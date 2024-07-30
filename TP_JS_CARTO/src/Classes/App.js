//on importe la config
import config from '../../app.config.json';

//on importe la librairie mapbox
import mapboxgl from 'mapbox-gl';

//on importe les librairies de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

//on importe les icones de bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';

//on importe le style de mapbox
import 'mapbox-gl/dist/mapbox-gl.css';

//on importe notre propre style
import '../assets/style.css';

//on importe la classe FormService
import FormService from '../Service/FormService';

class App{
  //properties
  elDivMap;  //container de la map
  map;  //instance de la map
  marker = null;  //marqueur

  start(){
    console.log("Hey, ton appli est démarré");  //log pour confirmer que l'appli est démarré

    this.displayForm(); //on appelle la méthode displayForm
    this.loadDom(); //on appelle la méthode loadDom
    this.initMap(); //on appelle la méthode initMap
  }

  //? Chargment du dom
  loadDom(){
    //on récupère notre div app
    const app = document.getElementById('app');
    
    //on crée un élément div pour la map
    this.elDivMap = document.createElement('div');
    this.elDivMap.id = 'map';

    //on ajoute la div map à la div app
    app.appendChild(this.elDivMap);
  }

  //? Initialisation de la map
  initMap(){
    //on va renseigner notre clé d'api à la librairie mapbox
    mapboxgl.accessToken = config.apis.mapbox_gl.apiKey;

    //on va instancer notre map de mapbox
    this.map = new mapboxgl.Map({
      container: this.elDivMap,   //ici on lui passe notre div map comme container
      style: config.apis.mapbox_gl.map_styles.satellite_streets,   //on lui passe le style de la map qui est dans la config
      center: [2.79, 42.68],  //on centre la map sur Paris
      zoom: 12  //on zoom à 12
    })
    const nav = new mapboxgl.NavigationControl(); //on instancie le controle de navigation
    this.map.addControl(nav, 'top-left');   //on ajoute le controle de navigation à la map

    //ajout d'un écouteut d'évènement sur la map
    this.map.on('click', this.handleClickMap.bind(this));
  }

  //? méthode qui capte le click sur la map
  handleClickMap(event){

    const marker = new mapboxgl.Marker()
      .setLngLat(event.lngLat)
      .addTo(this.map);
    
    //on ajoute les coordonnées du marqueur dans le formulaire
    document.getElementById('latitude').value = event.lngLat.lat;
    document.getElementById('longitude').value = event.lngLat.lng;
  }

  //? méthode qui va afficher le formulaire à droite de la map
  displayForm(){
   //on récupère notre div app
   const app = document.getElementById('app');

    //on crée un élément div pour le formulaire
    const elDivForm = document.createElement('div');
    elDivForm.id = 'form';
    elDivForm.className = 'formMap';

    elDivForm.innerHTML = `
      <h2 class="text-center">Ajouter un événement</h2>
      <form>
        <div class="mb-2">
          <label for="title" class="form-label">Titre</label>
          <input type="text" class="form-control" id="title" placeholder="Titre">
        </div>
        <div class="mb-2">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" placeholder="Description"></textarea>
        </div> 
        <div class="mb-2">
          
        <label for="latitude" class="form-label">Latitude</label>
        <input type="number" id="latitude" class="form-control">
        </div>
        <div class="mb-2">
        <label for="longitude" class="form-label">Longitude</label>
        <input type="number" id="longitude" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-2"><i class="bi bi-plus"></i> Ajouter</button>
      </form>
    `;
    
    //on ajoute les éléments au formulaire
  

    //on ajoute le formulaire à la div app
    app.appendChild(elDivForm);
  }

  //? méthode qui va gérer l'envoi du formulaire
    //méthode pour sauvegarder les données du formulaire
    saveFormData(){

      const elLastname = this.elInputNewLastName.value.trim();
      const elFirstname = this.elInputNewFirstName.value.trim();  
      const newFormData = {
          lastname: elLastname == '' ? 'Inconnu' : elLastname,
          firstname: elFirstname == '' ? 'Inconnu' : elFirstname,
      }
      this.formService.saveStorage(newFormData);
      }
}



const app = new App();

export default app;