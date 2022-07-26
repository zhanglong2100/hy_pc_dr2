import {STData} from '@delon/abc';
import {BaseForm} from '@sb/base';

// export type GatewayType = 'dtu' | 'gateway' | 'mqttClient' | 'httpClient'| 'httpServer';

export interface PublicNotice extends STData, BaseForm {
    /**
     * 标识
     */
    id?: string;

    /**
     * 发布时间
     */
    publicTime?: string;

    /**
     * 发布网站
     */
    publicWeb?: string;

    /**
     * 招标公告链接
     */
    publicNoticeUrl?: string;

    /**
     * 类型
     */
    // type?: GatewayType;

    /**
     * 省份
     */
    province?: string;

    /**
     * 项目名称
     * （mqtt可用）
     */
    projectName: string;
    /**
     * 项目编号
     */
    projectCode: string;
    /**
     * 采购方式
     */
    purchaseType: string;
    /**
     * 业务类型
     */
    businessType: string;
    /**
     * 公告类型
     */
    publicNoticeType: string;
    /**
     * 项目类型
     */
    projectType: string;
}
