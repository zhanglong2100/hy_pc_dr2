package com.sbwork.dr.publicnotice.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * 公告类mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface PublicNoticeMapper extends BaseMapper<PublicNoticeEntity, PublicNoticeSearchForm> {
}
