package com.sbwork.dr.proxypool.searchForm;

import com.sbwork.base.persistence.annotate.Query;
import com.sbwork.base.persistence.query.bean.QueryType;
import com.sbwork.systemConfig.plugin.bean.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * 动态ip代理池数据表搜索类
 */
@Getter
@Setter
public class HttpProxyDataSearchForm extends Page implements Serializable {
}
