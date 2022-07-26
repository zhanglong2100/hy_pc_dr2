import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RmMenuIconSelectAlainComponent} from './rm-menu-icon-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {NzSelectModule} from "ng-zorro-antd";
import {RmMenuIconSelectModule} from "../rm-menu-icon-select/rm-menu-icon-select.module";


@NgModule({
    declarations: [RmMenuIconSelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        NzSelectModule,
        RmMenuIconSelectModule,
    ],
    exports: [RmMenuIconSelectAlainComponent],
    entryComponents: [RmMenuIconSelectAlainComponent]
})
export class RmMenuIconSelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(RmMenuIconSelectAlainComponent.KEY, RmMenuIconSelectAlainComponent);
    }
}
