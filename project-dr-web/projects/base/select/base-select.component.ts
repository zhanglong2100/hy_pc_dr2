import {ChangeDetectorRef, Inject, Injector, OnInit} from '@angular/core';
import {ControlUIWidget, SFComponent, SFItemComponent} from '@delon/form';
import {STData} from '@delon/abc';
import {BaseService, ComboBox, Page, ReturnForm} from '@sb/base/core';
import {BaseSelectConfig, BaseSelectSchema} from './base-select-schema';
import {Observable} from 'rxjs';

export abstract class BaseSelectComponent<F extends BaseSelectConfig<S>, S> extends ControlUIWidget<BaseSelectSchema<S>> implements OnInit {

    // 组件所需要的参数，建议使用 `ngOnInit` 获取
    config: F;

    propertyValues: ComboBox[] = [];

    _selectedValue: string[] = [];

    _initSelectOnInit = true;

    emptyText = '请选择...';

    get selectedValue() {
        if (this.config.multiple) {
            return this._selectedValue;
        } else {
            if (this._selectedValue && this._selectedValue.length === 1) {
                return this._selectedValue[0];
            }
        }
    }

    set selectedValue(value: string[] | string) {
        if (typeof value === 'string') {
            this.setValue(value);
            this._selectedValue = [value];
        } else {
            this._selectedValue = value || [];
            this.setValue(this._selectedValue.join(','));
        }
    }

    constructor(
        protected service: BaseService<STData, Page>,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef,
        @Inject(Injector) public readonly injector: Injector,
        @Inject(SFItemComponent) public readonly sfItemComp?: SFItemComponent,
        @Inject(SFComponent) public readonly sfComp?: SFComponent
    ) {
        super(cd, injector, sfItemComp, sfComp);
    }

    ngOnInit() {
        this.config = Object.assign({
            multiple: false,
            valueType: 'string',
            notifyProp: [],
            searchForm: {}
        } as F, this.ui.config);

        // 默认提示文本
        this.emptyText = this.config.emptyText || this.emptyText;

        if (this.config.notifyProp && this.config.notifyProp.length > 0) {
            this.sfItemComp.formProperty.valueChanges.subscribe((keyId) => {
                if (!keyId) {
                    return;
                }
                this.getRealData(keyId).subscribe(returnForm => {
                    if (returnForm.success) {
                        for (const notifyProp of this.config.notifyProp) {
                            let p = this.sfItemComp.formProperty.path;
                            p = p.substring(0, p.lastIndexOf('/') + 1);
                            p += notifyProp.notifyProp;
                            const p2 = this.sfComp.getProperty(p);
                            if (!p2) {
                                continue;
                            }
                            const listenValue = returnForm.message[notifyProp.listenProp];
                            if (typeof notifyProp.notifyWidgetMethod === 'function') {
                                notifyProp.notifyWidgetMethod.call(null, listenValue, p2);
                            } else {
                                if (p2.widget && p2.widget[notifyProp.notifyWidgetMethod]) {
                                    p2.widget[notifyProp.notifyWidgetMethod](listenValue);
                                }
                            }
                        }
                    }
                });
            });
        }

        this.reset(this.value);

        this.doInit();

        if (this._initSelectOnInit) {
            this.initSelect();
        }

    }

    initSelect() {
        this.service.comboBox(this.config.searchForm).subscribe(
            (returnForm: ReturnForm<ComboBox[]>) => {
                // 成功的情况
                if (returnForm.success) {
                    this.propertyValues = this.filterValue(returnForm.message);
                    this.cd.markForCheck();
                }
            }
        );
    }

    abstract doInit();

    filterValue(propertyValues: ComboBox[]): ComboBox[] {
        return propertyValues;
    }

    getRealData(keyId: string): Observable<ReturnForm<any>> {
        return this.service.get(keyId);
    }


    reset(_value: any): void {
        if (typeof _value === 'string') {
            this.selectedValue = _value.split(',');
        } else if (_value instanceof Array) {
            this.selectedValue = _value;
        }
    }
}
