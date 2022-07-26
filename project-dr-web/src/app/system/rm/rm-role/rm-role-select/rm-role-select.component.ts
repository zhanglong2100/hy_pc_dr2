import {Component} from '@angular/core';
import {BaseSelectComponent, BaseSelectConfig, BaseService, ComboBox} from '@sb/base';
import {RmRoleSearchForm} from '../entity/rm-role-search-form';
import {RmRoleService} from '../service/rm-role.service';

export interface RmRoleSelectSelectConfig extends BaseSelectConfig<RmRoleSearchForm> {
    notShow?: string | string[];
}

@Component({
    selector: 'rm-role-select',
    templateUrl: './rm-role-select.component.html',
    styleUrls: ['./rm-role-select.component.less'],
    providers: [{
        provide: BaseService,
        useClass: RmRoleService
    }]
})
export class RmRoleSelectComponent extends BaseSelectComponent<RmRoleSelectSelectConfig, RmRoleSearchForm> {

    /* 用于注册小部件 KEY 值 */
    static readonly KEY = 'rm-role-select';

    emptyText = '请选择角色';

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
