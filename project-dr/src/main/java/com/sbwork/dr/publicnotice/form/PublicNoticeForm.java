package com.sbwork.dr.publicnotice.form;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.sbwork.base.form.BaseForm;
import com.sbwork.base.persistence.annotate.Column;
import com.sbwork.base.persistence.annotate.Id;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.JdbcType;

import java.io.Serializable;
import java.util.Date;


@Getter
@Setter
public class PublicNoticeForm extends BaseForm implements Serializable {


    private String id;

    @Excel(name="月份",width = 15)
    private String  month;

    @Excel(name="序号",width = 15)
    private Integer  orderNum;


//    @JsonFormat(
//            pattern = "yyyy-MM-dd HH:mm:ss",
//            timezone = "GMT+8"
//    )
    private String publicTime;
    @Excel(name="发布时间",width = 30)
    private String publicTimeExcel;

    @Excel(name="发布网站",width = 30)
    private String publicWeb;

    @Excel(name="省份",width = 15)
    private String province;

    @Excel(name="地级市",width = 15)
    private String city;

    @Excel(name="县/区",width = 15)
    private String county;

    @Excel(name="项目编号",width = 15)
    private String projectCode;

    @Excel(name="项目名称",width = 45)
    private String projectName;

    @Excel(name="招标公告链接",width = 45)
    private String publicNoticeUrl;

    @Excel(name="采购方式",width = 15)
    private String purchaseType;

    @Excel(name="预算金额",width = 30)
    private String budget;

    @Excel(name="公告类型",width = 15)
    private String publicNoticeType;

    @Excel(name="业务类型",width = 15)
    private String businessType;

    @Excel(name="项目类型",width = 15)
    private String projectType;

    @Excel(name="获取招标文件时间",width = 45)
    private String   biddingTime;


    @Excel(name="提交投标文件截止时间",width = 30)
    private String   endTime;

    @Excel(name="采购人信息名称",width = 30)
    private String purchaseUser;

    @Excel(name="采购联系方式",width = 15)
    private String purchaseUserContactWay;

    @Excel(name="代理机构/采购代理机构信息名称",width = 30)
    private String purchaseOrganization;

    @Excel(name="采购机构联系方式",width = 15)
    private String purchaseOrganizationContactWay;

    @Excel(name="项目负责人",width = 15)
    private String projectLeader;

    @Excel(name="项目经办人",width = 15)
    private String projectManager;

    @Excel(name="项目联系人",width = 15)
    private String projectContact;

    @Excel(name="项目联系人电话",width = 15)
    private String projectContactNumber;

    @Excel(name="中标单位",width = 15)
    private String winningUnit;

    @Excel(name="中标金额",width = 15)
    private String bidPrice;

    @Excel(name="评审专家",width = 15)
    private String reviewExperts;

    @Excel(name="中标公告链接",width = 15)
    private String bidUrl;


    @Excel(name="是否中标",width = 15)
    private String bidIf;
}
