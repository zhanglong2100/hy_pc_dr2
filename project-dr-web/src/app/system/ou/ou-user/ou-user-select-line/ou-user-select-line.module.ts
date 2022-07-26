import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuUserSelectLineComponent} from './ou-user-select-line.component';
import {DelonFormModule, WidgetRegistry} from "@delon/form";
import {OuUserSelectLine2Module} from "../ou-user-select-line2/ou-user-select-line2.module";
import {OuUserSelectModule} from "../ou-user-select/ou-user-select.module";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [OuUserSelectLineComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        OuUserSelectLine2Module,
        OuUserSelectModule,
        FormsModule
    ],
    exports: [OuUserSelectLineComponent],
    entryComponents: [OuUserSelectLineComponent]
})
export class OuUserSelectLineModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(OuUserSelectLineComponent.KEY, OuUserSelectLineComponent);
    }
}
