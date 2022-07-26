import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SysNoticeRoutingModule} from './sys-notice-routing.module';
import {SysNoticeComponent} from "./sys-notice/sys-notice.component";
import {NzCardModule, NzCheckboxModule, NzSelectModule, NzSwitchModule} from "ng-zorro-antd";


@NgModule({
    imports: [
        CommonModule,
        NzCardModule,
        SysNoticeRoutingModule,
        FormsModule,
        NzSwitchModule,
        NzCheckboxModule,
        NzSelectModule
    ],
    declarations: [
        SysNoticeComponent,
    ]
})
export class SysNoticeModule {
}
