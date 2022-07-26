package com.sbwork.dr.baidu;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;


import com.sbwork.dr.utils.SslUtils;
import com.sbwork.dr.utils.Base64Util;
import com.sbwork.dr.utils.FileUtil;
import com.sbwork.dr.utils.HttpUtil;
import org.jsoup.Connection;
import org.jsoup.Jsoup;

import java.io.File;
import java.net.URLEncoder;
import java.util.Date;

public class AnalysisVerificationCodeByBaiDu {

    public static void main(String[] args) throws Exception {
        SslUtils.ignoreSsl();
        String codeimgurl = "https://gdgpo.czt.gd.gov.cn/freecms/verify/verifyCode.do?createTypeFlag=n&name=notice&d" + new Date().getTime();
          analysisVerificationCode(codeimgurl);
    }

    /**
     * codeimgurl
     *
     * @return
     */
    public static void analysisVerificationCode(String codeimgurl) {
        // 请求url
        String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/numbers";//https://aip.baidubce.com/rest/2.0/ocr/v1/idcard,https://aip.baidubce.com/rest/2.0/ocr/v1/driving_license
        String result = "";
        JSONObject parseObject = null;


        try {
            String codeimgpath = new File(".").getCanonicalPath() + File.separator + "file";
            //下载验证码图片
//            HttpRequest httpRequest = HttpRequest.get(url);
//            httpRequest.header(Header.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
//            httpRequest.header("Accept","*/*");
//            httpRequest.timeout(10000);
//            httpRequest.cookie("JSESSIONID=829CFB983FC9942DD091F16BA3C4CBC7; the_codes=440001; the_codesIndex=%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%9C%AC%E7%BA%A7; is_read=1");
//            httpRequest.setSSLSocketFactory(getUnsafeSslSocketFactory());

//            HttpResponse response = httpRequest.execute();
//            byte[] codeimgdata = response.bodyBytes();



//            byte[] codeimgdata = Jsoup.connect(codeimgurl).ignoreContentType(true).execute().bodyAsBytes();
            Connection connect = Jsoup.connect(codeimgurl);
//            connect.header("Accept","image/jpeg");
//            connect.header("Content-Type","image/jpeg");
//            connect.header("Accept-Encoding","gzip, deflate, br");
//            connect.header("Connection","keep-alive");
//            connect.cookie("JSESSIONID","43AB07C177A3D224A427F011FD83E856");
            connect.ignoreContentType(true);
            byte[] codeimgdata = connect.execute().bodyAsBytes();
            FileUtil.saveImg(codeimgdata, codeimgpath, "codeimg.jpg");

            // 本地文件路径
            String filePath = codeimgpath + "\\codeimg.jpg";
//            byte[] imgData = file.getBytes();
            byte[] imgData = FileUtil.readFileByBytes(filePath);

            String imgStr = Base64Util.encode(imgData);
//            String imgStr = Base64Util.encode(codeimgdata);
            String imgParam = URLEncoder.encode(imgStr, "UTF-8");

            String param = "image=" + imgParam;
//            String param = "image=" + imgParam+"&id_card_side=front";

            // 注意这里仅为了简化编码每一次请求都去获取access_token，线上环境access_token有过期时间， 客户端可自行缓存，过期后重新获取。
//            String accessToken = "24.1d26f52cf64f2c9bb91df0cca4148109.2592000.1658911573.282335-15742445";
            String accessToken = "24.460da4889caad24cccdb1fea17221975.2592000.1491995545.282335-1234567";
//            String accessToken = AuthService.getAuth();
            result = HttpUtil.post(url, accessToken, param);
            parseObject = JSONArray.parseObject(result);

            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }




    private static void trustAllHttpsCertificates() throws Exception {
        javax.net.ssl.TrustManager[] trustAllCerts = new javax.net.ssl.TrustManager[1];
        javax.net.ssl.TrustManager tm = new miTM();
        trustAllCerts[0] = tm;
        javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext
                .getInstance("SSL");
        sc.init(null, trustAllCerts, null);
        javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc
                .getSocketFactory());
    }

    static class miTM implements javax.net.ssl.TrustManager,
            javax.net.ssl.X509TrustManager {
        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return null;
        }

        public boolean isServerTrusted(
                java.security.cert.X509Certificate[] certs) {
            return true;
        }

        public boolean isClientTrusted(
                java.security.cert.X509Certificate[] certs) {
            return true;
        }

        public void checkServerTrusted(
                java.security.cert.X509Certificate[] certs, String authType)
                throws java.security.cert.CertificateException {
            return;
        }

        public void checkClientTrusted(
                java.security.cert.X509Certificate[] certs, String authType)
                throws java.security.cert.CertificateException {
            return;
        }
    }


//    public static SSLSocketFactory getUnsafeSslSocketFactory(){
//        try {
//            final TrustManager[] trustAllCerts = new TrustManager[]{
//                    new X509TrustManager() {
//                        @Override
//                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) {
//                        }
//
//                        @Override
//                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) {
//                        }
//
//                        @Override
//                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
//                            return new java.security.cert.X509Certificate[]{};
//                        }
//                    }
//            };
//
//            SSLContext sslContext = SSLContext.getInstance("SSL");
//            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
//
//            return sslContext.getSocketFactory();
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }


}





