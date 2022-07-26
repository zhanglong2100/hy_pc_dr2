import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuOrgUserTreeSelectAlainComponent} from './ou-org-user-tree-select-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {OuOrgUserTreeSelectModule} from '../ou-org-user-tree-select/ou-org-user-tree-select.module';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [OuOrgUserTreeSelectAlainComponent],
    imports: [
        CommonModule,
        DelonFormModule,
        OuOrgUserTreeSelectModule,
        FormsModule
    ],
    exports: [OuOrgUserTreeSelectAlainComponent],
    entryComponents: [OuOrgUserTreeSelectAlainComponent]
})
export class OuOrgUserTreeSelectAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(OuOrgUserTreeSelectAlainComponent.KEY, OuOrgUserTreeSelectAlainComponent);
    }
}
