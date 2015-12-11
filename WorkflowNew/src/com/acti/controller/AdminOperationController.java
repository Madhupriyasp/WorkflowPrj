package com.acti.controller;

import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import sun.management.resources.agent;

import com.acti.service.BrandingSettingService;
import com.acti.service.FullHistoryService;
import com.acti.service.ToolsService;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;

@Controller
public class AdminOperationController {
	
	private static final Logger log = Logger.getLogger(AdminOperationController.class.getName()) ;
	
	@RequestMapping(value="/getRoutingTableData",method=RequestMethod.POST)
	public @ResponseBody String getMroutingTableData(HttpServletResponse res ,HttpServletRequest request,HttpSession session)
	{
		
		log.info("inside Controller GET Mrouting Table Data");
		String response = "";
		BrandingSettingService lBrandingSettingsService    = new BrandingSettingService();
		try{
			response	= lBrandingSettingsService.getMroutingTableData();	
			
			log.info("response: "+response);
			
		}
		catch(Exception e)
		{
			log.info("error in getting account status");
			e.printStackTrace();
		}
		
		return response ;
	}
	
	@RequestMapping(value="/getAdminMapTable" , method=RequestMethod.POST)
	public @ResponseBody String getAdminMapTable(HttpServletRequest req, HttpServletResponse resp, HttpSession session)
	{
		log.info("inside Controller GET AdminMap Table Data");
		String response = "";
		BrandingSettingService lBrandingSettingsService    = new BrandingSettingService();
		try{
			response	= lBrandingSettingsService.getAdminTableData();	
			log.info("response: "+response);	
		}
		catch(Exception e)
		{
			log.info("error in getting AdminMap table data");
			e.printStackTrace();
		}
		return response;
	}
	
	@RequestMapping(value="/routingTable" , method= RequestMethod.GET)
	public String emaillistener(HttpSession session , HttpServletRequest request , HttpServletResponse response , Model model)
	{
		log.info("inside routing controller login map");
		HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
		if ( lRetVal == null )
		{
			log.info( "SESSION INVALID" );
			StringBuffer redirectUrlStringBuffer = request.getRequestURL();
			if( request.getQueryString() != null )
				redirectUrlStringBuffer.append( request.getQueryString() ); 
			return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;
		}	
		return "Routingtable";
	}
	
	@RequestMapping(value="/bookrequest" , method= RequestMethod.GET)
	public String triggerAR(HttpSession session , HttpServletRequest request , HttpServletResponse response , Model model)
	{
		log.info("inside routing controller login map");
		HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
		if ( lRetVal == null )
		{
			log.info( "SESSION INVALID" );
			StringBuffer redirectUrlStringBuffer = request.getRequestURL();
			if( request.getQueryString() != null )
				redirectUrlStringBuffer.append( request.getQueryString() ); 
			return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;
		}	
		return "BookRequest";
	}
	

