package com.sbwork.dr.publicnoticewebcrawlerguangdong.form;

import com.sbwork.base.form.BaseForm;
import java.io.Serializable;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 类名称：PublicNoticeWebCrawlerGuangDong对象
 * 创建人：自动生成
 */
@Getter
@Setter
public class PublicNoticeWebCrawlerGuangDongForm extends BaseForm implements Serializable{

    /**
     * 标识
     */
    @ApiModelProperty(value = "标识")
    private String id;

    /**
     * 招标公告链接
     */
    @ApiModelProperty(value = "招标公告链接")
    private String publicNoticeUrl;

    /**
     * 发布网站
     */
    @ApiModelProperty(value = "发布网站")
    private String publicWeb;

    /**
     * 项目编号
     */
    @ApiModelProperty(value = "项目编号")
    private String projectCode;

    /**
     * 项目名称
     */
    @ApiModelProperty(value = "项目名称")
    private String projectName;

    /**
     * 发布时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
    @ApiModelProperty(value = "发布时间")
    private Date publicTime;

    /**
     * 地区
     */
    @ApiModelProperty(value = "地区")
    private String area;

    /**
     * 公告类型
     */
    @ApiModelProperty(value = "公告类型")
    private String publicNoticeType;

    /**
     * 采购方式
     */
    @ApiModelProperty(value = "采购方式")
    private String purchaseType;

    /**
     * 金额
     */
    @ApiModelProperty(value = "金额")
    private String budget;

    /**
     * 提交投标文件截止时间
     */
    @ApiModelProperty(value = "提交投标文件截止时间")
    private String endTime;

    /**
     * 采购人
     */
    @ApiModelProperty(value = "采购人")
    private String purchaseUser;

    /**
     * 采购代理机构
     */
    @ApiModelProperty(value = "采购代理机构")
    private String purchaseOrganization;

    /**
     * 是否已经解析
     */
    @ApiModelProperty(value = "是否已经解析")
    private String ifAnalysis;

    /**
     * 项目经办人
     */
    @ApiModelProperty(value = "项目经办人")
    private String projectManager;

    /**
     * 采购分类
     */
    @ApiModelProperty(value = "采购分类")
    private String purchaseClassify;

    /**
     * 采购联系方式
     */
    @ApiModelProperty(value = "采购联系方式")
    private String purchaseUserContactWay;

}
