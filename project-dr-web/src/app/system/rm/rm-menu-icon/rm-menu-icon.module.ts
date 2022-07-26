import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RmMenuIconComponent} from "./rm-menu-icon/rm-menu-icon.component";
import {BaseGridModule} from "@sb/base";
import {FormsModule} from "@angular/forms";
import {IconUploadAlainModule} from "@sb/base/icon-upload/icon-upload-alain/icon-upload-alain.module";
import {NzCardModule, NzGridModule, NzIconModule, NzInputModule} from "ng-zorro-antd";
import {RmMenuIconRoutingModule} from "./rm-menu-icon-routing.module";
import {RmMenuIconSelectModule} from "./rm-menu-icon-select/rm-menu-icon-select.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RmMenuIconRoutingModule,
        BaseGridModule,
        IconUploadAlainModule,
        NzGridModule,
        NzCardModule,
        RmMenuIconSelectModule,
        NzInputModule,
        NzIconModule,
    ],
    declarations: [
        RmMenuIconComponent
    ]
})
export class RmMenuIconModule {
}
