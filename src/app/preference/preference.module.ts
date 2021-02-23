import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PreferenceComponent } from './preference.component';
import { PreferenceRoutingModule } from './preference-routing.module';
import { OptionsComponent } from './options/options.component';
import { PreferenceUpdateComponent } from './preference-update/preference-update.component';
import { PreferenceModalComponent } from './preference-modal/preference-modal.component';

@NgModule({
  declarations: [
    PreferenceComponent,
    OptionsComponent,
    PreferenceUpdateComponent,
    PreferenceModalComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    PreferenceRoutingModule
  ],
  providers: [
    PreferenceService,
  ],
  exports: [
    SharedModule,
    CommonModule,
  ],
})
export class PreferenceModule { }
