import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule, NzButtonModule, NzGridModule, NzIconModule, NzModalModule} from 'ng-zorro-antd';
import {BaseDetailModule, BaseGridModule, BasePopupModule, BaseTreeModule} from '@sb/base';
import {RmRoleFunctionRoutingModule} from "./rm-role-function-routing.module";
import {RmRoleFunctionComponent} from "./rm-role-function/rm-role-function.component";
import {RmFunctionTreeModule} from "../rm-function/rm-function-tree/rm-function-tree.module";
import {RmRoleFunctionTreeModule} from "./rm-role-function-tree/rm-role-function-tree.module";


@NgModule({

    imports: [
        CommonModule,
        RmRoleFunctionRoutingModule,
        FormsModule,
        BaseGridModule,
        NzGridModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        BaseTreeModule,
        BaseDetailModule,
        BasePopupModule,
        RmRoleFunctionTreeModule,
        RmFunctionTreeModule,
        NgZorroAntdModule,
    ],
    exports: [
        RmRoleFunctionComponent
    ],
    declarations: [
        RmRoleFunctionComponent,
    ]
})
export class RmRoleFunctionModule {
}
