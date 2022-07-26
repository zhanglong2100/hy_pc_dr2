import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuPositionSelectAlainComponent} from './ou-position-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {OuPositionSelectModule} from '../ou-user-select/ou-position-select.module';


@NgModule({
    declarations: [OuPositionSelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        OuPositionSelectModule
    ],
    exports: [OuPositionSelectAlainComponent],
    entryComponents: [OuPositionSelectAlainComponent]
})
export class OuPositionSelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(OuPositionSelectAlainComponent.KEY, OuPositionSelectAlainComponent);
    }
}
