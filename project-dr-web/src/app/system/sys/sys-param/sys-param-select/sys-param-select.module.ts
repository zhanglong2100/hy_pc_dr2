import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DelonFormModule, WidgetRegistry} from "@delon/form";
import {SysParamSelectComponent} from "./sys-param-select.component";
import {NzSelectModule} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        SysParamSelectComponent
    ],
    imports: [
        CommonModule,
        DelonFormModule.forRoot(),
        NzSelectModule,
        FormsModule
    ],
    exports: [
        SysParamSelectComponent
    ],
    entryComponents: [
        SysParamSelectComponent
    ]
})
export class SysParamSelectModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(SysParamSelectComponent.KEY, SysParamSelectComponent);
    }
}
