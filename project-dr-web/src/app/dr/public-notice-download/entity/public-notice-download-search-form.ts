import {Page} from '@sb/base';

export interface PublicNoticeDownloadSearchForm extends Page {


    /**
     * 创建开始时间
     */
    createTimeStart?: string;
    /**
     * 创建结束时间
     */
    createTimeEnd?: string;


    /**
     * 名称
     */
    name?: string;

    /**
     * 路径
     */
    pathUrl?: string;


}
