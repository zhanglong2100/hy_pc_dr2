package com.sbwork.dr.baidu;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 百度AI公共配置
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "config.ai")
public class BaiDuAiConfiguration {


    /**
     * 官网获取的 API Key 更新为你注册的
     */
    private String clientId;



    /**
     * 官网获取的 Secret Key 更新为你注册的
     */
    private String clientSecret;

    /**
     * 官网获取的 数字识别接口
     */
    private String httpUrl;

}
