package com.sbwork.proxy.service;

import com.alibaba.fastjson.JSONObject;
import com.sbwork.common.scheduler.QuartzManager;
import com.sbwork.common.scheduler.form.TaskForm;
import com.sbwork.proxy.entity.HttpProxyData;
import com.sbwork.proxy.entity.ProxyPool;
import com.sbwork.proxy.job.ProxyLoadMemoryJob;
import com.sbwork.proxy.persistence.HttpProxyDataMapper;
import com.sbwork.proxy.redis.JedisUtils;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Slf4j
public class LoadMemory  {

    private final TaskForm taskForm;
    @Resource
    private QuartzManager quartzManager;
    @Resource
    private HttpProxyDataMapper httpProxyDataMapper;


    public LoadMemory() {
        this.taskForm = new TaskForm();
    }

    @PostConstruct
    public void init() throws SchedulerException {
        this.taskForm.setCron("0 0 2 * * ? ");
        final String jobName = "memorylIpData";
        this.taskForm.setJobName(jobName);
        final String groupName = "crawlData";
        this.taskForm.setGroupName(groupName);
        this.quartzManager.addJob((Class) ProxyLoadMemoryJob.class, (Map) null, this.taskForm);

        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(10000L);
                this.quartzManager.runJobNow(this.taskForm);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        });
        thread.start();
    }

    /**
     * 执行定时任务   从数据库取
     */
    public void timerTask() {
        ProxyPool proxyPool = CrawlClient.proxyPool;
        List<HttpProxyData> dataList = httpProxyDataMapper.getAll();
        if(dataList != null  && dataList.size()>0){
            for (int i = 0; i < dataList.size(); i++) {
                proxyPool.add(dataList.get(i).getIp(), dataList.get(i).getPort());
            }
        }
    }

    /**
     * 执行定时任务   从redis中取
     */
//    public void timerTask() {
//        Set<String> set = JedisUtils.getProxyIp();
//        Iterator iterator = set.iterator();
//        ProxyPool proxyPool = CrawlClient.proxyPool;
//        while (iterator.hasNext()) {
//            String str = iterator.next().toString();
//            log.info("redis: "+str);
//            String proxyIp = str.substring(8).split(":")[0];
//            int proxyPort = Integer.valueOf(iterator.next().toString().substring(8).split(":")[1]);
//            proxyPool.add(proxyIp, proxyPort);
//        }
//    }
}
