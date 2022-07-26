import {NgModule} from '@angular/core';
import {AgencySupermarketComponent} from './agency-supermarket/agency-supermarket.component';
import {AgencySupermarketRoutingModule} from './agency-supermarket-routing.module';
import {NzButtonModule, NzCardModule, NzInputModule, NzSelectModule, NzDatePickerModule, NzUploadModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {AgencySupermarketDetailModule} from './agency-supermarket-detail/agency-supermarket-detail.module';
import {BaseGridModule} from '@sb/base';

import zh from '@angular/common/locales/zh';
import {CommonModule, registerLocaleData} from '@angular/common';
registerLocaleData(zh);


@NgModule({
    declarations: [
        AgencySupermarketComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AgencySupermarketDetailModule,
        BaseGridModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule,
        NzDatePickerModule,
        AgencySupermarketRoutingModule,
        NzCardModule,
        NzUploadModule
    ]
})
export class AgencySupermarketModule {
}
