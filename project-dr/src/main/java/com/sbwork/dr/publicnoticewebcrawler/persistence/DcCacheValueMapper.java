package com.sbwork.dr.publicnoticewebcrawler.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.dr.publicnoticewebcrawler.entity.DcCacheValue;
import com.sbwork.dr.publicnoticewebcrawler.searchForm.DcCacheValueSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 数据缓存mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface DcCacheValueMapper extends BaseMapper<DcCacheValue, DcCacheValueSearchForm>{
}
