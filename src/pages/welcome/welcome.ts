import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App, ModalController, Modal, ModalOptions, LoadingController, ViewController } from 'ionic-angular';

//imports do sistema
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { CentroFashionPage } from '../centro-fashion/centro-fashion';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Facebook } from '@ionic-native/facebook';

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
  private userDatails: any;
  page: any;
  userFbImg: any;
  newUserData = { name: "", firstName: "", email: "", type: "", img: "", key_token: "" };
  parseData: any;
  response: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public app: App,
    private modalCtrl: ModalController,
    private authService: AuthServiceProvider,
    private loadCtrl: LoadingController,
    private fb: Facebook
  ) {
    // this.events.subscribe('accessToken',(data)=>{
    //   localStorage.setItem('accessToken',data);
    // });
    if (localStorage.getItem('user')) {
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      console.log(this.userDatails);
    } else {
      this.popUpLogin();
      this.userDatails = '';
    }
  }///Fim do construtor


  ionViewDidLoad() {
    //console.log(this.userDatails);

  }
  
  popUpLogin() {
    console.log(localStorage.getItem('user'));
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
        //alert(userData);
        if (userData != null) {
          this.parseData= JSON.parse(userData);
          
          if(JSON.parse(JSON.stringify(this.parseData)).providerData){ //Logado pelo google
            
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
            console.log("logado com face");
            this.newUserData.name = this.parseData.user.displayName;
            this.newUserData.email = this.parseData.user.email;
            this.newUserData.img = this.parseData.user.photoURL;
            this.newUserData.type = '1';
            this.newUserData.key_token = this.parseData.additionalUserInfo.profile.id;
            this.newUserData.firstName = this.parseData.additionalUserInfo.profile.first_name;
            this.createNewUser();
            this.userFbImg = this.parseData.user.photoURL;

          }
          
        }

      });

    }
  }
  createNewUser() {
    //alert(JSON.stringify(this.newUserData));
    this.authService.post(this.newUserData, "signupNewUser").then((result) => {
      this.response = JSON.parse(JSON.stringify(result))._body;
      //alert(JSON.stringify(this.response));
      if (!JSON.parse(this.response).error) { //Retorno ok
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        localStorage.setItem('user', JSON.stringify(result));
        setTimeout(() => {
          this.events.publish('updateUserData',JSON.stringify(result));
        }, 50);
        

      } else {
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
    this.navCtrl.push(CentroFashionPage);
    this.events.publish('root', "CentroFashionPage");
    localStorage.setItem('root', "CentroFashionPage");

  }

}
