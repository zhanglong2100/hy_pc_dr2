import {Page} from '@sb/base';

/**
 * 搜索对象
 */
export interface OuOrgUserSearchForm extends Page {

    /**
     * 机构名称
     */
    orgId?: string;

    /**
     * 机构、部门
     */
    userId?: string;

    /**
     * 岗位标识
     */
    positionId?: string;
}

