package com.sbwork.dr.proxypool.entity;


import com.sbwork.base.entity.BaseEntity;
import com.sbwork.base.persistence.annotate.Column;
import com.sbwork.base.persistence.annotate.Id;
import com.sbwork.base.persistence.annotate.Table;
import com.sbwork.cache.anno.Cache;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
@Table(comment = "动态ip代理池数据表")
@Cache
public class HttpProxyData extends BaseEntity implements Serializable {

    @Id
    @Column(comment = "记录标识")
    private String id;

    @Column(typePrecis = 10, comment = "失败次数",defaultValue = "0")
    private Integer failedNum ;

    @Column(typePrecis = 10, comment = "取出次数",defaultValue = "0")
    private Integer borrowNum ;

    @Column(typePrecis = 10, comment = "成功次数",defaultValue = "0")
    private Integer succeedNum ;//

    @Column(typePrecis = 32, comment = "ip地址")
    private String   ip;

    @Column(typePrecis = 10, comment = "端口")
    private Integer  port;

    @Column(typePrecis = 10, comment = "使用间隔时间")
    private Integer reuseTimeInterval; //

    @Column(typePrecis = 10, comment = "成功率")
    private Double successRate; // 成功率

}
