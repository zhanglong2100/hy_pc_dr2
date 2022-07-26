package com.sbwork.dr.common.utils;

import org.bouncycastle.util.Arrays;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @program: sbwork-receive-parent
 * @Description ByteUtil
 * @Author 陈琪
 * @Date 2019-7-18 0018 10:41
 * @Version 1.0
 **/
public class ByteUtil {

    private static final int MIN_VALID_NUM = 2;

    /**
     * 字符数组拼接
     *
     * @param bytes
     * @return
     */
    public static byte[] byteArrayMerge(byte[]... bytes) {
        if (bytes != null && bytes.length > 0) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            for (byte[] b : bytes) {
                try {
                    baos.write(b);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return baos.toByteArray();
        }
        return new byte[2];

    }

    public static byte[] doubleToBytes(double d) {
        long value = Double.doubleToRawLongBits(d);
        byte[] byteRet = new byte[8];
        for (int i = 0; i < 8; i++) {
            byteRet[i] = (byte) ((value >> 8 * i) & 0xff);
        }
        return byteRet;
    }

    public static double bytesToDouble(byte[] arr) {
        long value = 0;
        for (int i = 0; i < 8; i++) {
            value |= ((long) (arr[i] & 0xff)) << (8 * i);
        }
        return Double.longBitsToDouble(value);
    }

    public static byte[] intToBytes(int value) {
        byte[] src = new byte[4];
        src[0] = (byte) ((value >> 24) & 0xFF);
        src[1] = (byte) ((value >> 16) & 0xFF);
        src[2] = (byte) ((value >> 8) & 0xFF);
        src[3] = (byte) (value & 0xFF);
        return src;
    }

    public static int bytesToInt(byte[] src, int offset) {
        int value;
        value = (int) (((src[offset] & 0xFF) << 24)
                | ((src[offset + 1] & 0xFF) << 16)
                | ((src[offset + 2] & 0xFF) << 8)
                | (src[offset + 3] & 0xFF));
        return value;
    }

    public static byte[] shortToBytes(short x) {
        byte high = (byte) (0x00FF & (x >> 8));
        byte low = (byte) (0x00FF & x);
        byte[] bytes = new byte[2];
        bytes[0] = high;
        bytes[1] = low;
        return bytes;
    }


    public static short bytesToShort(byte[] bytes) {
        byte high = bytes[0];
        byte low = bytes[1];
        return (short) (((high & 0x00FF) << 8) | (0x00FF & low));

    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder buf = new StringBuilder(bytes.length * 2);
        // 使用String的format方法进行转换
        for (byte b : bytes) {
            buf.append(String.format("%02x", b & 0xff));
        }

        return buf.toString();
    }

    public static byte[] hexToBytes(String str) {
        if (str == null || "".equals(str.trim())) {
            return new byte[0];
        }

        str = str.replace(" ", "");

        byte[] bytes = new byte[str.length() / 2];
        for (int i = 0; i < str.length() / 2; i++) {
            String subStr = str.substring(i * 2, i * 2 + 2);
            bytes[i] = (byte) Integer.parseInt(subStr, 16);
        }

        return bytes;
    }

    public static String getCrcHighLow(byte[] bytes) {
        // CRC寄存器全为1
        int crc = 0x0000ffff;
        // 多项式校验值
        int polynomial = 0x0000a001;
        int i, j;
        for (i = 0; i < bytes.length; i++) {
            crc ^= ((int) bytes[i] & 0x000000ff);
            for (j = 0; j < 8; j++) {
                if ((crc & 0x00000001) != 0) {
                    crc >>= 1;
                    crc ^= polynomial;
                } else {
                    crc >>= 1;
                }
            }
        }
        // 结果转换为16进制
        String result = Integer.toHexString(crc).toUpperCase();
        if (result.length() != 4) {
            StringBuffer sb = new StringBuffer("0000");
            result = sb.replace(4 - result.length(), 4, result).toString();
        }
        return result;
    }

    public static String getCrcLowHigh(byte[] bytes) {
        String result = getCrcHighLow(bytes);
        return result.substring(2, 4) + result.substring(0, 2);
    }

    /**
     * byte数组的和  取后八位做校验码
     *
     * @param bytes
     * @return
     */
    public static String getAddValid(byte[] bytes) {
        int sum = 0;
        for (int i = 0; i < bytes.length; i++) {
            sum = sum + bytes[i];
        }

        String sumStr = Integer.toHexString(sum).replaceAll(" ", "").toLowerCase();
        String valid = null;
        if (sumStr.length() > MIN_VALID_NUM) {
            valid = sumStr.substring(sumStr.length() - 2);
        } else if (sumStr.length() == MIN_VALID_NUM) {
            valid = sumStr;
        }

        return valid;
    }

    /**
     * byte数组的和  取后八位做校验码
     *
     * @param bytes
     * @return
     */
    public static byte[] getAddValidCrc(byte[] bytes) {
        int sum = 0;
        for (int i = 0; i < bytes.length; i++) {
            sum = sum + bytes[i];
        }
        sum = sum & 0xff;

        return new byte[]{(byte) sum};
    }

    /**
     * byte数组的和  取后八位做校验码
     *
     * @param bytes
     * @return
     */
    public static Boolean addValid(byte[] bytes, byte[] validBytes) {
        int sum = 0;
        for (int i = 0; i < bytes.length; i++) {
            sum = sum + (bytes[i] & 0x0FF);
        }

        String sumStr = Integer.toHexString(sum).replaceAll(" ", "").toLowerCase();
        String validStr = ByteUtil.bytesToHex(validBytes).replaceAll(" ", "").toLowerCase();

        return sumStr.endsWith(validStr);
    }

    /**
     * 将bytes数据，从低端开始读取数据
     *
     * @param bytes 数据
     * @return
     */
    public static List<Integer> getAllBits(byte[] bytes) {
        List<Integer> result = new ArrayList<>();
        int tt = 0;
        for (int i = bytes.length - 1; i >= 0; i--) {
            byte temp = bytes[i];
            for (int j = 0; j < 8; j++, tt++) {
                result.add(temp & 0x01);
                temp = (byte) (temp >> 1);
            }
        }
        return result;
    }

    /**
     * 将bytes数据，从低端开始读取数据
     *
     * @param bytes 数据
     * @return
     */
    public static List<Integer> getOneBits(byte[] bytes) {
        List<Integer> result = new ArrayList<>();
        int tt = 0;
        for (int i = 0; i < bytes.length; i++) {
            byte temp = bytes[i];
            for (int j = 0; j < 8; j++, tt++) {
                int t = temp & (0x01 << j);
                if (t > 0) {
                    result.add(tt);
                }
            }
        }
        return result;
    }


    /**
     * 将bytes数据转成Int（大端模式）
     *
     * @param bytes 数据
     * @return
     */
    public static Integer bytesToIntegerForHigh(byte[] bytes) {
        bytes = Arrays.reverse(bytes);

        return bytesToIntegerForLow(bytes);
    }

    /**
     * 将bytes数据转成Int（小端模式）
     *
     * @param bytes 数据
     * @return
     */
    public static Integer bytesToIntegerForLow(byte[] bytes) {
        int sum = 0;
        for (int i = 0 ; i < bytes.length; i++) {
            sum = sum + (bytes[i] & 0xFF) * (int)(Math.pow(256,i));
        }
        return sum;
    }

    public static void main(String[] args){
        System.out.println(bytesToIntegerForLow(hexToBytes("f0 ff ff ff")));
    }

    /**
     * 将byte数据转成Bcd码
     *
     * @return 2位十进制数据
     */
    public static Integer getBcdCode(byte data) {
        int low = data & 0x0f ;
        int high = data >> 4 & 0x0f;
        return high * 10 + low;
    }
}
