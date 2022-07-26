package com.sbwork.dr.publicnotice.service;

import cn.hutool.core.io.IORuntimeException;
import cn.hutool.http.Header;
import cn.hutool.http.HttpException;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.log.Log;
import com.alibaba.fastjson.JSONObject;
import com.sbwork.base.service.BaseService;
import com.sbwork.dr.publicnotice.convert.PublicNoticeConvert;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.form.PublicNoticeForm;
import com.sbwork.dr.publicnotice.persistence.PublicNoticeMapper;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;

import com.sbwork.dr.publicnotice.util.ExcelUtils;
import com.sbwork.sys.entity.SysCode;
import com.sbwork.sys.entity.SysCodeModule;
import com.sbwork.sys.persistence.SysCodeMapper;
import com.sbwork.sys.persistence.SysCodeModuleMapper;
import com.sbwork.sys.searchForm.SysCodeModuleSearchForm;
import com.sbwork.sys.searchForm.SysCodeSearchForm;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * 公告类
 */
@Service
@Slf4j
public class PublicNoticeService implements BaseService<PublicNoticeSearchForm, PublicNoticeEntity>{
    /**
     * 自动注入SbDrProtocolMapper
     */
    @Resource
    private PublicNoticeMapper publicNoticeMapper;

    @Resource
    private PublicNoticeConvert publicNoticeConvert;


    @Resource
    private PublicNoticeAnalysisService publicNoticeAnalysisService;
    @Resource
    private BiddingPublicNoticeAnalysisService biddingPublicNoticeAnalysisService;

    /**
     * 按id进行查询
     *
     * @param id 标识
     * @return 协议类form
     */
    public <T extends PublicNoticeForm> T getById(String id) {
        PublicNoticeEntity entity = publicNoticeMapper.getByKeyId(id);
        return (T) publicNoticeConvert.convertToForm(entity);
    }




    /**
     * 按列表进行查询，后回协议类form的集合
     *
     * @param searchForm 协议类searchForm
     *
     */
//    @Override
    public List<PublicNoticeEntity> listPageBySearchForm(PublicNoticeSearchForm searchForm) {
        if(StringUtils.isBlank(searchForm.getBusinessType()))searchForm.setBusinessType(null);
        if(StringUtils.isBlank(searchForm.getBidIf()))searchForm.setBidIf(null);
        if(StringUtils.isBlank(searchForm.getProvince()))searchForm.setProvince(null);
        List<PublicNoticeEntity> list = publicNoticeMapper.getBySearchForm(searchForm);
        return list;
    }


