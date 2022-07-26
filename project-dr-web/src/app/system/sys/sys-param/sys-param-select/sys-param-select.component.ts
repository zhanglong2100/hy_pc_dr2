import {Component} from '@angular/core';
import {BaseSelectComponent, BaseSelectConfig, BaseService, ComboBox} from '@sb/base';
import {SysParamSearchForm} from "../../../sys/sys-param/entity/sys-param-search-form";
import {SysParamService} from "../../../sys/sys-param/service/sys-param.service";

export interface SysParamSelectSelectConfig extends BaseSelectConfig<SysParamSearchForm> {
    notShow?: string | string[];
}

@Component({
    selector: 'sys-param-select',
    templateUrl: './sys-param-select.component.html',
    styleUrls: ['./sys-param-select.component.less'],
    providers: [{
        provide: BaseService,
        useClass: SysParamService
    }]
})
export class SysParamSelectComponent extends BaseSelectComponent<SysParamSelectSelectConfig, SysParamSearchForm> {

    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'sys-param-select';

    emptyText = '请选择系统参数';

    doInit() {
        // 不显示协议
        if (typeof this.config.notShow === 'string' && this.config.notShow) {
            this.config.notShow = [this.config.notShow];
        }
        if (!this.config.notShow) {
            this.config.notShow = [];
        }
    }

    filterValue(propertyValues: ComboBox[]): ComboBox[] {
        return propertyValues.filter(value => {
            let show = true;
            for (let i = 0; i < this.config.notShow.length; i++) {
                if (this.config.notShow[i] === value.code) {
                    show = false;
                    break;
                }
            }
            return show;
        });
    }

}
