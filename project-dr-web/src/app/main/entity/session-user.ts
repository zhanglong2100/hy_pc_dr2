export interface SessionUser {

    /**
     * 用户id
     */
    userId?: string;
    /**
     * 用户名称
     */
    userName?: string;
    /**
     * 邮箱
     */
    email?: string;
    /**
     * 性别
     */
    sex?: boolean;
    /**
     * 登录名
     */
    loginName?: string;
    /**
     * 密钥
     */
    salt?: string;
    /**
     * 密码
     */
    password?: string;
    /**
     * 电话
     */
    tel?: string;
    /**
     * 微信
     */
    wechat?: string;
    /**
     * 启用
     */
    active?: true;

    /**
     * 主机构标识
     */
    mainOrgId?: string;

    /**
     * 主机构名称
     */
    mainOrgName?: string;

    /**
     * 主部门标识
     */
    mainDeptId?: string;

    /**
     * 主部门名称
     */
    mainDeptName?: string;

    /**
     * 主岗位标识
     */
    mainPositionId?: string;

    /**
     * 主岗位名称
     */
    mainPositionName?: string;

}
