package com.sbwork.dr.publicnoticedir.form;

import com.sbwork.base.form.BaseForm;
import com.sbwork.dr.publicnoticedir.entity.type.PublicNoticeDirType;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
public class PublicNoticeDirForm extends BaseForm implements Serializable {


    private String id;

    private String  name;

    private String code;

    private PublicNoticeDirType  type;

    private int   sortNo;

    private String parentId;

    private String parentPath;


    private String pathUrl;



}
