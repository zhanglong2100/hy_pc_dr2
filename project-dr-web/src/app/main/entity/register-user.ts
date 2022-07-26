/**
 * 登录用户
 */
export interface RegisterUser {
    /**
     * 登录用户名
     */
    loginName?: string;
    /**
     * 密码
     */
    password?: string;
    /**
     * 复合密码
     */
    confirmPassword?: string;
    /**
     * 电话
     */
    tel: string;
    /**
     * 验证码
     */
    verifyCode?: boolean;
}
