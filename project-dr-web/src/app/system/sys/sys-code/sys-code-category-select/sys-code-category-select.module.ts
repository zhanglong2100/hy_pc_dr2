import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SysCodeCategorySelectComponent} from './sys-code-category-select.component';
import {NzIconModule, NzTreeSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [SysCodeCategorySelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule
    ],
    exports: [SysCodeCategorySelectComponent],
})
export class SysCodeCategorySelectModule {
}
