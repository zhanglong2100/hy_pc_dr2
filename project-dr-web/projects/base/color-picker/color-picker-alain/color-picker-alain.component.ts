import {Component, OnInit,} from '@angular/core';
import {ControlUIWidget, SFCustomWidgetSchema} from "@delon/form";


export interface ColorPickerAlainSchema extends SFCustomWidgetSchema {

    pickerWidth?: string;

    pickerHeight?: string;
}

@Component({
    selector: 'color-picker-alain',
    templateUrl: './color-picker-alain.component.html',
    styleUrls: ['./color-picker-alain.component.less'],
})

export class ColorPickerAlainComponent extends ControlUIWidget<ColorPickerAlainSchema> implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'color-picker-alain';

    selectedValue: any;

    width: string = '100px';

    height: string = '30px';

    ngOnInit(): void {
        if (this.ui.pickerWidth != undefined) {
            this.width = this.ui.pickerWidth;
        }
        if (this.ui.pickerHeight != undefined) {
            this.height = this.ui.pickerHeight;
        }
    }

    reset(_value: any): void {
        this.selectedValue = _value;
    }

}
