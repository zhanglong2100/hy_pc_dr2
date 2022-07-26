export type OrderByType = 'ASC' | 'DESC';

/**
 * 排序对象
 */
export interface OrderBy {

    /**
     * 排序字段
     */
    orderByField?: string;

    /**
     * 排序字段
     */
    orderByFields?: string[];

    /**
     * 排序方式
     */
    orderByType?: OrderByType;

    /**
     * 排序方式
     */
    orderByTypes?: OrderByType[];

    /**
     * 排序字符串
     */
    orderByStr?: string;
}
