import {Page} from '@sb/base';

/**
 * 机构搜索对象
 */
export interface SysCodeSearchForm extends Page {
    /**
     * 目录id
     */
    moduleId?: string;

    /**
     * 名称
     */
    name?: string;

    /**
     * 值
     */
    code?: string;

    /**
     * 父类id
     */
    parentId?: string;

    /**
     * 父类code
     */
    parentCode?: string;

    /**
     * 目录Code
     */
    moduleCode?: string;
}

