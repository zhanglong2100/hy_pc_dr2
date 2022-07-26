package com.sbwork.dr.proxypool.service;


import com.sbwork.common.scheduler.QuartzManager;
import com.sbwork.common.scheduler.form.TaskForm;
import com.sbwork.dr.proxypool.entity.HttpProxyData;
import com.sbwork.dr.proxypool.persistence.HttpProxyDataMapper;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class HttpProxyDataService {

    @Resource
    private HttpProxyDataMapper httpProxyDataMapper;

    private  List<HttpProxyData> dataList = new ArrayList<>();


    private final TaskForm taskForm;
    @Resource
    private QuartzManager quartzManager;


    public HttpProxyDataService() {
        this.taskForm = new TaskForm();
    }

    @PostConstruct
    public void init() throws SchedulerException {
        this.taskForm.setCron("0 */30 * * * ? ");
        final String jobName = "maintenanceIpData";
        this.taskForm.setJobName(jobName);
        final String groupName = "crawlData";
        this.taskForm.setGroupName(groupName);
        this.quartzManager.addJob((Class) HttpProxyDataServiceJob.class, (Map) null, this.taskForm);

        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(2000L);
                this.quartzManager.runJobNow(this.taskForm);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        });
        thread.start();
    }

    /**
     * 获取ip代理
     * @return
     */
    public Proxy getProxyIp() {
//        List<HttpProxyData> dataList = httpProxyDataMapper.getAll();

        if(dataList != null  && dataList.size()>0){
            HttpProxyData httpProxyData = dataList.get(new Random().nextInt(dataList.size()));
            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(httpProxyData.getIp(), httpProxyData.getPort()));
//            log.info("代理ip: "+ httpProxyData.getIp() + "，代理ip端口: "+httpProxyData.getPort() + "，成功率: " + httpProxyData.getSuccessRate());
            return proxy;
        }
        return null;
    }

    /**
     * 执行定时任务   刷新ip代理池
     */
    public void timerTask() {
        dataList = httpProxyDataMapper.getAll();
    }
}
