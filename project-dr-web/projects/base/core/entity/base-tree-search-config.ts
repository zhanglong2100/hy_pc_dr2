/**
 * 基础form
 */
export interface BaseTreeSearchConfig {

    /**
     * 父节点
     */
    parentId?: string;

    /**
     * 每一次请求的层级
     * -1代表一次请求所有
     */
    maxLevel?: number;

}
