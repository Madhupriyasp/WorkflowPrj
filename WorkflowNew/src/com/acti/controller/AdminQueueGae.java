package com.acti.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.net.URLDecoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.acti.DTO.Transcripts;
import com.acti.JDO.AccountsJDO;
import com.acti.service.CacheManagerHelper;
import com.acti.service.FullHistoryService;
import com.acti.service.LoginService;
import com.acti.service.TranscriptServiceHelper;
import com.acti.util.CommonUtilities;
import com.acti.util.JdoUtil;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONObject;


@Controller
public class AdminQueueGae
{
	private static final Logger log = Logger.getLogger(AdminQueueGae.class.getName()) ;
	private static final long HOUR  = 60*60 *1000;
	@RequestMapping(value="/getAllArInteractionsNew/{fromDate}/{toDate}/{cursor}/{status}/{cacheflag}",method=RequestMethod.POST)
	public @ResponseBody String getTransctriptFromGAENEW(String responseBody, @PathVariable("fromDate") String fromdate,@PathVariable("toDate") String todate,@PathVariable("cursor") String cursorString,@PathVariable("status") String status,@PathVariable("cacheflag") String cacheflag,HttpSession session,HttpServletResponse response,HttpServletRequest request,Model model ) throws JsonGenerationException, JsonMappingException, IOException

