import {ChangeDetectorRef, Component, forwardRef, Inject, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseSelect2Component} from '@sb/base/select/base-select2.component';
import {OuPositionSearchForm} from '../entity/ou-position-search-form';
import {OuPositionService} from '../service/ou-position.service';


@Component({
    selector: 'ou-position-select',
    templateUrl: './ou-position-select.component.html',
    styleUrls: ['./ou-position-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OuPositionSelectComponent),
            multi: true
        }
    ]
})
export class OuPositionSelectComponent extends BaseSelect2Component<OuPositionSearchForm> implements OnInit {

    constructor(
        protected message: NzMessageService,
        protected ouPositionService: OuPositionService,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
        super(message, ouPositionService, cd);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    doInit() {
    }

}
