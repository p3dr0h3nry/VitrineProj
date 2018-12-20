import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule,  } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import { CentroFashionPage } from '../pages/centro-fashion/centro-fashion';
import { CustomHeaderComponent } from '../components/custom-header/custom-header';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';
import {Menu} from './menu';
import { CreateProfilePage } from '../pages/create-profile/create-profile';
import { MyApp } from './app.component';
import{ProfilePage} from '../pages/profile/profile';
import{Camera} from'@ionic-native/camera';
import{FileTransfer} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file'
import {HttpClientModule} from '@angular/common/http';
import{ShowPipe} from '../pipes/show/show';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import{AutoHideDirective} from '../directives/auto-hide/auto-hide';
import{HideSearchDirective} from '../directives/hide-search/hide-search';
import{IonicImageViewerModule} from 'ionic-img-viewer';
import { FilterBarComponent } from '../components/filter-bar/filter-bar';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { EmailComposer } from '@ionic-native/email-composer';
import firebase from 'firebase';

firebase.initializeApp({
  // apiKey: "AIzaSyBptbR_uNl448hRbDoEBQWtVERTGRXBk2Q",
  apiKey: "AIzaSyCXJ65SwL_GtN1g8dRs5OPqcY0YMWb8wsc",
  authDomain: "vitrineapp-a7a67.firebaseapp.com",
  databaseURL: "https://vitrineapp-a7a67.firebaseio.com",
  projectId: "vitrineapp-a7a67",
  storageBucket: "vitrineapp-a7a67.appspot.com",
  messagingSenderId: "777132893216"
});

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    //Modulos do sistema
    WelcomePage,
    CentroFashionPage,
    LoginPage,
    CustomHeaderComponent,
    SignupPage,
    Menu,
    CreateProfilePage,
    ProfilePage,
    ShowPipe,
    AutoHideDirective,
    FilterBarComponent,
    HideSearchDirective,
    
    

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrMaskerModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicImageViewerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    
    //Modulos do sistema
    WelcomePage,
    CentroFashionPage,
    LoginPage,
    CustomHeaderComponent,
    SignupPage,
    Menu,
    CreateProfilePage,
    ProfilePage,
    FilterBarComponent,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
    MyApp,
    CreateProfilePage,
    Camera,
    FileTransfer,
    File,
    Facebook,
    GooglePlus,
    EmailComposer,
    
    
  ]
})
export class AppModule { }
