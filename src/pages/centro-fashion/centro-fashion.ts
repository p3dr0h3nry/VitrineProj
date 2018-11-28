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
  postsFilter: any;
  dataCategories: any;
  dataSectors: any;
  filter_sector: any;
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
    if (!localStorage.getItem('user')) {
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
      this.postsFilter = this.postsCF;
      //console.log(this.postsCF);
      // this.imgToPost = this.userDatails.prof_img;
    });



    //getPostsFrom(); implementar
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.getCategories();
      this.getSectors();
    }, 500);

  }

  getCategories() {
    console.log("buscando categoria CFPage");
    this.authService.getAllCategorys(this.currentPage).then((result) => {
      this.responsePost = result;
      //console.log(this.responseGet);
      this.dataCategories = JSON.parse(JSON.stringify(this.responsePost))._body;
      //console.log("Parse+stringify: " + this.responseGet);
      this.dataCategories = JSON.parse(this.dataCategories);
      this.dataCategories = this.dataCategories.categoryData;
      //console.log(this.dataCategory);
    });
  }
  getSectors() {
    console.log("buscando setor CFPage");
    this.authService.getSectors(this.currentPage).then((result) => {
      this.responsePost = result;
      //console.log(this.responsePost);
      this.responsePost = JSON.parse(JSON.stringify(this.responsePost))._body;
      //console.log("Parse+stringify: " + this.responsePost);
      this.responsePost = JSON.parse(this.responsePost);
      this.dataSectors = this.responsePost.sectorsData;
  
    });
  }
  doRefresh(refresher) {
    this.getAllPostsFrom(this.currentPage);

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  initializerPosts() {
    this.postsFilter = this.postsCF;
  }

  filterPosts(ev: any) {
    //console.log(ev.target.value);
    this.initializerPosts();
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.postsFilter = this.postsFilter.filter((v) => {
        if (v.prof_name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }
  }
  selectSector(ev: any) {
    this.filter_sector='';
    this.initializerPosts();
    let evString = ev;
    if (evString != 'Todos') {
      this.postsFilter = this.postsFilter.filter((v) => {
        //console.log(v.sector_name.toLowerCase() == evString.toLowerCase());
        if (v.sector_name.toLowerCase() == evString.toLowerCase()) {
          //this.filter_sector=this.filter_sector+JSON.stringify(v);
          return true;
        }
        return false;
      });
    } else {
      this.filter_sector = '';
    }
    //is.filter_sector=JSON.parse(this.filter_sector);
  }

  selectCategory(e: any) {
    this.initializerPosts();
    let eString = e;
    // if (this.filter_sector!='') {
    //   this.filter_sector=JSON.parse(this.filter_sector);
    //   if (eString != 0) {
    //     this.filter_sector = this.filter_sector.filter((v) => {
    //       if (v.post_category_id.toLowerCase() == eString.toLowerCase()) {
    //         return true;
    //       }
    //       return false;
    //     });
    //   }
    // } else {
      if (eString != 0) {
        this.postsFilter = this.postsFilter.filter((v) => {
          if (v.post_category_id.toLowerCase() == eString.toLowerCase()) {
            return true;
          }
          return false;
        });
      }
    // }
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
