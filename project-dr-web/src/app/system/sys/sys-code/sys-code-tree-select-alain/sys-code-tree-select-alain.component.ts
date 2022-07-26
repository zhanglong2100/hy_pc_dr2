import {Component, OnInit} from '@angular/core';
import {ControlUIWidget, SFCustomWidgetSchema} from '@delon/form';


export interface SysCodeTreeSelectAlainSchema extends SFCustomWidgetSchema {
    /**
     * 字典编码
     */
    category?: string;

    valueChange?: (value: string) => any;
}


@Component({
    selector: 'sys-code-tree-select-alain',
    templateUrl: './sys-code-tree-select-alain.component.html',
    styleUrls: ['./sys-code-tree-select-alain.component.less']
})
export class SysCodeTreeSelectAlainComponent extends ControlUIWidget<SysCodeTreeSelectAlainSchema> implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'sys-code-tree-select-alain';

    selectedValue: any;

    ngOnInit(): void {
    }

    reset(_value: any): void {
        this.selectedValue = _value;
    }
}
