package com.sbwork.dr.publicnotice.service;

import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 招标公告解析类
 */
@Service
public class BiddingPublicNoticeAnalysisService {


    /**
     * 招标公告解析
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisBiddingPublicNotice(PublicNoticeEntity entity, String text){

        // 招标文件获取时间
        this.analysisBiddingTime(entity,text);
        // 提交投标文件截止时间
        this.analysisEndTime(entity,text);
        // 采购单位信息
        this.analysisPurchaseUser(entity,text);

        return entity;
    }


    /**
     * 解析  获取招标文件时间
     * @param entity
     * @param text
     * @return
     */
    public PublicNoticeEntity analysisBiddingTime(PublicNoticeEntity entity, String text){
        String textStr = "";
        // 招标文件获取时间
        if(text.indexOf("5.招标文件、图纸等资料的获取") != -1 && text.indexOf("6.投标保证金") != -1){
            textStr = text.substring(text.indexOf("5.招标文件、图纸等资料的获取"), text.indexOf("6.投标保证金"));
        }else if(text.indexOf("5.报名要求及招标文件、图纸等资料的获取") != -1 && text.indexOf("6.投标保证金") != -1){
            textStr = text.substring(text.indexOf("5.报名要求及招标文件、图纸等资料的获取"), text.indexOf("6.投标保证金"));
        }else if(text.indexOf("5.招标文件的获取") != -1 && text.indexOf("6.投标文件的递交") != -1){
            textStr = text.substring(text.indexOf("5.招标文件的获取"), text.indexOf("6.投标文件的递交"));
        }else if(text.indexOf("4.招标文件获取") != -1 && text.indexOf("5.投标文件和保证金的递交") != -1){
            textStr = text.substring(text.indexOf("4.招标文件获取"), text.indexOf("5.投标文件和保证金的递交"));
        }else if(text.indexOf("4.招标文件的获取") != -1 && text.indexOf("5.投标文件和保证金的递交") != -1){
            textStr = text.substring(text.indexOf("4.招标文件的获取"), text.indexOf("5.投标文件和保证金的递交"));
        }else if(text.indexOf("4.招标文件获取") != -1 && text.indexOf("5.投标文件的递交") != -1){
            textStr = text.substring(text.indexOf("4.招标文件获取"), text.indexOf("5.投标文件的递交"));
        }else if(text.indexOf("4. 招标文件的获取") != -1 && text.indexOf("5.投标文件的递交") != -1){
            textStr = text.substring(text.indexOf("4. 招标文件的获取"), text.indexOf("5.投标文件的递交"));
        }

        if(textStr.indexOf("凡有意参加投标者，可于") != -1 && textStr.indexOf("至投标截止时间") != -1){
            String str = textStr.substring(textStr.indexOf("凡有意参加投标者，可于") + 11, textStr.indexOf("至投标截止时间")).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("5.1") != -1 && textStr.indexOf("5.2") != -1){
            String str = textStr.substring(textStr.indexOf("5.1") + 3, textStr.indexOf("5.2")).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
        }else if(textStr.indexOf("4.1") != -1 && textStr.indexOf("4.2") != -1){
            String str = textStr.substring(textStr.indexOf("4.1") + 3, textStr.indexOf("4.2")).trim().replaceAll("&nbsp;", "");
            entity.setBiddingTime(str.trim());
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
        // 获提交投标文件截止时间
        if(text.indexOf("7.投标文件的递交") != -1 && text.indexOf("8.发布公告的媒介") != -1){
            textStr = text.substring(text.indexOf("7.投标文件的递交"), text.indexOf("8.发布公告的媒介"));
        }else if(text.indexOf("7.投标文件的递交") != -1 && text.indexOf("8. 发布公告的媒介") != -1){
            textStr = text.substring(text.indexOf("7.投标文件的递交"), text.indexOf("8. 发布公告的媒介"));
        }else if(text.indexOf("5.投标文件和保证金的递交") != -1 && text.indexOf("6.发布公告的媒介") != -1){
            textStr = text.substring(text.indexOf("5.投标文件和保证金的递交"), text.indexOf("6.发布公告的媒介"));
        }else if(text.indexOf("5.投标文件的递交") != -1 && text.indexOf("6.发布公告的媒介") != -1){
            textStr = text.substring(text.indexOf("5.投标文件的递交"), text.indexOf("6.发布公告的媒介"));
        }else if(text.indexOf("6.投标文件的递交") != -1 && text.indexOf("7.发布公告的媒介") != -1){
            textStr = text.substring(text.indexOf("6.投标文件的递交"), text.indexOf("7.发布公告的媒介"));
        }


        if(textStr.indexOf("投标文件递交的截止时间：") != -1 && textStr.indexOf("开标时间：") != -1){
            String str = textStr.substring(textStr.indexOf("投标文件递交的截止时间：") + 12, textStr.indexOf("开标时间：")).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str.split("。")[0].trim());
        }else if(textStr.indexOf("5.1") != -1 && textStr.indexOf("5.2") != -1){
            String str = textStr.substring(textStr.indexOf("5.1") + 3, textStr.indexOf("5.2")).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str);
        }else if(textStr.indexOf("6.1") != -1 && textStr.indexOf("6.2") != -1){
            String str = textStr.substring(textStr.indexOf("6.1") + 3, textStr.indexOf("6.2")).trim().replaceAll("&nbsp;", "");
            entity.setEndTime(str);
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
        if(text.indexOf("8.联系方式") != -1){
            textStr = text.substring(text.indexOf("8.联系方式"));
        }else if(text.indexOf("8、联系方式") != -1){
            textStr = text.substring(text.indexOf("8、联系方式"));
        }else if(text.indexOf("9.联系方式") != -1){
            textStr = text.substring(text.indexOf("9.联系方式"));
        }else if(text.indexOf("10.联系方式") != -1){
            textStr = text.substring(text.indexOf("10.联系方式"));
        }else if(text.indexOf("10. 联系方式") != -1){
            textStr = text.substring(text.indexOf("10. 联系方式"));
        }else if(text.indexOf("11.联系方式") != -1){
            textStr = text.substring(text.indexOf("11.联系方式"));
        }else if(text.indexOf("11. 联系方式") != -1){
            textStr = text.substring(text.indexOf("11. 联系方式"));
        }
        if(StringUtils.isNotBlank(textStr)){
            // 采购人
            if(textStr.indexOf("招标单位（盖章）：") != -1 ){
                String str = textStr.substring(textStr.indexOf("招标单位（盖章）：")+9).trim().split(" ")[0];
                entity.setPurchaseUser(str);
            }else if(textStr.indexOf("招标人信息") != -1 ){
//                String str = textStr.substring(textStr.indexOf("招标人信息")+5).trim().split(" ")[0];
//                entity.setPurchaseUser(str);
                if(textStr.indexOf("称：") != -1 ){
                    String str = textStr.substring(textStr.indexOf("称：")+2).trim().split(" ")[0];
                    entity.setPurchaseUser(str);

                    if(textStr.indexOf("称：",textStr.indexOf("称：")+2) != -1 ){
                        str = textStr.substring(textStr.indexOf("称：",textStr.indexOf("称：")+2)+2).trim().split(" ")[0];
                        entity.setPurchaseOrganization(str);
                    }
                }
            }else if(textStr.indexOf("招标人：") != -1 ){
                String str = textStr.substring(textStr.indexOf("招标人：")+4).trim().split(" ")[0];
                entity.setPurchaseUser(str);
            }else if(textStr.indexOf("招 标 人：") != -1 ){
                String str = textStr.substring(textStr.indexOf("招 标 人：")+6).trim().split(" ")[0];
                entity.setPurchaseUser(str);
            }

            // 采购联系方式
            if(textStr.indexOf("联 系 人：") != -1){
                String str = textStr.substring(textStr.indexOf("联 系 人：")+6).trim().split(" ")[0];
                entity.setPurchaseUserContactWay(str);

                if(textStr.indexOf("联系人：") != -1 ){
                    str = textStr.substring(textStr.indexOf("联系人：")+4).trim().split(" ")[0];
                    entity.setPurchaseOrganizationContactWay(str);
                }else if(textStr.indexOf("联 系 人：",textStr.indexOf("联 系 人：")+6) != -1 ){
                    str = textStr.substring(textStr.indexOf("联 系 人：",textStr.indexOf("联 系 人：")+6)+6).trim().split(" ")[0];
                    entity.setPurchaseOrganizationContactWay(str);
                }
            }else if(textStr.indexOf("联系人：") != -1 ){
                String str = textStr.substring(textStr.indexOf("联系人：")+4).trim().split(" ")[0];
                entity.setPurchaseUserContactWay(str);

                if(textStr.indexOf("联系人：",textStr.indexOf("联系人：")+4) != -1 ){
                    str = textStr.substring(textStr.indexOf("联系人：",textStr.indexOf("联系人：")+4)+4).trim().split(" ")[0];
                    entity.setPurchaseOrganizationContactWay(str);
                }
            }

            if(textStr.indexOf("电话：") != -1 ){
                String str = textStr.substring(textStr.indexOf("电话：")+3).trim().split(" ")[0];
                if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay())){
                    entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ str);
                }else{
                    entity.setPurchaseUserContactWay( str);
                }

