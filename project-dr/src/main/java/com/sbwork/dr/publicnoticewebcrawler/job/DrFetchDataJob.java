package com.sbwork.dr.publicnoticewebcrawler.job;

import com.sbwork.dr.publicnoticewebcrawler.service.PublicNoticeWebCrawlService;
import com.sbwork.systemConfig.SpringBeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@Slf4j
public class DrFetchDataJob implements Job {


    private PublicNoticeWebCrawlService dataService = null;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        if (dataService == null) {
            dataService = SpringBeanUtil.getBean(PublicNoticeWebCrawlService.class);
        }
        dataService.timerTask();
    }

}
