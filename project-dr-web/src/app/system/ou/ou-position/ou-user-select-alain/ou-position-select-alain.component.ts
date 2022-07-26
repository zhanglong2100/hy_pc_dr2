import {Component} from '@angular/core';
import {BaseSelectAlain2Schema} from '@sb/base/select/base-select-alain2-schema';
import {BaseSelectAlain2Component} from '@sb/base/select/base-select-alain2.component';
import {OuPositionSearchForm} from '../entity/ou-position-search-form';


export interface OuPositionSelectAlainSchema extends BaseSelectAlain2Schema<OuPositionSearchForm> {
    valueChange?: (value: string) => any;
}


@Component({
    selector: 'ou-position-select-alain',
    templateUrl: './ou-position-select-alain.component.html',
    styleUrls: ['./ou-position-select-alain.component.less']
})
export class OuPositionSelectAlainComponent extends BaseSelectAlain2Component<OuPositionSelectAlainSchema> {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'ou-position-select-alain';
}
