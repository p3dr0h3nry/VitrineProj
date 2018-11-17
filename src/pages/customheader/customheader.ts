import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CustomheaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customheader',
  templateUrl: 'customheader.html',
})
export class CustomheaderPage {
  // header_data:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("apagar custom");
    
  }
  // @Input()
  // set header (header_data:any){
  //   this.header_data = header_data;
  // }
  // get header(){
  //   return this.header_data;
  // }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomheaderPage');
  }

}
