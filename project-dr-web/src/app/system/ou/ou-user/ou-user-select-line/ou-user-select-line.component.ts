import {Component} from '@angular/core';
import {BaseSelectAlain2Component} from "@sb/base/select/base-select-alain2.component";
import {OuUserSelectAlainSchema} from "../ou-user-select-alain/ou-user-select-alain.component";

@Component({
    selector: 'ou-user-select-line',
    templateUrl: './ou-user-select-line.component.html',
    styleUrls: ['./ou-user-select-line.component.less']
})
export class OuUserSelectLineComponent extends BaseSelectAlain2Component<OuUserSelectAlainSchema> {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'ou-user-select-line';

}
