package com.acti.service;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.acti.FinalObjects.FinalObjects;
import com.acti.factory.AccountFactory;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public class ArAccountManagerService {

	private static final Logger log = Logger.getLogger(ArAccountManagerService.class.getName()) ;
	
	public ArrayList mapClientParams(String lResult) 
	{
		HashMap data				=		null;
		HashMap	newMap				=		null;
		Boolean	eval				=		true;
		String key					=		"";		
		String val					=		"";
		ArrayList	newArray		=		null;
		ArrayList	respArr			=		null;
		try
		{
			newArray			=		new ArrayList();
			newMap				=		new HashMap();
			data				=		new HashMap();
			respArr				=		new ArrayList();
			log.info("the stirng is---->"+lResult);
			newArray				=		new ObjectMapper().readValue(lResult.trim(), ArrayList.class);
			log.info("the size of the array is--->"+newArray.size());
			for(int i=0;i<newArray.size();i++)
			{
				log.info("the map obtained is---->"+newArray.get(i));
				newMap						=	(HashMap) newArray.get(i);
				Iterator	it 				= 	newMap.entrySet().iterator();
				data						=	new HashMap();
				while (it.hasNext()) 
			    {
			        Map.Entry pairs 	=	 (Map.Entry)it.next();
			        key 			=	 (String) pairs.getKey();
			        
			        if(key.equalsIgnoreCase("success"))
				    	eval 			= 	(Boolean) pairs.getValue();
				    else
				    	val 			=	 (String) pairs.getValue();
			              
			        	
			        try
			        {
			        	  //addon
			        	if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "status.paramtypeid" )))
			            data.put("status", val);
			        	
			        	if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "isInterruptable.paramtypeid" )))
				    	data.put("isInterruptable", val);
			        	
			        	if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "preferredurl.paramtypeid" )))
				    	data.put("preferredurl", val);
			        	
			        	if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "expirationTime.paramtypeid" )))
				    	data.put("expirationTime", val);
			        	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "calldelay.paramtypeid" )))
					    	data.put("callDelay", val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "campaigndelay.paramtypeid" )))
					    	data.put("campaignDelay", val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "pauseevent.paramtypeid" )))
					    	data.put("pauseEvent", val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "formname.paramtypeid" )))
					    	data.put("formName", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "pauseduration.paramtypeid" )))
					    	data.put("pauseDuration", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "internationaldialing.paramtypeid" )))
					    	data.put("internationalDialing", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "allowf8.paramtypeid" )))	
					    	data.put("allowf8", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "emailaddress.paramtypeid" )))	
					    	data.put("emailAddress", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "emailpassword.paramtypeid" )))	
					    	data.put("emailPassword", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "clientemailaddress.paramtypeid" )))
					    	data.put("clientEmailAddress", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "clientpassword.paramtypeid" )))
					    	data.put("clientPassword", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "alias.paramtypeid" )))
					    	data.put("alias", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "cc.paramtypeid" )))
					    	data.put("cc", val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "bcc.paramtypeid" )))
					    	data.put("bcc", val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "arType" )))
					    	data.put("intertypeId", val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "starttime.paramtypeid" )))
					    	data.put("startTime",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "stoptime.paramtypeid" )))
					    	data.put("stopTime",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "triggertime.paramtypeid" )))
					    	data.put("triggerTime",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "excludedays.paramtypeid" )))
					    	data.put("excludeDays",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "exceptionadays.paramtypeid" )))
					    	data.put("exceptionalDays",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "exceptionaldaystarttime.paramtypeid" )))
					    	data.put("exceptionalDayStartTime",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "exceptionaldaystoptime.paramtypeid" )))	
					    	data.put("exceptionalDayStopTime",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "ignorerules.paramtypeid" )))	
					    	data.put("ignoreRules",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "problemalertemailid.paramtypeid" )))	
					    	data.put("problemAlertEmailId",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "inqueuereqtime.paramtypeid" )))
					    	data.put("inQueueReqTime",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "inprogressreqtime.paramtypeid" )))
					    	data.put("inProgressReqTime",val);
					    	
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "answeredreqtime.paramtypeid" )))
					    	data.put("answeredReqTime",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "routetype.liveid.paramtypeid" )))
					    	data.put("live_skill",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "routetype.dev/stagingid.paramtypeid" )))
					    	data.put("staging_skill",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "routetype.overflow_liveid.paramtypeid" )))
					    	data.put("overflow_live_skill",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "routetype.overflow_dev/stagingid.paramtypeid" )))
					    	data.put("overflow_staging_skill",val);
					    
					    if(key.equals(ResourceBundle.getBundle( "ApplicationResources" ).getString( "isNewEmailReader.paramtypeid" )))
					    	data.put("isNewEmailReader",val);
					    
					    if(key.equals("domainName"))
					    	data.put("domainName", val);
					    
					    if(key.equals("accountNumber"))
					    	data.put("accountNumber", val);
					    
					    if(key.equals("subAccountNumber"))
					    	data.put("clientId", val);
					    
					    if(key.equals("interactionTypeId"))
					    	data.put("campaign", val);
					    
					    if(key.equals("uniquePin"))
					    	data.put("uniquePin", val);
			        }
			        catch(Exception e)
			        {
			        	log.log(Level.SEVERE,"Error in getting accountNomap getDatafromCachenew()"+e.getMessage(),e);
			        }
			        it.remove(); // avoids a ConcurrentModificationException
			       
			    }
				data.put("response", "success");
