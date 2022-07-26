import {NgModule} from '@angular/core';
import {PublicNoticeComponent} from './public-notice/public-notice.component';
import {PublicNoticeRoutingModule} from './public-notice-routing.module';
import {NzButtonModule, NzCardModule, NzInputModule, NzSelectModule, NzDatePickerModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {PublicNoticeDetailModule} from './public-notice-detail/public-notice-detail.module';
import {BaseGridModule} from '@sb/base';

import zh from '@angular/common/locales/zh';
import {CommonModule, registerLocaleData} from '@angular/common';
registerLocaleData(zh);


@NgModule({
    declarations: [
        PublicNoticeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PublicNoticeDetailModule,
        BaseGridModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule,
        NzDatePickerModule,
        PublicNoticeRoutingModule,
        NzCardModule
    ]
})
export class PublicNoticeModule {
}
