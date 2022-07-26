package com.sbwork.dr.publicnotice.spider;

import cn.hutool.http.Header;
import cn.hutool.http.HttpRequest;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.util.ExcelUtils;
import com.sbwork.util.HttpClientUtil;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.regex.Pattern;

/**
 * 爬虫入口测试
 *
 * @author gcc gcc@bestgcc.cn
 */
public class SpiderApplication {

    /**
     * 入口方法
     * @param args
     */
    public static void main(String[] args) {
        // 要爬的网址
        String url = "http://ggzy.gz.gov.cn/jyywjsgcqtgczbgg/771821.jhtml";
//        String url = "https://gdgpo.czt.gd.gov.cn/freecms/site/gd/ggxx/info/2022/8a7e00c880330aa50180451f8f801179.html?noticeType=001011";
//        String url = "https://gdgpo.czt.gd.gov.cn/freecms/site/gd/ggxx/info/2022/8a7e00c880330aa501804ed9e1e97bce.html?noticeType=001011";
        // 第一步：获取网址返回的内容
        String htmlString = getDataByUrl(url);

        // 第二步：解析网址内容，拿到想要的数据
        List<PublicNoticeEntity> list = parseHtml(htmlString);

        // TODO 第三步： 处理爬取到的内容

        // TODO 第四步： 存入数据库

        // TODO 第五步： 导出
        exportExcel(list);
    }


    /**
     * 获取网址返回值
     *
     * @param url
     */
    public static String getDataByUrl(String url) {
        return HttpRequest.get(url)
                // 爬虫伪装
//                .header(Header.HOST, "gdgpo.czt.gd.gov.cn")
                .header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36")
                // 超时，毫秒
                .timeout(20000)
                .execute().body();
    }


    /**
     * 解析网站html内容
     * @return
     */
    public static List<PublicNoticeEntity> parseHtml(String htmlString) {

      // 将html文本转成Document
        Document document = Jsoup.parse(htmlString);
      // 获取所有文本内容
        String text = document.text();
        // 根据id 获取元素
        Element element = document.getElementById("print-content");

        List<PublicNoticeEntity> list = new ArrayList<>();
        PublicNoticeEntity entity = new PublicNoticeEntity();
        list.add(entity);

        return list;
    }

    /**
     * 导出
     * @param list
     */
    public static void exportExcel(List<PublicNoticeEntity> list)  {

//        ExcelUtils.exportExcel(users, "公告记录表", "公告信息", PublicNoticeEntity.class, "公告信息", response);
        String file = ExcelUtils.exportExcelToFile(list, "公告记录表", "公告信息", PublicNoticeEntity.class, "公告信息");
        System.out.println(file);

    }

}
