//package com.sbwork.dr.publicnoticewebcrawler.demo;
//
//import cn.edu.hfut.dmic.webcollector.model.CrawlDatum;
//import cn.edu.hfut.dmic.webcollector.model.CrawlDatums;
//import cn.edu.hfut.dmic.webcollector.model.Page;
//import cn.edu.hfut.dmic.webcollector.plugin.berkeley.BreadthCrawler;
//import cn.hutool.http.HttpRequest;
//import cn.hutool.http.HttpUtil;
//import org.jsoup.nodes.Document;
//
//public class ChinaPruchaseWebDemo extends BreadthCrawler {
//
//
//    public ChinaPruchaseWebDemo(String crawlPath, boolean autoParse) {
//        super(crawlPath, autoParse);
//        String url = "http://search.ccgp.gov.cn/bxsearch?" +
//                                "searchtype=1" +
//                                "&page_index=1" +
//                                "&bidSort=0" +
//                                "&buyerName=" +
//                                "&projectId=" +
//                                "&pinMu=0"  +
//                                "&bidType=3" +
//                                "&dbselect=bidx" +
//                                "&kw=" +
//                                "&start_time=2022%05%24" +
//                                "&end_time=2022%05%31" +
//                                "&timeType=2" +
//                                "&displayZone=" +
//                                "&zoneId=" +
//                                "&pppStatus=0" +
//                                "&agentName=";
//        CrawlDatum datum = new CrawlDatum(url);
//        datum.meta("method","GET");
//
////        String body = HttpRequest.get(url).execute().body();
////        System.out.println(111);
//
//        addSeed(datum);
//    }
//
//    @Override
//    public void visit(Page page, CrawlDatums crawlDatums) {
//        Document doc = page.doc();
//
//    }
//
//    public static void main(String[] args) throws Exception {
//        ChinaPruchaseWebDemo demo = new ChinaPruchaseWebDemo("crawl",true);
//        demo.start(1);
//    }
//}
