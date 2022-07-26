package com.sbwork.dr.publicnoticewebcrawlerguangdong.service;

import cn.hutool.http.Header;
import cn.hutool.http.HttpException;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import com.alibaba.fastjson.JSONObject;

import com.sbwork.common.scheduler.QuartzManager;
import com.sbwork.common.scheduler.form.TaskForm;
import com.sbwork.dr.baidu.BaiDuAiConfiguration;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.dr.utils.Base64Util;
import com.sbwork.dr.utils.SslUtils;
import com.sbwork.dr.baidu.AuthService;
import com.sbwork.dr.publicnoticewebcrawler.service.DcCacheValueService;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.entity.PublicNoticeWebCrawlerGuangDong;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.entity.ReturnResult;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.entity.ReturnResultInfo;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.job.DrFetchDataJobGuangDong;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.persistence.PublicNoticeWebCrawlerGuangDongMapper;
import com.sbwork.dr.utils.HttpUtil;
import com.sbwork.sys.form.SysCodeForm;
import com.sbwork.sys.form.SysCodeModuleForm;
import com.sbwork.sys.service.SysCodeModuleService;
import com.sbwork.sys.service.SysCodeService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

;

@Service
@Slf4j
public class PublicNoticeWebCrawlGuangDong {

    private final TaskForm taskForm;
    @Resource
    private QuartzManager quartzManager;

    @Resource
    private PublicNoticeWebCrawlerGuangDongMapper publicNoticeWebCrawlerGuangDongMapper;
    @Resource
    private SysCodeService sysCodeService;
    @Resource
    private SysCodeModuleService sysCodeModuleService;
    @Resource
    private DcCacheValueService dcCacheValueService;
    @Resource
    private BaiDuAiConfiguration baiDuAiConfiguration;
    @Resource
    private PublicNoticeService publicNoticeService;


    private String  accessToken = "";
    private String  verificationCode = "";


    public PublicNoticeWebCrawlGuangDong() {
        this.taskForm = new TaskForm();
    }

