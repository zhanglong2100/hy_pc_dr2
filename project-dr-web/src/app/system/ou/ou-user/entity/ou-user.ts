import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

export interface OuUser extends BaseForm, STData {
    /**
     * 用户id
     */
    userId?: string;
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
    sex?: boolean;
    /**
     * 登录名
     */
    loginName?: string;
    /**
     * 密钥
     */
    salt?: string;
    /**
     * 密码
     */
    password?: string;
    /**
     * 电话
     */
    tel?: string;
    /**
     * 微信
     */
    wechat?: string;
    /**
     * 启用
     */
    active?: true;
    /**
     * 办公电话
     */
    officeTel?: string;
    /**
     * qq号
     */
    qq?: string;
    /**
     * 生效日期
     */
    startDate?: string;
    /**
     * 失效日期
     */
    endDate?: string;
}
