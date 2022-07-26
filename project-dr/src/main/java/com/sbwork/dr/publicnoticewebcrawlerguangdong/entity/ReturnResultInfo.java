package com.sbwork.dr.publicnoticewebcrawlerguangdong.entity;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnResultInfo {

    private String  agency; // 代理机构
    private String  agentManageName; // 项目经办人
    private String  budget;  // 金额
    private String  noticeTime;  // 发布时间
    private String  noticeType;   // 公告类型
    private String  openTenderCode; // 项目编号
    private String  openTenderTime; // 提交投标文件截止时间
    private String  pageurl;         //  访问地址
    private String  purchaseManner; //  采购方式
    private String  purchaseNature; // 采购分类
    private String  purchaser;       // 采购人
    private String  regionName;     // 地区
    private String  title;           // 标题
    private String  purchaserLinkMan; // 采购联系人
    private String  purchaserLinkPhone; // 采购联系电话

}
