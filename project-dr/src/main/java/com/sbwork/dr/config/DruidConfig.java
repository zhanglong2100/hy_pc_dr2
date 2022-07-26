package com.sbwork.dr.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidDataSourceFactory;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import com.alibaba.druid.wall.WallConfig;
import com.alibaba.druid.wall.WallFilter;
import org.apache.commons.lang.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DatabaseDriver;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 阿里数据源配置（来源于网站）
 *
 * @author sbjw
 */

@Configuration
public class DruidConfig {

    @Bean
    @ConfigurationProperties(prefix = "config.druid")
    public DruidLoginConfiguration druidLoginConfiguration() {
        return new DruidLoginConfiguration();
    }

    @Bean
    @ConditionalOnClass(DruidDataSource.class)
    @ConditionalOnProperty(name = "spring.datasource.type",
            havingValue = "com.alibaba.druid.pool.DruidDataSource",
            matchIfMissing = true)
    @ConfigurationProperties("spring.datasource.druid")
    public Properties druidConfiguration() {
        return new Properties();
    }

    @Bean
    public DruidDataSource dataSource(DataSourceProperties properties, Properties druidConfiguration) throws SQLException {
        DruidDataSource druidDataSource = properties.initializeDataSourceBuilder()
                .type(DruidDataSource.class)
                .build();

        Map<String, Object> obj = new HashMap<>();
        if (druidConfiguration != null) {
            Pattern pattern = Pattern.compile("-([a-z])");
            druidConfiguration.forEach((key, value) -> {
                String prop = (String) key;
                Matcher m = pattern.matcher(prop);
                StringBuffer sb = new StringBuffer();
                while (m.find()) {
                    m.appendReplacement(sb, (char) (m.group(1).charAt(0) - 32) + "");
                }
                m.appendTail(sb);
                obj.put(sb.toString(), value);
            });
            DruidDataSourceFactory.config(druidDataSource, obj);
        }


        DatabaseDriver databaseDriver = DatabaseDriver.fromJdbcUrl(properties.determineUrl());
        String validationQuery = databaseDriver.getValidationQuery();
        if (validationQuery != null) {
            druidDataSource.setValidationQuery(validationQuery);
        }
        return druidDataSource;
    }

    /**
     * 配置Druid监控
     * 后台管理Servlet
     */
    @Bean
    public ServletRegistrationBean<StatViewServlet> statViewServlet(DruidLoginConfiguration druidLoginConfiguration) {
        ServletRegistrationBean<StatViewServlet> bean = new ServletRegistrationBean<>(new StatViewServlet(), "/druid/*");

        if (druidLoginConfiguration != null) {
            Map<String, String> initParams = new HashMap<>();//这是配置的druid监控的登录密码
            if (StringUtils.isNotBlank(druidLoginConfiguration.getLoginUsername())
                    && StringUtils.isNotBlank(druidLoginConfiguration.getLoginPassword())) {
                initParams.put("loginUsername", druidLoginConfiguration.getLoginUsername());
                initParams.put("loginPassword", druidLoginConfiguration.getLoginPassword());
            }

            if (StringUtils.isNotBlank(druidLoginConfiguration.getAllow())) {
                //默认就是允许所有访问
                initParams.put("allow", druidLoginConfiguration.getAllow());
            }

            if (StringUtils.isNotBlank(druidLoginConfiguration.getDeny())) {
                //黑名单的IP
                initParams.put("deny", druidLoginConfiguration.getDeny());
            }
            bean.setInitParameters(initParams);
        }
        return bean;
    }

    /**
     * 配置web监控的filter
     */
    @Bean
    public FilterRegistrationBean<WebStatFilter> webStatFilter() {
        FilterRegistrationBean<WebStatFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new WebStatFilter());
        Map<String, String> initParams = new HashMap<>();
        initParams.put("exclusions", "/static/*,*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");//过滤掉需要监控的文件
        bean.setInitParameters(initParams);
        bean.setUrlPatterns(Collections.singletonList("/*"));
        return bean;
    }

    @Bean
    public WallFilter wallFilter() {
        WallFilter wallFilter = new WallFilter();
        wallFilter.setConfig(wallConfig());
        return wallFilter;
    }

    @Bean
    public WallConfig wallConfig() {
        WallConfig wallConfig = new WallConfig();
        wallConfig.setMultiStatementAllow(true);//允许一次执行多条语句
        wallConfig.setNoneBaseStatementAllow(true);//允许一次执行多条语句
        return wallConfig;
    }
}
