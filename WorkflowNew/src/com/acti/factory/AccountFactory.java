package com.acti.factory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.type.TypeReference;
import org.mortbay.log.Log;

import com.acti.DTO.Contact;
import com.acti.FinalObjects.FinalObjects;
import com.acti.service.ArAccountManagerService;
import com.acti.util.ModeUtil;
import com.acti.util.UrlFetchUtil;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class AccountFactory {
	
	private static Logger logger = Logger.getLogger( AccountFactory.class.getPackage().getName());
	private static ModeUtil modeUtil = new ModeUtil();
	
	public static String getSubAccountBySkill( String skill ) {
		boolean isSuccess = false;
		ArAccountManagerService arAccountManagerService = new ArAccountManagerService();
		String responseString = "{\"success\":false}";
		Map<String, Object> returnHashMap = new HashMap<String, Object>();
		try {
			System.out.println( modeUtil.getDataStoreURLByMode() + "/services/data/getAccountBySkill?skill=" + skill );
			responseString = UrlFetchUtil.httpRequest( modeUtil.getDataStoreURLByMode() + "/services/data/getAccountBySkill?skill=" + skill, null, "GET", "application/json", null, 2 );
			isSuccess = true;
		} catch( Exception exception ) {
			exception.printStackTrace();
		} finally {
			returnHashMap.put( "success", isSuccess );
		}
		return responseString;
	}

}
