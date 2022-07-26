import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SysCodeCategorySelectAlainComponent} from './sys-code-category-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {SysCodeCategorySelectModule} from '../sys-code-category-select/sys-code-category-select.module';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [SysCodeCategorySelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        SysCodeCategorySelectModule,
        FormsModule
    ],
    exports: [SysCodeCategorySelectAlainComponent],
    entryComponents: [SysCodeCategorySelectAlainComponent]
})
export class SysCodeCategorySelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(SysCodeCategorySelectAlainComponent.KEY, SysCodeCategorySelectAlainComponent);
    }
}
