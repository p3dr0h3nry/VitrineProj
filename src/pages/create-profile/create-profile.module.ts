import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateProfilePage } from './create-profile';
import { CentroFashionPage } from '../centro-fashion/centro-fashion';

@NgModule({
  declarations: [
    CreateProfilePage,
    CentroFashionPage
  ],
  imports: [
    IonicPageModule.forChild(CreateProfilePage),
  ],
})
export class CreateProfilePageModule {}