                if(textStr.indexOf("电话：",textStr.indexOf("电话：")+3) != -1 ){
                    str = textStr.substring(textStr.indexOf("电话：",textStr.indexOf("电话：")+3)+3).trim().split(" ")[0];
                    if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay())){
                        entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str);
                    }else{
                        entity.setPurchaseOrganizationContactWay( str);
                    }
                }
            }else if(textStr.indexOf("电 话：") != -1){
                String str = textStr.substring(textStr.indexOf("电 话：")+4).trim().split(" ")[0];
                if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay())){
                    entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ str);
                }else{
                    entity.setPurchaseUserContactWay( str);
                }
                if(textStr.indexOf("电 话：",textStr.indexOf("电 话：")+4) != -1 ){
                    str = textStr.substring(textStr.indexOf("电 话：",textStr.indexOf("电 话：")+4)+4).trim().split(" ")[0];
                    if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay())){
                        entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str);
                    }else{
                        entity.setPurchaseOrganizationContactWay( str);
                    }
                }
            }else if(textStr.indexOf("联系方式：") != -1){
                String str = textStr.substring(textStr.indexOf("联系方式：")+5).trim().split(" ")[0];
                if(StringUtils.isNotBlank(entity.getPurchaseUserContactWay())){
                    entity.setPurchaseUserContactWay(entity.getPurchaseUserContactWay() +"/"+ str);
                }else{
                    entity.setPurchaseUserContactWay( str);
                }
                if(textStr.indexOf("联系方式：",textStr.indexOf("联系方式：")+5) != -1 ){
                    str = textStr.substring(textStr.indexOf("联系方式：",textStr.indexOf("联系方式：")+5)+5).trim().split(" ")[0];
                    if(StringUtils.isNotBlank(entity.getPurchaseOrganizationContactWay())){
                        entity.setPurchaseOrganizationContactWay(entity.getPurchaseOrganizationContactWay() +"/"+ str);
                    }else{
                        entity.setPurchaseOrganizationContactWay( str);
                    }
                }
            }

            // 采购代理机构
            if(StringUtils.isBlank(entity.getPurchaseOrganization())){
                if(textStr.indexOf("招标代理机构（盖章）：") != -1 ){
                    String str = textStr.substring(textStr.indexOf("招标代理机构（盖章）：")+11).trim().split(" ")[0];
                    entity.setPurchaseOrganization(str);
                }else if(textStr.indexOf("招标代理机构：") != -1 ){
                    String str = textStr.substring(textStr.indexOf("招标代理机构：")+7).trim().split(" ")[0];
                    entity.setPurchaseOrganization(str);
                }else if(textStr.indexOf("招标代理机构信息") != -1 ){
                    String str = textStr.substring(textStr.indexOf("招标代理机构信息")+8).trim().split(" ")[0];
                    entity.setPurchaseOrganization(str);
                }else if(textStr.indexOf("招标代理：") != -1 ){
                    String str = textStr.substring(textStr.indexOf("招标代理：")+5).trim().split(" ")[0];
                    entity.setPurchaseOrganization(str);
                }
            }

        }

        return entity;
    }


}
