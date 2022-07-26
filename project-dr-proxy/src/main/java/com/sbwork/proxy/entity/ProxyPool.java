package com.sbwork.proxy.entity;


import com.sbwork.proxy.persistence.HttpProxyDataMapper;
import com.sbwork.proxy.redis.JedisUtils;
import com.sbwork.proxy.searchForm.HttpProxyDataSearchForm;
import com.sbwork.proxy.service.HttpProxyDataService;
import com.sbwork.proxy.util.BeansUtils;
import com.sbwork.proxy.util.HttpStatus;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.DelayQueue;

@Slf4j
public class ProxyPool {

    private BlockingQueue<HttpProxy> idleQueue = new DelayQueue<HttpProxy>(); // 存储空闲的Proxy
    private Map<String, HttpProxy> totalQueue = new ConcurrentHashMap<String, HttpProxy>(); //  private int id;
    //private String u_name;



    /**
     * 添加Proxy
     *
     * @param httpProxies
     */
    public void add(HttpProxy... httpProxies) {
        for (HttpProxy httpProxy : httpProxies) {
            if (totalQueue.containsKey(httpProxy.getKey())) {
                continue;
            }

            idleQueue.add(httpProxy);
            totalQueue.put(httpProxy.getKey(), httpProxy);

        }
    }

    public void add(String address, int port) {

        this.add(new HttpProxy(address, port));
    }

    /**
     * 得到Proxy
     *
     * @return
     */
    public HttpProxy borrow() {
        HttpProxy httpProxy = null;
        try {
            Long time = System.currentTimeMillis();
            httpProxy = idleQueue.take();
            double costTime = (System.currentTimeMillis() - time) / 1000.0;

            HttpProxy p = totalQueue.get(httpProxy.getKey());
            p.borrow();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        if (httpProxy == null) {
            throw new NoSuchElementException();
        }
        return httpProxy;
    }

    /**
     * 反馈 Proxy
     *
     * @param httpProxy
     * @param httpStatus
     */
    public void reback(HttpProxy httpProxy, HttpStatus httpStatus) {
        switch (httpStatus) {
            case SC_OK:
                httpProxy.success();
                httpProxy.setReuseTimeInterval(HttpProxy.DEFAULT_REUSE_TIME_INTERVAL);
                break;
            case SC_FORBIDDEN:
                httpProxy.fail(httpStatus);
                httpProxy.setReuseTimeInterval(HttpProxy.FAIL_REVIVE_TIME_INTERVAL * (httpProxy.getFailedNum() + 1)); // 被网站禁止，调节更长时间的访问频率
                break;
            default:
                httpProxy.fail(httpStatus);
                httpProxy.setReuseTimeInterval(HttpProxy.FAIL_REVIVE_TIME_INTERVAL * (httpProxy.getFailedNum() + 1)); // Ip可能无效，调节更长时间的访问频率
                break;
        }
        if (httpProxy.getFailedNum() > 2) { // 连续失败超过 3 次，移除代理池队列
            // 如果数据中存在 则删除
            HttpProxyDataService httpProxyDataService = BeansUtils.getBean(HttpProxyDataService.class);
            httpProxyDataService.remove(httpProxy);

            return;
        }

        if (httpProxy.getSucceedNum() > 5   ) {
            //todo 能力有限,后续估计也加不上了 0.0 if (ScanningPool.b) ScanningPool.scanningProxyIp(httpProxy);//扫描ip段
            try {
//                //持久化到磁盘,提供代理ip服务
//                JedisUtils.setProxyIp(httpProxy);//连续成功超过 5次，移除代理池队列,存储到redis
                // 存入数据库
                HttpProxyDataService httpProxyDataService = BeansUtils.getBean(HttpProxyDataService.class);
                httpProxyDataService.commit(httpProxy);
            }catch (Exception e){
                e.printStackTrace();
            }
            return;
        }

        if (httpProxy.getBorrowNum() >= 30) {

            return;
        }
        try {
            idleQueue.put(httpProxy);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void allProxyStatus() {
        String re = "all proxy info >>>> \n";
        for (HttpProxy httpProxy : idleQueue) {
            re += httpProxy.toString() + "\n";

        }
        log.info(re);
    }

    /**
     * 获取当前空闲的Proxy
     *
     * @return
     */
    public int getIdleNum() {

        return idleQueue.size();
    }


}
