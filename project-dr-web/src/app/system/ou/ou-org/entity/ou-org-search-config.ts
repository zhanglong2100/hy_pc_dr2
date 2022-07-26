import {BaseTreeSearchConfig} from '@sb/base/core/entity/base-tree-search-config';

export interface OuOrgSearchConfig extends BaseTreeSearchConfig {

    /**
     * 查询子机构
     */
    searchSubOrg?: boolean;

    /**
     * 查询分组及部门
     */
    searchDept?: boolean;

    /**
     * 查询用户
     */
    searchUser?: boolean;

}
