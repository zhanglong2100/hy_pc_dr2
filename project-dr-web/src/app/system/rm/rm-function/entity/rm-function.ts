import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 地址类型
 */
export declare type FuncUrlType = 'ABSOLUTE' | 'RELATIVE';

/**
 * 节点类型
 */
export declare type FuncType = 'FUNCTION' | 'SERVER' | 'MODULE' | 'PERMISSION';

/**
 * 功能
 */
export interface RmFunction extends BaseForm, STData {
    /**
     * 唯一标识
     */
    id?: string;

    /**
     * 功能名称
     */
    name?: string;

    /**
     * 节点类型
     */
    type?: FuncType;

    /**
     * 父ID
     */
    parentId?: string;

    /**
     * 父路径
     */
    parentPath?: string;

    /**
     * 序号
     */
    sortNo?: string;

    /**
     * 功能编码
     */
    funcCode?: string;

    /**
     * 功能访问地址
     */
    url?: string;

    /**
     * 地址类型（绝对地址，相对地址）
     */
    urlType?: FuncUrlType;

    /**
     * 服务器地址
     */
    serverUrl?: string;

    /**
     * 服务器描述
     */
    serverDescription?: string;

    /**
     * 权限编码
     */
    permissionCode?: string;
}
