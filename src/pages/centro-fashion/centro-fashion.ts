import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController, ModalController, Modal, ModalOptions, } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ProfilePage } from '../profile/profile';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { _ParseAST } from '@angular/compiler';
import { ScrollHideConfig } from '../../directives/hide-search/hide-search';


@IonicPage()
@Component({
  selector: 'page-centro-fashion',
  templateUrl: 'centro-fashion.html',
  animations: [
    trigger('searchStatusChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ width: '0px', opacity: 0 })),
      transition('show => hidden', animate('0ms')),
      transition('hidden => show', animate('300ms'))
    ]),
    // trigger('filterDiv', [
    //   state('shown', style({ opacity: 1 })),
    //   state('hidden', style({ close: 1, opacity: 0 })),
    //   transition('show => hidden', animate('0ms')),
    //   transition('hidden => show', animate('300ms'))
    // ])
  ]
})
export class CentroFashionPage {

  searchScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 115 };
  public userDatails: any;
  currentPage: string; //Armazena a pagina corrente
  postsFrom = { from: "", dateTime: "", last_dateTime: "", sector: "", category: "" };
  postsFilterFrom = { from: "" };
  responsePost: any; //resposta do banco
  data: any;
  postsCF: any; //Armazena a ulta busca no banco
  postsFilter: any; //Armazena a lista completa já buscada
  dataCategories: any; // Armazena as categorias vindas do banco
  dataSectors: any;// Armazena os setores vindas do banco
  //show_Image: any; //Flag para imageviewer
  profileToGetData = { client_id: "" };
  dataToSetFavorite = { client_id: "", user_id: "", fromm: "" };
  dataFavorites: any;
  filterProfileData: any;
  profileF: any; //Lista de nomes de todos os profiles cadastrados
  searchStatus: Boolean; //Flag de exibição da lista de busca das lojas
  filterReset: Boolean; //Flag caso algum seletor de filtro esteja marcado
  counter: number;
  filterDiv; //Define se a DIV de filtro será exibida
  refresher; //Caso tenha dado refresh
  searchFilterStatus; //flag de ação para buscar os filtros
  flagButtonFilter;
  postsVariable: any;
  favorites: string;
  flagBookmark;
  flagSearchFilter: boolean;
  loadPosts: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private authService: AuthServiceProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController) {
    this.flagSearchFilter = false;
    this.filterDiv = false;
    this.searchStatus = false;
    this.filterReset = false;
    this.counter = 1;
    this.refresher = false;
    this.searchFilterStatus = true; //flag invertida
    this.dataFavorites = '';
    this.favorites = '';
    this.flagBookmark = false;
    // this.flagButtonFilter=false;

    if (localStorage.getItem('user')) {
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      if (!sessionStorage.getItem('favorites')) {
        this.getFavorites();
      }
      if (sessionStorage.getItem('favorites')) {
        this.dataFavorites = JSON.parse(JSON.stringify(JSON.parse(sessionStorage.getItem('favorites'))))._body;
        this.dataFavorites = JSON.parse(this.dataFavorites).success;
        this.dataFavorites = JSON.parse(JSON.stringify(this.dataFavorites)).favorites;

        if (this.dataFavorites.fav_clients_id == '') {

          this.flagBookmark = false;
        } else {
          this.flagBookmark = true;
        }
      }
      setTimeout(() => {
        this.currentPage = this.navCtrl.getActive().name;
        if (!sessionStorage.getItem('postsFilter')) {
          this.loadPosts = this.loadCtrl.create({
            content: 'Carregando posts...',
            dismissOnPageChange: true,
            showBackdrop: true,
            enableBackdropDismiss: true
          });
          this.loadPosts.present();
          this.getAllPostsFrom(this.currentPage, new Date);

        } else {
          setTimeout(() => {
            this.postsVariable = JSON.parse(sessionStorage.getItem('postsFilter'));
            this.postsFilter = this.postsVariable;
            //console.log(this.postsFilter);
          }, 100);
        }
      }, 50);
      //console.log(new Date().toDateString());
    }
    setTimeout(() => {
      //console.log(this.filterProfileData);
      if (!this.filterProfileData) {
        this.filterProfile(this.currentPage);
      } else {
        this.profileF = this.filterProfileData;
        //console.log(this.profileF);
      }
    }, 200);



    // if (!localStorage.getItem('user')) { Já que somenta há usuários logados!
    //   setTimeout(() => {
    //     this.currentPage = this.navCtrl.getActive().name;
    //     if (!sessionStorage.getItem('postsFilter')) {
    //       this.getAllPostsFrom(this.currentPage, new Date);
    //     } else {
    //       setTimeout(() => {

    //         // this.postsVariable = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('postsFilter'))))._body;
    //         // this.postsVariable = JSON.parse(this.postsVariable).success;
    //         // this.postsVariable = JSON.parse(JSON.stringify(this.postsVariable)).posts;
    //         this.postsFilter = JSON.parse(sessionStorage.getItem('postsFilter'));
    //       }, 100);


    //     }
    //   }, 50);

    // }
    this.events.subscribe('filterProfile', (data) => {
      this.filterProfileData = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('filterProfile'))))._body;
      this.filterProfileData = JSON.parse(this.filterProfileData).success;
      this.filterProfileData = JSON.parse(JSON.stringify(this.filterProfileData)).filterProfile;
      this.profileF = this.filterProfileData;
      //console.log(this.profileF);
      setTimeout(() => {
        this.events.unsubscribe('filterProfile');
      });
    });

  }

  toggle() {
    this.filterDiv = !this.filterDiv;
  }

  // bookmarkModal() { desativando
  //   //chamar todos os os favoritos
  //   // const myModalOptions: ModalOptions = {
  //   //   showBackdrop: true,
  //   //   enableBackdropDismiss: true,
  //   // };
  //   const myModalData = { //isso é passado pra dentro do modal
  //     name: 'teste',
  //     algo: 'teste'
  //   };
  //   const bookModal: Modal = this.modalCtrl.create('ModalBookmarkPage', { data: myModalData }, { cssClass: "mymodal" });
  //   bookModal.present();
  //   // bookModal.onDidDismiss(data=>{
  //   //   this.navCtrl.push.
  //   // });
  // }

  ionViewDidLoad() {
    if (!this.dataCategories || !this.dataSectors) {
      setTimeout(() => {
        this.getCategories();
        this.getSectors();
      }, 50);
    }
  }
  getFavorites() {
    this.dataToSetFavorite.user_id = this.userDatails.user_id;

    this.authService.post(this.dataToSetFavorite, "getFavorites").then((result) => {
      this.responsePost = result;
      console.log(result);
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok

        sessionStorage.setItem('favorites', JSON.stringify(this.responsePost));
        setTimeout(() => {
          this.events.publish('favorites', JSON.stringify(this.responsePost));
        }, 100);

        this.dataFavorites = JSON.stringify(this.responsePost);
        this.dataFavorites = JSON.parse(JSON.stringify(JSON.parse(this.dataFavorites)))._body;
        this.dataFavorites = JSON.parse(this.dataFavorites).success;
        this.dataFavorites = JSON.parse(JSON.stringify(this.dataFavorites)).favorites;
        if (this.dataFavorites.fav_clients_id == '') {
          this.flagBookmark = false;
        } else {
          this.flagBookmark = true;
        }

      } else {
        this.addFavorite(0);
      }
    }, (err) => {
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

  openProfile(prof_id) {
    //console.log(prof_id);
    let loader = this.loadCtrl.create({
      content: 'Buscando perfil...'
    });
    loader.present();
    this.profileToGetData.client_id = prof_id;
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
  // showImage() {
  //   this.show_Image = "imageViewer";
  // }
  doRefresh(refresher) {
    this.loadPosts = this.loadCtrl.create({
      content: 'Carregando...',
      dismissOnPageChange: true,
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    this.loadPosts.present();

    if (this.postsFilter[0] != undefined) {
      this.postsFrom.last_dateTime = this.postsFilter[0].post_created_at;
      this.refresher = true;

      this.getAllPostsFrom(this.currentPage, new Date);
      setTimeout(() => {
        refresher.complete();
        this.postsFrom.last_dateTime = '';
      }, 2000);
    } else {
      this.getAllPostsFrom(this.currentPage, new Date);
      setTimeout(() => {
        refresher.complete();
        //this.postsFrom.last_dateTime = '';
      }, 2000);
    }

  }

  // initializerPosts() {
  //   this.postsFilter = this.postsCF;
  // }
  initializerProfiles() {
    this.profileF = this.filterProfileData;
  }

  removeFavorite(prof_client_id) {
    this.dataToSetFavorite.client_id = '';
    //console.log(prof_client_id);
    if (this.dataFavorites.fav_clients_id.indexOf(',' + prof_client_id) > -1) {
      this.dataToSetFavorite.client_id = this.dataFavorites.fav_clients_id.replace(',' + prof_client_id, '');
    } else {
      this.dataToSetFavorite.client_id = this.dataFavorites.fav_clients_id.replace(prof_client_id, '');
    }
    this.dataToSetFavorite.user_id = this.userDatails.user_id;
    this.dataToSetFavorite.fromm = this.currentPage;
    //console.log(this.dataToSetFavorite);
    this.authService.post(this.dataToSetFavorite, "removeFavorite").then((result) => {
      this.responsePost = result;
      //console.log(result);
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        
        this.dataFavorites = JSON.stringify(this.responsePost);
        this.dataFavorites = JSON.parse(JSON.stringify(JSON.parse(this.dataFavorites)))._body;
        this.dataFavorites = JSON.parse(this.dataFavorites).success;
        this.dataFavorites = JSON.parse(JSON.stringify(this.dataFavorites)).favorites;
        if (this.dataFavorites.fav_clients_id == '') {
          this.flagBookmark = false;
        } else {
          this.flagBookmark = true;
        }
        sessionStorage.setItem('favorites', JSON.stringify(this.responsePost));
        setTimeout(() => {
          this.events.publish('favorites', JSON.stringify(this.responsePost));
        }, 100);
        

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

  addFavorite(prof_client_id) {
    if (this.dataFavorites.fav_clients_id != '') {
      this.dataToSetFavorite.client_id = this.dataFavorites.fav_clients_id + "," + prof_client_id;
    } else {
      this.dataToSetFavorite.client_id = prof_client_id;
    }
    this.dataToSetFavorite.user_id = this.userDatails.user_id;
    this.dataToSetFavorite.fromm = this.currentPage;
    //console.log(this.dataToSetFavorite);
    this.authService.post(this.dataToSetFavorite, "setFavorite").then((result) => {
      this.responsePost = result;
      //console.log(result);
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        this.dataFavorites = JSON.stringify(this.responsePost);
        this.dataFavorites = JSON.parse(JSON.stringify(JSON.parse(this.dataFavorites)))._body;
        this.dataFavorites = JSON.parse(this.dataFavorites).success;
        this.dataFavorites = JSON.parse(JSON.stringify(this.dataFavorites)).favorites;
        if (this.dataFavorites.fav_clients_id == '') {
          this.flagBookmark = false;
        } else {
          this.flagBookmark = true;
        }
        sessionStorage.setItem('favorites', JSON.stringify(this.responsePost));
        setTimeout(() => {
          this.events.publish('favorites', JSON.stringify(this.responsePost));
        }, 100);

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
  searchStores(ev: any) {
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
    this.loadPosts = this.loadCtrl.create({
      content: 'Carregando...',
      dismissOnPageChange: true,
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    this.loadPosts.present();
    setTimeout(() => {
      this.refresher = false;
    }, 1000);

    infiniteScroll.enable(false);
    if (!this.filterReset) {
      console.log("scroll sem filterReset");
      this.getAllPostsFrom(this.currentPage, this.postsFilter[this.postsFilter.length - 1].post_created_at);
    }
    else if (this.filterReset) {
      console.log("scroll com filterReset");
      this.getAllPostsFrom(this.currentPage, new Date());
    }
    this.events.subscribe('closeInfinitScroll', (data) => {
      infiniteScroll.complete();
    });
    setTimeout(() => {
      infiniteScroll.enable(true);
    }, 5000);
  }

  selectSector(ev: any) {
    if (ev == 0) {
      this.postsFrom.sector = '';
      this.counter = 0;
      if (this.postsFrom.category == '') {
        this.loadPosts = this.loadCtrl.create({
          content: 'Carregando...',
          dismissOnPageChange: true,
          showBackdrop: true,
          enableBackdropDismiss: true
        });
        this.loadPosts.present();
        this.filterReset = true;
        this.flagButtonFilter = false;
        this.postsFilter = this.postsFilter.filter((v) => {
          return false;
        });
        this.postsFrom.last_dateTime = '';
        this.getAllPostsFrom(this.currentPage, new Date());
      }
      // if (this.postsCF[0].prof_id != this.postsFilter[0].prof_id) {
      //   this.postsFilter = this.postsFilter.filter((v) => {
      //     return false;
      //   });
      //   this.getAllPostsFrom(this.currentPage, new Date());
      // }

    } else {
      this.flagButtonFilter = true;
      this.postsFrom.sector = ev;
      this.counter++;
      this.filterReset = false;
    }

    //this.initializerPosts();
    // let evString = ev;
    // if (evString != 0) {
    //   this.filtred = true;
    //   this.postsFilter = this.postsFilter.filter((v) => {
    //     if (v.sector_id.toLowerCase() == evString.toLowerCase()) {
    //       return true;
    //     }
    //     return false;
    //   });
    // }
  }

  selectCategory(e: any) {

    if (e == 0) {

      this.postsFrom.category = '';
      this.counter = 0;
      if (this.postsFrom.sector == '') {
        this.loadPosts = this.loadCtrl.create({
          content: 'Carregando...',
          dismissOnPageChange: true,
          showBackdrop: true,
          enableBackdropDismiss: true
        });
        this.loadPosts.present();
        this.filterReset = true;
        this.flagButtonFilter = false;
        this.postsFilter = this.postsFilter.filter((v) => {
          return false;
        });
        this.postsFrom.last_dateTime = '';
        this.getAllPostsFrom(this.currentPage, new Date());
      }

    } else {
      this.flagButtonFilter = true;
      this.postsFrom.category = e;
      this.counter++;
      this.filterReset = false;
    }
    //this.initializerPosts();
    // let eString = e;
    // if (eString != 0) {
    //   this.filtred=true;
    //   this.postsFilter = this.postsFilter.filter((v) => {

    //     if (v.post_category_id.toLowerCase() == eString.toLowerCase()) {
    //       return true;
    //     }
    //     return false;
    //   });
    // }

  }
  searchFilter() {
    this.loadPosts = this.loadCtrl.create({
      content: 'Carregando...',
      dismissOnPageChange: true,
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    this.loadPosts.present();
    this.flagSearchFilter = true;
    this.getAllPostsFrom(this.currentPage, new Date());

    // if (this.postsFrom.sector != '' && this.postsFrom.category == '') {
    //   this.postsFilter = this.postsFilter.filter((v) => {
    //     if (v.post_sector_id.toLowerCase() == this.postsFrom.sector.toLowerCase()) {
    //       return true;
    //     }
    //     return false;
    //   });
    // } else if (this.postsFrom.sector == '' && this.postsFrom.category != '') {
    //   this.postsFilter = this.postsFilter.filter((v) => {
    //     if (v.post_category_id.toLowerCase() == this.postsFrom.category.toLowerCase()) {
    //       return true;
    //     }
    //     return false;
    //   });
    // } else if (this.postsFrom.sector != '' && this.postsFrom.category != '') {
    //   this.postsFilter = this.postsFilter.filter((v) => {
    //     if ((v.post_category_id.toLowerCase() == this.postsFrom.category.toLowerCase()) && (v.post_sector_id.toLowerCase() == this.postsFrom.sector.toLowerCase())) {
    //       return true;
    //     }

    //     return false;
    //   });
    // }
    // setTimeout(() => {
    //   //this.postsFrom.last_dateTime=this.postsFilter[this.postsFilter.length-1].post_created_at;
    //   if (!this.postsFilter[0] == undefined) {
    //     //console.log(this.postsFilter);
    //     this.getAllPostsFrom(this.currentPage, this.postsFilter[this.postsFilter.length - 1].post_created_at);
    //   } else {
    //     this.postsFrom.last_dateTime = '';
    //     this.getAllPostsFrom(this.currentPage, new Date());
    //   }

    // }, 500);

  }

  filterProfile(toFrom) {

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
    //console.log("getAllPostsFrom-log: Status PostFilter: " + this.postsFilter + " Status refresher: " + this.refresher
    //+ " status searchFilterStatus: " + this.searchFilterStatus + " filterReset: " + this.filterReset);
    this.authService.post(this.postsFrom, "getAllPostsFrom").then((result) => {
      this.responsePost = result;
      //console.log(this.responsePost);
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        this.loadPosts.dismiss();
        this.postsCF = JSON.stringify(this.responsePost);
        this.postsCF = JSON.parse(JSON.stringify(JSON.parse(this.postsCF)))._body;
        this.postsCF = JSON.parse(this.postsCF).success;
        this.postsCF = JSON.parse(JSON.stringify(this.postsCF)).posts;

        if (this.flagSearchFilter) {
          this.flagSearchFilter = false;
          this.postsFilter = this.postsCF;
          sessionStorage.setItem('postsFilter', JSON.stringify(this.postsCF));
        }

        if (!this.postsFilter && !this.refresher) { // contempla a primeira entrada
          //console.log("1");
          this.postsFilter = this.postsCF;
          sessionStorage.setItem('postsFilter', JSON.stringify(this.postsCF));

        } else if (this.postsFilter && this.refresher && this.postsCF[0].post_id != this.postsFilter[0].post_id) { // contempla refresh e testa para nao duplicar
          this.refresher = false;
          //console.log("2");
          let x = this.postsCF.length;
          for (var i = 0; i < this.postsFilter.length; i++) { //concatena encima

            this.postsCF[x + i] = this.postsFilter[i];

          }
          this.postsFilter = this.postsCF;
          this.postsCF = '';
          sessionStorage.setItem('postsFilter', JSON.stringify(this.postsFilter));
        } else if (this.postsFilter[0] != undefined && !this.refresher && this.postsCF[this.postsCF.length - 1].post_id != this.postsFilter[this.postsFilter.length - 1].post_id) { // scroll infinito
          //console.log("3");
          this.events.publish('closeInfinitScroll', "");
          let x = this.postsFilter.length;
          for (var i = 0; i < this.postsCF.length; i++) { //concatena embaixo
            if (this.postsCF[i]) {
              this.postsFilter[x + i] = this.postsCF[i];
            }
          }
          sessionStorage.setItem('postsFilter', JSON.stringify(this.postsFilter));
        } else if (this.postsFilter && this.filterReset) {
          //console.log("4");
          this.filterReset = false;
          this.postsFilter = this.postsCF;
          sessionStorage.setItem('postsFilter', JSON.stringify(this.postsFilter));
        }
        this.postsCF = '';
      } else {
        this.loadPosts.dismiss();
        //console.log(this.postsFilter);
        this.events.publish('closeInfinitScroll', "");
        if (this.postsFilter[0] == undefined) {
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
