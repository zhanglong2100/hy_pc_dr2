package com.sbwork.dr.publicnoticewebcrawler.service;


import com.sbwork.common.scheduler.QuartzManager;
import com.sbwork.common.scheduler.form.TaskForm;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.persistence.PublicNoticeMapper;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.dr.publicnoticewebcrawler.job.DrFetchDataJobBidding;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class PublicNoticeBiddingService {

    private final TaskForm taskForm;
    @Resource
    private QuartzManager quartzManager;

    @Resource
    private PublicNoticeService publicNoticeService;
    @Resource
    private PublicNoticeMapper publicNoticeMapper;

    @Resource
    private PublicNoticeWebCrawlService publicNoticeWebCrawlService;




    public PublicNoticeBiddingService() {
        this.taskForm = new TaskForm();
    }

//    @PostConstruct
    public void init() throws SchedulerException {
        this.taskForm.setCron("0 10 0 * * ? ");
        final String jobName = "chinaPurchase";
        this.taskForm.setJobName(jobName);
        final String groupName = "crawlDataBidding";
        this.taskForm.setGroupName(groupName);
        this.quartzManager.addJob((Class)DrFetchDataJobBidding.class, (Map)null, this.taskForm);

        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(10 * 1000L);
                this.quartzManager.runJobNow(this.taskForm);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            return;
        });
        thread.start();
    }

    /**
     *   是否启动定时任务
     */
    public  void stopOrStartTimerTask(String  flag) throws SchedulerException {
        if("start".equals(flag)){
            if(this.taskForm.getCron() == null){
                this.init();
            }else{
                this.quartzManager.resumeJob(this.taskForm);
            }
        }else{
            if(this.taskForm.getCron() != null){
                this.quartzManager.pauseJob(this.taskForm);
            }
        }
    }



    /**
     * 执行定时任务
     */
    public   void  timerTask(){
        // 1、获取未中标的已解析的招标公告 且在三个月内
        PublicNoticeSearchForm searchForm = new PublicNoticeSearchForm();
        searchForm.setBidIf("0");
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MONTH,-3);
        searchForm.setPublicTimeStart(cal.getTime());
        List<PublicNoticeEntity> entityList = publicNoticeService.listPageBySearchForm(searchForm);
        // 2、获取对应的中标公告
        for (PublicNoticeEntity entity: entityList ) {
            try {
                getBiddingNotice(entity,1);
                Thread.sleep(1000 * (new Random().nextInt(3) + 3));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 获取对应的中标公告
     * @param entity
     * @param requestNum  请求次数
     */
    private void getBiddingNotice(PublicNoticeEntity entity, int requestNum) {
        if(requestNum >3)return;
        //1 获取请求地址
        List<String> urlList = publicNoticeWebCrawlService.getUrlList(null, new String[]{"7"},entity.getProjectName(),4);
        // 2、根据地址 获取返回内容
        Document document = publicNoticeWebCrawlService.getDocumentByUrl(urlList.get(0),1);
        if(document == null){
            log.info("中标定时任务-请求失败-请求次数："+requestNum+"-请求url："+urlList.get(0));
            getBiddingNotice(entity,++requestNum);
            return;
        }
        // 3、根据返回内容  获取中标公告
        // 获取公告列表的ul
        Elements elements = document.getElementsByClass("vT-srch-result-list-bid");
        if(elements == null || elements.size() <= 0){
            log.info("中标定时任务-获取列表内容失败-请求次数："+requestNum+"-请求url："+urlList.get(0));
            getBiddingNotice(entity,++requestNum);
            return;
        };
        Elements children = elements.get(0).children();
        // 遍历ul下的li
        for (int i = 0; i < children.size(); i++) {
            Element li = children.get(i);
            // 获取公告具体地址
            Element child = li.child(0);
            String href = child.attr("href");
            // 招标方式
            Element child2 = li.child(2);
            String bidType = child2.getElementsByTag("strong").get(0).text().trim();
            if(bidType.contains("中标公告")){
                try {
                    // 解析中标公告   并反写中标数据
                    analysisBiddingNotice(href,entity);
                }catch (Exception e){
                    log.info("中标定时任务-解析中标公告失败-请求url："+urlList.get(0));
                    e.printStackTrace();
                    continue;
                }
                break;
            }
        }
    }

    /**
     * 解析中标公告   并反写中标数据
     * @param href
     * @param entity
     */
    private void analysisBiddingNotice(String href, PublicNoticeEntity entity) {
        // 第一步：获取网址返回的内容
        String htmlString = publicNoticeService.getDataByUrl(href);

        // 第二步：解析网址内容，拿到想要的数据
        Document document = Jsoup.parse(htmlString);

        // 获取项目编号
        String projectCode = null;
        Elements elements = document.getElementsByClass("vF_detail_content");
        if(elements != null  && elements.size()>0){
            String text = elements.get(0).text();
            if(text.indexOf("项目编号") != -1  && text.indexOf("二",text.indexOf("项目编号")) != -1){
                projectCode = text.substring(text.indexOf("项目编号") + 5, text.indexOf("二",text.indexOf("项目编号"))).trim();
            }
        }
        if(StringUtils.isNotBlank(entity.getProjectCode())  ){
             if(StringUtils.isBlank(projectCode) ) return;
             if(!projectCode.contains(entity.getProjectCode())) return;
        }

        String winningUnit = "";
        try {
            // 获取中标单位
             winningUnit = getWinningUnit(document);
        }catch (Exception e){
            e.printStackTrace();
        }

        String bidPrice = "";
        try {
            // 获取中标金额
             bidPrice = getBidPrice(document);
        }catch (Exception e){
            e.printStackTrace();
        }

        String reviewExperts = "";
        try {
            // 获取评审专家
             reviewExperts = getReviewExperts(document);
        }catch (Exception e){
            e.printStackTrace();
        }

        // 修改公告解析信息
        entity.setBidUrl(href);
        entity.setWinningUnit(winningUnit);
        entity.setBidPrice(bidPrice);
        entity.setReviewExperts(reviewExperts);
        entity.setBidIf("1");
        publicNoticeMapper.update(entity);
    }

    /**
     * 获取评审专家
     * @param document
     * @return
     */
    private String getReviewExperts(Document document) {
        String reviewExperts = "";
        Elements elements = document.getElementsByClass("vF_detail_content");
        if(elements != null  && elements.size()>0) {
            //第一种获取方式
            String text = elements.get(0).text();
            if (text.indexOf("五、") != -1 && text.indexOf("六、",text.indexOf("五、")) != -1) {
                String textStr = text.substring(text.indexOf("五、"), text.indexOf("六、",text.indexOf("五、"))).trim();
                if (textStr.indexOf("名单：") != -1) {
                    reviewExperts = textStr.substring(textStr.indexOf("名单：")+3).trim();
                }else if (textStr.indexOf("名单:") != -1) {
                    reviewExperts = textStr.substring(textStr.indexOf("名单:")+3).trim();
                }
            }
        }


        if(StringUtils.isNotBlank(reviewExperts) &&  reviewExperts.indexOf("标包A：") != -1){
            reviewExperts = reviewExperts.split("标包A：")[1];
        }

        return reviewExperts;
    }

    private String getValue(Matcher m1, String str,int sub){
        if(m1.find()){
            str = str +"       "+ m1.group().trim().substring(sub);
            str = getValue(m1, str,sub);
        }
        return str;
    }

    /**
     * 获取中标金额
     * @param document
     * @return
     */
    private String getBidPrice(Document document) {
        String bidPrice = "";
//        Elements elements = document.getElementsByClass("vF_detail_content");
        Element element = document.getElementById("_notice_content_noticeBidResult-noticeBidResult");
        if(element != null  ){
            // 第一种获取方式
            if(StringUtils.isBlank(bidPrice)){
                Elements tables = element.getElementsByTag("table");
                if(tables != null && tables.size()>0){
                    for (int j = 0; j < tables.size(); j++) {
                        Elements trs = tables.get(j).getElementsByTag("tr");
                        if(trs != null  && trs.size()>0){
                            Elements childrens = trs.get(0).children();
                            int num = -1;
                            for (int i = 0; i <childrens.size() ; i++) {
                                if(childrens.get(i).text().contains("金额")){
                                    num = i ;
                                    break;
                                }
                            }
                            if(trs.size()>1 && num >=0 ){
                                for (int i = 1; i <trs.size() ; i++) {
                                    String str = trs.get(i).child(num).text();
                                    if(StringUtils.isNotBlank(str))bidPrice = bidPrice + "  "+ str ;
                                }
                            }
                        }
                    }
                }
            }
            //第二种获取方式
            String text = element.text();
            if(text.indexOf("三、") != -1  && text.indexOf("四、",text.indexOf("三、")) != -1){
                String textStr = text.substring(text.indexOf("三、"), text.indexOf("四、",text.indexOf("三、"))).trim();
                Matcher m1 = Pattern.compile("金额：.*? ").matcher(textStr);
                bidPrice = getValue(m1,bidPrice,3).trim();
            }
            //第三种获取方式
            if(StringUtils.isBlank(bidPrice)) {
                if (text.indexOf("三、") != -1 && text.indexOf("四、",text.indexOf("三、")) != -1) {
                    String textStr = text.substring(text.indexOf("三、"), text.indexOf("四、",text.indexOf("三、"))).trim();
                    if (textStr.indexOf("金额：") != -1) {
                        bidPrice = textStr.substring(textStr.indexOf("金额：") + 3).trim().split(" ")[0];
                    }else if(textStr.indexOf("金额") != -1){
                        String trim = textStr.substring(textStr.indexOf("金额") + 2).trim();
                        if(trim.indexOf("：") != -1) bidPrice = trim.split("：")[1];
                    }
                }
            }

        }
        return bidPrice;
    }

    /**
     * 获取中标单位
     * @param document
     * @return
     */
    public String getWinningUnit (Document document) {
        String winningUnit = "";

//        Elements elements = document.getElementsByClass("vF_detail_content");
        Element element = document.getElementById("_notice_content_noticeBidResult-noticeBidResult");
        if(element != null  ){
            // 第一种获取方式
            if(StringUtils.isBlank(winningUnit)){
                Elements tables = element.getElementsByTag("table");
                if(tables != null && tables.size()>0){
                    for (int j = 0; j < tables.size(); j++) {
                        Elements trs = tables.get(j).getElementsByTag("tr");
                        if(trs != null  && trs.size()>0){
                            Elements childrens = trs.get(0).children();
                            int num = -1;
                            for (int i = 0; i <childrens.size() ; i++) {
                                if(childrens.get(i).text().contains("供应商名称")){
                                    num = i ;
                                    break;
                                }
                            }
                            if(trs.size()>1 && num >=0){
                                for (int i = 1; i <trs.size() ; i++) {
                                    String str = trs.get(i).child(num).text();
                                    if(StringUtils.isNotBlank(str))winningUnit = winningUnit + "  "+ str ;
                                }
                            }
                        }
                    }
                }
            }
            //第二种获取方式
            String text = element.text();
            if(text.indexOf("三、") != -1  && text.indexOf("四、",text.indexOf("三、")) != -1){
                String textStr = text.substring(text.indexOf("三、"), text.indexOf("四、",text.indexOf("三、"))).trim();
                Matcher m1 = Pattern.compile("供应商名称：.*? ").matcher(textStr);
                winningUnit = getValue(m1,winningUnit,6).trim();
            }
            //第三种获取方式
            if(StringUtils.isBlank(winningUnit)) {
                if (text.indexOf("三、") != -1 && text.indexOf("四、",text.indexOf("三、")) != -1) {
                    String textStr = text.substring(text.indexOf("三、"), text.indexOf("四、",text.indexOf("三、"))).trim();
                    if (textStr.indexOf("供应商名称：") != -1 && textStr.indexOf("供应商地址：",textStr.indexOf("供应商名称：")) != -1) {
                        winningUnit = textStr.substring(textStr.indexOf("供应商名称：") + 6, textStr.indexOf("供应商地址：",textStr.indexOf("供应商名称："))).trim();
                    }
                }
            }


        }
        return winningUnit;
    }
}
