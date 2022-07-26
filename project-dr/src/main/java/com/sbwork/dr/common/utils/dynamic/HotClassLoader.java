package com.sbwork.dr.common.utils.dynamic;

import com.sbwork.systemConfig.exception.BaseCommonRuntimeException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.WritableByteChannel;

public class HotClassLoader extends ClassLoader {

    static String classBasePath = System.getProperty("java.io.tmpdir") + File.separator + "source-dir";

    public HotClassLoader() {
        super(ClassLoader.getSystemClassLoader());
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {

        // 这个classLoader的主要方法
        System.out.println("开始加载：" + name);

        Class clazz = null;
        byte[] data = getClassFileBytes(name);
        //这个方法非常重要
        clazz = defineClass(name, data, 0, data.length);
        //如果在这个类加载器中都不能找到这个类的话，就真的找不到了
        if (null == clazz) {
            throw new ClassNotFoundException("无法加载类：" + name);
        }
        return clazz;
    }

    public Class<?> reloadClass(String name) throws ClassNotFoundException {
        return this.findClass(name);
    }

    /**
     * 指定的类的是否已加载过
     *
     * @param name 类全名（含路径）
     * @return 是否已加载过
     */
    public boolean isLoadedClass(String name) {
        return findLoadedClass(name) == null;
    }

    /**
     * 把CLASS文件转成BYTE
     *
     * @throws Exception
     */
    private byte[] getClassFileBytes(String name) {

        String pathName = name.replace(".", "\\");
        pathName = HotClassLoader.classBasePath + "\\" + pathName + ".class";

        try {
            //采用NIO读取
            FileInputStream fis = new FileInputStream(new File(pathName));
            FileChannel filec = fis.getChannel();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            WritableByteChannel outc = Channels.newChannel(baos);
            ByteBuffer buffer = ByteBuffer.allocateDirect(1024);
            while (true) {
                int i = filec.read(buffer);
                if (i == 0 || i == -1) {
                    break;
                }
                buffer.flip();
                outc.write(buffer);
                buffer.clear();
            }
            fis.close();
            return baos.toByteArray();
        } catch (IOException e) {
            throw new BaseCommonRuntimeException("读取class文件“" + pathName + "”异常！");
        }
    }
}
