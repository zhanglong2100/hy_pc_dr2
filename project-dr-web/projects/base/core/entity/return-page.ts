/**
 * 分页结果
 */
export interface ReturnPage<T> {
    /**
     * 结果
     */
    rows: T[];
    /**
     * 总数
     */
    total: number;
}
