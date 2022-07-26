import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule, NzTreeSelectModule} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";
import {RmRoleFunctionTreeComponent} from "./rm-role-function-tree.component";
import {BaseTreeModule} from "@sb/base";


@NgModule({
    declarations: [
        RmRoleFunctionTreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule,
        BaseTreeModule
    ],
    exports: [RmRoleFunctionTreeComponent],
})
export class RmRoleFunctionTreeModule {
}
