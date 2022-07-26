package com.sbwork.dr.publicnoticedir.controller;


import com.sbwork.base.controller.BaseController;
import com.sbwork.base.form.NzTreeNode;
import com.sbwork.base.form.ReturnForm;
import com.sbwork.dr.publicnoticedir.form.PublicNoticeDirForm;
import com.sbwork.dr.publicnoticedir.searchForm.PublicNoticeDirSearchForm;
import com.sbwork.dr.publicnoticedir.service.PublicNoticeDirService;
import com.sbwork.rm.form.menu.AbstractRmMenuForm;
import com.sbwork.rm.searchForm.RmMenuSearchForm;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

@Api(
        tags = {"公告目录接口"}
)
@Controller
@RequestMapping({"dataReceive/publicNoticeDir"})
public class PublicNoticDirController extends BaseController {

    @Resource
    private PublicNoticeDirService publicNoticeDirService;

    public PublicNoticDirController() {
    }

    @ApiOperation("按id获取")
    @ApiImplicitParams({@ApiImplicitParam(
            name = "id",
            value = "ID",
            required = true
    )})
    @PostMapping({"/get"})
    @ResponseBody
    public ReturnForm<PublicNoticeDirForm> get(@RequestParam("id") String id) {
        PublicNoticeDirForm form = this.publicNoticeDirService.getById(id);
        return new ReturnForm(form);
    }

    @ApiOperation("获取菜单列表")
    @PostMapping({"/list"})
    @ResponseBody
    public ReturnForm<List<PublicNoticeDirForm>> list(PublicNoticeDirSearchForm searchForm) {

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

        List<PublicNoticeDirForm> result = this.publicNoticeDirService.listPageBySearchForm(searchForm);
        return new ReturnForm(result);
    }

    @ApiOperation("更新或者添加菜单")
    @PostMapping({"/commit"})
    @ResponseBody
    public ReturnForm<PublicNoticeDirForm> commit(PublicNoticeDirForm form) {
        form = this.publicNoticeDirService.commit(form);
        return new ReturnForm(form);
    }

    @ApiOperation("删除菜单")
    @ApiImplicitParams({@ApiImplicitParam(
            name = "keyIds[]",
            value = "标识集合",
            required = true
    )})
    @PostMapping({"/remove"})
    @ResponseBody
    public ReturnForm<String> remove(@RequestParam("keyIds") String[] keyIds) {
        this.publicNoticeDirService.remove(keyIds);
        return new ReturnForm("成功删除");
    }

    @ApiOperation("获取菜单树节点")
    @PostMapping({"/getNzTree"})
    @ResponseBody
    public ReturnForm<List<NzTreeNode>> getNzTree(String parentId, Integer maxLevel) {
        List<NzTreeNode> result = this.publicNoticeDirService.getNzTree(parentId, maxLevel);
        return new ReturnForm(true, result);
    }

    @ApiOperation("获取菜单树节点列表")
    @PostMapping({"/searchByText"})
    @ResponseBody
    public ReturnForm<List<NzTreeNode>> searchByText(@RequestParam("text") String text) {
        List<NzTreeNode> result = this.publicNoticeDirService.searchByText(text);
        return new ReturnForm(result);
    }

    @ApiOperation("搜索菜单树")
    @PostMapping({"/searchNzTree"})
    @ResponseBody
    public ReturnForm<List<NzTreeNode>> searchNzTree(String text) {
        List<NzTreeNode> result = this.publicNoticeDirService.searchNzTree(text);
        return new ReturnForm(true, result);
    }

//    @ApiOperation("菜单目录树拖拽排序")
//    @PostMapping({"/drag"})
//    @ResponseBody
//    public ReturnForm<Boolean> drag(@RequestParam("dragId") String dragId, @RequestParam("targetId") String targetId, @RequestParam("position") Integer position) {
//        this.publicNoticeDirService.drag(dragId, targetId, position);
//        return new ReturnForm(true);
//    }


    @ApiOperation("更新 菜单排序")
    @ApiImplicitParams({@ApiImplicitParam(
            name = "keyIds[]",
            value = "主键标识集合",
            required = true,
            allowMultiple = true
    )})
    @PostMapping({"/updateOrder"})
    @ResponseBody
    public ReturnForm<String> updateOrder(@RequestParam("keyIds") String[] keyIds) {
        this.publicNoticeDirService.updateOrder(keyIds);
        return new ReturnForm("更新成功！");
    }


    /**
     * 上传文件 并 保存
     * @param file
     * @return
     */
    @PostMapping({"/upload"})
    @ResponseBody
    public ReturnForm<String> upload(@RequestParam("file") MultipartFile file,@RequestParam("parentId") String parentId) {
        try {
            String code = this.publicNoticeDirService.upload(file,parentId);
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
            this.publicNoticeDirService.download(response,ids);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
