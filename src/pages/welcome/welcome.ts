import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App} from 'ionic-angular';

//imports do sistema
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { CentroFashionPage } from '../centro-fashion/centro-fashion';

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
  private userDatails:any;
  page:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public app:App) {
    
    if(localStorage.getItem('user')){
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
    }else{
      this.userDatails='';
    }
   }///Fim do construtor


  ionViewDidLoad() {
    //this.events.publish('local',"WelcomePage");
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
  signup() {
    this.navCtrl.push(SignupPage);
  }

  logout() {
    localStorage.clear();
    this.userDatails='';
  }
  goTo(){
    this.navCtrl.push(CentroFashionPage);
    this.events.publish('root',"CentroFashionPage");
    localStorage.setItem('root',"CentroFashionPage");

  }

}
