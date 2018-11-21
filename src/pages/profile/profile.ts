import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public userDatails:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if(localStorage.getItem('user')){
      // this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      // this.userDatails = JSON.parse(this.userDatails).user;
      // console.log(this.userDatails);
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      // console.log(this.userDatails);
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      console.log(this.userDatails.client_name);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
