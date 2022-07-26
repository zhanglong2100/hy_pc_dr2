package com.sbwork.dr.agencysupermarket.service;

import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import cn.afterturn.easypoi.excel.entity.result.ExcelImportResult;
import cn.hutool.core.io.IORuntimeException;
import cn.hutool.http.Header;
import cn.hutool.http.HttpException;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import com.sbwork.base.service.BaseService;
import com.sbwork.dr.agencysupermarket.convert.AgencySupermarketConvert;
import com.sbwork.dr.agencysupermarket.entity.AgencySupermarket;
import com.sbwork.dr.agencysupermarket.form.AgencySupermarketForm;
import com.sbwork.dr.agencysupermarket.persistence.AgencySupermarketMapper;
import com.sbwork.dr.agencysupermarket.searchForm.AgencySupermarketSearchForm;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.dr.publicnotice.util.ExcelUtils;
import com.sbwork.sys.form.SysCodeForm;
import com.sbwork.sys.service.SysCodeService;
import com.sbwork.systemConfig.plugin.bean.OrderBy;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * id Service 类
 */
@Service
@Slf4j
public class AgencySupermarketService implements BaseService<AgencySupermarketSearchForm, AgencySupermarketForm> {
    /**
     * 自动注入AgencySupermarketMapper
     */
    @Resource
    private AgencySupermarketMapper agencySupermarketMapper;

    /**
     * 自动注入AgencySupermarketConvert
     */
    @Resource
    private AgencySupermarketConvert agencySupermarketConvert;
    @Resource
    private PublicNoticeService publicNoticeService;

    /**
     * 按id进行查询
     * @param id 标识
     * @return 中介超市form
     */
    public AgencySupermarketForm getById(String id) {
        AgencySupermarket entity = agencySupermarketMapper.getByKeyId(id);
        return agencySupermarketConvert.convertToForm(entity);
    }

    /**
     * 按列表进行查询，后回中介超市form的集合
     * @param searchForm 中介超市searchForm
     * @return 中介超市form的集合
     */
    @Override
    public List<AgencySupermarketForm> listPageBySearchForm(AgencySupermarketSearchForm searchForm) {
        List<AgencySupermarket> list = agencySupermarketMapper.getBySearchForm(searchForm);
        return agencySupermarketConvert.convertToFormList(list);
    }

