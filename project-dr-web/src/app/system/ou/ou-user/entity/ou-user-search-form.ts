import {Page} from '@sb/base';

export interface OuUserSearchForm extends Page {

    /**
     * 搜索文本
     */
    searchText?: string;

    /**
     * 邮箱
     */
    email?: string;

    /**
     * 用户名
     */
    userName?: string;

    /**
     * 登录名
     */
    loginName?: string;

    /**
     * 启用
     */
    active?: string;

    orgId?: string;
}
