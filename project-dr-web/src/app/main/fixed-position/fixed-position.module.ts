import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzButtonModule, NzInputModule} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";
import {FixedPositionComponent} from "./fixed-position.component";
import {BaseModule} from "@sb/base";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BaseModule,
        NzButtonModule,
        NzInputModule
    ],
    declarations: [
        FixedPositionComponent
    ],
    exports: [
        FixedPositionComponent
    ]
})
export class FixedPositionModule {
}
