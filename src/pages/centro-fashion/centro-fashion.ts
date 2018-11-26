import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';



@IonicPage()
@Component({
  selector: 'page-centro-fashion',
  templateUrl: 'centro-fashion.html',
})
export class CentroFashionPage {
  public userDatails: any;
  currentPage: String;
  postsFrom = { from: "" };
  responsePost: any;
  data: any;
  postsCF: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private authService: AuthServiceProvider,
    private alertCtrl: AlertController) {

    if (localStorage.getItem('user')) {

      if (localStorage.getItem('user')) {
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        this.currentPage = this.navCtrl.getActive().name;
        setTimeout(() => {
          this.currentPage = this.navCtrl.getActive().name;
          this.getAllPostsFrom(this.currentPage);
        }, 50);
      }
    }
    if(!localStorage.getItem('user')){
      setTimeout(() => {
        this.currentPage = this.navCtrl.getActive().name;
        this.getAllPostsFrom(this.currentPage);
      }, 50);
    }


    this.events.subscribe('newPostsCF', (data) => {
      //console.log("evento newPostsCF");
      this.postsCF = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('postsCF'))))._body;
      this.postsCF = JSON.parse(this.postsCF).success;
      this.postsCF = JSON.parse(JSON.stringify(this.postsCF)).posts;
      // this.imgToPost = this.userDatails.prof_img;
    });



    //getPostsFrom(); implementar
  }

  ionViewDidLoad() {

  }
  doRefresh(refresher) {
    this.getAllPostsFrom(this.currentPage);

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  getAllPostsFrom(from) {
    //this.events.unsubscribe('newPostsCF');
    //console.log(from);
    this.responsePost = '';
    this.data = '';
    this.postsFrom.from = from;
    //console.log(this.postsFrom);
    this.authService.post(this.postsFrom, "getAllPostsFrom").then((result) => {
      //console.log(result);
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.removeItem('postsCF');
        localStorage.setItem('postsCF', JSON.stringify(this.responsePost));
        this.events.publish('newPostsCF', "newPostsCF");
      } else {
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        let alertSignup = this.alertCtrl.create({
          title: "Ops!!",
          message: msg,
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }

    }, (err) => {
      console.log(err);

      alert('Falha');

    });
  }


}
