package com.sbwork.dr.publicnotice.api;

import com.sbwork.base.form.ComboBox;
import com.sbwork.base.form.GroupComboBox;
import com.sbwork.base.form.ReturnForm;
import com.sbwork.base.form.ReturnPage;
import com.sbwork.dr.publicnotice.entity.PublicNoticeEntity;
import com.sbwork.dr.publicnotice.form.PublicNoticeForm;
import com.sbwork.dr.publicnotice.searchForm.PublicNoticeSearchForm;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 公告类controller
 */
@Api(tags = "公告类接口")
@RestController
@RequestMapping("dataReceive/publicNotice")
public interface PublicNoticeApi {

    /**
     * 按id进行查询
     *
     * @param id 标识
     * @return 公告类Form
     */
    @ApiOperation(value = "按id获取")
    @PostMapping(value = "/get")
    @ResponseBody
    ReturnForm<PublicNoticeForm> get(@RequestParam("id") String id);

    /**
     * 按searchForm获取公告类列表
     *
     * @param searchForm 公告类searchForm
     * @return 协议类列表（带用分页的信息）
     */
    @ApiOperation(value = "获取公告类列表")
    @PostMapping(value = "/list")
    @ResponseBody
    ReturnForm<ReturnPage<PublicNoticeForm>> list(PublicNoticeSearchForm searchForm);


    @GetMapping({"/export"})
    public void export(PublicNoticeSearchForm searchForm, HttpServletResponse response);


    /**
     * 更新公告类
     *
     */
    @ApiOperation(value = "更新或者添加公告类")
    @PostMapping(value = "/commit")
    @ResponseBody
    ReturnForm<PublicNoticeEntity> commit(PublicNoticeEntity entity);

    /**
     * 删除公告类
     *
     * @param keyIds id集合
     * @return public ReturnForm.用于表示是否成功删除。
     */
    @ApiOperation(value = "删除公告类")
    @PostMapping(value = "/remove")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyIds", value = "标识集合", required = true)
    })
    @ResponseBody
    ReturnForm<String> remove(@RequestParam("keyIds") String[] keyIds);

}
