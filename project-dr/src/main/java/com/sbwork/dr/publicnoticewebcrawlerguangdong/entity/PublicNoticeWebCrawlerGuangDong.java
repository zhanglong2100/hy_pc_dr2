package com.sbwork.dr.publicnoticewebcrawlerguangdong.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sbwork.base.entity.BaseEntity;
import com.sbwork.base.persistence.annotate.Column;
import com.sbwork.base.persistence.annotate.Id;
import com.sbwork.base.persistence.annotate.Table;
import com.sbwork.cache.anno.Cache;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.JdbcType;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Getter
@Setter
@Table(comment = "公告资源爬取(广东省政府采购网)")
@Cache
public class PublicNoticeWebCrawlerGuangDong extends BaseEntity implements Serializable {

    @Id
    @Column(comment = "标识")
    private String id;

    @Column(typePrecis = 256, comment = "招标公告链接")
    private String publicNoticeUrl;//pageurl

    @Column(typePrecis = 128, comment = "发布网站")
    private String publicWeb;

    @Column(typePrecis = 64, comment = "项目编号")
    private String projectCode;//openTenderCode

    @Column(typePrecis = 256, comment = "标题")
    private String projectName;//title

    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm:ss",
            timezone = "GMT+8"
    )
    @Column(jdbcType = JdbcType.TIMESTAMP, comment = "发布时间")
    private Date publicTime;//noticeTime


    @Column(typePrecis = 32, comment = "地区")
    private String area;//regionName

    @Column(typePrecis = 32, comment = "公告类型")
    private String publicNoticeType;//noticeType

    @Column(typePrecis = 32, comment = "采购方式")
    private String purchaseType;//purchaseManner

    @Column(typePrecis = 128, comment = "金额")
    private String budget;//budget

    @Column(typePrecis = 256, comment = "提交投标文件截止时间")
    private String   endTime; //openTenderTime

    @Column(typePrecis = 128, comment = "采购人")
    private String purchaseUser;//purchaser

    @Column(typePrecis = 128, comment = "采购代理机构")
    private String purchaseOrganization;//agency

    @Column(typePrecis = 32, comment = "是否已经解析",defaultValue = "0")
    private String ifAnalysis;


    @Column(typePrecis = 128, comment = "项目经办人")
    private String projectManager;//agentManageName

    @Column(typePrecis = 32, comment = "采购分类")
    private String purchaseClassify;//purchaseNature
    @Column(typePrecis = 128, comment = "采购联系方式")
    private String purchaseUserContactWay;//purchaserLinkMan purchaserLinkPhone

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PublicNoticeWebCrawlerGuangDong that = (PublicNoticeWebCrawlerGuangDong) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(publicNoticeUrl, that.publicNoticeUrl) &&
                Objects.equals(publicWeb, that.publicWeb) &&
                Objects.equals(projectCode, that.projectCode) &&
                Objects.equals(projectName, that.projectName) &&
                Objects.equals(publicTime, that.publicTime) &&
                Objects.equals(area, that.area) &&
                Objects.equals(publicNoticeType, that.publicNoticeType) &&
                Objects.equals(purchaseType, that.purchaseType) &&
                Objects.equals(budget, that.budget) &&
                Objects.equals(endTime, that.endTime) &&
                Objects.equals(purchaseUser, that.purchaseUser) &&
                Objects.equals(purchaseOrganization, that.purchaseOrganization) &&
                Objects.equals(ifAnalysis, that.ifAnalysis) &&
                Objects.equals(projectManager, that.projectManager) &&
                Objects.equals(purchaseClassify, that.purchaseClassify) &&
                Objects.equals(purchaseUserContactWay, that.purchaseUserContactWay);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, publicNoticeUrl, publicWeb, projectCode, projectName, publicTime, area, publicNoticeType, purchaseType, budget, endTime, purchaseUser, purchaseOrganization, ifAnalysis, projectManager, purchaseClassify, purchaseUserContactWay);
    }
}
