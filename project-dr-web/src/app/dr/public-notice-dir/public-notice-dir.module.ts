import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzModalModule,
    NzInputModule,
    NzDatePickerModule,
    NzUploadModule
} from 'ng-zorro-antd';
import {BaseGridModule, BaseTreeModule} from '@sb/base';
import {PublicNoticeDirComponent} from './public-notice-dir/public-notice-dir.component';
import {PublicNoticeDirRoutingModule} from './public-notice-dir-routing.module';
// import {RmFunctionTreeSelectAlainModule} from '../rm-function/rm-function-tree-select-alain/rm-function-tree-select-alain.module';
// import {RmMenuIconSelectAlainModule} from "../rm-menu-icon/rm-menu-icon-select-alain/rm-menu-icon-select-alain.module";

@NgModule({
    imports: [
        CommonModule,
        PublicNoticeDirRoutingModule,
        FormsModule,
        BaseGridModule,
        NzGridModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        BaseTreeModule,
        // RmFunctionTreeSelectAlainModule,
        NzCardModule,
        // RmMenuIconSelectAlainModule
        NzInputModule,
        NzDatePickerModule,
        NzUploadModule
    ],
    declarations: [
        PublicNoticeDirComponent
    ]
})
export class PublicNoticeDirModule {
}
