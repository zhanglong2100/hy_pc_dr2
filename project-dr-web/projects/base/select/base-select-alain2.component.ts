import {ChangeDetectorRef, Inject, Injector, OnInit} from '@angular/core';
import {ControlUIWidget, SFComponent, SFItemComponent} from '@delon/form';
import {STData} from '@delon/abc';
import {BaseService, Page, ReturnForm} from '@sb/base/core';
import {Observable} from 'rxjs';
import {BaseSelectAlain2Schema} from '@sb/base/select/base-select-alain2-schema';

export abstract class BaseSelectAlain2Component<S> extends ControlUIWidget<BaseSelectAlain2Schema<S>> implements OnInit {

    _selectedValue: any;

    get selectedValue() {
        return this._selectedValue;
    }

    set selectedValue(value: any) {
        this._selectedValue = value;
        // this.setValue(value);
    }

    constructor(
        protected baseService: BaseService<STData, Page>,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef,
        @Inject(Injector) public readonly injector: Injector,
        @Inject(SFItemComponent) public readonly sfItemComp?: SFItemComponent,
        @Inject(SFComponent) public readonly sfComp?: SFComponent
    ) {
        super(cd, injector, sfItemComp, sfComp);
    }

    ngOnInit(): void {
        if (this.ui && this.ui.notifyProp && this.ui.notifyProp.length > 0) {
            this.sfItemComp.formProperty.valueChanges.subscribe((keyId) => {
                if (!keyId) {
                    return;
                }
                this.getRealData(keyId).subscribe(returnForm => {
                    if (returnForm.success) {
                        for (const notifyProp of this.ui.notifyProp) {
                            let p = this.sfItemComp.formProperty.path;
                            p = p.substring(0, p.lastIndexOf('/') + 1);
                            p += notifyProp.notifyProp;
                            const p2 = this.sfComp.getProperty(p);
                            if (!p2) {
                                continue;
                            }
                            let listenValue;
                            if (notifyProp.listenProp) {
                                listenValue = returnForm.message[notifyProp.listenProp];
                            } else {
                                listenValue = returnForm.message;
                            }
                            if (typeof notifyProp.notifyWidgetMethod === 'function') {
                                notifyProp.notifyWidgetMethod.call(null, listenValue, p2, this.sfComp);
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
    }

    getRealData(keyId: string): Observable<ReturnForm<any>> {
        return this.baseService.get(keyId);
    }

    reset(_value: any): void {
        this.selectedValue = _value;
    }
}
