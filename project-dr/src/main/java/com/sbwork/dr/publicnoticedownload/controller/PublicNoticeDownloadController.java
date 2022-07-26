package com.sbwork.dr.publicnoticedownload.controller;

import com.sbwork.base.controller.BaseController;
import com.sbwork.base.form.ReturnForm;
import com.sbwork.base.form.ReturnPage;
import com.sbwork.dr.DrConstant;
import com.sbwork.dr.publicnotice.api.PublicNoticeApi;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.form.PublicNoticeForm;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.dr.publicnoticedownload.api.PublicNoticeDownloadApi;
import com.sbwork.dr.publicnoticedownload.entity.PublicNoticeDownloadEntity;
import com.sbwork.dr.publicnoticedownload.form.PublicNoticeDownloadForm;
import com.sbwork.dr.publicnoticedownload.searchForm.PublicNoticeDownloadSearchForm;
import com.sbwork.dr.publicnoticedownload.service.PublicNoticeDownloadService;
import com.sbwork.systemConfig.plugin.bean.OrderBy;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * 公告controller
 */
@Api(tags = "公告下载接口")
@Controller
@RequestMapping("dataReceive/publicNoticeDownload")
public class PublicNoticeDownloadController extends BaseController implements PublicNoticeDownloadApi {

    @Resource
    private PublicNoticeDownloadService publicNoticeDownloadService;

    /**
     * 按id进行查询
     *
     * @param id 标识
     * @return 协议类Form
     */
    @ApiOperation(value = "按id获取")
    @PostMapping(value = "/get")
    @ResponseBody
    @Override
    public ReturnForm<PublicNoticeDownloadForm> get(@RequestParam("id") String id) {
        PublicNoticeDownloadForm form = publicNoticeDownloadService.getById(id);
        return new ReturnForm<>(form);
    }

    /**
     * 按searchForm获取协议类列表
     *
     * @param searchForm 协议类searchForm
     * @return 协议类列表（带用分页的信息）
     */
    @ApiOperation(value = "获取协议类列表")
    @PostMapping(value = "/list")
    @ResponseBody
    @Override
    public ReturnForm<ReturnPage<PublicNoticeDownloadForm>> list(PublicNoticeDownloadSearchForm searchForm) {
        searchForm.setOrderByField("createTime");
        searchForm.setOrderByType(OrderBy.OrderByType.DESC);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
        try {
            if(searchForm.getCreateTimeStart() != null){
                String createTimeStart = sdf2.format(searchForm.getCreateTimeStart())+ " 00:00:00";
                searchForm.setCreateTimeStart(sdf.parse(createTimeStart));
            }
            if(searchForm.getCreateTimeEnd() != null){
                String createTimeEnd = sdf2.format(searchForm.getCreateTimeEnd())+ " 23:59:59";
                searchForm.setCreateTimeEnd(sdf.parse(createTimeEnd));
            }
        }catch (ParseException e) {
            e.printStackTrace();
        }

        List<PublicNoticeDownloadEntity> result = publicNoticeDownloadService.listPageBySearchForm(searchForm);

//        result = result.stream().map(v ->{
//                    if(v.getPublicTime() != null)v.setPublicTimeExcel(sdf.format(v.getPublicTime()));
//                    return v;
//                }).collect(Collectors.toList());
        return new ReturnForm(new ReturnPage<>(searchForm.getTotal(), result));
    }


    /**
     * 更新协议类
     *
     */
    @ApiOperation(value = "更新或者添加协议类")
    @PostMapping(value = "/commit")
    @ResponseBody
    @Override
    @RequiresRoles(DrConstant.ROLE_DR_ADMIN)
    public ReturnForm<PublicNoticeDownloadEntity> commit(PublicNoticeDownloadEntity entity) {
        entity = publicNoticeDownloadService.commit(entity);

        return new ReturnForm<>(entity);
    }

    /**
     * 删除协议类
     *
     * @param keyIds id集合
     * @return ReturnForm.用于表示是否成功删除。
     */
    @ApiOperation(value = "删除协议类")
    @PostMapping(value = "/remove")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyIds", value = "标识集合", required = true, paramType = "query")
    })
    @ResponseBody
    @Override
    @RequiresRoles(DrConstant.ROLE_DR_ADMIN)
    public ReturnForm<String> remove(@RequestParam("keyIds") String[] keyIds) {
        publicNoticeDownloadService.remove(keyIds);
        return new ReturnForm<>("成功删除");
    }


    /**
     * 上传文件 并 保存
     * @param file
     * @return
     */
    @PostMapping({"/upload"})
    @ResponseBody
    @Override
    public ReturnForm<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            String code = this.publicNoticeDownloadService.upload(file);
            if("2".equals(code)){
                return new ReturnForm(false, "文件已存在！");
            }
        } catch (Throwable var5) {
            var5.printStackTrace();
            return new ReturnForm(false, "上传异常");
        }

        return new ReturnForm(true, "已完成读取！");
    }

    /**
     * 下载文件
     * @param ids
     */
    @GetMapping({"/download"})
    public void download(@RequestParam("ids") String ids, HttpServletResponse response) {
        try {
            this.publicNoticeDownloadService.download(response,ids);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }




}
