import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ProfilePage } from '../profile/profile';
import { trigger, state, style, animate, transition } from '@angular/animations';


@IonicPage()
@Component({
  selector: 'page-centro-fashion',
  templateUrl: 'centro-fashion.html',
  animations: [
    trigger('searchStatusChanged', [
      // state('shown', style({ opacity: 1 })),
      // state('hidden', style({ opacity: 0 })),
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ width: '0px', opacity: 0 })),
      transition('show => hidden', animate('0ms')),
      transition('hidden => show', animate('300ms'))
    ])
  ]
})
export class CentroFashionPage {
  public userDatails: any;
  currentPage: String;
  postsFrom = { from: "", dateTime: "",sector:"",category:"" };
  postsFilterFrom = { from: "" };
  responsePost: any;
  data: any;
  postsCF: any;
  postsFilter: any;
  dataCategories: any;
  dataSectors: any;
  show_Image: any;
  profileToGetData = { prof_id: "" };
  filterProfileData: any;
  profileF: any;
  searchStatus: Boolean;
  scrollNumber: number = 0;
  filtred:Boolean;
  counter:number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private authService: AuthServiceProvider,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController) {
    this.searchStatus = false;
      this.filtred=false;
      this.counter=1;
    if (localStorage.getItem('user')) {

      if (localStorage.getItem('user')) {
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        this.currentPage = this.navCtrl.getActive().name;
        setTimeout(() => {
          this.currentPage = this.navCtrl.getActive().name;
          this.getAllPostsFrom(this.currentPage, new Date);
          //console.log(new Date().toDateString());
        }, 50);
      }
    }
    setTimeout(() => {
      this.filterProfile(this.currentPage);
    }, 200);

    if (!localStorage.getItem('user')) {
      setTimeout(() => {
        this.currentPage = this.navCtrl.getActive().name;
        this.getAllPostsFrom(this.currentPage, new Date());
      }, 50);
    }


    this.events.subscribe('filterProfile', (data) => {
      this.filterProfileData = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('filterProfile'))))._body;
      this.filterProfileData = JSON.parse(this.filterProfileData).success;
      this.filterProfileData = JSON.parse(JSON.stringify(this.filterProfileData)).filterProfile;
      this.profileF = this.filterProfileData;
      setTimeout(() => {
        this.events.unsubscribe('filterProfile');
      });
    });
  }


  ionViewDidLoad() {
    setTimeout(() => {
      this.getCategories();
      this.getSectors();
    }, 500);

  }
  openProfile(prof_id) {
    console.log(prof_id);
    let loader = this.loadCtrl.create({
      content: 'Buscando perfil...'
    });
    loader.present();
    this.profileToGetData.prof_id = prof_id;
    this.authService.post(this.profileToGetData, "getProfile").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.setItem('profileData', JSON.stringify(this.responsePost));
        loader.dismiss();
        setTimeout(() => {
          this.navCtrl.push(ProfilePage);
        }, 200);
      } else {
        loader.dismiss();
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        console.log(msg);
        let alertSignup = this.alertCtrl.create({
          title: "Ops!",
          message: 'Esse perfil não existe!',
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }
    }, (err) => {
      loader.dismiss();
      console.log(err);
      let alertSignup = this.alertCtrl.create({
        title: "Ops!",
        message: 'Falha de conexão, verifique sua internet.',
        buttons: [{
          text: "Ok"
        }]
      });
      alertSignup.present()
    });
  }
  getCategories() {
    this.authService.getAllCategorys(this.currentPage).then((result) => {
      this.responsePost = result;
      this.dataCategories = JSON.parse(JSON.stringify(this.responsePost))._body;
      this.dataCategories = JSON.parse(this.dataCategories);
      this.dataCategories = this.dataCategories.categoryData;
    });
  }
  getSectors() {

    this.authService.getSectors(this.currentPage).then((result) => {
      this.responsePost = result;
      this.responsePost = JSON.parse(JSON.stringify(this.responsePost))._body;
      this.responsePost = JSON.parse(this.responsePost);
      this.dataSectors = this.responsePost.sectorsData;

    });
  }
  showImage() {
    this.show_Image = "imageViewer";
  }
  doRefresh(refresher) {
    this.getAllPostsFrom(this.currentPage, new Date);
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  initializerPosts() {
    this.postsFilter = this.postsCF;
  }
  initializerProfiles() {
    this.profileF = this.filterProfileData;
  }
  filterPosts(ev: any) {
    this.initializerProfiles();
    let val = ev.target.value;
    //console.log(val);
    if (val && val.trim() !== '') {
      this.profileF = this.profileF.filter((v) => {
        if (v.prof_name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          this.searchStatus = true;
          return true;
        }

        return false;
      });
    } else {
      this.searchStatus = false;
    }
  }

  doInfinite(infiniteScroll) {
    this.scrollNumber = this.scrollNumber + 10;
    if(this.filtred){
      this.getAllPostsFrom(this.currentPage, this.postsFilter[this.postsFilter.length - 1].post_created_at);
    }else if(!this.filtred && this.counter==0){
      this.counter++;
      this.getAllPostsFrom(this.currentPage, new Date());
    }else if(!this.filtred){
      this.getAllPostsFrom(this.currentPage, this.postsFilter[this.postsFilter.length - 1].post_created_at);
    }
    
    this.events.subscribe('closeInfinitScroll', (data) => {
      infiniteScroll.complete();
    });
  }

  selectSector(ev: any) {
    console.log();
    this.postsFrom.sector=ev;
    if(ev==0){
      this.counter=0;
      this.filtred=false;
    }
    //this.initializerPosts();
    let evString = ev;
    if (evString != 0) {
      this.filtred=true;
      this.postsFilter = this.postsFilter.filter((v) => {
        if (v.sector_id.toLowerCase() == evString.toLowerCase()) {
          return true;
        }
        return false;
      });
    }
  }

  selectCategory(e: any) {
    this.postsFrom.category=e;
    if(e==0){
      this.counter=0;
      this.filtred=false;
    }
    //this.initializerPosts();
    let eString = e;
    if (eString != 0) {
      this.filtred=true;
      this.postsFilter = this.postsFilter.filter((v) => {
        
        if (v.post_category_id.toLowerCase() == eString.toLowerCase()) {
          return true;
        }
        return false;
      });
    }

  }

  filterProfile(toFrom) {

    this.responsePost = '';
    this.data = '';
    this.postsFilterFrom.from = toFrom;
    this.authService.post(this.postsFilterFrom, "filterProfile").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.removeItem('filterProfile');
        localStorage.setItem('filterProfile', JSON.stringify(this.responsePost));
        this.events.publish('filterProfile', "filterProfile");
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

  getAllPostsFrom(from, date) {

    this.responsePost = '';
    this.data = '';
    this.postsFrom.from = from;
    this.postsFrom.dateTime = date;
    this.authService.post(this.postsFrom, "getAllPostsFrom").then((result) => {
      this.responsePost = result;

      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        
        this.postsCF = JSON.stringify(this.responsePost);
        this.postsCF = JSON.parse(JSON.stringify(JSON.parse(this.postsCF)))._body;
        this.postsCF = JSON.parse(this.postsCF).success;
        this.postsCF = JSON.parse(JSON.stringify(this.postsCF)).posts;
        
        
        if (this.postsFilter) {
          let x= this.postsFilter.length;
          for (var i = 0; i < this.postsCF.length; i++) {
            if (this.postsCF[i]) {
              this.postsFilter[x + i] = this.postsCF[i];
            }
          }
          console.log(this.postsFilter);
          this.events.publish('closeInfinitScroll', "");
        } else if (!this.postsFilter) {
          this.postsFilter = this.postsCF;
        }
        console.log(this.postsFilter);
        //tem que esvaziar this.postsCF
      } else {
        this.events.publish('closeInfinitScroll', "");
        if (!this.postsFilter) {
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
      }

    }, (err) => {
      this.events.publish('closeInfinitScroll', "");
      console.log(err);
      alert('Falha');

    });
  }


}
