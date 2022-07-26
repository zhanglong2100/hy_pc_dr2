import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 节点类型
 */
export declare type MenuType = 'MENU' | 'APPLICATION' | 'MODULE';

/**
 * 打开方式
 */
export declare type MenuOpenType = 'IFRAME' | 'OPEN';

/**
 * 应用类型
 */
export declare type ApplicationType = 'WEB' | 'APP';

/**
 * 菜单
 */
export interface RmMenu extends BaseForm, STData {
    /**
     * 唯一标识
     */
    id?: string;

    /**
     * 菜单名称
     */
    name?: string;

    /**
     * 节点类型
     */
    type?: MenuType;

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
     * 菜单编码
     */
    code?: string;

    /**
     * 功能标识
     */
    functionId?: string;

    /**
     * 默认图标(预留字段)
     */
    iconId?: string;

    /**
     * 打开方式
     */
    openType?: MenuOpenType;

    /**
     * 备注
     */
    remark?: string;

    /**
     * 启用
     */
    active?: string;

    /**
     * 应用类型
     */
    applicationType?: ApplicationType;
}
