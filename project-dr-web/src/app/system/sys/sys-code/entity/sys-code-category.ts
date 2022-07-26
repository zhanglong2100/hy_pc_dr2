import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 字典模块分类
 */
export type SysCodeCategoryType = 'module' | 'leaf' | 'root';

/**
 * 机构
 */
export interface SysCodeCategory extends BaseForm, STData {
    /**
     * 主键id
     */
    id?: string;

    /**
     * 名称
     */
    name?: string;

    /**
     * 编码
     */
    code?: string;

    /**
     * 类型
     * 模块类型：module、leaf
     */
    type?: SysCodeCategoryType;

    /**
     * 父类id
     */
    parentId?: string;

    /**
     * 启用
     */
    active?: Boolean;
}
