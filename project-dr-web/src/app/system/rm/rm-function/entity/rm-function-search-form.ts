import {Page} from '../../../../../../projects/base/index';

/**
 * 功能搜索对象
 */
export interface RmFunctionSearchForm extends Page {
    /**
     * 功能名称
     */
    name?: string;

    /**
     * 父标识
     */
    parentId?: string;

}

