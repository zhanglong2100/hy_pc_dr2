package com.sbwork.dr.publicnoticewebcrawlerguangdong.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ReturnResult {
   private String code;

   private String msg;

   private Integer total;

   private List<ReturnResultInfo> data = new ArrayList<>();
}
