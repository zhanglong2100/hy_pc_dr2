import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseColorPickerComponent} from './base-color-picker.component';
import {NzInputModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {ColorPickerModule} from 'ngx-color-picker';


@NgModule({
    declarations: [BaseColorPickerComponent],
    exports: [
        BaseColorPickerComponent
    ],
    imports: [
        CommonModule,
        NzInputModule,
        ColorPickerModule,
        FormsModule,
    ]
})
export class BaseColorPickerModule {
}
