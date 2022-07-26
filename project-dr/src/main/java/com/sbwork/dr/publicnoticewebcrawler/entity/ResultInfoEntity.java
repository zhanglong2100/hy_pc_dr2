package com.sbwork.dr.publicnoticewebcrawler.entity;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultInfoEntity  {

    /**
     * 公告发布时间
     */
    private  String noticeTime;

    /**
     *公告链接
     */
    private  String pageurl;

    /**
     *项目名称
     */
    private  String title;

    /**
     *项目编号
     */
    private  String openTenderCode;

    /**
     * 采购方式
     */
    private  String purchaseManner;

    /**
     * 采购分类
     */
    private  String purchaseNature;

    /**
     *预算金额
     */
    private  String budget;

    /**
     *公告类型
     */
    private  String noticeType;


    /**
     * 地区
     */
    private  String regionName;

    /**
     * 地区编号
     */
    private  String regionCode;


    /**
     *提交结束时间
     */
    private  String openTenderTime;

    /**
     *采购人
     */
    private  String purchaser;

    /**
     *采购联系人
     */
    private  String purchaserLinkMan;

    /**
     *采购人联系电话
     */
    private  String purchaserLinkPhone;

    /**
     *代理机构
     */
    private  String agency;

    /**
     *代理机构联系人
     */
    private  String agentManageName;

    /**
     *代理机构联系人电话
     */
    private  String agentLinkPhone;

    /**
     *代理机构联系人电话
     */
    private  String agentLinkMan;



    /**
     * 采购品目
     */
    private  String catalogueNameList;

    /**
     * 采购计划编号
     */
    private  String planCodes;



    /**
     *采购人地址
     */
    private  String purchaserAddr;


    /**
     *公告内容
     */
    private  String content;

    /**
     *
     */
    private  String addtimeStr;

}
