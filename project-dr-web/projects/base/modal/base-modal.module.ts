import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseModalComponent} from './base-modal.component';
import {NzButtonModule, NzModalModule} from 'ng-zorro-antd';
import {ImageModule} from "@delon/abc";


@NgModule({
    declarations: [BaseModalComponent],
    imports: [
        CommonModule,
        NzModalModule,
        NzButtonModule,
        ImageModule
    ],
    exports: [
        BaseModalComponent
    ]
})
export class BaseModalModule {
}
