package com.sbwork.dr.common.utils;

import javax.validation.constraints.NotNull;
import java.text.FieldPosition;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

/**
 * @author sbjw
 */
public final class DrDateFormat extends SimpleDateFormat {

    public static final char QUARTER_SYMBOL = '\ue001';
    public static final char HALF_HOUR_SYMBOL = '\ue002';
    public static final char C8_SYMBOL = '\ue003';
    public static final char HOUR8_20_SYMBOL = '\ue004';
    public static final String QUARTER = "[CQ]";
    public static final String HALF_HOUR = "[CH]";

    public static final String HOUR8_20 = "[8_20H]";

    public static final String C8 = "[C8]";

    private String pattern;

    private SimpleDateFormat parseDateFormat;

    public DrDateFormat(String pattern) {
        super(formatPattern(pattern));
        this.pattern = pattern;
        this.parseDateFormat = new SimpleDateFormat(parsePattern(pattern));
    }

    @Override
    public StringBuffer format(
            @NotNull Date date,
            @NotNull StringBuffer paramStringBuffer,
            @NotNull FieldPosition paramFieldPosition) {
        if (this.pattern.contains("[C8]")) {
            date = new Date(date.getTime() - 8 * 60 * 60 * 1000);
        }
        String s = super.format(date, paramStringBuffer, paramFieldPosition).toString();
        if (s.indexOf(QUARTER_SYMBOL) != -1) {
            long d = (date.getTime() % (1000 * 60 * 60)) / (1000 * 60 * 15);
            s = s.replaceAll(
                    String.valueOf(QUARTER_SYMBOL), d == 0 ? "00" : ("" + (d * 15))
            );
        }
        if (s.indexOf(HALF_HOUR_SYMBOL) != -1) {
            long d = (date.getTime() % (1000 * 60 * 60)) / (1000 * 60 * 30);
            s = s.replaceAll(
                    String.valueOf(HALF_HOUR_SYMBOL), d == 0 ? "00" : ("" + (d * 30))
            );
        }
        if (s.indexOf(HOUR8_20_SYMBOL) != -1) {
            long hour = ((date.getTime() % (1000 * 60 * 60 * 24) + 8 * 60 * 60 * 1000) / (1000 * 60 * 60)) % 24;
            s = s.replaceAll(String.valueOf(HOUR8_20_SYMBOL), hour < 12 ? "08" : "20");
        }
//        if (s.indexOf(CDAY_SYMBOL) != -1) {
//            if (this.pattern.indexOf("dd") > 0) {
//                Date nd = new Date(date.getTime() - 8 * 60 * 60 * 1000);
//                paramStringBuffer = new StringBuffer();
//                s = super.format(nd, paramStringBuffer, paramFieldPosition).toString();
//            }
        s = s.replaceAll(String.valueOf(C8_SYMBOL), "");
//        }

        return new StringBuffer(s);
    }

    @Override
    public Date parse(String text) throws ParseException {
        return parseDateFormat.parse(text);
    }

    private static String formatPattern(String pattern) {
        String t = pattern;
        t = t.replaceAll("\\" + QUARTER, String.valueOf(QUARTER_SYMBOL));
        t = t.replaceAll("\\" + HALF_HOUR, String.valueOf(HALF_HOUR_SYMBOL));
        t = t.replaceAll("\\" + C8, String.valueOf(C8_SYMBOL));
        t = t.replaceAll("\\" + HOUR8_20, String.valueOf(HOUR8_20_SYMBOL));
        return t;
    }

    private static String parsePattern(String pattern) {
        String t = pattern;
        t = t.replace(QUARTER, "mm");
        t = t.replace(HALF_HOUR, "mm");
        t = t.replace(C8, "");
        t = t.replace(HOUR8_20, "HH");
        return t;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        DrDateFormat that = (DrDateFormat) o;
        return Objects.equals(pattern, that.pattern);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), pattern);
    }

    public static void main(String args[]) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = dateFormat.parse("2021-09-02 15:00:00");
//        String s = new DrDateFormat("yyyy-MM-dd HH:[CQ]").format(new Date());
//        System.out.println(s);
//        Date d = new Date(d.getTime() - )
        String s1 = new DrDateFormat("[C8]yyyy-MM-dd").format(date);
        System.out.println(s1);
        String s3 = new DrDateFormat("[C8]yyyy-MM-dd [8_20H]").format(date);
        System.out.println(s3);
        String s2 = new DrDateFormat("yyyy-MM-dd HH:[CH]").format(new Date());
        System.out.println(s2);

//        DrDateFormat drDateFormat = new DrDateFormat("yyyyMMddHH[CQ]");
//        try {
//            Date date = drDateFormat.parse("201911271130");
//            System.out.println(date);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//
//        201911271130
    }
}
