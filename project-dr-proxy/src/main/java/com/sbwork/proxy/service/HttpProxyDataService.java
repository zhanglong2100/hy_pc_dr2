package com.sbwork.proxy.service;


import com.sbwork.proxy.entity.HttpProxy;
import com.sbwork.proxy.entity.HttpProxyData;
import com.sbwork.proxy.persistence.HttpProxyDataMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.InetSocketAddress;

@Service
@Slf4j
public class HttpProxyDataService {

    @Resource
    private HttpProxyDataMapper httpProxyDataMapper;

    public void commit (HttpProxy httpProxy){
        HttpProxyData data = new HttpProxyData();
        InetSocketAddress address = (InetSocketAddress) httpProxy.getProxy().address();
        data.setIp(address.getAddress().getHostAddress());
        data.setPort(address.getPort());
        // 判断是否存在
        HttpProxyData proxyData = httpProxyDataMapper.getUniqueByEntity(data);
        if(proxyData != null){
            // 存在 则更新
            proxyData.setBorrowNum(httpProxy.getBorrowNum());
            proxyData.setFailedNum(httpProxy.getFailedNum());
            proxyData.setSucceedNum(httpProxy.getSucceedNum());

            float rate = (Float.valueOf(httpProxy.getSucceedNum()) / Float.valueOf(httpProxy.getBorrowNum()) * 100);
            BigDecimal bigDecimal = new BigDecimal(rate).setScale(2, RoundingMode.HALF_UP);
            proxyData.setSuccessRate(bigDecimal.doubleValue());

            httpProxyDataMapper.update(proxyData);
            log.info("更新动态代理："+proxyData.toString());
        }else{
            // 不存在  则存入数据
            data.setBorrowNum(httpProxy.getBorrowNum());
            data.setFailedNum(httpProxy.getFailedNum());
            data.setSucceedNum(httpProxy.getSucceedNum());

            float rate = (Float.valueOf(httpProxy.getSucceedNum()) / Float.valueOf(httpProxy.getBorrowNum()) * 100);
            BigDecimal bigDecimal = new BigDecimal(rate).setScale(2, RoundingMode.HALF_UP);
            data.setSuccessRate(bigDecimal.doubleValue());

            httpProxyDataMapper.insert(data);
            log.info("添加动态代理："+data.toString());
        }
    }


    public void remove (HttpProxy httpProxy){
        HttpProxyData data = new HttpProxyData();
        InetSocketAddress address = (InetSocketAddress) httpProxy.getProxy().address();
        data.setIp(address.getAddress().getHostAddress());
        data.setPort(address.getPort());
        // 判断是否存在
        HttpProxyData proxyData = httpProxyDataMapper.getUniqueByEntity(data);
        if(proxyData != null){
            httpProxyDataMapper.delete(proxyData);
            log.info("删除动态代理："+proxyData.toString());
        }
    }


}
