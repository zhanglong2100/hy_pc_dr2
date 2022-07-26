package com.sbwork.dr.publicnoticewebcrawlerguangdong.convert;

import com.sbwork.base.convert.BaseConvert;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.entity.PublicNoticeWebCrawlerGuangDong;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.form.PublicNoticeWebCrawlerGuangDongForm;
import org.springframework.stereotype.Component;

/**
 * 公告资源爬取(广东省政府采购网)entity、form转换类
 */
@Component
public class PublicNoticeWebCrawlerGuangDongConvert extends BaseConvert<PublicNoticeWebCrawlerGuangDong, PublicNoticeWebCrawlerGuangDongForm> {

    @Override
    protected void afterConvertToForm(PublicNoticeWebCrawlerGuangDong entity, PublicNoticeWebCrawlerGuangDongForm form) {

    }

    @Override
    protected void afterConvertToEntity(PublicNoticeWebCrawlerGuangDongForm form, PublicNoticeWebCrawlerGuangDong entity) {

    }
}
