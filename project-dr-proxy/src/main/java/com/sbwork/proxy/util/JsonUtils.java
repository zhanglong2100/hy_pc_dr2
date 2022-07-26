package com.sbwork.proxy.util;

import com.alibaba.fastjson.JSON;


public class JsonUtils {

    public static String toString(Object object){
        return JSON.toJSONString(object);
    }

    public static Object toObject(String json,Class<?> clazz){
       return JSON.parseObject(json,clazz);
    }



}
