package com.sbwork.dr.config;

import lombok.Data;

/**
 * 阿里数据源配置
 *
 * @author sbjw
 */
@Data
public class DruidLoginConfiguration {
    /**
     * 用户名
     */
    private String loginUsername;

    /**
     * 密码
     */
    private String loginPassword;

    /**
     * 允许
     */
    private String allow;

    /**
     * 不允许
     */
    private String deny;
}
