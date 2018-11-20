import { Component,Input,Output,EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, App} from 'ionic-angular';

//imports do sistema
import { CentroFashionPage } from '../centro-fashion/centro-fashion';
import { Menu } from '../../app/menu';
import { MyApp } from '../../app/app.component';
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
    localStorage.setItem('local','WelcomePage');
//this.events.publish('local',"WelcomePage");
    if(localStorage.getItem('user')){
      // this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      // this.userDatails = JSON.parse(this.userDatails).user;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      // console.log(this.userDatails);
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
    }
 
  }

  ionViewDidLoad() {

    this.events.publish('local',"WelcomePage");

  }

  goTo(){
  
    //localStorage.setItem('local','CentroFashionPage');
    //this.navCtrl.setRoot(Menu); se habilitar o menu vai ser o mesmo da
    //this.events.publish('local',"CentroFashionPage");
     this.events.publish('Headerlocal',"CentroFashionPage");
    
    //this.navCtrl.setRoot(Menu);
    // console.log(this.navCtrl.length.length);
    //this.app.getRootNav().setRoot(CentroFashionPage);
    this.events.publish('root',"CentroFashionPage");
    //this.navCtrl.setRoot(CentroFashionPage,{},{animate: true, direction: 'forward'});
    //this.navCtrl.push(CentroFashionPage);
    
    
    //this.navCtrl.push(CentroFashionPage);
    
  }

}
