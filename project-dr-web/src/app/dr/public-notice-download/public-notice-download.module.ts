import {NgModule} from '@angular/core';
import {PublicNoticeDownloadComponent} from './public-notice-download/public-notice-download.component';
import {PublicNoticeDownloadRoutingModule} from './public-notice-download-routing.module';
import {
    NzButtonModule,
    NzCardModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzUploadModule
} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
// import {PublicNoticedownloadDetailModule} from './public-notice-detail/public-notice-download-detail.module';
import {BaseGridModule} from '@sb/base';

import zh from '@angular/common/locales/zh';
import {CommonModule, registerLocaleData} from '@angular/common';
registerLocaleData(zh);


@NgModule({
    declarations: [
        PublicNoticeDownloadComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        // PublicNoticeDownloadDetailModule,
        BaseGridModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule,
        NzDatePickerModule,
        PublicNoticeDownloadRoutingModule,
        NzCardModule,
        NzUploadModule
    ]
})
export class PublicNoticeDownloadModule {
}
