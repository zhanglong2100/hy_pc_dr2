import {Page} from '@sb/base';
import {RoleType} from "./rm-role";

/**
 * 机构搜索对象
 */
export interface RmRoleSearchForm extends Page {

    /**
     * 角色类型
     */
    roleType: RoleType;

    /**
     * 是否权限过滤
     */
    permission: boolean;

}

