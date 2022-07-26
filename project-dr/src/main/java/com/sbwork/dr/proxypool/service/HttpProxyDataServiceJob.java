package com.sbwork.dr.proxypool.service;

import com.sbwork.systemConfig.SpringBeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@Slf4j
public class HttpProxyDataServiceJob implements Job {


    private HttpProxyDataService dataService = null;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        if (dataService == null) {
            dataService = SpringBeanUtil.getBean(HttpProxyDataService.class);
        }
        dataService.timerTask();
    }

}
