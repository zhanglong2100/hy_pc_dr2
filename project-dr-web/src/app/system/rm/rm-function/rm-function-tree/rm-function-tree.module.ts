import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule, NzTreeSelectModule} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";
import {RmFunctionTreeComponent} from "./rm-function-tree.component";
import {BaseTreeModule} from "@sb/base";


@NgModule({
    declarations: [
        RmFunctionTreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule,
        BaseTreeModule
    ],
    exports: [RmFunctionTreeComponent],
})
export class RmFunctionTreeModule {
}
