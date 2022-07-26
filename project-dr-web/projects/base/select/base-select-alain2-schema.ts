import {FormProperty, SFComponent, SFCustomWidgetSchema} from '@delon/form';
import {Page} from '@sb/base/core';

export interface NotifyPropConfig {
    /**
     * 通知属性
     */
    notifyProp?: string | [string];
    /**
     * 需要监听的属性（参数里的param）
     */
    listenProp?: string;
    /**
     * 通知方法
     */
    notifyWidgetMethod?: ((value: any, formProperty: FormProperty, sfComp?: SFComponent) => {}) | string;
}

export interface BaseSelectAlain2Schema<S extends Page> extends SFCustomWidgetSchema {
    /**
     * 默认为true
     */
    multiple?: boolean;
    /**
     * 如果 multiple 为 false ，valueType为string
     * 如果 multiple 为  true ，valueType为string，用逗号分隔（默认）
     *                          valueType为 array，返回数组
     */
    valueType?: 'array' | 'string';

    /**
     * 空白文本
     */
    emptyText?: string;

    /**
     * 查询对象
     */
    searchForm?: S;

    /**
     * 通知属性
     */
    notifyProp?: NotifyPropConfig[];

    /**
     * 过滤对象
     */
    notShow?: string[];

    /**
     * 不可用
     */
    disabled?: boolean;
}
