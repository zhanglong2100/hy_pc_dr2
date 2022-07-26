package com.sbwork.dr.agencysupermarket.controller;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.util.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * 日期处理
 *
 * @author lzr
 * @date 2021/11/26
 */
public class HyDateEditor extends CustomDateEditor {

    private static final SimpleDateFormat DATE_FMT = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat DATE_TIME_FMT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static final SimpleDateFormat TIME_FMT = new SimpleDateFormat("HH:mm:ss");
    private static final int DATE_LEN = 10;
    private static final int DATE_TIME_LEN = 19;
    private static final int TIME_LEN = 8;

    public HyDateEditor(DateFormat dateFormat, boolean allowEmpty) {
        super(dateFormat, allowEmpty);
    }

    public HyDateEditor(DateFormat dateFormat, boolean allowEmpty, int exactDateLength) {
        super(dateFormat, allowEmpty, exactDateLength);
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        if (!StringUtils.hasText(text)) {
            this.setValue(null);
        } else {
            try {
                if (text.length() == DATE_LEN) {
                    this.setValue(DATE_FMT.parse(text));
                } else if (text.length() == DATE_TIME_LEN) {
                    this.setValue(DATE_TIME_FMT.parse(text));
                } else if (text.length() == TIME_LEN) {
                    this.setValue(TIME_FMT.parse(text));
                } else {
                    throw new IllegalArgumentException("Could not parse date: " + text);
                }
            } catch (ParseException e) {
                throw new IllegalArgumentException("Could not parse date: " + e.getMessage(), e);
            }
        }
    }
}
