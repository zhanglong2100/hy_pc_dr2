package com.sbwork.dr.publicnoticewebcrawlerguangdong.searchForm;

import com.sbwork.base.persistence.annotate.Query;
import com.sbwork.base.persistence.query.bean.QueryType;
import com.sbwork.systemConfig.plugin.bean.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * 公告资源爬取(广东省政府采购网)搜索类
 */
@Getter
@Setter
public class PublicNoticeWebCrawlerGuangDongSearchForm extends Page implements Serializable {

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
    private String projectName;

    @ApiModelProperty(value = "项目编号")
    @Query(value = QueryType.like)
    private String projectCode;

    @ApiModelProperty(value = "地区")
    @Query(value = QueryType.like)
    private String area;

    @ApiModelProperty(value = "公告类型")
    @Query(value = QueryType.equal)
    private String publicNoticeType;

    @ApiModelProperty(value = "采购方式")
    @Query(value = QueryType.equal)
    private String purchaseType;

    @ApiModelProperty(value = "采购分类")
    @Query(value = QueryType.equal)
    private String purchaseClassify;

    @ApiModelProperty(value = "是否已经解析")
    @Query(value = QueryType.equal)
    private String ifAnalysis;
}
