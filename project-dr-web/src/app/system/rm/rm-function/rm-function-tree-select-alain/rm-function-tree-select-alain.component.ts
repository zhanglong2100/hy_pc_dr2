import {Component, OnInit} from '@angular/core';
import {ControlUIWidget, SFCustomWidgetSchema} from '@delon/form';


export interface RmFunctionTreeSelectAlainSchema extends SFCustomWidgetSchema {

    parentId?: string;

    maxLevel?: string;
}


@Component({
    selector: 'rm-function-tree-select-alain',
    templateUrl: './rm-function-tree-select-alain.component.html',
    styleUrls: ['./rm-function-tree-select-alain.component.less']
})
export class RmFunctionTreeSelectAlainComponent extends ControlUIWidget<RmFunctionTreeSelectAlainSchema> implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'rm-function-tree-select-alain';

    selectedValue: any;

    ngOnInit(): void {
    }

    reset(_value: any): void {
        this.selectedValue = _value;
    }
}
