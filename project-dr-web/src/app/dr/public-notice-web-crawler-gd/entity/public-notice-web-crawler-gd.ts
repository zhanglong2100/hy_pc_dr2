import {STData} from '@delon/abc';
import {BaseForm} from '@sb/base';


export interface PublicNoticeWebCrawlerGd extends STData, BaseForm {
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
     * 金额
     */
    budget: string;
    /**
     * 提交投标文件截止时间
     */
    endTime: string;
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
     * 项目经办人
     */
    projectManager: string;
    /**
     * 采购分类
     */
    purchaseClassify: string;
    /**
     * 采购联系方式
     */
    purchaseUserContactWay: string;

}
