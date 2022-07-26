/**
 * 分页对象
 */
import {OrderBy} from './order-by';

export interface Page extends OrderBy {
    /**
     * 页数
     */
    page?: number;
    /**
     * 行数
     */
    rows?: number;
    /**
     * 是否查询总数
     */
    searchCount?: boolean;
    /**
     * 是否查询结果
     */
    searchResult?: boolean;
}
