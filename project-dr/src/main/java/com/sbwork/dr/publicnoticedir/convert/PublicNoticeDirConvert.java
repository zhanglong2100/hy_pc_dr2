package com.sbwork.dr.publicnoticedir.convert;

import com.sbwork.base.convert.BaseConvert;
import com.sbwork.base.convert.ContainsClobFieldConvert;
import com.sbwork.base.convert.INzTreeNodeConvert;
import com.sbwork.base.form.NzTreeNode;
import com.sbwork.dr.publicnoticedir.entity.PublicNoticeDirEntity;
import com.sbwork.dr.publicnoticedir.entity.type.PublicNoticeDirType;
import com.sbwork.dr.publicnoticedir.form.PublicNoticeDirForm;
import com.sbwork.dr.publicnoticedownload.entity.PublicNoticeDownloadEntity;
import com.sbwork.dr.publicnoticedownload.form.PublicNoticeDownloadForm;
import com.sbwork.rm.entity.RmMenu;
import com.sbwork.rm.form.menu.AbstractRmMenuForm;
import com.sbwork.systemConfig.argumentResolver.AbstractFormGenerate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * 协议类entity、form转换类
 */
@Component
public class PublicNoticeDirConvert extends ContainsClobFieldConvert<PublicNoticeDirEntity, PublicNoticeDirForm> implements INzTreeNodeConvert<PublicNoticeDirForm> {

             @Resource
             private AbstractFormGenerate abstractFormGenerate;

             public PublicNoticeDirConvert() {
             }

             public void _afterConvertToNzTreeNode( PublicNoticeDirForm form, NzTreeNode nzTreeNode) {
                 nzTreeNode.setTitle(form.getName());
                 nzTreeNode.setKey(form.getId());
                 nzTreeNode.setType(form.getType().toString());
                 if (form.getType() == PublicNoticeDirType.FILE) {
                     nzTreeNode.setNoChildren();
                 } else {
                     nzTreeNode.setSelectable(false);
                 }

             }

             protected String getClobField( PublicNoticeDirEntity entity) {
                 return entity.getProperties();
             }

             protected void setClobField( PublicNoticeDirEntity entity, String json) {
                 entity.setProperties(json);
             }

             public  PublicNoticeDirForm generateFormPojo( PublicNoticeDirEntity entity) {
                 return ( PublicNoticeDirForm)this.abstractFormGenerate.getObject( PublicNoticeDirForm.class, entity.getType().toString());
             }


}
