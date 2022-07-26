import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule, NzTreeSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {RmFunctionTreeSelectComponent} from './rm-function-tree-select.component';


@NgModule({
    declarations: [RmFunctionTreeSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule
    ],
    exports: [RmFunctionTreeSelectComponent],
})
export class RmFunctionTreeSelectModule {
}
