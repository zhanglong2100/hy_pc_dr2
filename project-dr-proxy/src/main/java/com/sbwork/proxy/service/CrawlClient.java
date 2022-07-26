package com.sbwork.proxy.service;

import cn.hutool.core.io.IORuntimeException;
import cn.hutool.http.Header;
import cn.hutool.http.HttpException;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import com.sbwork.common.scheduler.QuartzManager;
import com.sbwork.common.scheduler.form.TaskForm;

import com.sbwork.proxy.entity.ProxyPool;
import com.sbwork.proxy.job.ProxyCrawlClientJob;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Map;
import static com.sbwork.proxy.config.PageConfig.list;

@Service
@Slf4j
public class CrawlClient {

    private final TaskForm taskForm;
    @Resource
    private QuartzManager quartzManager;

    private static int count = 0;

    public static ProxyPool proxyPool = new ProxyPool();

    public CrawlClient() {
        this.taskForm = new TaskForm();
    }

    @PostConstruct
    public void init() throws SchedulerException {
        this.taskForm.setCron("0 0 * * * ? ");
        final String jobName = "crawlIpData";
        this.taskForm.setJobName(jobName);
        final String groupName = "crawlData";
        this.taskForm.setGroupName(groupName);
        this.quartzManager.addJob((Class) ProxyCrawlClientJob.class, (Map) null, this.taskForm);

        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(3000L);
                this.quartzManager.runJobNow(this.taskForm);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        });
        thread.start();
    }


    /**
     * 执行定时任务
     */
    public void timerTask() {
        synchronized (CrawlClient.class) {
            count++;
        }
        log.info("#####第" + count + "次开始爬取#####");
        crawlIpData();
        log.info("#####爬取完毕#####");
    }

    /**
     * 抓取代理ip数据
     */
    private void crawlIpData() {
        for (int i = 0; i < list.size(); i++) {
            String url = list.get(i);
            HttpRequest httpRequest = HttpRequest.get(url);
            httpRequest.header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
            httpRequest.timeout(10000);

            try{
                HttpResponse response = httpRequest.execute();
                int status = response.getStatus();
                if (status == 200) {
                    String htmlString = response.body();
                    Document document = Jsoup.parse(htmlString);
                    if (url.contains("http://www.kxdaili.com/dailiip")) {
                        // 获取开心代理ip
                        getKaiXingDaiLiIp(document, url);
                    }
                } else {
                    log.info("请求url：" + url + "，请求status:" + status );
                }
            }catch (Exception e){
                if(e instanceof IORuntimeException || e instanceof HttpException){
                    // 网络连接超时
                    log.info("请求url：" + url + "，网络连接超时");
                }
                e.printStackTrace();
            }
        }
    }

    /**
     * @param document
     */
    private void getKaiXingDaiLiIp(Document document, String url) {
        Elements trs = document.select("table").get(0).select("tr");
        for (int i = 1; i < trs.size(); i++) {
            Elements tds = trs.get(i).select("td");

            String ip = tds.get(0).text();
            int port = Integer.parseInt(tds.get(1).text());
            String area = tds.get(5).text();
            log.info(url + "#" + ip + ":" + port + "#"+area);
            CrawlClient.proxyPool.add(ip, port);
        }
    }

}
