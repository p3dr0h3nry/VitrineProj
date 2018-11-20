import { Component, Input } from '@angular/core';
import { Events, NavController, MenuController, App } from 'ionic-angular';
import { CentroFashionPage } from '../../pages/centro-fashion/centro-fashion';
import { WelcomePage } from '../../pages/welcome/welcome';
import { Menu } from '../../app/menu';
import { CustomheaderPage } from '../../pages/customheader/customheader';

/**
 * Generated class for the CustomHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html'
})
export class CustomHeaderComponent {
  public userDatails:any;
  text: string;
  header_data: any;
  public menu:Menu;
  private thisPlace:any;
  private headerPlace:any;

  constructor(public events:Events, public navCtrl: NavController, public menuCtrl:MenuController, public app:App) {
    console.log("Lendo header");
    if(localStorage.getItem('user')){
      // this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      // this.userDatails = JSON.parse(this.userDatails).user;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      // console.log(this.userDatails);
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
    }
  }


  @Input()
  set header(header_data: any) {
    this.header_data = header_data;
  }
  get header() {
    return this.header_data;
  }


  goBack(){
    //console.log(this.navCtrl.getPrevious());
    // if(this.navCtrl.getPrevious().name=="WelcomePage"){
    //   this.events.publish('Headerlocal',"WelcomePage");
    // }
    setTimeout(()=>this.navCtrl.popToRoot(),300);

  }


  goToHome(){
    this.events.publish('local',"CentroFashionPage");
    // this.navCtrl.setRoot(Menu,{'rPage':CentroFashionPage});
    this.menuCtrl.close();
    this.navCtrl.pop;
    //this.menu.setRootPage(CentroFashionPage);

  }
}
