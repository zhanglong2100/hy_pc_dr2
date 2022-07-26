import {BaseForm} from "@sb/base";
import {STData} from "@delon/abc"

export interface RmMenuIcon extends BaseForm, STData {
    /**
     * 主键id
     */
    iconId?: string;
    /**
     * 名称
     */
    name?: string;

    /**
     * 图片二进制码
     */
    picture?: string;
}