	{	
		ArrayList<String> fetchAccountNumbersList = new ArrayList<String>();
		String tempResult   =   "";
		String internalflag	=	request.getParameter("internal");
		String accNo		=	request.getParameter("accNo");
		boolean	 fetchFlag	=	false;

		if (accNo != "null" && accNo != null && accNo !="")

		{
			fetchFlag = true;
			ObjectMapper mapper = new ObjectMapper();
		    fetchAccountNumbersList = new ArrayList<String>();
		    TypeReference<ArrayList<String>> typeRef = new TypeReference<ArrayList<String>>() {};
			fetchAccountNumbersList = mapper.readValue(accNo, typeRef);		
//			accNo = accNo.substring(2, accNo.length()-2);
//			accNo = accNo.replace("\"","");
//			accNo = accNo.replace(" ","");
		}

		TranscriptServiceHelper transcriptService	= new TranscriptServiceHelper();
		try
		{
		tempResult = transcriptService.transcriptsdataNew(fromdate,todate,status,fetchFlag,fetchAccountNumbersList, internalflag, response);
		if(tempResult.equalsIgnoreCase("{}"))
		{
			return "no data for this time range";
		}
		else
		{
			return tempResult;
		}
		}
		catch(Exception e)
		{
		e.printStackTrace();	
		log.info("some exception happened in getting tempresult"+e.getMessage());
		tempResult = "no data for this time range";
		}
		return tempResult;
	}
	@RequestMapping(value="/sendrescheduleinfo/{connid}/{time}",method=RequestMethod.GET)
	public @ResponseBody String sendrescheduleinfo(@PathVariable("connid") String connid,@PathVariable("time") String time,HttpSession session,HttpServletResponse response,Model model )
	{
		StringBuilder writerB					=		new StringBuilder();
		String sendMail 	=	"harikrishna.srinivasarao@a-cti.com";
		String userID		=(String) session.getAttribute("username");
		writerB.append("Connection Id" );
		writerB.append(",");
		writerB.append("Rescheduled By" );
		writerB.append(",");
		writerB.append("Rescheduled Time" );
		writerB.append(",");
		log.info("the connection id is---->"+connid);
		log.info("the rescheduled by is--->"+userID);
		log.info("the time when it was rescheduled is--->"+time);
		writerB.append( "\r\n" );
		writerB.append(connid);
		writerB.append(",");
		writerB.append(userID);
		writerB.append(",");
		writerB.append(time);
		writerB.append(",");
		String bvalue = writerB.toString();
		
		log.info("the bytes are----->"+bvalue);

		log.info("without converting it to string"+sendMail);
		try {
			sendBillMail("The Rescheduling Detail is attached in email",bvalue,"Rescheduling_details.csv",sendMail.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "success";
	}
	
	public ArrayList getInternalAccounts()
	{
		HashMap accounts						=	null;
		String accountDetails					=	null;
		ObjectMapper	objectmapper			=	null;
		ArrayList<String> internalAccounts		=	null;
		
		try
		{
			objectmapper			=	new ObjectMapper();
			
			accountDetails			=	getAccounts();
			accounts				=	objectmapper.readValue(accountDetails, HashMap.class);
			
			internalAccounts		=	(ArrayList) accounts.get("internal");
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Error"+e.getMessage(),e);
			return null;
		}
		return internalAccounts;
	}
	
	@RequestMapping(value="/getAccountsToDB",method=RequestMethod.GET)
	public @ResponseBody String getAccounts()
	{
		String getAccountDetailsKeyInternal	= "accounttype-details";
		
		List<AccountsJDO> accDB	= null;
		PersistenceManager pm	= null;
		Query query				= null;
		HashMap<String,ArrayList<String>> accMap = new HashMap<String, ArrayList<String>>();
		ArrayList<String> iAcc	=	new ArrayList<String>();
		ArrayList<String> eAcc	=	new ArrayList<String>();
		String result			=	null;
		
		try
		{
			result 				=	new CacheManagerHelper().getrawcache(getAccountDetailsKeyInternal);
			
			if(result != null && !result.trim().equals(""))
			{
				return result;
			}
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Error"+e.getMessage(),e);
			return "Failure";
		}
		
		try
		{
			pm 		= JdoUtil.get().getPersistenceManager();
			query   = pm.newQuery(AccountsJDO.class);
			accDB	= (List<AccountsJDO>) query.execute();

			for(AccountsJDO accjdo:accDB)
			{
				if(accjdo.getType().trim().equalsIgnoreCase("internal"))
					iAcc.add(accjdo.getClientId());
				else if(accjdo.getType().trim().equalsIgnoreCase("external"))
					eAcc.add(accjdo.getClientId());
				else
					log.info("are u seriously kidding me !!! "+accjdo.getClientId()+" :: "+accjdo.getType());
			}
			accMap.put("internal", iAcc);
			accMap.put("external", eAcc);

			StringWriter strWriter = new StringWriter();
			new ObjectMapper().writeValue(strWriter, accMap);
			result = strWriter.toString();
			
			if(result != null && !result.trim().equals(""))
			{
				new CacheManagerHelper().setCacheAsBytes(result.getBytes(), getAccountDetailsKeyInternal);
			}
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Error"+e.getMessage(),e);
			return "Failure";
		}
		return result;
	}

	public void sendBillMail(String sMessage,String sFileContent, String sFileName,String mailId) throws IOException
	{
		log.info("Inside the SendMail");
		log.info("the string message is--->"+sMessage);
		//log.info("the string content is--->"+sFileContent);
		log.info("the string filename is--->"+sFileName);
		log.info("the string mail is--->"+mailId);

		String mode = null;
		Session session = Session.getDefaultInstance(null);
		session.setDebug(true);

		Multipart mp = new MimeMultipart();
		String FileExtention = sFileName.substring(sFileName.lastIndexOf('.') + 1);

		try 
		{
			mode = new ModeUtil().getMode();
			Message msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress("vishwanath.kannan@a-cti.com","Rescheduling Details"));

			if ("LIVE".equalsIgnoreCase(mode))
			{
				msg.addRecipient(Message.RecipientType.TO, new InternetAddress(mailId, "Rescheduling Details"));
				msg.setSubject("Rescheduling Details");
			} 
			else 
			{
				msg.addRecipient(Message.RecipientType.TO, new InternetAddress(mailId, "Rescheduling Details"));
				msg.setSubject("Staging Rescheduling Details");
			}

			MimeBodyPart htmlPart = new MimeBodyPart();
			htmlPart.setContent(sFileContent, "text/html");
			

			mp.addBodyPart(htmlPart);
			log.info("the body of the mail is--->"+mp);
			msg.setContent(mp);

			Transport.send(msg);
		} 
		catch (AddressException e) 
		{
			e.printStackTrace();
		} 
		catch (MessagingException e) 
		{
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value="/addAccountsToDB/{type}/{value}",method=RequestMethod.GET)
	public @ResponseBody String addAccounts(@PathVariable(value="type")String acctype,@PathVariable(value="value")String value,@RequestParam(value="csv",required =false) String csv)
	{
		boolean csvtype 		= false;
		List<AccountsJDO> accDB	= new ArrayList<AccountsJDO>();
		PersistenceManager pm	= null;
		String getAccountDetailsKeyInternal	= "accounttype-details";
		try
		{
			pm 		= JdoUtil.get().getPersistenceManager();
			if(csv == null || csv.trim().equalsIgnoreCase("null") || csv.trim().equalsIgnoreCase("undefined") || csv.trim().equalsIgnoreCase(""))
			{
				csv = "false";
			}
			csvtype	=	Boolean.valueOf(csv);

			if(csvtype)
			{
				String[] accNos = value.split(",");
				for(String accNo : accNos)
				{
					AccountsJDO accjdo	=	new AccountsJDO();
					accjdo.setType(acctype);
					accjdo.setClientId(accNo);
					accDB.add(accjdo);
				}
			}
			else
			{
				AccountsJDO accjdo	=	new AccountsJDO();
				accjdo.setType(acctype);
				accjdo.setClientId(value);
				accDB.add(accjdo);
			}
			pm.makePersistentAll(accDB);
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Error"+e.getMessage(),e);
			return "Failure";
		}
		finally
		{
			if(pm != null)
				pm.close();
		}
		try
		{
			new CacheManagerHelper().deleteCache(getAccountDetailsKeyInternal);
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"exception in clearing cache for internal Account"+e.getMessage(),e);
			return "Failure";
		}
		return "Success";}
	@RequestMapping(value="/getDomainNames",method=RequestMethod.GET)
	public @ResponseBody String getDomainNames(@RequestParam("reqarray") String reqarray)
	{
		log.info("getDomainNames"+reqarray);
		ModeUtil lModeUtil 							= 	null;
		HashMap<String,Object> mapData				=	null;
		String responseString						=	null;
		String url									=	null;
		ObjectMapper objectmapper					=  	 null;
		String senderJson							=	"";
		String finalResponse						=	null;
		String mode									=	null;
		HashMap<String,String> getAccountDet 		=	new HashMap<String, String>();
		String subAccountNumber						=	"";
		HashMap<String,Object>	subAccountMap		=	null;
		try
		{
			lModeUtil 						= 	new ModeUtil();
			objectmapper					=   new ObjectMapper();
			mapData							=	new HashMap<String,Object>();
			List<String> clientidList 		=   objectmapper.readValue(reqarray, new TypeReference<ArrayList<String>>(){});
				
 				log.info("Client id we got"+clientidList+"and size"+clientidList.size());
 				for(String subAccNo : clientidList)
				  {
						 log.info("size of tResult::"+clientidList);
						 senderJson		   +=	subAccNo +',';
						 subAccountNumber	= 	senderJson.substring(0, senderJson.lastIndexOf(","));
				  }
				  log.info("subAccountNumber after removing last comma::"+subAccountNumber);
				mode = lModeUtil.getMode();
				if(mode.equalsIgnoreCase("live"))
				{
					url = ResourceBundle.getBundle("ApplicationResources").getString("live.cms.url");
				}
				else
				{
					url = ResourceBundle.getBundle("ApplicationResources").getString("staging.cms.url");
				}
				url =url+"/getClientObjects?subAccountNumber="+subAccountNumber;	
					
				log.info("url here::"+url);
				responseString = new URLFetch().httpUrlFetchGET(url);
				subAccountMap	=	objectmapper.readValue(responseString, new TypeReference<HashMap<String,Object>>(){});
				mapData	= (HashMap<String, Object>) subAccountMap.get("subAccountMap");
					 
				log.info("mapdata::"+mapData);
					
				String getdomainname = "";
				for (Map.Entry<String, Object> entry : mapData.entrySet()) 
				{
					HashMap<String,Object> detailMap 	=	(HashMap<String, Object>) entry.getValue();
					getAccountDet.put(String.valueOf(entry.getKey()), String.valueOf(detailMap.get("domainName")));
				}
				finalResponse = objectmapper.writeValueAsString(getAccountDet);
				log.info("print this final response ::"+finalResponse);
		}
		catch (Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
		}
		return  finalResponse;
	}
	
//	@RequestMapping(value="/getDomainNamesBasedOnCache",method=RequestMethod.POST)
//	public @ResponseBody String getDomainNamesFromCache(@RequestParam("reqarray") String reqarray )
//	{
//		HashMap<String,String> receivedfromdbMap			=	new HashMap<String,String>();
//		HashMap<String, String> responseMap					=	null;
//		String responseString				=	null;
//		ObjectMapper objectmapper			=   null;
//		String 		senderJson				=	null;
//		Writer 		strWriter 				=	null;
//		ArrayList<String> clientIds			=	null;
//		ArrayList<String> notPresentInCache =   null;
//		CacheOperationController ccutil		=	null;
//		String cresult						=	null;
//		TypeReference<HashMap<String, String>> obj = null;
//		
//		try
//		{
//			objectmapper					=   new ObjectMapper();
//			ccutil							=	new CacheOperationController();
//			notPresentInCache				=	new ArrayList<String>();
//			
//			clientIds				 		=   objectmapper.readValue(reqarray, new TypeReference<ArrayList<String>>() {});
//			responseMap						=	new HashMap<String, String>();
//			obj 							=	new TypeReference<HashMap<String,String>>() {};
//			log.info("Client IDs : " + clientIds);
//			for(String clientId : clientIds)
//			{
//				cresult		=	ccutil.getcachenewApi(clientId);
//				if( cresult != null &&  !"null".equalsIgnoreCase(cresult) && !cresult.trim().equalsIgnoreCase("nodata") )
//				{
//					responseMap.put(clientId, cresult);
//				}
//				else
//				{
//					notPresentInCache.add(clientId);
//				}
//			}
//			
//			if(notPresentInCache.size()>0)
//			{
//				strWriter 		=	new StringWriter();
//				objectmapper.writeValue(strWriter, notPresentInCache);
//				senderJson		=	strWriter.toString();
//				String domainResposne = getDomainNames(senderJson);
//				log.info("Response : " + domainResposne);
//				try
//				{
//					if(domainResposne == null || "".equalsIgnoreCase(domainResposne) ||  " ".equalsIgnoreCase(domainResposne) || "null".equalsIgnoreCase(domainResposne))
//					{	
//					    for (String x : notPresentInCache)
//					    {
//					    	System.out.println(x);
//					    	receivedfromdbMap.put(x, "");
//					    }
//					}
//					else
//					{
//						receivedfromdbMap =	objectmapper.readValue(domainResposne, obj);
//					}
//				}
//				catch(Exception e)
//				{
//					log.log(java.util.logging.Level.SEVERE," "+e.getMessage(),e);
//				}
//				
//				if(receivedfromdbMap !=null)
//				{
//					for(String clientId: notPresentInCache)
//					{
//						responseMap.put(clientId, receivedfromdbMap.get(clientId));
//					}
//				}
//			}
//			strWriter			=	new StringWriter();
//			objectmapper.writeValue(strWriter, responseMap);
//			responseString		=	strWriter.toString();
//			log.info("Client IDs : " + clientIds + " fromcache : " + responseMap + " response string : " + responseString);
//		}
//		catch (Exception e)
//		{
//			log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
//		}
//		return responseString;
//	}
	
	
	@RequestMapping(value="/getDomainNamesBasedOnCache",method=RequestMethod.POST)

	public @ResponseBody String getDomainNamesFromCache(@RequestParam("reqarray") String reqarray )
	{
	HashMap<String,String> receivedfromdbMap	 =	new HashMap<String,String>();
	HashMap<String, String> responseMap	 =	null;
	String responseString	 =	null;
	ObjectMapper objectmapper	 =   null;
	String senderJson	 =	null;
	Writer strWriter =	null;
	ArrayList<String> clientIds	 =	null;
	ArrayList<String> notPresentInCache =   null;
	CacheOperationController ccutil	 =	null;
	String cresult	 =	null;
	TypeReference<HashMap<String, String>> obj = null;
	try
	{
	objectmapper	 =   new ObjectMapper();
	ccutil	 =	new CacheOperationController();
	notPresentInCache	 =	new ArrayList<String>();
	clientIds	 =   objectmapper.readValue(reqarray, new TypeReference<ArrayList<String>>() {});
	responseMap	 =	new HashMap<String, String>();
	obj =	new TypeReference<HashMap<String,String>>() {};
	log.info("Client IDs : " + clientIds);
	for(String clientId : clientIds)
	{
		ObjectMapper mapper  = new ObjectMapper();
		try
		{
			cresult	 =	mapper.readValue(ccutil.getcachenewApi(clientId),String.class);
		}
		catch(Exception e)
		{
			log.info("exception happened in getting the domain name. Adding to get from CMS list instead of hardcoding to NA");
			notPresentInCache.add(clientId);
			cresult = "NA";
		}
		if( cresult != null &&  !"null".equalsIgnoreCase(cresult) && !cresult.trim().equalsIgnoreCase("nodata") )
		{
			responseMap.put(clientId, cresult);
		}	
		else
		{
			notPresentInCache.add(clientId);
		}
	}	
	if(notPresentInCache.size()>0)
	{
		strWriter =	new StringWriter();
		objectmapper.writeValue(strWriter, notPresentInCache);
		senderJson	 =	strWriter.toString();
		String domainResposne = getDomainNames(senderJson);
		log.info("Response : " + domainResposne);
		try
		{
			if(domainResposne == null || "".equalsIgnoreCase(domainResposne) ||  " ".equalsIgnoreCase(domainResposne) || "null".equalsIgnoreCase(domainResposne))
			{
				for (String x : notPresentInCache)			
				{
					System.out.println(x);
					receivedfromdbMap.put(x, "");
				}
			}	
			else
			{	
				receivedfromdbMap =	objectmapper.readValue(domainResposne, obj);
			}
		}
		catch(Exception e)	
		{
			log.log(java.util.logging.Level.SEVERE," "+e.getMessage(),e);
		}	
		if(receivedfromdbMap !=null)
		{
			for(String clientId: notPresentInCache)
			{
				responseMap.put(clientId, receivedfromdbMap.get(clientId));
				if(receivedfromdbMap.get(clientId) == null || "null".equalsIgnoreCase(receivedfromdbMap.get(clientId)) || "na".equalsIgnoreCase(receivedfromdbMap.get(clientId)) || "".equalsIgnoreCase(receivedfromdbMap.get(clientId).trim()) )
				{
					new CacheManagerHelper().setCache("NA", clientId);
				}
				else
				{
					String addString = receivedfromdbMap.get(clientId);
					if( null == addString)
					{
						addString = "NA";
					}
					new CacheManagerHelper().setCache(addString, clientId);
				}
				log.info("successfully done setting this key in cache, becaue it was fetched from DB ::"+clientId);
			}
		}
	}
	strWriter	 =	new StringWriter();
	objectmapper.writeValue(strWriter, responseMap);
	responseString	 =	strWriter.toString();
	log.info("Client IDs : " + clientIds + " fromcache : " + responseMap + " response string : " + responseString);
	}
	catch (Exception e)
	{
		log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
	}
	return responseString;
	}


	
	@RequestMapping(value="/triggerActiveResponse",method=RequestMethod.POST)
	public @ResponseBody String triggerActiveResponse(@RequestParam(value="arObj") String arObj )
	{
		
		String 		url						=	null;
		ModeUtil 	lModeUtil 				= 	null;
		String 		responseString			=	"";
		try
		{
			lModeUtil						=	new ModeUtil();
			log.info("soming inside------->"+arObj);
			url								=	lModeUtil.getArTriggerUrl();
			responseString					=	new URLFetch().urlFetchPOST(arObj, url);
			log.info("the response obtained is---->"+responseString);
		}
		catch (Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
			return "failure";
		}
		return responseString;
	}
	@RequestMapping(value="/markCompleted",method=RequestMethod.POST)
	public @ResponseBody String markCompleted(@RequestParam(value="compStr") String compStr )
	{
		String 		url						=	null;
		ModeUtil 	lModeUtil 				= 	null;
		String		responseString			=	null;
		ObjectMapper objMapper				=	null;
		HashMap		reqMap					=	null;
		String 		connId					=	"";
		String 		agent					=	"";
		try
		{
			objMapper		=	new ObjectMapper();
			reqMap			=	new HashMap();
			reqMap			=	objMapper.readValue(compStr,HashMap.class);
			connId			=	(String) reqMap.get("connectionId");
			agent			=	(String) reqMap.get("agentLogin");
			lModeUtil						=	new ModeUtil();
			log.info("coming inside to complete------->"+compStr);
			url								=	lModeUtil.getWebchatUrlByMode()+"/livechat/updatearcompleted/"+new Date().getTime()+"?connectionid="+connId+"&agentLogin="+agent;
			log.info("the url going to be requested is--->"+url);
			responseString					=	new URLFetch().httpUrlFetchGET(url);
			log.info("the response obtained is---->"+responseString);
		}
		catch (Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
			return "failure";
		}
		return responseString;
	}
	@RequestMapping(value="/updateInteractionStatus",method=RequestMethod.POST)
	public @ResponseBody String updateInteractionStatus(@RequestParam(value="compStr") String compStr ,HttpSession session)
	{
		String 		url						=	null;
		ModeUtil 	lModeUtil 				= 	null;
		String		responseString			=	null;
		ObjectMapper objMapper				=	null;
		HashMap		reqMap					=	null;
		String 		peopleId				=	"SYSTEM";
		HashMap<String,String>	interData	=	new HashMap<String,String>();	
		
		try
		{
			HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
			log.info("login map"+ lRetVal);
			if(lRetVal.containsKey("peopleID"))
			{
				peopleId	=	String.valueOf(lRetVal.get("peopleID"));
			}
			objMapper		=	new ObjectMapper();
			reqMap			=	new HashMap();
			reqMap			=	objMapper.readValue(compStr,HashMap.class);
			interData.put("connectionId", String.valueOf(reqMap.get("connectionId")));
			interData.put("agentPin", peopleId);
			interData.put("interactionId", String.valueOf(reqMap.get("interactionId")));
			interData.put("subAccountNumber", String.valueOf(reqMap.get("subAccountNumber")));
			interData.put("scheduledTime", String.valueOf(reqMap.get("scheduledTime")));
			interData.put("status", String.valueOf(reqMap.get("status")));
			interData.put("currentStatus", String.valueOf(reqMap.get("currentStatus")));
			lModeUtil						=	new ModeUtil();
			url								=	lModeUtil.getArCoreEngineURLByMode()+"/updateARInteractionStatus";
			String	jsonString				=	new ObjectMapper().writeValueAsString(interData);
			responseString					=	new URLFetch().urlFetchPOST(jsonString, url);
			log.info("the response obtained is---->"+responseString);
		}
		catch (Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
			return "failure";
		}
		return responseString;
	}
	@RequestMapping(value="/markDeleted",method=RequestMethod.POST)
	public @ResponseBody String markDeleted(@RequestParam(value="deleteStr") String deleteStr )
	{
		String 		url						=	null;
		ModeUtil 	lModeUtil 				= 	null;
		String		responseString			=	null;
		ObjectMapper objMapper				=	null;
		HashMap		reqMap					=	null;
		String 		connId					=	"";
		String 		agent					=	"";
		try
		{
			objMapper		=	new ObjectMapper();
			reqMap			=	new HashMap();
			reqMap			=	objMapper.readValue(deleteStr,HashMap.class);
			connId			=	(String) reqMap.get("connectionId");
			agent			=	(String) reqMap.get("agentLogin");
			lModeUtil						=	new ModeUtil();
			log.info("coming inside to complete------->"+deleteStr);
			url								=	lModeUtil.getWebchatUrlByMode()+"/livechat/updateardeleted/"+new Date().getTime()+"?connectionid="+connId+"&agentLogin="+agent;
			log.info("the url going to be requested is--->"+url);
			responseString					=	new URLFetch().httpUrlFetchGET(url);
			log.info("the response obtained is---->"+responseString);
		}
		catch (Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
			return "failure";
		}
		return responseString;
	}
	@RequestMapping(value="/toolsmanager",method=RequestMethod.GET)
	public String LoginRedirect(HttpSession session , HttpServletRequest request , HttpServletResponse response , Model model)
	{
		log.info("inside emaillistener controller login map");
		HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
		ObjectMapper mapper = new ObjectMapper();
		ModeUtil 	lModeUtil 				= 	null;
		try {
			lModeUtil						=	new ModeUtil();
			String fetch_flag	 = request.getParameter("fetch");
			String fetch_accno	 = request.getParameter("accno");
			lModeUtil	 =	new ModeUtil();
			model.addAttribute("mode", lModeUtil.getMode());
			model.addAttribute("fetch_flag", fetch_flag);
			model.addAttribute("fetch_accno", fetch_accno);
			model.addAttribute("timezone",new LoginService().getCurrentTimeZone());
			log.info("loginMap is:"+mapper.writeValueAsString(lRetVal));
		} catch (Exception e) 
		{
			log.info("Exception in getting toolsmanager ::"+e.getMessage());
		}
		if ( lRetVal == null )
		{
			log.info( "SESSION INVALID" );
			StringBuffer redirectUrlStringBuffer = request.getRequestURL();
			if( request.getQueryString() != null )
				redirectUrlStringBuffer.append( request.getQueryString() ); 
			return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;
		}
		return "ToolsAccManager";
	}
	
	@RequestMapping(value = "/getCSVOfCurrentData", method = RequestMethod.POST)
	public void getCsvCurrentData(@RequestParam("dataToBeSent") String data, HttpServletResponse response) 
	{	
		ObjectMapper mapper 								= new ObjectMapper();
		TypeReference<HashMap<Object, Object>> ref2 		= new TypeReference<HashMap<Object, Object>>() {};
		List<HashMap<String, Object>> currentDataList		= null;
		String fromDate										= "";
		String toDate										= "";
		String timeZone										= "";
		String accountID 									= "";
		String accountName 									= "";
		String receivedBy									= "";
		String receivedDate									= "";
		String completedDate								= "";
		String timeTakenToAnswer							= "";
		String duration										= "";
		String timeTakenToComplete							= "";
		String status										= "";
		String interactionType								= "";
		Long ansTime										= 0l;
		Long compTime										= 0l;
		Long timeSpent										= 0l;
		
		List<HashMap<String, Object>> interactionHistory 	= null;
		DateFormat df2 										= new SimpleDateFormat("dd MMM yyyy HH:mm:ss"); 
		OutputStream outputStream							= null;
		StringBuilder writer 								= new StringBuilder();
		String fileName										= "";
		String outputResult									= "";
		try
		{
			data 											= URLDecoder.decode(data, "UTF-8");
			HashMap<Object, Object> dataMap 				= mapper.readValue(data, ref2);
			currentDataList									= (List<HashMap<String, Object>>) dataMap.get("data");
		
			fromDate										= String.valueOf(dataMap.get("fromDate"));
			toDate											= String.valueOf(dataMap.get("toDate"));
			timeZone										= String.valueOf(dataMap.get("timeZone"));
			interactionType									= String.valueOf(dataMap.get("interactionType"));
			
			writer.append(",");
			writer.append("From");
			writer.append(",");
			writer.append(fromDate);
			writer.append(",");
			writer.append("To");
			writer.append(",");
			writer.append(toDate);
			writer.append("\n");
			writer.append("\n");
			
			writer.append("Account ID");
			writer.append(",");
			writer.append("Account Name");
			writer.append(",");
			writer.append("Received By");
			writer.append(",");
			writer.append("Status");
			writer.append(",");
			
			if(timeZone != null && timeZone.equalsIgnoreCase("PDT"))
			{
				writer.append("Received PDT");
				writer.append(",");
				writer.append("Completed PDT");
				writer.append(",");
			}
			else if(timeZone != null && timeZone.equalsIgnoreCase("PST"))
			{
				writer.append("Received PST");
				writer.append(",");
				writer.append("Completed PST");
				writer.append(",");
			}
		
			writer.append("TTA");
			writer.append(",");
			writer.append("Duration");
			writer.append(",");
			writer.append("TTC");
			
			writer.append("\n");

			long timeZoneOffset 		= 0;
			if(timeZone != null && timeZone.equalsIgnoreCase("PDT"))
			{
				timeZoneOffset 			= 420*60000;
			}	
			else if(timeZone != null && timeZone.equalsIgnoreCase("PST"))
			{
				timeZoneOffset 			= 480*60000;
			}	
			long tZOffset				= TimeZone.getDefault().getOffset(Calendar.ZONE_OFFSET);
			long dstOffset				= TimeZone.getDefault().getDSTSavings();
			tZOffset 					= tZOffset + dstOffset;
			long offset					= timeZoneOffset + tZOffset;
			
			for(HashMap<String, Object> map : currentDataList)
			{
				try{
					accountID 				= (String) map.get("subAccountNumber");
					accountName 			= (String) map.get("domain");
					receivedBy 				= (String) map.get("AgentLogin");
					
					if(accountName == null || accountName == "null")
						accountName 		= "NA";
					if(receivedBy != null && receivedBy.equalsIgnoreCase("na"))
						receivedBy 			= "NA";
					
					interactionHistory 		= (ArrayList<HashMap<String, Object>>) map.get("interactionHistory");
					status					= (String) map.get("action");
					int size 				= interactionHistory.size();
					duration 				= "NA";
					Long recDate 			= Long.parseLong(interactionHistory.get(0).get("date").toString()) - offset;
					Long compDate 			= Long.parseLong(interactionHistory.get(size-1).get("date").toString()) - offset;
					receivedDate			= df2.format(new Date(recDate));
			
					if(map.get("AnsTime") != null && !String.valueOf(map.get("AnsTime")).equalsIgnoreCase("null") && !String.valueOf(map.get("AnsTime")).equalsIgnoreCase(""))
					{
						ansTime 			= Long.parseLong(String.valueOf(map.get("AnsTime"))) * 1000;
						timeTakenToAnswer	= CommonUtilities.getTimeInFormat(ansTime);
					}
					else
					{
						timeTakenToAnswer	= "NA";
					}
					if(ansTime <= 0 && "SBChat".equalsIgnoreCase(interactionType))
					{
						timeTakenToAnswer = "NA";
					}
						
					if(map.get("TimeToComplete") != null && !String.valueOf(map.get("TimeToComplete")).equalsIgnoreCase("null") && !String.valueOf(map.get("TimeToComplete")).equalsIgnoreCase(""))
					{
						compTime 			= Long.parseLong(String.valueOf(map.get("TimeToComplete")));
						timeTakenToComplete = CommonUtilities.getTimeInFormat(compTime);
					}
					else
					{
						timeTakenToComplete	= "NA";
					}
					if(status.contains("InQueue(IR)") || status.contains("system") || status.contains("queued") || status.contains("Waiting(IR)") || status.contains("Scheduled"))
					{
						completedDate		= "NA";
						timeTakenToAnswer	= "NA";
						timeTakenToComplete	= "NA";
					}	
					else if(status.contains("In Progress") || status.contains("delivered") || status.contains("Answered"))
					{
						completedDate		= "NA";
						timeTakenToComplete	= "NA";
					}
					else if(status.contains("Completed") || status.contains("Completed-Resolved") || status.contains("Completed-F8") || status.contains("closed") || status.contains("Callended") || status.contains("Dialout"))
					{
						completedDate		= df2.format(new Date(compDate));
						timeSpent			= Long.parseLong(String.valueOf(map.get("TimeSpent"))) * 1000;
						duration 			= CommonUtilities.getTimeInFormat(timeSpent);
					}	
					else if(status.contains("Deleted"))
					{	
						completedDate		= df2.format(new Date(compDate));
						timeTakenToAnswer	= "NA";	
					}
					if(status.contains("closed"))
						timeTakenToAnswer	= "NA";
					
					writer.append(accountID);
					writer.append(",");
					writer.append(accountName);
					writer.append(",");
					writer.append(receivedBy);
					writer.append(",");
					writer.append(status);
					writer.append(",");
					writer.append(receivedDate);
					writer.append(",");
					writer.append(completedDate);
					writer.append(",");
					writer.append(timeTakenToAnswer);
					writer.append(",");
					writer.append(duration);
					writer.append(",");
					writer.append(timeTakenToComplete);
					writer.append("\n");
				}
				catch(Exception e)
				{
					log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(),e);
				}	
			}
			
			fileName 					= "Report_"+interactionType+"_"+ new Date().getTime()+".csv";
			response.setContentType("text/csv");
			response.setHeader("Content-Disposition", "attachment; filename="+fileName);
			outputStream 				= response.getOutputStream();
			outputResult 				= writer.toString();
			outputStream.write(outputResult.getBytes());
			outputStream.flush();
			outputStream.close(); 
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,"exceptions occured "+e.getMessage(), e);
		}	
	}
	
	
	
	
	//pikachu remove this test part
	
	
	@RequestMapping(value="/testPage",method=RequestMethod.GET)
	public String testRedirect(HttpSession session , HttpServletRequest request , HttpServletResponse response , Model model)
	{
		log.info("inside emaillistener controller login map");
		HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
		ObjectMapper mapper = new ObjectMapper();
		ModeUtil 	lModeUtil 				= 	null;
		try {
			lModeUtil						=	new ModeUtil();
			model.addAttribute("mode", lModeUtil.getMode());
			log.info("loginMap is:"+mapper.writeValueAsString(lRetVal));
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if ( lRetVal == null )
		{
			log.info( "SESSION INVALID" );
			StringBuffer redirectUrlStringBuffer = request.getRequestURL();
			if( request.getQueryString() != null )
				redirectUrlStringBuffer.append( request.getQueryString() ); 
			return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;
		}
		return "testComet";
	}
	@RequestMapping(value = "/getChatTranscriptsCSV", method=RequestMethod.POST)
	public void generateCSVOfChatTranscripts(HttpServletRequest req, HttpServletResponse response, @RequestParam("jsonData") String jsonData)
	{
		ObjectMapper mapper = new ObjectMapper();
		TypeReference<HashMap<String, Object>> objRef = new TypeReference<HashMap<String, Object>>(){};
		TypeReference<List<HashMap<String, String>>> objRefChat = new TypeReference<List<HashMap<String, String>>>(){};
		PersistenceManager pm = null;
		try 
		{
			HashMap<String, Object> map = mapper.readValue(jsonData, objRef);
			ArrayList<String> accNoList = (ArrayList<String>) map.get("accountNumberList");
			String fromdate				= String.valueOf(map.get("fromDate"));
			String todate				= String.valueOf(map.get("toDate"));
			
			Date fromDate;
			Date toDate;
			List<String> listOfSubaccNos = new ArrayList<String>();
			DateFormat d				= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
			DateFormat df 				= new SimpleDateFormat("MM/dd/yyyy hh:mm");
			Query query;
			OutputStream outputStream	= null;
			StringBuilder writer	 	= new StringBuilder();
			List<Transcripts> transcriptsList = new ArrayList<Transcripts>();
			try
			{
				todate    		= 		todate.trim() + " 23:59";
				fromdate	 	= 		fromdate.trim() + " 00:00";
				fromDate 		= 		df.parse(fromdate);				
				fromDate		=		new Date(fromDate.getTime() + 9*HOUR);
				log.info("the acc no : " + accNoList);
				log.info("FROM date after parse : " + fromDate);
				
				toDate 			= 		df.parse(todate);				
				toDate			=		new Date(toDate.getTime() + 9*HOUR);
				Calendar from = Calendar.getInstance();
				Calendar to = Calendar.getInstance();
				from.setTime(fromDate);
				to.setTime(toDate);
				
				log.info("TO date after parse : " + toDate);
				
				writer.append("Account Number");
				writer.append(",");
				
				writer.append("Interaction Id");
				writer.append(",");
				
				writer.append("Agent Login");
				
				writer.append(",");
				writer.append("Start Time");
				
				writer.append(",");
				writer.append("End Time");
				
				writer.append(",");
				writer.append("Duration");
				
				writer.append(",");
				writer.append("Source");
				
				writer.append(",");
				writer.append("Messages");
				
				writer.append("\n");
				
				if(accNoList != null  && accNoList.size() > 0)
				{
					ArrayList<HashMap<String, Object>>transcriptArrayList = new FullHistoryService().getQualifiedInteractionFromFullHistoryDB(from, to, accNoList.get(0));
					if(transcriptArrayList != null && transcriptArrayList.size() > 0)
					{
						for(HashMap<String, Object> transcriptsMap : transcriptArrayList)
						{
							String accountNumber = (String)transcriptsMap.get("accountNumber");
							String interactionId = (String)transcriptsMap.get("interactionId");
							Long start = 0l;
							Long end = 0l;
							Date startDate = new Date();
							Date endDate = new Date();;
							String agentLogin = "";
							String chatString = "";
							String sourceUrl = "";
							
							List<HashMap<String, String>> chatList = new ArrayList<HashMap<String, String>>();
							ArrayList<HashMap<String, Object>> interactionStatusList = (ArrayList<HashMap<String, Object>>) transcriptsMap.get("interactionStatusList");
							for(int i=0; i<interactionStatusList.size(); i++)
							{
								HashMap<String, Object> interactionStatusMap = interactionStatusList.get(i);
								String agentLoginTemp = (String) interactionStatusMap.get("userId");
								
								if(agentLoginTemp != null && !agentLoginTemp.equalsIgnoreCase("system") && !agentLoginTemp.equalsIgnoreCase("visitor") && !agentLoginTemp.equalsIgnoreCase("") && !agentLoginTemp.equalsIgnoreCase("null"))
								{
									agentLogin = agentLoginTemp;
								}
									
								String status = (String) interactionStatusMap.get("status");
								if(status != null && (status.equalsIgnoreCase("invited") || status.equalsIgnoreCase("queued")))
								{
									String startTime = (String)interactionStatusMap.get("dateAddedInMillisecond");
									start = Long.parseLong(startTime);
									startDate.setTime(start);
								}
								if(status != null && status.equalsIgnoreCase("closed"))
								{
									String endTime = (String)interactionStatusMap.get("dateAddedInMillisecond");
									end = Long.parseLong(endTime);
									endDate.setTime(end);
								}
								
								if(status != null && status.equalsIgnoreCase("closed"))
								{
									ArrayList<HashMap<String, Object>> interactionInfoJDOList = (ArrayList<HashMap<String, Object>>) interactionStatusMap.get("interactionInfoJDOList");
									for(HashMap<String, Object> interactionInfoJDOMap : interactionInfoJDOList)
									{
										String title = (String) interactionInfoJDOMap.get("title");
										if(title != null && title.equalsIgnoreCase("sourceUrl"))
										{
											sourceUrl = (String) interactionInfoJDOMap.get("value");
										}
										if(title != null && title.equalsIgnoreCase("contactinfo"))
										{
											chatString = (String) interactionInfoJDOMap.get("value");
											if(chatString != null)
											{
												chatList = mapper.readValue(chatString, objRefChat);
											}
										}
									}
								}
							}
							writer.append(accountNumber);
							writer.append(",");
							writer.append(interactionId);
							writer.append(",");
							writer.append(agentLogin);
							writer.append(",");
							writer.append(startDate);
							writer.append(",");
							writer.append(endDate);
							writer.append(",");
							
							Long duration = end - start;
							duration = (duration <  0l) ? 0l : duration/1000l;
							writer.append(duration);
							writer.append(",");
							
							writer.append(sourceUrl);
							writer.append(",");
							
							for(int x=0; x<chatList.size();x++)
							{
								HashMap<String, String> chatMap = chatList.get(x);
								String messageStringwithEscapeSequence = chatMap.get("chat");
								String messageStringafterEscape =  messageStringwithEscapeSequence.replace(",", "");
								messageStringafterEscape = messageStringafterEscape.replace("\n", "");
								messageStringafterEscape = messageStringafterEscape.replace("\t", "");
								messageStringafterEscape = messageStringafterEscape.replace("\r", "");

								if(x == 0)
								{
									writer.append(chatMap.get("user") + " : " + messageStringafterEscape);
									writer.append("\n");
								}
								else
								{
									writer.append(" ");
									writer.append(",");
									
									writer.append(" ");
									writer.append(",");
									
									writer.append(" ");
									writer.append(",");
									
									writer.append(" ");
									writer.append(",");
									
									writer.append(" ");
									writer.append(",");
									
									writer.append(" ");
									writer.append(",");
									
									writer.append(" ");
									writer.append(",");
									
									writer.append(chatMap.get("user") + " : " + messageStringafterEscape);
									writer.append("\n");
								}
							}
							writer.append("\n");
						}
					}
				}
				
				String fileName 		= "ChatTranscript"+".csv";
				response.setContentType("text/csv");
				response.setHeader("Content-Disposition", "attachment; filename="+fileName);
				outputStream 			= response.getOutputStream();
				String outputResult 	= writer.toString();
				outputStream.write(outputResult.getBytes());
				outputStream.flush();
				outputStream.close();
			}
			catch(Exception e)
			{
				log.log( java.util.logging.Level.INFO  , e.getMessage() ,  e);	
			}
			finally
			{
				outputStream.close();
			}
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value="/checkInteractionsInCache/{interactionId}/{accountNumber}",method=RequestMethod.GET)
	public @ResponseBody String checkInteractionsInCache(@PathVariable("interactionId") String interactionId,@PathVariable("accountNumber") String accountNumber,HttpSession session,HttpServletResponse resp)
	{
		String skill 	= "";
		String cacheUrl = "";
		ArrayList<HashMap<String,Object>> accountConfigurationList	=	null;
		String accountConfiguration = null;
		String response = "failed";
		accountNumber	=	accountNumber.trim();
		ObjectMapper mapper 	=	null;
		ModeUtil  modeUtil		=	null;
		
		try 
		{
			modeUtil = new ModeUtil();
			mapper 	 = new ObjectMapper();
			accountConfiguration 	= new ArAccountMangerController().fetchSubaccounts(null, accountNumber);
			accountConfigurationList = new ArrayList<HashMap<String,Object>>();
			accountConfigurationList = mapper.readValue(accountConfiguration, new TypeReference<ArrayList<HashMap<String, Object>>>() {});
			if(accountConfigurationList == null)
			{
				log.info("accountConfiguration is Null ");
				return response;
			}
			for(HashMap<String, Object> accountConfigurationMap : accountConfigurationList)
			{
				if(String.valueOf(accountConfigurationMap.get("subAccountNumber")).equalsIgnoreCase(accountNumber))
				{
					if(modeUtil.getMode().equalsIgnoreCase("live"))
						skill	=	String.valueOf(accountConfigurationMap.get("live_skill"));
					else
						skill	=	String.valueOf(accountConfigurationMap.get("staging_skill"));
					break;
				}
			}
		    if(skill.equalsIgnoreCase(""))
		    {
		    	log.info("skill is Null ");
		    	return response;
		    }
			cacheUrl = modeUtil.getWebchatUrlByMode()+"/xmpp/temptestcache-get?key=ArQueueNew-"+skill;
			String 			   cacheResponse 		=	new URLFetch().httpUrlFetchGET(cacheUrl);
			if(cacheResponse.contains(interactionId))
			{
				response = "success";
			}
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		return response;
	}
}
