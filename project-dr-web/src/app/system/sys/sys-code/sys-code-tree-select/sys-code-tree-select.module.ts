import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SysCodeTreeSelectComponent} from './sys-code-tree-select.component';
import {NzIconModule, NzTreeSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [SysCodeTreeSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule
    ],
    exports: [SysCodeTreeSelectComponent],
})
export class SysCodeTreeSelectModule {
}
