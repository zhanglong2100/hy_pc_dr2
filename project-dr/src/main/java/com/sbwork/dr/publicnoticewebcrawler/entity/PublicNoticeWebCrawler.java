package com.sbwork.dr.publicnoticewebcrawler.entity;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.sbwork.base.entity.BaseEntity;
import com.sbwork.base.persistence.annotate.Column;
import com.sbwork.base.persistence.annotate.ColumnIgnore;
import com.sbwork.base.persistence.annotate.Id;
import com.sbwork.base.persistence.annotate.Table;
import com.sbwork.cache.anno.Cache;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.JdbcType;
import org.apache.xmlbeans.impl.xb.xsdschema.Public;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Getter
@Setter
@Table(comment = "公告资源爬取(中国政府采购网)")
@Cache
public class PublicNoticeWebCrawler extends BaseEntity implements Serializable {

    @Id
    @Column(comment = "标识")
    private String id;

    @Column(typePrecis = 256, comment = "招标公告链接")
    private String publicNoticeUrl;

    @Column(typePrecis = 128, comment = "发布网站")
    private String publicWeb;

    @Column(typePrecis = 256, comment = "标题")
    private String title;

    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm:ss",
            timezone = "GMT+8"
    )
    @Column(jdbcType = JdbcType.TIMESTAMP, comment = "发布时间")
    private Date publicTime;


    @Column(typePrecis = 32, comment = "省份")
    private String province;

    @Column(typePrecis = 32, comment = "招标方式")
    private String bidType;


    @Column(typePrecis = 128, comment = "采购人")
    private String purchaseUser;

    @Column(typePrecis = 128, comment = "采购代理机构")
    private String purchaseOrganization;

    @Column(typePrecis = 32, comment = "是否已经解析",defaultValue = "0")
    private String ifAnalysis;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PublicNoticeWebCrawler crawler = (PublicNoticeWebCrawler) o;
        return Objects.equals(id, crawler.id) &&
                Objects.equals(publicNoticeUrl, crawler.publicNoticeUrl) &&
                Objects.equals(publicWeb, crawler.publicWeb) &&
                Objects.equals(title, crawler.title) &&
                Objects.equals(publicTime, crawler.publicTime) &&
                Objects.equals(province, crawler.province) &&
                Objects.equals(bidType, crawler.bidType) &&
                Objects.equals(purchaseUser, crawler.purchaseUser) &&
                Objects.equals(purchaseOrganization, crawler.purchaseOrganization) &&
                Objects.equals(ifAnalysis, crawler.ifAnalysis);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, publicNoticeUrl, publicWeb, title, publicTime, province, bidType, purchaseUser, purchaseOrganization, ifAnalysis);
    }
}
