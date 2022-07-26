import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseTreeComponent} from './base-tree.component';
import {NzIconModule, NzInputModule, NzListModule, NzTreeModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {BaseDetailModule} from '@sb/base/detail';


@NgModule({
    declarations: [BaseTreeComponent],
    exports: [
        BaseTreeComponent
    ],
    imports: [
        CommonModule,
        NzInputModule,
        NzTreeModule,
        NzIconModule,
        FormsModule,
        BaseDetailModule,
        NzListModule
    ]
})
export class BaseTreeModule {
}
