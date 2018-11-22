import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ActionSheetController, Events } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
  animations: [
    trigger('visibilityChanged', [
      // state('shown', style({ opacity: 1 })),
      // state('hidden', style({ opacity: 0 })),
      state('shown', style({ opacity:1 })),
      state('hidden', style({ height: '0px', opacity:0 })),
      transition('show => hidden', animate('200ms')),
      transition('hidden => show', animate('500ms'))
    ])
  ]

})
export class ProfilePage {
  base64Image: string;
  public userDatails: any;
  responseImg: any;
  responsePost: any;
  response_getimg: any;
  imgData = { prof_id: "", imageB64: "" };
  newPost = {post_prof_id:"",post_desc:"",post_img:"",post_sector_id:"",post_category_id:"",post_from:""};
  getPostsFrom = {post_prof_id:"",post_from:""};
  getData = { prof_id: "" };
  dataImagem;
  data;
  addPost;
  public imgToPost:string;
  thisplace;
  public postsDatails:any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private alertCtrl: AlertController,
    private domSanitizer: DomSanitizer,
    private loadCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private http: HttpClient,
    private actionsheetCtrl: ActionSheetController,
    private events: Events
  ) {
    //setando variáveis
    this.imgToPost;
    this.addPost=true;
    this.events.unsubscribe('local');
    
    if (localStorage.getItem('user')) {

      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      // this.imgToPost = this.userDatails.prof_img;
      let loader = this.loadCtrl.create({
        content: 'Buscando postagens...'
      });
      loader.present();

      console.log(this.userDatails);
      setTimeout(() => {
        this.getAllPostsProfile();
        loader.dismiss();
      }, 1500);
      
    }
    if (localStorage.getItem('posts')) {
      // console.log(localStorage.getItem('posts'));
      this.postsDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('posts'))))._body;
      this.postsDatails = JSON.parse(this.postsDatails).success;
      this.postsDatails = JSON.parse(JSON.stringify(this.postsDatails)).posts;
      // this.imgToPost = this.userDatails.prof_img;
      console.log(this.postsDatails);
    }
    
    this.events.subscribe('newPosts', (data) => {
      if (localStorage.getItem('posts')) {
        console.log("Evento+teste");
        console.log(JSON.parse(localStorage.getItem('posts')));
        this.postsDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('posts'))))._body;
        this.postsDatails = JSON.parse(this.postsDatails).success;
        this.postsDatails = JSON.parse(JSON.stringify(this.postsDatails)).posts;
        // this.imgToPost = this.userDatails.prof_img;
        //console.log("Posts do evento:"+this.postsDatails);
      }
    });

    this.events.subscribe('local', (data) => {
      this.thisplace = data;
      console.log("Escutei o evento");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getAllPostsProfile(){
    this.getPostsFrom.post_prof_id = this.userDatails.prof_id;
    this.getPostsFrom.post_from = this.thisplace;
    this.authService.getAllPostsProfile(this.getPostsFrom, "getAllPostsProfile").then((result) => {
      this.responsePost = result;
      
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;

      if (!JSON.parse(this.data).error) { //Retorno ok
  
        localStorage.setItem('posts', JSON.stringify(this.responsePost));
        this.events.publish('newPosts',"newPosts");
       } else {
  
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        let alertSignup = this.alertCtrl.create({
          title: "Erro!",
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

  toggle() {
    this.addPost=!this.addPost;
    this.imgToPost=''; 
  }

  /////////////Cria postagem
  createPost() {

    let loader = this.loadCtrl.create({
      content: 'Salvando postagem...'
    });
    loader.present();

    this.newPost.post_prof_id = this.userDatails.prof_id;
    this.newPost.post_img = this.imgToPost;
    this.newPost.post_desc="";
    this.newPost.post_sector_id = this.userDatails.sector_id;
    this.newPost.post_category_id = this.userDatails.prof_category_id;
    this.newPost.post_from = this.thisplace;

    this.authService.newPost(this.newPost, "newPost").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.setItem('posts', JSON.stringify(this.responsePost));
        this.events.publish('newPosts',"newPosts");
        this.addPost=!this.addPost; //Fecha as opções de postagem
        this.imgToPost=''; 
        setTimeout(() => {
          loader.dismiss();
          alert("Postagem realizada!");
        }, 3000);

      } else {
        loader.dismiss();
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        let alertSignup = this.alertCtrl.create({
          title: "Erro!",
          message: msg,
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }

    }, (err) => {
      console.log(err);
      loader.dismiss();
      alert('Falha');

    });

    

  }

  selectImgFrom(from) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Opções',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Tirar Foto!',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.takePhoto(from);
          }
        },
        {
          text: 'Escolher na galeria!',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.openGallery(from);
          }
        },
      ]
    });
    actionSheet.present();
  }

  takePhoto(from) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 720,
      targetWidth: 1280,
      saveToPhotoAlbum: true,
      allowEdit:true
    }

    this.camera.getPicture(options).then(imageData => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      if(from=='imgProfile'){
        this.uploadImage(this.base64Image);
      }else if(from=='imgPost'){
        this.imgToPost = this.base64Image;
      }
      

    }, (err) => {
      // Handle error
    });
  }

  openGallery(from) {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetHeight: 720,
      targetWidth: 1280,
      allowEdit:true
    }

    this.camera.getPicture(options).then(imageData => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      //this.userDatails.prof_img = true;
      if(from=='imgProfile'){
        this.uploadImage(this.base64Image);
      }else if(from=='imgPost'){
        this.imgToPost = this.base64Image;
      }

    }, (err) => {
      // Handle error
    });
  }

  uploadImage(base64Image) {

    let loader = this.loadCtrl.create({
      content: 'Salvando imagem...'
    });
    loader.present();

    this.imgData.prof_id = this.userDatails.prof_id;
    this.imgData.imageB64 = base64Image;

    this.authService.uploadImg(this.imgData, "uploadImg").then((result) => {
      this.responseImg = result;
      this.data = JSON.parse(JSON.stringify(this.responseImg))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        //this.dataImagem = this.base64Image;
        localStorage.setItem('user', JSON.stringify(this.responseImg));
        this.userDatails.prof_img = base64Image;
        setTimeout(() => {
          loader.dismiss();
          alert("Foto do Perfil Atualizada!");
        }, 3000);

      } else {
        loader.dismiss();
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        let alertSignup = this.alertCtrl.create({
          title: "Erro!",
          message: msg,
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }

    }, (err) => {
      console.log(err);
      loader.dismiss();
      alert('Falha');

    });
  }

}
