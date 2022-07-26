import {Page} from '../../../../../projects/base/index';

/**
 * 功能搜索对象
 */
export interface PublicNoticeDirSearchForm extends Page {
    /**
     * 菜单名称
     */
    name?: string;

    /**
     * 父标识
     */
    parentId?: string;

    /**
     * 创建开始时间
     */
    createTimeStart?: string;
    /**
     * 创建结束时间
     */
    createTimeEnd?: string;

}

