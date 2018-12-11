import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ActionSheetController, Events } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ImageViewerController } from 'ionic-img-viewer';
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
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ height: '0px', opacity: 0 })),
      transition('show => hidden', animate('500ms')),
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
  newPost = { post_prof_id: "", post_desc: "", post_img: "", post_sector_id: "", post_category_id: "", post_from: "" };
  getPostsFrom = { post_prof_id: "", post_from: "" };
  getData = { prof_id: "" };
  postId = { post_id: "", prof_id: "" };
  profileToGetData = { client_id: "" };
  dataImagem;
  data;
  addPost;
  public imgToPost: string;
  thisplace;
  public postsDatails: any;
  public profileDatails: any;
  editPermission: boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private camera: Camera,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private actionsheetCtrl: ActionSheetController,
    private events: Events,
    private imgViewerCtrl: ImageViewerController
  ) {
    this.imgToPost = '';
    this.addPost = true;
    this.events.unsubscribe('local');
    this.editPermission = false;
    this.userDatails = '';
    this.profileDatails = '';
    this.userDatails = '';
    this.postsDatails = '';

    if (localStorage.getItem('user')) {
      
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      let loader = this.loadCtrl.create({
        content: 'Atualizando postagens...'
      });
      loader.present();
      setTimeout(() => {
        this.getAllPostsProfile();
        loader.dismiss();
      }, 1500);

    }

    if (localStorage.getItem('profileData')) {  //busca os dados do perfil
      this.profileDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('profileData'))))._body;
      this.profileDatails = JSON.parse(this.profileDatails).success;
      this.profileDatails = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.profileDatails)))).profileData;
      //this.imgToPost = this.profileDatails.prof_img;
      if (localStorage.getItem('user')) {
        if (this.userDatails.client_id == this.profileDatails.prof_client_id) {
          this.editPermission = true;
        } else {
          this.editPermission = false;
        }
      } else {
        let loader = this.loadCtrl.create({
          content: 'Buscando postagens...'
        });
        loader.present();
        //console.log(this.userDatails);
        setTimeout(() => {
          this.getAllPostsProfile();
          loader.dismiss();
        }, 1500);
        this.editPermission = false;
      }

    }

    this.events.subscribe('updateProfile', (data) => {

      this.profileDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('profile'))))._body;
      this.profileDatails = JSON.parse(this.profileDatails).success;
      this.profileDatails = JSON.parse(JSON.stringify(this.profileDatails)).profile;
    });

    // if (localStorage.getItem('posts')) {
    //   // console.log(localStorage.getItem('posts'));
    //   this.postsDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('posts'))))._body;
    //   this.postsDatails = JSON.parse(this.postsDatails).success;
    //   this.postsDatails = JSON.parse(JSON.stringify(this.postsDatails)).posts;
    //   // this.imgToPost = this.userDatails.prof_img;
    //   //console.log(this.postsDatails);
    // }

    // this.events.subscribe('newPosts', (data) => {
    //   this.postsDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('posts'))))._body;
    //   this.postsDatails = JSON.parse(this.postsDatails).success;
    //   this.postsDatails = JSON.parse(JSON.stringify(this.postsDatails)).posts;
    //   // this.imgToPost = this.userDatails.prof_img;
    //   console.log(this.postsDatails);
    //   //this.events.unsubscribe('newPosts');

    // });

    if (localStorage.getItem('root')) {
      //console.log(localStorage.getItem('root'))
      this.thisplace = localStorage.getItem('root');
    }

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }


  getAllPostsProfile() {
    this.getPostsFrom.post_prof_id = this.profileDatails.prof_id;

    this.getPostsFrom.post_from = this.thisplace;
    //console.log(this.thisplace);
    //console.log(this.getPostsFrom);
    this.authService.getAllPostsProfile(this.getPostsFrom, "getAllPostsProfile").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok

        this.postsDatails = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.responsePost))))._body;
        this.postsDatails = JSON.parse(this.postsDatails).success;
        this.postsDatails = JSON.parse(JSON.stringify(this.postsDatails)).posts;
      } else {
        if (this.userDatails.client_id == this.profileDatails.prof_client_id) {
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
        }else{
          let alertSignup = this.alertCtrl.create({
            title: "Ops!!",
            message: "Nenhuma postagem encontrada nesse perfil.",
            buttons: [{
              text: "Ok"
            }]
          });
          alertSignup.present()
        }
      }

    }, (err) => {
      console.log(err);

      alert('Falha');

    });
  }

  toggle() {
    this.addPost = !this.addPost;
    this.imgToPost = '';
  }

  /////////////Cria postagem
  createPost() {

    if (this.imgToPost == '') {

      let alertSignup = this.alertCtrl.create({
        title: "Ops!!",
        message: "Selecione uma imagem para postar",
        buttons: [{
          text: "Ok"
        }]
      });
      alertSignup.present()
    } else {
      let loader = this.loadCtrl.create({
        content: 'Salvando postagem...'
      });
      loader.present();
      this.newPost.post_prof_id = this.profileDatails.prof_id;
      this.newPost.post_img = this.imgToPost;
      this.newPost.post_desc = "";
      this.newPost.post_sector_id = this.profileDatails.sector_id;
      this.newPost.post_category_id = this.profileDatails.prof_category_id;
      this.newPost.post_from = this.thisplace;
      console.log(this.newPost);
      this.authService.newPost(this.newPost, "newPost").then((result) => {
        this.responsePost = result;
        this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
        if (!JSON.parse(this.data).error) { //Retorno ok
          // this.postsDatails = null;
          this.postsDatails = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.responsePost))))._body;
          this.postsDatails = JSON.parse(this.postsDatails).success;
          this.postsDatails = JSON.parse(JSON.stringify(this.postsDatails)).posts;

          this.addPost = !this.addPost; //Fecha as opções de postagem
          this.imgToPost = '';
          setTimeout(() => {
            loader.dismiss();
            let alertSignup = this.alertCtrl.create({
              title: "Sucesso!",
              message: "Postagem realizada",
              buttons: [{
                text: "Ok"
              }]
            });
            alertSignup.present()
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
        let alertSignup = this.alertCtrl.create({
          title: "Falha de comunicação",
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()

      });

    }

  }

  deletePost(post_id) {
    this.postId.post_id = post_id;
    this.postId.prof_id = this.profileDatails.prof_id;
    const confirm = this.alertCtrl.create({
      title: 'Deletar Post',
      message: 'Você tem certeza que deseja deletar esse post?',
      buttons: [
        {
          text: 'Não',
          handler: () => {

          }
        },
        {
          text: 'Sim',
          handler: () => {

            this.removePost();

          }

        }

      ]
    });
    confirm.present();
  }
  removePost() {
    let loader = this.loadCtrl.create({
      content: 'Excluindo postagem...'
    });
    loader.present();
    this.authService.deletePost(this.postId, "deletePost").then((result) => {
      this.responsePost = result;
      console.log(result);
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok

        setTimeout(() => {
          loader.dismiss();
          this.getAllPostsProfile();
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
          text: 'Tirar Foto',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.takePhoto(from);
          }
        },
        {
          text: 'Escolher na galeria',
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
     // targetHeight: 500,
      // targetWidth: 600,
      targetHeight: 600,
      targetWidth: 800,

      saveToPhotoAlbum: true,
    }

    this.camera.getPicture(options).then(imageData => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      if (from == 'imgProfile') {
        this.uploadImage(this.base64Image);
      } else if (from == 'imgPost') {
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
      // targetHeight: 500,
      // targetWidth: 600,
      targetHeight: 600,
      targetWidth: 800,
      saveToPhotoAlbum: true,
      allowEdit: true
    }

    this.camera.getPicture(options).then(imageData => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      //this.userDatails.prof_img = true;
      if (from == 'imgProfile') {
        this.uploadImage(this.base64Image);
      } else if (from == 'imgPost') {
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

    this.imgData.prof_id = this.profileDatails.prof_id;
    this.imgData.imageB64 = base64Image;

    this.authService.uploadImg(this.imgData, "uploadImg").then((result) => {
      this.responseImg = result;
      this.data = JSON.parse(JSON.stringify(this.responseImg))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        //this.dataImagem = this.base64Image;
        localStorage.setItem('profile', JSON.stringify(this.responseImg));
        this.events.publish('updateProfile', "profile");
        //this.userDatails.prof_img = base64Image;
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
