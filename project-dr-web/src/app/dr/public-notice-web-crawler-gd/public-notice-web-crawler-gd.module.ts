import {NgModule} from '@angular/core';
import {PublicNoticeWebCrawlerGdComponent} from './public-notice-web-crawler-gd/public-notice-web-crawler-gd.component';
import {PublicNoticeWebCrawlerGdRoutingModule} from './public-notice-web-crawler-gd-routing.module';
import {NzButtonModule, NzCardModule, NzInputModule, NzSelectModule, NzDatePickerModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {BaseGridModule} from '@sb/base';

import zh from '@angular/common/locales/zh';
import {CommonModule, registerLocaleData} from '@angular/common';
registerLocaleData(zh);


@NgModule({
    declarations: [
        PublicNoticeWebCrawlerGdComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BaseGridModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule,
        NzDatePickerModule,
        PublicNoticeWebCrawlerGdRoutingModule,
        NzCardModule
    ]
})
export class PublicNoticeWebCrawlerGdModule {
}
