import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RmRoleSelectComponent} from './rm-role-select.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {NzSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        RmRoleSelectComponent
    ],
    imports: [
        CommonModule,
        DelonFormModule.forRoot(),
        NzSelectModule,
        FormsModule
    ],
    exports: [
        RmRoleSelectComponent
    ],
    entryComponents: [
        RmRoleSelectComponent
    ]
})
export class RmRoleSelectModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(RmRoleSelectComponent.KEY, RmRoleSelectComponent);
    }
}
