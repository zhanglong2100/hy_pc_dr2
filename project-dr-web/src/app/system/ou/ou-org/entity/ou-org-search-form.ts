import {Page} from '@sb/base';
import {OuOrgType} from './ou-org';

/**
 * 搜索对象
 */
export interface OuOrgSearchForm extends Page {

    /**
     * 机构名称
     */
    orgName?: string;

    /**
     * 机构、部门
     */
    orgType?: OuOrgType;

    /**
     * 父机构id
     */
    parentOrgId?: string;
}

