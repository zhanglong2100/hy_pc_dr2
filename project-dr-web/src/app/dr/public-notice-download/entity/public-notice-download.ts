import {STData} from '@delon/abc';
import {BaseForm} from '@sb/base';

// export type GatewayType = 'dtu' | 'gateway' | 'mqttClient' | 'httpClient'| 'httpServer';

export interface PublicNoticeDownload extends STData, BaseForm {
    /**
     * 标识
     */
    id?: string;

    /**
     * 名称
     */
    name?: string;

    /**
     * 路径
     */
    pathUrl?: string;


}
