package com.acti.controller;

import java.io.OutputStream;
import java.net.URLDecoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import javax.activation.DataSource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.mortbay.log.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.acti.util.URLFetch;
import com.acti.util.UrlFetchUtil;

@Controller
public class DailyBillingService {
	private static final Logger mLogger = Logger.getLogger(AdminQueueGae.class.getName()) ;

	
	
@RequestMapping(value="/callDailybiller",method=RequestMethod.GET)	
public @ResponseBody String sendBillDaily (HttpServletResponse response,HttpServletRequest request)	
{
	Date todayDate 				    = new Date();
	DateFormat billdf 		    	= new SimpleDateFormat("MM/dd/yyyy");
	String formattedtodayDate		= "";
	String formattedyesterdayDate   = "";
	String resultDataForCSV 		= ""; 
	String getBillurl				= "";
	String paramJson				= "";
	OutputStream outputStream		= null;
ObjectMapper mapper			=	new ObjectMapper();
	String type 					= request.getParameter("type");

	try
	{
		formattedtodayDate              = billdf.format(todayDate);
		formattedyesterdayDate       	= billdf.format(todayDate);
		todayDate 				    	= billdf.parse(formattedtodayDate);
		Calendar cal 			     	= Calendar.getInstance();
		cal.setTime(todayDate);
		cal.add(Calendar.DAY_OF_YEAR,-1);
		Date oneDayBefore			   = cal.getTime();
		formattedtodayDate 				= billdf.format(todayDate);
		formattedyesterdayDate	= billdf.format(oneDayBefore);
		System.out.println("this is the fromdate and todate"+formattedyesterdayDate+"  "+formattedtodayDate);
	}
	catch(Exception e)
	{
	 mLogger.info("Date parsing exception"+e.getMessage());
	 mLogger.info("lets send an error email stating the problem");
	 // code to send error email on date formatting
	 return "exception";
	}
	
	String mode 			    = "";
	UrlFetchUtil urlfetcher		= new UrlFetchUtil();
	paramJson					= "?parameters={\"atype\":\"SBChat\",\"btype\":\""+type+"\",\"fdate\":\""+formattedyesterdayDate+"\",\"tdate\":\""+formattedyesterdayDate+"\",\"sendmail\":\"manoj.asokan@a-cti.com\",\"webchat\":\"true\"}";
	mLogger.info("this is paramJson"+paramJson);
	if(mode.equalsIgnoreCase("live"))
	{
	//	 getBillurl = "https://v22-09-dot-conversionsupportstaging-hrd.appspot.com/BillingReportQueue?saccno=&fdate="+formattedyesterdayDate+"&tdate="+formattedtodayDate+"&sendmail=manoj.asokan@a-cti.com&atype=SBChat&btype=Cwa_chat";
	//	 getBillurl = "https://v22-09-dot-conversionsupportlive-hrd.appspot.com/billds"+paramJson;
		 getBillurl =  "https://v26-9-dot-conversionsupportstaging-hrd.appspot.com/dailycsvbill"+paramJson;
	}
	else
	{
	//	 getBillurl = "https://v22-09-dot-conversionsupportstaging-hrd.appspot.com/BillingReportQueue?saccno=&fdate="+formattedyesterdayDate+"&tdate="+formattedtodayDate+"&sendmail=manoj.asokan@a-cti.com&atype=SBChat&btype=Cwa_chat";
	//	 getBillurl = "https://v22-09-dot-conversionsupportlive-hrd.appspot.com/billds"+paramJson;
		 getBillurl =  "https://v26-9-dot-conversionsupportstaging-hrd.appspot.com/dailycsvbill"+paramJson;
	}
	try
	{
		mLogger.info("the url we are going to hit is"+getBillurl);
		resultDataForCSV = new URLFetch().httpUrlFetchGET(getBillurl);
		mLogger.info("this is the csv data"+resultDataForCSV.toString()+"ends");
	}
	catch(Exception e)
	{
		mLogger.info("the url fetcher is not working"+e.getMessage());
	}
	try{
	mLogger.info("this is the csv data"+resultDataForCSV);	
//	totalDataList = mapper.readValue(resultDataForCSV,ArrayList.class);
	}
	catch(Exception e)
	{
		mLogger.info("exception in mapping data"+e.getMessage());
	}
	
	
	HashMap<String,String> pikachuMap = new HashMap<String,String>();	
	try{
      pikachuMap =	mapper.readValue(resultDataForCSV,HashMap.class);
	}
	catch(Exception e)
	{
	mLogger.info("mapper exception");	
	}
	
	resultDataForCSV = pikachuMap.get("value");
	
	byte[] bbytes = resultDataForCSV.toString().getBytes();
	response.setContentType("text/csv");
	response.setHeader("Content-Disposition", "attachment; filename="+"Daily bill for"+formattedtodayDate+formattedyesterdayDate);
	try{
	outputStream 	= response.getOutputStream();
	outputStream.write(bbytes);
	outputStream.flush();
	outputStream.close(); 
	}
	catch(Exception e)
	{
		mLogger.info("file problem oh noes!!");
	}

	// trial stuff
	
	
return resultDataForCSV;
}
}
