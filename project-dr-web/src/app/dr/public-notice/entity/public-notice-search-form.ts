import {Page} from '@sb/base';

export interface PublicNoticeSearchForm extends Page {
    /**
     * 发布时间
     */
    publicTime?: string;
    /**
     * 发布开始时间
     */
    publicTimeStart?: string;
    /**
     * 发布结束时间
     */
    publicTimeEnd?: string;


    /**
     * 创建开始时间
     */
    createTimeStart?: string;
    /**
     * 创建结束时间
     */
    createTimeEnd?: string;


    /**
     * 发布网站
     */
    publicWeb?: string;

    /**
     * 招标公告链接
     */
    publicNoticeUrl?: string;

    /**
     * 省份
     */
    province?: string;

    /**
     * 项目名称
     */
    projectName: string;

    /**
     * 公告类型
     */
    publicNoticeType: string;

    /**
     * 业务类型
     */
    businessType: string;

    /**
     * 项目类型
     */
    projectType: string;

    /**
     * 采购方式
     */
    purchaseType: string;

    /**
     * 是否中标
     */
    bidIf: string;

    /**
     * 得分情况
     */
    score: string;
}
