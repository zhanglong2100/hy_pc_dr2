import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseLoadingComponent} from './base-loading.component';
import {NzSpinModule} from 'ng-zorro-antd';


@NgModule({
    declarations: [BaseLoadingComponent],
    imports: [
        CommonModule,
        NzSpinModule
    ],
    exports: [
        BaseLoadingComponent
    ]
})
export class BaseLoadingModule {
}
