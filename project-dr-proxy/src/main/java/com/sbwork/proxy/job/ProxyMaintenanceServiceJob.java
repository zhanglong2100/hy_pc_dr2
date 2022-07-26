package com.sbwork.proxy.job;

import com.sbwork.proxy.service.MaintenanceService;
import com.sbwork.systemConfig.SpringBeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@Slf4j
public class ProxyMaintenanceServiceJob implements Job {


    private MaintenanceService dataService = null;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        if (dataService == null) {
            dataService = SpringBeanUtil.getBean(MaintenanceService.class);
        }
        dataService.timerTask();
    }

}
