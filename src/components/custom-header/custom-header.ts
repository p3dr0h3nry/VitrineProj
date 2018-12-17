import { Component, Input } from '@angular/core';
import { Events, NavController, MenuController, App } from 'ionic-angular';
import { Menu } from '../../app/menu';
import { CentroFashionPage } from '../../pages/centro-fashion/centro-fashion';


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

  constructor(public events:Events, public navCtrl: NavController, public menuCtrl:MenuController, public app:App) {
    if(localStorage.getItem('user')){
      //console.log("Lendo header com usuário");
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
    }else{
      //console.log("Lendo header sem usuário");
    }
  }


  @Input()
  set header(header_data: any) {
    this.header_data = header_data;
  }
  get header() {
    return this.header_data;
  }
  back(){ //está retornando para paginas principais.
    //console.log(this.navCtrl.getPrevious().name);
    if(this.navCtrl.getPrevious().name!="CentroFashionPage" && this.navCtrl.getPrevious().name!="WelcomePage" && this.navCtrl.getPrevious().name!="ProfilePage"){
      this.navCtrl.remove(this.navCtrl.getPrevious().index);
    }
    setTimeout(()=>this.navCtrl.pop(),150);
    
  }
  backToRoot(){
    if(this.navCtrl.getActive().name!="CentroFashionPage"){
      setTimeout(()=>this.navCtrl.push(CentroFashionPage),300);
    }
    
    //this.events.publish('root',"CentroFashionPage");
  }
  goToHome(){
    //console.log("gotohome");
    this.events.publish('local',"CentroFashionPage");
    // this.navCtrl.setRoot(Menu,{'rPage':CentroFashionPage});
    this.menuCtrl.close();
    this.navCtrl.pop;
    //this.menu.setRootPage(CentroFashionPage);

  }
}
