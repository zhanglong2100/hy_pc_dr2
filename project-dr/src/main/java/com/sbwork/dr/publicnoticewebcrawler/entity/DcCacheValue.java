package com.sbwork.dr.publicnoticewebcrawler.entity;

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

/**
 * @author sbjw
 */
@Getter
@Setter
@Table(comment = "数据缓存")
@Cache
public class DcCacheValue extends BaseEntity implements Serializable {

//    @Id
//    @Column(comment = "标识")
//    private String id;

    @Id
    @Column(typePrecis = 100, comment = "分类")
    private String dcType;

//    @Id(order = 1)
    @Column(typePrecis = 100, comment = "名称")
    private String dcKey;

    @Column(jdbcType = JdbcType.TIMESTAMP, comment = "请求时间")
    private Date requestTime;
}
