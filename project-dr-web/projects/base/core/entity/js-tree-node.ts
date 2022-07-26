import {JsTreeNodeState} from './js-tree-node-state';

export interface JsTreeNode<T> {
    /**
     * id
     */
    id: string;
    /**
     *  显示文本
     */
    text: string;
    /**
     * 类型
     */
    type?: string;
    /**
     * 图标
     */
    icon?: null;
    /**
     * 等级
     */
    level?: number;
    /**
     * 展开
     */
    expand?: boolean;
    /**
     * 状态
     */
    state?: JsTreeNodeState | null;
    /**
     * 数据
     */
    data?: T | null;
    /**
     * 子节点
     */
    children?: JsTreeNode<any>[] | boolean;

    /**
     * 子节点未加载
     */
    noLoadedChildren?: boolean;

    /**
     * 父节点
     */
    parent?: JsTreeNode<any> | null;
}
