package com.sbwork.dr.agencysupermarket.form;

import com.sbwork.base.form.BaseForm;
import java.io.Serializable;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 类名称：AgencySupermarket对象
 * 创建人：自动生成
 */
@Getter
@Setter
public class AgencySupermarketForm extends BaseForm implements Serializable{

    /**
     * 标识
     */
    @ApiModelProperty(value = "标识")
    private String id;

    /**
     * 月份
     */
    @ApiModelProperty(value = "月份")
    private String month;

    /**
     * 序号
     */
    @ApiModelProperty(value = "序号")
    private Integer orderNum;

    /**
     * 业务类型
     */
    @ApiModelProperty(value = "业务类型")
    private String businessType;
    private String businessTypeTemp;

    /**
     * 地区
     */
    @ApiModelProperty(value = "地区")
    private String area;

    /**
     * 是否立项
     */
    @ApiModelProperty(value = "是否立项")
    private String ifProjectApproval;

    /**
     * 立项编号
     */
    @ApiModelProperty(value = "立项编号")
    private String projectApprovalCode;

    /**
     * 项目名称
     */
    @ApiModelProperty(value = "项目名称")
    private String projectName;

    /**
     * 业主单位
     */
    @ApiModelProperty(value = "业主单位")
    private String ownerUnit;

    /**
     * 中介超市
     */
    @ApiModelProperty(value = "中介超市")
    private String agencySupermarket;

    /**
     * 金额
     */
    @ApiModelProperty(value = "金额")
    private String budget;

    /**
     * 链接
     */
    @ApiModelProperty(value = "链接")
    private String publicNoticeUrl;

    /**
     * 发布日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
    @ApiModelProperty(value = "发布日期")
    private Date publicTime;

    /**
     * 报名截止时间
     */
    @ApiModelProperty(value = "报名截止时间")
    private String endTime;

    /**
     * 选取方式
     */
    @ApiModelProperty(value = "选取方式")
    private String chooseType;

    /**
     * 是否报名
     */
    @ApiModelProperty(value = "是否报名")
    private String ifApply;

    /**
     * 是否中标
     */
    @ApiModelProperty(value = "是否中标")
    private String ifBidding;

    /**
     * 市场人员
     */
    @ApiModelProperty(value = "市场人员")
    private String marketPerson;

    /**
     * 录入人员
     */
    @ApiModelProperty(value = "录入人员")
    private String enteringPerson;

    /**
     * 中标通知书是否归档
     */
    @ApiModelProperty(value = "中标通知书是否归档")
    private String ifArchive;

    /**
     * 备注
     */
    @ApiModelProperty(value = "备注")
    private String remark;

}
