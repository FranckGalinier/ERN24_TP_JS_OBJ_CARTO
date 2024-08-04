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

//on importe la classe Marker
import Marker from './Marker';

class App{
  //properties
  elDivMap;  //container de la map
  map;  //instance de la map
  marker = null;  //marqueur
  arrMarkers = [];  //tableau de marqueurs
  Marker;  //instance de la classe Marker
  currentMarker;  //marqueur actuel


  start(){
    console.log("Hey, ton appli est démarré");  //log pour confirmer que l'appli est démarré

    this.displayForm(); //on appelle la méthode displayForm
    this.loadDom(); //on appelle la méthode loadDom
    this.initMap(); //on appelle la méthode initMa
    this.formService = new FormService();  //on instancie la classe FormService
    this.Marker = new Marker();  //on instancie la classe Marker
    this.handleMarkers();  //on appelle la méthode handleMarkers

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

     //on crée un bouton pour afficher le formulaire
     const elButtonDisplayForm = document.createElement('button');
     elButtonDisplayForm.type = 'button';
     elButtonDisplayForm.className = 'btn btn-display-form';
     elButtonDisplayForm.innerHTML = '<i class="bi bi-list"></i> &nbsp; Ajouter un point d\'intérêt';

     elButtonDisplayForm.addEventListener('click', this.displayStyleForm.bind(this));

    //bouton de mise à jour
    const elButtonUpdate = document.createElement('button');
    elButtonUpdate.type = 'button';
    elButtonUpdate.className = 'btn btnUpdate';
    elButtonUpdate.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
    elButtonUpdate.addEventListener('click', this.updateMarkers.bind(this));

    app.append(elButtonDisplayForm, elButtonUpdate);
 
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

    //on ajoute les coordonnées du marqueur dans le formulaire

    if(this.currentMarker==null){
      
      
       this.marker= new mapboxgl.Marker()
        .setLngLat(event.lngLat)
        .addTo(this.map);
        this.currentMarker = true;
        document.getElementById('latitude').value = event.lngLat.lat;
      document.getElementById('longitude').value = event.lngLat.lng;

    }else if(this.currentMarker==true){
      this.marker.remove();
      this.marker= new mapboxgl.Marker()
        .setLngLat(event.lngLat)
        .addTo(this.map);
      this.currentMarker = true;
         document.getElementById('latitude').value = event.lngLat.lat;
      document.getElementById('longitude').value = event.lngLat.lng;

    }
  }

  //? méthode qui va afficher le formulaire à droite de la map
  displayForm(){
   //on récupère notre div app
   const app = document.getElementById('app');


    //on crée un élément div pour le formulaire
    const elDivForm = document.createElement('div');
    elDivForm.id = 'form';
    elDivForm.className = 'formMap';
    elDivForm.style.display = 'none';

    elDivForm.innerHTML = `
        <div class="mb-2">
          <input type="text" class="form-control" id="title" placeholder="Titre">
        </div>
        <div class="mb-2">
          <textarea class="form-control" id="description" placeholder="Description"></textarea>
        </div> 
        <div class="mb-2">
           <label for="datestart" class="form-label">Date de début</label>
            <input type="datetime-local" id="datestart" class="form-control">
        </div>
        <div class="mb-2">
            <label for="dateend" class="form-label">Date de fin</label>
            <input type="datetime-local" id="dateend" class="form-control">
        </div>
        <div class="mb-2">
        <label for="latitude" class="form-label">Latitude</label>
        <input type="number" id="latitude" class="form-control">
        </div>
        <div class="mb-2">
        <label for="longitude" class="form-label">Longitude</label>
        <input type="number" id="longitude" class="form-control">
        </div>
    `;

  
  
    //création du bouton envoyer
    const elButton = document.createElement('button');
    elButton.type = 'submit';
    elButton.className = 'btn btn-primary w-100';
    elButton.innerHTML = '<i class="bi bi-plus"></i> Ajouter';
    elButton.addEventListener('click', this.saveFormData.bind(this));
  
    elDivForm.append(elButton);
    //on ajoute le formulaire à la div app
    app.appendChild(elDivForm);

  }

