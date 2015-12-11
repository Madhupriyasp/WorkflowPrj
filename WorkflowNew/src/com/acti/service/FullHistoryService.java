package com.acti.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Random;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.acti.controller.AdminQueueGae;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;

public class FullHistoryService {
	private static final Logger log = Logger.getLogger(FullHistoryService.class.getName()) ;	
	public String generateConnectionId()
	{
		String generatedId      = null;
		try
		{
			String selectedChar     = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
	        StringBuilder stringbuffer = new StringBuilder();
	        Random rnd         = new Random();
	        while (stringbuffer.length() < 35) 
	        {
	            int index = (int) (rnd.nextFloat() * selectedChar.length());
	            stringbuffer.append(selectedChar.charAt(index));
	        }
	        generatedId     = stringbuffer.toString()+String.valueOf(new Date().getTime());
		}
		catch(Exception e)
		{
			log.info( "Exception in generating connectionId calculations  "+e.getMessage());
		}
		log.info("connectionId :: "+generatedId);
		return generatedId;		
	}
	public ArrayList<HashMap<String,Object>> getQualifiedInteractionFromFullHistoryDB(Calendar fromtime, Calendar totime, String accountNumber)
	{
		URLFetch urlfetch 				= null;
		ObjectMapper mapper       		= null;
		ModeUtil mode					= null;
		String limit					= "300";
		ResourceBundle	resourceBundle	= ResourceBundle.getBundle("ApplicationResources");
		ArrayList<HashMap<String,Object>> tqualifiedInteractionlist  		 = null;
		TypeReference<ArrayList<HashMap<String,Object>>> objRef 	 		 = null;	
		ArrayList<HashMap<String,Object>> qualifiedInteractionlist	 		 = new ArrayList<HashMap<String,Object>>();
		HashMap<String,Object>							lastInter	 		 = new HashMap<String,Object>();
		ArrayList<HashMap<String,Object>>	interactionStatusList	 		 = new ArrayList<HashMap<String,Object>>();
		HashMap<String,Object>							  tempMap	 		 = new HashMap<String,Object>();
		
		try
		{
			Calendar		toCal		= Calendar.getInstance();
			objRef 						= new TypeReference<ArrayList<HashMap<String,Object>>>() {};
			tqualifiedInteractionlist 	= new ArrayList<HashMap<String,Object>>();
			qualifiedInteractionlist  	= new ArrayList<HashMap<String,Object>>();
			mode						= new ModeUtil();
			mapper           			= new ObjectMapper();
			boolean fetch				= false;
			String url 					= "";

				fetch				= 	false;
				toCal.setTimeInMillis(totime.getTimeInMillis());
				do
				{
					url	=	mode.getFullHistoryServicesURL();
					
						 url = 		url+"/Interaction/getInteraction.do"+
							     "?minimumDate="+fromtime.getTimeInMillis()+
							     "&maximumDate="+toCal.getTimeInMillis()+
							     "&apiKey="+resourceBundle.getString("activeresp.apikey")+
							     "&limit="+limit +
							     "&isParent=false"+
							     "&accountNumber="+ accountNumber;
					
					
					urlfetch 		= new URLFetch();
					String Data 	= urlfetch.httpUrlFetchGET(url);
					log.info("url is "+url);
					try
					{
						tqualifiedInteractionlist	=	mapper.readValue(Data, objRef);
						if(tqualifiedInteractionlist.size()==300)
						{
							lastInter				=	new HashMap<String,Object>();
							interactionStatusList	=	new ArrayList<HashMap<String,Object>>();
							tempMap					=	new HashMap<String,Object>();
							
							lastInter				=	tqualifiedInteractionlist.get(tqualifiedInteractionlist.size()-1);
							interactionStatusList	=	(ArrayList<HashMap<String, Object>>) lastInter.get("interactionStatusList");
							tempMap					=	interactionStatusList.get(interactionStatusList.size()-1);
							
							toCal.setTimeInMillis(Long.valueOf(String.valueOf(tempMap.get("dateAddedInMillisecond"))));
							fetch	=	true;
						}
						else
						{
							fetch	=	false;
						}
						qualifiedInteractionlist.addAll(tqualifiedInteractionlist);
						
					}
					catch(Exception e)
					{
						log.log(Level.SEVERE, "so we got noting from the Database   :::"+e.getMessage(), e);
					}	
				}
				while(fetch);
			
			log.info("size finally is"+qualifiedInteractionlist.size());
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE, e.getMessage(), e);
		}
		//To get unique interaction form the full history data
//		if(statusList.size()>1)
//		{
//			log.info("Tring to get unique data as the status size is greater then one");
//			try
//			{
//				for (HashMap<String,Object> interactionMap : qualifiedInteractionlist) 
//				{
//					String interactionId	=	String.valueOf(interactionMap.get("interactionId"));
//					if(!interactionset.contains(interactionId))
//						uniqueQualifiedInteractionlist.add(interactionMap);
//					
//					interactionset.add(interactionId);
//				}
//				qualifiedInteractionlist	=	uniqueQualifiedInteractionlist;
//				log.info("size is "+qualifiedInteractionlist.size());
//			}
//			catch(Exception e)
//			{
//				log.log(Level.SEVERE, "Error in getting Unique values out of Qualified Interactions from Full history"+e.getMessage(), e);
//			}
//		}
		return qualifiedInteractionlist;
	}
	
	public String generateReportsFromFullHistory(Calendar fromtime, Calendar totime)
	{
		URLFetch urlfetch = null;
		ObjectMapper mapper = null;
		ModeUtil mode	= null;
		String limit	= "300";
		ResourceBundle								resourceBundle	= null;
		ArrayList<HashMap<String,Object>> tqualifiedInteractionlist = null;
		TypeReference<ArrayList<HashMap<String,Object>>>     objRef = null;	
		HashMap<String,Object>							  lastInter	= null;
		ArrayList<HashMap<String,Object>> 	  interactionStatusList	= null;
		HashMap<String,Object>								tempMap	= null;
		HashMap<String,Integer> 				externalARReportMap	= null;
		HashMap<String,Integer> 				internalARReportMap	= null;
		HashMap<String,Integer> 					  chatReportMap = null;
		HashMap<String,Object>						  lastStatusMap = null; 
		HashMap<String,Object>						 firstStatusMap = null;	
		String 												 status = "";
		String 								  	  interactionTypeId = "";
		String 										  accountNumber = "";
		ArrayList<String>	                       internalAccounts = null;
		HashMap<String,HashMap<String,Integer>> 		 reportList = null;
		Set<String> 							  interactionStatus = null;

		try
		{
			interactionStatus 		= new HashSet<String>();
			reportList 				= new HashMap<String,HashMap<String,Integer>>();
			chatReportMap 			= new HashMap<String,Integer>();
			internalARReportMap		= new HashMap<String,Integer>();
			externalARReportMap		= new HashMap<String,Integer>();
			tempMap					= new HashMap<String,Object>();
			interactionStatusList	= new ArrayList<HashMap<String,Object>>();
			lastInter				= new HashMap<String,Object>();
			resourceBundle			= ResourceBundle.getBundle("ApplicationResources");
			Calendar	toCal		= Calendar.getInstance();
			objRef 					= new TypeReference<ArrayList<HashMap<String,Object>>>() {};
			tqualifiedInteractionlist = new ArrayList<HashMap<String,Object>>();
			internalAccounts		= new ArrayList<String>(new AdminQueueGae().getInternalAccounts());
			mode					= new ModeUtil();
			mapper 					= new ObjectMapper();
			boolean fetch			= false;
			String url 				= "";
			fetch					= false;
			toCal.setTimeInMillis(totime.getTimeInMillis());
			do
			{
				url	= mode.getFullHistoryServicesURL();

				url = url+"/Interaction/getInteraction.do"+
						"?minimumDate="+
						fromtime.getTimeInMillis()+
						"&maximumDate="+
						toCal.getTimeInMillis()+
						"&apiKey="+resourceBundle.getString("activeresp.apikey")+
						"&limit="+limit +
						"&isParent=false"+
						"&accountNumber=";


				urlfetch = new URLFetch();
				String Data = urlfetch.httpUrlFetchGET(url);
				System.out.println("url is "+url);
				try
				{
					tqualifiedInteractionlist	= mapper.readValue(Data, objRef);
					if(tqualifiedInteractionlist.size()==300)
					{
						lastInter	=	new HashMap<String,Object>();
						interactionStatusList	=	new ArrayList<HashMap<String,Object>>();
						tempMap	=	new HashMap<String,Object>();

						lastInter	= tqualifiedInteractionlist.get(tqualifiedInteractionlist.size()-1);
						interactionStatusList	= (ArrayList<HashMap<String, Object>>) lastInter.get("interactionStatusList");
						tempMap	= interactionStatusList.get(interactionStatusList.size()-1);

						toCal.setTimeInMillis(Long.valueOf(String.valueOf(tempMap.get("dateAddedInMillisecond"))));
						fetch	=	true;
					}
					else
					{
						fetch	=	false;
					}
					log.info("This is the cron data we got from fullhistorydatabase"+ tqualifiedInteractionlist);
					for(HashMap<String, Object> fullHistoryQualifiedResult : tqualifiedInteractionlist)
					{

						lastStatusMap	=	new HashMap<String,Object>();
						firstStatusMap	=	new HashMap<String,Object>();
						interactionStatusList	= new ArrayList<HashMap<String,Object>>();
						interactionStatusList	= (ArrayList<HashMap<String, Object>>) fullHistoryQualifiedResult.get("interactionStatusList");
						lastStatusMap			= interactionStatusList.get(interactionStatusList.size()-1);
						firstStatusMap			= interactionStatusList.get(0);
						status					= String.valueOf(lastStatusMap.get("status")).trim();
						interactionTypeId		= String.valueOf(firstStatusMap.get("type")).trim();
						accountNumber			= String.valueOf(fullHistoryQualifiedResult.get("accountNumber")).trim();
						String matchedStatus	= "";
						interactionStatus.add(status);
						if("84d52042-cc6d-4df8-acf4-1ecc278f790e".equalsIgnoreCase(interactionTypeId) || "a7359531-3e43-4da1-be98-5a1392638e42".equalsIgnoreCase(interactionTypeId) ||
								"8333d8c0-e22a-4e32-9bf5-0f578461823e".equalsIgnoreCase(interactionTypeId) || "b3485731-3c4e-4eeb-a15e-c5bc41286205".equalsIgnoreCase(interactionTypeId))
						{

							if(internalAccounts != null)
							{
								if(internalAccounts.contains(accountNumber))
								{
									//Filling Internal AR
									for (HashMap<String,Object> eachStatusMap : interactionStatusList)
									{
										if("Failed".equalsIgnoreCase(String.valueOf(eachStatusMap.get("status")).trim()))
										{
											if(internalARReportMap.containsKey("Failed"))
												internalARReportMap.put("Failed", internalARReportMap.get(String.valueOf(eachStatusMap.get("status")).trim()) + 1);
											else
												internalARReportMap.put("Failed", 1);
											break;
										}
									}
									matchedStatus = filterArBasedOnStatuses(status);
									if(matchedStatus != "")
									{
										if(internalARReportMap.containsKey(matchedStatus))
											internalARReportMap.put(matchedStatus, internalARReportMap.get(matchedStatus) + 1);
										else
											internalARReportMap.put(matchedStatus, 1);
									}
									if(internalARReportMap.containsKey("Total"))
										internalARReportMap.put("Total", internalARReportMap.get("Total") + 1);
									else
										internalARReportMap.put("Total", 1);
								}
								else
								{
									//Filling External AR
									for (HashMap<String,Object> eachStatusMap : interactionStatusList)
									{
										if("Failed".equalsIgnoreCase(String.valueOf(eachStatusMap.get("status")).trim()))
										{
											if(externalARReportMap.containsKey("Failed"))
												externalARReportMap.put("Failed", externalARReportMap.get(String.valueOf(eachStatusMap.get("status")).trim()) + 1);
											else
												externalARReportMap.put("Failed", 1);
											break;
										}
									}
									matchedStatus = filterArBasedOnStatuses(status);
									if(matchedStatus != "")
									{
										if(externalARReportMap.containsKey(matchedStatus))
											externalARReportMap.put(matchedStatus, externalARReportMap.get(matchedStatus) + 1);
										else
											externalARReportMap.put(matchedStatus, 1);
									}
									if(externalARReportMap.containsKey("Total"))
										externalARReportMap.put("Total", externalARReportMap.get("Total") + 1);
									else
										externalARReportMap.put("Total", 1);
								}
							}
						}
						else if("70158413-3ae0-4896-80b7-50d411ad0cd2".equalsIgnoreCase(interactionTypeId) || "d1add1d7-c4f3-45a4-886d-b7d778fa1f98".equalsIgnoreCase(interactionTypeId))
						{
							//Filling External Chats
							if("unanswered".equalsIgnoreCase(status))
							{
								if(chatReportMap.containsKey("unanswered"))
									chatReportMap.put("unanswered", chatReportMap.get("unanswered") + 1);
								else
									chatReportMap.put("unanswered", 1);
							}
							else if("In Progress".equalsIgnoreCase(status))
							{
								if(chatReportMap.containsKey("InProgressChat"))
									chatReportMap.put("InProgressChat", chatReportMap.get("InProgressChat") + 1);
								else
									chatReportMap.put("InProgressChat", 1);
							}
							else if("closed".equalsIgnoreCase(status))
							{
								if(chatReportMap.containsKey("closed"))
									chatReportMap.put("closed", chatReportMap.get("closed") + 1);
								else
									chatReportMap.put("closed", 1);
							}
							else
							{
								if( !("Failed".equalsIgnoreCase(status) ) )
								{
									if(chatReportMap.containsKey("Misc"))
										chatReportMap.put("Misc", chatReportMap.get("Misc") + 1);
									else
										chatReportMap.put("Misc", 1);
								}
							}
							for (HashMap<String,Object> eachStatusMap : interactionStatusList)
							{
								if("Failed".equalsIgnoreCase(String.valueOf(eachStatusMap.get("status")).trim()))
								{
									if(chatReportMap.containsKey("Failed"))
										chatReportMap.put("Failed", chatReportMap.get(String.valueOf(eachStatusMap.get("status")).trim()) + 1);
									else
										chatReportMap.put("Failed", 1);
									break;
								}
							}

							if(chatReportMap.containsKey("Total"))
								chatReportMap.put("Total", chatReportMap.get("Total") + 1);
							else
								chatReportMap.put("Total", 1);
						}
					}
				}
				catch(Exception e)
				{
					log.log(Level.SEVERE, "so we got noting from the Database :::"+e.getMessage(), e);
				}	
			}
			while(fetch);
			log.info("Types of status are "+ interactionStatus);
			reportList.put("ARExternalReport", externalARReportMap);
			reportList.put("ARInternalReport", internalARReportMap);
			reportList.put("ChatExternalReport", chatReportMap);
			System.out.println("Raw externalReportMap is here : "+externalARReportMap);
			System.out.println("Raw internalReportMap is here : "+internalARReportMap);
			System.out.println("Raw chatReportMap is here : "+chatReportMap);
			new ToolsService().persistReportToDB(reportList,fromtime);

		}
		catch(Exception e)
		{
			log.log(Level.SEVERE, e.getMessage(), e);
		}
		return "success";
	}
	
	public String filterArBasedOnStatuses(String status) {
		
		String statusToSend							=	"";
		ResourceBundle	resourceBundle				= 	ResourceBundle.getBundle("ApplicationResources");
		if(resourceBundle.getString("work.scheduled").equalsIgnoreCase(status))
		{
			statusToSend	=	"Scheduled";
		}
		else if(resourceBundle.getString("work.answered").equalsIgnoreCase(status))
		{
			statusToSend 	=	"Answered";
		}
		else if(resourceBundle.getString("work.inprogress").equalsIgnoreCase(status))
		{
			statusToSend	=	"InProgress";
		}
		else if(resourceBundle.getString("work.inactive").equalsIgnoreCase(status))
		{
			statusToSend	=	"InActive";
		}
		else if(resourceBundle.getString("work.inqueue(ir)").equalsIgnoreCase(status) || resourceBundle.getString("work.inqueue(tr)").equalsIgnoreCase(status))
		{
			statusToSend	=	"InQueue(IR)";
		}
		else if(resourceBundle.getString("work.completed").equalsIgnoreCase(status))
		{
			statusToSend	=	"Completed";
		}
		else if(resourceBundle.getString("work.completed-f8").equalsIgnoreCase(status))
		{
			statusToSend	=	"Completed-F8";
		}
		else if(resourceBundle.getString("work.callended").equalsIgnoreCase(status))
		{
			statusToSend	=	"Callended";
		}
		else if(resourceBundle.getString("work.dialout").equalsIgnoreCase(status))
		{
			statusToSend	=	"Dialout";
		}
		else if(resourceBundle.getString("work.completed-fetch").equalsIgnoreCase(status))
		{
			statusToSend	=	"Completed-Fetch";
		}
		else if(resourceBundle.getString("work.completed-resolved").equalsIgnoreCase(status))
		{
			statusToSend	=	"Completed-Resolved";
		}
		else if(resourceBundle.getString("work.completed-tabclose").equalsIgnoreCase(status))
		{
			statusToSend	=	"Completed-TabClose";
		}
		else
		{
			if( !(resourceBundle.getString("work.failed").equalsIgnoreCase(status) ) )
			{
				statusToSend	=	"Misc";
			}
		}
		return statusToSend;
	}
}
