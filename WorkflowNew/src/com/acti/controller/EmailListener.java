package com.acti.controller;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.crypto.AEADBadTagException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tools.ant.types.Mapper;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.acti.service.ArAccountManagerService;
import com.acti.service.CacheManagerHelper;
import com.acti.util.URLFetch;
import com.acti.util.ModeUtil;

@Controller
public class EmailListener {
	
	private static final Logger log = Logger.getLogger(EmailListener.class.getName()) ;
	
	@RequestMapping(value="/emaillistener" , method= RequestMethod.GET)
	public String emaillistener(HttpSession session , HttpServletRequest request , HttpServletResponse response , Model model)
	{
		log.info("inside emaillistener controller login map");
		HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
		if ( lRetVal == null )
		{
			log.info( "SESSION INVALID" );
			StringBuffer redirectUrlStringBuffer = request.getRequestURL();
			if( request.getQueryString() != null )
				redirectUrlStringBuffer.append( request.getQueryString() ); 
			return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;
		}
		try
		{
			ArrayList<HashMap<String,Object>>	clientList	=	new ArrayList<HashMap<String,Object>>();
			
			clientList					= 	 getJsonClientDetails();
			String clientListDetails 	=	 new ObjectMapper().writeValueAsString(clientList);
			model.addAttribute( "emailListenerDetails" , clientListDetails );
		}
		catch ( Exception e )
		{
			log.log(Level.SEVERE,"Exception :: "+e.getMessage(),e);
			
		}
		return "Tools";
	}
	public ArrayList<HashMap<String,Object>> getJsonClientDetails()
	{
		 ArrayList<HashMap<String,Object>> clientlist 			= null;
		 HashMap<String,Object> lEmailListenerDTO;
		 ModeUtil 			modeUtill			=	new ModeUtil();
		 String 			mode				=	null;
		 String 			modeURL				=	null;
		 String 			url					=	null;
		 String 			details 			= 	null;
		 ObjectMapper 		mapper 				= 	new ObjectMapper();
		 ResourceBundle resourceBundle       	=   ResourceBundle.getBundle("ApplicationResources");
		 
		 
		 	lEmailListenerDTO = new HashMap<String,Object>();
		    clientlist 		  = new ArrayList<HashMap<String,Object>>();
			String interactiontypeid1 = resourceBundle.getString("emailInteraction.email.response");
			String interactiontypeid2 = resourceBundle.getString("emailInteraction.outbound.call");
			String sSubaccount="",sNewSubaccount="";
			boolean flag=true,
			startflag=true;
			log.info("trying to connect with cms");
			try
			{
				HashMap<String,String> lmapnew = new HashMap<String,String>();
				
				lmapnew.put("interaction_ar",interactiontypeid1 );
				lmapnew.put("interaction_email",interactiontypeid2 );
				
				  Writer strWriter             =  new StringWriter(); 
				    try 
				    {
				    	new ObjectMapper().writeValue(strWriter, lmapnew);
				    }
				    catch (JsonGenerationException e2)
				    {
				    	e2.printStackTrace();
				    }
				    catch (JsonMappingException e2)
				    {
				    	e2.printStackTrace();
				    }
				    catch (IOException e2)
				    {
				    	e2.printStackTrace();
				    }
				
				    String jsonString = strWriter.toString();
				    
				    log.info("jsonString:::"+jsonString);
				    
				    mode = modeUtill.getMode();

					if ( mode.equalsIgnoreCase( "LIVE" ) )
					{
						modeURL = resourceBundle.getString("live.cms.url");
						log.info("mode pointing is :"+mode+ "modeURL is ::"+modeURL);
					}
					else
					{
						modeURL = resourceBundle.getString("staging.cms.url");
						log.info("mode pointing is :"+mode+ "modeURL is ::"+modeURL);
					}

					url = modeURL+"/fetchAccountsBasedOnInteractionTypeId?interactionTypeId="+interactiontypeid1+","+interactiontypeid2;

					String result = new URLFetch().httpUrlFetchGET(url);
				   
				   log.info("result :: "+result);
				   JSONObject resultJson = new JSONObject(result);
			   
				   Iterator<String> resultKeys = resultJson.keys();
				   String key = null;
				
					while (resultKeys.hasNext()) 
					{
						key = resultKeys.next();
						log.info("key :: "+ key);
						log.info("value fo the above key::"+resultJson.getString(key));
					
						sSubaccount = key;
						log.info("sSubaccount"+ sSubaccount);
							if(key != null)
							details= resultJson.getString(key);
							HashMap detailsmap =null;
							HashMap clientParameters = null;
							
								if(details != null)
								{
								 detailsmap = new ObjectMapper().readValue(details, HashMap.class);
								}
								log.info("detailsmap:::"+detailsmap);
							
								if(sSubaccount != null)
								{
									 lEmailListenerDTO.put("clientId", sSubaccount);
								}
								
								if(detailsmap.get("interactionTypeId") != null)
								{
									lEmailListenerDTO.put("interactionTypeId", detailsmap.get("interactionTypeId"));
								}								
								
								if(detailsmap.get("clientParameters") !=null)
								{
									clientParameters = new ObjectMapper().readValue(resultJson.getJSONObject(key).getString("clientParameters"), HashMap.class);//(HashMap) detailsmap.get("clientParameters");
									log.info("clientParameters :: "+clientParameters);
									if(clientParameters.get("emailAddress") != null)
									{
										lEmailListenerDTO.put("emailAddress",(String)clientParameters.get("emailAddress"));
									}
									
									if(clientParameters.get("emailPassword") != null)
									{
										lEmailListenerDTO.put("password",(String)clientParameters.get("emailPassword"));
									}
									
									if(clientParameters.get("PolingRate") != null)
									{
										lEmailListenerDTO.put("pollingRate",(String)clientParameters.get("PolingRate"));
									}
									
									if(clientParameters.get("status") != null)
									{
										lEmailListenerDTO.put("status",(String)clientParameters.get("status"));
									}
									
									if(clientParameters.get("ListenerId") != null)
									{
										lEmailListenerDTO.put("listenerId",(String)clientParameters.get("ListenerId"));
									}
									
									if(clientParameters.get("statusGAEReader") != null)
									{
										lEmailListenerDTO.put("statusGAEReader",(String)clientParameters.get("statusGAEReader"));
									}else
										lEmailListenerDTO.put("statusGAEReader","false");
									
									if(clientParameters.get("pauseduration") != null)
									{
										lEmailListenerDTO.put("pauseDuration", clientParameters.get("pauseduration"));
									}									
									
									if(clientParameters.get("intertype") != null)
									{
										lEmailListenerDTO.put("intertype", clientParameters.get("intertype"));
									}
									
									if(clientParameters.get("staging_skill") != null)
									{
										lEmailListenerDTO.put("staging_skill", clientParameters.get("staging_skill"));
									}
								}
								
								/*log.info("resultKeys.next():::"+detailsmap.get("1020"));
							    if(detailsmap.get("1020") != null)
							    {
							    	lEmailListenerDTO.put("emailAddress",(String)detailsmap.get("1020"));
							    }
							    log.info("resultKeys.next():::"+detailsmap.get("1021"));
								if(detailsmap.get("1021")!= null)
								{
									lEmailListenerDTO.put("password",(String)detailsmap.get("1021"));
								}
								  log.info("resultKeys.next():::"+detailsmap.get("1213"));
								if(detailsmap.get("1213") != null)
								{
									lEmailListenerDTO.put("pollingRate",Integer.parseInt((String)detailsmap.get("1213")));
								}
								  log.info("resultKeys.next():::"+detailsmap.get("1215"));
								if(detailsmap.get("1215") != null)
								{
									lEmailListenerDTO.put("status",(String)detailsmap.get("1215"));
								}
								  log.info("resultKeys.next():::"+detailsmap.get("1216"));
								if(detailsmap.get("1216")!= null)
								{
									lEmailListenerDTO.put("listenerId",(String)detailsmap.get("1216"));
								}
								  log.info("resultKeys.next():::"+detailsmap.get("1214"));
								if(detailsmap.get("1214") != null)
								{
									lEmailListenerDTO.put("foldername",(String)detailsmap.get("1214"));
								}
								 log.info("resultKeys.next():::"+detailsmap.get("1225"));
								if(detailsmap.get("1225") != null)
								{
									lEmailListenerDTO.put("statusGAEReader",(String)detailsmap.get("1225"));
								}else
									lEmailListenerDTO.put("statusGAEReader","false");*/
								
								lEmailListenerDTO.put("emailclientslist","null");
								
								log.info("the value of the log before entering into the loop:::"+flag);
						if(flag==true)
						{
							
							log.info("inside true flag");
							clientlist.add(lEmailListenerDTO);
							lEmailListenerDTO = new HashMap<String,Object>();
						}	
						log.info("the value of the After executing the loop:::"+flag);
							
					}
					log.info("clientlist  :: "+clientlist);
			}
			catch (Exception e) 
			{
				log.info("Exception occured in getClientDetails :::::::::::::"+ e.getMessage());
				e.printStackTrace();
				clientlist = null;
			}
			log.info("returning from SErver is "+clientlist);
		 return clientlist;
}
	@RequestMapping(value="/startandstopEmaillistener" , method= RequestMethod.POST)
	public @ResponseBody String startandstopEmaillistener(HttpServletRequest request , HttpServletResponse response,String param)
	{
		String parameters		= request.getParameter("parameters"),
				currMode		= new ModeUtil().getMode(),
				url				= "",
				status			= "",
				responseString	= "success";
			
		ObjectMapper mapper		= new ObjectMapper();
		HashMap<String,String>  requestMap	=	new HashMap<String,String>();
		if(param != null && !"".equalsIgnoreCase(param) && !"null".equalsIgnoreCase(param))
		{
			parameters		=	param;
		}
		try
		{
			requestMap	=	mapper.readValue(parameters, HashMap.class);
		}catch(Exception e)
		{
			log.info("Param from the UI are : "+parameters);
			log.severe("error while getting values from Client "+e.getMessage());
		}
		log.info("Param from the UI are : "+requestMap);
		if(requestMap.get("action").equalsIgnoreCase("stop"))
			status	=	"false";	
		if(requestMap.get("action").equalsIgnoreCase("start"))
			status	=	"true";	
		log.info("Status going to DB is : "+status);
		updateStatus(requestMap.get("clientId"),status);
		
		
		return responseString;
	}
	public String updateStatus(String clientId , String status)
	{
		 String flag = "failed";
		 URLFetch urlfetch   							=	null; 
		 String workflowCacheRsp						=	"";
		 CacheOperationController cacheObj				=	null;
		 String webChatCacheUrl							=   "";
		 try
		 {
			 ModeUtil 			modeUtill			=	new ModeUtil();
			 String 			mode				=	"";
			 String 			modeURL				=	"";
			 String 			url					=	"";
			 ResourceBundle resourceBundle       	= ResourceBundle.getBundle("ApplicationResources");
			 
			 ObjectMapper lmapper = new ObjectMapper();
			  Writer strWriter             =  new StringWriter(); 
			  
			  HashMap<String,Object> clientMap = new HashMap<String,Object>();
			  clientMap.put("subaccountnumber", clientId);
			  
			  HashMap<String,String> paramvalue = new HashMap<String,String>();
			  
			  paramvalue.put("1215", status);
			  
			  clientMap.put("paramMap", paramvalue);
			  
			  log.info("clientMap: to be sent to the service is::"+clientMap);
			  
			   try 
			    {
				   lmapper.writeValue(strWriter, clientMap);
			    }
			    catch (Exception e)
			    {
			    	e.printStackTrace();
			    }
			    String jsonString = strWriter.toString();
			  
			    
			    mode = modeUtill.getMode();

				if ( mode.equalsIgnoreCase( "LIVE" ) )
				{
					modeURL = resourceBundle.getString("live.cms.url");
					log.info("mode pointing is :"+mode+ "modeURL is ::"+modeURL);
				}
				else
				{
					modeURL = resourceBundle.getString("staging.cms.url");
					log.info("mode pointing is :"+mode+ "modeURL is ::"+modeURL);
				}

				url = modeURL+"/services/data/setclientparamvalueNew";

			String result		=	new URLFetch().urlFetchPOST(jsonString, url);
			
			log.info("resultLLL:::"+result);

			try
			{
				cacheObj					=	new CacheOperationController();
				urlfetch					=	new URLFetch();
				
				if ( mode.equalsIgnoreCase( "LIVE" ) )
				{
					log.info("staging detected!!");
					webChatCacheUrl			= 	ResourceBundle.getBundle("ApplicationResources").getString("webchat.url.live");
				}
				else
				{
					log.info("live detected!!");
					webChatCacheUrl			=	ResourceBundle.getBundle("ApplicationResources").getString("webchat.url");
				}
				webChatCacheUrl				=	webChatCacheUrl+"/xmpp/temptestcache-rem?key=ettrules-"+clientId;
				
				
				log.log(Level.INFO,"URL for clearing cache in Workflow is::::URL for clearing cache in Webchat is::::"+webChatCacheUrl);
				
				String webChatCacheResponse		=	urlfetch.httpUrlFetchGET(webChatCacheUrl);
						   workflowCacheRsp		=	cacheObj.deleteCache("ClickToTalkRules-"+clientId.trim());
				
				log.log(Level.INFO,"Response of cache deletion in workflow ::: "+workflowCacheRsp +" & WebChat is ::: "+webChatCacheResponse);
				
				
			}
			catch ( Exception e )
			{
				log.log(Level.SEVERE,"Exception while clearing cache :: "+e.getMessage(),e);
		
			}
			flag = "success";
		 }
		 catch(Exception e)
		 {
			 flag = "failed";
			log.info("Exception in the method updateStatus::"+e.getMessage());
			e.printStackTrace();
		 }
		  return flag;
	}
	@RequestMapping(value="/startandstopNewEmailReader" , method= RequestMethod.POST)
	public @ResponseBody String startandstopNewEmailReader(HttpSession session , HttpServletRequest request , HttpServletResponse response)
	{
		String 					 parameters	=	 request.getParameter("parameters"),
								   result	=	"failed";
		HashMap<String,String>	 requestMap	=	null;
		ObjectMapper 	 			 mapper =	null;
		ArAccountMangerController	accountManagerController	=	new ArAccountMangerController();
		ArAccountManagerService		arService					=	new ArAccountManagerService();
		log.info("data comming from the Ui is "+parameters);
		try
		{
			requestMap	=	new HashMap<String,String>();
			mapper 		=	new ObjectMapper();
			
			if(!"".equalsIgnoreCase(parameters))
			{
				requestMap	=		mapper.readValue(parameters, HashMap.class);
				if(requestMap.containsKey("clientId"))
				{
					ArrayList<HashMap<String,String>> tlist	 = 	new ArrayList<HashMap<String,String>>();
					HashMap<String,String> 			   tmap	 = 	new HashMap<String,String>();
					String 	tempParam  = 	accountManagerController.fetchSubaccounts("", requestMap.get("clientId"));
					String  reqString  =	"";
					
					tlist	=	mapper.readValue(tempParam, ArrayList.class);
					if(tlist.size()>0)
					{
						tmap	=	tlist.get(0);
					}
					log.info("Data from service is "+tempParam);
					requestMap.put("campaign", tmap.get("campaign"));
					requestMap.put("intertype", tmap.get("campaign"));
					
					reqString	=	mapper.writeValueAsString(requestMap);
					result		=	arService.updateAccount(reqString);
					log.info("update"+result);
					if(result.contains("true"))
					{
						HashMap <String , String> lRetVal   =   (HashMap <String , String>) session.getAttribute( "loginmap" );
						HashMap<String,String>	tempMap		=	new HashMap<String,String>();
						String tempString					=	"";
						
						tempMap.put("clientId", requestMap.get("clientId"));
						tempMap.put("action", "stop");
						tempMap.put("login",lRetVal.get("username"));
						tempString	=	mapper.writeValueAsString(tempMap);
						log.info("this is here"+tempMap);
						result 	=	startandstopEmaillistener(request,response,tempString);
					}
					new CacheManagerHelper().deleteCache("ClickToTalkRules-"+requestMap.get("clientId").trim());
				}
			}
			
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Exception :: "+e.getMessage(),e);
		}
		
		
		return result;
	}
	
}