import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseHeaderModule} from '@sb/base/header';
import {BaseModalModule} from '@sb/base/modal';
import {BaseLoadingModule} from '@sb/base/loading';
import {BasePopupModule} from '@sb/base/popup';
import {BaseSortModule} from '@sb/base/sort';
import {BaseGridModule} from '@sb/base/grid';
import {BaseDetailModule} from '@sb/base/detail';
import {BaseConfigModule} from '@sb/base/config';
import {BaseTreeModule} from '@sb/base/tree';

@NgModule({
    imports: [
        CommonModule,
        BaseConfigModule,
        BaseDetailModule,
        BaseGridModule,
        BaseHeaderModule,
        BaseLoadingModule,
        BaseModalModule,
        BasePopupModule,
        BaseSortModule,
        BaseTreeModule,
    ],
    declarations: [],
    exports: [
        BaseGridModule,
        BaseDetailModule,
        BaseHeaderModule,
        BaseLoadingModule,
        BaseModalModule,
        BasePopupModule,
        BaseSortModule,
        BaseTreeModule,
    ]
})
export class BaseModule {
}
