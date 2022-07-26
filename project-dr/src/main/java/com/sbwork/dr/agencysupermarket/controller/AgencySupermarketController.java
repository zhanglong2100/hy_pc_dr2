package com.sbwork.dr.agencysupermarket.controller;

import com.sbwork.base.controller.BaseController;
import com.sbwork.base.form.ReturnForm;
import com.sbwork.base.form.ReturnPage;
import com.sbwork.dr.DrConstant;
import com.sbwork.dr.agencysupermarket.entity.AgencySupermarket;
import com.sbwork.dr.agencysupermarket.form.AgencySupermarketForm;
import com.sbwork.dr.agencysupermarket.searchForm.AgencySupermarketSearchForm;
import com.sbwork.dr.agencysupermarket.service.AgencySupermarketService;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import com.sbwork.login.shiro.util.SessionAttributeUtil;
import com.sbwork.ou.form.OuSessionUserForm;
import com.sbwork.systemConfig.plugin.bean.OrderBy;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * 中介超市controller
 */
@Api(tags = "中介超市接口")
@Controller
@RequestMapping("dataReceive/agencySupermarket")
public class AgencySupermarketController extends BaseController {
    @Resource
    private AgencySupermarketService agencySupermarketService;

    @Override
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
        DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        binder.registerCustomEditor(Date.class, new HyDateEditor(format, true));
    }

    /**
     * 按id进行查询
     * @param id 标识
     * @return 中介超市Form
     */
    @ApiOperation(value = "按id获取")
    @ApiImplicitParams(
        @ApiImplicitParam(name = "id", value = "标识", paramType = "query", required = true)
    )
    @PostMapping(value = "/get")
    @ResponseBody
    public ReturnForm<AgencySupermarketForm> get(@RequestParam("id") String id){
        AgencySupermarketForm form = agencySupermarketService.getById(id);
        return new ReturnForm<>(form);
    }

    /**
     * 按searchForm获取中介超市列表
     * @param searchForm 中介超市searchForm
     * @return 中介超市列表（带用分页的信息）
     */
    @ApiOperation(value = "获取中介超市列表")
    @PostMapping(value = "/list")
    @ResponseBody
    public ReturnForm<ReturnPage<AgencySupermarketForm>> list(AgencySupermarketSearchForm searchForm){
        searchForm.setOrderByField("orderNum");
        searchForm.setOrderByType(OrderBy.OrderByType.DESC);

        // 获取当前登录名
        OuSessionUserForm userForm = (OuSessionUserForm) SessionAttributeUtil.getSessionUser();
        if(!"admin".equals(userForm.getLoginName())){
            searchForm.setCreateUserName(userForm.getLoginName());
        }

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

        if(StringUtils.isBlank(searchForm.getIfProjectApproval()))searchForm.setIfProjectApproval(null);
        if(StringUtils.isBlank(searchForm.getIfApply()))searchForm.setIfApply(null);
        if(StringUtils.isBlank(searchForm.getIfBidding()))searchForm.setIfBidding(null);
        if(StringUtils.isBlank(searchForm.getIfArchive()))searchForm.setIfArchive(null);
        if(StringUtils.isBlank(searchForm.getBusinessType()))searchForm.setBusinessType(null);

        List<AgencySupermarketForm> result = agencySupermarketService.listPageBySearchForm(searchForm);
        return new ReturnForm<>(new ReturnPage<>(searchForm.getTotal(), result));
    }


    /**
     * 更新中介超市
     * @param  form 中介超市
     * @return 更新后的结果form
     */
    @ApiOperation(value = "更新或者添加中介超市")
    @PostMapping(value = "/commit")
    @ResponseBody
    @RequiresRoles(DrConstant.ROLE_DR_ADMIN)
    public ReturnForm<AgencySupermarketForm> commit(AgencySupermarketForm form){
        form = agencySupermarketService.commit(form);
        if("1".equals(form.getId())){
            return new ReturnForm(false,"网址不在解析范围内");
        }else if("2".equals(form.getId())){
            return new ReturnForm(false,"网络连接超时,请稍后尝试");
        }else if("3".equals(form.getId())){
            return new ReturnForm(false,"网址解析失败，请确认网址是否匹配");
        }else if("4".equals(form.getId())){
            return new ReturnForm(false,"已存在相同公告");
        }else if("5".equals(form.getId())){
            return new ReturnForm(false,"您的访问频率太高，请稍后再试！");
        }else if("6".equals(form.getId())){
            return new ReturnForm(false,"没有发布时间，请填写！");
        }
        return new ReturnForm<>(form);
    }

    /**
     * 删除中介超市
     * @param keyIds id集合
     * @return ReturnForm.用于表示是否成功删除。
     */
    @ApiOperation(value = "删除中介超市")
    @ApiImplicitParams(
        @ApiImplicitParam(name = "keyIds[]", value = "标识集合", required = true)
    )
    @PostMapping(value = "/remove")
    @ResponseBody
    public ReturnForm<String> remove(@RequestParam("keyIds") String[] keyIds){
        agencySupermarketService.remove(keyIds);
        return new ReturnForm<>("成功删除");
    }

    @GetMapping({"/export"})
    public void export(AgencySupermarketSearchForm searchForm, HttpServletResponse response) {
        searchForm.setOrderByField("orderNum");
        searchForm.setOrderByType(OrderBy.OrderByType.ASC);

        // 获取当前登录名
        OuSessionUserForm userForm = (OuSessionUserForm) SessionAttributeUtil.getSessionUser();
        if(!"admin".equals(userForm.getLoginName())){
            searchForm.setCreateUserName(userForm.getLoginName());
        }

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

        if(StringUtils.isBlank(searchForm.getIfProjectApproval()))searchForm.setIfProjectApproval(null);
        if(StringUtils.isBlank(searchForm.getIfApply()))searchForm.setIfApply(null);
        if(StringUtils.isBlank(searchForm.getIfBidding()))searchForm.setIfBidding(null);
        if(StringUtils.isBlank(searchForm.getIfArchive()))searchForm.setIfArchive(null);
        if(StringUtils.isBlank(searchForm.getBusinessType()))searchForm.setBusinessType(null);

        this.agencySupermarketService.export(searchForm, response);
    }


    /**
     * 导入Excel 并 保存数据
     * @param file
     * @return
     */
    @PostMapping({"/upload"})
    @ResponseBody
    public ReturnForm<String> upload(@RequestParam("file") MultipartFile file) {
        try {
             this.agencySupermarketService.upload(file);
        } catch (Throwable var5) {
            var5.printStackTrace();
            return new ReturnForm(false, "导入异常");
        }

        return new ReturnForm(true, "已完成导入！");
    }

    /**
     *一键排序（根据发布时间）
     * @return
     */
    @PostMapping({"/sort"})
    @ResponseBody
    public ReturnForm<String> sort() {
        try {
            this.agencySupermarketService.sort();
        } catch (Throwable var5) {
            var5.printStackTrace();
            return new ReturnForm(false, "排序异常");
        }

        return new ReturnForm(true, "排序成功！");
    }


}
