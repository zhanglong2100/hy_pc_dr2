/**
 * 登录用户
 */
export interface LoginUser {
    /**
     * 登录用户名
     */
    userName: string;
    /**
     * 密码
     */
    password: string;
    /**
     * 登陆部门
     */
    orgId?: string;
    /**
     * 记住我
     */
    rememberMe?: boolean;
    /**
     * 验证码
     */
    verifyCode?: boolean;
}
