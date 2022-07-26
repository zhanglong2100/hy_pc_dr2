package com.sbwork.dr.publicnoticewebcrawler.searchForm;

import com.sbwork.base.persistence.annotate.Query;
import com.sbwork.base.persistence.query.bean.QueryType;
import com.sbwork.systemConfig.plugin.bean.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * 网络爬虫请求记录搜索类
 */
@Getter
@Setter
public class RequestRecordWebCrawlerSearchForm extends Page implements Serializable {

    @ApiModelProperty(value = "发布网站")
    @Query(value = QueryType.equal)
    private String publicWeb;

    @ApiModelProperty(value = "请求日期")
    @Query(value = QueryType.equal)
    private String requestDate;

    @ApiModelProperty(value = "请求url")
    @Query(value = QueryType.equal)
    private String requestUrl;
}
