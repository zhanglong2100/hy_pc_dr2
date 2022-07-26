package com.sbwork.dr.publicnoticewebcrawler.searchForm;

import com.sbwork.base.persistence.annotate.Query;
import com.sbwork.base.persistence.query.bean.QueryType;
import com.sbwork.systemConfig.plugin.bean.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据缓存搜索类
 */
@Getter
@Setter
public class DcCacheValueSearchForm extends Page implements Serializable {
}
