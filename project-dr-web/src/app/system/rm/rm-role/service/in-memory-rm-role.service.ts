import {RmRole} from '../entity/rm-role';
import {RmRoleSearchForm} from '../entity/rm-role-search-form';
import {BaseInMemoryService} from '@sb/in-memory-http-client';

export class InMemoryRmRoleService extends BaseInMemoryService<RmRole, RmRoleSearchForm> {
    get keyFields() {
        return ['roleId'];
    }

    get moduleName() {
        return 'rm/role';
    }

    get searchFields() {
        return ['roleName'];
    }

    get dbArrays(): RmRole[] {
        const rmRoles: RmRole[] = [];
        for (let i = 0; i < 51; i++) {
            const rmRole: RmRole = {} as RmRole;
            rmRole.roleId = this.genGuid();
            rmRole.roleName = '角色' + i;
            rmRoles.push(rmRole);
        }
        return rmRoles;
    }
}
