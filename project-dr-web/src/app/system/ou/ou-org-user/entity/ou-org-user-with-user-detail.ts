import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 机构用户
 */
export interface OuOrgUserWithUserDetail extends BaseForm, STData {
    /**
     * 用户id
     */
    userId?: string;

    /**
     * 用户id集合
     */
    userIds?: string[];

    /**
     * 用户名称
     */
    userName?: string;

    /**
     * 邮箱
     */
    email?: string;

    /**
     * 性别
     */
    sex?: string;

    /**
     * 登录名
     */
    loginName?: string;

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
