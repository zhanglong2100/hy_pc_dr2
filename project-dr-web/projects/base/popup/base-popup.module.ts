import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasePopupComponent} from './base-popup.component';
import {NzGridModule, NzIconModule} from 'ng-zorro-antd';


@NgModule({
    declarations: [
        BasePopupComponent
    ],
    imports: [
        CommonModule,
        NzGridModule,
        NzIconModule
    ],
    exports: [
        BasePopupComponent
    ],
    entryComponents: [
        BasePopupComponent
    ]
})
export class BasePopupModule {
}
