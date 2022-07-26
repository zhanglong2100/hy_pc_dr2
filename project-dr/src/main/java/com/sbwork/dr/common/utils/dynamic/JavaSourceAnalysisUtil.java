package com.sbwork.dr.common.utils.dynamic;

import com.sun.source.tree.ClassTree;
import com.sun.source.tree.MemberSelectTree;
import com.sun.source.util.TreeScanner;
import com.sun.tools.javac.file.JavacFileManager;
import com.sun.tools.javac.parser.ParserFactory;
import com.sun.tools.javac.tree.JCTree;
import com.sun.tools.javac.util.Context;
import lombok.Getter;
import lombok.Setter;

public class JavaSourceAnalysisUtil {
    private static ParserFactory getParserFactory() {
        Context context = new Context();
        JavacFileManager.preRegister(context);
        ParserFactory factory = ParserFactory.instance(context);
        return factory;
    }

    public static Inner parse(String source) {
        JCTree.JCCompilationUnit unit = getParserFactory().newParser(source, true, false, true).parseCompilationUnit();
        Inner inner = new Inner();
        TreeScanner scanner = new TreeScanner<Void, Void>() {
            @Override
            public Void visitMemberSelect(MemberSelectTree memberSelectTree, Void aVoid) {
                if (inner.getPackageName() == null) {
                    inner.setPackageName(memberSelectTree.toString());
                }
                return super.visitMemberSelect(memberSelectTree, aVoid);
            }

            @Override
            public Void visitClass(ClassTree classTree, Void aVoid) {
                if (inner.getClassName() == null) {
                    inner.setClassName(classTree.getSimpleName().toString());
                }
                return super.visitClass(classTree, aVoid);
            }
        };

        scanner.visitCompilationUnit(unit, null);
        return inner;

    }

    @Getter
    @Setter
    public static class Inner {
        private String packageName;

        private String className;
    }

