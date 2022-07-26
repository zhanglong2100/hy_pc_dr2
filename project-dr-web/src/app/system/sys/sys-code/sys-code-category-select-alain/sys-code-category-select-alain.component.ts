import {Component, OnInit} from '@angular/core';
import {ControlUIWidget, SFCustomWidgetSchema} from '@delon/form';


export interface SysCodeCategorySelectAlainSchema extends SFCustomWidgetSchema {

    valueChange: (value: string) => any;
}

@Component({
    selector: 'sys-code-category-select-alain',
    templateUrl: './sys-code-category-select-alain.component.html',
    styleUrls: ['./sys-code-category-select-alain.component.less']
})
export class SysCodeCategorySelectAlainComponent extends ControlUIWidget<SysCodeCategorySelectAlainSchema> implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'sys-code-category-select-alain';

    selectedValue: any;

    ngOnInit(): void {
    }

    reset(_value: any): void {
        this.selectedValue = _value;
    }
}
