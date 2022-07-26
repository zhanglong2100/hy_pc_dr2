package com.sbwork.dr.publicnoticewebcrawler.convert;

import com.sbwork.base.convert.BaseConvert;
import com.sbwork.dr.publicnoticewebcrawler.entity.PublicNoticeWebCrawler;
import com.sbwork.dr.publicnoticewebcrawler.form.PublicNoticeWebCrawlerForm;
import org.springframework.stereotype.Component;

/**
 * 公告资源爬取entity、form转换类
 */
@Component
public class PublicNoticeWebCrawlerConvert extends BaseConvert<PublicNoticeWebCrawler, PublicNoticeWebCrawlerForm> {

    @Override
    protected void afterConvertToForm(PublicNoticeWebCrawler entity, PublicNoticeWebCrawlerForm form) {

    }

    @Override
    protected void afterConvertToEntity(PublicNoticeWebCrawlerForm form, PublicNoticeWebCrawler entity) {

    }
}
