package com.sbwork.dr.publicnoticewebcrawler.service;

import cn.hutool.http.Header;
import cn.hutool.http.HttpException;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import com.sbwork.common.scheduler.QuartzManager;
import com.sbwork.common.scheduler.form.TaskForm;
import com.sbwork.dr.proxypool.service.HttpProxyDataService;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.dr.publicnoticewebcrawler.entity.PublicNoticeWebCrawler;;
import com.sbwork.dr.publicnoticewebcrawler.job.DrFetchDataJob;
import com.sbwork.dr.publicnoticewebcrawler.persistence.PublicNoticeWebCrawlerMapper;
import com.sbwork.sys.form.SysCodeForm;
import com.sbwork.sys.form.SysCodeModuleForm;
import com.sbwork.sys.service.SysCodeModuleService;
import com.sbwork.sys.service.SysCodeService;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PublicNoticeWebCrawlService {

    private final TaskForm taskForm;
    @Resource
    private QuartzManager quartzManager;

    @Resource
    private PublicNoticeWebCrawlerMapper publicNoticeWebCrawlerMapper;
    @Resource
    private SysCodeService sysCodeService;
    @Resource
    private SysCodeModuleService sysCodeModuleService;
    @Resource
    private DcCacheValueService dcCacheValueService;
    @Resource
    private PublicNoticeService publicNoticeService;
    @Resource
    private HttpProxyDataService httpProxyDataService;


    public PublicNoticeWebCrawlService() {
        this.taskForm = new TaskForm();
    }

//    @PostConstruct
    public void init() throws SchedulerException {
        this.taskForm.setCron("0 */30 * * * ? ");
        final String jobName = "chinaPurchase";
        this.taskForm.setJobName(jobName);
        final String groupName = "crawlData";
        this.taskForm.setGroupName(groupName);
        this.quartzManager.addJob((Class)DrFetchDataJob.class, (Map)null, this.taskForm);

        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(5000L);
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
        Set<PublicNoticeWebCrawler> set = new HashSet<>();
        Date date = new Date();
        // 1、获取上次请求时间
        Date lastTime =this.dcCacheValueService.get("pc", "中国政府采购网");
        if (lastTime == null) {
            // 获取前半个小时内
            lastTime = new Date(date.getTime() - 1800000L);
        }
        // 2、获取公告列表
         set = crawlData(null,set,lastTime);
        log.info("中国政府采购网-获取公告数量："+set.size());
        List<PublicNoticeWebCrawler> list = new ArrayList<PublicNoticeWebCrawler>(set);
        list.sort(Comparator.comparing(PublicNoticeWebCrawler :: getPublicTime));
        for (int i = 0; i < list.size(); i++) {
            log.info("第"+i+"条:"+list.get(i).getTitle() + "---" + list.get(i).getPublicTime());
        }
        // 3、去重
//        log.info("去重前总数:"+ list.size());
//        list =  list.stream().distinct().collect(Collectors.toList());
//        log.info("去重后总数:"+ list.size());
        // 4、根据指定类型过滤
        SysCodeModuleForm moduleForm = this.sysCodeModuleService.getByCode("zblx");
        if (moduleForm != null) {
            List<SysCodeForm> codeFormList = sysCodeService.getAllSysCodeByModuleId(moduleForm.getId());
          list =   list.stream().filter(s ->{
                        if(codeFormList == null || codeFormList.size() <=0)return true;
                        for (SysCodeForm sysCodeForm: codeFormList) {
                            if(s.getBidType().contains(sysCodeForm.getName()))return true;
                        }
                        return false;
                    }).collect(Collectors.toList());
        }
        // 5、 根据关键字进行过滤
         moduleForm = this.sysCodeModuleService.getByCode("gjz");
        if (moduleForm != null) {
            List<SysCodeForm> codeFormList = sysCodeService.getAllSysCodeByModuleId(moduleForm.getId());
//            List<String> keywordList =  codeFormList.stream().map(SysCodeForm :: getName).collect(Collectors.toList());
            list =  list.stream().filter(s ->{
                        if(codeFormList == null || codeFormList.size() <=0)return true;
                        for (SysCodeForm sysCodeForm: codeFormList) {
                            if(s.getTitle().contains(sysCodeForm.getName()))return true;
                        }
                        return false;
                    }).collect(Collectors.toList());
        }

        //6、  校验公告是否存在
        if(list != null && list.size()>0){
            Iterator<PublicNoticeWebCrawler> iterator = list.iterator();
            while (iterator.hasNext()){
                PublicNoticeWebCrawler notice = iterator.next();
                PublicNoticeWebCrawler form = new PublicNoticeWebCrawler();
                form.setTitle(notice.getTitle());
                form.setPublicWeb(notice.getPublicWeb());
                form.setBidType(notice.getBidType());
                List<PublicNoticeWebCrawler> byEntity = publicNoticeWebCrawlerMapper.getByEntity(form);
                if(byEntity != null  && byEntity.size()>0)iterator.remove();
            }
        }

        // 7、保存
        if(list != null && list.size()>0)publicNoticeWebCrawlerMapper.insertListBatch(list);

        // 8、更新请求时间
        this.dcCacheValueService.update("pc", "中国政府采购网", date);
    }

    /**
     * 获取中标公告  并反写中标数据到指定的招标公告中
     * @param list
     */
    private void getBiddingToPublicNotice(List<PublicNoticeWebCrawler> list) {
        // 1、获取中标公告
        list =   list.stream().filter(s ->{
                        if(s.getBidType().contains("中标公告"))return true;
                        return false;
        }).collect(Collectors.toList());
        //2、获取未中标的已解析的招标公告
        PublicNoticeSearchForm searchForm = new PublicNoticeSearchForm();
        searchForm.setBidIf("否");
        List<PublicNoticeEntity> entityList = publicNoticeService.listPageBySearchForm(searchForm);
        //3、对中标公告进行过滤
    }

    /**
     * 获取公告列表
     * @param page 当前页
     * @param list 容器
     * @param lastTime 上次请求时间
     * @return
     */
    public  Set<PublicNoticeWebCrawler> crawlData(Integer page,Set<PublicNoticeWebCrawler> list, Date lastTime){
        // 1、获取请求地址
        List<String> urlList = getUrlList(page,new String[]{"1","2","3","6","10"},null,null);
        for (int i=0;i<urlList.size();i++) {
            // 2、获取公告列表
            log.info("第"+(i+1)+"次获取公告列表开始，请求url为："+urlList.get(i));
            int startSize = list.size();
            list = crawlData2(urlList.get(i), page, list, lastTime);
            log.info("第"+(i+1)+"次获取公告列表结束，获取公告数量为："+ (list.size() - startSize) );
        }
        return list;
    }
    /**
     * 获取公告列表
     * @param page 当前页
     * @param list 容器
     * @param lastTime 上次请求时间
     * @return
     */
    public  Set<PublicNoticeWebCrawler> crawlData2(String url,Integer page,Set<PublicNoticeWebCrawler> list, Date lastTime){

        // 1、根据地址 获取返回内容
        Document document = getDocumentByUrl(url,1);
        if(document == null){
            log.info("请求失败，地址："+url);
            return list;
        }
        // 2、根据返回内容  获取公告资源列表
        if(page == null)page = 1;
        list = getPublicNoticeList(url,document,list,page,lastTime);

        return list;
    }

    /**
     * 获取网址返回值
     * requestNum  请求次数
     * @param url
     */
    public  Document getDocumentByUrl(String url,int requestNum)  {
        // 超过十次  就不再请求
        if(requestNum > 3)return null;
        String htmlString = "";
        try {
            // 获取ip代理
            Proxy proxy = httpProxyDataService.getProxyIp();
            HttpRequest  httpRequest = HttpRequest.get(url);
            if(proxy != null){
                httpRequest.setProxy(proxy);
            }else{
                log.info("ip代理池为空");
                return null;
            }

            httpRequest.header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
            httpRequest.timeout(10000);
            HttpResponse response = httpRequest.execute();
//            HttpResponse response = HttpRequest.get(url).header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36")
//                    // 超时，毫秒
//                    .timeout(15000)
//                    .execute();
            Thread.sleep(1000 * (new Random().nextInt(5) + 5));
            int status = response.getStatus();
            if(status == 200){
                htmlString =  response.body();
            }else if (status == 302 || status == 301 ){
                log.info("请求次数："+requestNum+"次，请求status:"+status+"，重新请求！");
                Thread.sleep(1000 * 60 * 3);
                getDocumentByUrl(url,++requestNum);
            }else if (status == 405 ||  status == 403 ){
                log.info("请求次数："+requestNum+"次，请求status:"+status+"，重新请求！");
                getDocumentByUrl(url,++requestNum);
            }else{
                log.info("请求次数："+requestNum+"次，请求status:"+status+"，重新请求！");
                Thread.sleep(1000 * (new Random().nextInt(5) + 5));
                getDocumentByUrl(url,++requestNum);
            }
        }catch (Exception e){
            if(e instanceof HttpException){
                getDocumentByUrl(url,++requestNum);
            }
        }
        Document document = Jsoup.parse(htmlString);
        return document;
    }


    /**
     * 获取请求url
     * @param page  页数
     * @param bidTypeArr  类型
     * @param title  标题
     * @return
     */
    public  List<String> getUrlList(Integer page, String[] bidTypeArr, String title, Integer timeType) {
        List<String> urlList = new ArrayList<>();

        // 获取需要的招标类型
        if(bidTypeArr == null )bidTypeArr = new String[]{"0"};
        //
        // 获取当前日期
        String date1 = "";
        String date2 = "";
        if(timeType == null || timeType == 0){
            // 获取当前日期
             date1 = new SimpleDateFormat("yyyy:MM:dd").format(new Date());
             date2 = new SimpleDateFormat("yyyy:MM:dd").format(new Date());
            timeType = 0;
        } else if(timeType == 4){
           // 近三个月
            Calendar cal = Calendar.getInstance();
            cal.setTime(new Date());
            cal.add(Calendar.MONTH,-3);
            date1 = new SimpleDateFormat("yyyy:MM:dd").format(cal.getTime());
            date2 = new SimpleDateFormat("yyyy:MM:dd").format(new Date());
        }

        for (int i = 0; i <bidTypeArr.length ; i++) {
            String url = "http://search.ccgp.gov.cn/bxsearch?searchtype=1&dbselect=bidx&displayZone=&zoneId=&agentName=&pppStatus=0" +
                    "&bidSort=0" +     //  0：所有类别  1：中央公告  2：地方公告
                    "&buyerName=" +    // 采购人
                    "&projectId=" +    // 项目编号
                    "&pinMu=0"  +      // 品目   0：所有品目  1：货物类  2：工程类  3：服务类
                    "&bidType=" +  bidTypeArr[i] +   // 招标类型   0：所有类型  1：公开招标
                    "&kw=" +  (title !=null?title:"") +          // 标题
                    "&start_time=" + date1 +  // 开始日期
                    "&end_time=" + date2 +    // 结束日期
                    "&timeType=" + timeType;          // 时间类型  0：今日  1：近三日  2：近一周
            url = url + "&page_index=" + (page == null?1:page) ; //当前页数

            urlList.add(url);
        }
        return urlList;
    }

    /**
     *  获取公告内容
     * @param document
     * @param list
     * @param page
     * @param lastTime  上次请求时间
     * @return
     */
    public  Set<PublicNoticeWebCrawler> getPublicNoticeList(String url,Document document, Set<PublicNoticeWebCrawler> list,Integer page,Date lastTime){

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss");

        // 获取公告列表的ul
        Elements elements = document.getElementsByClass("vT-srch-result-list-bid");
        if(elements == null || elements.size() <= 0){
            log.info("当前页"+page+"公告资源列表为空！");
            log.info(document.html());
            log.info("打印内容结束！");
            list = crawlData2(url,page,list,lastTime);
            return list;
        }
        Elements children = elements.get(0).children();
        // 遍历ul下的li
        for (int i = 0; i < children.size(); i++) {
            try {
                Element li = children.get(i);
                PublicNoticeWebCrawler crawler = new PublicNoticeWebCrawler();
                // 获取公告具体地址
                Element child = li.child(0);
                String href = child.attr("href");
                crawler.setPublicNoticeUrl(href);
                // 标题
                String title = child.text().trim();
                crawler.setTitle(title);

                Element child2 = li.child(2);
                // 发布时间
                String[] split = child2.text().split(" ");
                String pulicTime = split[0] + " " +split[1];
                crawler.setPublicTime(sdf.parse(pulicTime));
                // 采购人
                String purchaseUser = split[3].split("：").length>1 ?split[3].split("：")[1] : "";
                crawler.setPurchaseUser(purchaseUser);
                // 代理机构
                String purchaseOrganization = split[5].split("：").length>1 ?split[5].split("：")[1] : "";
                crawler.setPurchaseOrganization(purchaseOrganization);
                // 招标方式
                String bidType = child2.getElementsByTag("strong").get(0).text().trim();
                crawler.setBidType(bidType);
                // 省份
                String province = child2.getElementsByTag("a").get(0).text().trim();
                crawler.setProvince(province);
                // 发布网站
                crawler.setPublicWeb("中国政府采购网");
                crawler.setIfAnalysis("0");// 没有解析过

                //  判断发布时间 是否小于  上次请求时间-30分钟
                if(crawler.getPublicTime().getTime() < (lastTime.getTime() - 30 * 60 * 1000) ){
                    log.info("当前页："+page +",集合长度:"+list.size());
                    return list;
                }
//                //  校验公告是否存在  存在则停止发送请求
//                PublicNoticeWebCrawler form = new PublicNoticeWebCrawler();
//                form.setTitle(crawler.getTitle());
//                form.setPublicWeb(crawler.getPublicWeb());
//                List<PublicNoticeWebCrawler> byEntity = publicNoticeWebCrawlerMapper.getByEntity(form);
//                if(byEntity != null  && byEntity.size()>0)return list;

                list.add(crawler);
            }catch (Exception e){
                e.printStackTrace();
            }
        }

        // 判断是否需要获取第2页 或者第3页内容
        int pageTotal = 1;
        Matcher m1 = Pattern.compile("共找到.*?条内容").matcher(document.text());
        if(m1.find()){
            String numStr = m1.group().split(" ")[1];
            Integer num = Integer.valueOf(numStr);
            pageTotal = num/20  + (num%20>0?1:0) ;
            log.info("当前页："+page +"，总条数："+num + ",总页数："+pageTotal+",集合长度:"+list.size());
        }
        if(pageTotal > page){
            page++;
            url = url.split("page_index=")[0] + "page_index=" + page ;
            list = crawlData2(url,page,list,lastTime);
        }else if(pageTotal == page){
//            // 更新对应的请求记录
//            updateRequestRecord("中国政府采购网", new SimpleDateFormat("yyyy-MM-dd").format(new Date()),url.split("&page_index")[0],page);
        }
        return  list;
    }




}
