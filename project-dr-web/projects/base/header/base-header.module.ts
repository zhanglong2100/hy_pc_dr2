import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseHeaderComponent} from './base-header.component';
import {NzGridModule} from 'ng-zorro-antd';


@NgModule({
    declarations: [
        BaseHeaderComponent
    ],
    imports: [
        CommonModule,
        NzGridModule
    ],
    exports: [
        BaseHeaderComponent
    ]
})
export class BaseHeaderModule {
}
