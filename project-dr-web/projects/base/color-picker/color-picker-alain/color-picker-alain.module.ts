import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColorPickerAlainComponent} from './color-picker-alain.component';
import {DelonFormModule, WidgetRegistry} from '@delon/form';
import {FormsModule} from '@angular/forms';
import {BaseColorPickerModule} from "@sb/base/color-picker";


@NgModule({
    declarations: [
        ColorPickerAlainComponent
    ],
    imports: [
        CommonModule,
        DelonFormModule,
        FormsModule,
        BaseColorPickerModule
    ],
    exports: [
        ColorPickerAlainComponent
    ],
    entryComponents: [
        ColorPickerAlainComponent
    ]
})
export class ColorPickerAlainModule {
    constructor(widgetRegistry: WidgetRegistry) {
        widgetRegistry.register(ColorPickerAlainComponent.KEY, ColorPickerAlainComponent);
    }
}
