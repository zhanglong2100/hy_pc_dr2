package com.sbwork.dr.publicnoticewebcrawler.service;

import com.sbwork.base.service.BaseService;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.dr.publicnoticewebcrawler.convert.PublicNoticeWebCrawlerConvert;
import com.sbwork.dr.publicnoticewebcrawler.entity.PublicNoticeWebCrawler;
import com.sbwork.dr.publicnoticewebcrawler.form.PublicNoticeWebCrawlerForm;
import com.sbwork.dr.publicnoticewebcrawler.persistence.PublicNoticeWebCrawlerMapper;
import com.sbwork.dr.publicnoticewebcrawler.searchForm.PublicNoticeWebCrawlerSearchForm;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * id Service 类
 */
@Service
public class PublicNoticeWebCrawlerService implements BaseService<PublicNoticeWebCrawlerSearchForm, PublicNoticeWebCrawlerForm> {
    /**
     * 自动注入PublicNoticeWebCrawlerMapper
     */
    @Resource
    private PublicNoticeWebCrawlerMapper publicNoticeWebCrawlerMapper;

    /**
     * 自动注入PublicNoticeWebCrawlerConvert
     */
    @Resource
    private PublicNoticeWebCrawlerConvert publicNoticeWebCrawlerConvert;
    @Resource
    private PublicNoticeService publicNoticeService;

    /**
     * 按id进行查询
     * @param id 标识
     * @return 公告资源爬取form
     */
    public PublicNoticeWebCrawlerForm getById(String id) {
        PublicNoticeWebCrawler entity = publicNoticeWebCrawlerMapper.getByKeyId(id);
        return publicNoticeWebCrawlerConvert.convertToForm(entity);
    }

    /**
     * 按列表进行查询，后回公告资源爬取form的集合
     * @param searchForm 公告资源爬取searchForm
     * @return 公告资源爬取form的集合
     */
    @Override
    public List<PublicNoticeWebCrawlerForm> listPageBySearchForm(PublicNoticeWebCrawlerSearchForm searchForm) {
        if(StringUtils.isBlank(searchForm.getIfAnalysis()))searchForm.setIfAnalysis(null);
        List<PublicNoticeWebCrawler> list = publicNoticeWebCrawlerMapper.getBySearchForm(searchForm);
        return publicNoticeWebCrawlerConvert.convertToFormList(list);
    }

    /**
     * 更新操作，当标识不存在的时候，直接插入，否则，进行更新
     * @param form 公告资源爬取form
     * @return 更新后的form
     */
    @Override
    public PublicNoticeWebCrawlerForm commit(PublicNoticeWebCrawlerForm form) {
        PublicNoticeWebCrawler entity = publicNoticeWebCrawlerConvert.convertToEntity(form);
        if(StringUtils.isEmpty(entity.getId())){
            publicNoticeWebCrawlerMapper.insert(entity);
        }else{
            publicNoticeWebCrawlerMapper.update(entity);
        }
        return publicNoticeWebCrawlerConvert.convertToForm(entity);
    }


    /**
     * 按ids 删除 公告资源爬取
     * @param ids id集合
     */
    @Override
    public void remove(String... ids) {
        for(String id : ids){
            publicNoticeWebCrawlerMapper.deleteByKeyId(id);
        }
    }

    /**
     * 解析公告资源
     * @param form
     * @return
     */
    public String analysis(PublicNoticeWebCrawlerForm form) {

        PublicNoticeWebCrawler publicNoticeWebCrawler = publicNoticeWebCrawlerMapper.getByKeyId(form.getId());
        form  = publicNoticeWebCrawlerConvert.convertToForm(publicNoticeWebCrawler);
        // 1、转换类型
        PublicNoticeEntity entity = convertToPublicNoticeEntity(form);
        // 2、解析公告资源
        entity = publicNoticeService.commit(entity);
        if(entity.getId().length() > 1){
            // 3、修改公告资源状态
            form.setIfAnalysis("1");// 已解析
            this.commit(form);
        }
        return entity.getId();
    }

    /**
     * 转换类型
     * @param form
     * @return
     */
    private PublicNoticeEntity convertToPublicNoticeEntity(PublicNoticeWebCrawlerForm form) {

        PublicNoticeWebCrawler entity = publicNoticeWebCrawlerMapper.getByKeyId(form.getId());

        PublicNoticeEntity  publicNoticeEntity = new PublicNoticeEntity();
        // 发布网站
        publicNoticeEntity.setPublicWeb(entity.getPublicWeb());
        // 招标链接
        publicNoticeEntity.setPublicNoticeUrl(entity.getPublicNoticeUrl());
        // 发布时间
        publicNoticeEntity.setPublicTime(entity.getPublicTime());
        // 省份
        publicNoticeEntity.setProvince(entity.getProvince().contains("广东")?"广东省内":"广东省外");
        // 项目名称  从解析中获取
//        publicNoticeEntity.setProjectName(entity.getTitle());
        // 采购方式
        publicNoticeEntity.setPurchaseType(entity.getBidType().replace("公告",""));
        // 公告类型
        publicNoticeEntity.setPublicNoticeType("采购公告");
        // 采购人
        publicNoticeEntity.setPurchaseUser(entity.getPurchaseUser());
        // 采购代理机构
        publicNoticeEntity.setPurchaseOrganization(entity.getPurchaseOrganization());

        return publicNoticeEntity;
    }
}
