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
 * 公告资源爬取搜索类
 */
@Getter
@Setter
public class PublicNoticeWebCrawlerSearchForm extends Page implements Serializable {

    /**
     * 发布开始时间
     */
    @ApiModelProperty(value = "发布开始时间")
    @Query(value = QueryType.gte,fieldName = "publicTime")
    private Date publicTimeStart;

    /**
     * 发布结束时间
     */
    @ApiModelProperty(value = "发布结束时间")
    @Query(value = QueryType.lte,fieldName = "publicTime")
    private Date publicTimeEnd;

    @ApiModelProperty(value = "发布网站")
    @Query(value = QueryType.like)
    private String publicWeb;

    @ApiModelProperty(value = "标题")
    @Query(value = QueryType.like)
    private String title;

    @ApiModelProperty(value = "省份")
    @Query(value = QueryType.like)
    private String province;

    @ApiModelProperty(value = "招标方式")
    @Query(value = QueryType.like)
    private String bidType;

    @ApiModelProperty(value = "是否已经解析")
    @Query(value = QueryType.equal)
    private String ifAnalysis;
}
