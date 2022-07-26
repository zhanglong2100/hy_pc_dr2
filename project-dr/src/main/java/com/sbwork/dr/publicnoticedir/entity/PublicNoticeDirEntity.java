package com.sbwork.dr.publicnoticedir.entity;

import com.sbwork.base.entity.BaseEntity;
import com.sbwork.base.persistence.annotate.Column;
import com.sbwork.base.persistence.annotate.Id;
import com.sbwork.base.persistence.annotate.Table;
import com.sbwork.cache.CacheType;
import com.sbwork.cache.anno.Cache;
import com.sbwork.dr.publicnoticedir.entity.type.PublicNoticeDirType;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.JdbcType;

import java.io.Serializable;

@Getter
@Setter
@Table(comment = "公告目录表")
@Cache(
        type = CacheType.CACHE_ALL
)
public class PublicNoticeDirEntity extends BaseEntity implements Serializable {


    @Id
    @Column(comment = "记录标识")
    private String id;

    @Column(typePrecis = 128, comment = "名称")
    private String  name;

    @Column(typePrecis = 128, comment = "编号")
    private String code;

    @Column(typePrecis = 32, comment = "类型")
    private PublicNoticeDirType type;

    @Column(jdbcType = JdbcType.INTEGER, comment = "序号")
    private int   sortNo;

    @Column(typePrecis = 128, comment = "序号")
    private String parentId;

    private String parentPath;

    @Column(typePrecis = 128, comment = "文件路径")
    private String  pathUrl;

    @Column(
            jdbcType = JdbcType.CLOB,
            comment = "其他属性"
    )
    private String properties;

}
