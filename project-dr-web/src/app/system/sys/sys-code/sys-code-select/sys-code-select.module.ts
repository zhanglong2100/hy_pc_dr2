import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SysCodeSelectComponent} from './sys-code-select.component';
import {NzIconModule, NzSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [SysCodeSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzSelectModule,
        NzIconModule
    ],
    exports: [SysCodeSelectComponent],
})
export class SysCodeSelectModule {
}