//				newArray.add(data);
				respArr.add(data);
			}
		}
		catch(Exception e)
		{
			data.put("response", "failure");
			respArr.add(data);
			log.log(Level.SEVERE,"exception in mapping"+e.getMessage(),e);
		}
		return respArr;
	}
	public	String createAccount(String jsondata)
	{
		HashMap data									=	new HashMap();
		ModeUtil lModeUtil								= 	new ModeUtil();
		String subAccNumber								=	"";
		String interactiontype							=	"";
		String campaignId								=	"";
		String newjsondata								=	""; 
		String	resp									=	"";
		String url										=	"";
		
		try
		{
			data					=	new ObjectMapper().readValue(jsondata, HashMap.class);
			subAccNumber			=	(String) data.get("clientId");
			interactiontype			=	(String) data.get("campaign");
			campaignId				=	(String) data.get("intertype");
			data.put("campaign", campaignId);
			data.put("intertype", interactiontype);
			
			log.info("the request variable in update  is--->"+jsondata);
			
			newjsondata				=	new ObjectMapper().writeValueAsString(data);
			if("live".equalsIgnoreCase(lModeUtil.getMode())){
				url	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "create.url" );
			}
			else{
				url	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "create.url" );
			}
			resp					=	new URLFetch().urlFetchPOST( newjsondata , url);
			log.info("response after creating Account : "+resp);
			return resp;
		}
		catch(Exception e)
		{	
			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
			e.printStackTrace();
			return "failure";
		}
	}
	public	String updateAccount(String jsondata)
	{
		HashMap data									=	new HashMap();
		ModeUtil lModeUtil								= 	new ModeUtil();
		String subAccNumber								=	"";
		String interactiontype							=	"";
		String campaignId								=	"";
		String newjsondata								=	""; 
		String	resp									=	"";
		String url										=	"";
		
		try
		{
			data					=	new ObjectMapper().readValue(jsondata, HashMap.class);
			log.info("the request variable in update  is--->"+jsondata);
			
			newjsondata				=	new ObjectMapper().writeValueAsString(data);
			if("live".equalsIgnoreCase(lModeUtil.getMode())){
				url	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "update.url" );
			}
			else
			{
				url	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "update.url" );
			}
			resp					=	new URLFetch().urlFetchPOST( newjsondata , url);
			return resp;
		}
		catch(Exception e)
		{	
			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
			e.printStackTrace();
			return "failure";
		}
	}
	public String createNewSkill(String skillTitle,String skillSetTypeId)
	{
		HashMap lInputMap				=			null;
		ObjectMapper 	mapper			=			new ObjectMapper();
		StringWriter    strWriter		=			new StringWriter();
		String  lInputJson				=			null;
		String  lResult					=			null;
		String	newCmsUrl				=			null;
		ModeUtil lMode					=	 		new ModeUtil();
		
		
		try
		{
			newCmsUrl				=			lMode.getNewCmsUrl();
			lInputMap				=		new HashMap();
			lInputMap.put("title", skillTitle);
			lInputMap.put("skillSetTypeId", skillSetTypeId);
			
			mapper.writeValue(strWriter, lInputMap);
			lInputJson				=	strWriter.toString();
			
			lResult 				=	new URLFetch().urlFetchPOST(lInputJson, newCmsUrl+ResourceBundle.getBundle("ApplicationResources").getString("checkandCreateskillset.url").trim());
			
			log.info("result of skill creation for new skill :: "+lResult);
			return lResult;
		}
		catch(Exception e)
		{	
			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
			e.printStackTrace();
			return "failure";
		}
	}
	public String updateSkill(String clientId,String routingtype,String skillTitle,String skillSetTypeId)
	{
		String  lInputJson				=			null;
		HashMap lInputMap				=			null;
		HashMap lInputMap2				=			null;
		ObjectMapper 	mapper			=			null;
		StringWriter    strWriter		=			null;
		String  lResult					=			null;
		String	newCmsUrl				=			"";
		try
		{
			ModeUtil lMode     		 	= 			new ModeUtil();
			lInputMap	=	new HashMap();
			mapper			=			new ObjectMapper();
			lInputMap.put("subaccountnumber", clientId);
			lInputMap.put("interTypeId", skillSetTypeId);
			
			if(routingtype.trim().equalsIgnoreCase("live"))
			{
				log.info("inside :: type :: live");
				lInputMap2	=	new HashMap();
				lInputMap2.put("147", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
			}
			
			if(routingtype.trim().equalsIgnoreCase("dev/staging"))
			{
				log.info("inside :: type :: dev/staging");
				lInputMap2	=	new HashMap();
				lInputMap2.put("148", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
			}
			
			if(routingtype.trim().equalsIgnoreCase("overflow_live"))
			{
				log.info("inside :: type :: overflow_live");
				lInputMap2	=	new HashMap();
				lInputMap2.put("149", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
			}
			
			if(routingtype.trim().equalsIgnoreCase("overflow_dev/staging"))
			{
				log.info("inside :: type :: overflow_dev/staging");
				lInputMap2	=	new HashMap();
				lInputMap2.put("150", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
			}
			log.info("the input map is--->"+lInputMap );
			mapper		=	new ObjectMapper();
			strWriter	=	new StringWriter();
			mapper.writeValue(strWriter, lInputMap);
			
			lInputJson	=	strWriter.toString();
			
			
			if("live".equalsIgnoreCase(lMode.getMode())){
				newCmsUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.cms.url" );
			}
			else{
				newCmsUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.cms.url" );
			}
			lResult		=	new URLFetch().urlFetchPOST(lInputJson,newCmsUrl+"/services/data/setclientparamvalueforinteractiontypeids");
			
			log.info("result of skill parameter updating ::"+lResult);
			return lResult;
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
			e.printStackTrace();
			return "failure";
		}
	}
	
	public static String getAccountBySkill( String skill ) {
		boolean isSuccess = false;
		Map<String, Object> hashMapToReturn = new HashMap<String, Object>();
		String returnJsonString = "{\"success\":\"false\"}";
		returnJsonString = AccountFactory.getSubAccountBySkill( skill );
		return returnJsonString;
	}
	public ArrayList<HashMap<String, Object>> getClientParams(String lResult)
	{
		log.info("this is the response we got from main:"+lResult);
		
		HashMap<String,Object> paramList				=		new HashMap<String,Object>();
		ArrayList<HashMap<String,Object>> 	respArr		= 		new ArrayList<HashMap<String,Object>>();
		ArrayList<HashMap<String,Object>>	newArray	=		new ArrayList<HashMap<String,Object>>();
		HashMap<String, Object> getAccountDet 			=		new HashMap<String, Object>();
		String keys 			=		"";
		String getvalues		=		"";
		 try
		 {
			 newArray	=		new ObjectMapper().readValue(lResult.trim(), ArrayList.class);
			for (HashMap<String, Object> map : newArray)
			{
			
				 log.info("in Hashmap::"+map);
				 
				 getAccountDet 			=		new HashMap<String, Object>();
				 
				 getAccountDet.put("accountNumber", String.valueOf(map.get("accountNumber")));
				 getAccountDet.put("subAccountNumber", String.valueOf(map.get("subAccountNumber")));
				 getAccountDet.put("interactionTypeId", String.valueOf(map.get("interactionTypeId")));
				 getAccountDet.put("domainName", String.valueOf(map.get("domainName")));
				 getAccountDet.put("isAssigned", String.valueOf(map.get("isAssigned")));
				 getAccountDet.put("oldSubAccountNumber", String.valueOf(map.get("oldSubAccountNumber")));
				 getAccountDet.put("uploadLogoStatus", String.valueOf(map.get("uploadLogoStatus")));
				 getAccountDet.put("clientObjId", String.valueOf(map.get("clientObjId")));
				 getAccountDet.put("guiDirectory", String.valueOf(map.get("guiDirectory")));
				 getAccountDet.put("uniquePin", String.valueOf(map.get("uniquePin")));
				 getAccountDet.put("activeStatus", String.valueOf(map.get("activeStatus")));
				 getAccountDet.put("dateAdded", String.valueOf(map.get("dateAdded")));
				 
				 if(map.containsKey("clientParameters"))
				 {
					 paramList		 =  	((HashMap<String, Object>) map.get("clientParameters"));
					 log.info("paramList ::"+paramList);
					 Iterator<Map.Entry<String,Object>> it	 = 		paramList.entrySet().iterator();
				 
					    while (it.hasNext()) 
					    {
					    	Map.Entry<String,Object> entry	 =	 it.next();
					        
					        keys		= 	(String) entry.getKey();
					        getvalues	=	(String) entry.getValue();
					        getAccountDet.put(keys,getvalues);
				        }
//			    		getAccountDet.put("response", "success");
					    log.info("getAccountDet ::"+getAccountDet);
					    if(!getAccountDet.containsKey("autoRescheduling"))
					    {
					    	getAccountDet.put("autoRescheduling","false");
					    }
					    respArr.add(getAccountDet);
				 }
		    }
		 }
		 catch(Exception e)
		 {
			 log.log(Level.SEVERE,"Error in getting accounts"+e.getMessage(),e);
		 }
		 return respArr;
	}
}
