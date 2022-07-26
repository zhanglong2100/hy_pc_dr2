import {Page} from '../../../../../../projects/base/index';

/**
 * 功能搜索对象
 */
export interface RmMenuSearchForm extends Page {
    /**
     * 菜单名称
     */
    name?: string;

    /**
     * 父标识
     */
    parentId?: string;

}

