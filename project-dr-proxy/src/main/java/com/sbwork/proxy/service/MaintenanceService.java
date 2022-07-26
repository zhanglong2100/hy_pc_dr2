package com.sbwork.proxy.service;

import com.sbwork.common.scheduler.QuartzManager;
import com.sbwork.common.scheduler.form.TaskForm;
import com.sbwork.proxy.entity.HttpProxy;
import com.sbwork.proxy.entity.ProxyPool;
import com.sbwork.proxy.job.ProxyMaintenanceServiceJob;
import com.sbwork.proxy.util.Executor;
import com.sbwork.proxy.util.HttpStatus;
import com.sbwork.proxy.util.ProxyIpCheck;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ThreadPoolExecutor;


@Service
@Slf4j
public class MaintenanceService  {

    private final TaskForm taskForm;
    @Resource
    private QuartzManager quartzManager;

    ProxyPool proxyPool = null;
    private static int count = 0;
    private Integer countLock = 2;

    public MaintenanceService() {
        this.taskForm = new TaskForm();
    }

    @PostConstruct
    public void init() throws SchedulerException {
        this.taskForm.setCron("0 */10 * * * ? ");
        final String jobName = "maintenanceIpData";
        this.taskForm.setJobName(jobName);
        final String groupName = "crawlData";
        this.taskForm.setGroupName(groupName);
        this.quartzManager.addJob((Class) ProxyMaintenanceServiceJob.class, (Map) null, this.taskForm);

        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(15000L);
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
        synchronized (countLock) {
            count++;
        }
        try {
            proxyPool = CrawlClient.proxyPool;
            log.info("爬虫ip池第" + count + "次开始测试");
            int idleNum = proxyPool.getIdleNum();
            log.info("idleNum:" + idleNum);
            int size = idleNum  / 5;
            int z = 0;
            if (size != 0) {
                z = idleNum / size;
            }
            countLock = size;
            CountDownLatch countDownLatch = new CountDownLatch(countLock);

            ThreadPoolExecutor executor= Executor.newMyexecutor(size);
            executor.allowCoreThreadTimeOut(true);
            for (int j = 0; j < size; j++) {
                A a = new A(j, z,countDownLatch);
                executor.execute(a);
                log.info("线程池中现在的线程数目是："+executor.getPoolSize()+
                        ",  队列中正在等待执行的任务数量为："+
                        executor.getQueue().size());
            }

            countDownLatch.await();
        } catch (InterruptedException e) {
            log.error(e.getMessage());
        }finally {
            //executor.shutdown();
        }

        log.info("爬虫ip池第" + count + "次测试结果");
        proxyPool.allProxyStatus();  // 可以获取 ProxyPool 中所有 Proxy 的当前状态
    }


    class A implements Runnable {

        int j;
        int z;
        CountDownLatch latch;
        public A(int j, int z,CountDownLatch latch) {

            this.j = j;
            this.z = z;
            this.latch = latch;
        }

        @Override
        public void run() {
            log.info("多线程分片跑区间:" + (j * z + 1) + "-" + ((j + 1) * z));
            for (int i = j * z + 1; i < (j + 1) * z; i++) {
                HttpProxy httpProxy = proxyPool.borrow();
                HttpStatus code = ProxyIpCheck.Check(httpProxy.getProxy());
                log.info("name:" + Thread.currentThread().getName() + httpProxy.getProxy() + ":" + code);

                proxyPool.reback(httpProxy,code); // 使用完成之后，归还 Proxy,并将请求结果的 http 状态码一起传入
            }
            latch.countDown();
            log.info("当前线程" + Thread.currentThread().getName() + "执行完毕:");
        }
    }
}
