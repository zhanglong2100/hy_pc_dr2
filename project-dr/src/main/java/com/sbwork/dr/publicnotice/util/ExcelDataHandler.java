package com.sbwork.dr.publicnotice.util;


import cn.afterturn.easypoi.handler.impl.ExcelDataHandlerDefaultImpl;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import org.apache.poi.common.usermodel.HyperlinkType;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Hyperlink;


public class ExcelDataHandler extends ExcelDataHandlerDefaultImpl<PublicNoticeEntity> {

    /**
     * 导出时   设置招标链接的跳转地址
     */
    @Override
    public Hyperlink getHyperlink(CreationHelper creationHelper, PublicNoticeEntity obj, String name, Object value) {
        Hyperlink hyperlink = creationHelper.createHyperlink(HyperlinkType.URL);
        hyperlink.setLabel(name);
        hyperlink.setAddress((String) value);
        return hyperlink;
    }
}
