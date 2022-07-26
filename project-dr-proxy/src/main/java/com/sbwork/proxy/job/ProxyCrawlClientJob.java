package com.sbwork.proxy.job;

import com.sbwork.proxy.service.CrawlClient;
import com.sbwork.systemConfig.SpringBeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@Slf4j
public class ProxyCrawlClientJob implements Job {


    private CrawlClient dataService = null;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        if (dataService == null) {
            dataService = SpringBeanUtil.getBean(CrawlClient.class);
        }
        dataService.timerTask();
    }

}
