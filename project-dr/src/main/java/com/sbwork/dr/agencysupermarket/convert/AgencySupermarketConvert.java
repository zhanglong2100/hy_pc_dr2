package com.sbwork.dr.agencysupermarket.convert;

import com.sbwork.base.convert.BaseConvert;
import com.sbwork.dr.agencysupermarket.entity.AgencySupermarket;
import com.sbwork.dr.agencysupermarket.form.AgencySupermarketForm;
import com.sbwork.sys.form.SysCodeForm;
import com.sbwork.sys.service.SysCodeService;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * 中介超市entity、form转换类
 */
@Component
public class AgencySupermarketConvert extends BaseConvert<AgencySupermarket, AgencySupermarketForm> {


    @Override
    protected void afterConvertToForm(AgencySupermarket entity, AgencySupermarketForm form) {

    }


    @Override
    protected void afterConvertToEntity(AgencySupermarketForm form, AgencySupermarket entity) {

    }
}
