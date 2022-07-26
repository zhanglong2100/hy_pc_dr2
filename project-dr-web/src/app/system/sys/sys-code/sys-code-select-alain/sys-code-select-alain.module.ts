import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SysCodeSelectAlainComponent} from './sys-code-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {SysCodeSelectModule} from '../sys-code-select/sys-code-select.module';


@NgModule({
    declarations: [SysCodeSelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        SysCodeSelectModule
    ],
    exports: [SysCodeSelectAlainComponent],
    entryComponents: [SysCodeSelectAlainComponent]
})
export class SysCodeSelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(SysCodeSelectAlainComponent.KEY, SysCodeSelectAlainComponent);
    }
}
