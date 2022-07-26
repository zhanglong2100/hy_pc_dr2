import {BaseTreeSearchConfig} from '@sb/base/core/entity/base-tree-search-config';

export interface RmFunctionSearchConfig extends BaseTreeSearchConfig {

    /**
     * 查询权限
     */
    searchPermission?: boolean;

    /**
     * 查询空的模块
     */
    searchEmptyModule?: boolean;

    /**
     * 查询空的服务
     */
    searchEmptyServer?: boolean;

}
