import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SysCodeTreeSelectAlainComponent} from './sys-code-tree-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {SysCodeTreeSelectModule} from '../sys-code-tree-select/sys-code-tree-select.module';


@NgModule({
    declarations: [SysCodeTreeSelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        SysCodeTreeSelectModule
    ],
    exports: [SysCodeTreeSelectAlainComponent],
    entryComponents: [SysCodeTreeSelectAlainComponent]
})
export class SysCodeTreeSelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(SysCodeTreeSelectAlainComponent.KEY, SysCodeTreeSelectAlainComponent);
    }
}
