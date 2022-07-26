import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseSortComponent} from './base-sort.component';
import {BasePopupModule} from '../popup/base-popup.module';
import {NzButtonModule} from 'ng-zorro-antd';
import {SortablejsModule} from 'ngx-sortablejs';


@NgModule({
    declarations: [BaseSortComponent],
    imports: [
        CommonModule,
        BasePopupModule,
        NzButtonModule,
        SortablejsModule,
    ],
    exports: [
        BaseSortComponent
    ]
})
export class BaseSortModule {
}
