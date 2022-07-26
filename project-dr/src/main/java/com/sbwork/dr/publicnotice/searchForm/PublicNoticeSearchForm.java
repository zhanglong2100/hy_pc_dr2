package com.sbwork.dr.publicnotice.searchForm;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.sbwork.base.persistence.annotate.Id;
import com.sbwork.base.persistence.annotate.Query;
import com.sbwork.base.persistence.query.bean.QueryType;
import com.sbwork.systemConfig.plugin.bean.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
public class PublicNoticeSearchForm extends Page implements Serializable {


    private String id;

    private String  month;

    private Integer  orderNum;

    private Date publicTime;

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


    /**
     * 创建开始时间
     */
    @ApiModelProperty(value = "创建开始时间")
    @Query(value = QueryType.gte,fieldName = "createTime")
    private Date createTimeStart;

    /**
     * 创建结束时间
     */
    @ApiModelProperty(value = "创建结束时间")
    @Query(value = QueryType.lte,fieldName = "createTime")
    private Date createTimeEnd;


    /**
     * 创建用户
     */
    @ApiModelProperty(value = "创建用户")
    @Query(value = QueryType.equal)
    private String createUserName;

    /**
     * 发布网站
     */
    @ApiModelProperty(value = "发布网站")
    @Query(value = QueryType.like)
    private String publicWeb;

    /**
     * 省份
     */
    @ApiModelProperty(value = "省份")
    @Query(value = QueryType.like)
    private String province;

    private String city;

    private String county;

    /**
     * 项目编号
     */
    @ApiModelProperty(value = "项目编号")
    @Query(QueryType.equal)
    private String projectCode;

    /**
     * 项目名称
     */
    @ApiModelProperty(value = "项目名称")
    @Query(value = QueryType.like)
    private String projectName;

    /**
     * 项目名称
     */
    @ApiModelProperty(value = "项目名称")
    @Query(value = QueryType.equal,fieldName = "projectName")
    private String projectNameTemp;

    /**
     * 得分情况
     */
    @ApiModelProperty(value = "得分情况")
    @Query(QueryType.like)
    private String score;

    /**
     * 业务类型
     */
    @ApiModelProperty(value = "业务类型")
    @Query(value = QueryType.like)
    private String businessType;

    /**
     * 项目类型
     */
    @ApiModelProperty(value = "项目类型")
    @Query(value = QueryType.like)
    private String projectType;

    private String publicNoticeUrl;

    /**
     * 采购方式
     */
    @ApiModelProperty(value = "采购方式")
    @Query(value = QueryType.like)
    private String purchaseType;

    private String budget;

    /**
     * 公告类型
     */
    @ApiModelProperty(value = "公告类型")
    @Query(value = QueryType.like)
    private String publicNoticeType;
    @Query(value = QueryType.equal,fieldName = "publicNoticeType")
    private String publicNoticeTypeTemp;

    @ApiModelProperty(value = "是否中标")
    @Query(value = QueryType.equal)
    private String bidIf;


    private String   biddingTime;

    private String   endTime;

    private String purchaseUser;

    private String purchaseOrganization;

    private String projectLeader;

    private String projectManager;

    private String projectContact;

    private String projectContactNumber;

    private String winningUnit;

    private String bidPrice;

    private String reviewExperts;


}
