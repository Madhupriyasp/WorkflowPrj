package com.acti.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.acti.JDO.SkillActivityJDO;
import com.acti.service.ArAccountManagerService;
import com.acti.util.CommonUtilities;
import com.acti.util.JdoUtil;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;

@Controller
public class ArAccountMangerController 
{

	private static final Logger log = Logger.getLogger(ArAccountMangerController.class.getName()) ;
	@RequestMapping(value="/getClientId",method=RequestMethod.POST)
	public @ResponseBody String getClientId(@RequestParam(value ="accountNumber",required=false) String accountNumber,@RequestParam(value ="domainName",required=false) String domainName, @RequestParam (value="interactionTypeId") String interactionTypeId, @RequestParam(value ="subAccountNumber",required=false,defaultValue="null") String subAccountNumber)
	{
		log.info("coming in to get the next client ID");
		ModeUtil lModeUtil					= 		null;
		String	next_SubAccUrl				=		null;
		String	lResult						=		null;
		HashMap<String,Object>	tobeSent	=		null;
		String 	reqString					=		null;
		String	url							=		null;
		String 	uniquePin					=		null;
		HashMap<String, Object> resultMap	=		null;
		ObjectMapper	obj					=		null;		
		CommonUtilities	commonUtilities		=		null;
			try
			{
				commonUtilities		=	new CommonUtilities();	
				lModeUtil			=	new  ModeUtil();
				if(commonUtilities.isNumeric(accountNumber))
				{
					log.info("accountNumber is numaric value");
					if(lModeUtil.getMode().equalsIgnoreCase("live"))
						url = ResourceBundle.getBundle( "ApplicationResources" ).getString("betajobsys.url")+ResourceBundle.getBundle( "ApplicationResources" ).getString("accountdetails.getaccount")+accountNumber;
					else
						url = ResourceBundle.getBundle( "ApplicationResources" ).getString("stagingjobsys.url")+ResourceBundle.getBundle( "ApplicationResources" ).getString("accountdetails.getaccount")+accountNumber;
					String response  = new URLFetch().httpUrlFetchGET(url);
					HashMap[] resMap = new ObjectMapper().readValue(response, HashMap[].class);
					log.info("the size of the respmap is---->"+resMap.length);
					 log.info("Account Details from the jobsystem url ::: "+url+" ::: response Map ::: "+resMap);
					 if(resMap.length > 0 )
					 {
						 uniquePin = String.valueOf( resMap[0].get("uniquePin") );
						 log.info("Unique Pin for account number :: "+accountNumber+" :: is :: "+uniquePin);
						 obj		=	new ObjectMapper();
						 tobeSent	=	new HashMap<String,Object>();
						 tobeSent.put("accountNumber",accountNumber);
						 tobeSent.put("domainName", domainName);
						 tobeSent.put("intertype", interactionTypeId);
						 if(subAccountNumber != null && commonUtilities.isNumeric(subAccountNumber))
							 tobeSent.put("subAccountNumber", subAccountNumber);
						 reqString	=	obj.writeValueAsString(tobeSent);
							
						 if("live".equalsIgnoreCase(lModeUtil.getMode()))
						 {
							 next_SubAccUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "getnextclientId.url" );
						 }
						else
						{
							 next_SubAccUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "getnextclientId.url" );
						}
						lResult					= new URLFetch().urlFetchPOST(reqString, next_SubAccUrl);
						resultMap 				= obj.readValue(lResult, new TypeReference<HashMap<String, Object>>() {});
						String isSuccess 		= String.valueOf(resultMap.get("success"));
						if(isSuccess.equalsIgnoreCase("true"))
							resultMap.put("status", "true");
						else
							resultMap.put("status", "false");
						lResult = obj.writeValueAsString(resultMap);
					 }
					 else
					 {	
						 log.info("the catch is coming in---->");
						 obj	=	new ObjectMapper();
						 tobeSent			=	new HashMap();
						 tobeSent.put("success", false);
						 reqString	=	obj.writeValueAsString(tobeSent);
						 return reqString;
					 }
				}
				else
				{
					log.info("accountNumber is not a numaric value");
					uniquePin	=	accountNumber;
					url 	=	lModeUtil.getNewCmsUrl();
					url		=	url +"/services/data/v2.0/objects/Account/"+ uniquePin + "/getUsersAndSkillSets?apikey=SEN42&brandID=5a6e67a6-8bfd-45f5-a774-3462cb0c4e4c"; 
					log.info("request url is : "+url);
					String response  = new URLFetch().httpUrlFetchGET(url);
					HashMap resMap = new ObjectMapper().readValue(response, HashMap.class);
					 log.info("Account Details from the jobsystem url ::: "+url+" ::: response Map ::: "+resMap);
					 if((boolean) resMap.get("success"))
					 {
						 log.info("Unique Pin is :: "+uniquePin);
						 obj		=	new ObjectMapper();
						 tobeSent	=	new HashMap<String,Object>();
						 tobeSent.put("uniquePin",uniquePin);
						 tobeSent.put("domainName", domainName);
						 tobeSent.put("intertype", interactionTypeId);
						 if(subAccountNumber != null && commonUtilities.isNumeric(subAccountNumber))
							 tobeSent.put("subAccountNumber", subAccountNumber);
						 reqString	=	obj.writeValueAsString(tobeSent);
							
						 if("live".equalsIgnoreCase(lModeUtil.getMode()))
						 {
							 next_SubAccUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "getnextclientId.url" );
						 }
						else
						{
							 next_SubAccUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "getnextclientId.url" );
						}
						lResult					= new URLFetch().urlFetchPOST(reqString, next_SubAccUrl);
						resultMap 				= obj.readValue(lResult, new TypeReference<HashMap<String, Object>>() {});
						String isSuccess 		= String.valueOf(resultMap.get("success"));
						if(isSuccess.equalsIgnoreCase("true"))
							resultMap.put("status", "true");
						else
							resultMap.put("status", "false");
						lResult = obj.writeValueAsString(resultMap);
					 }
					 else
					 {	
						 log.info("the catch is coming in---->");
						 obj	=	new ObjectMapper();
						 tobeSent			=	new HashMap();
						 tobeSent.put("success", false);
						 reqString	=	obj.writeValueAsString(tobeSent);
						 return reqString;
					 }
				
				}
				
				
				
				
			}
			catch(Exception e){
				log.log( java.util.logging.Level.SEVERE, "Exception while getting the account details from job system ", e );
			}
			log.info("data comming from jobsystem is :"+lResult);
			return lResult;
	}
	@RequestMapping(value="/createNewAccount",method=RequestMethod.POST)
	public @ResponseBody String createNewAccount(@RequestBody String jsondata, HttpServletRequest request)
	{
		String	result									=	"";
		String skillTitle 								=	"";
		String skillSetTypeId							=	"";
		String itype									=	"";
		String clientId									=	"";
		String live_skill								=	"";
		String overflow_live_skill						=	"";
		String staging_skill							=	"";
		String overflow_staging_skill					=	"";
		String interactionType							=	"";
		ArAccountManagerService arService				=	null;
		
		try
		{
			HashMap		data	=	new HashMap();
			arService			=	new ArAccountManagerService();
			data				=	new ObjectMapper().readValue(jsondata, HashMap.class);
			skillTitle			=	(String) data.get("skilltitle");
			itype				=	(String) data.get("itype");
			clientId			=	(String) data.get("clientId");
			live_skill					=	(String) data.get("live_skill");
			staging_skill				=	(String) data.get("staging_skill");
			overflow_live_skill			=	(String) data.get("overflow_live_skill");
			overflow_staging_skill		=	(String) data.get("overflow_staging_skill");
			itype						=	(String) data.get("itype");
			clientId					=	(String) data.get("clientId");
			interactionType				=	(String) data.get("intertype");
			if("".equals(interactionType))
			interactionType			=	(String) data.get("campaign");
			
			result				=	arService.createAccount(jsondata);
			log.info("the itype is--->"+itype);
			log.info("the skillTitle is--->"+skillTitle);
			log.info("the skillSetTypeId is--->"+skillSetTypeId);
			log.info("the clientId is--->"+clientId);
			
			//for creating skills
			
			
			if(itype.trim().equalsIgnoreCase("webchat"))
			{
				skillSetTypeId		=	ResourceBundle.getBundle("ApplicationResources").getString("chat.interactiontypeid");
			}
			else
			{
				skillSetTypeId		=	interactionType;
			}
			
			if(!(live_skill.equalsIgnoreCase("OFF")))
				arService.createNewSkill(live_skill,skillSetTypeId);						//create new skill
			if(!(staging_skill.equalsIgnoreCase("OFF")))
				arService.createNewSkill(staging_skill,skillSetTypeId);	
			if(!(overflow_live_skill.equalsIgnoreCase("OFF")))
				arService.createNewSkill(overflow_live_skill,skillSetTypeId);
			if(!(overflow_staging_skill.equalsIgnoreCase("OFF")))
				arService.createNewSkill(overflow_staging_skill,skillSetTypeId);	
			
			arService.updateSkill(clientId,"live",live_skill,skillSetTypeId);		//update skill
			arService.updateSkill(clientId,"dev/staging",staging_skill,skillSetTypeId);
			arService.updateSkill(clientId,"overflow_live",overflow_live_skill,skillSetTypeId);
			arService.updateSkill(clientId,"overflow_dev/staging",overflow_staging_skill,skillSetTypeId);
			
			return result;
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,""+e.getMessage(),e);
			return "failure";
		}
	}
	@RequestMapping(value="/fetchSubaccounts",method=RequestMethod.GET)
	public @ResponseBody String fetchSubaccounts(@RequestParam(value ="subAccountNumber",required=false,defaultValue="null") String subAccountNumber,@RequestParam(value="accountNumberorSkill",required=false,defaultValue="null") String accountNumberorSkill)
	{
		String accountNumorSkill			=		"";
		String subaccno						=		"";
		
		String cms_fetch					=		"";
		String lResult						=		"";
		String respString					=		"";
		ArrayList finalData				=	null;
		ArAccountManagerService arService	=		null;
		ModeUtil lModeUtil					= 		null;
		ArrayList	respArr					=		null;
		try
		{	
			respArr				=	new ArrayList();
			log.info("Coming inside to fetch subaccounts");
			lModeUtil			=	new  ModeUtil();
			arService			=	new  ArAccountManagerService();
			if("live".equalsIgnoreCase(lModeUtil.getMode()))
			{
				cms_fetch	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "live.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "clientid.getaccountdetails" );
			}
			else{
				cms_fetch	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.cms.url" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "clientid.getaccountdetails" );
			}
			accountNumorSkill				=		accountNumberorSkill;
			
			try {
					Long.parseLong(accountNumorSkill);
					cms_fetch	=	cms_fetch +"?accountNumber=" + accountNumorSkill;
				} catch (Exception e) {
					cms_fetch	=	cms_fetch +"?skillId=" + accountNumorSkill;
				}
			log.info("the result obtained from the service is---->"+cms_fetch);
			String responseString = new URLFetch().httpUrlFetchGET(cms_fetch);
			log.info("respone we got::"+responseString);
			finalData				=	arService.getClientParams(responseString);
			respString				=	new ObjectMapper().writeValueAsString(finalData);
			log.info("the resp string obtained is----->"+respString);
			
			return respString;
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"exception in clearing cache for internal Account"+e.getMessage(),e);
			return "Failure";
		}
		
	}
	
	@RequestMapping(value="/updatearaccountskills",method=RequestMethod.POST)
	public @ResponseBody String updatearaccountskills(@RequestBody String jsondata, HttpServletRequest request, HttpSession session)
	{
	    log.info("this is the data we got"+request);
		String userID									=	String.valueOf(session.getAttribute("username"));
		String	result									=	"";
		String skillSetTypeId							=	"";
		String itype									=	"";
		String clientId									=	"";
		String live_skill								=	"";
		String overflow_live_skill						=	"";
		String staging_skill							=	"";
		String overflow_staging_skill					=	"";
		ArAccountManagerService arService				=	null;
		String webChatCacheUrl							=	"";
		String webChatCacheResponse						=	"";
		String workflowCacheUrl							=	"";
		String oldSkill									=   "";
		PersistenceManager pmf			        		=	JdoUtil.get().getPersistenceManager();
		SkillActivityJDO activityList          			=	new SkillActivityJDO(); 
		String newChangedSkill							=   "";
		 
		 ModeUtil modeObj       						=	null; 
		 URLFetch urlfetch   							=	null; 
		 String workflowCacheRsp						=	"";
		 CacheOperationController cacheObj				=	null;
		 ObjectMapper mapper							=	null;
		
		try
		{
			mapper					=	new ObjectMapper();
			HashMap<Object,Object>		data	=	new HashMap<Object,Object>();
			arService			=	new ArAccountManagerService();
			
			data				=	mapper.readValue(jsondata, HashMap.class);
			
			if(data.containsKey("userID") && "null".equalsIgnoreCase(userID))
				userID = String.valueOf(data.get("userID"));
									
			if("null".equalsIgnoreCase(userID))
				return "Invalid Session";
								
			if(data.containsKey("live_skill"))
				live_skill					=	(String) data.get("live_skill");
			if(data.containsKey("staging_skill"))
				staging_skill				=	(String) data.get("staging_skill");
			if(data.containsKey("overflow_live_skill"))
				overflow_live_skill			=	(String) data.get("overflow_live_skill");
			if(data.containsKey("overflow_staging_skill"))
				overflow_staging_skill		=	(String) data.get("overflow_staging_skill");
			if(data.containsKey("itype"))
				itype						=	(String) data.get("itype");
			if(data.containsKey("subAccountNumber"))
				clientId					=	(String) data.get("subAccountNumber");
			if(data.containsKey("oldSkill"))
				oldSkill					=	(String) data.get("oldSkill");

			
			//These should come in data  intertype , campaign
			log.info("the itype is--->"+itype);
			log.info("the clientId is--->"+clientId);
			
			if(itype.trim().equalsIgnoreCase("webchat"))
			{
				HashMap<String,String> chatSkillMap	= new HashMap<String,String>();
				for (Map.Entry<Object, Object> entry : data.entrySet()) 
				{
					if( "activeStatus".equalsIgnoreCase(String.valueOf(entry.getKey())) || "status".equalsIgnoreCase(String.valueOf(entry.getKey())) || "subAccountNumber".equalsIgnoreCase(String.valueOf(entry.getKey())) || "live_skill".equalsIgnoreCase(String.valueOf(entry.getKey())) ||
							"staging_skill".equalsIgnoreCase(String.valueOf(entry.getKey())) || "overflow_live_skill".equalsIgnoreCase(String.valueOf(entry.getKey())) || "overflow_staging_skill".equalsIgnoreCase(String.valueOf(entry.getKey())))
					{
						log.info("Key : " + entry.getKey() + " Value : "+ entry.getValue());
						chatSkillMap.put(String.valueOf(entry.getKey()),String.valueOf(entry.getValue()));
					}
				}
				result				=	arService.updateAccount(mapper.writeValueAsString(chatSkillMap));
				skillSetTypeId		=	ResourceBundle.getBundle("ApplicationResources").getString("chat.interactiontypeid");
			}
			else
			{
				skillSetTypeId		=	String.valueOf(data.get("intertype"));
				result				=	arService.updateAccount(jsondata);
			}
	
			
			//create new skill
			if(live_skill != null)
				arService.createNewSkill(live_skill,skillSetTypeId);
			if(staging_skill != null)
				arService.createNewSkill(staging_skill,skillSetTypeId);	
			if(overflow_live_skill != null)
				arService.createNewSkill(overflow_live_skill,skillSetTypeId);	
			if(overflow_staging_skill != null)
				arService.createNewSkill(overflow_staging_skill,skillSetTypeId);	
			
			log.info("This is the result returned successfully"+result);
			HashMap<String,Object> response	=	mapper.readValue(result, HashMap.class);
			if(response.containsKey("response") && (boolean)response.get("response"))
			{
				try
				{
					cacheObj					=	new CacheOperationController();
					modeObj						=	new ModeUtil();
					urlfetch					=	new URLFetch();
					String   mode  		   		= modeObj.getMode().toLowerCase();
					if(mode.equalsIgnoreCase("staging"))
					{
						log.info("staging detected!!");
						newChangedSkill 		= 	staging_skill;
						webChatCacheUrl			= 	ResourceBundle.getBundle("ApplicationResources").getString("webchat.url");
					}
					else
					{
						log.info("live detected!!");
						newChangedSkill 		= 	live_skill;	
						webChatCacheUrl			=	ResourceBundle.getBundle("ApplicationResources").getString("webchat.url.live");
					}
					if(data.containsKey("autoRescheduling"))
					{
						log.info("autoRescheduling detected Clearing Cache!");
						cacheObj.deleteCache("autoReschedulableClientIds");
					}
					
					if(!"webchat".equalsIgnoreCase(itype))
					{
						webChatCacheUrl				=	webChatCacheUrl+"/xmpp/temptestcache-rem?key=ettrules-"+clientId.toLowerCase().trim();
					}
					else
					{
						webChatCacheUrl				=	webChatCacheUrl+"/xmpp/temptestcache-rem?key=ClientConfiguration-"+clientId.toLowerCase().trim();
						webChatCacheResponse		=	urlfetch.httpUrlFetchGET(webChatCacheUrl);
						webChatCacheUrl				=	webChatCacheUrl+"/xmpp/temptestcache-rem?key=ClientRouting-"+clientId.toLowerCase().trim();
					}
					
					log.log(Level.INFO,"URL for clearing cache in Workflow is::::"+workflowCacheUrl+"URL for clearing cache in Webchat is::::"+webChatCacheUrl);
					
						webChatCacheResponse		=	urlfetch.httpUrlFetchGET(webChatCacheUrl);
					
						
					workflowCacheRsp			=	cacheObj.deleteCache("ClickToTalkRules-"+clientId.trim());
					
					log.log(Level.INFO,"Response of cache deletion in workflow ::: "+workflowCacheRsp +" & WebChat is ::: "+webChatCacheResponse);
					
					
				}
				catch ( Exception e )
				{
					log.log(Level.SEVERE,"Exception while clearing cache :: "+e.getMessage(),e);
			
				}
				try
				{
					if(data.containsKey("live_skill") || data.containsKey("staging_skill"))
					{
					log.info("it contains a skill change!! so let's change on database :D");
	                log.info("The skill of this account number  : "+clientId+" has been changed from "+oldSkill+"to : "+staging_skill+" by the user login : "+userID);				
					activityList.setType("changed skill");
					activityList.setAccountnumber(clientId);
					activityList.setdateModified(new Date());
					activityList.setskillChanged(newChangedSkill);
					activityList.setuserLogin(userID);
					activityList.setoldSkill(oldSkill);
					pmf.makePersistent(activityList);
					pmf.close();
					
					}		
				}
				catch(Exception e)
				{
					 log.log(Level.SEVERE," error in sending mapping and sending email"+e.getMessage(),e);
				}
		
			
			}
			return result;
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,""+e.getMessage(),e);
			return "failure";
		}
	}
	
	
	
	@RequestMapping(value="/fetchSubaccountsforParent",method=RequestMethod.GET)
	public @ResponseBody String fetchSubaccountsForGiven8xx(@RequestParam(value ="subAccountNumber",required=false,defaultValue="null") String subAccountNumber,@RequestParam(value="accountNumber",required=false,defaultValue="null") String accountNumber)
	{	
		ObjectMapper mapper = new ObjectMapper();
		String lResult		= "";
		String clientObjectResult = "";
		String mode = "";
		String fetchUrl = "";
		ModeUtil lmodeUtil = new ModeUtil();
		mode = lmodeUtil.getMode();
		if(mode.equalsIgnoreCase("live"))
		{
			fetchUrl = ResourceBundle.getBundle( "ApplicationResources" ).getString("live.getaccountsURL");
		}
		else
		{
			fetchUrl = ResourceBundle.getBundle( "ApplicationResources" ).getString("staging.getaccountsURL");
		}
		ArrayList<String> tempList = new ArrayList<String>();
		TypeReference<ArrayList<ArrayList<HashMap<String,Object>>>> typeRef = new TypeReference<ArrayList<ArrayList<HashMap<String,Object>>>>() {};
		ArrayList<String> totalAccountsList = new ArrayList<String>();
		
		tempList.add(accountNumber);
		HashMap<String,ArrayList<String>> tempMap = new HashMap<String,ArrayList<String>>();
		tempMap.put("parentAccNo", tempList);
		try {
			clientObjectResult			=	new URLFetch().urlFetchPOST(mapper.writeValueAsString(tempMap) , fetchUrl);
			log.info("this is the clientObjectResult ::"+clientObjectResult);
			ArrayList<ArrayList<HashMap<String,Object>>> TotalResult = mapper.readValue(clientObjectResult, typeRef);
			for(ArrayList<HashMap<String,Object>> Single8xxResult :  TotalResult)
			{
				for (HashMap<String,Object> singlesubAccount : Single8xxResult)
				{
					totalAccountsList.add((String) singlesubAccount.get("subAccountNumber"));
				}
			}
			
		} catch (Exception e) {
			lResult = "failure";
			e.printStackTrace();
			return lResult;
		}
		try
		{
			lResult = mapper.writeValueAsString(totalAccountsList);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			log.info("exception in mapping :: "+e.getMessage()+"  :: and this is the data that failed ::"+totalAccountsList);
			lResult = "";
		}
		log.info("going to return this list of accounts ---> :: "+lResult);
		return lResult;
	}
	
	
}
