import {Page} from '@sb/base';

/**
 * 搜索对象
 */
export interface SysCodeCategorySearchForm extends Page {
    /**
     * 名称
     */
    name?: string;

    /**
     * 编码
     */
    code?: string;

    /**
     * 父类id
     */
    parentId?: string;

    /**
     * 启用
     */
    active?: Boolean;
}

