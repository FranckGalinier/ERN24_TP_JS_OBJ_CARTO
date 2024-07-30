class HttpUtils {
  static buildUrl(url, params = {}){
      /**
     * baseUrl = https://mon-api.com
     * params = {
     *    nom: 'toto',
     *    age: 25,
     *    ville: 'Paris'
     * }
     * => https://mon-api.com?nom=toto&age=25&ville=Paris
     */
    //on va récupérer les clé de l'objet params
    let paramsKeys = Object.keys(params);
    // paramsKey = ['nom', 'age', 'ville']

    //si je n'ai pas de paramètre, je retourne la base URL
    if (paramsKeys.length <= 0) return baseUrl;

    //on crée un tableau qui va contenir les paramètres
    let paramsArray = [];

    //on va boucler sur params pour construire un tableau de paramètres
    for(let key in params){
      let pairedParam = `${key}=${params[key]}`;
      //pairedParam = 'nom=toto'
      paramsArray.push(pairedParam);
      //paramsArray = ['nom=toto', 'age=25', 'ville=Paris']
    }
    return `${baseUrl}?${paramsArray.join('&')}`;
    // return 'https://mon-api.com?nom=toto&age=25&ville=Paris'
  }
}
export default HttpUtils;