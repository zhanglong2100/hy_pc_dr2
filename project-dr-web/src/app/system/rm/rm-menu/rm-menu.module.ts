import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NzButtonModule, NzCardModule, NzGridModule, NzIconModule, NzModalModule} from 'ng-zorro-antd';
import {BaseGridModule, BaseTreeModule} from '@sb/base';
import {RmMenuComponent} from './rm-menu/rm-menu.component';
import {RmMenuRoutingModule} from './rm-menu-routing.module';
import {RmFunctionTreeSelectAlainModule} from '../rm-function/rm-function-tree-select-alain/rm-function-tree-select-alain.module';
import {RmMenuIconSelectAlainModule} from "../rm-menu-icon/rm-menu-icon-select-alain/rm-menu-icon-select-alain.module";

@NgModule({
    imports: [
        CommonModule,
        RmMenuRoutingModule,
        FormsModule,
        BaseGridModule,
        NzGridModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        BaseTreeModule,
        RmFunctionTreeSelectAlainModule,
        NzCardModule,
        RmMenuIconSelectAlainModule
    ],
    declarations: [
        RmMenuComponent
    ]
})
export class RmMenuModule {
}
