package com.sbwork.proxy.config;

import com.sbwork.cache.CacheManager;
import com.sbwork.cache.CacheManagerFactory;
import com.sbwork.cache.ehCache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;

/**
 * @author sbjw
 */
@Order(1)
@Configuration
public class DrCacheConfiguration {
    /**
     * 内存缓存
     */
    @Bean(CacheManagerFactory.DEFAULT_CACHE_MANAGER_NAME)
    public CacheManager defaultCacheManager() {
        EhCacheCacheManager cacheCacheManager = new EhCacheCacheManager();
        cacheCacheManager.setConfigLocation(new ClassPathResource("/ehcache-dr.xml"));
        return cacheCacheManager;
    }
}