    /**
     * 更新操作，当标识不存在的时候，直接插入，否则，进行更新
     * @param  form 中介超市
     * @return 更新后的form
     */
    @Override
    public AgencySupermarketForm commit(AgencySupermarketForm form) {
        AgencySupermarket entity = agencySupermarketConvert.convertToEntity(form);
        if(StringUtils.isNotBlank(entity.getPublicNoticeUrl()))entity.setPublicNoticeUrl(entity.getPublicNoticeUrl().trim());

        if(StringUtils.isEmpty(entity.getId())){
            // 解析链接
            try {
                if (entity.getPublicNoticeUrl().contains("https://zjcs.gdggzy.org.cn")) {
                    // 根据网址进行解析   广东省网上中介服务超市
                    entity = analysisAgencySupermarket1(entity);
                } else if(entity.getPublicNoticeUrl().contains("https://zjcs.sg.gov.cn")){
                    // 根据网址进行解析   韶关市网上中介服务超市
                    entity = analysisAgencySupermarket2(entity);
                } else {
                    // 不属于解析范围
                    entity.setId("1");
                    return agencySupermarketConvert.convertToForm(entity);
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
                return agencySupermarketConvert.convertToForm(entity);
            }

            if(StringUtils.isNotBlank(entity.getBusinessTypeTemp())){
                // 访问频率太高
                entity.setId("5");
                return agencySupermarketConvert.convertToForm(entity);
            }

            // 判断项目是否已经存在
            checkProjectExist(entity);
            if(StringUtils.isNotBlank(entity.getId()))return agencySupermarketConvert.convertToForm(entity);
            // 业务类型
            if(StringUtils.isBlank(entity.getBusinessType())){
                String businessType = publicNoticeService.checkBusinessType(entity.getProjectName());
                if(StringUtils.isNotBlank(businessType))entity.setBusinessType(businessType);
            }
            // 校验属性长度
            checkPropertityLength(entity);
            // 月份
            Calendar cal = Calendar.getInstance();
            cal.setTime(new Date());
            entity.setMonth( (cal.get(Calendar.MONTH  )+ 1) + "月");
            // 设置序号
            if(entity.getPublicTime() != null){
                AgencySupermarketSearchForm  searchForm = new AgencySupermarketSearchForm();
                searchForm.setPublicTime(entity.getPublicTime());
                searchForm.setOrderByField("orderNum");
                searchForm.setOrderByType(OrderBy.OrderByType.ASC);
//                searchForm.setPage(1);
//                searchForm.setRows(1);
                List<AgencySupermarket> supermarketList = agencySupermarketMapper.getBySearchForm(searchForm);
                if(supermarketList != null  && supermarketList.size()>0){
                    // 设置序号
                    entity.setOrderNum(supermarketList.get(0).getOrderNum());
                    // 修改序号
                    for (AgencySupermarket s : supermarketList) {
                        s.setOrderNum(s.getOrderNum() + 1);
                        agencySupermarketMapper.update(s);
                    }
                }else{
                    Integer count = agencySupermarketMapper.getCount();
                    entity.setOrderNum(count + 1);
                }
            }else{
                // 没有发布时间  需要手动填写
                entity.setId("6");
                return agencySupermarketConvert.convertToForm(entity);
            }
            agencySupermarketMapper.insert(entity);
        }else{
            if(entity.getPublicTime() == null){
                // 没有发布时间  需要手动填写
                entity.setId("6");
                return agencySupermarketConvert.convertToForm(entity);
            }
            agencySupermarketMapper.update(entity);
        }
        return agencySupermarketConvert.convertToForm(entity);
    }

    /**
     * 根据网址进行解析   广东省网上中介服务超市
     * @param entity
     * @return
     */
    private AgencySupermarket analysisAgencySupermarket1(AgencySupermarket entity) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // 第一步：获取网址返回的内容
        String host = "zjcs.gdggzy.org.cn";
        String referer = "https://zjcs.gdggzy.org.cn/gd-zjcs-pub/purchaseNotice";
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl(),host,referer);
        // 第二步：解析网址内容，拿到想要的数据
        Elements elements = Jsoup.parse(htmlString).getElementsByClass("detail__main");
        if(elements == null || elements.size() <=0){
            entity.setBusinessTypeTemp("您的访问频率太高，请稍后再试！");
            return entity;
        }

