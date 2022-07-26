package com.sbwork.dr.publicnoticewebcrawler.service;


import com.sbwork.dr.publicnoticewebcrawler.entity.DcCacheValue;
import com.sbwork.dr.publicnoticewebcrawler.persistence.DcCacheValueMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * id Service 类
 */
@Service
public class DcCacheValueService  {
    /**
     * 自动注入DcCacheValueMapper
     */
    @Resource
    private DcCacheValueMapper cacheValueMapper;


    public void update(String type, String key, Date requestTime) {
        DcCacheValue dc = new DcCacheValue();
        dc.setDcType(type);
        dc.setDcKey(key);
        DcCacheValue old = cacheValueMapper.getUniqueByEntity(dc);

        if (old == null) {
            old = new DcCacheValue();
            old.setDcType(type);
            old.setDcKey(key);
            old.setRequestTime(requestTime);
            cacheValueMapper.insert(old);
        } else {
            old.setRequestTime(requestTime);
            cacheValueMapper.update(old);
        }
    }

    public Date get(String type, String key) {
        DcCacheValue dc = new DcCacheValue();
        dc.setDcType(type);
        dc.setDcKey(key);
        DcCacheValue old = cacheValueMapper.getUniqueByEntity(dc);
        if(old != null)return old.getRequestTime();

        return null;
    }

}
