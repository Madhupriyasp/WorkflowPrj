package com.acti.service;

import java.beans.XMLEncoder;
import java.io.StringWriter;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.codehaus.jackson.map.ObjectMapper;

import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

public class CacheUpdateHelper {
	private static final Logger log = Logger.getLogger(CacheManagerHelper.class.getName());
	public static HashMap<String,String> Currentmap = new HashMap<String,String>();
	private static CacheUpdateHelper myObj;
	public static CacheUpdateHelper getInstance(){
			if(myObj == null){
					myObj = new CacheUpdateHelper();
				}
				return myObj;
		}

	public String UUIDGenerator() {
		  
		Object object = new Object();
		      
		UUID uid = UUID.fromString("38400000-8cf0-11bd-b23e-10b96e4ef00d");  
		object 	=	UUID.randomUUID();
		
		return object.toString();
		}
	public String formatARDetails(HashMap result) 
	{
		XMLEncoder encode = null;
		String transcriptsJson     =  null;
		HashMap transcriptMap	   = new HashMap();
		ObjectMapper mapper = new ObjectMapper();
		Object obj 			=	null;
		ArrayList<HashMap> interactionHistory 			=	new ArrayList();
		ArrayList<HashMap> interactionHistorynew		=	new ArrayList();
		HashMap<String, Object> visitorMap		=	new HashMap<String, Object>();
		try
		{
			transcriptMap.put("interactionType",result.get("interactionType"));
			transcriptMap.put("subAccountNumber", result.get("subaccountNumber"));
			transcriptMap.put("interactionId", result.get("interactionId"));
			transcriptMap.put("connectionId", result.get("connectionId"));
			transcriptMap.put("dateAdded", result.get("dateAdded"));
			transcriptMap.put("date", result.get("date"));
			transcriptMap.put("AgentLogin", result.get("agentLogin"));
			transcriptMap.put("messages", URLEncoder.encode((String) result.get("messagesAsString")));
			interactionHistory		=	(ArrayList<HashMap>) result.get("interactionHistories");
			log.info("length is :"+interactionHistory.size());
			for(int i=0;i<interactionHistory.size();i++)
			{
				
				HashMap historyObject = new HashMap();
				HashMap<String,Object>	object 	=   new HashMap<String,Object>();
				historyObject					=	interactionHistory.get(i);
				if(historyObject.containsKey("agentLogin") &&historyObject.get("agentLogin") !=null)
				{
					object.put("AgentLogin",historyObject.get("agentLogin").toString() );
				}
				else
				{
					object.put("AgentLogin","null");
				}
				if(historyObject.containsKey("connectionId") && historyObject.get("connectionId") !=null)
				{
					object.put("connectionId",String.valueOf(historyObject.get("connectionId")) );
				}
				else
				{
					object.put("connectionId","");
				}
				//object.put("connectionId",(String) jsonObject.get("connectionId")  );
				object.put("action",historyObject.get("action") );
				object.put("dateAdded",historyObject.get("dateAdded"));
				object.put("date",historyObject.get("date"));
				interactionHistorynew.add(object);	
			}
			//caculation for transcript history    ::  InteractionHistory
			long 	finalDate		=	0;
			long 	initialDate		=	0;
			long	comInitDate		=	0;
			long	comFinalDate	=	0;
			String stat 			=	null;
			double answerTime		=	0;
			double timespent		=	0;
			for(int i=interactionHistory.size()-1;i>=0;i--)
			{
			    HashMap	thistory	=	interactionHistory.get(i);
				stat 		=	(String) thistory.get("action");
				//loop to get answertime	
				if	(stat.contains("InQueue(IR)") && initialDate==0)
				{
					initialDate	=	new Date((long)thistory.get("date")).getTime();
					
				}
				else if(stat.contains("Waiting(IR)") && initialDate==0)
				{
					initialDate	=	new Date((long)thistory.get("date")).getTime();
				}
				else if(stat.contains("Answered") && finalDate==0)
				{
					finalDate	=	new Date((long)thistory.get("date")).getTime();
				}
			
				//calculation for answertime

				if(initialDate != 0 && finalDate != 0)
				{
					if(answerTime == 0)
					
					answerTime =	Math.abs(finalDate-initialDate);
				}
				else
				{				
					answerTime = 0;
				}
				
				//loop to get time spent
				if(comInitDate != 0)
				{
					if(comFinalDate == 0)
					comFinalDate	=	new Date((long)thistory.get("date")).getTime();
				}	
				else if(stat.contains("Completed") && comInitDate==0)
				{
					comInitDate	=	new Date((long)thistory.get("date")).getTime();
				}
				
			//calculation for timespent	
				
				if(comInitDate != 0 && comInitDate != 0)
				{
					if(timespent == 0)
					{
						timespent =	Math.abs(finalDate-initialDate);
					}
					
				}
				else
				{
					timespent = 0;
				}
				
			}
			
			
			transcriptMap.put("interactionHistory", interactionHistorynew);
			transcriptMap.put("answerTime", answerTime);
			transcriptMap.put("timeSpent", timespent);
			if(interactionHistory.size()>0)
				transcriptMap.put("action",interactionHistory.get(interactionHistory.size()-1).get("action"));
			
			if(result.get("visitorDetails")!=null)
			{
				HashMap<String, Object> visitorDetails = (HashMap<String, Object>) result.get("visitorDetails");
				visitorMap.put("name", visitorDetails.get("name"));
				visitorMap.put("email", visitorDetails.get("email"));
				visitorMap.put("ipAddress", visitorDetails.get("ipAddress"));
				visitorMap.put("message", visitorDetails.get("message"));
				visitorMap.put("browser", visitorDetails.get("browser"));
				visitorMap.put("country", visitorDetails.get("country"));
				visitorMap.put("city", visitorDetails.get("city"));
				visitorMap.put("operatingSystem", visitorDetails.get("operatingSystem"));
				visitorMap.put("phone", visitorDetails.get("phone"));
				visitorMap.put("interactionId", visitorDetails.get("interactionId"));
				visitorMap.put("region", visitorDetails.get("region"));
				visitorMap.put("subaccountNumber", visitorDetails.get("subaccountNumber"));
				visitorMap.put("accountIdentifier", visitorDetails.get("accountIdentifier"));
				visitorMap.put("date", visitorDetails.get("date"));
				visitorMap.put("dateAdded", visitorDetails.get("dateAdded"));
			}
			
			transcriptMap.put("visitorDetails", visitorMap);
			HashMap transcriptobj 	=	 new HashMap(transcriptMap);
			StringWriter writer   =   new StringWriter();
			mapper.writeValue(writer,transcriptMap);
			transcriptsJson    =  writer.toString();	
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"error in creating transcript"+e.getMessage(),e);
		}
		return transcriptsJson;
	}
	
	public HashMap	recreateInteractionHistoryToUpdate(HashMap interactionHistory)
	{
		try
		{
			HashMap result		=	new HashMap();
			if(interactionHistory.containsKey("agentLogin") &&interactionHistory.get("agentLogin") !=null)
			{
				result.put("AgentLogin",interactionHistory.get("agentLogin").toString() );
			}
			else
			{
				result.put("AgentLogin","null");
			}
			if(interactionHistory.containsKey("connectionId") && interactionHistory.get("connectionId") !=null)
			{
				result.put("connectionId",String.valueOf(interactionHistory.get("connectionId")) );
			}
			else
			{
				result.put("connectionId","");
			}
			result.put("action",interactionHistory.get("action") );
			result.put("dateAdded",interactionHistory.get("dateAdded"));
			result.put("date",interactionHistory.get("date"));
			Object obj = result;
			log.info(""+obj.toString());
			return result;
		}catch(Exception e)
		{
			log.log(Level.SEVERE,"error in getting lastInteraction:::"+e.getMessage(),e);
			return null;
		}
		
	}
	public HashMap FormatARForTime(HashMap interactionData)
	{
		ObjectMapper mapper 	=	new ObjectMapper();
		StringWriter writer  	=   new StringWriter();
		HashMap historyMap 		=	new HashMap();
		long 	finalDate		=	0;
		long 	initialDate		=	0;
		long	comInitDate		=	0;
		long	comFinalDate	=	0;
		String stat 			=	null;
		double answerTime		=	0;
		double timespent		=	0;
		HashMap lastHistory		=	null;
		try
		{
			lastHistory			=	new HashMap();
			mapper.writeValue(writer,interactionData.get("interactionHistory"));
			ArrayList<HashMap> HistoryList	=	mapper.readValue(writer.toString(), ArrayList.class);
			log.info("Interaction Id : "+interactionData.get("interactionId"));
			HistoryList						=	orderInteractionsList(HistoryList);
	//		new Date((long) UniQueInteraction.get("dateAdded");
			for(int i=HistoryList.size()-1;i>=0;i--)
			{
				historyMap = HistoryList.get(i);
				stat 		=	(String) historyMap.get("action");
				//loop to get answertime	
				if	(stat.contains("InQueue(IR)") && initialDate==0)
				{
					initialDate	=	new Date((long) historyMap.get("date")).getTime();
				}
				else if(stat.contains("Waiting(IR)") && initialDate==0)
				{
					initialDate	=	new Date((long) historyMap.get("date")).getTime();
				}
				else if(stat.contains("Answered") && finalDate==0)
				{
					finalDate	=	new Date((long) historyMap.get("date")).getTime();
				}
				//calculation for answertime
				if(initialDate != 0 && finalDate != 0)
				{
					if(answerTime == 0)
					answerTime =	Math.abs(finalDate-initialDate);
				}
				else
				{				
					answerTime = 0;
				}
				//loop to get time spent
				if(comInitDate != 0)
				{
					if(comFinalDate == 0)
					comFinalDate	=	new Date((long) historyMap.get("date")).getTime();
				}	
				else if(stat.contains("Completed") && comInitDate==0)
				{
					comInitDate	=	new Date((long) historyMap.get("date")).getTime();
				}
			//calculation for timespent		
				if(comInitDate != 0 && comInitDate != 0)
				{
					if(timespent == 0)
					{
						timespent =	Math.abs(finalDate-initialDate);
					}	
				}
				else
				{
					timespent = 0;
				}	
			}
			if(HistoryList.size()>0)
			{
				lastHistory = HistoryList.get(HistoryList.size()-1);
				interactionData.put("AgentLogin", lastHistory.get("AgentLogin"));
				interactionData.put("dateAdded", lastHistory.get("dateAdded"));
				interactionData.put("date", lastHistory.get("date"));
			}
		//	interactionData.put("AgentLogin", "NA");
			interactionData.put("timeSpent", timespent);
			interactionData.put("answerTime", answerTime);
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"error in time calculation "+e.getMessage(),e);
		}
		
		return interactionData;
	}
	public Boolean isKeyCached(String Key)
	{
		boolean result	= 	false;
		try
		{
			MemcacheService syncCache 				=	MemcacheServiceFactory.getMemcacheService();
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			result	=	syncCache.contains(Key);
		}catch(Exception e)
		{
			log.log(Level.SEVERE,"error in key inquiery:::"+Key+":::"+e.getMessage(),e);
			return false;
		}
		return result;
	}
	public ArrayList<HashMap> orderInteractionsList(ArrayList<HashMap> lExistingInteractions){
		for(int i=0;i<lExistingInteractions.size();i++)
		{
			for(int j=0;j<lExistingInteractions.size()-1;j++)
			{
				
				if((long)lExistingInteractions.get(j).get("date")>(long)(lExistingInteractions.get(j+1).get("date")))
				{
					//log.info(lExistingInteractions.get(j).getInteractionId()+" going to change the order :: "+lExistingInteractions.get(j).getDate()+" :: "+lExistingInteractions.get(j+1).getDate());
					HashMap temp = lExistingInteractions.get(j);
					lExistingInteractions.set(j, lExistingInteractions.get(j+1));
					lExistingInteractions.set(j+1, temp);
				}
			}
			log.info("Status and timestamp : "+ lExistingInteractions.get(i).get("action") + "   "+lExistingInteractions.get(i).get("date"));
		}
		
		return lExistingInteractions;
	}
}
