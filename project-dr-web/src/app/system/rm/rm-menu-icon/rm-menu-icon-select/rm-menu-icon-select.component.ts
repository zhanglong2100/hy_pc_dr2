import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {RmMenuIcon} from "../entity/rm-menu-icon";
import {RmMenuIconSearchForm} from "../entity/rm-menu-icon-search-form";
import {RmMenuIconService} from "../service/re-menu-icon.service";
import {STData} from "@delon/abc";

@Component({
    selector: 'rm-menu-icon-select',
    templateUrl: './rm-menu-icon-select.component.html',
    styleUrls: ['./rm-menu-icon-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RmMenuIconSelectComponent),
            multi: true
        }
    ]
})
export class RmMenuIconSelectComponent implements OnInit, ControlValueAccessor {

    //样式预览宽
    @Input() width: string = '60px';

    //样式预览高
    @Input() height: string = '40px';

    _showIconPanel = false;

    listData;

    //列表选中数据
    checkData: RmMenuIcon = {};

    //按钮预览数据
    selectedValue: RmMenuIcon = {};

    searchForm: RmMenuIconSearchForm = {};

    _value = '23061baa99764124ad752545ca847b96';

    get value() {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        if (this.changeFn) {
            this.changeFn(value);
        }
    }

    changeFn = undefined;
    disabled = false;

    constructor(
        protected message: NzMessageService,
        protected rmMenuIconService: RmMenuIconService,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
    }

    ngOnInit() {

    }

    search(term: string): void {
        this.rmMenuIconService.getIconByName(term).subscribe(
            (returnForm) => {
                if (returnForm.success) {

                    this.cd.detectChanges();
                }
            }
        );
    }

    clickMe() {
        this._showIconPanel = true;
        this.reloadListData()
    }

    checkItem(event: Event, one: STData) {
        if (!one.disabled) {
            one.checked = !one.checked;
            if (this.checkData && this.checkData != one) {
                this.checkData.checked = false;
            }
            this.checkData = one;
        }
        event.stopPropagation();
    }

    submitDeal() {
        if (this.checkData.checked) {
            this.selectedValue = this.checkData;
            this.value = this.selectedValue.iconId;
        }
        this._showIconPanel = false;
    }

    popupClose() {
        this._showIconPanel = false;
    }

    reloadListData() {
        this.rmMenuIconService.list(this.searchForm).subscribe(
            (returnForm) => {
                if (returnForm.success) {
                    this.listData = returnForm.message;
                    this.cd.detectChanges();
                }
            }
        );
    }

    initSelectedValue(e) {
        this.rmMenuIconService.get(e).subscribe(
            returnForm => {
                if (returnForm.success) {
                    this.selectedValue = returnForm.message;
                    this.cd.detectChanges();
                } else {
                    this.message.error("样式部件加载异常：" + returnForm.errorMessage);
                }
            }
        )
    }


    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(_value: any): void {
        if (!_value) {
            return;
        }
        this.initSelectedValue(_value)
    }
}
