package com.sbwork.dr.publicnoticedownload.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import com.sbwork.dr.publicnoticedownload.entity.PublicNoticeDownloadEntity;
import com.sbwork.dr.publicnoticedownload.searchForm.PublicNoticeDownloadSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * 公告类mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface PublicNoticeDownloadMapper extends BaseMapper<PublicNoticeDownloadEntity, PublicNoticeDownloadSearchForm> {
}
