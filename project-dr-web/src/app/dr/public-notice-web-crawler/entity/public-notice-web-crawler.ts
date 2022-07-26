import {STData} from '@delon/abc';
import {BaseForm} from '@sb/base';


export interface PublicNoticeWebCrawler extends STData, BaseForm {
    /**
     * 标识
     */
    id?: string;

    /**
     * 招标公告链接
     */
    publicNoticeUrl?: string;

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
