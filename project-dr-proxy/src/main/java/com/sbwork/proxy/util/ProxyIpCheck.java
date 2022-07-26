package com.sbwork.proxy.util;


import cn.hutool.http.Header;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import org.apache.commons.lang.StringUtils;

import java.net.Proxy;
import java.util.Random;
import static com.sbwork.proxy.config.PageConfig.checkPage;

public class ProxyIpCheck {
    private final static int DEFAULT_REUSE_TIME_INTERVAL = 1500;// ms，从一次请求结束到再次可以请求的默认时间间隔
    private static final int HTTP_CONNECT_TIMEOUT = 1000 * 3;
    private static final int HTTP_READ_TIMEOUT = 1000 * 3;

    public static HttpStatus Check(Proxy proxy) {
//        String url = "https://www.baidu.com/";
        String url = checkPage;
        if(StringUtils.isBlank(url))url = "https://www.baidu.com/";
//        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("101.200.127.149", 3129));
        HttpRequest  httpRequest = HttpRequest.get(url);
        httpRequest.setProxy(proxy);
        String userAgent = CrawerBase.ua[new Random().nextInt(CrawerBase.ua.length - 1)];
        httpRequest.header(Header.USER_AGENT, userAgent);
        httpRequest.timeout(5 * 1000);
        HttpResponse httpResponse;
        try {
             httpResponse = httpRequest.execute();
        }catch (Exception e){
            return HttpStatus.SC_BAD_REQUEST;
        }

        int code = httpResponse.getStatus();
        if (code == 200)
            return HttpStatus.SC_OK;
        else if (code == 403)
            return HttpStatus.SC_FORBIDDEN;
        else
            return HttpStatus.SC_BAD_REQUEST;
    }

//    public static HttpStatus Check(Proxy proxy) {
//        URL url = null;
//        HttpURLConnection uc = null;
//        try {
//            url = new URL("http://www.baidu.com/");
//            uc = (HttpURLConnection) url.openConnection(proxy);
//            String userAgent = CrawerBase.ua[new Random().nextInt(CrawerBase.ua.length - 1)];
//            uc.setRequestProperty("User-Agent", userAgent);
//            uc.setReadTimeout(HTTP_READ_TIMEOUT);
//            uc.setConnectTimeout(HTTP_CONNECT_TIMEOUT);
//
//            uc.connect();
//            int code = uc.getResponseCode();
//
//            if (code == 200)
//                return HttpStatus.SC_OK;
//            else if (code == 403)
//                return HttpStatus.SC_FORBIDDEN;
//            else
//                return HttpStatus.SC_BAD_REQUEST;
//
//        } catch (Exception e) {
//            return HttpStatus.SC_BAD_REQUEST;
//
//        } finally {
//            uc.disconnect();
//        }
//
//    }


}
