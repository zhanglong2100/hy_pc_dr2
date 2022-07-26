package com.sbwork.dr.publicnotice.controller;

import com.sbwork.base.controller.BaseController;
import com.sbwork.base.form.ReturnForm;
import com.sbwork.base.form.ReturnPage;
import com.sbwork.dr.DrConstant;
import com.sbwork.dr.publicnotice.api.PublicNoticeApi;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.form.PublicNoticeForm;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import com.sbwork.dr.publicnotice.service.PublicNoticeService;
import com.sbwork.login.shiro.util.SessionAttributeUtil;
import com.sbwork.ou.form.OuSessionUserForm;
import com.sbwork.systemConfig.plugin.bean.OrderBy;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 公告controller
 */
@Api(tags = "公告接口")
@Controller
@RequestMapping("dataReceive/publicNotice")
public class PublicNoticeController extends BaseController implements PublicNoticeApi {

    @Resource
    private PublicNoticeService publicNoticeService;

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
    public ReturnForm<PublicNoticeForm> get(@RequestParam("id") String id) {
        PublicNoticeForm form = publicNoticeService.getById(id);
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
    public ReturnForm<ReturnPage<PublicNoticeForm>> list(PublicNoticeSearchForm searchForm) {
        searchForm.setOrderByField("createTime");
        searchForm.setOrderByType(OrderBy.OrderByType.DESC);

        // 获取当前登录名
        OuSessionUserForm userForm = (OuSessionUserForm)SessionAttributeUtil.getSessionUser();
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

        if(StringUtils.isBlank(searchForm.getBidIf()))searchForm.setBidIf(null);

        List<PublicNoticeEntity> result = publicNoticeService.listPageBySearchForm(searchForm);

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
//    @ExceptionHandler(Exception.class)
    public ReturnForm<PublicNoticeEntity> commit(PublicNoticeEntity entity) {
        entity = publicNoticeService.commit(entity);
        if("1".equals(entity.getId())){
            return new ReturnForm(false,"网址不在解析范围内");
        }else if("2".equals(entity.getId())){
            return new ReturnForm(false,"网络连接超时,请稍后尝试");
        }else if("3".equals(entity.getId())){
            return new ReturnForm(false,"网址解析失败，请确认网址是否匹配");
        }else if("4".equals(entity.getId())){
            return new ReturnForm(false,"已存在相同公告");
        }
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
        publicNoticeService.remove(keyIds);
        return new ReturnForm<>("成功删除");
    }

    @GetMapping({"/export"})
    public void export(PublicNoticeSearchForm searchForm, HttpServletResponse response) {
        searchForm.setOrderByField("createTime");
        searchForm.setOrderByType(OrderBy.OrderByType.DESC);

        // 获取当前登录名
        OuSessionUserForm userForm = (OuSessionUserForm)SessionAttributeUtil.getSessionUser();
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

            if(StringUtils.isBlank(searchForm.getBidIf()))searchForm.setBidIf(null);
        }catch (ParseException e) {
            e.printStackTrace();
        }
        this.publicNoticeService.export(searchForm, response);
    }

//    /**
//     * 删除协议类
//     *
//     * @param keyIds id集合
//     * @return ReturnForm.用于表示是否成功删除。
//     */
//    @ApiOperation(value = "删除协议类")
//    @PostMapping(value = "/updateOrder")
//    @ApiImplicitParams({
//            @ApiImplicitParam(name = "keyIds", value = "标识集合", required = true, paramType = "query"),
//            @ApiImplicitParam(name = "parentId", value = "父协议标识", required = true, paramType = "query")
//    })
//    @ResponseBody
//    @Override
//    public ReturnForm<String> updateOrder(@RequestParam("keyIds") String[] keyIds, @RequestParam("parentId") String parentId) {
//        sbDrProtocolService.updateOrder(keyIds, parentId);
//        return new ReturnForm<>("成功排序");
//    }


}
