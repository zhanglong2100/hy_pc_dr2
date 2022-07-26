package com.sbwork.dr.publicnoticewebcrawlerguangdong.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.entity.PublicNoticeWebCrawlerGuangDong;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.searchForm.PublicNoticeWebCrawlerGuangDongSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 公告资源爬取(广东省政府采购网)mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface PublicNoticeWebCrawlerGuangDongMapper extends BaseMapper<PublicNoticeWebCrawlerGuangDong, PublicNoticeWebCrawlerGuangDongSearchForm>{
}
