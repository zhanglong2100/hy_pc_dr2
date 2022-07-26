package com.sbwork.dr;

import cn.hutool.http.Header;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import org.apache.http.HttpConnection;

import java.io.IOException;
import java.net.*;
import java.util.Properties;

public class Test {
    public static void main(String[] args) throws IOException {
//          System.getProperties().setProperty("proxySet","true");
//          System.getProperties().setProperty("http.proxyHost","125.87.81.168");
//          System.getProperties().setProperty("http.proxyPort","13214");

//        Properties properties=System.getProperties();
//        for(String propertyName:properties.stringPropertyNames()) {
//            System.out.println("系统变量:"+propertyName+"="+properties.getProperty(propertyName));
//        }

//        URL url = new URL("");
//        URLConnection con = url.openConnection();
//        con.setRequestProperty("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
//        con.connect();


//        String url = "http://www.yngp.com/newbulletin_zz.do?method=preinsertgomodify&operator_state=3918C92CF8BC9920&flag=6D8C6192C25679D6&bulletin_id=296F2B499DF956CE0ACE3A71CC1B3C5CAB01B3D99C3E31093D65A4F5508577CD&_kt_=6618959702124";
//        String url = "https://www.baidu.com/";
        String url = "http://search.ccgp.gov.cn/bxsearch?searchtype=1&dbselect=bidx&displayZone=&zoneId=&agentName=&pppStatus=0" +
                "&bidSort=0" +     //  0：所有类别  1：中央公告  2：地方公告
                "&buyerName=" +    // 采购人
                "&projectId=" +    // 项目编号
                "&pinMu=0"  +      // 品目   0：所有品目  1：货物类  2：工程类  3：服务类
                "&bidType=0" +  // 招标类型   0：所有类型  1：公开招标
                "&kw=" +          // 标题
                "&start_time=2022:06:24"  +  // 开始日期
                "&end_time=2022:06:24" +    // 结束日期
                "&timeType=0" ;          // 时间类型  0：今日  1：近三日  2：近一周
        url = url + "&page_index=" + 1 ; //当前页数


//        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("120.71.147.244", 8901));
//        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("101.200.127.149", 3129));
//        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("111.225.153.239", 8089));
        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("120.42.46.226", 6666));
//        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("120.26.14.114", 8888));
//        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("120.71.147.244", 8901));
        HttpRequest  httpRequest = HttpRequest.get(url);
        httpRequest.setProxy(proxy);
        httpRequest.header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36");
//        httpRequest.header(Header.REFERER,"http://search.ccgp.gov.cn/bxsearch?searchtype=1&page_index=9&bidSort=0&buyerName=&projectId=&pinMu=0&bidType=1&dbselect=bidx&kw=&start_time=2022%3A06%3A21&end_time=2022%3A06%3A24&timeType=1&displayZone=&zoneId=&pppStatus=0&agentName=");
//        httpRequest.header(Header.HOST,"search.ccgp.gov.cn");
//        httpRequest.header(Header.ACCEPT,"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
//        httpRequest.header(Header.COOKIE,"Hm_lvt_9f8bda7a6bb3d1d7a9c7196bfed609b5=1655448698,1655794985,1655967060,1656031495; Hm_lpvt_9f8bda7a6bb3d1d7a9c7196bfed609b5=1656031495; Hm_lvt_9459d8c503dd3c37b526898ff5aacadd=1654498061,1654761732,1655967068,1656031496; JSESSIONID=fwqTMfOAgjglzIkEsSUbs1GKQGfkMLM2FAw0Br0I8Gzf_VR2KvpA!1179140079; Hm_lpvt_9459d8c503dd3c37b526898ff5aacadd=1656032434");
        httpRequest.timeout(10 * 1000);
        HttpResponse httpResponse = httpRequest.execute();
//        HttpResponse httpResponse = HttpRequest.get(url)
//                // 爬虫伪装
//                //.header(Header.HOST, "gdgpo.czt.gd.gov.cn")
//                .header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36")
//                // 超时，毫秒
//                .timeout(30 * 1000)
//                .execute();

        String body = httpResponse.body();
        System.out.println(httpResponse.getStatus());

    }
}
