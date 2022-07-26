import {STData} from '@delon/abc';

export declare type MsgType = 'JG' | 'A_LI_YUN';

export declare type AppType = 'JG';

/**
 * 系统参数
 */
export interface SysNotice extends STData {
    /**
     * 唯一标识
     */
    noticeId?: string;

    /**
     * 开启
     */
    active?: boolean;

    /**
     * 短信通知开启
     */
    msgActive?: boolean;

    /**
     * 短信类型
     */
    msgType?: MsgType;

    /**
     * app推送开启
     */
    appActive?: boolean;

    /**
     * app推送类型
     */
    appType?: AppType;

    /**
     * 微信公众号通知开启
     */
    weChartPublicActive?: boolean;

    /**
     * 邮箱通知开启
     */
    emailActive?: boolean;

}
