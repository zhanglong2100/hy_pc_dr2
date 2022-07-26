import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DelonFormModule} from '@delon/form';
import {PublicNoticeService} from '../public-notice.service';
import {FormsModule} from '@angular/forms';
import {PublicNoticeDetailComponent} from './public-notice-detail.component';
import {BasePopupModule} from '@sb/base';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BasePopupModule,
        // ProtocolPropertySelectModule,
        DelonFormModule.forRoot()
    ],
    declarations: [
        PublicNoticeDetailComponent
    ],
    providers: [
        PublicNoticeService,
    ],
    entryComponents: [
        PublicNoticeDetailComponent
    ],
    exports: [
        PublicNoticeDetailComponent
    ]
})
export class PublicNoticeDetailModule {
}
