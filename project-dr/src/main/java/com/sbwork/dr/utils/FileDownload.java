package com.sbwork.dr.utils;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;

/**
 * 下载文件
 * 创建人：zhaotr
 * 创建时间：2018年03月10日
 * @version
 */
public class FileDownload {

	/**
	 * @param response 
	 * @param filePath		//文件完整路径(包括文件名和扩展名)
	 * @param fileName		//下载后看到的文件名
	 * @return  文件名
	 */
	public static void fileDownload(final HttpServletResponse response, String filePath, String fileName) throws Exception{  
		   
		byte[] data = FileUtil.toByteArray2(filePath);
	    fileName = URLEncoder.encode(fileName, "UTF-8");  
	    response.reset();  
	    response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");  
	    response.addHeader("Content-Length", "" + data.length);  
	    response.setContentType("application/octet-stream;charset=UTF-8");  
	    OutputStream outputStream = new BufferedOutputStream(response.getOutputStream());  
	    outputStream.write(data);  
	    outputStream.flush();  
	    outputStream.close();
	    response.flushBuffer();
	    
	}



	public static HttpServletResponse download(HttpServletResponse response,String filePath,String fileName ) {
		File file = new File(filePath);
		if (file.isDirectory()){
			return downDestroy(file, response);
		}else{
			return downFile(file,response);
		}
	}

    /**
     * 下载文件夹
     * @param file
     * @param response
     * @return
     */
    private static HttpServletResponse downDestroy(File file, HttpServletResponse response) {
//		String zipFilePath = gitConfig.getDestPath()+"/"+file.getName()+"_"+System.currentTimeMillis()/1000+".zip";
        String zipFilePath = file.getAbsolutePath()+"_"+System.currentTimeMillis()/1000+".zip";
        ZipCompressor zipCompressor = new ZipCompressor(zipFilePath);
        try {
            zipCompressor.compress(file.getPath());
            File zipFile = new File(zipFilePath);
            String filePath = zipFile.getPath();
            String fileName = zipFile.getName();
			downFile(zipFile,response);
//            fileDownload(response,filePath,fileName);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }


	/**
	 * 下载文件
	 * @param file
	 * @param response
	 * @return
	 */
	private static HttpServletResponse downFile(File file, HttpServletResponse response) {
		InputStream fis = null;
		OutputStream toClient = null;
		try {
			// 以流的形式下载文件。
			fis = new BufferedInputStream(new FileInputStream(file.getPath()));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			// 清空response
			response.reset();
			toClient = new BufferedOutputStream(response.getOutputStream());
			response.setContentType("application/octet-stream");
			//如果输出的是中文名的文件，在此处就要用URLEncoder.encode方法进行处理
			response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));
			toClient.write(buffer);
			toClient.flush();
		} catch (IOException ex) {
			ex.printStackTrace();
		}finally{
			try {
				File f = new File(file.getPath());
				f.delete();
				if(fis!=null){
					fis.close();
				}
				if(toClient!=null){
					toClient.close();
				}

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return response;
	}





}
