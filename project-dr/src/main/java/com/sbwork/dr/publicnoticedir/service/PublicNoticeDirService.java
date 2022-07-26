package com.sbwork.dr.publicnoticedir.service;

import com.sbwork.base.form.NzTreeNode;
import com.sbwork.base.service.BaseService;
import com.sbwork.dr.publicnoticedir.convert.PublicNoticeDirConvert;
import com.sbwork.dr.publicnoticedir.entity.PublicNoticeDirEntity;
import com.sbwork.dr.publicnoticedir.entity.type.PublicNoticeDirType;
import com.sbwork.dr.publicnoticedir.form.PublicNoticeDirForm;
import com.sbwork.dr.publicnoticedir.form.PublicNoticeDirTypeDirForm;
import com.sbwork.dr.publicnoticedir.form.PublicNoticeDirTypeFileForm;
import com.sbwork.dr.publicnoticedir.form.PublicNoticeDirTypeFolderForm;
import com.sbwork.dr.publicnoticedir.persistence.PublicNoticeDirMapper;
import com.sbwork.dr.publicnoticedir.searchForm.PublicNoticeDirSearchForm;
import com.sbwork.dr.utils.FileDownload;
import com.sbwork.rm.utils.PinYin4jUtils;
import com.sbwork.systemConfig.argumentResolver.AbstractFormGenerate;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class PublicNoticeDirService implements BaseService<PublicNoticeDirSearchForm, PublicNoticeDirForm> {

    @Resource
    private PublicNoticeDirMapper publicNoticeDirMapper;
    @Resource
    private PublicNoticeDirConvert publicNoticeDirConvert;
    @Resource
    private AbstractFormGenerate abstractFormGenerate;

    public PublicNoticeDirService() {
    }

    @PostConstruct
    public void init() {
        this.abstractFormGenerate.addType(PublicNoticeDirForm.class, PublicNoticeDirType.DIR.toString(), PublicNoticeDirTypeDirForm.class);
        this.abstractFormGenerate.addType(PublicNoticeDirForm.class, PublicNoticeDirType.FOLDER.toString(), PublicNoticeDirTypeFolderForm.class);
        this.abstractFormGenerate.addType(PublicNoticeDirForm.class, PublicNoticeDirType.FILE.toString(), PublicNoticeDirTypeFileForm.class);
    }

    public PublicNoticeDirForm getById(String id) {
        PublicNoticeDirEntity entity = (PublicNoticeDirEntity)this.publicNoticeDirMapper.getByKeyId(new Object[]{id});
        return (PublicNoticeDirForm)this.publicNoticeDirConvert.convertToForm(entity);
    }

    public List<PublicNoticeDirForm> listPageBySearchForm(PublicNoticeDirSearchForm searchForm) {
        List<PublicNoticeDirEntity> list = this.publicNoticeDirMapper.getBySearchForm(searchForm);
        return this.publicNoticeDirConvert.convertToFormList(list);
    }

    public void updateOrder(String[] keyIds) {
        for(int i = 0; i < keyIds.length; ++i) {
            String keyId = keyIds[i];
            PublicNoticeDirEntity entity = (PublicNoticeDirEntity)this.publicNoticeDirMapper.getByKeyId(new Object[]{keyId});
            entity.setSortNo(i + 1);
            this.publicNoticeDirMapper.update(entity);
        }
    }


    /**
     * 提交
     * @param form
     * @return
     */
    public PublicNoticeDirForm commit(PublicNoticeDirForm form) {

        // 目录路径
        form.setPathUrl("file" + File.separator + form.getName());
        // 父路径
        if (StringUtils.isBlank(form.getParentPath())) {
            PublicNoticeDirForm parentMenuForm = this.getById(form.getParentId());
            if (parentMenuForm != null) {
                String parentPath;
                if (StringUtils.isNotBlank(parentMenuForm.getParentPath())) {
                    parentPath = parentMenuForm.getParentPath() + "." + parentMenuForm.getId();
                } else {
                    parentPath = parentMenuForm.getId();
                }

                form.setParentPath(parentPath);
                // 目录路径
                form.setPathUrl(parentMenuForm.getPathUrl() + File.separator + form.getName());
            }
        }

        // 编号
        if (StringUtils.isBlank(form.getCode())) {
            try {
                String str = form.getName().replaceAll("（","");
                str = str.replaceAll("）","");
                String code = PinYin4jUtils.stringArrayToString(PinYin4jUtils.getHeadByString(str), " ");
                form.setCode(code.toLowerCase());
            } catch (Exception e) {
                System.out.println(form.getName());
            }
        }

        PublicNoticeDirEntity entity = (PublicNoticeDirEntity)this.publicNoticeDirConvert.convertToEntity(form);
        if (StringUtils.isEmpty(entity.getId())) {
            this.publicNoticeDirMapper.insert(entity);
        } else {
            this.publicNoticeDirMapper.update(entity);
        }

        return ( PublicNoticeDirForm)this.publicNoticeDirConvert.convertToForm(entity);
    }


    /**
     * 根据id删除
     * @param ids
     */
    public void remove(String... ids) {
        String[] var2 = ids;
        int var3 = ids.length;

        for(int var4 = 0; var4 < var3; ++var4) {
            String id = var2[var4];
            PublicNoticeDirSearchForm searchForm = new PublicNoticeDirSearchForm();
            searchForm.setParentId(id);
            List<PublicNoticeDirForm> forms = this.listPageBySearchForm(searchForm);
            this.remove((String[])forms.stream().map(PublicNoticeDirForm::getId).toArray((x$0) -> {
                return new String[x$0];
            }));
//            this.publicNoticeDirMapper.deleteByKeyId(new Object[]{id});

            // 删除文件
            PublicNoticeDirEntity entity = this.publicNoticeDirMapper.getByKeyId(id);
            if(entity != null){
                // 删除自己
                this.publicNoticeDirMapper.deleteByKeyId(id);
                // 删除文件 或 文件夹
                File file = new File(entity.getPathUrl());
                file.delete();
            }
        }

    }

    /**
     * 获取子节点
     * @param searchForm
     * @param maxLevel
     * @return
     */
    public List<NzTreeNode> getChildrenNodes(PublicNoticeDirSearchForm searchForm, Integer maxLevel) {
        Integer level = maxLevel;
        if (maxLevel < 0 && maxLevel != -1) {
            return Collections.emptyList();
        } else {
            List<PublicNoticeDirForm> menuForms = this.listPageBySearchForm(searchForm);
            List<NzTreeNode> nodes = this.publicNoticeDirConvert.convertToNzTreeNodeList(menuForms);
            if (maxLevel == 0 && nodes.size() > 0) {
                return null;
            } else {
                for(Iterator var6 = nodes.iterator(); var6.hasNext(); level = maxLevel) {
                    NzTreeNode nzTreeNode = (NzTreeNode)var6.next();
                    if (level != -1) {
                        level = level - 1;
                    }

                    PublicNoticeDirSearchForm newSearchForm = new PublicNoticeDirSearchForm();
                    newSearchForm.setParentId(nzTreeNode.getKey());
                    List<NzTreeNode> childNodes = this.getChildrenNodes(newSearchForm, level);
                    nzTreeNode.setChildren(childNodes);
                }

                return nodes;
            }
        }
    }


    public List<NzTreeNode> getNzTree(String parentId, Integer maxLevel) {
        PublicNoticeDirSearchForm searchForm = new PublicNoticeDirSearchForm();
        if (maxLevel == null) {
            maxLevel = -1;
        }

        if (StringUtils.isBlank(parentId)) {
            parentId = "-1";
        }

        searchForm.setParentId(parentId);
        return this.getChildrenNodes(searchForm, maxLevel);
    }

    public List<NzTreeNode> searchNzTree(String text) {
        PublicNoticeDirSearchForm searchForm = new  PublicNoticeDirSearchForm();
        searchForm.setName(text);
        List< PublicNoticeDirForm> menuForms = this.listPageBySearchForm(searchForm);
        return this.loadTree(menuForms);
    }

    public List<NzTreeNode> searchByText(String text) {
        PublicNoticeDirSearchForm searchForm = new  PublicNoticeDirSearchForm();
        searchForm.setName(text);
        List< PublicNoticeDirForm> menuForms = this.listPageBySearchForm(searchForm);
        return this.publicNoticeDirConvert.convertToNzTreeNodeList(menuForms);
    }

    private List<NzTreeNode> loadTree(List< PublicNoticeDirForm> forms) {
        Map<String, NzTreeNode> exitsNodeMap = new HashMap();
        Map<String, NzTreeNode> resultNodeMap = new HashMap();
        Iterator var4 = forms.iterator();

        PublicNoticeDirForm form;
        while(var4.hasNext()) {
            form = ( PublicNoticeDirForm)var4.next();
            NzTreeNode treeNode = this.publicNoticeDirConvert.convertToNzTreeNode(form);
            exitsNodeMap.put(form.getId(), treeNode);
            resultNodeMap.put(form.getId(), treeNode);
        }

        var4 = forms.iterator();

        while(true) {
            PublicNoticeDirForm parentForm;
            while(var4.hasNext()) {
                for(form = ( PublicNoticeDirForm)var4.next(); !StringUtils.isEmpty(form.getParentId()) && !"-1".equals(form.getParentId()); form = parentForm) {
                    parentForm = this.getById(form.getParentId());
                    if (parentForm == null) {
                        break;
                    }

                    NzTreeNode pTreeNode;
                    if (exitsNodeMap.containsKey(parentForm.getId())) {
                        pTreeNode = (NzTreeNode)exitsNodeMap.get(parentForm.getId());
                        if (pTreeNode.getChildren() == null) {
                            pTreeNode.setChildren(new ArrayList());
                        }

                        pTreeNode.appendChildren((NzTreeNode)resultNodeMap.remove(form.getId()));
                        pTreeNode.setExpanded(true);
                        break;
                    }

                    pTreeNode = this.publicNoticeDirConvert.convertToNzTreeNode(parentForm);
                    List<NzTreeNode> children = new ArrayList();
                    children.add(resultNodeMap.remove(form.getId()));
                    pTreeNode.setChildren(children);
                    pTreeNode.setExpanded(true);
                    exitsNodeMap.put(pTreeNode.getKey(), pTreeNode);
                    resultNodeMap.put(pTreeNode.getKey(), pTreeNode);
                }
            }

            return new ArrayList(resultNodeMap.values());
        }
    }


    /**
     * 上传文件 并保存
     * @param file
     */
    public String upload(MultipartFile file,String parentId) throws IOException {

        String status = "1";

//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
//        String format = sdf.format(new Date());
        String fileName ;
        if(file.getOriginalFilename().contains("/")){
            fileName = file.getOriginalFilename().split("/")[1];
        }else{
            fileName = file.getOriginalFilename();
        }

        // 保存到数据库
        PublicNoticeDirSearchForm searchForm = new PublicNoticeDirSearchForm();
        searchForm.setNameTemp(fileName);
        searchForm.setParentId(parentId);
        List<PublicNoticeDirEntity> list = this.publicNoticeDirMapper.getBySearchForm(searchForm);
        if(list == null || list.size() == 0){
            PublicNoticeDirEntity entity = new PublicNoticeDirEntity();
            entity.setName(fileName);

            // 获取父对象
            PublicNoticeDirEntity parentEntity = this.publicNoticeDirMapper.getByKeyId(parentId);
            // 父路径
            entity.setParentId(parentId);
            if(StringUtils.isNotBlank(parentEntity.getParentPath()))entity.setParentPath(parentEntity.getParentPath() + "." + parentId);
            if(StringUtils.isBlank(parentEntity.getParentPath()))entity.setParentPath(parentId);
            // 存相对路径
            entity.setPathUrl( parentEntity.getPathUrl() + File.separator + fileName);
            // 编号
            if (StringUtils.isBlank(entity.getCode())) {
                try {
                    String str = entity.getName().replaceAll("（","");
                    str = str.replaceAll("）","");
                    String code = PinYin4jUtils.stringArrayToString(PinYin4jUtils.getHeadByString(str), " ");
                    entity.setCode(code.toLowerCase());
                } catch (Exception e) {
//                    e.printStackTrace();
                    System.out.println(entity.getName());
                }
            }
            // 类型
            entity.setType(PublicNoticeDirType.valueOf("FILE"));
            this.publicNoticeDirMapper.insert(entity);

            // 文件保存路径
            String path = "";
            // 获取规范化的绝对路径
            String canonicalPath =  new File(".").getCanonicalPath();
//            path = canonicalPath +File.separator + "file" +File.separator +format + File.separator + file.getOriginalFilename();
            path = canonicalPath +File.separator + entity.getPathUrl();

            File dir = new File(path);
            //创建文件夹
            if (!dir.getParentFile().exists()) {
                dir.getParentFile().mkdirs();
            }
            // 保存数据
            file.transferTo(dir);

            status = "0";
        }else{
            // 已存在
            status = "2";
        }

        return status;
    }

    /**
     * 下载文件
     *
     * @param ids id集合
     */
    public void download(HttpServletResponse response, String ids) throws Exception {
        if(StringUtils.isNotBlank(ids)){
            String[] split = ids.split(",");
            for (String id : split) {
                if(StringUtils.isBlank(id))continue;
                PublicNoticeDirEntity entity = publicNoticeDirMapper.getByKeyId(id);
                if(entity != null){
                    String ctxPath= entity.getPathUrl();
                    File file = new File(ctxPath);
                    // 取得文件名。
                    String filename = file.getName();
//                    FileDownload.fileDownload(response, ctxPath,filename);
//                    String path =  new File(".").getCanonicalPath()  + File.separator + ctxPath;
                    FileDownload.download( response,ctxPath,filename);
                }
            }
        }

    }


}
