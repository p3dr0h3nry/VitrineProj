import { Component } from '@angular/core';
import { NavController, MenuController, App, ViewController, Events } from 'ionic-angular';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { CreateProfilePage } from '../pages/create-profile/create-profile';


@Component({
  
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class Menu {

  public rootPage: any= WelcomePage;
  public userDatails: any = null;
  private thisPlace:any =null;
  private createFrom: CreateProfilePage;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public viewCtrl:ViewController, public events:Events) {
    
    this.events.unsubscribe('local');

    if (localStorage.getItem('user')) {
      
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).user;
      console.log(this.userDatails);
    }
    
      this.events.subscribe('Headerlocal',(data)=>{
        this.thisPlace = JSON.parse(JSON.stringify(data));
      });
    
  }

  // Criação do perfil da loja
  createProfile(){
    ///this.navCtrl.push(Menu);
    //this.createFrom.SetFrom("CentroFashionPage");
    // setTimeout(() => {
    //   this.events.publish('Headerlocal',"CentroFashionPage");
    //   this.navCtrl.push(CreateProfilePage);
    // }, 500);
  }

  login(page: any) {

    this.navCtrl.push(LoginPage);
    //this.menuCtrl.close();

  }
  signup() {
    this.navCtrl.push(SignupPage);
    //this.menuCtrl.toggle();
  }

  logout(page: any) {
    localStorage.clear();
    localStorage.setItem('local','WelcomePage');
    this.navCtrl.setRoot(WelcomePage);
    this.navCtrl.setRoot(Menu);
    this.menuCtrl.toggle();
  }

}
