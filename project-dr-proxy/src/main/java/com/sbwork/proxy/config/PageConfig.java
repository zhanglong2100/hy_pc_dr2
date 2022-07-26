package com.sbwork.proxy.config;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * 读取配置
 */
@Slf4j
public class PageConfig {

    public static final List<String> list;
    public static final String  checkPage;

    static {
        InputStream resourceAsStream = PageConfig.class.getResourceAsStream("/page.properties");
        Properties properties = new Properties();
        try {
            properties.load(resourceAsStream);
        } catch (IOException e) {
            log.error(e.getMessage());
        }

        // ip检测访问地址
        checkPage = properties.getProperty("checkPage");

        List<String> stringList = new ArrayList<>();
        // 获取所有name
        Set<String> names = properties.stringPropertyNames();
        Iterator<String> iterator = names.iterator();
        while(iterator.hasNext()){
            // 获取name 对应的value
            String name = iterator.next();
            String page = properties.getProperty(name);
            log.info("获取page.propertie文件： " + name + " = " + page);
            if(!"checkPage".equals(name))stringList.add(page);
        }
//        list = Arrays.asList(pages.split("\\|"));
         list = stringList;
    }
}
