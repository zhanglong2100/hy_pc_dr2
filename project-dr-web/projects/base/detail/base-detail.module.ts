import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseDetailComponent} from './base-detail.component';
import {BasePopupModule} from '../popup/base-popup.module';
import {DelonFormModule} from '@delon/form';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzButtonModule, NzIconModule, NzPopoverModule} from "ng-zorro-antd";


@NgModule({
    declarations: [BaseDetailComponent],
    imports: [
        CommonModule,
        BasePopupModule,
        FormsModule,
        NzButtonModule,
        DelonFormModule.forRoot(),
        ReactiveFormsModule,
        NzIconModule,
        NzPopoverModule
    ],
    exports: [
        BaseDetailComponent
    ]
})
export class BaseDetailModule {
}
