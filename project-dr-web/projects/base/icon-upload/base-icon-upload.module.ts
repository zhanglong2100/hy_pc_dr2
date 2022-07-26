import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseIconUploadComponent} from './base-icon-upload.component';
import {DelonFormModule} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {NzButtonModule, NzIconModule, NzUploadModule} from "ng-zorro-antd";


@NgModule({
    declarations: [
        BaseIconUploadComponent,
    ],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        NzUploadModule,
        NzButtonModule,
        NzIconModule

    ],
    exports: [
        BaseIconUploadComponent
    ],
})
export class BaseIconUploadModule {

}
