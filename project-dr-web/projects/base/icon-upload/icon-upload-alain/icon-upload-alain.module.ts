import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconUploadAlainComponent} from './icon-upload-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';

import {FormsModule} from "@angular/forms";
import {BaseIconUploadModule} from "@sb/base/icon-upload";


@NgModule({
    declarations: [
        IconUploadAlainComponent
    ],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        BaseIconUploadModule
    ],
    exports: [
        IconUploadAlainComponent
    ],
    entryComponents: [
        IconUploadAlainComponent
    ]
})
export class IconUploadAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(IconUploadAlainComponent.KEY, IconUploadAlainComponent);
    }
}
