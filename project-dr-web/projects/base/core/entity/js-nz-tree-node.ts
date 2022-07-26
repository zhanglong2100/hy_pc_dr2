import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';

/**
 * Jstree树对象
 */
export class JsNzTreeNode<T> extends NzTreeNode {
    /**
     * 数据
     */
    data?: T | null;

    constructor(option: NzTreeNodeOptions, parent?: NzTreeNode) {
        super(option, parent);
        this.data = option.data;
    }
}
