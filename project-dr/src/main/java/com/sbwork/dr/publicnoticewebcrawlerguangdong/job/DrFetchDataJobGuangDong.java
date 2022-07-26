package com.sbwork.dr.publicnoticewebcrawlerguangdong.job;

import com.sbwork.dr.publicnoticewebcrawlerguangdong.entity.PublicNoticeWebCrawlerGuangDong;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.service.PublicNoticeWebCrawlGuangDong;
import com.sbwork.systemConfig.SpringBeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@Slf4j
public class DrFetchDataJobGuangDong implements Job {


    private PublicNoticeWebCrawlGuangDong dataService = null;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        if (dataService == null) {
            dataService = SpringBeanUtil.getBean(PublicNoticeWebCrawlGuangDong.class);
        }
        dataService.timerTask();
    }

}
