package com.sbwork.dr.publicnoticewebcrawlerguangdong.controller;

import com.sbwork.base.controller.BaseController;
import com.sbwork.base.form.ReturnForm;
import com.sbwork.base.form.ReturnPage;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.form.PublicNoticeWebCrawlerGuangDongForm;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.searchForm.PublicNoticeWebCrawlerGuangDongSearchForm;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.service.PublicNoticeWebCrawlGuangDong;
import com.sbwork.dr.publicnoticewebcrawlerguangdong.service.PublicNoticeWebCrawlerGuangDongService;
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
 * 公告资源爬取(广东省政府采购网)controller
 */
@Api(tags = "公告资源爬取(广东省政府采购网)接口")
@Controller
@RequestMapping("dataReceive/publicNoticeWebCrawlerGd")
public class PublicNoticeWebCrawlerGuangDongController extends BaseController {
    @Resource
    private PublicNoticeWebCrawlerGuangDongService publicNoticeWebCrawlerGuangDongService;
    @Resource
    private PublicNoticeWebCrawlGuangDong publicNoticeWebCrawlGuangDong;

    /**
     * 按id进行查询
     * @param id 标识
     * @return 公告资源爬取(广东省政府采购网)Form
     */
    @ApiOperation(value = "按id获取")
    @ApiImplicitParams(
        @ApiImplicitParam(name = "id", value = "标识", paramType = "query", required = true)
    )
    @PostMapping(value = "/get")
    @ResponseBody
    public ReturnForm<PublicNoticeWebCrawlerGuangDongForm> get(@RequestParam("id") String id){
        PublicNoticeWebCrawlerGuangDongForm form = publicNoticeWebCrawlerGuangDongService.getById(id);
        return new ReturnForm<>(form);
    }

    /**
     * 按searchForm获取公告资源爬取(广东省政府采购网)列表
     * @param searchForm 公告资源爬取(广东省政府采购网)searchForm
     * @return 公告资源爬取(广东省政府采购网)列表（带用分页的信息）
     */
    @ApiOperation(value = "获取公告资源爬取(广东省政府采购网)列表")
    @PostMapping(value = "/list")
    @ResponseBody
    public ReturnForm<ReturnPage<PublicNoticeWebCrawlerGuangDongForm>> list(PublicNoticeWebCrawlerGuangDongSearchForm searchForm){

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

        List<PublicNoticeWebCrawlerGuangDongForm> result = publicNoticeWebCrawlerGuangDongService.listPageBySearchForm(searchForm);
        return new ReturnForm<>(new ReturnPage<>(searchForm.getTotal(), result));
    }


    /**
     * 更新公告资源爬取(广东省政府采购网)
     * @param form 公告资源爬取(广东省政府采购网)form
     * @return 更新后的结果form
     */
    @ApiOperation(value = "更新或者添加公告资源爬取(广东省政府采购网)")
    @PostMapping(value = "/commit")
    @ResponseBody
    public ReturnForm<PublicNoticeWebCrawlerGuangDongForm> commit(PublicNoticeWebCrawlerGuangDongForm form){
        form =  publicNoticeWebCrawlerGuangDongService.commit(form);
        return new ReturnForm<>(form);
    }

    /**
     * 删除公告资源爬取(广东省政府采购网)
     * @param keyIds id集合
     * @return ReturnForm.用于表示是否成功删除。
     */
    @ApiOperation(value = "删除公告资源爬取(广东省政府采购网)")
    @ApiImplicitParams(
        @ApiImplicitParam(name = "keyIds[]", value = "标识集合", required = true)
    )
    @PostMapping(value = "/remove")
    @ResponseBody
    public ReturnForm<String> remove(@RequestParam("keyIds") String[] keyIds){
        publicNoticeWebCrawlerGuangDongService.remove(keyIds);
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
    public ReturnForm<String> analysis(PublicNoticeWebCrawlerGuangDongForm form){
        String status = publicNoticeWebCrawlerGuangDongService.analysis(form);
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
            publicNoticeWebCrawlGuangDong.stopOrStartTimerTask(flag);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
        if("start".equals(flag)){
            return new ReturnForm(true,"启动自动抓取定时任务成功");
        }else{
            return new ReturnForm(true,"暂定自动抓取定时任务成功");
        }
    }


}
