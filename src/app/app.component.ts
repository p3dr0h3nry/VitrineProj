import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, App, MenuController, Refresher, Events, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
//Modulo do sistema
import { WelcomePage } from '../pages/welcome/welcome';
import { CentroFashionPage } from '../pages/centro-fashion/centro-fashion';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { Menu } from './menu';
import { CreateProfilePage } from '../pages/create-profile/create-profile';

@Component({
  templateUrl: 'app.html',
  //template: '<ion-nav [root]="rootPage"></ion-nav>',

})
export class MyApp implements OnInit {
  rootPage: any = WelcomePage;
  @ViewChild(Nav) nav: Nav;
  public userDatails: any;
  private thisPlace: any = null;
  userAtive;
  ;
  //rootPage =Menu; //busca o menu na pag menu



  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public app: App, public menuCtrl: MenuController, public events: Events) {
    this.userAtive = false;
    this.events.unsubscribe('local');
    if (localStorage.getItem('user')) {
      this.userAtive = true;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).user;

    }

    this.events.subscribe('Headerlocal', (data) => {
      if (localStorage.getItem('user')) {
        this.userAtive = true;
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).user;
      }
      this.thisPlace = JSON.parse(JSON.stringify(data));
      console.log(this.thisPlace);
    });


  }
  ngOnInit() {


  }

  // login(page: any) {
  //   console.log("login do componente");
  // this.app.getActiveNav().setRoot(LoginPage);
  // this.menuCtrl.toggle();
  //this.rootPage = LoginPage;


  // signup() {
  //   console.log("signup");
  //   this.app.getActiveNav().setRoot(SignupPage);
  //   this.menuCtrl.toggle();
  // }

  // logout(page: any) {
  //   localStorage.clear();
  //   this.app.getActiveNav().setRoot(MyApp);
  //   this.events.unsubscribe('user', null);
  //   this.menuCtrl.toggle();
  // }


  // Criação do perfil da loja
  createProfile() {
    ///this.navCtrl.push(Menu);
    this.menuCtrl.toggle();
    localStorage.setItem('from', this.thisPlace);
    this.nav.push(CreateProfilePage);
    // setTimeout(() => {
      //this.events.publish('Headerlocal',"CentroFashionPage");
      
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
    //this.userAtive=false;
    //this.events.publish('Headerlocal',"WelcomePage");
    this.nav.setRoot(WelcomePage, {}, { animate: true, direction: "back" });



  }
  backToWelcome() {
    this.menuCtrl.toggle();
    setTimeout(() => {
      this.events.publish('Headerlocal', "WelcomePage");
      this.nav.setRoot(WelcomePage, {}, { animate: true, direction: "back" });
    }, 300);

  }

}
