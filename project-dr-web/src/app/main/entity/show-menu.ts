import {FuncUrlType} from "../../system/rm/rm-function/entity/rm-function";
import {MenuOpenType} from "../../system/rm/rm-menu/entity/rm-menu";

export type ShowMenus = ShowMenu[];

/**
 * 菜单
 */
export interface ShowMenu {
    /**
     * 路径
     */
    code?: string;
    /**
     * 路由
     */
    routerLink?: string;
    /**
     * 菜单名称
     */
    name?: string;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 子菜单
     */
    children?: ShowMenu[];

    /**
     * 地址类型
     */
    urlType: FuncUrlType;

    /**
     * 打开类型
     */
    openType: MenuOpenType;

    /**
     * 异步加载
     */
    loadChildren?: string;

    noModule?: boolean;

    data?: any;
}
