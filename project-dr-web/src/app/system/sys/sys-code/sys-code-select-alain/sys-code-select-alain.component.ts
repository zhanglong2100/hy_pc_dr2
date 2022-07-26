import {ChangeDetectorRef, Component, Inject, Injector, ViewChild} from '@angular/core';
import {BaseSelectAlain2Schema} from '@sb/base/select/base-select-alain2-schema';
import {SysCodeSearchForm} from '../entity/sys-code-search-form';
import {BaseSelectAlain2Component} from '@sb/base/select/base-select-alain2.component';
import {BaseService} from "@sb/base";
import {SysCodeService} from "../service/sys-code.service";
import {ReturnForm} from "@sb/base/core";
import {Observable} from "rxjs/index";
import {SFComponent, SFItemComponent} from "@delon/form";
import {SysCodeSelectComponent} from "../sys-code-select/sys-code-select.component";


export interface SysCodeSelectAlainSchema extends BaseSelectAlain2Schema<SysCodeSearchForm> {
    /**
     * 字典编码
     */
    category?: string;

    parentCode?: string;

    valueChange?: (value: string) => any;
}


@Component({
    selector: 'sys-code-select-alain',
    templateUrl: './sys-code-select-alain.component.html',
    styleUrls: ['./sys-code-select-alain.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: SysCodeService

        }
    ]
})
export class SysCodeSelectAlainComponent extends BaseSelectAlain2Component<SysCodeSelectAlainSchema> {
    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'sys-code-select-alain2';

    @ViewChild(SysCodeSelectComponent, {static: false})
    sysCodeSelect: SysCodeSelectComponent;

    constructor(
        protected sysCodeService: SysCodeService,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef,
        @Inject(Injector) public readonly injector: Injector,
        @Inject(SFItemComponent) public readonly sfItemComp?: SFItemComponent,
        @Inject(SFComponent) public readonly sfComp?: SFComponent
    ) {
        super(sysCodeService, cd, injector, sfItemComp, sfComp);
    }

    getRealData(keyId: string): Observable<ReturnForm<any>> {
        return this.sysCodeService.getByCodeAndModuleCode(this.ui.category, keyId);
    }
}
