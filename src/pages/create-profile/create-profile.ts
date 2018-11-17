import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the CreateProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
})
export class CreateProfilePage {
  private userDatails: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events:Events) {
        
    if(localStorage.getItem('user')){
      
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).user;
    }

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateProfilePage');
  }

}
