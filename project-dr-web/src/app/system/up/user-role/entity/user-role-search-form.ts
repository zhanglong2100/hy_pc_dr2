import {Page} from '@sb/base';

/**
 * 机构搜索对象
 */
export interface UserRoleSearchForm extends Page {
    /**
     * 用户标识
     */
    userId?: string;

    /**
     * 角色标识
     */
    roleId?: string;
}

