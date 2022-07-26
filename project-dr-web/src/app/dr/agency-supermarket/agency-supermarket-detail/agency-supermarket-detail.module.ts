import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DelonFormModule} from '@delon/form';
import {AgencySupermarketService} from '../agency-supermarket.service';
import {FormsModule} from '@angular/forms';
import {AgencySupermarketDetailComponent} from './agency-supermarket-detail.component';
import {BasePopupModule} from '@sb/base';
import {SysCodeSelectAlainModule} from '../../../system/sys/sys-code/sys-code-select-alain/sys-code-select-alain.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BasePopupModule,
        SysCodeSelectAlainModule,
        DelonFormModule.forRoot()
    ],
    declarations: [
        AgencySupermarketDetailComponent
    ],
    providers: [
        AgencySupermarketService,
    ],
    entryComponents: [
        AgencySupermarketDetailComponent
    ],
    exports: [
        AgencySupermarketDetailComponent
    ]
})
export class AgencySupermarketDetailModule {
}
