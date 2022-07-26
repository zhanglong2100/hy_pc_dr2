import {Page} from '@sb/base';


export interface PublicNoticeWebCrawlerGdSearchForm extends Page {



    /**
     * 发布网站
     */
    publicWeb?: string;

    /**
     * 项目编号
     */
    projectCode?: string;

    /**
     * 标题
     */
    projectName?: string;
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
     * 地区
     */
    area?: string;

    /**
     * 公告类型
     */
    publicNoticeType: string;
    /**
     * 采购方式
     */
    purchaseType: string;
    /**
     * 采购人
     */
    purchaseUser: string;
    /**
     * 采购代理机构
     */
    purchaseOrganization: string;
    /**
     * 是否已经解析
     */
    ifAnalysis: string;
    /**
     * 采购分类
     */
    purchaseClassify: string;

}