  //? méthode qui va gérer l'envoi du formulaire
    //méthode pour sauvegarder les données du formulaire
  saveFormData(){

      const elInputTitre = document.getElementById('title').value.trim()
      const elInputDescription = document.getElementById('description').value.trim();
      const elInputDateStart = document.getElementById('datestart').value.trim();
      const elInputDateEnd = document.getElementById('dateend').value.trim();
      const elInputLatitude = document.getElementById('latitude').value.trim();
      const elInputLongitude = document.getElementById('longitude').value.trim();
      const newFormData = {
          Titre: elInputTitre == '' ? 'Inconnu' : elInputTitre,
          Description : elInputDescription == '' ? 'Inconnu' : elInputDescription,
          DateStart : elInputDateStart == '' ? 'Inconnu' : elInputDateStart,
          DateEnd : elInputDateEnd == '' ? 'Inconnu' : elInputDateEnd,
          Latitude : elInputLatitude == '' ? 'Inconnu' : Number(elInputLatitude),
          Longitude : elInputLongitude == '' ? 'Inconnu' : Number(elInputLongitude)
      }
      //quand je clique sur le bouton envoyer, les infos s'enregistre dnas le local storage*
      this.formService.saveStorage(newFormData);
      //on apelle la méthode pour mettre à jour les markers
    this.updateMarkers();
  }

  //méthode pour afficher les markers ajoutés
  handleMarkers(){
    //récupération des données du local storage
    const markers = this.formService.readStorage();

    for(const marker of markers){

    const el = document.createElement('div');
    el.className = 'custom-marker text-center';
    el.innerHTML= '<i class="bi bi-pin-fill"></i>';

    const title = document.createElement('div');
    title.className = 'marker-title';
    title.style.color = 'black';
    title.innerHTML = `
    <h5>${marker.Titre}</h5>
    <p> Début : ${formatDate(marker.DateStart)}</p>
    <p>Fin : ${formatDate(marker.DateEnd)}</p>
    `

   


    el.append(title);
    //parcours du tableau de markers
    
   
      //ajout du marker sur la map 
      new mapboxgl.Marker(el)
        .setLngLat([Number(marker.Longitude),Number(marker.Latitude)])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title ">${marker.Titre}</h4>
          </div>
          <div class="modal-body mt-2">
            <p>Description : ${marker.Description} </p>
            <p>Date de début: ${formatDate(marker.DateStart)}</p>
            <p>Date de fin: ${formatDate(marker.DateEnd)}</p>
            <p>${getEventMessage(marker.DateStart)}</p>
          </div>
          </div>`))
        .addTo(this.map);

        //fonction pour formater la date
        function formatDate(dateString) {
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
          return new Date(dateString).toLocaleDateString('fr-FR', options);
        }

        function getEventMessage(dateStart) {
          const now = new Date();
          const eventDate = new Date(dateStart);
          const diffTime = eventDate - now;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
          if (diffTime < 0) {
            return "Quel dommage ! Vous avez raté cet événement !";
          } else if (diffDays <= 3) {
            return `Attention, commence dans ${diffDays} jours et ${diffHours} heures`;
          } else {
            return "Aucune";
          }
        }

      
      //si la date de fin est dépassée, le marker devient rouge
      if(Date.now() > Date.parse(marker.DateEnd)){
        el.style.color = '#FF0000';
      //si l'évènement se tient dans moins de 3 jours   
      }else if(Date.now() > Date.parse(marker.DateStart) - 259200000){
        el.style.color = '#FFA000';
      }
      //si l'évènement se tient dans plus de 3 jours
      else {
        el.style.color = '#00FF00';
      }
    };
  }

  //méthode qui va permettre de mettre à jour les markers
  updateMarkers(){
  //ici on va rafraichir la page pour mettre à jour les markers
  window.location.reload();

  }

  displayStyleForm(){
    const elDivForm = document.getElementById('form');
    elDivForm.style.display = elDivForm.style.display === 'none' ? 'block' : 'none';
  }

}




const app = new App();

export default app;