import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuUserSelectLine2Component} from './ou-user-select-line2.component';
import {NzDividerModule} from "ng-zorro-antd";


@NgModule({
    declarations: [OuUserSelectLine2Component],
    imports: [
        CommonModule,
        NzDividerModule,
    ],
    exports: [OuUserSelectLine2Component]
})
export class OuUserSelectLine2Module {
}
