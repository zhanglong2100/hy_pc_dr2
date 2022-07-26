package com.sbwork.dr.publicnoticewebcrawler.entity;

import com.sbwork.base.entity.BaseEntity;
import com.sbwork.base.persistence.annotate.Column;
import com.sbwork.base.persistence.annotate.Table;
import com.sbwork.cache.anno.Cache;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class ResultEntity extends BaseEntity implements Serializable {

    private String msg;

    private int total;

    private String code;

    private List<ResultInfoEntity> data;

}
