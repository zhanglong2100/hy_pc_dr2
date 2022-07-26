package com.sbwork.dr.publicnoticedownload.service;


import com.sbwork.base.service.BaseService;
import com.sbwork.dr.publicnoticedownload.convert.PublicNoticeDownloadConvert;
import com.sbwork.dr.publicnoticedownload.entity.PublicNoticeDownloadEntity;
import com.sbwork.dr.publicnoticedownload.form.PublicNoticeDownloadForm;
import com.sbwork.dr.publicnoticedownload.persistence.PublicNoticeDownloadMapper;
import com.sbwork.dr.publicnoticedownload.searchForm.PublicNoticeDownloadSearchForm;
import com.sbwork.dr.utils.FileDownload;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class PublicNoticeDownloadService implements BaseService<PublicNoticeDownloadSearchForm, PublicNoticeDownloadEntity> {


    @Resource
    private PublicNoticeDownloadMapper publicNoticeDownloadMapper;

    @Resource
    private PublicNoticeDownloadConvert publicNoticeDownloadConvert;


    /**
     * 按id进行查询
     *
     * @param id 标识
     * @return 协议类form
     */
    public <T extends PublicNoticeDownloadForm> T getById(String id) {
        PublicNoticeDownloadEntity entity = publicNoticeDownloadMapper.getByKeyId(id);
        return (T) publicNoticeDownloadConvert.convertToForm(entity);
    }

    /**
     * 按列表进行查询，后回协议类form的集合
     *
     * @param searchForm 协议类searchForm
     *
     */
//    @Override
    public List<PublicNoticeDownloadEntity> listPageBySearchForm(PublicNoticeDownloadSearchForm searchForm) {
        List<PublicNoticeDownloadEntity> list = publicNoticeDownloadMapper.getBySearchForm(searchForm);
        return list;
    }

    @Override
    public PublicNoticeDownloadEntity commit(PublicNoticeDownloadEntity entity) {
        if (StringUtils.isEmpty(entity.getId())) {
            // 保存公告
            publicNoticeDownloadMapper.insert(entity);
        } else {
            publicNoticeDownloadMapper.update(entity);
        }
        return null;
    }

    /**
     * 按ids 删除 协议类
     *
     * @param ids id集合
     */
    @Override
    public void remove(String... ids) {
        for (String id : ids) {
            PublicNoticeDownloadEntity entity = publicNoticeDownloadMapper.getByKeyId(id);
            if(entity != null){
                // 删除自己
                publicNoticeDownloadMapper.deleteByKeyId(id);
                // 删除文件
                File file = new File(entity.getPathUrl());
                file.delete();
            }

        }
    }


    /**
     * 上传文件 并保存
     * @param file
     */
    public String upload(MultipartFile file) throws IOException {

        String status = "1";

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        String format = sdf.format(new Date());

        // 保存到数据库
        PublicNoticeDownloadSearchForm searchForm = new PublicNoticeDownloadSearchForm();
        searchForm.setNameTemp(file.getOriginalFilename());
        List<PublicNoticeDownloadEntity> list = this.publicNoticeDownloadMapper.getBySearchForm(searchForm);
        if(list == null || list.size() == 0){
            PublicNoticeDownloadEntity entity = new PublicNoticeDownloadEntity();
            entity.setName(file.getOriginalFilename());

            // 存相对路径
            entity.setPathUrl( "file" +File.separator +format + File.separator + file.getOriginalFilename());
            this.publicNoticeDownloadMapper.insert(entity);

            // 文件保存路径
            String path = "";
            // 获取规范化的绝对路径
            String canonicalPath =  new File(".").getCanonicalPath();
            path = canonicalPath +File.separator + "file" +File.separator +format + File.separator + file.getOriginalFilename();

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
    public void download(HttpServletResponse response,String ids) throws Exception {
        if(StringUtils.isNotBlank(ids)){
            String[] split = ids.split(",");
            for (String id : split) {
                if(StringUtils.isBlank(id))continue;
                PublicNoticeDownloadEntity entity = publicNoticeDownloadMapper.getByKeyId(id);
                if(entity != null){
                    String ctxPath= entity.getPathUrl();
                    File file = new File(ctxPath);
                    // 取得文件名。
                    String filename = file.getName();
                    FileDownload.fileDownload(response, ctxPath,filename);
                }
            }
        }

    }


}
