package com.sbwork.proxy.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.proxy.entity.HttpProxyData;
import com.sbwork.proxy.searchForm.HttpProxyDataSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 动态ip代理池数据表mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface HttpProxyDataMapper extends BaseMapper<HttpProxyData, HttpProxyDataSearchForm>{
}
