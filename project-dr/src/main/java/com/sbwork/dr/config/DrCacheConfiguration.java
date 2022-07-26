package com.sbwork.dr.config;

import com.sbwork.cache.CacheManager;
import com.sbwork.cache.CacheManagerFactory;
import com.sbwork.cache.PageQueryCacheManager;
import com.sbwork.cache.ehCache.EhCacheCacheManager;
import com.sbwork.cache.ehCache.PageQueryEhCacheCacheManager;
import com.sbwork.cache.nocache.PageQueryNoCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;

/**
 * @author sbjw
 */
@Order(1)
@Configuration
public class DrCacheConfiguration {
    /**
     * 默认缓存
     */
    @Bean(CacheManagerFactory.DEFAULT_CACHE_MANAGER_NAME)
    @Profile("webjar")
    public PageQueryCacheManager defaultCacheManager() {
        PageQueryEhCacheCacheManager pageQueryEhCacheCacheManager = new PageQueryEhCacheCacheManager();
        pageQueryEhCacheCacheManager.setConfigLocation(new ClassPathResource("/ehcache-page.xml"));
        return pageQueryEhCacheCacheManager;
    }

    /**
     * Ehcache缓存
     *
     * @return
     */
    @Bean("DR_CACHE")
    @Profile("webjar")
    public PageQueryCacheManager drCacheManager() {
        return new PageQueryNoCacheManager();
    }

    /**
     * Ehcache缓存
     *
     * @return
     */
    @Bean("SHIRO_CACHE_MANAGER")
    @Profile("webjar")
    public CacheManager shiroCacheManager() {
        EhCacheCacheManager ehCacheManager = new EhCacheCacheManager();
        ehCacheManager.setConfigLocation(new ClassPathResource("/ehcache-shiro.xml"));
        return ehCacheManager;
    }
}
