package com.sbwork.dr.publicnoticedownload.entity;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.sbwork.base.entity.BaseEntity;
import com.sbwork.base.persistence.annotate.Column;
import com.sbwork.base.persistence.annotate.Id;
import com.sbwork.base.persistence.annotate.Table;
import com.sbwork.cache.anno.Cache;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Table(comment = "公告下载表")
@Cache
public class PublicNoticeDownloadEntity extends BaseEntity implements Serializable {


    @Id
    @Column(comment = "记录标识")
    private String id;

    @Column(typePrecis = 128, comment = "名称")
    private String  name;

    @Column(typePrecis = 128, comment = "路径")
    private String  pathUrl;

}
