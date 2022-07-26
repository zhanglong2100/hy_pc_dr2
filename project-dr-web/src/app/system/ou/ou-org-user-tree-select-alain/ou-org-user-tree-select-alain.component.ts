import {Component, OnInit} from '@angular/core';
import {ControlUIWidget, SFCustomWidgetSchema} from '@delon/form';
import {OuOrgSearchConfig} from '../ou-org/entity/ou-org-search-config';


export interface OuOrgUserTreeSelectAlainSchema extends SFCustomWidgetSchema {

    // 根节点
    rootOrgId?: string;

    searchConfig?: OuOrgSearchConfig;

    valueChange?: (value: string) => any;
}

@Component({
    selector: 'ou-org-user-tree-select-alain',
    templateUrl: './ou-org-user-tree-select-alain.component.html',
    styleUrls: ['./ou-org-user-tree-select-alain.component.less']
})
export class OuOrgUserTreeSelectAlainComponent extends ControlUIWidget<OuOrgUserTreeSelectAlainSchema> implements OnInit {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'ou-org-user-tree-select-alain';

    selectedValue: any;

    ngOnInit(): void {
    }

    reset(_value: any): void {
        this.selectedValue = _value;
    }
}
