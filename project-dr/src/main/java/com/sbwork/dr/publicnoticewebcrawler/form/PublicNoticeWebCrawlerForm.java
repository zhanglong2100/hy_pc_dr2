package com.sbwork.dr.publicnoticewebcrawler.form;

import com.sbwork.base.form.BaseForm;
import java.io.Serializable;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 类名称：PublicNoticeWebCrawler对象
 * 创建人：自动生成
 */
@Getter
@Setter
public class PublicNoticeWebCrawlerForm extends BaseForm implements Serializable{

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
     * 标题
     */
    @ApiModelProperty(value = "标题")
    private String title;

    /**
     * 发布时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
    @ApiModelProperty(value = "发布时间")
    private Date publicTime;

    /**
     * 省份
     */
    @ApiModelProperty(value = "省份")
    private String province;

    /**
     * 招标方式
     */
    @ApiModelProperty(value = "招标方式")
    private String bidType;

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

}
