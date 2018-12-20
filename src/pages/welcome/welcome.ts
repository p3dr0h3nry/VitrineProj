import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App, ModalController, Modal, ModalOptions, LoadingController, ViewController, AlertController } from 'ionic-angular';

//imports do sistema
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { CentroFashionPage } from '../centro-fashion/centro-fashion';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',

})
export class WelcomePage {
  // map: GoogleMap;
  private userDatails: any;
  page: any;
  userFbImg: any;
  newUserData = { name: "", firstName: "", email: "", type: "", img: "", key_token: "" };
  parseData: any;
  response: any;
  dataToSetFavorite = { client_id: "", user_id: "", fromm: "" };
  dataFavorites: any;
  data:any;
  loader:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public app: App,
    private modalCtrl: ModalController,
    private authService: AuthServiceProvider,
    private alertCtrl:AlertController,
    private loadCtrl:LoadingController
  ) {
    // this.events.subscribe('accessToken',(data)=>{
    //   localStorage.setItem('accessToken',data);
    // });
    if (localStorage.getItem('user')) {
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      //console.log(this.userDatails);
    } else {
      this.popUpLogin();
      this.userDatails = '';
    }
  }///Fim do construtor

  ngOnInit() {
    if(localStorage.getItem('user')){
      this.goTo();
    }
  }
  ionViewDidLoad() {
    //console.log(this.userDatails);

  }
  
  popUpLogin() {
    //console.log(localStorage.getItem('user'));
    if (!localStorage.getItem('user')) {
      const myModalOptions: ModalOptions = {
        showBackdrop: true,
        enableBackdropDismiss: false,
      };
      const myModalData = { //isso é passado pra dentro do modal
        name: 'teste',
        algo: 'teste'
      };
      const loginModal: Modal = this.modalCtrl.create('ModalLoginPage', { data: myModalData }, myModalOptions);
      loginModal.present();

      loginModal.onDidDismiss((userData) => { //obtem o retorno quando o modal é fechado
        this.loader = this.loadCtrl.create({
          content: 'Carregando...',
          dismissOnPageChange: true,
          showBackdrop: true,
          enableBackdropDismiss: true
        });
        this.loader.present();
        if (userData != null) {
          this.parseData= JSON.parse(userData);
          //console.log(this.parseData);
          if(JSON.parse(JSON.stringify(this.parseData)).providerData){ //Logado por credentials
            //console.log("Logando");
            let x =JSON.stringify(JSON.parse(JSON.stringify(this.parseData)).providerData);
            x = x.replace('[','');
            x = x.replace(']','');
            let data = JSON.parse(x);
            this.newUserData.name = this.parseData.displayName;
            this.newUserData.email = this.parseData.email;
            this.newUserData.img = this.parseData.photoURL;
            this.newUserData.type = '1';
            this.newUserData.key_token = data.uid;
            this.newUserData.firstName = this.parseData.displayName;
            this.createNewUser();
            this.userFbImg = this.parseData.photoURL;

          }else if(this.parseData.additionalUserInfo.providerId=="facebook.com"){ //Logado pelo Facebook
            //console.log("logado com face");
            this.newUserData.name = this.parseData.user.displayName;
            this.newUserData.email = this.parseData.user.email;
            this.newUserData.img = this.parseData.user.photoURL;
            this.newUserData.type = '1';
            this.newUserData.key_token = this.parseData.additionalUserInfo.profile.id;
            this.newUserData.firstName = this.parseData.additionalUserInfo.profile.first_name;
            this.createNewUser();
            this.userFbImg = this.parseData.user.photoURL;

          }
          else if(this.parseData.additionalUserInfo.providerId=="google.com"){ //Logado pelo Facebook
            console.log("logado com gmail");
            this.newUserData.name = this.parseData.user.displayName;
            this.newUserData.email = this.parseData.user.email;
            this.newUserData.img = this.parseData.user.photoURL;
            this.newUserData.type = '1';
            this.newUserData.key_token = this.parseData.additionalUserInfo.profile.id;
            this.newUserData.firstName = this.parseData.user.displayName;
            this.createNewUser();
            this.userFbImg = this.parseData.user.photoURL;

          }
          
        }

      });

    }
  }




  // loadMap() {

  //   // This code is necessary for browser
  //   // Environment.setEnv({
  //   //   'API_KEY_FOR_BROWSER_RELEASE': '(your api key for `https://`)',
  //   //   'API_KEY_FOR_BROWSER_DEBUG': '(your api key for `http://`)'
  //   // });

  //   let mapOptions: GoogleMapOptions = {
  //     camera: {
  //        target: {
  //          lat: 43.0741904,
  //          lng: -89.3809802
  //        },
  //        zoom: 18,
  //        tilt: 30
  //      }
  //   };
  //   //let element = document.getElementById('map_canvas');
  //   this.map = GoogleMaps.create('map_canvas', mapOptions);

  //   // let marker: Marker = this.map.addMarkerSync({
  //   //   title: 'Ionic',
  //   //   icon: 'blue',
  //   //   animation: 'DROP',
  //   //   position: {
  //   //     lat: 43.0741904,
  //   //     lng: -89.3809802
  //   //   }
  //   // });
  //   // marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
  //   //   alert('clicked');
  //   // });
  // }

  createNewUser() {
    //console.log(JSON.stringify(this.newUserData));
    this.authService.post(this.newUserData, "signupNewUser").then((result) => {
      this.response = JSON.parse(JSON.stringify(result))._body;
      //console.log(JSON.stringify(this.response));
      if (!JSON.parse(this.response).error) { //Retorno ok
        this.loader.dismiss();
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        localStorage.setItem('user', JSON.stringify(result));
        setTimeout(() => {
          this.events.publish('updateUserData',JSON.stringify(result));
        }, 50);
        setTimeout(() => {
          this.goTo();
        }, 50);

      } else {
        this.loader.dismiss();
        this.popUpLogin();
        this.response = JSON.parse(this.response).error;
        let msg: string = this.response.e; //busca msg de erro
        console.log(msg);
      }
    }, (err) => {
      console.log(err);
    });

  }

  login() {
    this.navCtrl.push(LoginPage);
  }
  signup() {
    this.navCtrl.push(SignupPage);
  }
  logout() {
    localStorage.clear();
    this.userDatails = '';
    setTimeout(() => {
      this.popUpLogin();
    }, 100);
          
  }
  goTo() {
 
    if(sessionStorage.getItem('favorites')){

      this.navCtrl.push(CentroFashionPage);
      this.events.publish('root', "CentroFashionPage");
      localStorage.setItem('root', "CentroFashionPage");
    }else{
      this.getFavorites();
    }
  }
  getFavorites() {
    //console.log(this.userDatails.user_id);
    this.dataToSetFavorite.user_id = this.userDatails.user_id;
    
    this.authService.post(this.dataToSetFavorite, "getFavorites").then((result) => {
      this.response = result;
      //console.log(result);
      this.data = JSON.parse(JSON.stringify(this.response))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
          sessionStorage.setItem('favorites', JSON.stringify(this.response));
          this.events.publish('favorites',JSON.stringify(this.response));
          this.loader.dismiss();
          setTimeout(() => {
            this.goTo();
            // this.navCtrl.push(CentroFashionPage);
            // this.events.publish('root', "CentroFashionPage");
            // localStorage.setItem('root', "CentroFashionPage");
          }, 300);
          
      }else{
        this.addFavorite();
      }
    }, (err) => {
      this.loader.dismiss();
      console.log(err);
      let alertSignup = this.alertCtrl.create({
        title: "Ops!",
        message: 'Falha de conexão, verifique sua internet.',
        buttons: [{
          text: "Ok"
        }]
      });
      alertSignup.present()
    });
  }

  addFavorite() {
    this.dataToSetFavorite.client_id = '';
    this.dataToSetFavorite.user_id = this.userDatails.user_id;
    this.dataToSetFavorite.fromm = 'CentroFashionPage';
    //console.log(this.dataToSetFavorite);
    this.authService.post(this.dataToSetFavorite, "setFavorite").then((result) => {
      this.response = result;
      //console.log(result);
      this.data = JSON.parse(JSON.stringify(this.response))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        sessionStorage.setItem('favorites', JSON.stringify(this.response));
        this.events.publish('favorites',JSON.stringify(this.response));
        this.loader.dismiss();
        setTimeout(() => {
          this.navCtrl.push(CentroFashionPage);
          this.events.publish('root', "CentroFashionPage");
          localStorage.setItem('root', "CentroFashionPage");
        }, 100);

      } else {
        this.loader.dismiss();
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        let alertSignup = this.alertCtrl.create({
          title: "Ops!!",
          message: msg,
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }

    }, (err) => {
      console.log(err);

      alert('Falha');

    });

  }

}
