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
//import { Menu } from './menu';
import { CreateProfilePage } from '../pages/create-profile/create-profile';
//import { componentRefresh } from '@angular/core/src/render3';

@Component({
  templateUrl: 'app.html',
  // template: '<ion-nav [root]="rootPage"></ion-nav>',

})
export class MyApp implements OnInit {
  public rootPage: any;
  @ViewChild(Nav) nav: Nav;
  public userDatails: any;
  public profileDatails: any;
  private thisPlace: any = null;
  userAtive;
  profileAtive;
  //rootPage =Menu; //busca o menu na pag menu



  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public app: App, public menuCtrl: MenuController, public events: Events) {
    
    if(!this.events.subscribe('root')){ //Nao existe
      this.rootPage= WelcomePage;
 
    }
    this.userAtive = false;
    this.events.subscribe('root', data=>{
      if(data=="CentroFashionPage"){
        this.rootPage = CentroFashionPage;
        if (localStorage.getItem('user')) {
          this.userAtive = true;
          this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
          this.userDatails = JSON.parse(this.userDatails).success;
          this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
          console.log(this.userDatails.client_name);
          
        }
        console.log(this.userDatails);
      }
    });

    
    this.events.unsubscribe('local');
    
    if (localStorage.getItem('user')) {
      this.userAtive = true;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      console.log(this.userDatails.client_name);
      
    }
    // this.events.subscribe('profile', data=>{
    //   // if (localStorage.getItem('profile')) {
    //     this.profileDatails = JSON.parse(JSON.stringify(JSON.parse(data)))._body;
    //     this.profileDatails = JSON.parse(this.profileDatails).success;
    //     this.profileDatails = JSON.parse(JSON.stringify(this.profileDatails)).profileData;
    //   // }
    // });

    this.events.subscribe('Headerlocal', (data) => {
      if (localStorage.getItem('user')) {
        this.userAtive = true;
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).user;
      }
      this.thisPlace = JSON.parse(JSON.stringify(data));
      //console.log(this.thisPlace);
    });


  }
  ngOnInit() {
    // this.viewCtrl.didEnter.subscribe(()=>{
    //   console.log("Component");
    // });
  }

  // profileExist(){
  //   console.log("profileExist");
  //   if(this.userDatails.prof_id){
  //     console.log("existe")
  //     return false;
  //   }else{
  //     console.log("nao existe")
  //     return true;
  //   }
  // }

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
