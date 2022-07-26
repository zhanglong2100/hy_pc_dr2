package com.sbwork.dr.publicnoticewebcrawlerguangdong.service;

import com.sbwork.base.service.BaseService;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.dr.publicnoticewebcrawler.entity.PublicNoticeWebCrawler;
import com.sbwork.dr.publicnoticewebcrawler.form.PublicNoticeWebCrawlerForm;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.convert.PublicNoticeWebCrawlerGuangDongConvert;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.entity.PublicNoticeWebCrawlerGuangDong;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.form.PublicNoticeWebCrawlerGuangDongForm;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.persistence.PublicNoticeWebCrawlerGuangDongMapper;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.searchForm.PublicNoticeWebCrawlerGuangDongSearchForm;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * id Service 类
 */
@Service
public class PublicNoticeWebCrawlerGuangDongService implements BaseService<PublicNoticeWebCrawlerGuangDongSearchForm, PublicNoticeWebCrawlerGuangDongForm> {
    /**
     * 自动注入PublicNoticeWebCrawlerGuangDongMapper
     */
    @Resource
    private PublicNoticeWebCrawlerGuangDongMapper publicNoticeWebCrawlerGuangDongMapper;

    /**
     * 自动注入PublicNoticeWebCrawlerGuangDongConvert
     */
    @Resource
    private PublicNoticeWebCrawlerGuangDongConvert publicNoticeWebCrawlerGuangDongConvert;

    @Resource
    private PublicNoticeService publicNoticeService;

    /**
     * 按id进行查询
     * @param id 标识
     * @return 公告资源爬取(广东省政府采购网)form
     */
    public PublicNoticeWebCrawlerGuangDongForm getById(String id) {
        PublicNoticeWebCrawlerGuangDong entity = publicNoticeWebCrawlerGuangDongMapper.getByKeyId(id);
        return publicNoticeWebCrawlerGuangDongConvert.convertToForm(entity);
    }

    /**
     * 按列表进行查询，后回公告资源爬取(广东省政府采购网)form的集合
     * @param searchForm 公告资源爬取(广东省政府采购网)searchForm
     * @return 公告资源爬取(广东省政府采购网)form的集合
     */
    @Override
    public List<PublicNoticeWebCrawlerGuangDongForm> listPageBySearchForm(PublicNoticeWebCrawlerGuangDongSearchForm searchForm) {
        if(StringUtils.isBlank(searchForm.getPublicNoticeType()))searchForm.setPublicNoticeType(null);
        if(StringUtils.isBlank(searchForm.getPurchaseType()))searchForm.setPurchaseType(null);
        if(StringUtils.isBlank(searchForm.getPurchaseClassify()))searchForm.setPurchaseClassify(null);
        if(StringUtils.isBlank(searchForm.getIfAnalysis()))searchForm.setIfAnalysis(null);
        List<PublicNoticeWebCrawlerGuangDong> list = publicNoticeWebCrawlerGuangDongMapper.getBySearchForm(searchForm);
        return publicNoticeWebCrawlerGuangDongConvert.convertToFormList(list);
    }

    /**
     * 更新操作，当标识不存在的时候，直接插入，否则，进行更新
     * @param form 公告资源爬取(广东省政府采购网)form
     * @return 更新后的form
     */
    @Override
    public PublicNoticeWebCrawlerGuangDongForm commit(PublicNoticeWebCrawlerGuangDongForm form) {
        PublicNoticeWebCrawlerGuangDong entity = publicNoticeWebCrawlerGuangDongConvert.convertToEntity(form);
        if(StringUtils.isEmpty(entity.getId())){
            publicNoticeWebCrawlerGuangDongMapper.insert(entity);
        }else{
            publicNoticeWebCrawlerGuangDongMapper.update(entity);
        }
        return publicNoticeWebCrawlerGuangDongConvert.convertToForm(entity);
    }


    /**
     * 按ids 删除 公告资源爬取(广东省政府采购网)
     * @param ids id集合
     */
    @Override
    public void remove(String... ids) {
        for(String id : ids){
            publicNoticeWebCrawlerGuangDongMapper.deleteByKeyId(id);
        }
    }

    /**
     * 解析公告资源
     * @param form
     * @return
     */
    public String analysis(PublicNoticeWebCrawlerGuangDongForm form) {

        PublicNoticeWebCrawlerGuangDong publicNoticeWebCrawlerGuangDong = publicNoticeWebCrawlerGuangDongMapper.getByKeyId(form.getId());
        form  = publicNoticeWebCrawlerGuangDongConvert.convertToForm(publicNoticeWebCrawlerGuangDong);
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
    private PublicNoticeEntity convertToPublicNoticeEntity(PublicNoticeWebCrawlerGuangDongForm form) {

        PublicNoticeWebCrawlerGuangDong entity = publicNoticeWebCrawlerGuangDongMapper.getByKeyId(form.getId());

        PublicNoticeEntity  publicNoticeEntity = new PublicNoticeEntity();
        // 发布网站
        publicNoticeEntity.setPublicWeb(entity.getPublicWeb());
        // 招标链接
        publicNoticeEntity.setPublicNoticeUrl(entity.getPublicNoticeUrl());
        // 发布时间
        publicNoticeEntity.setPublicTime(entity.getPublicTime());
        // 项目编号
        publicNoticeEntity.setProjectCode(entity.getProjectCode());
        // 省份
        publicNoticeEntity.setProvince("广东省内");
        // 项目名称  从解析中获取
//        publicNoticeEntity.setProjectName(entity.getTitle());
        // 采购方式
        publicNoticeEntity.setPurchaseType(entity.getPurchaseType());
        // 公告类型
        publicNoticeEntity.setPublicNoticeType(entity.getPublicNoticeType());
        // 金额
        publicNoticeEntity.setBudget(entity.getBudget());
        // 截止时间
        publicNoticeEntity.setEndTime(entity.getEndTime());
        // 采购人
        publicNoticeEntity.setPurchaseUser(entity.getPurchaseUser());
        // 采购代理机构
        publicNoticeEntity.setPurchaseOrganization(entity.getPurchaseOrganization());
        // 采购联系方式
        publicNoticeEntity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay());


        return publicNoticeEntity;
    }
}
