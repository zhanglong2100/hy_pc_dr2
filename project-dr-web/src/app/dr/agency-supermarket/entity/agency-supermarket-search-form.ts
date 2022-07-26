import {Page} from '@sb/base';

export interface AgencySupermarketSearchForm extends Page {
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
     * 业务类型
     */
    businessType?: string;

    /**
     * 地区
     */
    area?: string;

    /**
     * 是否立项
     */
    ifProjectApproval?: string;

    /**
     * 项目名称
     */
    projectName: string;

    /**
     * 立项编号
     */
    projectApprovalCode: string;

    /**
     * 中介超市
     */
    agencySupermarket: string;

    /**
     * 业主单位
     */
    ownerUnit: string;

    /**
     * 选取方式
     */
    chooseType: string;

    /**
     * 是否报名
     */
    ifApply: string;

    /**
     * 是否中标
     */
    ifBidding: string;

    /**
     * 市场人员
     */
    marketPerson: string;

    /**
     * 录入人员
     */
    enteringPerson: string;

    /**
     * 中标通知书是否归档
     */
    ifArchive: string;
}
