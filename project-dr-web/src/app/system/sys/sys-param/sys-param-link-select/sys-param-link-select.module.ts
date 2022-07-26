import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SysParamLinkSelectComponent} from './sys-param-link-select.component';


@NgModule({
    declarations: [SysParamLinkSelectComponent],
    imports: [
        CommonModule
    ],
    exports: [
        SysParamLinkSelectComponent
    ]
})
export class SysParamLinkSelectModule {
}
