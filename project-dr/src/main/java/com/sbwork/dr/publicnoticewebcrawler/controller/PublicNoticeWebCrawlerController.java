package com.sbwork.dr.publicnoticewebcrawler.controller;

import com.sbwork.base.controller.BaseController;
import com.sbwork.base.form.ReturnForm;
import com.sbwork.base.form.ReturnPage;
import com.sbwork.dr.publicnoticewebcrawler.form.PublicNoticeWebCrawlerForm;
import com.sbwork.dr.publicnoticewebcrawler.searchForm.PublicNoticeWebCrawlerSearchForm;
import com.sbwork.dr.publicnoticewebcrawler.service.PublicNoticeBiddingService;
import com.sbwork.dr.publicnoticewebcrawler.service.PublicNoticeWebCrawlService;
import com.sbwork.dr.publicnoticewebcrawler.service.PublicNoticeWebCrawlerService;
import com.sbwork.systemConfig.plugin.bean.OrderBy;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * 公告资源爬取controller
 */
@Api(tags = "公告资源爬取接口(中国政府采购网)")
@Controller
@RequestMapping("dataReceive/publicNoticeWebCrawler")
public class PublicNoticeWebCrawlerController extends BaseController {
    @Resource
    private PublicNoticeWebCrawlerService publicNoticeWebCrawlerService;
    @Resource
    private PublicNoticeWebCrawlService publicNoticeWebCrawlService;
    @Resource
    private PublicNoticeBiddingService publicNoticeBiddingService;

    /**
     * 按id进行查询
     * @param id 标识
     * @return 公告资源爬取Form
     */
    @ApiOperation(value = "按id获取")
    @ApiImplicitParams(
        @ApiImplicitParam(name = "id", value = "标识", paramType = "query", required = true)
    )
    @PostMapping(value = "/get")
    @ResponseBody
    public ReturnForm<PublicNoticeWebCrawlerForm> get(@RequestParam("id") String id){
        PublicNoticeWebCrawlerForm form = publicNoticeWebCrawlerService.getById(id);
        return new ReturnForm<>(form);
    }

    /**
     * 按searchForm获取公告资源爬取列表
     * @param searchForm 公告资源爬取searchForm
     * @return 公告资源爬取列表（带用分页的信息）
     */
    @ApiOperation(value = "获取公告资源爬取列表")
    @PostMapping(value = "/list")
    @ResponseBody
    public ReturnForm<ReturnPage<PublicNoticeWebCrawlerForm>> list(PublicNoticeWebCrawlerSearchForm searchForm){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
        try {
            if(searchForm.getPublicTimeStart() != null){
                String publicTimeStart = sdf2.format(searchForm.getPublicTimeStart())+ " 00:00:00";
                searchForm.setPublicTimeStart(sdf.parse(publicTimeStart));
            }
            if(searchForm.getPublicTimeEnd() != null){
                String publicTimeEnd = sdf2.format(searchForm.getPublicTimeEnd())+ " 23:59:59";
                searchForm.setPublicTimeEnd(sdf.parse(publicTimeEnd));
            }
        }catch (ParseException e) {
            e.printStackTrace();
        }

        if(StringUtils.isBlank(searchForm.getIfAnalysis()))searchForm.setIfAnalysis(null);
        searchForm.setOrderByField("publicTime");
        searchForm.setOrderByType(OrderBy.OrderByType.DESC);

        List<PublicNoticeWebCrawlerForm> result = publicNoticeWebCrawlerService.listPageBySearchForm(searchForm);
        return new ReturnForm<>(new ReturnPage<>(searchForm.getTotal(), result));
    }


    /**
     * 更新公告资源爬取
     * @param form 公告资源爬取form
     * @return 更新后的结果form
     */
    @ApiOperation(value = "更新或者添加公告资源爬取")
    @PostMapping(value = "/commit")
    @ResponseBody
    public ReturnForm<PublicNoticeWebCrawlerForm> commit(PublicNoticeWebCrawlerForm form){
        form =  publicNoticeWebCrawlerService.commit(form);
        return new ReturnForm<>(form);
    }

    /**
     * 删除公告资源爬取
     * @param keyIds id集合
     * @return ReturnForm.用于表示是否成功删除。
     */
    @ApiOperation(value = "删除公告资源爬取")
    @ApiImplicitParams(
        @ApiImplicitParam(name = "keyIds[]", value = "标识集合", required = true)
    )
    @PostMapping(value = "/remove")
    @ResponseBody
    public ReturnForm<String> remove(@RequestParam("keyIds") String[] keyIds){
        publicNoticeWebCrawlerService.remove(keyIds);
        return new ReturnForm<>("成功删除");
    }


    /**
     * 解析公告资源
     * @param form 公告资源爬取form
     * @return 更新后的结果form
     */
    @ApiOperation(value = "解析公告资源")
    @RequestMapping(value = "/analysis")
    @ResponseBody
    public ReturnForm<String> analysis(PublicNoticeWebCrawlerForm form){
        String status = publicNoticeWebCrawlerService.analysis(form);
        if("1".equals(status)){
            return new ReturnForm(false,"网址不在解析范围内");
        }else if("2".equals(status)){
            return new ReturnForm(false,"网络连接超时,请稍后尝试");
        }else if("3".equals(status)){
            return new ReturnForm(false,"网址解析失败，请确认网址是否匹配");
        }else if("4".equals(status)){
            return new ReturnForm(false,"已存在相同公告");
        }
        return new ReturnForm<>(true,"解析成功");
    }

    /**
     * 是否启动定时任务
     * @return 更新后的结果form
     */
    @ApiOperation(value = "是否启动定时任务")
    @PostMapping(value = "/stopOrStart")
    @ResponseBody
    public ReturnForm<String> stopOrStart(String flag){
        try {
            publicNoticeWebCrawlService.stopOrStartTimerTask(flag);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
        if("start".equals(flag)){
            return new ReturnForm(true,"启动自动抓取定时任务成功");
        }else{
            return new ReturnForm(true,"暂定自动抓取定时任务成功");
        }
    }

    /**
     * 是否启动定时任务
     * @return 更新后的结果form
     */
    @ApiOperation(value = "是否启动定时任务")
    @PostMapping(value = "/stopOrStartBidding")
    @ResponseBody
    public ReturnForm<String> stopOrStartBidding(String flag){
        try {
            publicNoticeBiddingService.stopOrStartTimerTask(flag);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
        if("start".equals(flag)){
            return new ReturnForm(true,"启动中标抓取定时任务成功");
        }else{
            return new ReturnForm(true,"暂定中标抓取定时任务成功");
        }
    }

}
