package com.acti.controller;

import java.util.ResourceBundle;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestMethod;

import com.acti.util.URLFetch;
import com.acti.util.*;

@Controller
public class BillingReportController {
	
	public static final Logger log = Logger.getLogger(BillingReportController.class.getName());
	public StringBuilder reportBuilder = new StringBuilder();
	
	@RequestMapping(value="/getBillforGivenDateRange/{fromDate}/{toDate}/{email}/{accountType}/{accNo}/{isSummaryRequired}",method = RequestMethod.POST)
	@ResponseBody
	public String generateBillingReport(@PathVariable("fromDate") String fromDateString,@PathVariable("toDate") String toDateString,@PathVariable("email") String email,@PathVariable("accountType") String accountType,@PathVariable("accNo") String accNo,@PathVariable("isSummaryRequired") boolean isSummaryRequired, HttpServletResponse response, HttpServletRequest request)
	{
		String 			 mode = "";
		String 	   webChatUrl = "";
		String responseString = "";

		mode = new ModeUtil().getMode();

		if("live".equalsIgnoreCase(mode))
			webChatUrl = ResourceBundle.getBundle("ApplicationResources").getString("live.webchat.billing")+fromDateString+"/"+toDateString+"/"+email+"/"+accountType+"/"+accNo+"/"+isSummaryRequired;
		else
			webChatUrl = ResourceBundle.getBundle("ApplicationResources").getString("staging.webchat.billing")+fromDateString+"/"+toDateString+"/"+email+"/"+accountType+"/"+accNo+"/"+isSummaryRequired;

		responseString = new URLFetch().urlFetchPOST("",webChatUrl);		
		
		log.info("responseString="+responseString);

		return responseString;
	}

}