    //忽略HTTPS请求的SSL证书    作用于在请求广东省政府采购网时，获取图片验证码
    @PostConstruct
    public void run() throws Exception{
        SslUtils.ignoreSsl();
    }

//    @PostConstruct
    public void init() throws SchedulerException {

        this.taskForm.setCron("0 0 1 * * ? ");
        final String jobName = "guangDongPurchase";
        this.taskForm.setJobName(jobName);
        final String groupName = "crawlData";
        this.taskForm.setGroupName(groupName);
        this.quartzManager.addJob((Class)DrFetchDataJobGuangDong.class, (Map)null, this.taskForm);

        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(10000L);

                // 执行定时任务
                this.quartzManager.runJobNow(this.taskForm);
            }
            catch (SchedulerException | InterruptedException e) {
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
        // 1、获取请求地址
        List<String> urlList = getUrlList(1,null);
        for (int i=0;i<urlList.size();i++) {
            // 2、获取公告集合
            try {
                log.info("第"+(i+1)+"次获取公告列表开始，请求url为："+urlList.get(i));
                Set<PublicNoticeWebCrawlerGuangDong> list = new HashSet<>();
                list = getPublicNoticeList(urlList.get(i),list,null,1);
                log.info("第"+(i+1)+"次获取公告列表结束，获取公告数量为："+ list.size()  );

                // 3、保存数据
                this.saveData(list);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
    }


    /**
     * 保存公告数据
     */
    public   void  saveData(Set<PublicNoticeWebCrawlerGuangDong> set){

        List<PublicNoticeWebCrawlerGuangDong> list = new ArrayList<PublicNoticeWebCrawlerGuangDong>(set);
        list.sort(Comparator.comparing(PublicNoticeWebCrawlerGuangDong :: getPublicTime));
        for (int i = 0; i < list.size(); i++) {
            log.info("第"+i+"条:"+list.get(i).getProjectName() + "---" + list.get(i).getPublicTime());
        }

        // 1、 根据关键字进行过滤
        SysCodeModuleForm moduleForm = this.sysCodeModuleService.getByCode("gjz");
        if (moduleForm != null) {
            List<SysCodeForm> codeFormList = sysCodeService.getAllSysCodeByModuleId(moduleForm.getId());
            list =  list.stream().filter(s ->{
                        if(codeFormList == null || codeFormList.size() <=0)return true;
                        for (SysCodeForm sysCodeForm: codeFormList) {
                            if(s.getProjectName().contains(sysCodeForm.getName())){
                                return true;
                            }
                        }
                        return false;
                    }).collect(Collectors.toList());
        }

        //2、  校验公告是否存在
        if(list != null && list.size()>0){
            Iterator<PublicNoticeWebCrawlerGuangDong> iterator = list.iterator();
            while (iterator.hasNext()){
                PublicNoticeWebCrawlerGuangDong notice = iterator.next();
                PublicNoticeWebCrawlerGuangDong form = new PublicNoticeWebCrawlerGuangDong();
                form.setProjectName(notice.getProjectName());
                form.setPublicWeb(notice.getPublicWeb());
                form.setPublicNoticeType(notice.getPublicNoticeType());
                List<PublicNoticeWebCrawlerGuangDong> byEntity = publicNoticeWebCrawlerGuangDongMapper.getByEntity(form);
                if(byEntity != null  && byEntity.size()>0)iterator.remove();
            }
        }

        // 3、保存
        if(list != null && list.size()>0)publicNoticeWebCrawlerGuangDongMapper.insertListBatch(list);

    }


    /**
     * 获取公告列表
     * @param list 容器
     * @param lastTime 上次请求时间
     * @return
     */
    public  Set<PublicNoticeWebCrawlerGuangDong> crawlData(Set<PublicNoticeWebCrawlerGuangDong> list, Date lastTime)  {
        // 1、获取请求地址
        List<String> urlList = getUrlList(1,null);
        for (int i=0;i<urlList.size();i++) {
            // 2、获取公告集合
            try {
                log.info("第"+(i+1)+"次获取公告列表开始，请求url为："+urlList.get(i));
                int startSize = list.size();
                list = getPublicNoticeList(urlList.get(i),list,lastTime,1);
                log.info("第"+(i+1)+"次获取公告列表结束，获取公告数量为："+ (list.size() - startSize) );
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    /**
     *获取公告集合
     * @param url  请求地址
     * @param list  公告容器
     * @param lastTime  上次请求时间
     * @param page  页数
     * @return
     */
    private Set<PublicNoticeWebCrawlerGuangDong> getPublicNoticeList(String url, Set<PublicNoticeWebCrawlerGuangDong> list, Date lastTime, int page) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // 1、根据地址 获取返回内容
        ReturnResult returnResult = getReturnResultByUrl(url,1);
        if(returnResult == null){
            log.info("请求失败，地址："+url);
            return list;
        }
        // 2、进行转换
        for (int i = 0; i <returnResult.getData().size() ; i++) {
            PublicNoticeWebCrawlerGuangDong publicNotice = returnResultInfoConvert(returnResult.getData().get(i),sdf);
            list.add(publicNotice);
        }

        // 3、判断是否需要获取第2页 或者第3页内容
        int pageTotal = returnResult.getTotal()/15  + (returnResult.getTotal()%15>0?1:0) ;
        log.info("当前页："+page +"，总条数："+returnResult.getTotal() + ",总页数："+pageTotal+",集合长度:"+list.size());
        if(pageTotal > page){
            page++;
            url = url.split("&currPage=")[0]  + "&currPage=" + page;
            list = getPublicNoticeList(url,list,lastTime,page);
        }

        return list;
    }

    /**
     * 将returnResultInfo  转成  PublicNoticeWebCrawlerGuangDong
     * @param returnResultInfo
     * @return
     */
    public  PublicNoticeWebCrawlerGuangDong returnResultInfoConvert(ReturnResultInfo returnResultInfo,SimpleDateFormat sdf) throws ParseException {
        PublicNoticeWebCrawlerGuangDong  publicNotice = new PublicNoticeWebCrawlerGuangDong();
        // 访问地址
        if(returnResultInfo.getNoticeType().equals("59")){
            publicNotice.setPublicNoticeUrl("https://gdgpo.czt.gd.gov.cn/"+returnResultInfo.getPageurl() + "?singleIntention=singleIntentionFlag");
        }else{
            publicNotice.setPublicNoticeUrl("https://gdgpo.czt.gd.gov.cn/"+returnResultInfo.getPageurl() + "?noticeType="+returnResultInfo.getNoticeType());
        }

        // 发布网站
        publicNotice.setPublicWeb("广东省政府采购网");
        //  项目编号
        publicNotice.setProjectCode(returnResultInfo.getOpenTenderCode());
        //  标题
        publicNotice.setProjectName(returnResultInfo.getTitle());
        //  发布时间
        publicNotice.setPublicTime(sdf.parse(returnResultInfo.getNoticeTime()));
        //   地区
        publicNotice.setArea(returnResultInfo.getRegionName());
        // 公告类型
        String noticeType = returnResultInfo.getNoticeType();
        if(noticeType.contains("00101"))publicNotice.setPublicNoticeType("采购公告");
        if(noticeType.contains("001101"))publicNotice.setPublicNoticeType("采购计划");
        if(noticeType.contains("59"))publicNotice.setPublicNoticeType("采购意向");
        if(noticeType.contains("001059"))publicNotice.setPublicNoticeType("采购需求");
        //  采购方式
        publicNotice.setPurchaseType(returnResultInfo.getPurchaseManner());
        if("1".equals(returnResultInfo.getPurchaseManner()))publicNotice.setPurchaseType("公开招标");
        if("2".equals(returnResultInfo.getPurchaseManner()))publicNotice.setPurchaseType("邀请招标");
        if("3".equals(returnResultInfo.getPurchaseManner()))publicNotice.setPurchaseType("竞争性谈判");
        if("4".equals(returnResultInfo.getPurchaseManner()))publicNotice.setPurchaseType("询价");
        if("5".equals(returnResultInfo.getPurchaseManner()))publicNotice.setPurchaseType("单一来源");
        if("6".equals(returnResultInfo.getPurchaseManner()))publicNotice.setPurchaseType("竞争性磋商");
        if("9".equals(returnResultInfo.getPurchaseManner()))publicNotice.setPurchaseType("其他");
        //  金额
        publicNotice.setBudget(returnResultInfo.getBudget());
        //  截止时间
        publicNotice.setEndTime(returnResultInfo.getOpenTenderTime());
        //  采购人
        publicNotice.setPurchaseUser(returnResultInfo.getPurchaser());
        //  采购代理机构
        publicNotice.setPurchaseOrganization(returnResultInfo.getAgency());
        //  采购人联系方式
        publicNotice.setPurchaseUserContactWay(returnResultInfo.getPurchaserLinkPhone());
        //  项目经办人
        publicNotice.setProjectManager(returnResultInfo.getAgentManageName());
        //  采购分类
        if("1".equals(returnResultInfo.getPurchaseNature()))publicNotice.setPurchaseClassify("货物");
        if("2".equals(returnResultInfo.getPurchaseNature()))publicNotice.setPurchaseClassify("工程");
        if("3".equals(returnResultInfo.getPurchaseNature()))publicNotice.setPurchaseClassify("服务");
        // 是否解析
        publicNotice.setIfAnalysis("0");

        // 如果是采购意向  则需访问具体公告网址获取项目名称
        if(noticeType.equals("59")){
            // 第一步：获取网址返回的内容
            String htmlString = publicNoticeService.getDataByUrl(publicNotice.getPublicNoticeUrl());
            // 第二步：解析网址内容，拿到想要的数据
            Document document = Jsoup.parse(htmlString);
            // 第三步：获取项目名称
            Elements noticeTables = document.getElementsByClass("noticeTable");
            if(noticeTables != null && noticeTables.size() > 1){
                Element noticeTable = noticeTables.get(1);
                Element tr = noticeTable.getElementsByTag("tr").get(1);
                Element td = tr.getElementsByTag("td").get(1);
                publicNotice.setProjectName(td.text().trim());
            }
        }
        return publicNotice;
    }

    /**
     * 获取网址返回值
     * requestNum  请求次数
     * @param url
     */
    public  ReturnResult getReturnResultByUrl(String url,int requestNum)  {
        // 超过10次  就不再请求
        if(requestNum > 10)return null;
        try {
            if(StringUtils.isBlank(this.verificationCode)){
                this.verificationCode = getVerificationCode(1);
            }
            String httpUrl = url + "&verifyCode="+ this.verificationCode;
            log.info("第"+requestNum+"次查询广东省政府采购网数据，httpUrl："+httpUrl);
            HttpResponse response = HttpRequest.get(httpUrl).header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36")
                    // 超时，毫秒
                    .timeout(15000)
                    .execute();
            Thread.sleep(1000 * (new Random().nextInt(5) + 3));
            int status = response.getStatus();
            if(status == 200){
                String result = response.body();
                ReturnResult returnResult = JSONObject.parseObject(result).toJavaObject(ReturnResult.class);
                if("-1".equals(returnResult.getCode()) ){
                    //  验证码失效   重新获取验证码
                    log.info("请求次数："+requestNum+"次，请求status:"+status+"，请求code:"+returnResult.getCode()+",错误消息："+returnResult.getMsg()+",验证码："+this.verificationCode);
//                    String verificationCodeTemp = this.verificationCode;
                    Thread.sleep(1000 * (new Random().nextInt(3) ));
                    this.verificationCode = getVerificationCode(1);
//                    url = url.replace("&verifyCode="+verificationCodeTemp, "&verifyCode="+this.verificationCode);
                     returnResult = getReturnResultByUrl(url, ++requestNum);
                }
                return  returnResult;
            }else if (status == 302 || status == 301 ){
                log.info("请求次数："+requestNum+"次，请求status:"+status+"，重新请求！");
                Thread.sleep(1000 * 60 * 3);
                getReturnResultByUrl(url,++requestNum);
            }else{
                log.info("请求次数："+requestNum+"次，请求status:"+status+"，重新请求！");
                Thread.sleep(1000 * (new Random().nextInt(5) + 3));
                getReturnResultByUrl(url,++requestNum);
            }
        }catch (Exception e){
            if(e instanceof HttpException){
                getReturnResultByUrl(url,++requestNum);
            }
        }

        return null;
    }

    /**
     * 获取请求url
     * @param page  页数
     * @param noticeTypeArr  公告类型
     * @return
     */
    public  List<String> getUrlList(Integer page, String[] noticeTypeArr) {
        List<String> urlList = new ArrayList<>();

        // 获取需要的公告类型   00101采购公告  001101采购计划   59采购意向   001059采购需求
        if(noticeTypeArr == null )noticeTypeArr = new String[]{"00101","001101","59","001059"};
        // 获取需要查询的日期
        String date1 = new SimpleDateFormat("yyyy-MM-dd").format(new Date( new Date().getTime() - 2 * 24 * 3600 * 1000 ));
        String date2 = new SimpleDateFormat("yyyy-MM-dd").format(new Date( new Date().getTime() - 1 * 24 * 3600 * 1000 ));
        date1 = date1 + "%2000:00:00";
        date2 = date2 + "%2000:00:00";
        // 获取验证码
//        if(StringUtils.isBlank(this.verificationCode))this.verificationCode = getVerificationCode(1);
        for (int i = 0; i <noticeTypeArr.length ; i++) {

            String url = "https://gdgpo.czt.gd.gov.cn/freecms/rest/v1/notice/selectInfoMoreChannel.do?" +
                        "&siteId=cd64e06a-21a7-4620-aebc-0576bab7e07a" +
                        "&channel=" + ("001101".equals(noticeTypeArr[i])?"95ff31f3-a1af-4bc4-b1a2-54c894476193":"fca71be5-fc0c-45db-96af-f513e9abda9d")+
                        "&pageSize=" + 15 +
                        "&noticeType=" +  noticeTypeArr[i] +
                        "&regionCode=" +   // 地区  选择全部
//                        "&verifyCode=" + verificationCode + // 验证码
                        "&subChannel=false" +
                        "&purchaseManner=" + ("001101".equals(noticeTypeArr[i])?"!%E7%94%B5%E5%AD%90%E5%8D%96%E5%9C%BA":"") +  //!电子卖场
                        "&title=" +
                        ("001101".equals(noticeTypeArr[i])?"":"&openTenderCode=") +
                        "&purchaser=" +
                        "&agency=" +
                        "&purchaseNature=" +
                        "&operationStartTime=" + date1 +
                        "&operationEndTime=" + date2 +
                        "&selectTimeName=noticeTime"+
                        "&currPage=" + (page == null?1:page);//当前页数
            urlList.add(url);
        }
        return urlList;
    }


    /**
     *  获取广东省政府采购网  查询时验证码  并解析
     * @param requestNum
     * @return
     */
    public String getVerificationCode(Integer requestNum){
        if(requestNum == null)requestNum = 1;
        if(requestNum > 3) return "";
//        SslUtils.ignoreSsl();
        String verificationCode = "";
        String codeimgurl = "https://gdgpo.czt.gd.gov.cn/freecms/verify/verifyCode.do?createTypeFlag=n&name=notice&d" + new Date().getTime();
        String url = baiDuAiConfiguration.getHttpUrl();
        try {
            byte[] codeimgdata = Jsoup.connect(codeimgurl).ignoreContentType(true).execute().bodyAsBytes();
            String imgStr = Base64Util.encode(codeimgdata);
            String imgParam = URLEncoder.encode(imgStr, "UTF-8");
            String param = "image=" + imgParam;
            // 获取百度AI 的accessToken
            if(StringUtils.isBlank(this.accessToken))this.accessToken = AuthService.getAuth();
            // 调用百度AI 数字识别接口
            String result = HttpUtil.post(url, this.accessToken, param);
            JSONObject jsonObject = JSONObject.parseObject(result);
            if(jsonObject.getInteger("error_code") == null ){
                verificationCode = JSONObject.parseObject(jsonObject.getJSONArray("words_result").get(0).toString()).getString("words");
            }else if(110 == jsonObject.getInteger("error_code")){
                // accessToken过期  需要重新获取
                this.accessToken = AuthService.getAuth();
                verificationCode = getVerificationCode(++requestNum);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return  verificationCode;
    }



}
