package com.sbwork.dr.common.utils.dynamic;

import com.sbwork.systemConfig.exception.BaseCommonRuntimeException;
import com.sbwork.systemConfig.exception.BaseException;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang.StringUtils;

import java.io.File;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class HotClassInstanceCache<T> {

    /**
     * 实例对象
     */
    private ConcurrentMap<String, T> instanceMap = new ConcurrentHashMap<>();

    /**
     * 重新编译源代码
     *
     * @param className 类名
     * @param source    源代码
     */
    private void updateJavaSource(String className, String source) {
        String r = className.substring(className.lastIndexOf(".") + 1);
        boolean result = JavaDynamicCompileUtil.compileJavaSource(source, HotClassLoader.classBasePath, r);
        if (!result) {
            throw new BaseCommonRuntimeException("java代码校验不通过！");
        }
    }

    /**
     * 用新的 “加载类（HotClassLoader）” 加载类
     *
     * @param className 类名
     */
    private void updateLoaderCache(String className) {
        HotClassLoader hotClassLoader = new HotClassLoader();
        try {
            Class clazz = hotClassLoader.loadClass(className);
            try {
                T analysis = (T) clazz.newInstance();
                instanceMap.put(className, analysis);
            } catch (Exception e) {
                throw new BaseCommonRuntimeException("实例化类（" + className + "）出错！");
            }
        } catch (ClassNotFoundException e) {
            throw new BaseCommonRuntimeException("加载类（" + className + "）出错！");
        }
    }

    /**
     * 重新编译源代码 并 重新加载
     *
     * @param className 类名
     * @param source    源代码
     */
    private void updateLoaderCache(String className, String source) {
        this.updateJavaSource(className, source);
        this.updateLoaderCache(className);
    }

    /**
     * 获取实例对象
     *
     * @param source 源码参数
     * @return 解析对象
     */
    public T getInstance(String keyId, String source) {
        return this.getInstance(keyId, source, false);
    }

    /**
     * 获取实例对象
     *
     * @param source 源码参数
     * @return 解析对象
     */
    public T getInstance(String keyId, String source, boolean force) {
        T analysis = null;
        if (keyId != null) {
            analysis = this.instanceMap.get(keyId);
        }

        if (!force && analysis != null) {
            return analysis;
        }

        JavaSourceOriginalForm originalForm = new JavaSourceOriginalForm(source);
        if (StringUtils.isEmpty(originalForm.getSource())) {
            throw new BaseCommonRuntimeException("表达式有问题！");
        }

        String className = originalForm.getPackageName() + "." + originalForm.getClassName();

        analysis = this.instanceMap.get(className);
        if (!force && analysis != null) {
            if (keyId != null) {
                this.instanceMap.put(keyId, analysis);
            }
            return analysis;
        }
        try {
            this.updateLoaderCache(className, originalForm.getSource());
            analysis = this.instanceMap.get(className);

            if (keyId != null) {
                this.instanceMap.put(keyId, analysis);
            }
            if (analysis != null) {
                return analysis;
            }
        } catch (BaseException e) {
            throw new BaseCommonRuntimeException("无法找到此类的文件！");
        }
        return null;
    }

    @Getter
    @Setter
    public static class JavaSourceOriginalForm {
        /**
         * 包名
         */
        private String baseClassPath = System.getProperty("java.io.tmpdir") + File.separator + "source-dir";

        public JavaSourceOriginalForm(String source) {
            this.source = source;

            JavaSourceAnalysisUtil.Inner inner = JavaSourceAnalysisUtil.parse(source);
            this.setPackageName(inner.getPackageName());
            this.setClassName(inner.getClassName());
        }

        /**
         * 类名
         */
        private String className;

        /**
         * 包名
         */
        private String packageName;

        /**
         * 代码
         */
        private String source;
    }
}
