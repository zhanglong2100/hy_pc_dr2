package com.sbwork.dr.publicnoticedir.searchForm;

import com.sbwork.base.persistence.annotate.DefaultOrder;
import com.sbwork.base.persistence.annotate.Query;
import com.sbwork.base.persistence.query.bean.QueryType;
import com.sbwork.systemConfig.plugin.bean.OrderBy;
import com.sbwork.systemConfig.plugin.bean.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@DefaultOrder(
        type = {OrderBy.OrderByType.ASC,OrderBy.OrderByType.DESC},
        fieldName = {"sortNo","createTime"}
)
public class PublicNoticeDirSearchForm extends Page implements Serializable {


    private String id;

    @ApiModelProperty("父菜单标识")
    @Query(QueryType.equal)
    private String parentId;
    @ApiModelProperty("父菜单路径")
    @Query(QueryType.start)
    private String parentPath;


    /**
     * 项目名称
     */
    @ApiModelProperty(value = "项目名称")
    @Query(value = QueryType.like)
    private String name;

    @ApiModelProperty(value = "项目名称")
    @Query(value = QueryType.equal,fieldName = "name")
    private String nameTemp;

    /**
     * 创建开始时间
     */
    @ApiModelProperty(value = "创建开始时间")
    @Query(value = QueryType.gte,fieldName = "createTime")
    private Date createTimeStart;

    /**
     * 创建结束时间
     */
    @ApiModelProperty(value = "创建结束时间")
    @Query(value = QueryType.lte,fieldName = "createTime")
    private Date createTimeEnd;

}