	@RequestMapping(value="/addskills" , method= RequestMethod.GET)
	public String skillsAR(HttpSession session , HttpServletRequest request , HttpServletResponse response , Model model)
	{
	log.info("inside routing controller login map");
	HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
	if ( lRetVal == null )
	{
	log.info( "SESSION INVALID" );
	StringBuffer redirectUrlStringBuffer = request.getRequestURL();
	if( request.getQueryString() != null )
	redirectUrlStringBuffer.append( request.getQueryString() ); 
	return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;
	}	
	return "AddSkills";
	}
	
	
	@RequestMapping(value="/activeresponse", method =RequestMethod.GET)
	public @ResponseBody String activeresponse(HttpSession session, HttpServletRequest request , HttpServletResponse response)
	{
		String finishedbook 		= request.getParameter("finishedbook");
		String nextbook 			= request.getParameter("nextbook");
		String email 			 	= request.getParameter("email");
		HashMap arMap				= 	new HashMap();
		ObjectMapper mapper			=	new ObjectMapper();
		Writer strWriter            = 	new StringWriter(); 
		URLFetch urlfetch			=	new URLFetch();
		String jsonString			=	"";
		String result				=	"";
		String url					=	"";
		ModeUtil modeUtil				=	new ModeUtil();
		String mode					=	modeUtil.getMode();
		
		try
		{

			log.info("finishedbook::"+finishedbook+"nextbook::"+nextbook+"email::"+email);

			arMap.put("What_book_did_you_just_finish?", finishedbook);
			arMap.put("What_book_would_you_like_to_request_next?", nextbook);
			arMap.put("Where_should_we_send_the_book?", email);


			if(mode == "LIVE")
			{
				url = "http://webchat.a-cti.com/livechat/newarapi";
				arMap.put("accountnumber", "1210000222");
			}
			else
			{
				url = "http://staging.webchat.a-cti.com/livechat/newarapi";
				arMap.put("accountnumber", "1772205390");
			}
			log.info("url going to trigger is ::"+url);
			
			mapper.writeValue(strWriter, arMap);
			
			jsonString = strWriter.toString();
			
			log.info("jsonString::"+jsonString);
			
			result = urlfetch.urlFetchPOST(jsonString, url);

		}
		catch(Exception e)
		{
			log.info("error while constructing json for AR");
		}
		
		return result;
	}
	@RequestMapping(value="/getListOfAvailableAgents",method=RequestMethod.POST)
	@ResponseBody
	public String getAvailableAgents(@RequestBody String listOfAgent)
	{
		
		String 						Objectsfetched				=	"";
		String 						responseOfAvailableAgents	=	"";
		long 						countOfTotalAgents			=	0;
		long						countOfAvailableAgents		=	0;
		
		ObjectMapper				mapper						=	null;
		BrandingSettingService 		lBrandingSettingsService 	=	null;

		ArrayList<Object>			listOfAvailableAgents		=	new ArrayList<Object>();
		
		try
		{
			log.info("Came in to fetch the list of available agents");
			mapper						=	new ObjectMapper();
			lBrandingSettingsService	=	new BrandingSettingService();
		
			ArrayList<String>					listOfAgentsLogin	=	new ArrayList<String>();
			
			ArrayList<Object>					listOfskills		=	new ArrayList<Object>();
			HashMap<String,ArrayList<Object>> 	skillsAgentDetail	=	new HashMap<String,ArrayList<Object>>();
			ArrayList<Object>					singleSkillDetail	=	new ArrayList<Object>();	
			HashMap<String,String>				agentsSkillDetail	=	new HashMap<String,String>(); 
			
			HashMap<String,String>				agentStatusDetail		=	null;
			
			try
			{
				
				
				listOfAgentsLogin			=	mapper.readValue(listOfAgent, ArrayList.class);
				
				log.info("List of the agents logins"+listOfAgentsLogin);
				
				Objectsfetched					=	lBrandingSettingsService.getMroutingTableData();
				
				log.info("Objects Fetched are ::: "+Objectsfetched);
				
				listOfskills				=	mapper.readValue(Objectsfetched, ArrayList.class);
				
				for(String agentLogin 	:	listOfAgentsLogin)
				{
					for(Object skill	:	listOfskills)
					{
						skillsAgentDetail		=	(HashMap<String, ArrayList<Object>>) skill;
						
						if(!skillsAgentDetail.isEmpty())
						{
							for(Object singleSkill	:	skillsAgentDetail.keySet())
							{
								singleSkillDetail = skillsAgentDetail.get(singleSkill);
								for(Object agentSkill:singleSkillDetail)
								{
									agentsSkillDetail	=	(HashMap<String, String>) agentSkill;
									agentStatusDetail	=	new HashMap<String,String>();

									if(agentLogin.trim().equalsIgnoreCase(agentsSkillDetail.get("agentLogin")))
									{
										agentStatusDetail.put("skillID", agentsSkillDetail.get("agentSkillSet"));
										agentStatusDetail.put("status", agentsSkillDetail.get("status"));
										agentStatusDetail.put("agentName",agentsSkillDetail.get("aliasName"));
										listOfAvailableAgents.add(agentStatusDetail);
									}
								}
							}
						}
					}
				}
				
				responseOfAvailableAgents		=	mapper.writeValueAsString(listOfAvailableAgents);
			}
			catch(Exception e)
			{
				log.info("Caught Exception during fetching the Agents Details and Mapping ::::::: "+ e.getMessage());
			}
		}
		catch(Exception e)
		{
			log.info("Caught Exception while fetching list of  Availabel Agents       :::     "+e.getMessage() );
		}
		
		log.info("List of agents available status is "+listOfAvailableAgents);
		return responseOfAvailableAgents;
		
	}
}
