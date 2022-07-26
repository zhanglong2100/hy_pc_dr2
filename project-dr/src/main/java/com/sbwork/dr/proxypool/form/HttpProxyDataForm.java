package com.sbwork.dr.proxypool.form;

import com.sbwork.base.form.BaseForm;
import java.io.Serializable;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 类名称：HttpProxyData对象
 * 创建人：自动生成
 */
@Getter
@Setter
public class HttpProxyDataForm extends BaseForm implements Serializable{

    /**
     * 记录标识
     */
    @ApiModelProperty(value = "记录标识")
    private String id;

    /**
     * 失败次数
     */
    @ApiModelProperty(value = "失败次数")
    private Integer failedNum;

    /**
     * 取出次数
     */
    @ApiModelProperty(value = "取出次数")
    private Integer borrowNum;

    /**
     * 成功次数
     */
    @ApiModelProperty(value = "成功次数")
    private Integer succeedNum;

    /**
     * ip地址
     */
    @ApiModelProperty(value = "ip地址")
    private String ip;

    /**
     * 端口
     */
    @ApiModelProperty(value = "端口")
    private Integer port;

    /**
     * 使用间隔时间
     */
    @ApiModelProperty(value = "使用间隔时间")
    private Integer reuseTimeInterval;

    /**
     * 成功率
     */
    @ApiModelProperty(value = "成功率")
    private Double successRate;

}
