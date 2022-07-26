import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 岗位
 */
export interface OuPosition extends BaseForm, STData {
    /**
     * 岗位ID
     */
    positionId?: string;

    /**
     * 岗位
     */
    positionName?: string;

    /**
     * 岗位职责
     */
    duty?: string;

    /**
     * 排序
     */
    sortNo?: number;

    /**
     * 备注
     */
    description?: string;

}
