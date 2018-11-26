import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, App, MenuController, Events, Nav, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
//Modulo do sistema
import { WelcomePage } from '../pages/welcome/welcome';
import { CentroFashionPage } from '../pages/centro-fashion/centro-fashion';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
//import { Menu } from './menu';
import { CreateProfilePage } from '../pages/create-profile/create-profile';
import { ProfilePage } from '../pages/profile/profile';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
//import { componentRefresh } from '@angular/core/src/render3';

@Component({
  templateUrl: 'app.html',
  // template: '<ion-nav [root]="rootPage"></ion-nav>',

})
export class MyApp implements OnInit {
  public rootPage: any;
  // public rootPage: WelcomePage;
  @ViewChild(Nav) nav: Nav;
  public userDatails: any;
  public profileDatails: any;
  private thisPlace: any = null;
  responsePost: any;
  data: any;
  userAtive;
  profileAtive;
  //rootPage =Menu; //busca o menu na pag menu
  profileToGetData = { client_id: "" };
  retorno: boolean;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public app: App,
    public menuCtrl: MenuController,
    public events: Events,
    public loadCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private alertCtrl: AlertController
  ) {
    this.rootPage = WelcomePage;
    //console.log(this.profileAtive);



    this.events.subscribe('root', data => {
      if (data == "CentroFashionPage") {
        this.thisPlace = "CentroFashionPage";
        if (localStorage.getItem('user')) {
          this.userAtive = true;
          this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
          this.userDatails = JSON.parse(this.userDatails).success;
          this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
          if (this.userDatails.profile_status == 1) {
            this.profileAtive = true;
          } else {
            this.profileAtive = false;
          }
          //console.log(this.userDatails.client_name);          
        }
        if (this.rootPage == CentroFashionPage) {
          this.nav.push(CentroFashionPage);
        } else {
          let load = this.loadCtrl.create({
            content: 'Carregando...'
          });
          load.present();
          setTimeout(() => {
            load.dismiss();
            //this.rootPage = CentroFashionPage;
          }, 1000);
        }

        //console.log(this.userDatails);
      }
    });

    this.events.unsubscribe('local');
    //console.log(localStorage.getItem('user'));
    if (localStorage.getItem('user')) {

      this.userAtive = true;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      //console.log(this.userDatails);
      if (this.userDatails.profile_status == 1) {
        this.profileAtive = true;
      } else {
        this.profileAtive = false;
      }

    } else {
      this.userAtive = false;
    }

    this.events.subscribe('Headerlocal', (data) => {
      if (localStorage.getItem('user')) {
        this.userAtive = true;
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        if (this.userDatails.prof_id) {
          this.profileAtive = true;
        } else {
          this.profileAtive = false;
        }
      }
      this.thisPlace = JSON.parse(JSON.stringify(data));
      console.log(this.thisPlace);
    });


  }
  ngOnInit() {
    // this.viewCtrl.didEnter.subscribe(()=>{
    //   console.log("Component");
    // });
  }
  getProfileData() {
    let loader = this.loadCtrl.create({
      content: 'Buscando perfil...'
    });
    loader.present();
    this.profileToGetData.client_id = this.userDatails.client_id;
    this.authService.post(this.profileToGetData, "getProfile").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.setItem('profileData', JSON.stringify(this.responsePost));
        this.events.publish('root', "CentroFashionPage");
        loader.dismiss();
        this.menuCtrl.toggle();
        setTimeout(() => {
          this.nav.push(ProfilePage);
        }, 200);
      } else {
        loader.dismiss();
        this.menuCtrl.toggle();
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        console.log(msg);
        let alertSignup = this.alertCtrl.create({
          title: "Ops!",
          message: 'Esse perfil não existe!',
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }
    }, (err) => {
      loader.dismiss();
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
    //return retorno;

  }
  // Criação do perfil da loja
  createProfile() {
    ///this.navCtrl.push(Menu);
    this.menuCtrl.toggle();
    //localStorage.setItem('from', this.thisPlace);
    this.nav.push(CreateProfilePage);
    // setTimeout(() => {
    this.events.publish('Headerlocal', "CentroFashionPage");

    //}, 500);
    //this.nav.push(CreateProfilePage);


  }

  login(page: any) {

    this.menuCtrl.toggle();

    this.app.getActiveNav().setRoot(LoginPage);
    //this.navCtrl.push(LoginPage);
    //this.menuCtrl.close();

  }
  signup() {

    this.app.getActiveNav().setRoot(SignupPage);
    //this.menuCtrl.toggle();
  }

  logout(page: any) {
    localStorage.clear();
    this.menuCtrl.toggle();
    window.location.reload();

    //this.nav.setRoot(WelcomePage, {}, { animate: true, direction: "back" });



  }
  backToWelcome() {
    this.menuCtrl.toggle();
    setTimeout(() => {
      this.events.publish('Headerlocal', "WelcomePage");
      this.nav.setRoot(WelcomePage, {}, { animate: true, direction: "back" });
    }, 300);

  }

}
