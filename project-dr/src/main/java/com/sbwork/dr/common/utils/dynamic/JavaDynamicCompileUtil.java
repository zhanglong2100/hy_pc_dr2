package com.sbwork.dr.common.utils.dynamic;

import javax.tools.*;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Collections;

public class JavaDynamicCompileUtil {
    /**
     * 动态编译java类成成class文件放入到baseClassPath
     *
     * @param source        源代码
     * @param baseClassPath 存放地址
     * @param className     类名
     * @return
     */
    public static boolean compileJavaSource(String source, String baseClassPath, String className) {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);
        StringSourceJavaObject sourceObject = null;
        try {
            File file = new File(baseClassPath);
            if (!file.exists()) {
                file.mkdirs();
            }
            Iterable<String> options = Arrays.asList(
                    "-d", baseClassPath,
                    "-classpath", System.getProperty("java.class.path"));


//            // set compiler's classpath to be same as the runtime's
//            String classpathString = System.getProperty("java.class.path");
//            optionList.addAll(Arrays.asList("-nowarn",
//                    "-classpath",
//                    classpathString,
//                    "-g",
//                    "-source",
//                    javaVersion,
//                    "-target",
//                    javaVersion));
//
//            Collection classpathFiles = getClasspathJars(classpathString);
//            addPreviousCompiledClassesToClasspathFiles(rootClassPath, classpathFiles);
//
//            try {
//                File file = new File(getTargetRoot(tempClassPath));
//                file.mkdirs();
//                standardFileManager.setLocation(StandardLocation.CLASS_OUTPUT, Lists.newArrayList(file));
//                standardFileManager.setLocation(StandardLocation.CLASS_PATH, classpathFiles);
//
//                // adding current dir to the source path, to find the compiled DV
//                if (generateSeparateJarsForEachDecision.equals(NO_JAR)) {
//                    standardFileManager.setLocation(StandardLocation.SOURCE_PATH, Lists.newArrayList(file));
//                }
//            } catch (IOException e) {
//                throw new RuntimeException(e);
//            }


            sourceObject = new StringSourceJavaObject(className, source);
            Iterable<? extends JavaFileObject> fileObjects = Collections.singletonList(sourceObject);
            JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, null, options, null, fileObjects);
            boolean result = task.call();
            return result;
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return false;
    }

    private static class StringSourceJavaObject extends SimpleJavaFileObject {

        private String content;

        public StringSourceJavaObject(String name, String content) throws URISyntaxException {
            super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
            this.content = content;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) throws IOException {
            return content;
        }
    }
}
