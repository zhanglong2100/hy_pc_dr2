package com.sbwork.dr.publicnoticedir.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.dr.publicnoticedir.entity.PublicNoticeDirEntity;
import com.sbwork.dr.publicnoticedir.searchForm.PublicNoticeDirSearchForm;
import com.sbwork.dr.publicnoticedownload.entity.PublicNoticeDownloadEntity;
import com.sbwork.dr.publicnoticedownload.searchForm.PublicNoticeDownloadSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * 公告类mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface PublicNoticeDirMapper extends BaseMapper<PublicNoticeDirEntity, PublicNoticeDirSearchForm> {
}
