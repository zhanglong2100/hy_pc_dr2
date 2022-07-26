package com.sbwork.proxy.redis;

import com.sbwork.proxy.entity.HttpProxy;
import com.sbwork.proxy.util.JsonUtils;
import redis.clients.jedis.Jedis;

import java.util.Set;


public class JedisUtils {

    private static void release(Jedis jedis) {
        jedis.close();
    }

    private static Jedis getJedis() {
        return JedisPoolFactory.getInstance().getResource();
    }

    public static void setProxyIp(HttpProxy httpProxy) {
        Jedis jedis = getJedis();
        jedis.sadd("httpProxy", JsonUtils.toString(httpProxy));
        release(jedis);
    }

    public static Set<String> getProxyIp() {
        Jedis jedis = getJedis();
        Set<String> set = jedis.keys("*");
        release(jedis);
        return set;
    }

    public static String getProxyIpStr() {
        Jedis jedis = getJedis();
        String httpProxy = jedis.get("httpProxy");
        release(jedis);
        return httpProxy;
    }

}