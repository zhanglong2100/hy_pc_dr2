package com.sbwork.dr.agencysupermarket.persistence;

import com.sbwork.base.persistence.BaseMapper;
import com.sbwork.dr.agencysupermarket.entity.AgencySupermarket;
import com.sbwork.dr.agencysupermarket.searchForm.AgencySupermarketSearchForm;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 中介超市mapper（基础的增、删、改、查）
 */
@Repository
@Mapper
public interface AgencySupermarketMapper extends BaseMapper<AgencySupermarket, AgencySupermarketSearchForm>{

    @Select(" select count(id) from agency_supermarket")
    public  Integer getCount();
}
