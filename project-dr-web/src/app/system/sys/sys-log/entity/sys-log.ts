import {BaseForm} from '@sb/base';

export interface SysLog extends BaseForm {
    /**
     * 日志id
     */
    logId?: string;

    /**
     * 日志类型（大类）
     */
    logType1?: string;

    /**
     * 日志类型（小类）
     */
    logType2?: string;

    /**
     * 日志时间
     */
    logTime?: string;

    /**
     * 当前用户id
     */
    userId?: string;

    /**
     * 当前用户名
     */
    username?: string;

    /**
     * 用户操作的ip
     */
    ip?: string;

    /**
     * 登陆错误信息
     */
    errorMessage?: string;
}
