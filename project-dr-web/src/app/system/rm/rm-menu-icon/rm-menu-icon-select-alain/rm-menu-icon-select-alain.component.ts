import {Component, OnInit} from '@angular/core';
import {ControlUIWidget, SFCustomWidgetSchema} from '@delon/form';


export interface RmMenuIconSelectAlainSchema extends SFCustomWidgetSchema {

}


@Component({
    selector: 'rm-menu-icon-select-alain',
    templateUrl: './rm-menu-icon-select-alain.component.html',
    styleUrls: ['./rm-menu-icon-select-alain.component.less']
})
export class RmMenuIconSelectAlainComponent extends ControlUIWidget<RmMenuIconSelectAlainSchema> implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'rm-menu-icon-select-alain';

    selectedValue: any;

    ngOnInit(): void {

    }

    reset(_value: any): void {
        if (!_value) {
            this.selectedValue = '23061baa99764124ad752545ca847b96';
            return;
        }
        this.selectedValue = _value;
    }
}
