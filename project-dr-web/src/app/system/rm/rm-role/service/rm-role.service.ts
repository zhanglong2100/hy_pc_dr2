import {Injectable} from '@angular/core';
import {RmRoleSearchForm} from '../entity/rm-role-search-form';
import {RmRole} from '../entity/rm-role';
import {BaseService} from '@sb/base';

/**
 * 机构服务
 */
@Injectable({
    providedIn: 'root'
})
export class RmRoleService extends BaseService<RmRole, RmRoleSearchForm> {

    basePath = 'rm/role';
}
