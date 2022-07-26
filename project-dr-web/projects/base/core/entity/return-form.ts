/**
 * 返回对象
 */
export interface ReturnForm<T> {
    /**
     * 是否成功
     */
    success: boolean;

    /**
     * 消息体
     */
    message?: T;

    /**
     * 错误消息体
     */
    errorMessage?: string;

    /**
     * 返回值
     */
    status?: number;
}
