import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 字典模块分类
 */
export type OuOrgType = 'ORG' | 'DEPT';

/**
 * 机构
 */
export interface OuOrg extends BaseForm, STData {
    /**
     * 机构id
     */
    orgId?: string;

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

    /**
     * 排序
     */
    sortNo?: number;

    /**
     * 备注
     */
    remark?: string;

    /**
     * 地址
     */
    orgAddr?: string;

    /**
     * 联系人
     */
    linkMan?: string;

    /**
     * 联系电话
     */
    linkTel?: string;

    /**
     * 电子邮箱
     */
    email?: string;

    /**
     * 网站地址
     */
    webUrl?: string;

    /**
     * 机构状态
     */
    status?: string;
}
