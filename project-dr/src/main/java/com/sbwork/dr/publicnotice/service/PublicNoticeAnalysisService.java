package com.sbwork.dr.publicnotice.service;

import com.sbwork.base.service.BaseService;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.form.PublicNoticeForm;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import org.apache.commons.lang.StringUtils;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 采购 公告解析类
 */
@Service
public class PublicNoticeAnalysisService  {



    /**
     * 采购、交易公告解析
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisPurchasePublicNotice(PublicNoticeEntity entity, String text){

        // 项目编号
        this.analysisPurchase(entity,text);
        // 获取招标文件时间
        this.analysisBiddingTime(entity,text);
        // 提交投标文件截止时间
        this.analysisEndTime(entity,text);
        // 采购人信息名称  采购联系方式
        this.analysisPurchaseUser(entity,text);
        // 代理机构/采购代理机构信息名称   采购机构联系方式
        this.analysisPurchaseOrganization(entity,text);
        // 项目联系人  项目联系人电话
        this.analysisProjectContact(entity,text);

        return entity;
    }




    /**
     * 解析  项目编号  项目名称  采购方式 预算金额
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisPurchase(PublicNoticeEntity entity,String text){

        // 获取指定字符串
        String textStr = "";
        if(text.indexOf("一、项目基本情况") != -1 && text.indexOf("二、申请人的资格要求",text.indexOf("一、项目基本情况")) != -1){
            textStr = text.substring(text.indexOf("一、项目基本情况"), text.indexOf("二、申请人的资格要求",text.indexOf("一、项目基本情况")));
        }else if(text.indexOf("一、 项目基本情况") != -1 && text.indexOf("二、申请人的资格要求",text.indexOf("一、 项目基本情况")) != -1){
            textStr = text.substring(text.indexOf("一、 项目基本情况"), text.indexOf("二、申请人的资格要求",text.indexOf("一、 项目基本情况")));
        }else if(text.indexOf("一、项目基本情况") != -1 && text.indexOf("二、申请人资格要求",text.indexOf("一、项目基本情况")) != -1){
            textStr = text.substring(text.indexOf("一、项目基本情况"), text.indexOf("二、申请人资格要求",text.indexOf("一、项目基本情况")));
        }else if(text.indexOf("一、项目简介") != -1 && text.indexOf("二、供应商资格要求",text.indexOf("一、项目简介")) != -1){
            textStr = text.substring(text.indexOf("一、项目简介"), text.indexOf("二、供应商资格要求",text.indexOf("一、项目简介")));
        }else if(text.indexOf("一、项目基本情况") != -1 && text.indexOf("二、供应商的资格要求",text.indexOf("一、项目基本情况")) != -1){
            textStr = text.substring(text.indexOf("一、项目基本情况"), text.indexOf("二、供应商的资格要求",text.indexOf("一、项目基本情况")));
        }else if(text.indexOf("一、项目基本情况") != -1 && text.indexOf("二、投标人的资格要求",text.indexOf("一、项目基本情况")) != -1){
            textStr = text.substring(text.indexOf("一、项目基本情况"), text.indexOf("二、投标人的资格要求",text.indexOf("一、项目基本情况")));
        }else if(text.indexOf("一、") != -1 && text.indexOf("二、",text.indexOf("一、")) != -1){
            textStr = text.substring(text.indexOf("一、"), text.indexOf("二、",text.indexOf("一、")));
        }

        if(StringUtils.isBlank(textStr))return entity;
//        textStr = textStr.substring(textStr.indexOf(" ")).trim();

        if(StringUtils.isBlank(entity.getProjectCode())){
            if(textStr.indexOf("项目编号：") != -1){
                String str = textStr.substring(textStr.indexOf("项目编号：") + 5).trim();
                entity.setProjectCode(str.split(" ")[0]);
            }else if(textStr.indexOf("项目编号") != -1){
                String str = textStr.substring(textStr.indexOf("项目编号") + 4).trim();
                entity.setProjectCode(str.split(" ")[0]);
            }else if(textStr.indexOf("代理编号：") != -1){
                String str = textStr.substring(textStr.indexOf("代理编号：") + 5).trim();
                entity.setProjectCode(str.split(" ")[0]);
            }
        }


        if(StringUtils.isBlank(entity.getProjectName())){
            if(StringUtils.isBlank(entity.getProjectName())){
                if(textStr.indexOf("项目名称：") != -1){
                    String str = textStr.substring(textStr.indexOf("项目名称：") + 5).trim();
                    entity.setProjectName(str.split(" ")[0]);
                }else if(textStr.indexOf("项目名称:") != -1){
                    String str = textStr.substring(textStr.indexOf("项目名称:") + 5).trim();
                    entity.setProjectName(str.split(" ")[0]);
                }else if(textStr.indexOf("项目名称") != -1){
                    String str = textStr.substring(textStr.indexOf("项目名称") + 4).trim();
                    entity.setProjectName(str.split(" ")[0]);
                }
            }
        }


        if(StringUtils.isBlank(entity.getPurchaseType())){
            if(textStr.indexOf("采购方式：") != -1){
                String str = textStr.substring(textStr.indexOf("采购方式：") + 5).trim();
                entity.setPurchaseType(str.split(" ")[0]);
            }else if(textStr.indexOf("采购方式") != -1){
                String str = textStr.substring(textStr.indexOf("采购方式") + 4).trim();
                entity.setPurchaseType(str.split(" ")[0]);
            }else{
                if(StringUtils.isBlank(entity.getPurchaseType()) && "采购公告".equals(entity.getPublicNoticeType()) )entity.setPurchaseType("公开招标");
            }
        }

        if(StringUtils.isBlank(entity.getBudget())){
             if(textStr.indexOf("采购预算：") != -1){
                String str = textStr.substring(textStr.indexOf("采购预算：") + 5).trim();
                entity.setBudget(str.split(" ")[0]);
            }else if(textStr.indexOf("预算金额：") != -1){
                String str = textStr.substring(textStr.indexOf("预算金额：") + 5).trim();
                entity.setBudget(str.split(" ")[0]);
                if( (str.split(" ")[1].contains("万元") || str.split(" ")[1].contains("元"))  &&   !str.split(" ")[1].contains("最高限价")  ){
                    entity.setBudget(str.split(" ")[0] + str.split(" ")[1] );
                    if(entity.getBudget().length()>32)entity.setBudget(str.split(" ")[0]);
                }
            }else if(textStr.indexOf("预算总金额（元）：") != -1){
                String str = textStr.substring(textStr.indexOf("预算总金额（元）：") + 9).trim();
                entity.setBudget(str.split(" ")[0]);
            }else if(textStr.indexOf("预算金额（元）：") != -1){
                String str = textStr.substring(textStr.indexOf("预算金额（元）：") + 8).trim();
                entity.setBudget(str.split(" ")[0]);
            }else if(textStr.indexOf("预算金额（万元）：") != -1){
                String str = textStr.substring(textStr.indexOf("预算金额（万元）：") + 9).trim();
                entity.setBudget(str.split(" ")[0]);
            }else if(textStr.indexOf("预算金额") != -1){
                String str = textStr.substring(textStr.indexOf("预算金额") + 4).trim();
                if(str.split("：").length>1){
                    entity.setBudget(str.split(" ")[0]);
                }
            }
        }



        return entity;
    }

    /**
     * 解析  获取招标文件时间
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisBiddingTime(PublicNoticeEntity entity,String text){
        // 获取指定字符串
        String textStr = "";
        if(text.indexOf("三、获取招标文件") != -1 && text.indexOf("四、提交投标文件截止时间",text.indexOf("三、获取招标文件")) != -1){
            textStr = text.substring(text.indexOf("三、获取招标文件"), text.indexOf("四、提交投标文件截止时间",text.indexOf("三、获取招标文件")));
        }else if(text.indexOf("三、获取招标文件") != -1 && text.indexOf("四、投标截止时间及地点",text.indexOf("三、获取招标文件")) != -1){
            textStr = text.substring(text.indexOf("三、获取招标文件"), text.indexOf("四、投标截止时间及地点",text.indexOf("三、获取招标文件")));
        }else if(text.indexOf("三、获取采购文件") != -1 && text.indexOf("四、提交投标文件截止时间",text.indexOf("三、获取采购文件")) != -1){
            textStr = text.substring(text.indexOf("三、获取采购文件"), text.indexOf("四、提交投标文件截止时间",text.indexOf("三、获取采购文件")));
        }else if(text.indexOf("三、获取采购文件") != -1 && text.indexOf("四、响应文件提交",text.indexOf("三、获取采购文件")) != -1){
            textStr = text.substring(text.indexOf("三、获取采购文件"), text.indexOf("四、响应文件提交",text.indexOf("三、获取采购文件")));
        }else if(text.indexOf("三、采购文件获取办法") != -1 && text.indexOf("四、投标截止时间",text.indexOf("三、采购文件获取办法")) != -1){
            textStr = text.substring(text.indexOf("三、采购文件获取办法"), text.indexOf("四、投标截止时间",text.indexOf("三、采购文件获取办法")));
        }else if(text.indexOf("四、获取招标文件") != -1 && text.indexOf("五、提交投标文件截止时间",text.indexOf("四、获取招标文件")) != -1){
            textStr = text.substring(text.indexOf("四、获取招标文件"), text.indexOf("五、提交投标文件截止时间",text.indexOf("四、获取招标文件")));
        }else if(text.indexOf("四、获取采购文件") != -1 && text.indexOf("五、响应文件提交",text.indexOf("四、获取采购文件")) != -1){
            textStr = text.substring(text.indexOf("四、获取采购文件"), text.indexOf("五、响应文件提交",text.indexOf("四、获取采购文件")));
        }else if(text.indexOf("三、") != -1 && text.indexOf("四、",text.indexOf("三、")) != -1){
            textStr = text.substring(text.indexOf("三、"), text.indexOf("四、",text.indexOf("三、")));
        }

        if(StringUtils.isBlank(textStr))return entity;
//        textStr = textStr.substring(textStr.indexOf(" ")).trim();

        if(StringUtils.isNotBlank(entity.getBiddingTime()))return entity;

        if(textStr.indexOf("时间：") != -1 && textStr.indexOf("获取公开招标文件的地点和地点：",textStr.indexOf("时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("时间：") + 3, textStr.indexOf("获取公开招标文件的地点和地点：",textStr.indexOf("时间："))).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("时间：") != -1 && textStr.indexOf("2.地点",textStr.indexOf("时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("时间：") + 3, textStr.indexOf("2.地点",textStr.indexOf("时间："))).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("时间：") != -1 && textStr.indexOf("2、地点",textStr.indexOf("时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("时间：") + 3, textStr.indexOf("2、地点",textStr.indexOf("时间："))).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("时间：") != -1 && textStr.indexOf("地点：",textStr.indexOf("时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("时间：") + 3, textStr.indexOf("地点",textStr.indexOf("时间："))).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("时间：") != -1 && textStr.indexOf("地点（网址）",textStr.indexOf("时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("时间：") + 3, textStr.indexOf("地点（网址）",textStr.indexOf("时间："))).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("时间") != -1 && textStr.indexOf("地点",textStr.indexOf("时间")) != -1){
            String str = textStr.substring(textStr.indexOf("时间") + 2, textStr.indexOf("地点",textStr.indexOf("时间"))).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("1、请于") != -1 && textStr.indexOf("，从",textStr.indexOf("1、请于")) != -1){
            String str = textStr.substring(textStr.indexOf("1、请于") + 4, textStr.indexOf("，从",textStr.indexOf("1、请于"))).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }

        // 校验字段是否过长
        if(StringUtils.isNotBlank(entity.getBiddingTime()) && entity.getBiddingTime().length() >=128 ){
            String[] split = entity.getBiddingTime().split("。");
            entity.setBiddingTime("");
            if(split.length>=1){
                for (int i = 0;i<split.length;i++) {
                    if(split[i].contains("（北京时间）")){
                        entity.setBiddingTime(split[i]);
                        break;
                    }
                }
            }
        }

        return entity;
    }

    /**
     * 解析  获提交投标文件截止时间
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisEndTime(PublicNoticeEntity entity,String text){
        // 获取指定字符串
        String textStr = "";
        if(text.indexOf("四、提交投标文件截止时间") != -1 && text.indexOf("五、公告期限",text.indexOf("四、提交投标文件截止时间")) != -1){
            textStr = text.substring(text.indexOf("四、提交投标文件截止时间"), text.indexOf("五、公告期限",text.indexOf("四、提交投标文件截止时间")));
        }else if(text.indexOf("四、投标截止时间、开标时间及地点") != -1 && text.indexOf("五、采购信息发布媒体",text.indexOf("四、投标截止时间、开标时间及地点")) != -1){
            textStr = text.substring(text.indexOf("四、投标截止时间、开标时间及地点"), text.indexOf("五、采购信息发布媒体",text.indexOf("四、投标截止时间、开标时间及地点")));
        }else if(text.indexOf("四、响应文件提交") != -1 && text.indexOf("五、开启",text.indexOf("四、响应文件提交")) != -1){
            textStr = text.substring(text.indexOf("四、响应文件提交"), text.indexOf("五、开启",text.indexOf("四、响应文件提交")));
        }else if(text.indexOf("五、提交投标文件截止时间") != -1 && text.indexOf("六、公告期限",text.indexOf("五、提交投标文件截止时间")) != -1){
            textStr = text.substring(text.indexOf("五、提交投标文件截止时间"), text.indexOf("六、公告期限",text.indexOf("五、提交投标文件截止时间")));
        }else if(text.indexOf("五、响应文件提交") != -1 && text.indexOf("六、开启",text.indexOf("五、响应文件提交")) != -1){
            textStr = text.substring(text.indexOf("五、响应文件提交"), text.indexOf("六、开启",text.indexOf("五、响应文件提交")));
        }else if(text.indexOf("四、响应文件提交") != -1 && text.indexOf("五、响应文件开启",text.indexOf("四、响应文件提交")) != -1){
            textStr = text.substring(text.indexOf("四、响应文件提交"), text.indexOf("五、响应文件开启",text.indexOf("四、响应文件提交")));
        }else if(text.indexOf("四、投标截止时间及地点") != -1 && text.indexOf("五、开标时间及地点",text.indexOf("四、投标截止时间及地点")) != -1){
            textStr = text.substring(text.indexOf("四、投标截止时间及地点"), text.indexOf("五、开标时间及地点",text.indexOf("四、投标截止时间及地点")));
        }else if(text.indexOf("四、") != -1 && text.indexOf("五、",text.indexOf("四、")) != -1){
            textStr = text.substring(text.indexOf("四、"), text.indexOf("五、",text.indexOf("四、")));
        }

        if(StringUtils.isBlank(textStr))return entity;
//        textStr = textStr.substring(textStr.indexOf(" ")).trim();

        if(StringUtils.isNotBlank(entity.getEndTime()))return entity;

        if(textStr.indexOf("截止时间：") != -1 && textStr.indexOf("投标地点",textStr.indexOf("截止时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间：") + 5, textStr.indexOf("投标地点",textStr.indexOf("截止时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("截止时间：") != -1 && textStr.indexOf("2.开标时间",textStr.indexOf("截止时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间：") + 5, textStr.indexOf("2.开标时间",textStr.indexOf("截止时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("截止时间：") != -1 && textStr.indexOf("2、开标时间",textStr.indexOf("截止时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间：") + 5, textStr.indexOf("2、开标时间",textStr.indexOf("截止时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("截止时间：") != -1 && textStr.indexOf("开标时间：",textStr.indexOf("截止时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间：") + 5, textStr.indexOf("开标时间：",textStr.indexOf("截止时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("截止时间：") != -1 && textStr.indexOf("3、地点",textStr.indexOf("截止时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间：") + 5, textStr.indexOf("3、地点",textStr.indexOf("截止时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("截止时间：") != -1 && textStr.indexOf("地点：",textStr.indexOf("截止时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间：") + 5, textStr.indexOf("地点：",textStr.indexOf("截止时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("开标时间：") != -1 && textStr.indexOf("（三）供应商提交投标文件的方式",textStr.indexOf("开标时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("开标时间：") + 5, textStr.indexOf("（三）供应商提交投标文件的方式",textStr.indexOf("开标时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("时间：") != -1 && textStr.indexOf("2.地点：",textStr.indexOf("时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("时间：") + 3, textStr.indexOf("2.地点：",textStr.indexOf("时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("时间：") != -1 && textStr.indexOf("地点：",textStr.indexOf("时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("时间：") + 3, textStr.indexOf("地点：",textStr.indexOf("时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("开标时间和地点：") != -1 && textStr.indexOf(" 地点：",textStr.indexOf("开标时间和地点：")) != -1){
            String str = textStr.substring(textStr.indexOf("开标时间和地点：") + 8, textStr.indexOf(" 地点：",textStr.indexOf("开标时间和地点："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("开标时间和地点:") != -1 && textStr.indexOf(" 地点：",textStr.indexOf("开标时间和地点:")) != -1){
            String str = textStr.substring(textStr.indexOf("开标时间和地点:") + 8, textStr.indexOf(" 地点：",textStr.indexOf("开标时间和地点:"))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("开标时间和地点") != -1 && textStr.indexOf("地点：",textStr.indexOf("开标时间和地点")) != -1){
            String str = textStr.substring(textStr.indexOf("开标时间和地点") + 7, textStr.indexOf("地点：",textStr.indexOf("开标时间和地点"))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("截止时间：") != -1 && textStr.indexOf("地点",textStr.indexOf("截止时间：")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间：") + 5, textStr.indexOf("地点",textStr.indexOf("截止时间："))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if(textStr.indexOf("截止时间") != -1 && textStr.indexOf("地点",textStr.indexOf("截止时间")) != -1){
            String str = textStr.substring(textStr.indexOf("截止时间") + 4, textStr.indexOf("地点",textStr.indexOf("截止时间"))).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }else if( textStr.indexOf("地点：") != -1){
            String str = textStr.substring(textStr.indexOf(" "),textStr.indexOf("地点：")).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.trim());
        }

        // 校验字段是否过长
        if(StringUtils.isNotBlank(entity.getEndTime()) && entity.getEndTime().length() >=64 ){
            String[] split = entity.getEndTime().split("。");
            entity.setEndTime("");
            if(split.length>=1){
                for (int i = 0;i<split.length;i++) {
                    if(split[i].contains("（北京时间）")){
                        entity.setEndTime(split[i]);
                        break;
                    }
                }
            }
        }

        return entity;
    }


    /**
     * 解析 采购人信息  采购人联系方式
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisPurchaseUser(PublicNoticeEntity entity,String text){
        // 获取指定字符串
        String textStr = "";
        if(text.indexOf("1、采购人信息") != -1 && text.indexOf("2、采购代理机构",text.indexOf("1、采购人信息")) != -1){
            textStr = text.substring(text.indexOf("1、采购人信息"), text.indexOf("2、采购代理机构",text.indexOf("1、采购人信息")));
        }else if(text.indexOf("1.采购人信息") != -1 && text.indexOf("2.采购代理机构",text.indexOf("1.采购人信息")) != -1){
            textStr = text.substring(text.indexOf("1.采购人信息"), text.indexOf("2.采购代理机构",text.indexOf("1.采购人信息")));
        }else if(text.indexOf("1. 采购人信息") != -1 && text.indexOf("2.采购代理机构",text.indexOf("1. 采购人信息")) != -1){
            textStr = text.substring(text.indexOf("1. 采购人信息"), text.indexOf("2.采购代理机构",text.indexOf("1. 采购人信息")));
        }else if(text.indexOf("1.釆购人信息") != -1 && text.indexOf("2.釆购代理机构信息",text.indexOf("1.釆购人信息")) != -1){
            textStr = text.substring(text.indexOf("1.釆购人信息"), text.indexOf("2.釆购代理机构信息",text.indexOf("1.釆购人信息")));
        }else if(text.indexOf("（一）采购人信息") != -1 && text.indexOf("（二）采购代理机构信息",text.indexOf("（一）采购人信息")) != -1){
            textStr = text.substring(text.indexOf("（一）采购人信息"), text.indexOf("（二）采购代理机构信息",text.indexOf("（一）采购人信息")));
        }else if(text.indexOf("1.采购人信息") != -1 && text.indexOf("2.政府集中采购机构",text.indexOf("1.采购人信息")) != -1){
            textStr = text.substring(text.indexOf("1.采购人信息"), text.indexOf("2.政府集中采购机构",text.indexOf("1.采购人信息")));
        }else if(text.indexOf("1.采购人信息") != -1 && text.indexOf("2.招标机构",text.indexOf("1.采购人信息")) != -1){
            textStr = text.substring(text.indexOf("1.采购人信息"), text.indexOf("2.招标机构",text.indexOf("1.采购人信息")));
        }else if(text.indexOf("3.采购人信息") != -1 ){
            textStr = text.substring(text.indexOf("3.采购人信息"));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }else if(text.indexOf("采购人：") != -1 && text.indexOf("采购代理机构：",text.indexOf("采购人：")) != -1){
            textStr = text.substring(text.indexOf("采购人："), text.indexOf("采购代理机构：",text.indexOf("采购人：")));
        }

        if(StringUtils.isBlank(textStr))return entity;
//        textStr = textStr.substring(textStr.indexOf(" ")).trim();
//        if(StringUtils.isNotBlank(entity.getPurchaseUser()))return entity;

        // 采购人信息
        Matcher m1 = Pattern.compile("称：.*?址：").matcher(textStr);
        if(m1.find()){
            String str = m1.group().trim().substring(2);
           entity.setPurchaseUser(str.split(" ")[0]);
        }else {
            m1 = Pattern.compile("称:.*?址:").matcher(textStr);
            if(m1.find()){
                String str = m1.group().trim().substring(2);;
                entity.setPurchaseUser(str.split(" ")[0]);
            }else if(textStr.contains("采 购 人：")){
                String str = textStr.substring(textStr.indexOf("采 购 人：") + 6).split(" ")[0];
                entity.setPurchaseUser(str.trim());
            }
        }

        if(StringUtils.isBlank(entity.getPurchaseUser())){
            String str = textStr.split(" ")[0];
            if(str.contains("：")){
                entity.setPurchaseUser(str.split("：")[1]);
            }else{
                entity.setPurchaseUser(str);
            }
        }


        // 采购人联系方式
        if(textStr.indexOf("联系人：") != -1){
            String str = textStr.substring(textStr.indexOf("联系人：")+4).trim().split(" ")[0];
            entity.setPurchaseUserContactWay(str);
        }else if(textStr.indexOf("联系人:") != -1){
            String str = textStr.substring(textStr.indexOf("联系人:")+4).trim().split(" ")[0];
            entity.setPurchaseUserContactWay(str.trim());
        }else if(textStr.indexOf("联 系 人：") != -1){
            String str = textStr.substring(textStr.indexOf("联 系 人：")+ 6).trim().split(" ")[0];
            entity.setPurchaseUserContactWay(str.trim());
        }

        if(textStr.indexOf("联系方式：") != -1){
            String str = textStr.substring(textStr.indexOf("联系方式：")+5).replace(" ","").trim();
            if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(str.split(" ")[0]);
        }else if(textStr.indexOf("联系方式:") != -1){
            String str = textStr.substring(textStr.indexOf("联系方式:")+5).replace(" ","").trim();
            if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(str.split(" ")[0]);
        }else if(textStr.indexOf("联系方式") != -1){
            String str = textStr.substring(textStr.indexOf("联系方式")+4).replace(" ","").trim();
            if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(str.split(" ")[0]);
        }else if(textStr.indexOf("电 话：") != -1){
            String str = textStr.substring(textStr.indexOf("电 话：")+4).replace(" ","").trim();
            if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseUserContactWay()))entity.setPurchaseUserContactWay(str.split(" ")[0]);
        }


        return entity;
    }

    /**
     * 解析 购代理机构信息名称  采购机构联系方式
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisPurchaseOrganization(PublicNoticeEntity entity,String text){
        // 获取指定字符串
        String textStr = "";
        if(text.indexOf("2、采购代理机构") != -1 && text.indexOf("3、项目联系方式",text.indexOf("2、采购代理机构")) != -1){
            textStr = text.substring(text.indexOf("2、采购代理机构"), text.indexOf("3、项目联系方式",text.indexOf("2、采购代理机构")));
        }else if(text.indexOf("2.采购代理机构") != -1 && text.indexOf("3.项目联系方式",text.indexOf("2.采购代理机构")) != -1){
            textStr = text.substring(text.indexOf("2.采购代理机构"), text.indexOf("3.项目联系方式",text.indexOf("2.采购代理机构")));
        }else if(text.indexOf("2.釆购代理机构信息") != -1 && text.indexOf("3.项目联系方式",text.indexOf("2.釆购代理机构信息")) != -1){
            textStr = text.substring(text.indexOf("2.釆购代理机构信息"), text.indexOf("3.项目联系方式",text.indexOf("2.釆购代理机构信息")));
        }else if(text.indexOf("2.采购代理机构") != -1 && text.indexOf("3.同级政府采购监督管理部门",text.indexOf("2.采购代理机构")) != -1){
            textStr = text.substring(text.indexOf("2.采购代理机构"), text.indexOf("3.同级政府采购监督管理部门",text.indexOf("2.采购代理机构")));
        }else if(text.indexOf("2.采购代理机构") != -1 && text.indexOf("3.同级政府采购监督管理部门",text.indexOf("2.采购代理机构")) != -1){
            textStr = text.substring(text.indexOf("2.采购代理机构"), text.indexOf("3.同级政府采购监督管理部门",text.indexOf("2.采购代理机构")));
        }else if(text.indexOf("2.招标机构") != -1 && text.indexOf("3.项目联系方式",text.indexOf("2.招标机构")) != -1){
            textStr = text.substring(text.indexOf("2.招标机构"), text.indexOf("3.项目联系方式",text.indexOf("2.招标机构")));
        }else if(text.indexOf("2.采购代理机构") != -1 ){
            textStr = text.substring(text.indexOf("2.采购代理机构"));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }else if(text.indexOf("2、采购代理机构") != -1 ){
            textStr = text.substring(text.indexOf("2、采购代理机构"));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }else if(text.indexOf("（二）采购代理机构信息") != -1 ){
            textStr = text.substring(text.indexOf("（二）采购代理机构信息"));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }else if(text.indexOf("2.政府集中采购机构") != -1 ){
            textStr = text.substring(text.indexOf("2.政府集中采购机构"));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }else if(text.indexOf("采购代理机构：") != -1 ){
            textStr = text.substring(text.indexOf("采购代理机构："));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }

        if(StringUtils.isBlank(textStr))return entity;
//        textStr = textStr.substring(textStr.indexOf(" ")).trim();
//        if(StringUtils.isNotBlank(entity.getPurchaseOrganization()))return entity;

        // 代理机构/采购代理机构信息名称
        Matcher m1 = Pattern.compile("称：.*?址：").matcher(textStr);
        if(m1.find()){
            String str = m1.group().trim().substring(2);;
            entity.setPurchaseOrganization(str.split(" ")[0]);
        }else{
            m1 = Pattern.compile("称:.*?址:").matcher(textStr);
            if(m1.find()){
                String str = m1.group().trim().substring(2);;
                entity.setPurchaseOrganization(str.split(" ")[0]);
            }else if(textStr.contains("采购代理机构：")){
                String str = textStr.substring(textStr.indexOf("采购代理机构：") + 7).split(" ")[0];
                entity.setPurchaseOrganization(str.trim());
            }
        }

        if(StringUtils.isBlank(entity.getPurchaseOrganization())){
            String str = textStr.split(" ")[0];
            if(str.contains("：")){
                entity.setPurchaseOrganization(str.split("：")[1]);
            }else{
                entity.setPurchaseOrganization(str);
            }
        }


        // 采购机构联系方式
        if(textStr.indexOf("联系人：") != -1){
            String str = textStr.substring(textStr.indexOf("联系人：")+4).trim().split(" ")[0];
            entity.setPurchaseOrganizationContactWay(str);
        }else if(textStr.indexOf("联系人:") != -1){
            String str = textStr.substring(textStr.indexOf("联系人:")+4).trim().split(" ")[0];
            entity.setPurchaseOrganizationContactWay(str);
        }else if(textStr.indexOf("联系人（询问）：") != -1){
            String str = textStr.substring(textStr.indexOf("联系人（询问）：")+8).trim().split(" ")[0];
            entity.setPurchaseOrganizationContactWay(str);
        }else if(textStr.indexOf("联 系 人：") != -1){
            String str = textStr.substring(textStr.indexOf("联 系 人：")+ 6).trim().split(" ")[0];
            entity.setPurchaseOrganizationContactWay(str.trim());
        }

        if(textStr.indexOf("联系方式：") != -1){
            String str = textStr.substring(textStr.indexOf("联系方式：")+5).trim();
            if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(str.split(" ")[0]);
        }else if(textStr.indexOf("联系方式:") != -1){
            String str = textStr.substring(textStr.indexOf("联系方式:")+5).trim();
            if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(str.split(" ")[0]);
        }else if(textStr.indexOf("联系方式（询问）：") != -1){
            String str = textStr.substring(textStr.indexOf("联系方式（询问）：")+9).trim();
            if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(str.split(" ")[0]);
        }else if(textStr.indexOf("联系方式") != -1){
            String str = textStr.substring(textStr.indexOf("联系方式")+4).trim();
            if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(str.split(" ")[0]);
        }else if(textStr.indexOf("电 话：") != -1){
            String str = textStr.substring(textStr.indexOf("电 话：")+4).trim().split(" ")[0];
            if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str.split(" ")[0]);
            if(StringUtils.isBlank(entity.getPurchaseOrganizationContactWay()))entity.setPurchaseOrganizationContactWay(str.split(" ")[0]);
        }

        // 项目联系人
        if(textStr.indexOf("项目联系人：") != -1){
            String str = textStr.substring(textStr.indexOf("项目联系人：")+6).trim().split(" ")[0];
            entity.setProjectContact(str);
        }else if(textStr.indexOf("项目联系人（询问）：") != -1){
            String str = textStr.substring(textStr.indexOf("项目联系人（询问）：")+10).trim().split(" ")[0];
            entity.setProjectContact(str);
        }

        // 项目联系方式
        if(textStr.indexOf("项目联系方式：") != -1){
            String str = textStr.substring(textStr.indexOf("项目联系方式：")+7).trim().split(" ")[0];
            entity.setProjectContactNumber(str);
        }else if(textStr.indexOf("项目联系方式（询问）：") != -1){
            String str = textStr.substring(textStr.indexOf("项目联系方式（询问）：")+11).trim().split(" ")[0];
            entity.setProjectContactNumber(str);
        }

        return entity;
    }

    /**
     * 解析 项目联系人   采购机构联系方式
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisProjectContact(PublicNoticeEntity entity,String text){
        // 获取指定字符串
        String textStr = "";
        if(text.indexOf("2.项目联系方式") != -1 && text.indexOf("3.采购人信息",text.indexOf("2.项目联系方式"))!= -1 ){
            textStr = text.substring(text.indexOf("2.项目联系方式"), text.indexOf("3.采购人信息",text.indexOf("2.项目联系方式")));
        }else if(text.indexOf("3、项目联系方式") != -1 ){
            textStr = text.substring(text.indexOf("3、项目联系方式"));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }else if(text.indexOf("3.项目联系方式") != -1 ){
            textStr = text.substring(text.indexOf("3.项目联系方式"));
            textStr = textStr.substring(0,textStr.length()>128?128:textStr.length());
        }

        if(StringUtils.isBlank(textStr))return entity;
//        textStr = textStr.substring(textStr.indexOf(" ")).trim();
//        if(StringUtils.isNotBlank(entity.getProjectContact()))return entity;

        // 项目联系人
        Matcher m1 = Pattern.compile("项目联系人：.*?话：").matcher(textStr);
        if(m1.find()){
            String str = m1.group().trim().substring(6);
            entity.setProjectContact(str.split(" ")[0]);
        }else{
            m1 = Pattern.compile("项目联系人:.*?话:").matcher(textStr);
            if(m1.find()){
                String str = m1.group().trim().substring(6);
                entity.setProjectContact(str.split(" ")[0]);
            }
        }
        // 项目联系人电话
        if(textStr.indexOf("话：") != -1){
            String str = textStr.substring(textStr.indexOf("话：")+2).trim().split(" ")[0];
            entity.setProjectContactNumber(str);
        }else if(textStr.indexOf("话:") != -1){
            String str = textStr.substring(textStr.indexOf("话:")+2).trim().split(" ")[0];
            entity.setProjectContactNumber(str);
        }
        return entity;
    }





    /**
     * 解析  发布时间
     * @param entity
     * @param text
     * @return
     */
//    public PublicNoticeEntity analysisPulishTime(PublicNoticeEntity entity,String text,Document document){
//
//        try {
//            // 发布时间
//            Elements publicTimeEl = document.getElementsByAttributeValue("id", "pubTime");
//            String publicTime = publicTimeEl.get(0).text().trim();
//            entity.setPublicTime(sdf.parse(publicTime));
////            entity.setPublicTimeExcel(publicTime.replace("年","-").replace("月","-").replace("日",""));
//            // 获取月份
//            Calendar calendar = Calendar.getInstance();
//            calendar.setTime(sdf.parse(publicTime));
//            entity.setMonth( (calendar.get(Calendar.MONTH)+1) + "月");
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//
//        return entity;
//    }


//    public PublicNoticeEntity  analysisTime(PublicNoticeEntity entity, String text){
//        // 项目编号
//        String textStr = text.substring(text.indexOf("一、项目基本情况"), text.indexOf("二、申请人的资格要求"));
//        entity.setProjectCode(textStr.substring(textStr.indexOf("项目编号：")+ 5,textStr.indexOf("项目名称")).trim());
//        // 项目名称
//        entity.setProjectName(textStr.substring(textStr.indexOf("项目名称：")+ 5,textStr.indexOf("采购方式")).trim());
//        // 招标公告链接
//        // 采购方式
//        entity.setPurchaseType(textStr.substring(textStr.indexOf("采购方式：")+ 5,textStr.indexOf("预算金额")).trim());
////        Matcher m1 = Pattern.compile(">采购方式：.*?</span>").matcher(htmlString);
////        if(m1.find())entity.setPurchaseType(m1.group().trim().split("采购方式：")[1].split("<")[0].trim());
//        // 预算金额
//        entity.setBudget(textStr.substring(textStr.indexOf("预算金额：")+ 5,textStr.indexOf("采购需求")).trim());
////        m1 = Pattern.compile(">预算金额：</span>.*?</span>").matcher(htmlString);
////        if(m1.find())entity.setBudget(m1.group().trim().split(">")[2].split("<")[0].trim());
//        // 公告类型
//        entity.setPublicNoticeType("采购公告");
//        // 业务类型
//        // 项目类型
//
//        if("公开招标".equals(entity.getPurchaseType())){
//            // 获取招标文件时间
//            String substr = text.substring(text.indexOf("三、获取招标文件"), text.indexOf("四、提交投标文件截止时间"));
//            String str = substr.substring(substr.indexOf("时间：")+3, substr.indexOf("地点：")).trim().replaceAll("&nbsp;", "");
//            entity.setBiddingTime(str);
//            // 提交投标文件截止时间
//            substr = text.substring(text.indexOf("四、提交投标文件截止时间"), text.indexOf("五、公告期限"));
//            str = substr.substring(substr.indexOf("开标时间和地点")+7, substr.indexOf("地点：")).trim().replaceAll("&nbsp;", "");
//            entity.setEndTime(str );
//        }else{
//            // 获取招标文件时间
//            String substr = text.substring(text.indexOf("三、获取采购文件"), text.indexOf("四、响应文件提交"));
//            String str = substr.substring(substr.indexOf("时间：")+3, substr.indexOf("地点：")).trim().replaceAll("&nbsp;", "");
//            entity.setBiddingTime(str);
//            // 提交投标文件截止时间
//            substr = text.substring(text.indexOf("四、响应文件提交"), text.indexOf("五、开启"));
//            str = substr.substring(substr.indexOf("截止时间：")+5, substr.indexOf("地点：")).trim().replaceAll("&nbsp;", "");
//            entity.setEndTime(str );
//        }
//
//        return entity;
//    }
//
//
//
//    public PublicNoticeEntity  analysisPurchase(PublicNoticeEntity entity, String text, String htmlString, Document document){
//
//        Element element5 = document.getElementById("_notice_content_noticePurchase-purchaserOrgName");
//        if(element5 != null ){
//            // 采购人信息名称
//            entity.setPurchaseUser(element5.text().trim());
//            // 采购联系方式
//            entity.setPurchaseUserContactWay(document.getElementById("_notice_content_noticePurchase-purchaserLinkTel").text());
//            // 代理机构/采购代理机构信息名称
//            Elements element6 = document.getElementsByAttributeValue("id","_notice_content_noticeAgency-agencyName");
//            entity.setPurchaseOrganization(element6.get(0).text().trim());
//            // 采购机构联系方式
//            entity.setPurchaseOrganizationContactWay(document.getElementById("_notice_content_noticeAgency-agentLinkTel").text());
//            // 项目负责人
//            // 项目经办人
//            // 项目联系人
//            Elements element7 = document.getElementsByAttributeValue("id","_notice_content_projectContact-managerName");
//            entity.setProjectContact(element7.get(0).text().trim());
//            // 项目联系人电话
//            Elements element8 = document.getElementsByAttributeValue("id","_notice_content_projectContact-managerLinkPhone");
//            entity.setProjectContactNumber(element8.get(0).text().trim());
//        }else{
//            // 采购人信息名称
//            String textStr = text.substring(text.indexOf("1.采购人信息"), text.indexOf("2.采购代理机构信息"));
//            entity.setPurchaseUser(textStr.substring(textStr.indexOf("称：")+ 2,textStr.indexOf("地 址：")).trim());
//            // 采购联系方式
//            entity.setPurchaseUserContactWay(textStr.substring(textStr.indexOf("联系方式：")+5).trim());
//            // 代理机构/采购代理机构信息名称
//            textStr = text.substring(text.indexOf("2.采购代理机构信息"), text.indexOf("3.项目联系方式"));
//            entity.setPurchaseOrganization(textStr.substring(textStr.indexOf("称：")+ 2,textStr.indexOf("地 址：")).trim());
//            // 采购机构联系方式
//            entity.setPurchaseOrganizationContactWay(textStr.substring(textStr.indexOf("联系方式：")+ 5).trim());
//            // 项目负责人
//            // 项目经办人
//            // 项目联系人
//            Matcher m1 = Pattern.compile(">项目联系人：.*?</span>").matcher(htmlString);
//            if(m1.find()){
//                entity.setProjectContact(m1.group().trim().split("项目联系人：")[1].split("<")[0].trim());
//            }
//            // 项目联系人电话
//            m1 = Pattern.compile("电</span>.*?</span>").matcher(htmlString);
//            if(m1.find())entity.setProjectContactNumber(m1.group().trim().split("话：")[1].split("<")[0].trim());
//        }
//
//
//        return entity;
//    }

}
