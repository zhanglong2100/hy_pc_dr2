import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NzButtonModule, NzCardModule, NzGridModule, NzIconModule, NzModalModule} from 'ng-zorro-antd';
import {BaseGridModule, BaseTreeModule} from '@sb/base';
import {RmFunctionRoutingModule} from './rm-function-routing.module';
import {RmFunctionComponent} from './rm-function/rm-function.component';


@NgModule({
    imports: [
        CommonModule,
        RmFunctionRoutingModule,
        FormsModule,
        BaseGridModule,
        NzGridModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        BaseTreeModule,
        NzCardModule
    ],
    declarations: [
        RmFunctionComponent
    ]
})
export class RmFunctionModule {
}
