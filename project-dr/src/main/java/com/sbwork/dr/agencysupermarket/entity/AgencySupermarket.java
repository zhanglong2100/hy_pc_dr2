package com.sbwork.dr.agencysupermarket.entity;

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

import java.util.Date;

@Getter
@Setter
@Table(comment = "中介超市")
@Cache
public class AgencySupermarket extends BaseEntity {

    @Id
    @Column(comment = "标识")
    private String id;

    @Excel(name="月份",width = 15)
    @Column(typePrecis = 32, comment = "月份")
    private String  month;

    @Excel(name="序号",width = 15)
    @Column(typePrecis = 10, comment = "序号")
    private Integer  orderNum;

    @Excel(name="地区",width = 20)
    @Column(typePrecis = 128, comment = "地区")
    private String area;

    @Excel(name="项目名称",width = 45,height = 15)
    @Column(typePrecis = 128, comment = "项目名称")
    private String projectName;

    @Excel(name="业主单位",width = 45)
    @Column(typePrecis = 128, comment = "业主单位")
    private String ownerUnit;

    @Excel(name="业务类型",width = 30)
    @Column(typePrecis = 128, comment = "业务类型")
    private String businessType;
    @ColumnIgnore
    private String businessTypeTemp;

    @Excel(name="中介超市",width = 30)
    @Column(typePrecis = 128, comment = "中介超市")
    private String agencySupermarket;

    @Excel(name="金额",width = 30)
    @Column(typePrecis = 128, comment = "金额")
    private String budget;


    @Excel(name="链接",width = 20,isHyperlink = true)
    @Column(typePrecis = 256, comment = "链接")
    private String publicNoticeUrl;


    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm:ss",
            timezone = "GMT+8"
    )
    @Column(jdbcType = JdbcType.TIMESTAMP, comment = "发布时间")
    @Excel(name="发布时间",width = 30,format = "yyyy-MM-dd  HH:mm:ss")
    private Date publicTime;

    @Excel(name="报名截止时间",width = 45)
    @Column(typePrecis = 256, comment = "报名截止时间")
    private String   endTime;

    @Excel(name="选取方式",width = 30)
    @Column(typePrecis = 32, comment = "选取方式")
    private String   chooseType;

    @Excel(name="是否报名",width = 20,replace = {"否_0","是_1","否_null"})
    @Column(typePrecis = 32, comment = "是否报名",defaultValue = "0")
    private String   ifApply;

    @Excel(name="是否中标",width = 20,replace = {"否_0","是_1","否_null"})
    @Column(typePrecis = 32, comment = "是否中标")
    private String   ifBidding;

    @Excel(name="市场人员",width = 30)
    @Column(typePrecis = 64, comment = "市场人员")
    private String   marketPerson;

    @Excel(name="录入人员",width = 30)
    @Column(typePrecis = 64, comment = "录入人员")
    private String   enteringPerson;


    @Excel(name="是否归档",width = 30,replace = {"否_0","是_1","否_null"})
    @Column(typePrecis = 32, comment = "是否归档",defaultValue = "0")
    private String   ifArchive;


    @Excel(name="是否立项",width = 20,replace = {"否_0","是_1","否_null"})
    @Column(typePrecis = 32, comment = "是否立项",defaultValue = "0")
    private String ifProjectApproval;

    @Excel(name="立项编号",width = 30)
    @Column(typePrecis = 128, comment = "立项编号")
    private String projectApprovalCode;


    @Excel(name="备注",width = 45)
    @Column(typePrecis = 256, comment = "备注")
    private String   remark;


    @Excel(name="中介超市公告的创建日期",width = 30)
    @ColumnIgnore
    private String publicNoticeCreateTime;

}
