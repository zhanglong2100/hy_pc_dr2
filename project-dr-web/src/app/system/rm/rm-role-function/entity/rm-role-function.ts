import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 功能
 */
export interface RmRoleFunction extends BaseForm, STData {
    /**
     * 唯一标识
     */
    roleFuncId?: string;

    /**
     * 角色ID
     */
    roleId?: string;

    /**
     * 功能ID
     */
    funcId?: string;
}
