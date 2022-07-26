import {BaseForm} from '@sb/base';

/**
 * 系统错误
 */
export interface SysErrorLog extends BaseForm {
    /**
     * 错误ID
     */
    errorId?: string;

    /**
     * 错误时间
     */
    errorTime?: string;

    /**
     * 访问的错误地址
     */
    url?: string;

    /**
     * 错误参数
     */
    param?: string;

    /**
     * 错误包名
     */
    errorPackage?: string;

    /**
     * 错误方法名
     */
    errorMethod?: string;

    /**
     * 错误行号
     */
    errorLineNumber?: string;

    /**
     * 错误消息
     */
    errorMessage?: string;

    /**
     * 错误堆栈
     */
    errorStack?: string;
}
