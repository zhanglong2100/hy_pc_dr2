import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RmFunctionTreeSelectAlainComponent} from './rm-function-tree-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {RmFunctionTreeSelectModule} from '../rm-function-tree-select/rm-function-tree-select.module';


@NgModule({
    declarations: [RmFunctionTreeSelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        RmFunctionTreeSelectModule
    ],
    exports: [RmFunctionTreeSelectAlainComponent],
    entryComponents: [RmFunctionTreeSelectAlainComponent]
})
export class RmFunctionTreeSelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(RmFunctionTreeSelectAlainComponent.KEY, RmFunctionTreeSelectAlainComponent);
    }
}
