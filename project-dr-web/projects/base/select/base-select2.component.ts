import {ChangeDetectorRef, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {STData} from '@delon/abc';
import {BaseService, ComboBox, Page, ReturnForm} from '@sb/base/core';
import {ControlValueAccessor} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';

export abstract class BaseSelect2Component<S> implements OnInit, ControlValueAccessor {
    /**
     * 默认为true
     */
    @Input()
    multiple?: boolean = false;
    /**
     * 如果 multiple 为 false ，valueType为string
     * 如果 multiple 为  true ，valueType为string，用逗号分隔（默认）
     *                          valueType为 array，返回数组
     */
    @Input()
    valueType?: 'array' | 'string' = 'string';

    /**
     * 空白文本
     */
    @Input()
    emptyText?: string = '请选择...';

    /**
     * 查询对象
     */
    @Input()
    searchForm?: S = {} as S;

    propertyValues: ComboBox[] = [];

    _selectedValue: string[] = [];

    _initSelectOnInit = true;

    get selectedValue() {
        if (this.multiple) {
            return this._selectedValue;
        } else {
            if (this._selectedValue && this._selectedValue.length === 1) {
                return this._selectedValue[0];
            }
        }
    }

    set selectedValue(value: string[] | string) {
        if (this.multiple) {
            if (typeof value === 'string') {
                this._selectedValue = [value];
            } else {
                this._selectedValue = value || [];
            }
            if (this.changeFn) {
                if (this.valueType === 'string') {
                    this.changeFn(this._selectedValue.join(','));
                } else {
                    this.changeFn(this._selectedValue);
                }
            }
        } else {
            if (typeof value === 'string') {
                this._selectedValue = [value];
            } else {
                this._selectedValue = value || [];
            }
            if (this.changeFn) {
                this.changeFn(this.selectedValue);
            }
        }
    }

    changeFn = undefined;

    @Input()
    disabled = false;

    @Output() initSuccess = new EventEmitter<any>();


    constructor(protected message: NzMessageService,
                protected service: BaseService<STData, Page>,
                @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {

        if (!this.searchForm) {
            this.searchForm = {} as S
        }
        if (!this.emptyText) {
            this.emptyText = '请选择...';
        }
        if (!this.valueType) {
            this.valueType = 'string';
        }

        this.doInit();

        if (this._initSelectOnInit) {
            this.initSelect();
        }

    }

    initSelect() {
        this.service.comboBox(this.searchForm).subscribe(
            (returnForm: ReturnForm<ComboBox[]>) => {
                // 成功的情况
                if (returnForm.success) {
                    this.propertyValues = this.filterValue(returnForm.message);
                    this.cd.markForCheck();
                    this.initSuccess.emit()
                }
            }
        );
    }

    abstract doInit();

    filterValue(propertyValues: ComboBox[]): ComboBox[] {
        return propertyValues;
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value: any): void {
        if (!value) {
            value = [];
        }
        if (this.multiple) {
            if (typeof value === 'string') {
                this._selectedValue = [value];
            } else {
                this._selectedValue = value || [];
            }
        } else {
            if (typeof value === 'string') {
                this._selectedValue = [value];
            } else {
                this._selectedValue = value || [];
            }
        }
    }
}
