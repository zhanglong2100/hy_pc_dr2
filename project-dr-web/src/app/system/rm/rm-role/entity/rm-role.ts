import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

export type RoleType = 'ADMIN' | 'NORMAL';

/**
 * 机构
 */
export interface RmRole extends BaseForm, STData {
    /**
     * 角色id
     */
    roleId?: string;

    /**
     * 角色名称
     */
    roleName?: string;

    /**
     * 角色编码
     */
    roleCode?: string;

    /**
     * 角色类型
     */
    roleType?: RoleType;

    /**
     * 排序
     */
    sortNo?: number;
    /**
     * 备注
     */
    remark?: string;

}
