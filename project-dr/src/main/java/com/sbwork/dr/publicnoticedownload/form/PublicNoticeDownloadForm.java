package com.sbwork.dr.publicnoticedownload.form;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.sbwork.base.form.BaseForm;
import com.sbwork.base.persistence.annotate.Column;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
public class PublicNoticeDownloadForm extends BaseForm implements Serializable {


    private String id;

    private String  name;

    private String  pathUrl;

}
