import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 数据字典
 */
export interface SysCode extends BaseForm, STData {
    /**
     * 主键id
     */
    id?: string;

    /**
     * 目录id
     */
    moduleId?: string;

    /**
     * 名称
     */
    name?: string;

    /**
     * 值
     */
    code?: string;

    /**
     * 父类id
     */
    parentId?: string;

}
