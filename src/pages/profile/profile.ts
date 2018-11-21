import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import {CameraOptions, Camera} from '@ionic-native/camera';
import{FileTransfer, FileUploadOptions} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {DomSanitizer} from '@angular/platform-browser';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
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
  base64Image:string;
  public userDatails:any;
  responseImg:any;
  response_getimg:any;
  imgData={prof_id:"",imageB64:""};
  getData={prof_id:""};
  dataImagem;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public platform:Platform, 
    private camera:Camera,
    private transfer:FileTransfer, 
    private file: File,
    private alertCtrl:AlertController,
    private domSanitizer:DomSanitizer,
    private loadCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private http:HttpClient
  ) {
    
    if(localStorage.getItem('user')){
      // this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      // this.userDatails = JSON.parse(this.userDatails).user;
      // console.log(this.userDatails);
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      // console.log(this.userDatails);
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      if(this.userDatails.prof_img){
        
        this.dataImagem = this.domSanitizer.bypassSecurityTrustUrl("data:Image/jpeg;base64,"+this.userDatails.prof_img);
        console.log(this.dataImagem);
      }
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  

  takePhoto(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 600,
      targetWidth: 600
    }
    
    this.camera.getPicture(options).then(imageData => {
     this.base64Image = "data:image/jpeg;base64," + imageData;
     
     this.userDatails.prof_img=true; 
     this.uploadImage(this.base64Image);

    }, (err) => {
     // Handle error
    });
  }

  uploadImage(base64Image){
    // let loader = this.loadCtrl.create({
    //   content: 'Salvando imagem...'
    // });
    // loader.present();
    this.imgData.prof_id = this.userDatails.prof_id;
    this.imgData.imageB64=base64Image;

    this.authService.uploadImg(this.imgData,"uploadImg").then((result)=>{
      this.responseImg= result;
      this.userDatails.prof_img=this.base64Image;
      alert("Imagem Salva!");
      
    },(err)=>{
      console.log(err);
      // loader.dismiss();
      alert('Falha');
      
    });


  }

}
