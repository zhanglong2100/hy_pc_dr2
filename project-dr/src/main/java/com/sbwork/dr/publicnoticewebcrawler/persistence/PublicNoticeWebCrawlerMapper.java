package com.sbwork.dr.publicnoticewebcrawler.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.dr.publicnoticewebcrawler.entity.PublicNoticeWebCrawler;
import com.sbwork.dr.publicnoticewebcrawler.searchForm.PublicNoticeWebCrawlerSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 公告资源爬取mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface PublicNoticeWebCrawlerMapper extends BaseMapper<PublicNoticeWebCrawler, PublicNoticeWebCrawlerSearchForm>{
}
