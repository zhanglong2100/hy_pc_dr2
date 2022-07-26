import {Component} from '@angular/core';
import {BaseSelectAlain2Schema} from '@sb/base/select/base-select-alain2-schema';
import {BaseSelectAlain2Component} from '@sb/base/select/base-select-alain2.component';
import {OuUserSearchForm} from '../entity/ou-user-search-form';


export interface OuUserSelectAlainSchema extends BaseSelectAlain2Schema<OuUserSearchForm> {
    valueChange?: (value: string) => any;
}


@Component({
    selector: 'ou-user-select-alain',
    templateUrl: './ou-user-select-alain.component.html',
    styleUrls: ['./ou-user-select-alain.component.less']
})
export class OuUserSelectAlainComponent extends BaseSelectAlain2Component<OuUserSelectAlainSchema> {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'ou-user-select-alain';
}
