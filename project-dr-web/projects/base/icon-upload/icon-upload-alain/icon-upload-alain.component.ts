import {Component, forwardRef} from '@angular/core';
import {ControlUIWidget, SFCustomWidgetSchema} from "@delon/form";
import {NG_VALUE_ACCESSOR} from "@angular/forms";


export interface IconUploadAlainSchema extends SFCustomWidgetSchema {

}

@Component({
    selector: 'icon-upload-alain',
    templateUrl: './icon-upload-alain.component.html',
    styleUrls: ['./icon-upload-alain.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IconUploadAlainComponent),
            multi: true
        }
    ]
})

export class IconUploadAlainComponent extends ControlUIWidget<IconUploadAlainSchema> {

    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'icon-upload-alain';

    iconBase64Value;

    ngOnInit(): void {

    }

    reset(_value: any): void {
        if (!_value) {
            this.iconBase64Value = 'data:image/png;base64,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';
            return;
        }
        this.iconBase64Value = _value;
    }
}