    public static void main(String args[]) {
        String source = "package com.sbwork.dr.gc.analysis.electricMeter;\n" +
                "\n" +
                "import com.sbwork.dr.common.content.MessageContent;\n" +
                "import com.sbwork.dr.common.utils.ByteUtil;\n" +
                "import com.sbwork.dr.conf.form.SbDrProtocolPropertiesForm;\n" +
                "import com.sbwork.dr.conf.form.analysis.protocol.SbDrAbstractProtocolAnalysisForm;\n" +
                "import com.sbwork.dr.conf.type.SbDrPropertyTimeType;\n" +
                "import com.sbwork.dr.deal.form.SbDrRecordTerminalForm;\n" +
                "import com.sbwork.dr.deal.service.analysis.ISbDrTwiceAnalysis;\n" +
                "import com.sbwork.dr.deal.service.analysis.support.BaseDataAnalysis;\n" +
                "import com.sbwork.systemConfig.SpringBeanUtil;\n" +
                "import com.sbwork.systemConfig.exception.BaseCommonRuntimeException;\n" +
                "import org.springframework.stereotype.Component;\n" +
                "\n" +
                "import java.io.ByteArrayInputStream;\n" +
                "import java.io.IOException;\n" +
                "import java.math.RoundingMode;\n" +
                "import java.text.DecimalFormat;\n" +
                "import java.util.Collections;\n" +
                "import java.util.HashMap;\n" +
                "import java.util.List;\n" +
                "import java.util.Map;\n" +
                "\n" +
                "/**\n" +
                " * @program: sbwork-receive-parent\n" +
                " * @Description 电表数据解析类\n" +
                " * @Author 陈琪\n" +
                " * @Date 2019-7-17 0017 11:35\n" +
                " * @Version 1.0\n" +
                " **/\n" +
                "@Component\n" +
                "public class ElectricMeterDataAnalysis extends BaseDataAnalysis {\n" +
                "\n" +
                "    @Override\n" +
                "    protected List<SbDrProtocolPropertiesForm> getPropertyMetaDatasInner() {\n" +
                "        return Collections.singletonList(\n" +
                "                new SbDrProtocolPropertiesForm(\n" +
                "                        \"电表总数\",\n" +
                "                        \"electricMeter\",\n" +
                "                        SbDrPropertyTimeType.CURRENT,\n" +
                "                        \"KW.H\",\n" +
                "                        \"1\",\n" +
                "                        \"\",\n" +
                "                        \"0\"\n" +
                "                )\n" +
                "        );\n" +
                "    }\n" +
                "\n" +
                "    @Override\n" +
                "    public SbDrRecordTerminalForm analysisInner(SbDrAbstractProtocolAnalysisForm analysisForm, MessageContent messageContent) {\n" +
                "        byte[] data = messageContent.getBytes();\n" +
                "\n" +
                "        if (data == null) {\n" +
                "            throw new BaseCommonRuntimeException(messageContent.getTerminalId() + \"终端的数据为空\");\n" +
                "        }\n" +
                "\n" +
                "        byte[] addrBytes = new byte[1];\n" +
                "        byte[] funcBytes = new byte[1];\n" +
                "        byte[] dataLengthBytes = new byte[1];\n" +
                "        byte[] electricMeterBytes;\n" +
                "        // crc 校验码 第一位是低位  第二位是高位\n" +
                "        byte[] validBytes = new byte[2];\n" +
                "\n" +
                "        ByteArrayInputStream bais = new ByteArrayInputStream(data);\n" +
                "\n" +
                "        try {\n" +
                "            bais.read(addrBytes);\n" +
                "            bais.read(funcBytes);\n" +
                "            bais.read(dataLengthBytes);\n" +
                "        } catch (IOException e) {\n" +
                "            e.printStackTrace();\n" +
                "        }\n" +
                "\n" +
                "        String dataLengthHex = ByteUtil.bytesToHex(dataLengthBytes);\n" +
                "        int length = Integer.parseInt(dataLengthHex, 16);\n" +
                "        electricMeterBytes = new byte[length];\n" +
                "\n" +
                "        try {\n" +
                "            bais.read(electricMeterBytes);\n" +
                "            bais.read(validBytes);\n" +
                "        } catch (IOException e) {\n" +
                "            e.printStackTrace();\n" +
                "        } finally {\n" +
                "            try {\n" +
                "                bais.close();\n" +
                "            } catch (IOException e) {\n" +
                "                e.printStackTrace();\n" +
                "            }\n" +
                "        }\n" +
                "\n" +
                "        //CRC\n" +
                "        String valid = ByteUtil.bytesToHex(validBytes).replaceAll(\" \", \"\").toLowerCase();\n" +
                "        byte[] validCodeBytes = ByteUtil.byteArrayMerge(addrBytes, funcBytes, dataLengthBytes, electricMeterBytes);\n" +
                "        String crc = ByteUtil.getCrcLowHigh(validCodeBytes).replaceAll(\" \", \"\").toLowerCase();\n" +
                "        if (!valid.equals(crc)) {\n" +
                "            throw new BaseCommonRuntimeException(\"电表数据Crc校验出错!\");\n" +
                "        }\n" +
                "\n" +
                "        //把十六进制数转换成IEEE-754标准浮点数\n" +
                "        String dataHexStr = ByteUtil.bytesToHex(electricMeterBytes);\n" +
                "        Integer value = Integer.valueOf(dataHexStr, 16);\n" +
                "\n" +
                "        float electricMeterFloat = value / 100f;\n" +
                "\n" +
                "        Map<String, Object> map = new HashMap<>(1);\n" +
                "        map.put(\"electricMeter\", electricMeterFloat);\n" +
                "\n" +
                "        SbDrRecordTerminalForm recordForm = new SbDrRecordTerminalForm();\n" +
                "        recordForm.setProtocolId(analysisForm.getProtocolId());\n" +
                "        recordForm.setTerminalId(messageContent.getTerminalId());\n" +
                "        recordForm.setPropertiesByMap(map);\n" +
                "        recordForm.setReceiveTime(messageContent.getReceiveDate());\n" +
                "        return recordForm;\n" +
                "\n" +
                "    }\n" +
                "\n" +
                "    /**\n" +
                "     * 获取下一个解析类\n" +
                "     *\n" +
                "     * @return\n" +
                "     */\n" +
                "    @Override\n" +
                "    public ISbDrTwiceAnalysis getNextAnalysis() {\n" +
                "        return SpringBeanUtil.getBean(ElectricMeterDataAnalysisHour.class);\n" +
                "    }\n" +
                "}\n";

        Inner inner = parse(source);
        System.out.println(inner.getPackageName());
        System.out.println(inner.getClassName());
    }
}
