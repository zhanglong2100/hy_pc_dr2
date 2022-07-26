package com.sbwork.dr.publicnotice.util;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import cn.afterturn.easypoi.excel.entity.enmus.ExcelType;
import cn.afterturn.easypoi.excel.entity.result.ExcelImportResult;
import cn.afterturn.easypoi.handler.inter.IExcelDataHandler;
import com.sbwork.dr.agencysupermarket.entity.AgencySupermarket;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.*;

/**
 * excel 工具类
 *
 * @author easypoi
 * @date 2020/02/22
 */
public class ExcelUtils {
    /**
     * 导出excel到
     *
     * @param list           数据
     * @param title          表头
     * @param sheetName      sheetName
     * @param pojoClass      解析的对象类型
     * @param fileName       文件名称
     * @param isCreateHeader 是否创建表头
     * @return 文件路径
     */
    public static String exportExcelToFile(List<?> list, String title, String sheetName, Class<?> pojoClass, String fileName, boolean isCreateHeader) {
        OutputStream out = null;
        Workbook workbook = null;
        try {
            ExportParams exportParams = new ExportParams(title, sheetName, ExcelType.XSSF);
            exportParams.setCreateHeadRows(isCreateHeader);
            fileName = encodingFilename(fileName);

            out = new FileOutputStream(getAbsoluteFile(fileName));

            workbook = ExcelExportUtil.exportExcel(exportParams, pojoClass, list);
            workbook.write(out);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        } finally {
            if (workbook != null) {
                try {
                    workbook.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * excel 导出到文件
     *
     * @param list      数据
     * @param title     表头
     * @param sheetName sheet名称
     * @param pojoClass pojo类型
     * @param fileName  文件名
     * @return 文件路径
     */
    public static String exportExcelToFile(List<?> list, String title, String sheetName, Class<?> pojoClass, String fileName) {
        return exportExcelToFile(list, title, sheetName, pojoClass, fileName, true);
    }

    /**
     * excel 导出到文件
     *
     * @param list      数据
     * @param title     表头
     * @param sheetName sheet名称
     * @param pojoClass pojo类型
     * @return 文件路径
     */
    public static String exportExcelToFile(List<?> list, String title, String sheetName, Class<?> pojoClass) {
        return exportExcelToFile(list, title, sheetName, pojoClass, title, true);
    }

    /**
     * excel 导出到文件
     *
     * @param list      数据
     * @param fileName  文件名
     * @param pojoClass pojo类型
     * @return 文件路径
     */
    public static String exportExcelToFile(List<?> list, String fileName, Class<?> pojoClass) {
        return exportExcelToFile(list, fileName, fileName, pojoClass, fileName, true);
    }

    /**
     * excel 导出
     *
     * @param list           数据
     * @param title          标题
     * @param sheetName      sheet名称
     * @param pojoClass      pojo类型
     * @param fileName       文件名称
     * @param isCreateHeader 是否创建表头
     * @param response
     */
    public static void exportExcel(List<?> list, String title, String sheetName, Class<?> pojoClass, String fileName, boolean isCreateHeader, HttpServletResponse response) throws IOException {
        ExportParams exportParams = new ExportParams(title, sheetName, ExcelType.XSSF);
        exportParams.setCreateHeadRows(isCreateHeader);
        defaultExport(list, pojoClass, fileName, response, exportParams);
    }

    /**
     * excel 导出
     *
     * @param list      数据
     * @param title     标题
     * @param sheetName sheet名称
     * @param pojoClass pojo类型
     * @param fileName  文件名称
     * @param response
     */
    public static void exportExcel(List<?> list, String title, String sheetName, Class<?> pojoClass, String fileName, HttpServletResponse response) throws IOException {
        defaultExport(list, pojoClass, fileName, response, new ExportParams(title, sheetName, ExcelType.XSSF));
    }

    /**
     * excel 导出
     *
     * @param list         数据
     * @param pojoClass    pojo类型
     * @param fileName     文件名称
     * @param response
     * @param exportParams 导出参数
     */
    public static void exportExcel(List<?> list, Class<?> pojoClass, String fileName, ExportParams exportParams, HttpServletResponse response) throws IOException {
        defaultExport(list, pojoClass, fileName, response, exportParams);
    }

    /**
     * excel 导出
     *
     * @param list     数据
     * @param fileName 文件名称
     * @param response
     */
    public static void exportExcel(List<Map<String, Object>> list, String fileName, HttpServletResponse response) throws IOException {
        defaultExport(list, fileName, response);
    }

    /**
     * 默认的 excel 导出
     *
     * @param list         数据
     * @param pojoClass    pojo类型
     * @param fileName     文件名称
     * @param response
     * @param exportParams 导出参数
     */
    private static void defaultExport(List<?> list, Class<?> pojoClass, String fileName, HttpServletResponse response, ExportParams exportParams) throws IOException {

        if(fileName.equals("中介超市公告记录表")){
            exportParams.setDataHandler(new ExcelDataHandler2());
        }else if(fileName.equals("公告记录表")){
            exportParams.setDataHandler(new ExcelDataHandler());
        }

        Workbook workbook = ExcelExportUtil.exportExcel(exportParams, pojoClass, list);
        Sheet sheet = workbook.getSheet("公告信息");
        if(sheet != null){
            Iterator<Row> rowIterator = sheet.rowIterator();
            while (rowIterator.hasNext()){
                Row next = rowIterator.next();
                if(next.getRowNum() >=2){
                    Cell cell = next.getCell(9);
                    if(StringUtils.isNotBlank(cell.getStringCellValue()))cell.setCellValue("招标链接");
                    Cell cell2 = next.getCell(28);
                    if(StringUtils.isNotBlank(cell2.getStringCellValue()))cell2.setCellValue("中标链接");
                }
            }
        }

        sheet = workbook.getSheet("中介超市公告信息");
        if(sheet != null){
            Iterator<Row> rowIterator = sheet.rowIterator();
            while (rowIterator.hasNext()){
                Row next = rowIterator.next();
                if(next.getRowNum() >=2){
//                    Cell cell = next.getCell(10);
//                    if(StringUtils.isNotBlank(cell.getStringCellValue()))cell.setCellValue("链接");
                    Iterator<Cell> cellIterator = next.cellIterator();
                    while (cellIterator.hasNext()){
                        Cell cell = cellIterator.next();
                        if(cell != null  && cell.getHyperlink() != null){
                            cell.setCellValue("链接");
                        }
                    }
                }
            }
        }

        downLoadExcel(fileName, response, workbook);
    }

    /**
     * 默认的 excel 导出
     *
     * @param list     数据
     * @param fileName 文件名称
     * @param response
     */
    private static void defaultExport(List<Map<String, Object>> list, String fileName, HttpServletResponse response) throws IOException {
        Workbook workbook = ExcelExportUtil.exportExcel(list, ExcelType.HSSF);
        downLoadExcel(fileName, response, workbook);
    }

    /**
     * 下载
     *
     * @param fileName 文件名称
     * @param response
     * @param workbook excel数据
     */
    private static void downLoadExcel(String fileName, HttpServletResponse response, Workbook workbook) throws IOException {
        try {
            response.setCharacterEncoding("UTF-8");
            response.setHeader("content-Type", "application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(fileName + "." + ExcelTypeEnum.XLSX.getValue(), "UTF-8"));
            workbook.write(response.getOutputStream());
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
    }

    /**
     * excel 导入
     *
     * @param filePath   excel文件路径
     * @param titleRows  标题行
     * @param headerRows 表头行
     * @param pojoClass  pojo类型
     * @param <T>
     * @return
     */
    public static <T> List<T> importExcel(String filePath, Integer titleRows, Integer headerRows, Class<T> pojoClass) throws IOException {
        if (StringUtils.isBlank(filePath)) {
            return null;
        }
        ImportParams params = new ImportParams();
        params.setTitleRows(titleRows);
        params.setHeadRows(headerRows);
        params.setNeedSave(true);
        params.setSaveUrl("/excel/");
        try {
            return ExcelImportUtil.importExcel(new File(filePath), pojoClass, params);
        } catch (NoSuchElementException e) {
            throw new IOException("模板不能为空");
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
    }

    /**
     * excel 导入
     *
     * @param file      excel文件
     * @param pojoClass pojo类型
     * @param <T>
     * @return
     */
    public static <T> List<T> importExcel(MultipartFile file, Class<T> pojoClass) throws IOException {
        return importExcel(file, 1, 1, pojoClass);
    }

    /**
     * excel 导入
     *
     * @param file       excel文件
     * @param titleRows  标题行
     * @param headerRows 表头行
     * @param pojoClass  pojo类型
     * @param <T>
     * @return
     */
    public static <T> List<T> importExcel(MultipartFile file, Integer titleRows, Integer headerRows, Class<T> pojoClass) throws IOException {
        return importExcel(file, titleRows, headerRows, false, pojoClass);
    }

    /**
     * excel 导入
     *
     * @param file       上传的文件
     * @param titleRows  标题行
     * @param headerRows 表头行
     * @param needVerify 是否检验excel内容
     * @param pojoClass  pojo类型
     * @param <T>
     * @return
     */
    public static <T> List<T> importExcel(MultipartFile file, Integer titleRows, Integer headerRows, boolean needVerify, Class<T> pojoClass) throws IOException {
        if (file == null) {
            return null;
        }
        try {
            return importExcel(file.getInputStream(), titleRows, headerRows, needVerify, pojoClass);
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
    }

    /**
     * excel 导入
     *
     * @param inputStream 文件输入流
     * @param titleRows   标题行
     * @param headerRows  表头行
     * @param needVerify  是否检验excel内容
     * @param pojoClass   pojo类型
     * @param <T>
     * @return
     */
    public static <T> List<T> importExcel(InputStream inputStream, Integer titleRows, Integer headerRows, boolean needVerify, Class<T> pojoClass) throws IOException {
        if (inputStream == null) {
            return null;
        }
        ImportParams params = new ImportParams();
        params.setTitleRows(titleRows);
        params.setHeadRows(headerRows);
        params.setSaveUrl("/excel/");
        params.setNeedSave(true);
        params.setNeedVerify(needVerify);
        try {
            ExcelImportResult<AgencySupermarket> result = ExcelImportUtil.importExcelMore(inputStream, pojoClass, params);

            List<AgencySupermarket> list = result.getList();
            List<String> urlList = new ArrayList<>();
            Workbook workbook =result.getWorkbook();
//            Sheet sheet = workbook.getSheet("Sheet1");
            Sheet sheet =  workbook.getSheetAt(0);
            if(sheet != null){
                Iterator<Row> rowIterator = sheet.rowIterator();
                while (rowIterator.hasNext()){
                    Row next = rowIterator.next();
                    if(next.getRowNum() >=2){
                        Iterator<Cell> cellIterator = next.cellIterator();
                        while (cellIterator.hasNext()){
                            Cell cell = cellIterator.next();
                            if(cell != null  && cell.getHyperlink() != null){
                                urlList.add(cell.getHyperlink().getAddress());
                                list.get(next.getRowNum() - 2).setPublicNoticeUrl(cell.getHyperlink().getAddress());
                            }
                        }

                    }
                }
            }

//            int j = 0;
//            for (int i = 0; i < result.getList().size(); i++) {
//                AgencySupermarket agencySupermarket = result.getList().get(i);
//                if(org.apache.commons.lang3.StringUtils.isNotBlank(agencySupermarket.getPublicNoticeUrl())){
//                    agencySupermarket.setPublicNoticeUrl(urlList.get(j));
//                    j++;
//                }
//            }
            return   (List<T>)result.getList();
//            return ExcelImportUtil.importExcel(inputStream, pojoClass, params);
        } catch (NoSuchElementException e) {
            throw new IOException("excel文件不能为空");
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
    }
//    /**
//     * excel 导入
//     *
//     * @param inputStream 文件输入流
//     * @param titleRows   标题行
//     * @param headerRows  表头行
//     * @param needVerify  是否检验excel内容
//     * @param pojoClass   pojo类型
//     * @param <T>
//     * @return
//     */
//    public static <T> List<T> importExcel(InputStream inputStream, Integer titleRows, Integer headerRows, boolean needVerify, Class<T> pojoClass) throws IOException {
//        if (inputStream == null) {
//            return null;
//        }
//        ImportParams params = new ImportParams();
//        params.setTitleRows(titleRows);
//        params.setHeadRows(headerRows);
//        params.setSaveUrl("/excel/");
//        params.setNeedSave(true);
//        params.setNeedVerify(needVerify);
//        try {
//
//            return ExcelImportUtil.importExcel(inputStream, pojoClass, params);
//        } catch (NoSuchElementException e) {
//            throw new IOException("excel文件不能为空");
//        } catch (Exception e) {
//            throw new IOException(e.getMessage());
//        }
//    }


    /**
     * 获取下载路径
     *
     * @param downloadPath 文件名称
     */
    private static String getAbsoluteFile(String downloadPath) {
        downloadPath = "/excel/" + downloadPath;
        File desc = new File(downloadPath);
        if (!desc.getParentFile().exists()) {
            desc.getParentFile().mkdirs();
        }
        return downloadPath;
    }

    /**
     * 编码文件名
     */
    private static String encodingFilename(String filename) {
        filename = UUID.randomUUID().toString() + "_" + filename + "." + ExcelTypeEnum.XLSX.getValue();
        return filename;
    }

    /**
     * Excel 类型枚举
     */
    enum ExcelTypeEnum {
        XLS("xls"), XLSX("xlsx");
        private String value;

        ExcelTypeEnum(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}