    /**
     * 更新操作，当标识不存在的时候，直接插入，否则，进行更新
     */
    @Override
    public PublicNoticeEntity commit(PublicNoticeEntity entity) {
        if(StringUtils.isNotBlank(entity.getPublicNoticeUrl()))entity.setPublicNoticeUrl(entity.getPublicNoticeUrl().trim());
//        PublicNoticeEntity entity = publicNoticeConvert.convertToEntity(form);
        if (StringUtils.isEmpty(entity.getId())) {
            try {
                // 根据网址判断分类
                if(entity.getPublicNoticeUrl().contains("https://gdgpo.czt.gd.gov.cn")){
                    // 根据网址进行解析   广东省政府采购网
                    // 公告类型
                    String[] split = entity.getPublicNoticeUrl().split("noticeType=");
                    if(split.length>=2){
                        if(split[1].indexOf("001016") != -1){
                            // 采购公告   竞争性磋商
                            entity.setPublicNoticeType("采购公告");
                            entity = AnalysisPublicNoticeByGuangDongProvincePurchaseWeb(entity);
                        }else if(split[1].indexOf("001011") != -1){
                            // 采购公告   公开招标
                            entity.setPublicNoticeType("采购公告");
                            entity = AnalysisPublicNoticeByGuangDongProvincePurchaseWeb(entity);
                        }else if(split[1].indexOf("001101") != -1){
                            // 采购计划   公开招标
                            entity.setPublicNoticeType("采购计划");
                            entity = AnalysisPublicNoticeByGuangDongProvincePurchaseWebForPurchasePlan(entity);
                        }else if(split[1].indexOf("001059") != -1){
                            // 采购需求
                            entity.setPublicNoticeType("采购需求");
                            entity = AnalysisPublicNoticeByGuangDongProvincePurchaseWebForPurchaseNeed(entity);
                        }
                    }

                    split = entity.getPublicNoticeUrl().split("singleIntention=");
                    if(split.length>=2){
                        if(split[1].indexOf("singleIntention") != -1){
                            // 采购意向
                            entity.setPublicNoticeType("采购意向");
                            entity = AnalysisPublicNoticeByGuangDongProvincePurchaseWebForPurchaseIntention(entity);
                        }
                    }
                } else if (entity.getPublicNoticeUrl().contains("http://www.ccgp.gov.cn")){
                    // 根据网址进行解析   中国政府采购网
                    entity = AnalysisPublicNoticeByChinesePurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://www.gzggzy.cn")){
                    // 根据网址进行解析   广州公共资源交易中心
                    entity = AnalysisPublicNoticeByGuangZhouPublicResourceDealCenter(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://www.ccgp-hunan.gov.cn")){
                    // 根据网址进行解析   中国湖南政府采购网
                    entity = AnalysisPublicNoticeByChineseHuNanPurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://zfcg.czt.fujian.gov.cn")){
                    // 根据网址进行解析   福建省政府采购网
                    entity = AnalysisPublicNoticeByFuJianProvincePurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("https://www.ccgp-hainan.gov.cn")){
                    // 根据网址进行解析   海南省政府采购网
                    entity = AnalysisPublicNoticeByHaiNanProvincePurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://ggzy.zhuhai.gov.cn")){
                    // 根据网址进行解析   珠海市公共资源交易中心
                    entity = AnalysisPublicNoticeByZhuHaiPublicResourceDealCenter(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://ggzy.foshan.gov.cn")){
                    // 根据网址进行解析   佛山市公共资源交易中心
                    if(entity.getPublicNoticeUrl().contains("gcjy") && entity.getPublicNoticeUrl().contains("zbgg") ){
                          // 工程交易  中的  招标公告
                        entity = AnalysisPublicNoticeByFoShanCityPublicResourceDealCenterForBidding(entity);
                    }else if(entity.getPublicNoticeUrl().contains("zfcg") && entity.getPublicNoticeUrl().contains("cggg") ){
                        // 政府采购  中的  采购公告
                        entity = AnalysisPublicNoticeByFoShanCityPublicResourceDealCenterPurchase(entity);
                    }
                }else if (entity.getPublicNoticeUrl().contains("http://www.shunde.gov.cn")){
                    // 根据网址进行解析   佛山市顺德区公共资源交易中心
                        // 政府采购  中的  采购公告
                        entity = AnalysisPublicNoticeByFoShanCityShunDeAreaPublicResourceDealCenter(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://zt.shunde.gov.cn")){
                    // 根据网址进行解析   佛山市顺德区公共资源交易中心
                    // 工程交易  中的  招标公告
                    entity = AnalysisPublicNoticeByFoShanCityShunDeAreaPublicResourceDealCenterForBidding(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://zw.hainan.gov.cn")){
                    // 根据网址进行解析   海南省公共资源交易服务中心
                    entity = AnalysisPublicNoticeByHaiNanProvincePublicResourceDealCenter(entity);
                } else if (entity.getPublicNoticeUrl().contains("http://ggzy.haikou.gov.cn")){
                    // 根据网址进行解析   海口市公共资源交易中心
                    entity = AnalysisPublicNoticeByHaiKouCityPublicResourceDealCenter(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://www.ccgp-jiangxi.gov.cn")){
                    // 根据网址进行解析   江西省政府采购网
                    entity = AnalysisPublicNoticeByJiangXiProvincePurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://www.ccgp-guangxi.gov.cn")){
                    // 根据网址进行解析   广西政府采购网
                    entity = AnalysisPublicNoticeByGuangXiProvincePurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://www.yngp.com")){
                    // 根据网址进行解析   云南省政府采购网
                    entity = AnalysisPublicNoticeByYunNanProvincePurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://zfcg.szggzy.com")){
                    // 根据网址进行解析   中国深圳中国政府采购
                    entity = AnalysisPublicNoticeByChineseShenZhenPurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("https://gzg2b.gzfinance.gov.cn")){
                    // 根据网址进行解析   广州市政府采购平台
                    entity = AnalysisPublicNoticeByGuangZhouCityPurchaseWeb(entity);
                }else if (entity.getPublicNoticeUrl().contains("http://www.ccgp-guizhou.gov.cn")){
                    // 根据网址进行解析   贵州省政府采购网
                    entity = AnalysisPublicNoticeByGuiZhouCityPurchaseWeb(entity);
                }else{
                    // 不属于解析范围
                    entity.setId("1");
                    return entity;
                }
            }catch (Exception e){
                e.printStackTrace();
                if(e instanceof IORuntimeException || e instanceof HttpException){
                    // 网络连接超时
                    entity.setId("2");
                }else{
                    // 公告模板解析错误
                    entity.setId("3");
                }
                return entity;
            }

            // 判断项目是否已经存在
            checkProjectExist(entity);
            if(StringUtils.isNotBlank(entity.getId()))return entity;

            // 业务类型
            if(StringUtils.isBlank(entity.getBusinessType())){
                String businessType = checkBusinessType(entity.getProjectName());
                if(StringUtils.isNotBlank(businessType))entity.setBusinessType(businessType);
            }

            // 校验属性长度
            checkPropertityLength(entity);

            // 是否中标
            if(StringUtils.isNotBlank(entity.getBidUrl())){
                entity.setBidIf("1");
            }else{
                entity.setBidIf("0");
            }

            // 保存公告记录
            publicNoticeMapper.insert(entity);
        } else {
            // 是否中标
            if(StringUtils.isNotBlank(entity.getBidUrl())){
                entity.setBidIf("1");
            }else{
                entity.setBidIf("0");
            }
            publicNoticeMapper.update(entity);
        }
//        return publicNoticeConvert.convertToForm(entity);
        return  entity;
    }


    @Resource
    private SysCodeModuleMapper sysCodeModuleMapper;
    @Resource
    private SysCodeMapper sysCodeMapper;

    /**
     * 获取业务类型
     * @param
     * @return
     */
    public String checkBusinessType(String projectName) {
        if(StringUtils.isBlank(projectName))return null;

        StringBuffer businessType = new StringBuffer();
        Map<String,String> map = new HashMap<>();
        // 1.获取数据字典下所有业务类型
        // 1.1 获取业务类型模块
        SysCodeModuleSearchForm searchForm = new SysCodeModuleSearchForm();
        searchForm.setName("业务类型");
        searchForm.setParentId("-1");
        searchForm.setActive(true);
        List<SysCodeModule> list = this.sysCodeModuleMapper.getBySearchForm(searchForm);
        if(list == null || list.size() <=0)return null;
        // 1.2 获取业务类型模块下的业务类型
        SysCodeModuleSearchForm searchForm2 = new SysCodeModuleSearchForm();
        searchForm2.setParentId(list.get(0).getId());
        list = this.sysCodeModuleMapper.getBySearchForm(searchForm2);
        if(list == null || list.size() <=0)return null;
        // 2.获取所有关键字
        for (SysCodeModule e: list) {
            SysCodeSearchForm codeSearchForm = new SysCodeSearchForm();
            codeSearchForm.setModuleId(e.getId());
            List<SysCode> codeList = sysCodeMapper.getBySearchForm(codeSearchForm);
            if(codeList != null  && codeList.size()>0){
                for (SysCode code: codeList) {
                    map.put(code.getName(),e.getName());
                }
            }
        }
        // 3.根据标题进行判断
        if(map != null && map.size()>0){
            map.forEach((key,value) -> {
                if(  businessType.length() <=0  ){
                    if(projectName.contains(key))businessType.append(value);
                }else {
                    if(projectName.contains(key)){
                        if(value.contains("工程测量")  ||  value.contains("不动产测绘") || value.contains("市政工程")  ){
                            businessType.delete(0,businessType.length());
                            businessType.append(value);
                        }
                    }
                }
            });
        }

        return  businessType.toString();
    }


    /**
     * 根据网址进行解析   佛山市顺德区公共资源交易中心  工程交易  中的  招标公告
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByFoShanCityShunDeAreaPublicResourceDealCenterForBidding(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile(">发表日期:.*?</div>").matcher(htmlString);
            if(m1.find()){
                entity.setPublicTime(sdf.parse(m1.group().trim().substring(6).trim()));
            }else{
                m1 = Pattern.compile(">发表日期：.*?</div>").matcher(htmlString);
                if(m1.find())entity.setPublicTime(sdf.parse(m1.group().trim().substring(6).trim()));
            }


            // 获取月份
            if(entity.getPublicTime() != null){
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(entity.getPublicTime());
                entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("佛山市顺德区公共资源交易中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("佛山市");
        // 县区
        if(StringUtils.isBlank(entity.getCounty()))entity.setCounty("顺德区");
        // 公告类型
        entity.setPublicNoticeType("招标公告");
        // 项目名称
        Elements elements = document.getElementsByClass("title");
        if(elements != null && elements.size()>0){
            String projectName = elements.get(0).text().trim();
            entity.setProjectName(projectName);
        }

        // 招标公告解析
        biddingPublicNoticeAnalysisService.analysisBiddingPublicNotice(entity,text);

        return entity;
    }

    /**
     * 根据网址进行解析   佛山市公共资源交易中心   工程交易  中的  招标公告
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByFoShanCityPublicResourceDealCenterForBidding(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Elements elements = document.getElementsByClass("ewb-article-sources");
            if(elements != null && elements.size()>0){
                String publicTime = elements.get(0).child(0).text();
                entity.setPublicTime(sdf.parse(publicTime.trim()));
            }

            // 获取月份
            if(entity.getPublicTime() != null){
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(entity.getPublicTime());
                entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("佛山市公共资源交易中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("佛山市");
        // 县区
        // 公告类型
        entity.setPublicNoticeType("招标公告");
        // 项目名称
        Elements elements = document.getElementsByClass("ewb-article-tt");
        if(elements != null && elements.size()>0){
            String projectName = elements.get(0).text().trim();
            entity.setProjectName(projectName);
        }

        // 招标公告解析
        biddingPublicNoticeAnalysisService.analysisBiddingPublicNotice(entity,text);

        return entity;
    }


    /**
     * 根据网址 获取返回页面
     * @param url
     * @return
     */
    private Document getDocumentByWeb(String url){
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(url);

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);

        return document;
    }


    /**
     * 根据网址进行解析   贵州省政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuiZhouCityPurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        JSONObject jsonObject = JSONObject.parseObject(document.getElementsByAttributeValue("name", "articleDetail").get(0).val());
        Document parse = Jsoup.parse(jsonObject.getString("content"));
        String text = parse.text();
        try {
            // 发布时间
            String publicTime = jsonObject.getString("publishDate");
            entity.setPublicTime(sdf.parse(publicTime.trim()));
//            entity.setPublicTimeExcel(publicTime);

            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("贵州省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区
        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);
//        // 项目编号
//        publicNoticeAnalysisService.analysisPurchase(entity,text);
//        // 获取招标文件时间
//        publicNoticeAnalysisService.analysisBiddingTime(entity,text);
//        // 提交投标文件截止时间
//        publicNoticeAnalysisService.analysisEndTime(entity,text);
//        // 采购人信息名称  采购联系方式
//        publicNoticeAnalysisService.analysisPurchaseUser(entity,text);
//        // 代理机构/采购代理机构信息名称   采购机构联系方式
//        publicNoticeAnalysisService.analysisPurchaseOrganization(entity,text);
//        // 项目联系人  项目联系人电话
//        publicNoticeAnalysisService.analysisProjectContact(entity,text);
        return entity;
    }




    /**
     * 根据网址进行解析   广州市政府采购平台
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuangZhouCityPurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(Jsoup.parse(htmlString).getElementById("template").text());
        String text = document.text();
        try {
            // 发布时间
            Elements elements = document.getElementsByAttributeValue("name", "releaseDateSpan");
            if(elements != null && elements.size()>0){
                String publicTime = document.getElementsByAttributeValue("name", "releaseDateSpan").get(0).text();
                entity.setPublicTime(sdf.parse(publicTime.trim()));
            }else{
                if(text.indexOf("发布时间：") != -1){
                    String publicTime = text.substring(text.indexOf("发布时间：") + 5).trim().split(" ")[0];
                    entity.setPublicTime(sdf.parse(publicTime.trim()));
                }
            }

//            entity.setPublicTimeExcel(publicTime);
            // 获取月份
            if(entity.getPublicTime() != null){
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(entity.getPublicTime());
                entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("广州市政府采购平台");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("广州市");
        // 县区
        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);
//        // 项目编号
//        publicNoticeAnalysisService.analysisPurchase(entity,text);
//        // 获取招标文件时间
//        publicNoticeAnalysisService.analysisBiddingTime(entity,text);
//        // 提交投标文件截止时间
//        publicNoticeAnalysisService.analysisEndTime(entity,text);
//        // 采购人信息名称  采购联系方式
//        publicNoticeAnalysisService.analysisPurchaseUser(entity,text);
//        // 代理机构/采购代理机构信息名称   采购机构联系方式
//        publicNoticeAnalysisService.analysisPurchaseOrganization(entity,text);
//        // 项目联系人  项目联系人电话
//        publicNoticeAnalysisService.analysisProjectContact(entity,text);
        return entity;
    }

    /**
     * 根据网址进行解析   中国深圳中国政府采购
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByChineseShenZhenPurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile("信息提供日期：.*?</p>").matcher(htmlString);
            if(m1.find()){
                entity.setPublicTime(sdf.parse(m1.group().trim().split("信息提供日期：")[1].split("<")[0].trim()));
//                entity.setPublicTimeExcel(sdf.format(entity.getPublicTime()));
            }
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("中国深圳中国政府采购");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("深圳市");
        // 县区

        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);
//        // 项目编号
//        publicNoticeAnalysisService.analysisPurchase(entity,text);
//        // 获取招标文件时间
//        publicNoticeAnalysisService.analysisBiddingTime(entity,text);
//        // 提交投标文件截止时间
//        publicNoticeAnalysisService.analysisEndTime(entity,text);
//        // 采购人信息名称  采购联系方式
//        publicNoticeAnalysisService.analysisPurchaseUser(entity,text);
//        // 代理机构/采购代理机构信息名称   采购机构联系方式
//        publicNoticeAnalysisService.analysisPurchaseOrganization(entity,text);
//        // 项目联系人  项目联系人电话
//        publicNoticeAnalysisService.analysisProjectContact(entity,text);

        return entity;
    }

    /**
     * 根据网址进行解析   云南省政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByYunNanProvincePurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            String publicTime = document.getElementById("pubTime").text();
            entity.setPublicTime(sdf.parse(publicTime.trim()));
//            entity.setPublicTimeExcel(publicTime);

            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 发布网址
        entity.setPublicWeb("云南省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区
        // 项目编号
        // 项目名称
        String textStr = text.substring(text.indexOf("公告信息："), text.indexOf("联系人及联系方式："));
        String str = textStr.substring(textStr.indexOf("采购项目名称") + 6, textStr.indexOf("采购单位")).trim().replaceAll("&nbsp;", "");
        entity.setProjectName(str);
        // 预算金额
        str = textStr.substring(textStr.indexOf("预算金额") + 4).trim().replaceAll("&nbsp;", "");
        entity.setBudget(str);
        //
        if(textStr.indexOf("获取招标文件时间") != -1){
            // 采购类型
            entity.setPurchaseType("招标公告");
            // 招标时间
            str = textStr.substring(textStr.indexOf("获取招标文件时间") + 8, textStr.indexOf("招标文件售价")).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str);
        }else if(textStr.indexOf("响应文件递交地点") != -1){
            // 采购类型
            entity.setPurchaseType("竞争性磋商");
            // 招标时间
            str = textStr.substring(textStr.indexOf("获取采购文件时间") + 8, textStr.indexOf("响应文件递交地点")).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str);
        }else{
            // 采购类型
            entity.setPurchaseType("竞争性谈判");
            // 招标时间
            str = textStr.substring(textStr.indexOf("获取采购文件时间") + 8, textStr.indexOf("预算金额")).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str);
        }

        // 采购人
        textStr = text.substring(text.indexOf("联系人及联系方式："));
        str = textStr.substring(textStr.indexOf("采购单位") + 4, textStr.indexOf("采购单位地址")).trim().replaceAll("&nbsp;", "");
        entity.setPurchaseUser(str);
        // 采购人联系方式
        str = textStr.substring(textStr.indexOf("采购单位联系方式") + 8, textStr.indexOf("代理机构名称")).trim().replaceAll("&nbsp;", "");
        entity.setPurchaseUserContactWay(str);
        // 代理机构
        str = textStr.substring(textStr.indexOf("代理机构名称") + 6, textStr.indexOf("代理机构地址")).trim().replaceAll("&nbsp;", "");
        entity.setPurchaseOrganization(str);
        // 代理机构联系方式
        str = textStr.substring(textStr.indexOf("代理机构联系方式") + 8).split(" ")[1].trim().replaceAll("&nbsp;", "");
        entity.setPurchaseOrganizationContactWay(str);
        // 项目联系人
        str = textStr.substring(textStr.indexOf("项目联系人") + 5, textStr.indexOf("项目联系电话")).trim().replaceAll("&nbsp;", "");
        entity.setProjectContact(str);
        // 项目联系人电话
        str = textStr.substring(textStr.indexOf("项目联系电话") + 5, textStr.indexOf("采购单位")).trim().replaceAll("&nbsp;", "");
        entity.setProjectContactNumber(str);
        return entity;
    }


    /**
     * 根据网址进行解析   广西政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuangXiProvincePurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        JSONObject jsonObject = JSONObject.parseObject(document.getElementsByAttributeValue("name", "articleDetail").get(0).val());
        Document parse = Jsoup.parse(jsonObject.getString("content"));
        String text = parse.text();
        try {
            // 发布时间
            String publicTime = jsonObject.getString("publishDate");
            entity.setPublicTime(sdf.parse(publicTime.trim()));
//            entity.setPublicTimeExcel(publicTime);

            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("广西政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区
        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);
//        // 项目编号
//        publicNoticeAnalysisService.analysisPurchase(entity,text);
//        // 获取招标文件时间
//        publicNoticeAnalysisService.analysisBiddingTime(entity,text);
//        // 提交投标文件截止时间
//        publicNoticeAnalysisService.analysisEndTime(entity,text);
//        // 采购人信息名称  采购联系方式
//        publicNoticeAnalysisService.analysisPurchaseUser(entity,text);
//        // 代理机构/采购代理机构信息名称   采购机构联系方式
//        publicNoticeAnalysisService.analysisPurchaseOrganization(entity,text);
//        // 项目联系人  项目联系人电话
//        publicNoticeAnalysisService.analysisProjectContact(entity,text);

        return entity;
    }

    /**
     * 根据网址进行解析   江西省政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByJiangXiProvincePurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Elements elements = document.getElementsByClass("infotime");
            String publicTime = elements.get(0).text().replace("[", "").replace("]", "");
            entity.setPublicTime(sdf.parse(publicTime));
//            entity.setPublicTimeExcel(publicTime);
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("江西省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区

        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);
//        // 项目编号
//        publicNoticeAnalysisService.analysisPurchase(entity,text);
//        // 获取招标文件时间
//        publicNoticeAnalysisService.analysisBiddingTime(entity,text);
//        // 提交投标文件截止时间
//        publicNoticeAnalysisService.analysisEndTime(entity,text);
//        // 采购人信息名称  采购联系方式
//        publicNoticeAnalysisService.analysisPurchaseUser(entity,text);
//        // 代理机构/采购代理机构信息名称   采购机构联系方式
//        publicNoticeAnalysisService.analysisPurchaseOrganization(entity,text);
//        // 项目联系人  项目联系人电话
//        publicNoticeAnalysisService.analysisProjectContact(entity,text);

        return entity;
    }

    /**
     * 海口市公共资源交易中心
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByHaiKouCityPublicResourceDealCenter(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();

        String h2 = document.getElementById("hcontent").getElementsByTag("h2").get(0).text();
        if(h2.contains("采购公告")){
            entity.setPublicNoticeType("交易公告");
//            entity.setPurchaseType("交易公告");
        }else if(h2.contains("招标公告")){
            entity.setPublicNoticeType("招标公告");
//            entity.setPurchaseType("招标公告");
        }

        try {
            // 发布时间
            Elements elements = document.getElementsByClass("time");
            String publicTime = elements.get(0).text().trim();
            entity.setPublicTime(sdf.parse(publicTime));
//            entity.setPublicTimeExcel(publicTime);

            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("海口市公共资源交易中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("海口市");
        // 县区

        if("招标公告".equals(entity.getPublicNoticeType())){
            // 公告类型
            entity.setPublicNoticeType("招标公告");
            // 项目名称
            Elements elements = document.getElementsByClass("title_cen");
            String trim = elements.get(0).child(0).text().trim();
            entity.setProjectName(trim);

            // 招标公告解析
            biddingPublicNoticeAnalysisService.analysisBiddingPublicNotice(entity,text);
        }else{
            // 交易公告
            // 公告类型
            entity.setPublicNoticeType("交易公告");
            // 交易公告解析
            publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);
        }


        return entity;
    }

    /**
     * 根据网址进行解析   海南省公共资源交易服务中心
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByHaiNanProvincePublicResourceDealCenter(PublicNoticeEntity entity) {

        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();

        // 公告类型
        Element summary = document.getElementsByClass("summary").get(0);
        String purchaseType = summary.text();
        if(purchaseType.contains("公开招标")){
            entity.setPurchaseType("公开招标");
        }else if(purchaseType.contains("竞争性磋商")){
            entity.setPurchaseType("竞争性磋商");
        }else if(purchaseType.contains("采购公告")){
            entity.setPurchaseType("外包采购");
        }

        // 发布网址
        entity.setPublicWeb("海南省公共资源交易服务中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区

        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);

        if(StringUtils.isBlank(entity.getPurchaseUser()) && StringUtils.isBlank(entity.getPurchaseUser()) ){
            if(text.indexOf("七、采购人、代理机构名称及联系方式") != -1){
                text = text.substring(text.indexOf("七、采购人、代理机构名称及联系方式"));
                // 采购人信息名称
                String textStr = text.substring(text.indexOf("采购人：")+4, text.indexOf("代理机构："));
                entity.setPurchaseUser(textStr.trim());
                // 采购联系方式
                String[] split = text.split("联系人：");
                String[] split2 = split[2].split("电话：");
                entity.setPurchaseUserContactWay(split[1].trim() + "/" +split2[1]);
                // 代理机构/采购代理机构信息名称+
                textStr = text.substring(text.indexOf("代理机构：")+5, text.indexOf("地址："));
                entity.setPurchaseOrganization(textStr.trim());
                // 采购机构联系方式
                entity.setPurchaseOrganizationContactWay(split2[0] + "/" + split2[2].split(" ")[1]);

                try {
                    // 发布时间
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日HH时mm分");
                    String publicTime = split2[2].split(" ")[2];
                    entity.setPublicTime(sdf.parse(publicTime));
//                entity.setPublicTimeExcel(publicTime);
                    // 获取月份
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(entity.getPublicTime());
                    entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }



        return entity;
    }


    /**
     * 根据网址进行解析   佛山市顺德区公共资源交易中心
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByFoShanCityShunDeAreaPublicResourceDealCenter(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile(">发表日期:.*?</div>").matcher(htmlString);
            if(m1.find()){
                entity.setPublicTime(sdf.parse(m1.group().trim().split("发表日期:")[1].split("<")[0].trim()));
//                entity.setPublicTimeExcel(sdf.format(entity.getPublicTime()));
            }
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("佛山市顺德区公共资源交易中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("佛山市");
        // 县区
        entity.setCounty("顺德区");

        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);

        return entity;
    }

    /**
     * 根据网址进行解析   佛山市公共资源交易中心
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByFoShanCityPublicResourceDealCenterPurchase(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Elements elements = document.getElementsByClass("ewb-article-sources");
            String publicTime = elements.get(0).child(0).text();
            entity.setPublicTime(sdf.parse(publicTime));
//            entity.setPublicTimeExcel(publicTime);
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("佛山市公共资源交易中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("佛山市");
        // 县区

        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);

        return entity;
    }



    /**
     * 根据网址进行解析   珠海市公共资源交易中心
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByZhuHaiPublicResourceDealCenter(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile("<a>发布时间：.*?</span>").matcher(htmlString);
            if(m1.find()) {
                entity.setPublicTime(sdf.parse(m1.group().trim().split(">")[3].split("<")[0].trim() ));
//                entity.setPublicTimeExcel(sdf.format(entity.getPublicTime()));
            }
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (ParseException e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb(" 珠海市公共资源交易中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("珠海市");
        // 县区

        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);

        return entity;
    }

    /**4
     * 根据网址进行解析   海南省政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByHaiNanProvincePurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile(">发布日期：.*?</span>").matcher(htmlString);
            if(m1.find()) {
                entity.setPublicTime(sdf.parse(m1.group().trim().split("发布日期：")[1].split("<")[0].trim() ));
//                entity.setPublicTimeExcel(sdf.format(entity.getPublicTime()));
            }
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 发布网址
        entity.setPublicWeb("海南省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区
        // 采购方式
        String textStr = text.substring(text.indexOf("一、项目基本情况"), text.indexOf("二、申请人的资格要求"));
        Matcher m1 = Pattern.compile(">公告类型：.*?</em>").matcher(htmlString);
        if(m1.find()){
            String purchaseType = m1.group().trim().split(">")[2].split("<")[0].trim();
            if(purchaseType.contains("公开招标")){
                entity.setPurchaseType("公开招标");
            }else{
                entity.setPurchaseType(textStr.substring(textStr.indexOf("采购方式")+ 4,textStr.indexOf("预算金额")).trim());
            }
        }
//        // 项目编号
        if("公开招标".equals(entity.getPurchaseType())){
            entity.setProjectCode(textStr.substring(textStr.indexOf("项目编号")+ 4,textStr.indexOf("预算金额")).trim());
        }else{
            entity.setProjectCode(textStr.substring(textStr.indexOf("项目编号")+ 4,textStr.indexOf("采购方式")).trim());
        }

        // 项目名称
        entity.setProjectName(textStr.substring(textStr.indexOf("项目名称")+ 4,textStr.indexOf("项目编号")).trim());
        // 招标公告链接
//        entity.setPublicNoticeUrl("");
        // 预算金额
        entity.setBudget(textStr.substring(textStr.indexOf("预算金额(万元)")+ 8,textStr.indexOf("最高限价")).trim() +"(万元)");
        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 项目编号
//        publicNoticeAnalysisService.analysisPurchase(entity,text);
//        // 获取招标文件时间
//        publicNoticeAnalysisService.analysisBiddingTime(entity,text);
//        // 提交投标文件截止时间
//        publicNoticeAnalysisService.analysisEndTime(entity,text);
//        // 采购人信息名称  采购联系方式
//        publicNoticeAnalysisService.analysisPurchaseUser(entity,text);
//        // 代理机构/采购代理机构信息名称   采购机构联系方式
//        publicNoticeAnalysisService.analysisPurchaseOrganization(entity,text);
//        // 项目联系人  项目联系人电话
//        publicNoticeAnalysisService.analysisProjectContact(entity,text);

        if("公开招标".equals(entity.getPurchaseType())){
            // 获取招标文件时间
            String substr = text.substring(text.indexOf("三、获取招标文件"), text.indexOf("四、提交投标文件截止时间"));
            String str = substr.substring(substr.indexOf(" 时间 ")+4, substr.indexOf(" 地点")).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str);
            // 提交投标文件截止时间
            substr = text.substring(text.indexOf("四、提交投标文件截止时间"), text.indexOf("五、公告期限"));
            str = substr.substring(substr.indexOf(" 时间 ")+4, substr.indexOf(" 地点 ")).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str );
        }else{
            // 获取招标文件时间
            if(text.indexOf("三、获取采购文件")  != -1  && text.indexOf("四、响应文件提交")!= -1 ){
                String substr = text.substring(text.indexOf("三、获取采购文件"), text.indexOf("四、响应文件提交"));
                String str = substr.substring(substr.indexOf(" 时间 ")+4, substr.indexOf(" 地点")).trim().replaceAll("&nbsp;", "");
                entity.setBiddingTime(str);
            }

            if(text.indexOf("四、响应文件提交")  != -1  && text.indexOf("五、开启")!= -1 ){
                // 提交投标文件截止时间
                String substr = text.substring(text.indexOf("四、响应文件提交"), text.indexOf("五、开启"));
                String str = substr.substring(substr.indexOf(" 截止时间 ")+6, substr.indexOf(" 地点")).trim().replaceAll("&nbsp;", "");
                entity.setEndTime(str );
            }

        }

        // 采购人信息名称
        String str = text.substring(text.indexOf("采购单位名称")+6, text.indexOf("采购单位联系方式")).trim().replaceAll("&nbsp;", "");
        entity.setPurchaseUser(str);
        // 采购联系方式
        str = text.substring(text.indexOf("采购单位联系方式")+8, text.indexOf("采购单位地址")).trim().replaceAll("&nbsp;", "");
        entity.setPurchaseUserContactWay(str);
        // 代理机构/采购代理机构信息名称
        str = text.substring(text.indexOf("代理机构名称")+6, text.indexOf("代理机构联系方式")).trim().replaceAll("&nbsp;", "");
        entity.setPurchaseOrganization(str);
        // 采购机构联系方式
        str = text.substring(text.indexOf("代理机构联系方式")+8, text.indexOf("代理机构地址")).trim().replaceAll("&nbsp;", "");
        entity.setPurchaseOrganizationContactWay(str);
        // 项目负责人
        // 项目经办人
        // 项目联系人
        str = text.substring(text.indexOf("项目联系人")+5, text.indexOf("项目联系电话")).trim().replaceAll("&nbsp;", "");
        entity.setProjectContact(str);
        // 项目联系人电话
        str = text.substring(text.indexOf("项目联系电话")+6, text.indexOf("详细信息")).trim().replaceAll("&nbsp;", "");
        entity.setProjectContactNumber(str);
        return entity;
    }


    /**
     * 根据网址进行解析   福建省政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByFuJianProvincePurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            String trim = text.substring(text.indexOf("发布时间：") + 5, text.indexOf("发布时间：") + 22).trim();
            entity.setPublicTime(sdf.parse(trim));
//            entity.setPublicTimeExcel(trim);
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 发布网址
        entity.setPublicWeb("福建省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区
        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);

        return entity;
    }


    /**
     * 根据网址进行解析   中国湖南政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByChineseHuNanPurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);

        // 第三步：获取iframe内的公告内容
        Element iframe = document.getElementById("content");
        String src = iframe.attr("src");
        htmlString = getDataByUrl("http://www.ccgp-hunan.gov.cn/"+src);
        String text = Jsoup.parse(htmlString).text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile(">公告时间：.*?</div>").matcher(htmlString);
            if(m1.find()) {
                entity.setPublicTime(sdf.parse(m1.group().trim().split("公告时间：")[1].split("<")[0].trim() ));
            }else{
                m1 = Pattern.compile(">公告日期:.*?</p>").matcher(htmlString);
                if(m1.find()) {
                    entity.setPublicTime(sdf.parse(m1.group().trim().split("公告日期:")[1].split("<")[0].trim() ));
                }
            }
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(entity.getPublicTime());
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (ParseException e) {
            e.printStackTrace();
        }

        // 发布网址
        entity.setPublicWeb("中国湖南政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省外");
        // 地级市
        // 县区
        // 项目名称
        Matcher m1 = Pattern.compile("<span>项目名称：.*?</span>").matcher(htmlString);
        if(m1.find())entity.setProjectName(m1.group().trim().split("项目名称：")[1].split("<")[0].trim());
        // 项目编号
        m1 = Pattern.compile("<span>采购项目编号：.*?</span>").matcher(htmlString);
        if(m1.find())entity.setProjectCode(m1.group().trim().split("采购项目编号：")[1].split("<")[0].trim());
        // 招标公告链接
        // 采购方式
        m1 = Pattern.compile("<span>采购方式：.*?</span>").matcher(htmlString);
        if(m1.find()){
            entity.setPurchaseType(m1.group().trim().split("采购方式：")[1].split("<")[0].trim());
        }else if(text.contains("竞争性磋商")){
            entity.setPurchaseType("竞争性磋商");
        }
        // 预算金额
        m1 = Pattern.compile("<span>采购预算：.*?</span>").matcher(htmlString);
        if(m1.find()){
            entity.setBudget(m1.group().trim().split("采购预算：")[1].split("<")[0].trim());
        }else {
            Elements tables = Jsoup.parse(htmlString).getElementsByTag("table");
            if(tables != null && tables.size()>0){
                Elements trs = tables.get(0).getElementsByTag("tr");
                if(trs != null){
                    Elements tds = trs.get(0).getElementsByTag("td");
                    for (int i = 0; i < tds.size(); i++) {
                        if(tds.get(i).text().contains("预算")){
                            String str = trs.get(1).getElementsByTag("td").get(i).text().trim();
                            entity.setBudget(str);
                        }
                    }
                }
            }
        }
        // 公告类型
//        Elements currChnlCls = document.getElementsByClass("CurrChnlCls");
//        if(currChnlCls != null) entity.setPublicNoticeType(currChnlCls.last().text());
        entity.setPublicNoticeType("采购公告");
        // 业务类型
        // 项目类型
        // 获取招标文件时间
        m1 = Pattern.compile("1、有意参加投标者，请于.*?双休日及节假日除外").matcher(htmlString);
        if(m1.find()){
            entity.setBiddingTime(m1.group().trim().split("请于")[1].trim());
        }else{
            m1 = Pattern.compile("有意参加投标者，请于.*?（北京时间）").matcher(htmlString);
            if(m1.find()){
                entity.setBiddingTime(m1.group().trim().split("请于")[1].trim());
            }else {
                if(text.indexOf("获取磋商文件时间：") != -1  && text.indexOf("（2）获取磋商文件的地点",text.indexOf("获取磋商文件时间：")) != -1 ){
                    String substring = text.substring(text.indexOf("获取磋商文件时间：") + 9 , text.indexOf("（2）获取磋商文件的地点")).trim();
                    entity.setBiddingTime(substring);
                }
            }
        }
        // 提交投标文件截止时间
        m1 = Pattern.compile("<span>1、提交投标文件的截止时间：.*?</span>").matcher(htmlString);
        if(m1.find()){
            entity.setEndTime(m1.group().trim().split("截止时间：")[1].split("<")[0].trim());
        }else {
            m1 = Pattern.compile("<span>1、首次响应文件的提交截止时间：.*?</span>").matcher(htmlString);
            if(m1.find()){
                entity.setEndTime(m1.group().trim().split("截止时间：")[1].split("<")[0].trim());
            }else{
                if(text.indexOf("提交首次响应文件的截止时间为") != -1  && text.indexOf("2、磋商时间",text.indexOf("提交首次响应文件的截止时间为")) != -1 ){
                    String substring = text.substring(text.indexOf("提交首次响应文件的截止时间为") +14 , text.indexOf("2、磋商时间")).trim();
                    entity.setEndTime(substring);
                }
            }
        }

        // 采购人信息名称
        m1 = Pattern.compile("<span>2、采购人</span>.*?<span>3、采购代理机构</span>").matcher(htmlString);
        if(m1.find()){
            Matcher m2 = Pattern.compile("<span>名  称：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setPurchaseUser(m2.group().trim().split("名  称：")[1].split("<")[0].trim());
            // 采购联系方式
             m2 = Pattern.compile("<span>联系人：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setPurchaseUserContactWay(m2.group().trim().split("联系人：")[1].split("<")[0].trim());
            m2 = Pattern.compile("<span>电  话：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ m2.group().trim().split("电  话：")[1].split("<")[0].trim());
        }

        // 代理机构/采购代理机构信息名称
        m1 = Pattern.compile("<span>3、采购代理机构</span>.*?<span>邮  编：").matcher(htmlString);
        if(m1.find()){
            Matcher m2 = Pattern.compile("<span>名  称：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setPurchaseOrganization(m2.group().trim().split("名  称：")[1].split("<")[0].trim());
            // 采购机构联系方式
            m2 = Pattern.compile("<span>联系人：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setPurchaseOrganizationContactWay(m2.group().trim().split("联系人：")[1].split("<")[0].trim());
            m2 = Pattern.compile("<span>电  话：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ m2.group().trim().split("电  话：")[1].split("<")[0].trim());

        }

        // 项目负责人
        // 项目经办人
        // 项目联系人
        m1 = Pattern.compile("<span>1、采购项目</span>.*?<span>2、采购人</span>").matcher(htmlString);
        if(m1.find()){
            Matcher m2 = Pattern.compile("<span>联系人姓名：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setProjectContact(m2.group().trim().split("姓名：")[1].split("<")[0].trim());

            // 项目联系人电话
            m2 = Pattern.compile("<span>电  话：.*?</span>").matcher(m1.group());
            if(m2.find())entity.setProjectContactNumber(m2.group().trim().split("电  话：")[1].split("<")[0].trim());
        }

        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);

        return entity;
    }


    /**
     * 根据网址进行解析   广州公共资源交易中心
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuangZhouPublicResourceDealCenter(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile("<span>发布时间：.*?</span>").matcher(htmlString);
            if(m1.find()){
                entity.setPublicTime(sdf.parse(m1.group().trim().split("发布时间：")[1].split("<")[0].trim() ));
//                entity.setPublicTimeExcel(sdf.format(entity.getPublicTime()));
                // 获取月份
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(entity.getPublicTime());
                entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 发布网址
        entity.setPublicWeb("广州公共资源交易中心");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        if(StringUtils.isBlank(entity.getCity()))entity.setCity("广州市");

        if(entity.getPublicNoticeUrl().contains("cggg")){
            // 公告类型
            entity.setPublicNoticeType("采购公告");
            // 采购公告解析
            publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);
        }else if(entity.getPublicNoticeUrl().contains("zbgg")){
            // 公告类型
            entity.setPublicNoticeType("招标公告");
            // 招标公告解析
            Matcher m1 = Pattern.compile("项目名称：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(5).trim();
                entity.setProjectName(str);
            }
            m1 = Pattern.compile("项目编号：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(5).trim();
                entity.setProjectCode(str);
            }
            m1 = Pattern.compile("审查方式：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(5).trim();
                entity.setPurchaseType(str);
            }
            m1 = Pattern.compile("投标登记时间：.*?投标登记方式").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(7).trim();
                entity.setBiddingTime(str.substring(0,str.length()-6).trim());
            }
            m1 = Pattern.compile("最高投标限价.*?：.*?投标人资格条件").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(11).trim();
                entity.setBudget(str.substring(0,str.length()-7).trim());
                if(StringUtils.isNotBlank(entity.getBudget())  && entity.getBudget().contains("：")){
                    entity.setBudget(entity.getBudget().split("：")[1]);
                }
            }
            m1 = Pattern.compile("投标文件递交时间：.*?资审申请文件递交时间").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(9).trim();
                entity.setEndTime(str.substring(0,str.length()-10).trim());
            }else {
                m1 = Pattern.compile("投标文件递交时间：.*?递交电子光盘备用").matcher(text);
                if(m1.find()){
                    String str = m1.group().substring(9).trim();
                    entity.setEndTime(str.substring(0,str.length()-8).trim());
                }else {
                    m1 = Pattern.compile("投标文件递交时间：.*?自助签到日程安排").matcher(text);
                    if(m1.find()){
                        String str = m1.group().substring(9).trim();
                        entity.setEndTime(str.substring(0,str.length()-8).trim());
                    }
                }
            }

            m1 = Pattern.compile("招标人：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(4).trim();
                entity.setPurchaseUser(str);
            }
            m1 = Pattern.compile("联系人：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(4).trim();
                entity.setPurchaseUserContactWay(str);
            }
            m1 = Pattern.compile("联系方式：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(5).trim();
                if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay())){
                    entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+str);
                }else {
                    entity.setPurchaseUserContactWay(str);
                };
            }

            m1 = Pattern.compile("招标代理：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(5).trim();
                entity.setPurchaseOrganization(str);
            }
            m1 = Pattern.compile("代理联系人：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(6).trim();
                entity.setPurchaseOrganizationContactWay(str);
            }
            m1 = Pattern.compile("代理联系方式：.*? ").matcher(text);
            if(m1.find()){
                String str = m1.group().substring(7).trim();
                if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay())){
                    entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+str);
                }else {
                    entity.setPurchaseOrganizationContactWay(str);
                };
            }


        }

        return entity;
    }


    /**
     * 根据网址进行解析   中国政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByChinesePurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm");
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            if(entity.getPublicTime() == null){
                Elements publicTimeEl = document.getElementsByAttributeValue("id", "pubTime");
                String publicTime = publicTimeEl.get(0).text().trim();
                entity.setPublicTime(sdf.parse(publicTime));
                // 获取月份
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(sdf.parse(publicTime));
                entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
            }else{
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(entity.getPublicTime());
                entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

        // 发布网址
        if(StringUtils.isBlank(entity.getPublicWeb()))entity.setPublicWeb("中国政府采购网");
        // 省份
        // 地级市
        // 县区

        // 公告类型
//        Elements currChnlCls = document.getElementsByClass("CurrChnlCls");
//        if(currChnlCls != null) entity.setPublicNoticeType(currChnlCls.last().text());
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);

        return entity;
    }




    /**
     * 根据网址进行解析   广东省政府采购网
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuangDongProvincePurchaseWeb(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);

        Elements element2 = document.getElementsByAttributeValue("id", "noticeArea");
        String text = element2.get(0).text();
        try {
        // 发布时间
        Elements publicTimeEl = document.getElementsByAttributeValue("id", "f_noticeTime");
        String publicTime = publicTimeEl.get(0).text().replace("发布时间：", "");
        entity.setPublicTime(sdf.parse(publicTime));
//        entity.setPublicTimeExcel(publicTime);
        // 获取月份
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(sdf.parse(publicTime));
        entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 发布网址
        entity.setPublicWeb("广东省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 地级市
        // 县区

        // 公告类型
        entity.setPublicNoticeType("采购公告");
        // 采购公告解析
        publicNoticeAnalysisService.analysisPurchasePublicNotice(entity,text);


        return entity;
    }

    /**
     * 根据网址进行解析   广东省政府采购网  采购计划   公开招标
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuangDongProvincePurchaseWebForPurchasePlan(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        String html = document.html();
        try {
            // 发布时间
            String htmlStr = html.substring(html.indexOf("var publishTime"), html.indexOf("var publishTime")+ 40);
            htmlStr = htmlStr.replaceAll("\"", "");
            htmlStr = htmlStr.replace(";", "");
            String publicTime = htmlStr.split("=")[1].trim();
            entity.setPublicTime(sdf.parse(publicTime));
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(sdf.parse(publicTime));
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 发布网址
        entity.setPublicWeb("广东省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 项目编号
        entity.setProjectCode(document.getElementById("openTenderCodeshow").val());
        // 项目名称
        entity.setProjectName(document.getElementById("cgjh-info-titleshow").val());
        // 采购方式
        entity.setPurchaseType(document.getElementById("purMethodName").val());
        // 预算
        entity.setBudget(document.getElementById("planTotlePrice").val());
        // 采购人信息名称
        entity.setPurchaseUser(document.getElementById("purchaser").val());
        return entity;
    }

    /**
     * 根据网址进行解析   广东省政府采购网  采购需求
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuangDongProvincePurchaseWebForPurchaseNeed(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        String html = document.html();
        try {
            // 发布时间
            Element publicTimeEl = document.getElementById("f_noticeTime");
            String publicTime = publicTimeEl.text().replace("发布时间：", "");
            entity.setPublicTime(sdf.parse(publicTime));
            // 获取月份
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(sdf.parse(publicTime));
            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 发布网址
        entity.setPublicWeb("广东省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 项目编号
        String htmlStr = html.substring(html.indexOf("var openTenderCode"), html.indexOf("var channel"));
        htmlStr = htmlStr.replaceAll("\"", "");
        htmlStr = htmlStr.replace(";", "");
        entity.setProjectCode(htmlStr.split("=")[1].trim());
        // 项目名称
        htmlStr = html.substring(html.indexOf("var requirementsTitle"), html.indexOf("var requirementsCatalogueNameList"));
        htmlStr = htmlStr.replaceAll("\"", "");
        htmlStr = htmlStr.replace(";", "");
        entity.setProjectName(htmlStr.split("=")[1].trim());
        // 采购人信息名称
        htmlStr = html.substring(html.indexOf("var requirementsPurchaser"), html.indexOf("var requirementsPurchaserAddr"));
        htmlStr = htmlStr.replaceAll("\"", "");
        htmlStr = htmlStr.replace(";", "");
        entity.setPurchaseUser(htmlStr.split("=")[1].trim());
        // 采购人联系方式
        String trim = html.substring(html.indexOf("var requirementsPurchaserLinkMan"), html.indexOf("var requirementsPurchaserLinkPhone")).split("=")[1].trim();
        trim = trim.replaceAll("\"", "");
        trim = trim.replace(";", "");
        String trim1 = html.substring(html.indexOf("var requirementsPurchaserLinkPhone"), html.indexOf("var requirementsAgency")).split("=")[1].trim();
        trim1 = trim1.replaceAll("\"", "");
        trim1 = trim1.replace(";", "");
        entity.setPurchaseUserContactWay(trim +"/"+ trim1);
        // 采购代理机构
        htmlStr = html.substring(html.indexOf("var requirementsAgency"), html.indexOf("var requirementsAgentAddress"));
        htmlStr = htmlStr.replaceAll("\"", "");
        htmlStr = htmlStr.replace(";", "");
        entity.setPurchaseOrganization(htmlStr.split("=")[1].trim());
        // 采购代理机构联系方式
        trim = html.substring(html.indexOf("var requirementsAgentLinkMan"), html.indexOf("var requirementsAgentLinkPhone")).split("=")[1].trim();
        trim = trim.replaceAll("\"", "");
        trim = trim.replace(";", "");
        trim1 =  html.substring(html.indexOf("var requirementsAgentLinkPhone"), html.indexOf("var demandAnnouncement")).split("=")[1].trim();
        trim1 = trim1.replaceAll("\"", "");
        trim1 = trim1.replace(";", "");
        entity.setPurchaseOrganizationContactWay(trim +"/"+ trim1);

        return entity;
    }


    /**
     * 根据网址进行解析   广东省政府采购网  采购意向
     * @param entity
     * @return
     */
    private PublicNoticeEntity AnalysisPublicNoticeByGuangDongProvincePurchaseWebForPurchaseIntention(PublicNoticeEntity entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl());

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);
        String text = document.text();
        try {
            // 发布时间
            Matcher m1 = Pattern.compile(">发布时间：.*?</span>").matcher(htmlString);
            if(m1.find()){
                String publicTime = m1.group().trim().split("：")[1].split("<")[0].trim();
                entity.setPublicTime(sdf.parse(publicTime));
                // 获取月份
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(sdf.parse(publicTime));
                entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 发布网址
        entity.setPublicWeb("广东省政府采购网");
        // 省份
        if(StringUtils.isBlank(entity.getProvince()))entity.setProvince("广东省内");
        // 项目名称
        Element noticeTable = document.getElementsByClass("noticeTable").get(1);
        Element tr = noticeTable.getElementsByTag("tr").get(1);
        Element td = tr.getElementsByTag("td").get(1);
        entity.setProjectName(td.text().trim());
        // 预算金额
        td = tr.getElementsByTag("td").get(4);
        entity.setBudget(td.text().trim());
        // 采购人信息f_issuing_agency  electronicStoreInfo
        Element element = document.getElementById("electronicStoreInfo");
        if(element != null ){
            htmlString = element.toString();
            Matcher m1 = Pattern.compile(">发布机构：.*?</span>").matcher(htmlString);
            if(m1.find()){
                String purchaseUser = m1.group().trim().split("：")[1].split("<")[0].trim();
                entity.setPurchaseUser(purchaseUser);
            }
        }
        return entity;
    }

    /**
     * 获取网址返回值
     *
     * @param url
     */
    public  String getDataByUrl(String url) {
        log.info("请求路径："+url);
        int timeOut = 5000;
        if(url.contains("http://www.ccgp-hunan.gov.cn")){
            timeOut = 15000;
        }
        HttpResponse httpResponse = HttpRequest.get(url)
                                    // 爬虫伪装
                                    //.header(Header.HOST, "gdgpo.czt.gd.gov.cn")
                                    .header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36")
                                    // 超时，毫秒
                                    .timeout(timeOut)
                                    .execute();
        log.info("status:"+httpResponse.getStatus());
//        log.info("body:"+httpResponse.body());
        return httpResponse.body();
    }



    /**
     * 按ids 删除 协议类
     *
     * @param ids id集合
     */
    @Override
    public void remove(String... ids) {
        for (String id : ids) {
            // 删除自己
            publicNoticeMapper.deleteByKeyId(id);
        }
    }


    /**
     * 导出
     * @param searchForm
     * @param response
     */
    public void export(PublicNoticeSearchForm searchForm, HttpServletResponse response) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 获取公告
        List<PublicNoticeEntity> list = publicNoticeMapper.getBySearchForm(searchForm);
        for(int i =0;i<list.size();i++){
            list.get(i).setOrderNum(i +1);
            list.get(i).setPublicNoticeCreateTime(sdf.format(list.get(i).getCreateTime()));
//            if(StringUtils.isBlank(list.get(i).getPublicTimeExcel()))list.get(i).setPublicTimeExcel(sdf.format(list.get(i).getPublicTime()));
        }
        try {
            ExcelUtils.exportExcel(list,"公告信息", "公告信息",PublicNoticeEntity.class,"公告记录表",response);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * 判断项目是否已经存在
     * @param entity
     * @return
     */
    private PublicNoticeEntity checkProjectExist(PublicNoticeEntity entity){

        PublicNoticeSearchForm searchForm = new PublicNoticeSearchForm();
        if(StringUtils.isNotBlank(entity.getProjectCode()))searchForm.setProjectCode(entity.getProjectCode());
        if(StringUtils.isNotBlank(entity.getProjectName()))searchForm.setProjectNameTemp(entity.getProjectName());
        if(StringUtils.isNotBlank(entity.getPublicNoticeType()))searchForm.setPublicNoticeTypeTemp(entity.getPublicNoticeType());
        if(StringUtils.isNotBlank(searchForm.getProjectNameTemp()) || StringUtils.isNotBlank(searchForm.getProjectCode())){
            List<PublicNoticeEntity> list = publicNoticeMapper.getBySearchForm(searchForm);
            if(list != null && list.size()>0){
                // 公告已存在
                entity.setId("4");
                return entity;
            }
        }

        return entity;
    }


    /**
     * 校验属性长度
     * @param entity
     * @return
     */
    private PublicNoticeEntity checkPropertityLength(PublicNoticeEntity entity){
        if(StringUtils.isNotBlank(entity.getProjectCode())  && entity.getProjectCode().length()>32)entity.setProjectCode("");
        if(StringUtils.isNotBlank(entity.getProjectName())  && entity.getProjectName().length()>128)entity.setProjectName("");
        if(StringUtils.isNotBlank(entity.getPurchaseType())  && entity.getPurchaseType().length()>32)entity.setPurchaseType("");
        if(StringUtils.isNotBlank(entity.getBudget())  && entity.getBudget().length()>32)entity.setBudget("");
        if(StringUtils.isNotBlank(entity.getBiddingTime())  && entity.getBiddingTime().length()>256)entity.setBiddingTime("");
        if(StringUtils.isNotBlank(entity.getEndTime())  && entity.getEndTime().length()>256)entity.setEndTime("");
        if(StringUtils.isNotBlank(entity.getPurchaseUser())  && entity.getPurchaseUser().length()>128)entity.setPurchaseUser("");
        if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay())  && entity.getPurchaseUserContactWay().length()>128)entity.setPurchaseUserContactWay("");
        if(StringUtils.isNotBlank(entity.getPurchaseOrganization())  && entity.getPurchaseOrganization().length()>128)entity.setPurchaseOrganization("");
        if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay())  && entity.getPurchaseOrganizationContactWay().length()>128)entity.setPurchaseOrganizationContactWay("");
        if(StringUtils.isNotBlank(entity.getProjectContact())  && entity.getProjectContact().length()>128)entity.setProjectContact("");
        if(StringUtils.isNotBlank(entity.getProjectContactNumber())  && entity.getProjectContactNumber().length()>128)entity.setProjectContactNumber("");

        return entity;
    }

}
