import {Page} from '@sb/base';

/**
 * 系统参数
 */
export interface SysParamSearchForm extends Page {
    /**
     * id
     */
    // paramId?: string;

    /**
     * 参数名称
     */
    paramName?: string;

    /**
     * 参数值
     */
    // paramValue?: string;

    /**
     * 值类型
     */
    // valueType?: string;

    /**
     * 备注
     */
    remark?: string;

    /**
     * 数据字典ID
     */
    paramValueCodeId?: string;

}
