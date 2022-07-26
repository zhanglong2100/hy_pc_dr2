import {Page} from "@sb/base";


export interface RmMenuIconSearchForm extends Page {
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
