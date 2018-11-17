import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import{IonicPageModule} from 'ionic-angular';
import { CustomHeaderComponent } from './custom-header/custom-header';
@NgModule({
	declarations: [CustomHeaderComponent],
	imports: [IonicPageModule.forChild(CustomHeaderComponent)],
	exports: [CustomHeaderComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
