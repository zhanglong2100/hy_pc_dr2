import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 机构
 */
export interface UserRole extends BaseForm, STData {
    /**
     * 用户Id
     */
    userId?: string;

    /**
     * 用户标识（多选）
     */
    userIds?: string | string[];

    /**
     * 用户名称
     */
    userName?: string;


    /**
     * 角色标识
     */
    roleId?: string;


    /**
     * 角色标识（多选）
     */
    roleIds?: string | string[];

    /**
     * 角色名称
     */
    roleName?: string;

}
