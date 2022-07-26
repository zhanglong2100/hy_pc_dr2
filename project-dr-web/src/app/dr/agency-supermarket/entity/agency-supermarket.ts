import {STData} from '@delon/abc';
import {BaseForm} from '@sb/base';

export interface AgencySupermarket extends STData, BaseForm {
    /**
     * 标识
     */
    id?: string;

    /**
     * 月份
     */
    month?: string;

    /**
     * 业务类型
     */
    businessType?: string;
    businessTypeTemp?: string;

    /**
     * 地区
     */
    area?: string;

    /**
     * 是否立项
     */
    ifProjectApproval?: string;

    /**
     * 立项编号
     */
    projectApprovalCode?: string;

    /**
     * 项目名称
     */
    projectName?: string;

    /**
     * 业主单位
     */
    ownerUnit?: string;

    /**
     * 中介超市
     */
    agencySupermarket?: string;

    /**
     * 金额
     */
    budget?: string;

    /**
     * 链接
     */
    publicNoticeUrl?: string;

    /**
     * 发布日期
     */
    publicTime?: string;

    /**
     * 报名截止时间
     */
    endTime?: string;

    /**
     * 选取方式
     */
    chooseType?: string;

    /**
     * 是否报名
     */
    ifApply?: string;

    /**
     * 是否中标
     */
    ifBidding?: string;

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
    /**
     * 备注
     */
    remark: string;

}
