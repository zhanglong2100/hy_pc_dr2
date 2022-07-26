import {BaseForm} from '@sb/base';
import {STData} from '@delon/abc';

/**
 * 节点类型
 */
export declare type PublicNoticeDirType = 'DIR' | 'FILE' | 'FOLDER' ;



/**
 * 菜单
 */
export interface PublicNoticeDir extends BaseForm, STData {
    /**
     * 唯一标识
     */
    id?: string;

    /**
     * 菜单名称
     */
    name?: string;

    /**
     * 节点类型
     */
    type?: PublicNoticeDirType;

    /**
     * 父ID
     */
    parentId?: string;

    /**
     * 父路径
     */
    parentPath?: string;

    /**
     * 序号
     */
    sortNo?: string;

    /**
     * 菜单编码
     */
    code?: string;

}