        try {
            // 发布时间
            Matcher m1 = Pattern.compile("发布时间：.*?</div>").matcher(htmlString);
            if(m1.find()){
                entity.setPublicTime(sdf.parse(m1.group().trim().split("发布时间：")[1].split("<")[0].trim()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        //解析主体
        Elements contents = elements.get(0).getElementsByClass("detail__content");
        if(contents == null || contents.size() <=0) return entity;
        Elements childrens = contents.get(0).children();
        for (int i = 0; i <childrens.size(); i++) {
            if(childrens.get(i).tag().getName().equals("ul")){
                Elements childrenLi = childrens.get(i).children();
                for (int j = 0; j < childrenLi.size(); j++) {
                    String text = childrenLi.get(j).child(0).text().trim();
                    if(text.equals("项目业主"))entity.setOwnerUnit(childrenLi.get(j).child(1).text().trim());
                    if(text.equals("采购项目名称"))entity.setProjectName(childrenLi.get(j).child(1).text().trim());
                    if(StringUtils.isBlank(entity.getBudget()) &&  text.equals("服务金额"))entity.setBudget(childrenLi.get(j).child(1).text().trim());
                    if(StringUtils.isBlank(entity.getBudget()) &&  text.equals("金额说明"))entity.setBudget(childrenLi.get(j).child(1).text().trim());
                    if(text.equals("选取中介服务机构方式"))entity.setChooseType(childrenLi.get(j).child(1).text().trim());
                    if(text.equals("截止报名时间"))entity.setEndTime(childrenLi.get(j).child(1).text().trim());
                    if(StringUtils.isBlank(entity.getEndTime()) && text.equals("截止报价时间"))entity.setEndTime(childrenLi.get(j).child(1).text().trim());
                }
            }
        }
        // 地区
        Element p = null;
        Elements ps = elements.get(0).getElementsByTag("p");
        if(ps != null && ps.size()>0){
            p =  ps.get(ps.size()-1);
        }else {
            ps =  contents.get(0).getElementsByTag("p");
            if(ps != null && ps.size()>0)p =  ps.get(ps.size()-1);
        }
//        Element p = elements.get(0).child(elements.get(0).childrenSize() - 1);
        String str = p.text().trim().split(" ")[0];
        if(str.contains("市"))entity.setArea(str.split("市")[0]);
        if(StringUtils.isBlank(entity.getArea()) && str.contains("县"))entity.setArea(str.split("县")[0]);
        if(StringUtils.isBlank(entity.getArea()) && str.length() >2 )entity.setArea(str.substring(0,2));
        // 中介超市
        if(StringUtils.isNotBlank(entity.getArea()))entity.setAgencySupermarket(entity.getArea() + "中介超市");
        // 发布时间
        if(entity.getPublicTime() == null){
            try{
                entity.setPublicTime(sdf.parse(p.text().trim().split(" ")[1].trim()));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return entity;
    }

    /**
     * 根据网址进行解析  韶关市网上中介服务超市
     * @param entity
     * @return
     */
    private AgencySupermarket analysisAgencySupermarket2(AgencySupermarket entity) {
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(entity.getPublicNoticeUrl(),null,null);
        // 第二步：解析网址内容，拿到想要的数据
        Elements elements = Jsoup.parse(htmlString).getElementsByClass("maincont_one");
        if(elements == null || elements.size() <=0) return entity;
        //解析主体
        Elements tables = elements.get(0).getElementsByTag("table");
        if(tables == null || tables.size() <=0) return entity;
        for (int i = 0; i <tables.size() ; i++) {
            Elements trs = tables.get(i).getElementsByTag("tr");
            for (int j = 0; j < trs.size(); j++) {
                String str = trs.get(j).child(0).text().trim();
                if(str.contains("采购名称"))entity.setProjectName(trs.get(j).child(1).text().trim());
                if(StringUtils.isBlank(entity.getOwnerUnit()) && str.contains("采购单位"))entity.setOwnerUnit(trs.get(j).child(1).text().trim());
                if(str.contains("选取方式"))entity.setChooseType(trs.get(j).child(1).text().trim());
                if(str.contains("截止报名时间"))entity.setEndTime(trs.get(j).child(1).text().trim());
                if(StringUtils.isBlank(entity.getEndTime()) && str.equals("截止报价时间"))entity.setEndTime(trs.get(j).child(1).text().trim());
                if( StringUtils.isBlank(entity.getBudget()) && str.contains("服务金额")  )entity.setBudget(trs.get(j).child(1).text().trim());
                if( StringUtils.isBlank(entity.getBudget()) && str.contains("金额说明")  )entity.setBudget(trs.get(j).child(1).text().trim());
            }
        }
        // 地区
        entity.setArea("韶关");
        // 中介超市
        if(StringUtils.isNotBlank(entity.getArea()))entity.setAgencySupermarket(entity.getArea() + "中介超市");

        return entity;
    }


    /**
     * 按ids 删除 中介超市
     * @param ids id集合
     */
    @Override
    public void remove(String... ids) {
        int length = ids.length;
        AgencySupermarket supermarket = agencySupermarketMapper.getByKeyId(ids[0]);
        // 删除
        for(String id : ids){
            agencySupermarketMapper.deleteByKeyId(id);
        }
        // 更新序号
        AgencySupermarketSearchForm searchForm = new AgencySupermarketSearchForm();
        searchForm.setOrderNum(supermarket.getOrderNum());
        List<AgencySupermarket> list = agencySupermarketMapper.getBySearchForm(searchForm);
        if(list != null && list.size() >0){
            for (AgencySupermarket entity: list) {
                entity.setOrderNum(entity.getOrderNum() - length);
                agencySupermarketMapper.update(entity);
            }
        }
    }


    /**
     * 导出
     * @param searchForm
     * @param response
     */
    public void export(AgencySupermarketSearchForm searchForm, HttpServletResponse response) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        SysCodeForm sysCodeForm;
        // 获取中介超市公告
        List<AgencySupermarket> list = agencySupermarketMapper.getBySearchForm(searchForm);
        for(int i =0;i<list.size();i++){
            list.get(i).setPublicNoticeCreateTime(sdf.format(list.get(i).getCreateTime()));
        }
        try {
            ExcelUtils.exportExcel(list,"中介超市公告信息", "中介超市公告信息",AgencySupermarket.class,"中介超市公告记录表",response);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * 获取网址返回值
     *
     * @param url
     */
    public  String getDataByUrl(String url,String host,String referer) {
        log.info("请求路径："+url);
        int timeOut = 5000;
        HttpRequest  httpRequest =  HttpRequest.get(url);
        // 爬虫伪装
        if(StringUtils.isNotBlank(host))httpRequest.header(Header.HOST,host);
        if(StringUtils.isNotBlank(referer))httpRequest.header(Header.REFERER,referer);
        HttpResponse httpResponse =httpRequest.header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36")
                                    // 超时，毫秒
                                    .timeout(timeOut)
                                    .execute();
        log.info("status:"+httpResponse.getStatus());
        return httpResponse.body();
    }


    /**
     * 判断项目是否已经存在
     * @param entity
     * @return
     */
    private AgencySupermarket checkProjectExist(AgencySupermarket entity){

        AgencySupermarketSearchForm searchForm = new AgencySupermarketSearchForm();
        if(StringUtils.isNotBlank(entity.getProjectApprovalCode()))searchForm.setProjectApprovalCodeTemp(entity.getProjectApprovalCode());
        if(StringUtils.isNotBlank(entity.getProjectName()))searchForm.setProjectNameTemp(entity.getProjectName());
        if(StringUtils.isNotBlank(searchForm.getProjectNameTemp()) || StringUtils.isNotBlank(searchForm.getProjectApprovalCodeTemp())){
            List<AgencySupermarket> list = agencySupermarketMapper.getBySearchForm(searchForm);
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
    private AgencySupermarket checkPropertityLength(AgencySupermarket entity){
        if(StringUtils.isNotBlank(entity.getProjectName())  && entity.getProjectName().length()>128)entity.setProjectName("");
        if(StringUtils.isNotBlank(entity.getOwnerUnit())  && entity.getOwnerUnit().length()>128)entity.setOwnerUnit("");
        if(StringUtils.isNotBlank(entity.getBudget())  && entity.getBudget().length()>64)entity.setBudget("");
        if(StringUtils.isNotBlank(entity.getChooseType())  && entity.getChooseType().length()>32)entity.setChooseType("");
        if(StringUtils.isNotBlank(entity.getEndTime())  && entity.getEndTime().length()>256)entity.setEndTime("");

        return entity;
    }


    /**
     * 导入Excel 并 保存数据
     * @param file
     * @return
     */
    public void upload(MultipartFile file) throws Exception {
        // 读取excel数据
        List<AgencySupermarket> list = ExcelUtils.importExcel(file, AgencySupermarket.class);
        // 获取序号
        Integer count = agencySupermarketMapper.getCount();
        // 过滤
        list = list.stream().filter((AgencySupermarket s) ->{ return  s.getOrderNum() != null ;}).collect(Collectors.toList());
        // 遍历添加数据
        int j = 0;
        for (int i = 0; i <list.size() ; i++) {
              if(StringUtils.isNotBlank(list.get(i).getPublicNoticeUrl()) && list.get(i).getPublicNoticeUrl().equals("链接") )list.get(i).setPublicNoticeUrl("");
              if(list.get(i).getOrderNum() != null)list.get(i).setOrderNum( count + i + 1);
              if(list.get(i).getBusinessType() != null && list.get(i).getBusinessType().endsWith("类"))list.get(i).setBusinessType( list.get(i).getBusinessType().substring(0,list.get(i).getBusinessType().length()-1) );
              if( i%500 == 0  && i != 0){
                  List<AgencySupermarket> subList = list.subList(j, i);
                  agencySupermarketMapper.insertListBatch(subList);
                  j = i;
              }else if( i == list.size() -1){
                  List<AgencySupermarket> subList = list.subList(j,i + 1);
                  agencySupermarketMapper.insertListBatch(subList);
              }
        }
        // 排序
        this.sort();
    }

    /**
     * 一键排序（根据发布时间）
     */
    public void sort() throws  Exception{
        AgencySupermarketSearchForm  searchForm = new AgencySupermarketSearchForm();
        searchForm.setOrderByFields(new String[]{"publicTime","createTime"});
        searchForm.setOrderByTypes(new OrderBy.OrderByType[]{OrderBy.OrderByType.ASC,OrderBy.OrderByType.ASC});
        List<AgencySupermarket> supermarketList = agencySupermarketMapper.getBySearchForm(searchForm);
        if(supermarketList != null && supermarketList.size()>0){
            for (int i = 0; i <supermarketList.size() ; i++) {
                supermarketList.get(i).setOrderNum(i + 1);
                agencySupermarketMapper.update(supermarketList.get(i));
            }
        }
    }
}
