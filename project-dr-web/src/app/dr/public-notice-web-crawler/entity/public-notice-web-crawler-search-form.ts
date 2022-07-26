import {Page} from '@sb/base';


export interface PublicNoticeWebCrawlerSearchForm extends Page {



    /**
     * 发布网站
     */
    publicWeb?: string;

    /**
     * 标题
     */
    title?: string;


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
     * 省份
     */
    province?: string;

    /**
     * 招标方式
     */
    bidType: string;
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

}
