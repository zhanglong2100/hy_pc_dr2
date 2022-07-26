import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseGridComponent} from './base-grid.component';
import {
    NzAddOnModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzSelectModule
} from 'ng-zorro-antd';
import {STModule} from '@delon/abc';
import {BasePopupModule} from '../popup/base-popup.module';
import {BaseSortModule} from '../sort/base-sort.module';
import {BaseDetailModule} from '../detail/base-detail.module';
import {DelonLocaleModule} from '@delon/theme';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [BaseGridComponent],
    exports: [
        BaseGridComponent
    ],
    imports: [
        CommonModule,
        NzButtonModule,
        NzPopconfirmModule,
        NzMessageModule,
        STModule,
        NzIconModule,
        DelonLocaleModule,
        NzAddOnModule,
        BasePopupModule,
        BaseSortModule,
        BaseDetailModule,
        FormsModule,
        NzCardModule,
        NzInputModule,
        NzCheckboxModule,
        NzDropDownModule,
        NzSelectModule
    ]
})
export class BaseGridModule {
}
