package com.acti.controller;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.acti.JDO.SkillActivityJDO;
import com.acti.service.CacheManagerHelper;
import com.acti.service.ToolsService;
import com.acti.util.CommonUtilities;
import com.acti.util.JdoUtil;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;
import com.google.appengine.api.utils.SystemProperty;
@Controller
public class ToolsController {
	
	private static final Logger log = Logger.getLogger(ToolsController.class.getName()) ;
	
	@RequestMapping(value="/toolscontroller" , method= RequestMethod.GET)
	public String adminSkills(HttpSession session , HttpServletRequest request , HttpServletResponse response , Model model)
	{
		HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
		if ( lRetVal == null )
		{
			log.info( "SESSION INVALID" );
			StringBuffer redirectUrlStringBuffer = request.getRequestURL();
			if( request.getQueryString() != null )
				redirectUrlStringBuffer.append( request.getQueryString() ); 
			return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;

		}
		String sWebchatURL = ResourceBundle.getBundle("ApplicationResources").getString("webchat.url");
		model.addAttribute( "webchatURL" ,sWebchatURL );
		model.addAttribute( "loginid" , lRetVal.get( "username" ) );
		model.addAttribute( "uniquepin" , lRetVal.get( "lUniquepin" ) );
		String currMode	=	new ModeUtil().getMode();
		if(currMode.equalsIgnoreCase("staging"))
		{
			model.addAttribute("conversionsupporturl", ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.conversionsupport.url" ));
		}
		else if(currMode.equalsIgnoreCase("live"))
		{
			model.addAttribute("conversionsupporturl", ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.conversionsupport.url" ));
		}
		if("true".equalsIgnoreCase(lRetVal.get( "IsAdmin" )) )
		{
			
			model.addAttribute( "accountfetch" , "FetchAccount" );
			
		}
		else
			log.info("Authorisation::Not Admin");
		return "Tools";
	}
//	@RequestMapping(value="/createNewskillset",method=RequestMethod.GET)
//	public @ResponseBody String createSkillSet(HttpServletRequest request,HttpServletResponse response)
//	{
//		String skillTitle				 				=		null;
//		String interactionType			 				=		null;
//		//String routingMode				 			=		null;
//		String v2skillid				 				=		null;
//		String skillDescription			 				=		null;
//		String jsonformat				 				=		null;
//		boolean skillAlreadyExist						=		false;
//		ModeUtil lMode									=	 	new ModeUtil();
//		String newCmsUrl								=		lMode.getNewCmsUrl();
//		ResourceBundle lResourceBundle   				= 		ResourceBundle.getBundle("ApplicationResources");
//		String skillSetTypeId		   	 				= 		null;
//		HashMap<String,String> skillSetJson				=		null;
//		HashMap<String,String> skillSetJsonResult		=		null;
//		String skillSetJsonString						=		null;
//		String skillSetCheckResult						=		null;
//		ObjectMapper mapper								=		null;
//		Writer		 strWriter							=		null;
//		try{
//			
//			try{
//				skillTitle 			=		request.getParameter("stitle");
//				skillDescription	=		request.getParameter("sdescription");
//				interactionType		=		request.getParameter("itype");
//				//routingMode		=		request.getParameter("rMode");
//				v2skillid			=		request.getParameter("v2id");
//					
//				if(v2skillid == null){
//					v2skillid = "";
//				}
//				
//				if(interactionType.trim().equalsIgnoreCase("webchat")){
//					skillSetTypeId		=		lResourceBundle.getString("chat.interactiontypeid");
//				}
//				else{
//					skillSetTypeId		=		lResourceBundle.getString("ar.interactiontypeid");
//				}
//			}
//			catch(Exception e){
//				log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
//				e.printStackTrace();
//			}
//				
//			try{
//				mapper			=	new ObjectMapper();
//				strWriter		=	new StringWriter();
//				
//				skillSetJson	=	new HashMap<String, String>();
//				skillSetJson.put("title",skillTitle);
//				skillSetJson.put("skillSetTypeId",skillSetTypeId);
//				
//				mapper.writeValue(strWriter, skillSetJson);
//				skillSetJsonString = strWriter.toString();
//				
//				skillSetCheckResult = new URLFetch().urlFetchPOST(skillSetJsonString, newCmsUrl+ResourceBundle.getBundle("ApplicationResources").getString("checkandCreateskillset.url").trim());
//				//skillSetJsonResult 	=	mapper.readValue(skillSetCheckResult, HashMap.class);	
//				log.info("final result json "+skillSetCheckResult);
//			}
//			catch(Exception e){	
//				log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
//				e.printStackTrace();
//			}
//		}
//		catch(Exception e){
//			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
//			e.printStackTrace();
//		}
//		return skillSetCheckResult;
//	}
//	
@RequestMapping(value="getDataToDisplayInTableFromNEWCMS",method=RequestMethod.GET)
 public @ResponseBody String getDataToDisplayInTableFromNewCms(HttpServletRequest request)
 {	
	System.out.println("comes in");
	 ModeUtil lMode														=	 	new ModeUtil();
	 String newCmsUrl													=		lMode.getNewCmsUrl();
	 String login														=		null;
	 String lResultMapJson												=		null;
	 HashMap lResultMap													=		new HashMap();
	 HashMap<String,String> inputMap									=		new HashMap<String,String>();
	 String	inputJson													=		null;
	 String resultJson													=		null;
	 String fName														=		null;
	 String lName														=		null;
	 String mName														=		null;
	 String name														=		null;
	 ObjectMapper mapper												=		null;
	 Writer	 strWriter													=		null;
	 JSONObject rMap													=		null;
	 JSONArray  sMap													=		null;
	 HashMap<String,String> contactData									=		new HashMap<String,String>();
	 ArrayList<HashMap<String,String>> skillset							=		new ArrayList<HashMap<String,String>>();
	 ArrayList<HashMap<String,String>> cskillset						=		new ArrayList<HashMap<String,String>>();
	 HashMap<String,HashMap<String,String>> mResultKey					=		new HashMap<String,HashMap<String,String>>();
	 ArrayList<HashMap<String,String>> mResultL							=		new ArrayList<HashMap<String,String>>();
	 HashMap<String,String> mResult										=		new HashMap<String,String>();	
	 int i																=		0;
	 String testingURl													=		null;
	 try{
		login		    =	request.getParameter("login"); 
		inputMap.put("login", login);
		mapper			=	new ObjectMapper();
		strWriter		=	new StringWriter();
		mapper.writeValue(strWriter, inputMap);
		inputJson		=	strWriter.toString();
		
		resultJson		=	new URLFetch().urlFetchPOST(inputJson, newCmsUrl+"/services/data/v2.0/objects/Account/validateLogin?apikey=SEN42");
		if(resultJson != null)
		{
			lResultMap		=		mapper.readValue(resultJson, HashMap.class);
			skillset		=		(ArrayList<HashMap<String, String>>) lResultMap.get("skillSet");
			cskillset		=		(ArrayList<HashMap<String, String>>) lResultMap.get("contactSkillSet");
			contactData		=		(HashMap<String, String>) lResultMap.get("contact");
			
			if(contactData!=null)
			{
				fName	=	contactData.get("firstName");
				mName	=	contactData.get("MiddleName");
				lName	=	contactData.get("lastName");
			}
			
			if(fName != null)
			{
				if(mName != null && lName !=null)
				{
					name = fName+" "+mName+" "+lName;
				}
				else if(mName == null && lName != null)
				{
					name = fName+" "+lName;
				}
				else
				{
					name = fName;
				}
			}
			
			else
			{
				name = "no name";
			}
			
			
			if(skillset!=null)
			{
				for(HashMap<String,String> data:skillset)
				{
					mResult		=		new HashMap<String,String>();
					mResult.put("name", name);
					mResult.put("login", login);
					mResult.put("skillSetId",data.get("skillSetId"));
					mResult.put("title",data.get("title"));
					mResult.put("description",data.get("description"));
					mResult.put("skillSetTypeId",data.get("skillSetTypeId"));
					//mResult.put("dateAdded",data.get("dateAdded").toString());
					mResultKey.put(data.get("skillSetId"),mResult);
				}
			}
			
			if(cskillset!=null)
			{
				for(HashMap<String,String> data:cskillset)
				{
					mResult		=		new HashMap<String,String>();
					if(mResultKey.get(data.get("skillSetID"))!=null)
					{
						mResult = mResultKey.get(data.get("skillSetID"));
						mResult.put("skillLevel",data.get("skillLevel"));
						 testingURl  = data.get("url");
						 if(testingURl	!= null){
						if(testingURl.equals("undefined"))
						{
							testingURl=" ";
							mResult.put("url",testingURl);
						}
						 
						 else
						{
							mResult.put("url",testingURl);
						}
						 }
						mResultL.add(mResult);
					  
					}
				}
			}
			
			/*
			mResultKey	=		new HashMap<String,HashMap<String,String>>();
			for(HashMap<String,String> data:mResultL)
			{
				mResultKey.put(""+i+"", data);
			}*/
			mapper			=	new ObjectMapper();
			strWriter		=	new StringWriter();
			mapper.writeValue(strWriter, mResultL);
			lResultMapJson  = strWriter.toString();
		}
		System.out.println(lResultMapJson);
	 }
	 catch(Exception e){
		 log.severe(" "+e.getMessage());
		 e.printStackTrace();
	 }
	return lResultMapJson;
 }
private void clearCache(String login)
	{
		log.info( "Inside clear cache when altering skill" );
		String result	=	""	;
		String mode		=	""	;
		try
			{
				ModeUtil modeObj       = new ModeUtil();
				mode  		   = modeObj.getMode().toLowerCase();
				login			=	login.toLowerCase();
				String url			   = ResourceBundle.getBundle("ApplicationResources").getString(mode+".webchat.url")+"/xmpp/temptestcache-rem?key=agentdetail-"+login;             
						
				log.info( "making a call to clear cache "+url );
				URLFetch urlfetch   		=	 new URLFetch();
				String clearCacheRespStr 	=	 urlfetch.httpUrlFetchGET(url);
				log.info("clearCacheRespStr    :::::    "+clearCacheRespStr);
			}
			catch ( Exception e )
			{
				log.log(Level.SEVERE,"Exception while clearing cache :: "+e.getMessage(),e);
				
			}
		
	}
 @RequestMapping(value="alterSkillDataForAgentNEWCMS",method=RequestMethod.GET)
 public @ResponseBody String alterSkillDataToNewCms(HttpServletRequest request,HttpSession session)
 {
	 log.info("this is the request we got"+request);
	 String lclientId						=		null;
	 String lEmail 							=		null;
	 String lUrl							=		null;
	 String lTitle							=		null;
	 String lSkillLevel						=		null;
	 String lInteractionType				=		null;
	 String lOperation						=		null;
	 HashMap<String,String> inputJson		=		null;
	 String lInputJson						=		null;
	 String lResultJson						=		null;
	 String userID							=		(String) session.getAttribute("username");
	 ObjectMapper mapper					=		null;
	 Writer	 strWriter						=		null;
	 ModeUtil lMode							=	 	new ModeUtil();
	 String newCmsUrl						=		lMode.getNewCmsUrl();
	 String loldSkillLevel					=		null;
	 String loldSkillURL					=		null;
	 String type							=		"";
	 ResourceBundle lResourceBundle   		= 		ResourceBundle.getBundle("ApplicationResources");
	 // for adding modifications of skill and agent deletes to the database
	 PersistenceManager pmf			        =		JdoUtil.get().getPersistenceManager();
	 SkillActivityJDO activityList          =		new SkillActivityJDO(); 
	 
	 try
	 {
		 lclientId				=		request.getParameter("clientId");
		 lEmail					=		request.getParameter("lemail");
		 lUrl					=		request.getParameter("url");
		 lTitle					=		request.getParameter("stitle");
		 lSkillLevel			=		request.getParameter("slevel");
		 lInteractionType		=		request.getParameter("itype");
		 lOperation				=		request.getParameter("operation");
		 loldSkillLevel			=		request.getParameter("oldskilllevel");
		 loldSkillURL			=		request.getParameter("oldurl");
		 if(request.getParameter("type") != null)
		 type					=		request.getParameter("type");
	 }
	 catch(Exception e)
	 {
		 log.severe("error in receiving the parameter "+e.getMessage());
		 e.printStackTrace();
	 }
	 try
	 {
		 log.info("the user login is: "+userID);
		 inputJson		=	new HashMap<String,String>();
		 mapper			=	new ObjectMapper();
		 strWriter		=	new StringWriter();
		 
		 inputJson.put("email"				, lEmail);
		 inputJson.put("interactionTypeId"	, lInteractionType);
		 inputJson.put("title"				, lTitle);
		 inputJson.put("operation"			, lOperation);
		 inputJson.put("skillLevel"			, lSkillLevel);
		 inputJson.put("url"				, lUrl);
		 
		 mapper.writeValue(strWriter, inputJson);
		 lInputJson  	= 	strWriter.toString();
		 lResultJson	=	new URLFetch().urlFetchPOST(lInputJson, newCmsUrl+"/services/data/v2.0/objects/Skills/checkAndProcessContactSkillSet?apikey=SEN42");
		 clearCache(lEmail);
	 }
	 catch(Exception e)
	 {
		 log.severe("error in receiving the data from the cms "+e.getMessage());
		 e.printStackTrace();
	 }
//TODO: Call our DB to change get current skillset by login.Then take the skill set for skillsettypeid is of WDS related.
	 
	 try
	 {
		 mapper			=	new ObjectMapper();
		 HashMap data   =   mapper.readValue(lResultJson, HashMap.class);

		 if((boolean) data.get("isContactSkillSetDeleted") == true)
		 {
			 log.info("changed data. agents have been deleted so let's change it in the database");
			 activityList.setType("deleted agent");
			 activityList.setAccountnumber(lclientId);
			 activityList.setagentLogin(lEmail);
			 activityList.setdateModified(new Date());
			 activityList.setskillChanged(lTitle);
			 activityList.setuserLogin(userID);
			 activityList.setskillLevel(lSkillLevel);
			 activityList.setskillUrl(lUrl);			
			 pmf.makePersistent(activityList);
			 if(lResourceBundle.getString("ar.interaction.email.TaskRouter").equalsIgnoreCase(lInteractionType) || lResourceBundle.getString("ar.interaction.email.V2WorkItems").equalsIgnoreCase(lInteractionType))
				 updateSkillActivityInWDS(lEmail,lTitle,"delete");
		 }
		 if(type.equals("skilllevel") && (boolean) data.get("isContactSkillSetUpdated") == true)
		 {
			 activityList.setType("Skill level has been updated");
			 activityList.setAccountnumber(lclientId);
			 activityList.setagentLogin(lEmail);
			 activityList.setdateModified(new Date());
			 activityList.setskillChanged(lTitle);
			 activityList.setuserLogin(userID);
			 activityList.setskillLevel(lSkillLevel);
			 activityList.setOldSkillLevel(loldSkillLevel);
			 activityList.setskillUrl(lUrl);			
			 pmf.makePersistent(activityList);
		 }
		 if(type.equals("url") && (boolean) data.get("isContactSkillSetUpdated") == true)
		 {
			 activityList.setType("URL has been updated");
			 activityList.setAccountnumber(lclientId);
			 activityList.setagentLogin(lEmail);
			 activityList.setdateModified(new Date());
			 activityList.setskillChanged(lTitle);
			 activityList.setuserLogin(userID);
			 activityList.setskillLevel(lSkillLevel);
			 activityList.setskillUrl(lUrl);
			 activityList.setOldSkillURL(loldSkillURL);
			 pmf.makePersistent(activityList);
		 }
		 if((boolean) data.get("isContactSkillSetInserted") == true)
		 {
			 activityList.setType("New Account has been created");
			 activityList.setAccountnumber(lclientId);
			 activityList.setagentLogin(lEmail);
			 activityList.setdateModified(new Date());
			 activityList.setskillChanged(lTitle);
			 activityList.setuserLogin(userID);
			 activityList.setskillLevel(lSkillLevel);
			 activityList.setskillUrl(lUrl);
			 activityList.setOldSkillURL(loldSkillURL);
			 pmf.makePersistent(activityList);
			 if(lResourceBundle.getString("ar.interaction.email.TaskRouter").equalsIgnoreCase(lInteractionType) || lResourceBundle.getString("ar.interaction.email.V2WorkItems").equalsIgnoreCase(lInteractionType))
				 updateSkillActivityInWDS(lEmail,lTitle,"add");
		 }


		 log.info("When updating agents this thing returns a JSON"+lResultJson);

	 }
	 catch(Exception e)
	 {
		 log.log(Level.SEVERE,"error in sending mapping and sending email"+e.getMessage(),e);
	 }
	 finally
	 {
		 if(pmf != null)
			 pmf.close();
		 
		 log.info("Persistance is closed properly ");
	 }

	 return lResultJson;
 }
	private String updateSkillActivityInWDS(String lEmail,String skill ,String action) 
	{
		log.info("Update skill in WDS starts : Email : "+lEmail+" : Skill : "+skill+" : action : "+action);
		String 				   			   response	=  "failed";
		String							loginString	=  "";
		HashMap<String,String> 			   loginMap	=  null;
		ObjectMapper			 			 mapper	=  null;
		ModeUtil					    	  lMode	=  null;
		String 				 			  newCmsUrl	=  "";
		String								 wdsUrl	=  "";
		String 			   			   skillbyLogin	=  "";
		HashMap<String,Object> 			contactData	=   null;
		ArrayList<HashMap<String,String>>  skillset	=	null;
		ResourceBundle 				lResourceBundle = 	ResourceBundle.getBundle("ApplicationResources");
		String					   wDSAgentSkillStr	=	"";
		ArrayList<String>			SkillListForWDS	=	null;
		HashMap<String,HashMap<String,String>> wdsSkillMap	=	null;
		HashMap<String,String>			wdsSkillSet	=	null;
		String						  wdsRequestStr	=	"";
		String						 wdsResponseStr	=	"";
		try
		{
			lMode			=   new ModeUtil();
			newCmsUrl		=   lMode.getNewCmsUrl();
			wdsUrl			=	lMode.getSynclioUrl();
			mapper			=	new ObjectMapper();
			loginMap		=	new HashMap<String,String>();
			contactData		=   new HashMap<String,Object>();
			skillset		=	new ArrayList<HashMap<String,String>>();
			SkillListForWDS	=	new ArrayList<String>();
			wdsSkillMap		=	new HashMap<String,HashMap<String,String>>();
			wdsSkillSet		=	new HashMap<String,String>();
			if(lEmail !=null && !lEmail.equals(""))
			{
				loginMap.put("login", lEmail);
				loginString		=	mapper.writeValueAsString(loginMap);
				skillbyLogin	=	new URLFetch().urlFetchPOST(loginString, newCmsUrl+ResourceBundle.getBundle("ApplicationResources").getString("validatelogin.url").trim());
				contactData		=	mapper.readValue(skillbyLogin, HashMap.class);
				skillset		=	(ArrayList<HashMap<String, String>>) contactData.get("skillSet");
				if(skillset!=null)
				{
					
					for(HashMap<String,String> data:skillset)
					{
						log.info("Skills are : "+data.get("title"));
						if(lResourceBundle.getString("ar.interaction.email.TaskRouter").equalsIgnoreCase(data.get("skillSetTypeId")) || lResourceBundle.getString("ar.interaction.email.V2WorkItems").equalsIgnoreCase(data.get("skillSetTypeId")))
						{
							
							if(action.equals("delete") && !data.get("title").equalsIgnoreCase(skill))
								SkillListForWDS.add(data.get("title").trim());
							else
								SkillListForWDS.add(data.get("title").trim());
						}
					}
					if(action.equals("add") && !SkillListForWDS.contains(skill))
					{
						SkillListForWDS.add(skill);
					}
					//CAll wds to update this as a string
					wDSAgentSkillStr	= 	SkillListForWDS.toString();
					wDSAgentSkillStr	=	wDSAgentSkillStr.substring(1, wDSAgentSkillStr.length() - 1).replace(", ", ",");
					log.info("skill to go to WDS are "+SkillListForWDS);
					wdsUrl				=	wdsUrl+"/Worker/"+lEmail.toLowerCase();
					wdsSkillSet.put("skill_title", wDSAgentSkillStr);
					wdsSkillMap.put("attributes", wdsSkillSet);
					wdsRequestStr	=	mapper.writeValueAsString(wdsSkillMap);
					wdsResponseStr	=	new URLFetch().httpPut(wdsRequestStr, wdsUrl);
					if(wdsResponseStr.contains("Worker successfully updated"))
						response	=	"success";
				}
			}
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
		}
		return response;
		//TODO: Get data from DS by login.
	}
	@RequestMapping(value="/createSkillSet",method=RequestMethod.GET)
	public @ResponseBody String createSkillSet(@RequestParam(value="skillTitle") String skillTitle, @RequestParam(value="iType") String iType)
	{
		String 					skillSetTypeId	    =			"";
		HashMap<String,String> 	   skillSetMap		=			null;
		String  				  skillSetJson		=			null;
		String  					 resultStr	  	=			null;
		ObjectMapper 					mapper	    =			new ObjectMapper();
		StringWriter    			 strWriter		=			new StringWriter();
		ModeUtil 						 lMode		=	 		new ModeUtil();
		String 						 newCmsUrl		=			lMode.getNewCmsUrl();
		try
		{
			if(iType.trim().equalsIgnoreCase("webchat"))
			{
				skillSetTypeId		=	ResourceBundle.getBundle("ApplicationResources").getString("chat.interactiontypeid");
			}
			else
			{
				skillSetTypeId		=	ResourceBundle.getBundle("ApplicationResources").getString("ar.interactiontypeid");
			}
			
			skillSetMap	=		new HashMap<String,String>();
			skillSetMap.put("title", skillTitle);
			skillSetMap.put("skillSetTypeId", skillSetTypeId);
			mapper.writeValue(strWriter, skillSetMap);
			skillSetJson	=	strWriter.toString();
			resultStr 		=	new URLFetch().urlFetchPOST(skillSetJson, newCmsUrl+"/services/data/v2.0/objects/Skills/checkAndCreateSkillSet?apikey=SEN42");
			log.info("result of skill creation for new skill :: "+resultStr);
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
			e.printStackTrace();
		}
		return resultStr;
	}
	@RequestMapping(value="/createskillforacc",method=RequestMethod.GET)
	public @ResponseBody String manageSkillForAccount(HttpServletRequest request)
	{
		String skillTitle 				=			"";
		String skillSetTypeId			=			"";
		String itype					=			"";
		String newtitle					=			"";
		String clientId					=			"";
		String routingtype				=			"";
		
		HashMap lInputMap				=			null;
		HashMap lInputMap2				=			null;
		String  lInputJson				=			null;
		String  lResult					=			null;
		
		ObjectMapper 	mapper			=			new ObjectMapper();
		StringWriter    strWriter		=			new StringWriter();
		
		ModeUtil lMode					=	 		new ModeUtil();
		String newCmsUrl				=			lMode.getNewCmsUrl();
		
		ModeUtil lModeUtil     		 	= 			new ModeUtil();
		
		try
		{
			skillTitle		=		request.getParameter("skilltitle");
			itype			=		request.getParameter("itype");
			newtitle		=		request.getParameter("newtitle");
			clientId		=		request.getParameter("clientid");
			routingtype		=		request.getParameter("routetype");
			
			if(itype.trim().equalsIgnoreCase("webchat"))
			{
				skillSetTypeId		=	ResourceBundle.getBundle("ApplicationResources").getString("chat.interactiontypeid");
			}
			else
			{
				skillSetTypeId		=	ResourceBundle.getBundle("ApplicationResources").getString("ar.interactiontypeid");
			}
			
			if(newtitle.trim().equals("new"))
			{
				lInputMap	=		new HashMap();
				lInputMap.put("title", skillTitle);
				lInputMap.put("skillSetTypeId", skillSetTypeId);
				
				mapper.writeValue(strWriter, lInputMap);
				lInputJson	=	strWriter.toString();
				
				lResult 	=	new URLFetch().urlFetchPOST(lInputJson, newCmsUrl+"/services/data/v2.0/objects/Skills/checkAndCreateSkillSet?apikey=SEN42");
				
				log.info("result of skill creation for new skill :: "+lResult);
			}
			
			lInputJson = null;
			
			if(routingtype.trim().equalsIgnoreCase("live"))
			{
				log.info("inside :: type :: live");
				
				lInputMap	=	new HashMap();
				lInputMap2	=	new HashMap();
				
				lInputMap.put("subaccountnumber", clientId);
				lInputMap2.put("147", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
				
				
				
				mapper		=	new ObjectMapper();
				strWriter	=	new StringWriter();
				
				mapper.writeValue(strWriter, lInputMap);
				
				lInputJson	=	strWriter.toString();
			}
			
			if(routingtype.trim().equalsIgnoreCase("dev/staging"))
			{
				log.info("inside :: type :: dev/staging");
				
				lInputMap	=	new HashMap();
				lInputMap2	=	new HashMap();
				
				lInputMap.put("subaccountnumber", clientId);
				lInputMap2.put("148", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
				
				mapper		=	new ObjectMapper();
				strWriter	=	new StringWriter();
				
				mapper.writeValue(strWriter, lInputMap);
				
				lInputJson	=	strWriter.toString();
			}
			
			if(routingtype.trim().equalsIgnoreCase("overflow_live"))
			{
				log.info("inside :: type :: overflow_live");
				
				lInputMap	=	new HashMap();
				lInputMap2	=	new HashMap();
				
				lInputMap.put("subaccountnumber", clientId);
				lInputMap2.put("149", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
				
				mapper		=	new ObjectMapper();
				strWriter	=	new StringWriter();
				
				mapper.writeValue(strWriter, lInputMap);
				
				lInputJson	=	strWriter.toString();
			}
			
			if(routingtype.trim().equalsIgnoreCase("overflow_dev/staging"))
			{
				log.info("inside :: type :: overflow_dev/staging");
				
				lInputMap	=	new HashMap();
				lInputMap2	=	new HashMap();
				
				lInputMap.put("subaccountnumber", clientId);
				lInputMap2.put("150", skillTitle);
				
				lInputMap.put("paramMap", lInputMap2);
				
				mapper		=	new ObjectMapper();
				strWriter	=	new StringWriter();
				
				mapper.writeValue(strWriter, lInputMap);
				
				lInputJson	=	strWriter.toString();
			}
			
			lResult		=	new URLFetch().urlFetchPOST(lInputJson,lModeUtil.getDataStoreURLByMode()+"/services/data/setclientparamvalueNew");
			
			log.info("result of skill parameter updating ::"+lResult);
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE, ""+e.getMessage(),e);
			e.printStackTrace();
		}
		
		return lResult;
	}
//	@RequestMapping(value="/checkskillforaccr",method=RequestMethod.GET)
//	public @ResponseBody String getCurrentSkill(HttpServletRequest request)
//	{
//		String lClientId				=			null;
//		String lRouteType				=			null;
//		String lResult					=			null;
//		ModeUtil lMode					=	 		new ModeUtil();
//		
//		try
//		{
//			lClientId	=	request.getParameter("clientid");
//			lRouteType	=	request.getParameter("routetype");
//			
//			lResult		=	new URLFetch().httpUrlFetchGET(lMode.getDataStoreURLByMode()+"/services/data/getcurrentskillforaccno?clientid="+lClientId+"&routetype="+lRouteType);
//		}
//		catch(Exception e)
//		{
//			log.log(java.util.logging.Level.SEVERE,""+e.getMessage(),e);
//		}
//		
//		return lResult;
//	}
	
	@RequestMapping(value="/checkskillforaccrmodified",method=RequestMethod.GET)
	public @ResponseBody String getCurrentSkillmodified(HttpServletRequest request)
	{
		String subAccountNumber			=			null;
		String lResult					=			null;
		ModeUtil lMode					=	 		new ModeUtil();
		String fUrl						=			null;
		String randomNumber				=			null;
		try
		{
			//boolean webchat				=			false;
			String webchat = "true";
			randomNumber				=			String.valueOf(new Date().getTime());
			subAccountNumber	=	request.getParameter("clientid");
			 fUrl			= new URLFetch().urlFetchPOST(subAccountNumber, "http://anu2.stagin-cms.appspot.com/services/data/getClientParamsbasedOnClientId");
//			String fUrl			=	lMode.getDataStoreURLByMode()+"/services/data/getallclientparameters"+"/"+subAccountNumber+"/"+webchat+"/"+randomNumber;
			log.info("the final url is "+fUrl);
//			lResult		=	new URLFetch().httpUrlFetchGET(fUrl);
			
			log.info("result of the  url is-------> "+lResult);
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,""+e.getMessage(),e);
		}
		
		
		return fUrl;
		
	}

	// service to get Status of account
	ModeUtil modeUtil		= new ModeUtil();
	
	
	@RequestMapping( value = "/getaccountstatus" , method = RequestMethod.POST)
	public @ResponseBody String getStatusForSubAccountNumber(HttpServletResponse res ,HttpServletRequest request,HttpSession session)
	{
		log.info("Inside sendStatusForSubAccountNumber method!");
		String subAccountNumber									= request.getParameter("subaccountnumber");
		String sAccountStatus									= "";
		String response											= "";	
		HashMap <String , String> lRetVal 	                    =  (HashMap <String , String>) session.getAttribute( "loginmap" );
		
		try {
			
//		    if(!CommonUtilities.checkIfAdmin( (HashMap <String , Object>) session.getAttribute( "loginmap" ) ) )
//			{
//				res.sendRedirect("http://login.conversionsupport.com");
//			}
			
			log.info("subAccountNumber:"+subAccountNumber);
			
//			BrandingSettingsService lBrandingSettingsService    = new BrandingSettingsService();
			try{
//				response	= lBrandingSettingsService.getAccountStatus(subAccountNumber);	
				response	= getAccountStatus(subAccountNumber);
				 if(response.equalsIgnoreCase("true"))
				 {
					 sAccountStatus="This Account is Active";
				 }
				 else if(response.equalsIgnoreCase("false"))
				 {
					 sAccountStatus="This Account is InActive"; 
				 }
				 else if(response.equalsIgnoreCase("No Account"))
				 {
					 sAccountStatus="This is not a Chat Account";
				 }
			}
			catch(Exception e)
			{
				log.info("error in getting account status");
				e.printStackTrace();
			}
		    
		    log.info("Response getting from the server -- CMS ::"+sAccountStatus);
		
			return sAccountStatus;
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			log.log(Level.SEVERE," their is an exception "+e.getMessage());
			return "Sorry , your request cannot be processed at this moment. Please try again later" ;
		}
	}
    public String getAccountStatus(String subAccountNumber)
    {
    	
    	String response 			= null;
    	try
    	{
    	
    		String CMS_URL			= modeUtil.getCmsUrl();
    	
    		if(subAccountNumber != null)
    		{
			
//	    		response 		    = restTemplate.postForObject(CMS_URL+ "/services/data/getAccountStatus", subAccountNumber ,String.class);
    			response 		    = new URLFetch().urlFetchPOST(subAccountNumber, CMS_URL+ "/services/data/getAccountStatus");
				log.info("Response getting from the server -- CMS "+response);
    		}
    		
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		log.info("Exception in the method setActiveStatus ::"+e.getMessage());
    	}
    	return response;
    }
    @RequestMapping( value = "/updateactivestatus" , method = RequestMethod.POST)
	public @ResponseBody String sendStatusForSubAccountNumber(HttpServletResponse response ,HttpServletRequest request,HttpSession session)
	{
		
		log.info("Inside sendStatusForSubAccountNumber method!");
		
		String subAccountNumber									= request.getParameter("subaccountnumber");
		String status											= request.getParameter("status");
		String sStatusForCms									= "";
		String success											= "SubAccountNumber doesn't exist";
		HashMap <String , String> lRetVal 	                    =  (HashMap <String , String>) session.getAttribute( "loginmap" );
		
		try {
			
//		    if(!CommonUtilities.checkIfAdmin( (HashMap <String , Object>) session.getAttribute( "loginmap" ) ) )
//			{
//				response.sendRedirect("http://login.conversionsupport.com");
//			}
			
			log.info("subAccountNumber:"+subAccountNumber+"&& ::status::"+status);
			String  path        = request.getScheme()+"://"+request.getServerName()+request.getContextPath();
			
			//setting the activestatus to be true or false to the datastore in the clientobject table
//			BrandingSettingsService lBrandingSettingsService    = new BrandingSettingsService();
			HashMap  statusMap 				 					= new HashMap();
			if(status.startsWith("t"))
			{
				sStatusForCms="true";
			}
			else{
				sStatusForCms="false";
			}
		    statusMap.put("subaccountnumber",subAccountNumber);
		    statusMap.put("activestatus", sStatusForCms);
		    CommonUtilities commonUtilities 				    = new CommonUtilities();
		    String statusJson               					=  commonUtilities.convertObjectToString(statusMap);
		    String responseJson				 					= setActiveStatus(statusJson);
		    log.info("Response getting from the server -- CMS ::"+responseJson);
		    
			//Boolean postgresResponse 							= listSubAccountNumbersClient.setSubAccountNumberStatus(subAccountNumber, status, path);
			// log.info("Response getting from the server -- PostGres ::"+postgresResponse);
		
			if("true".equalsIgnoreCase(responseJson))
			{
				if(status.startsWith("t"))
					success="Your Account has been Activated";
				else
					success="Your Account has been Deactivated";	
			    String[] lCacheKey               =  {ResourceBundle.getBundle("ApplicationResources").getString("cacheKeyClientConfigurationForClientParameters") + subAccountNumber.toLowerCase().trim()};
				
				//ClearCacheing in Interaction Server
//			    CacheManager lCacheManager = new CacheManager();
				clearCacheInInteractionServer(lCacheKey);
               
			}
			else
			{
				if(status.startsWith("t"))
					success="Problem in Activating Your Account";
				else
					success="Problem in Deactivating Your Account";
			}
				
		
			return success;
			
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			log.info(" their is an exception "+e.getMessage());
			return "Sorry , your request cannot be processed at this moment. Please try again later" ;
		}
	}
    @Autowired
	protected RestTemplate restTemplate = new RestTemplate();
	
    public String setActiveStatus(String statusJson)
    {
    	String response 			= null;
    	try
    	{
    		String CMS_URL			= modeUtil.getCmsUrl();
    		
    		if(statusJson != null)
    		{
	    		response 		    = restTemplate.postForObject(CMS_URL+ "/services/data/setactivestatusforsubaccountnumber", statusJson ,String.class);
				
				log.info("Response getting from the server -- CMS "+response);
    		}
    		else
    		{
    			response  		    = "false";
    		}
			
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		log.info("Exception in the method setActiveStatus ::"+e.getMessage());
    	}
    	return response;
    }
	public void clearCacheInInteractionServer(String[] lCacheKey)
	{
		log.info("inside the method clearCacheInInteractionServer");
		try
		{
			String 				clearCacheUrl    = 	null ;
			HttpURLConnection 	connection 		 = 	null ;
			BufferedReader 		reader           = 	null ;
			String 				lWebchaturl		 =	""	 ;
			//boolean 			lDoNotClearCache = false ;
			
			
			String applicationId = SystemProperty.applicationId.get();
			log.info("ApplicationID: "+applicationId );

			if(applicationId.equals("conversionsupportlive-hrd") )
			{
				lWebchaturl			= ResourceBundle.getBundle("ApplicationResources").getString("webchat.clearCacheInInteractionServer.path");
				log.info("Gonna clear cache in the following webchat url :: :: "+lWebchaturl);
				
			}
			else if(applicationId.equals("conversionsupportstaging-hrd") )
			{
				lWebchaturl			= ResourceBundle.getBundle("ApplicationResources").getString("staging.webchat.clearCacheInInteractionServer.path");
				log.info("Gonna clear cache in the following webchat url :: :: "+lWebchaturl);
			}
			else if(applicationId.equals("conversionsupportdev") )
			{
				lWebchaturl			= ResourceBundle.getBundle("ApplicationResources").getString("dev.webchat.clearCacheInInteractionServer.path");
				log.info("Gonna clear cache in the following webchat url :: :: "+lWebchaturl);
				//lDoNotClearCache	= true;
			}
			else
			{
				lWebchaturl			= ResourceBundle.getBundle("ApplicationResources").getString("local.webchat.clearCacheInInteractionServer.path");
				log.info("Gonna clear cache in the following webchat url :: :: "+lWebchaturl);
			}
			
			/*
			if(path.contains("staging") || path.contains("localhost") )
			{
				log.info( "It is staging / local conversion support ! :)" );
				lWebchaturl			= ResourceBundle.getBundle("ApplicationResources").getString("staging.webchat.clearCacheInInteractionServer.path");
				lDoNotClearCache	= true;
			}
			else
			{
				log.info( "It is live conversion support ! :)" );
				lWebchaturl			= ResourceBundle.getBundle("ApplicationResources").getString("webchat.clearCacheInInteractionServer.path");
			}
			*/
			
			log.info("The webchat URL chosen is to clear cache from is :: " +lWebchaturl);
			//if(!lDoNotClearCache)
			{
				try
				{

					for(int i=0  ; i < lCacheKey.length ; i++)
					{
					 clearCacheUrl 					= lWebchaturl + lCacheKey[i];
					 log.info("ClearCacheUrl :: "+clearCacheUrl);
					
					 URL url 						= 	new URL(clearCacheUrl);
					
					 log.info("Opening the connection with the interaction server");
					 connection 	= 	(HttpURLConnection) url.openConnection();
					 reader			= 	new BufferedReader(new InputStreamReader(url.openStream()));
					}
				
				}
				catch(Exception e)
				{
					e.printStackTrace();
					log.info("Exception in the method clearCacheInInteractionServer "+e.getMessage());
					
				}
				finally
				{
					try
					{
						reader.close();
						connection.disconnect();
					} 
					catch (IOException e) 
					{
						e.printStackTrace();
					}
					
					
				}
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			log.info("Exception occurred while trying to clear cache in interaction server!");
		}
		
		
	}
	@RequestMapping(value="/postArInteractionsCsvToMail/{fromDate}/{toDate}",method=RequestMethod.POST)
	public @ResponseBody String postArInteractionsCsvToMail(@PathVariable("fromDate") String fromDate,@PathVariable("toDate") String toDate,HttpSession session,Model model,HttpServletRequest request, HttpServletResponse response )
	{
		
		ModeUtil lModeUtil 				= new ModeUtil();
		String responseString			= null,
			   mode 					= lModeUtil.getMode(),
			   url						= null,
			   senderEmail				= request.getParameter("senderEmail"),
			   senderJson 				= null;
				
		log.info("--------"+senderEmail);
		if(mode.equalsIgnoreCase("live"))
		{
			url 			=	"http://conversionsupportlive-hrd.appspot.com/arInteractionsCsvMailQueue/"+fromDate+"/"+toDate;	
		}
		
		else
		{
			url 			=	"http://conversionsupportstaging-hrd.appspot.com/arInteractionsCsvMailQueue/"+fromDate+"/"+toDate;
		}
		
		//JSONObject senderEmailJson	= new JSONObject();
		HashMap senderEmailJson			= new HashMap();
		
		try 
		{
			senderEmailJson.put("senderEmail", senderEmail);
			ObjectMapper objectmapper	= new ObjectMapper();
			Writer strWriter			= new StringWriter();
			objectmapper.writeValue(strWriter, senderEmailJson);
			senderJson		=	strWriter.toString();
		} 
		catch (Exception e) 
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured while creating the json sender email"+e.getMessage(),e);
		}
		
		responseString		= new URLFetch().urlFetchPOST(senderJson, url);
		
		
		return responseString;
	}
	@RequestMapping(value="/getAgentsListBySkill",method=RequestMethod.GET)
	public @ResponseBody String getAgentsListBySkill(@RequestParam(value = "agentskill") String Skill,@RequestParam(value = "cursor", required = false) String cursor,HttpSession session,Model model,HttpServletRequest request, HttpServletResponse response )
	{
		ObjectMapper mapper 				=	null;
		ModeUtil lModeUtil 					= 	new ModeUtil();
		String   mode 						= 	lModeUtil.getMode();
		String url							=	"";
		String responseString				= 	"";
		HashMap responseMap					=	null;
		ArrayList<HashMap> contactMap		=	null;
		ArrayList<HashMap> contactSkillMap	=	null;
		ArrayList<HashMap> 	loginList		=	null;
		HashMap<String,Object> finalMap		=	null;
		String 				AgentList		=	null;
		Writer strWriter					= 	null;
		
		try
		{
			mapper 				=	new ObjectMapper();
			strWriter			= 	new StringWriter();
			contactMap			=	new ArrayList<HashMap>();
			contactSkillMap		=	new ArrayList<HashMap>();
			loginList			=	new ArrayList<HashMap>();
			finalMap			=	new HashMap<String,Object>();
			responseMap			=	new HashMap();
			
			if(mode.equalsIgnoreCase("live"))
			{
				url				=   ResourceBundle.getBundle("ApplicationResources").getString("live.newcmsurl");
			}
			
			else
			{
				url				=   ResourceBundle.getBundle("ApplicationResources").getString("staging.newcmsurl");
			}
			if((cursor.trim()).equalsIgnoreCase(""))
				url					=	url+"/services/data/v2.0/objects/Skills/getAgentsAssociatedWithSkillSetTitle?apikey=SEN42&skillSetTitle="+Skill+"&cursor=";
			else
				url					=	url+"/services/data/v2.0/objects/Skills/getAgentsAssociatedWithSkillSetTitle?apikey=SEN42&skillSetTitle="+Skill+"&cursor="+cursor;
			
			log.info(url);
			responseString		=   new URLFetch().httpUrlFetchGET(url);
			responseMap			=	mapper.readValue(responseString, HashMap.class);
			
			if(responseMap.containsKey("contact"))
			{
				if(responseMap.get("contact") !=null)
				{
					contactMap		=	(ArrayList<HashMap>) responseMap.get("contact");
				}
			}
			if(responseMap.containsKey("contactSkillSet"))
			{
				if(responseMap.get("contactSkillSet") !=null)
				{
					contactSkillMap		=	(ArrayList<HashMap>) responseMap.get("contactSkillSet");
				}
			}
			
			for (HashMap eachContact : contactMap) 
			{
			    if(eachContact.containsKey("login") && eachContact.containsKey("id") )
			    {
			    		String contactId		=	(String) eachContact.get("id");
				    		for (HashMap eachSkillSet : contactSkillMap) 
							{
				    			if(eachSkillSet.containsKey("contactID"))
				    			{
				    				String skillContactId		=	(String) eachSkillSet.get("contactID");
				    				if(skillContactId.equalsIgnoreCase(contactId))
				    				{
				    					HashMap<String,Object> loginSkillMap	=	new HashMap<String,Object>();
				    					loginSkillMap.put("login", 		eachContact.get("login"));
				    					loginSkillMap.put("firstName",  eachContact.get("firstName"));
				    					loginSkillMap.put("lastName",   eachContact.get("lastName"));
				    					loginSkillMap.put("url",   		eachSkillSet.get("url"));
				    					loginSkillMap.put("skillLevel", eachSkillSet.get("skillLevel"));
				    					loginList.add(loginSkillMap);
				    				}
				    			}
							}
			    }
			}
			String cursorw	=	(String) responseMap.get("cursor");
			log.info(cursorw);
			if(responseMap.containsKey("error"))
				finalMap.put("error",responseMap.get("error"));
			finalMap.put("loginList", loginList);
			finalMap.put("cursor", cursorw);
			if(contactSkillMap.size()	==	50)
				finalMap.put("moreData", true);
			else
				finalMap.put("moreData", false);
			mapper.writeValue(strWriter, finalMap);
			AgentList		=	strWriter.toString();
			return AgentList;
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured while retriveing login by Skill"+Skill+"     "+e.getMessage(),e);
			return "failure";
		}
	
	}
	@RequestMapping(value="/getNumberofUploadsBySubAccountNo",method=RequestMethod.POST)
	public @ResponseBody String getPendingInterations(@RequestParam(value="subacc") String subAccountNumber)
	{
		String PendingInteractionsLookupList = "[]";
		try
		{
			PendingInteractionsLookupList = new ToolsService().getPendingInteractionsBySubAccountNo(subAccountNumber);
		}
		catch(Exception ex)
		{
			log.info("Exception Occurred While getting the pending interaction lookups"+ex.getMessage());
		}
		return PendingInteractionsLookupList;
	}
	@RequestMapping(value="/getNumberOfPendingInteractions",method=RequestMethod.POST)
	public @ResponseBody String getNoOfPendingInteractionsfromFH(@RequestBody String lookUpLists)
	{
		String NoOfPendingInteractionsMap = "{}";
		try
		{
			NoOfPendingInteractionsMap = new ToolsService().getNoOfPendingInteractionsfromFH(lookUpLists) ;
		}
		catch(Exception ex)
		{
			log.info("Exception while getting the pending interactions from the FH"+ex.getMessage());
		}
		return NoOfPendingInteractionsMap;
	}
	@RequestMapping(value="/updatePendingInteractionsBySubAccountNo",method=RequestMethod.POST)
	public @ResponseBody String updatePendingInterations(@RequestBody String lookupEntryToBeUpdated)
	{
		String PendingInteractionsLookupList = "[]";
		try
		{
			PendingInteractionsLookupList = new ToolsService().updatePendingInteractionsBySubAccountNo(lookupEntryToBeUpdated);
		}
		catch(Exception ex)
		{
			log.info("Exception Occurred While getting the pending interaction lookups"+ex.getMessage());
		}
		return PendingInteractionsLookupList;
	}
	@RequestMapping(value="/validatesubaccount",method=RequestMethod.POST)
	public @ResponseBody String validatesubaccount(@RequestParam(value="subacc") String subacc,HttpServletRequest request , HttpServletResponse response)
	{
		String cms_fetch		=		null;
		ModeUtil lModeUtil		= 		null;
		String	lResult			=		"";
		ArrayList	newArray	=		null;
		HashMap	newMap			=		null;
		HashMap	data			=		null;
		String key				=		"";		
		String val				=		"";
		Boolean	eval			=		true;
		HttpSession		session	=		request.getSession();
		try
		{
			log.info("the subacc num obtaind is--->"+subacc);
			newArray			=		new ArrayList();
			lModeUtil			=		new ModeUtil();
			newMap				=		new HashMap();
			data				=		new HashMap();
			if("live".equalsIgnoreCase(lModeUtil.getMode()))
			{
				cms_fetch	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "clientid.getaccountdetails" );
			}
			else{
				cms_fetch	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "clientid.getaccountdetails" );
			}
			log.info("url to fetch account is "+cms_fetch);
			session.setAttribute("subAccountNumber", subacc);
			
			if(!(subacc).equalsIgnoreCase("null"))
			{
				lResult			=	new URLFetch().urlFetchPOST("", cms_fetch+"/?accountNumber="+subacc+"&subAccountNumber=null");
			}
			log.info("The intertypeid obtained is----->"+lResult);
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
			        
			        if(key.equals("interactionTypeId"))
			        {
			        	lResult		=	val;
			        	break;
			        }
			    }
				session.setAttribute("interactionTypeId", lResult);
				log.info("The intertypeid obtained is----->"+lResult);
			}
			        
			return lResult;
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured while validating"+e.getMessage(),e);
			return "failure";
		}
		
	}

	
	@RequestMapping(value= "/uploadcsv",method= RequestMethod.POST)
	public @ResponseBody String processCSV(@RequestBody HashMap<String,Object> csvInfo){
		String respString = null;
		try 
		{
			 respString = new ToolsService().processCsv(csvInfo);
		}
		catch (Exception e) {
			log.log(java.util.logging.Level.SEVERE,"exceptions occured while Processing CSV"+e.getMessage(),e);
		}
		 return  respString;  
	}
	@RequestMapping(value="/setInteractionToFullHistory",method=RequestMethod.POST)
	public @ResponseBody String setInteractionToFullHistory(@RequestParam("uniqueId") String uniqueId)
	{
		ArrayList<HashMap<String, Object>> bunchOfInteractions = new ArrayList<HashMap<String, Object>>();
		ArrayList<HashMap<String, Object>> bunchOfInteractionsForCache = new ArrayList<HashMap<String, Object>>();

		String interactionData			=	 null;
		CacheManagerHelper	cachehelper	=	 null;
		ModeUtil 			   modeutil	= 	 null;
		URLFetch 			   urlfetch	= 	 null;
		String						url	=	 "";
		String				   response	=	 "";		

				urlfetch		=	new URLFetch();
				modeutil		= 	new ModeUtil();
				url 			=	modeutil.getFullHistoryServicesURL();
				url				=	url+"/Interaction/persistInteraction.do";
				cachehelper		=	 new CacheManagerHelper();
				if(uniqueId != null)
				{
					interactionData 		=	cachehelper.getrawcache(uniqueId);
				}
				if(interactionData != null && !"".equalsIgnoreCase(interactionData))
				{	 
					TypeReference<ArrayList<HashMap<String, Object>>> objRef = new TypeReference<ArrayList<HashMap<String, Object>>>() {};
					 ObjectMapper mapper  = new ObjectMapper();
					 try 
					 {
						 bunchOfInteractions =  mapper.readValue(interactionData, objRef);
					 }
					 catch (Exception e)
					 {
						 e.printStackTrace();
					 }
					 for (HashMap<String, Object> singleInteractionMap : bunchOfInteractions)
					 {
						String singleInteractionDatatoStore = "";
						try
						{
							singleInteractionDatatoStore = mapper.writeValueAsString(singleInteractionMap);
						}
						catch(Exception e)
						{
							log.info("im sick of handling this thing...");
						}
						response	  =	urlfetch.urlFetchPOST(singleInteractionDatatoStore, url);
						log.info("Response From Full History is :: "+response);
						HashMap<String, Object> resultMap = new HashMap<String, Object>();
						try 
						{
							resultMap = mapper.readValue(response, HashMap.class);
						} 
						catch (Exception e) 
						{
							e.printStackTrace();
						}
						if (resultMap.containsKey("Interaction ID"))
						{
							String currentInteractionId = (String) resultMap.get("Interaction ID");
							HashMap<String, Object> interactionMapforSingle = ( (HashMap <String, Object>) singleInteractionMap.get("interaction"));
							interactionMapforSingle.put("interactionId", currentInteractionId);
							singleInteractionMap.put("interaction", interactionMapforSingle);
				//			singleInteractionMap.put("interactionId", currentInteractionId);
							bunchOfInteractionsForCache.add(singleInteractionMap);
						}

					 }
					 if( bunchOfInteractionsForCache.size() > 0 )
					 {
						 String arCoreUrl = modeutil.getArCoreEngineURLByMode();
							arCoreUrl = arCoreUrl+"/batchInsertARforCache";
							log.info("printing the url that we are gonna call :: "+arCoreUrl);
							String arCoreEngineCacheResponse = "";
							try
							{
								arCoreEngineCacheResponse =  new URLFetch().urlFetchPOST(mapper.writeValueAsString(bunchOfInteractionsForCache), arCoreUrl );
							}
							catch(Exception e)
							{
								log.info("theres an exception in storing in cache or in mapping the list before sending it to the cache!! :: "+e.getMessage());
							}
							
							log.info("this is the result arcore engine gave us :: "+arCoreEngineCacheResponse);

					 }
					 
				}
		return response;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping( value="/setAccountActivityStatus", method = RequestMethod.PUT )
	public @ResponseBody String setChatActiveAccountList(@RequestBody String statusJson)
	{
		String 						 response = "failed";
		ArrayList<HashMap> lActiveAccountList = new ArrayList<HashMap>();
		ObjectMapper                   mapper = new ObjectMapper();
		try 
		{
			lActiveAccountList	 = mapper.readValue(statusJson, ArrayList.class);
			if(lActiveAccountList != null)
			{
			    log.info("SIZE of the active account list:: "+lActiveAccountList.size());
				new ToolsService().insertOrUpdateChatAccountJDO(lActiveAccountList);
				response="success";
			}
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
			log.info("Exception inside setActiveAccountList method"+e.getMessage());
		}
		return response;
	}
}
