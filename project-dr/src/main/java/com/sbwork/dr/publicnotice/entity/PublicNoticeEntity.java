package com.sbwork.dr.publicnotice.entity;


import cn.afterturn.easypoi.excel.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sbwork.base.entity.BaseEntity;
import com.sbwork.base.persistence.annotate.*;
import com.sbwork.cache.CacheType;
import com.sbwork.cache.anno.Cache;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.JdbcType;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@Table(comment = "公告记录表")
@Cache
public class PublicNoticeEntity extends BaseEntity implements Serializable {

    @Id
    @Column(comment = "记录标识")
    private String id;

    @Excel(name="月份",width = 15)
    @Column(typePrecis = 32, comment = "月份")
    private String  month;

    @Excel(name="序号",width = 15)
    @ColumnIgnore
    private Integer  orderNum;


    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm:ss",
            timezone = "GMT+8"
    )
    @Column(jdbcType = JdbcType.TIMESTAMP, comment = "发布时间")
    @Excel(name="发布时间",width = 30,format = "yyyy-MM-dd")
    private Date publicTime;
//    @Excel(name="发布时间",width = 30)
//    @Column(typePrecis = 32, comment = "发布时间Excel")
//    private String publicTimeExcel;

    @Excel(name="发布网站",width = 30)
    @Column(typePrecis = 128, comment = "发布网站")
    private String publicWeb;

    @Excel(name="省份",width = 15)
    @Column(typePrecis = 32, comment = "省份")
    private String province;

    @Excel(name="地级市",width = 15)
    @Column(typePrecis = 32, comment = "地级市")
    private String city;

//    @Excel(name="县/区",width = 15)
    @Column(typePrecis = 64, comment = "县区")
    private String county;

    @Excel(name="项目编号",width = 30)
    @Column(typePrecis = 32, comment = "项目编号")
    private String projectCode;

    @Excel(name="项目名称",width = 45)
    @Column(typePrecis = 128, comment = "项目名称")
    private String projectName;

    @Excel(name="招标公告链接",width = 20,isHyperlink = true)
    @Column(typePrecis = 256, comment = "招标公告链接")
    private String publicNoticeUrl;
//    @Excel(name="招标公告链接",width = 45,isHyperlink = true)
//    private String publicNoticeUrlExcel;

    @Excel(name="采购方式",width = 15)
    @Column(typePrecis = 32, comment = "采购方式")
    private String purchaseType;

    @Excel(name="预算金额",width = 30)
    @Column(typePrecis = 32, comment = "预算金额")
    private String budget;

    @Excel(name="公告类型",width = 15)
    @Column(typePrecis = 32, comment = "公告类型")
    private String publicNoticeType;

    @Excel(name="业务类型",width = 30)
    @Column(typePrecis = 128, comment = "业务类型")
    private String businessType;

    @ColumnIgnore
    @JsonIgnore
    private String businessTypeTemp; //临时字段

//    @Excel(name="项目类型",width = 15)
//    @Column(typePrecis = 32, comment = "项目类型")
//    private String projectType;

    @Excel(name="得分情况",width = 15)
    @Column(typePrecis = 256, comment = "得分情况")
    private String score;

    @Excel(name="获取招标文件时间",width = 45)
    @Column(typePrecis = 256, comment = "获取招标文件时间")
    private String   biddingTime;


    @Excel(name="提交投标文件截止时间",width = 30)
    @Column(typePrecis = 256, comment = "提交投标文件截止时间")
    private String   endTime;

    @Excel(name="采购人信息名称",width = 30)
    @Column(typePrecis = 128, comment = "采购人信息名称")
    private String purchaseUser;

    @Excel(name="采购联系方式",width = 20)
    @Column(typePrecis = 128, comment = "采购联系方式")
    private String purchaseUserContactWay;

//    @Excel(name="采购联系人",width = 15)
//    @Column(typePrecis = 128, comment = "采购联系人")
//    private String purchaseUserContact;
//
//    @Excel(name="采购联系人电话",width = 15)
//    @Column(typePrecis = 32, comment = "采购联系人电话")
//    private String purchaseUserContactNumber;


    @Excel(name="代理机构/采购代理机构信息名称",width = 30)
    @Column(typePrecis = 128, comment = "采购代理机构信息名称")
    private String purchaseOrganization;

    @Excel(name="采购机构联系方式",width = 20)
    @Column(typePrecis = 128, comment = "采购机构联系方式")
    private String purchaseOrganizationContactWay;

//    @Excel(name="采购机构联系人",width = 15)
//    @Column(typePrecis = 128, comment = "采购机构联系人")
//    private String purchaseOrganizationContact;
//
//    @Excel(name="采购机构联系人电话",width = 15)
//    @Column(typePrecis = 32, comment = "采购机构联系人电话")
//    private String purchaseOrganizationContactNumber;

    @Excel(name="项目负责人",width = 15)
    @Column(typePrecis = 128, comment = "项目负责人")
    private String projectLeader;

    @Excel(name="项目经办人",width = 15)
    @Column(typePrecis = 128, comment = "项目经办人")
    private String projectManager;

    @Excel(name="项目联系人",width = 20)
    @Column(typePrecis = 128, comment = "项目联系人")
    private String projectContact;

    @Excel(name="项目联系人电话",width = 20)
    @Column(typePrecis = 128, comment = "项目联系人电话")
    private String projectContactNumber;

    @Excel(name="中标单位",width = 45)
    @Column(typePrecis = 512, comment = "中标单位")
    private String winningUnit;

    @Excel(name="中标金额",width = 30)
    @Column(typePrecis = 512, comment = "中标金额")
    private String bidPrice;

    @Excel(name="评审专家",width = 30,height = 20)
    @Column(typePrecis = 128, comment = "评审专家")
    private String reviewExperts;

    @Excel(name="中标公告链接",width = 20,isHyperlink = true)
    @Column(typePrecis = 128, comment = "中标公告链接")
    private String bidUrl;

    @Column(typePrecis = 32, comment = "是否中标")
    private String bidIf;


//    @JsonFormat(
//            pattern = "yyyy-MM-dd HH:mm:ss",
//            timezone = "GMT+8"
//    )
//    @Excel(name="招标公告的创建日期",width = 30)
//    @Column(jdbcType = JdbcType.TIMESTAMP, comment = "招标公告的创建时间")
    @Excel(name="招标公告的创建日期",width = 15)
    @ColumnIgnore
    private String publicNoticeCreateTime;



}
