import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 机构用户
 */
export interface OuOrgUser extends BaseForm, STData {
    /**
     * 用户id
     */
    userId?: string;

    /**
     * 用户名称
     */
    userName?: string;

    /**
     * 岗位ID
     */
    positionId: string;

    /**
     * 岗位名称
     */
    positionName: string;

    /**
     * 机构id
     */
    orgId?: string;

    /**
     * 机构名称
     */
    orgName?: string;

    /**
     * 主机构
     */
    mainOrg?: boolean;

    /**
     * 排序
     */
    sortNo?: number;
}
