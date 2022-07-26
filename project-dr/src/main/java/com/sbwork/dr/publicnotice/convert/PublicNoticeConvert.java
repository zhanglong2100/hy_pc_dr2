package com.sbwork.dr.publicnotice.convert;

import com.sbwork.base.convert.BaseConvert;
import com.sbwork.base.convert.IComboBoxConvert;
import com.sbwork.base.convert.IGroupComboBoxConvert;

import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.form.PublicNoticeForm;
import org.springframework.stereotype.Component;

/**
 * 协议类entity、form转换类
 */
@Component
public class PublicNoticeConvert extends BaseConvert<PublicNoticeEntity, PublicNoticeForm>
         {
//
//    @Resource
//    private AbstractFormGenerate abstractFormGenerate;
//
//    @Override
//    public SbDrProtocolForm generateFormPojo(SbDrProtocol entity) {
//        return abstractFormGenerate.getObject(SbDrProtocolForm.class, entity.getProtocolType()+"");
//    }
//
//    @Override
//    protected String getClobField(SbDrProtocol entity) {
//        return entity.getProperties();
//    }
//
//    @Override
//    protected void setClobField(SbDrProtocol entity, String json) {
//        entity.setProperties(json);
//    }


}
