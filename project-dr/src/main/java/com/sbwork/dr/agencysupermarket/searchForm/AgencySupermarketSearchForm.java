package com.sbwork.dr.agencysupermarket.searchForm;

import com.sbwork.base.persistence.annotate.Query;
import com.sbwork.base.persistence.query.bean.QueryType;
import com.sbwork.systemConfig.plugin.bean.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * 中介超市搜索类
 */
@Getter
@Setter
public class AgencySupermarketSearchForm extends Page implements Serializable {

    /**
     * 序号
     */
    @ApiModelProperty(value = "序号")
    @Query(value = QueryType.gte)
    private Integer orderNum;

    /**
    * 项目类型
    */
    @ApiModelProperty(value = "业务类型")
    @Query(value = QueryType.equal)
    private String businessType;

    /**
    * 地区
    */
    @ApiModelProperty(value = "地区")
    @Query(value = QueryType.like)
    private String area;

    /**
    * 是否立项
    */
    @ApiModelProperty(value = "是否立项")
    @Query(value = QueryType.equal)
    private String ifProjectApproval;

    /**
    * 立项编号
    */
    @ApiModelProperty(value = "立项编号")
    @Query(value = QueryType.like)
    private String projectApprovalCode;
    @Query(value = QueryType.equal,fieldName = "projectApprovalCode")
    private String projectApprovalCodeTemp;

    /**
    * 项目名称
    */
    @ApiModelProperty(value = "项目名称")
    @Query(value = QueryType.like)
    private String projectName;
    @Query(value = QueryType.equal,fieldName = "projectName")
    private String projectNameTemp;

    /**
    * 业主单位
    */
    @ApiModelProperty(value = "业主单位")
    @Query(value = QueryType.like)
    private String ownerUnit;

    /**
    * 中介超市
    */
    @ApiModelProperty(value = "中介超市")
    @Query(value = QueryType.like)
    private String agencySupermarket;

    /**
    * 发布日期
    */
    @ApiModelProperty(value = "发布日期(大于等于)")
    @Query(value = QueryType.gte, fieldName = "publicTime")
    private Date publicTimeStart;

    @ApiModelProperty(value = "发布日期(小于等于)")
    @Query(value = QueryType.lte, fieldName = "publicTime")
    private Date publicTimeEnd;

    @ApiModelProperty(value = "发布日期(大于)")
    @Query(value = QueryType.gt, fieldName = "publicTime")
    private Date publicTime;


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
    * 选取方式
    */
    @ApiModelProperty(value = "选取方式")
    @Query(value = QueryType.like)
    private String chooseType;

    /**
    * 是否报名
    */
    @ApiModelProperty(value = "是否报名")
    @Query(value = QueryType.equal)
    private String ifApply;

    /**
    * 是否中标
    */
    @ApiModelProperty(value = "是否中标")
    @Query(value = QueryType.equal)
    private String ifBidding;

    /**
    * 市场人员
    */
    @ApiModelProperty(value = "市场人员")
    @Query(value = QueryType.like)
    private String marketPerson;

    /**
    * 录入人员
    */
    @ApiModelProperty(value = "录入人员")
    @Query(value = QueryType.like)
    private String enteringPerson;

    /**
    * 中标通知书是否归档
    */
    @ApiModelProperty(value = "中标通知书是否归档")
    @Query(value = QueryType.equal)
    private String ifArchive;

}
