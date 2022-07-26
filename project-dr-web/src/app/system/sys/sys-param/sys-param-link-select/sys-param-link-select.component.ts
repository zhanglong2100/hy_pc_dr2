import {Component, forwardRef, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'sys-param-link-select',
    templateUrl: './sys-param-link-select.component.html',
    styleUrls: ['./sys-param-link-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SysParamLinkSelectComponent),
            multi: true
        }
    ]
})
export class SysParamLinkSelectComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
