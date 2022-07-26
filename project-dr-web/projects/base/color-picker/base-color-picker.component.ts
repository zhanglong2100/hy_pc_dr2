import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";


@Component({
    selector: 'base-colorPicker',
    templateUrl: './base-color-picker.component.html',
    styleUrls: ['./base-color-picker.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BaseColorPickerComponent),
            multi: true
        }
    ]
})
export class BaseColorPickerComponent implements OnInit, ControlValueAccessor {

    //颜色选择器宽
    @Input() width: string = '100px';

    //颜色选择器高
    @Input() height: string = '30px';

    changeFn = undefined;
    disabled = false;

    textColor;

    _value;

    get value() {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this.textColor = this.colorReverse(value);
        if (this.changeFn) {
            this.changeFn(value);
        }
    }

    ngOnInit(): void {

    }

    // 颜色取反方法
    colorReverse(OldColorValue) {
        OldColorValue = "0x" + OldColorValue.replace(/#/g, "");
        const str = "000000" + (0xFFFFFF - OldColorValue).toString(16);
        return ("#" + str.substring(str.length - 6, str.length))
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(_value: any): void {
        if (!_value) {
            return;
        }
        this.value = _value;
    }
}
