import {NgModule} from '@angular/core';
import {PublicNoticeWebCrawlerComponent} from './public-notice-web-crawler/public-notice-web-crawler.component';
import {PublicNoticeWebCrawlerRoutingModule} from './public-notice-web-crawler-routing.module';
import {NzButtonModule, NzCardModule, NzInputModule, NzSelectModule, NzDatePickerModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {BaseGridModule} from '@sb/base';

import zh from '@angular/common/locales/zh';
import {CommonModule, registerLocaleData} from '@angular/common';
registerLocaleData(zh);


@NgModule({
    declarations: [
        PublicNoticeWebCrawlerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BaseGridModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule,
        NzDatePickerModule,
        PublicNoticeWebCrawlerRoutingModule,
        NzCardModule
    ]
})
export class PublicNoticeWebCrawlerModule {
}
