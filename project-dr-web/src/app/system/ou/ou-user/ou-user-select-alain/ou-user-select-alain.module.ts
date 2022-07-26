import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuUserSelectAlainComponent} from './ou-user-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {OuUserSelectModule} from '../ou-user-select/ou-user-select.module';


@NgModule({
    declarations: [OuUserSelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        OuUserSelectModule
    ],
    exports: [OuUserSelectAlainComponent],
    entryComponents: [OuUserSelectAlainComponent]
})
export class OuUserSelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(OuUserSelectAlainComponent.KEY, OuUserSelectAlainComponent);
    }
}
