import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { MyApp } from '../../app/app.component';



@IonicPage()
@Component({
  selector: 'page-centro-fashion',
  templateUrl: 'centro-fashion.html',
})
export class CentroFashionPage {
  public userDatails:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events:Events) {
    console.log("Construtor CF");
    // if(localStorage.getItem('user')){

    //   this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
    //   this.userDatails = JSON.parse(this.userDatails).success;

    //   this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
    //   console.log(this.userDatails.client_name);
    // }
    
    
    //getPostsFrom(); implementar
  }

  ionViewDidLoad() {
  }



}
