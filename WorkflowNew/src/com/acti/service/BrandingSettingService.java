package com.acti.service;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import com.acti.util.ModeUtil;
public class BrandingSettingService {
	
	private static final Logger log = Logger.getLogger(BrandingSettingService.class.getName()) ;
	@Autowired
	protected RestTemplate restTemplate = new RestTemplate();
	
	
	  /**
     * Service Class to Pull data from mRouting Table
     * @return
     */
    public String getMroutingTableData()
    {
    	String response = "";
    	
    	try{
    		ModeUtil sModeUtil = new ModeUtil();
    		String sWebChatUrl = sModeUtil.getWebchatUrlByMode();
    		response 		    = restTemplate.postForObject(sWebChatUrl+"/livechat/getmroutingtabledata", "" ,String.class);
    		log.info("Data from mRoutingTable(webchat server): "+response);
    	}
    	catch(Exception e)
    	{
    		log.info("error in geting data from mRoutingTable");
    		e.printStackTrace();
    	}
    	return response;
    }
    
    public String getAdminTableData()
    {
    	String response = "";
    	try{
    		ModeUtil sModeUtil = new ModeUtil();
    		String sWebChatUrl = sModeUtil.getWebchatUrlByMode();
    		response 		    = restTemplate.postForObject(sWebChatUrl+"/livechat/getAdminMap", "" ,String.class);
    		log.info("Data from AdminTable(webchat server): "+response);
    	}
    	catch(Exception e)
    	{
    		log.info("error in geting data from AdminTable");
    		e.printStackTrace();
    	}
    	return response;
    }
}
