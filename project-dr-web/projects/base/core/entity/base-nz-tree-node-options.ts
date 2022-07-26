import {NzTreeNodeOptions} from 'ng-zorro-antd';

/**
 * 基础树对象
 */
export interface BaseNzTreeNodeOptions<T> extends NzTreeNodeOptions {
    /**
     * 已加载子节点
     */
    loadedChildren?: boolean;

    /**
     * 数据
     */
    data?: T;

    /**
     * 类型
     */
    type?: string;
}
