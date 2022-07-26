package com.sbwork.dr.service;

import com.sbwork.dr.DrConstant;
import com.sbwork.rm.service.RmRoleService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Timer;
import java.util.TimerTask;

/**
 * @author sbjw
 */
@Component
public class DrService {

    @Resource
    private RmRoleService rmRoleService;

    @PostConstruct
    public void init() {
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                rmRoleService.quickCreateRole(DrConstant.ROLE_DR_ADMIN, "数据接收管理员");
                rmRoleService.quickCreateRole(DrConstant.ROLE_DR_USER, "数据接收普通用户");
            }
        };

        Timer timer = new Timer();

        //延时10s启动
        timer.schedule(timerTask, 10000);
    }
}
