import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {SysCodeService} from '../service/sys-code.service';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseSelect2Component} from '@sb/base/select/base-select2.component';
import {SysCodeSearchForm} from '../entity/sys-code-search-form';


@Component({
    selector: 'sys-code-select',
    templateUrl: './sys-code-select.component.html',
    styleUrls: ['./sys-code-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SysCodeSelectComponent),
            multi: true
        }
    ]
})
export class SysCodeSelectComponent extends BaseSelect2Component<SysCodeSearchForm> implements OnInit {

    @Input()
    category: string;

    @Input()
    parentCode: string;

    @Input()
    valueChange: (value: string | string[] | object) => any;

    constructor(
        protected message: NzMessageService,
        protected sysCodeService: SysCodeService,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
        super(message, sysCodeService, cd);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    doInit() {
        this.searchForm.moduleCode = this.category;
        this.searchForm.parentCode = this.parentCode;
    }

    updateCategory(_category) {
        this.category = _category;
        this.doInit();
        this.initSelect();
    }

    updateParentCode(_parentCode) {
        this.parentCode = _parentCode;
        this.doInit();
        this.initSelect();
    }

}
