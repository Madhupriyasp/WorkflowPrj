package com.acti.service;

import com.acti.controller.AdminQueueGae;
import com.acti.controller.CacheOperationController;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.SocketTimeoutException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.datanucleus.plugin.Bundle;
import org.datanucleus.store.appengine.query.JDOCursorHelper;

import com.acti.DTO.Transcripts;
import com.acti.util.JdoUtil;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.labs.repackaged.org.json.JSONException;

public class TranscriptServiceHelper {

	private static final Logger log = Logger.getLogger(TranscriptServiceHelper.class.getName()) ;

	public static final long HOUR 	= 3600*1000;
	



@SuppressWarnings("unchecked")
public String transcriptsdataNew(String fromdate, String todate, String cacheCursor, boolean fetchFlag, ArrayList<String> fetchAccountNumbersList, String internalFlag, HttpServletResponse response) throws JsonParseException, JsonMappingException, IOException, JSONException, SocketTimeoutException, InterruptedException 
	{
		int						limit										= 200;					// can be increased later when socket timeouts are less probable
		ObjectMapper 			mapper 										= null;
		HashSet<String> 		subAccountSet								= new HashSet<String>();
		HashSet<String> 		userIdSet									= null;
		ArrayList<HashMap<String,Object>>historyJsonArraylist				= new ArrayList<HashMap<String,Object>>();
		HashMap<String, String> domainlistMap								= new HashMap<String,String>();
		HashMap<String,Object>	lasthistoryInteractionStatusMap				= new HashMap<String,Object>();
		ArrayList<HashMap<String,Object>> historyInteractionStatusArray 	= new ArrayList<HashMap<String,Object>>();
		ArrayList<HashMap<String,Object>> chatRemovedHistoryList			= new ArrayList<HashMap<String,Object>>();
		ArrayList<String>		internalAccList								= new ArrayList<String>();
		String 					subaccountList								= "";
		String 					domainnameList								= "";
		String 					tempResult 									= "";
		String 					dateForcursor								= "";
		String 					accNo										= "";
		long 					fromDatems									= 0;
		long 					toDatems									= 0;
		URLFetch 				urlfetcher 									= new URLFetch();
		Date 					fromDate 									= null;
		Date 					toDate        								= null;
		DateFormat 				d											= null;
		DateFormat	 			df 											= null;
		String 					jsonResult									= "";
		ModeUtil				lModeUtil									= null;				  //For finding what mode the app is running on - Staging or Live 	
		lModeUtil															= new ModeUtil();
		HashMap<String,ArrayList<String>>  getContactsMap					= new HashMap<String,ArrayList<String>>();
		HashMap<String,ArrayList<HashMap<String,String>>> agentLoginMap		= new HashMap<String,ArrayList<HashMap<String,String>>>();
		String userIdJson													= "";
		ArrayList<HashMap<String,String>>tempAgentList						= null;
		HashMap<String,String> finalAgentLoginMap							= new HashMap<String,String>();
		CacheManagerHelper	cacheHelperObject								= new CacheManagerHelper();
		String fullHistoryUrl 												= "";
		Set<String> setOfUserIds 											= null; 
		Set<String> userId2Set												= null;
		boolean fetchedData													= false;
		String cacheKeyDate													= "";
		String cacheresult													= "";
		CacheManagerHelper cachemanager										= new CacheManagerHelper();
		boolean onlyCache													= false;
		String trueCache = "";
		long lastDateAddedInMillisecond										= 0;
		
		//
		log.info("this is the cache cursor :: "+cacheCursor);
		try
		{
			
			try
			{
				trueCache = (String) cachemanager.getrawcachenewApi(fromdate+"-Locked");
			}
			catch(Exception e)
			{
				log.info("check for this key"+fromdate+"-Locked");
				trueCache = "";
			}
			log.info("this is trueCache! :: "+trueCache);
			if("YES".equalsIgnoreCase(trueCache))
			{
				onlyCache = true;
			}
			String returnCachedData												= "";
			log.info("this is the damn fromDate :: "+fromdate);
			String cacheFromDate 												= fromdate;
			log.info("came till date formatting :: "+cacheFromDate);
			ArrayList<String> ListofCacheMaps									= (ArrayList<String>) cachemanager.getrawcachenewApi(cacheFromDate.toString());
			

			if (ListofCacheMaps!= null && ListofCacheMaps.size() > 0)
			{
				log.info("got the arrayList of cachedData :: "+cacheFromDate+" and the size of cached data is :: "+ListofCacheMaps.size());
				
				if(   !("noCache".equalsIgnoreCase(cacheCursor))  )
				{
					int cachedListCount = ListofCacheMaps.indexOf(cacheCursor);
					log.info("this is the cachedlistcount ::"+cachedListCount);
					if(cachedListCount == -1)
					{
						log.info("the particular element is not in cache :: "+cacheCursor);
						return "{}";
					}
					cachedListCount = cachedListCount+1;
					if(ListofCacheMaps.size() > cachedListCount)
					{
						log.info("now we are gonna query cache for this :: "+cachedListCount);
						returnCachedData = getAllCachedData(ListofCacheMaps.get(cachedListCount) , onlyCache, fetchFlag, fetchAccountNumbersList, internalFlag);
						return returnCachedData;
					}
					else if(onlyCache)
					{
						log.info("the last cached fields were already queried and sent. all data has been received. stop querying");
						return "{}";
					}
					else
					{
						log.info("half data came from cache, for the remaining gonna query from DB");
					}
				}
				else
				{
					if(!todate.contains("skipDatecalc"))
					{
	
						returnCachedData = getAllCachedData(ListofCacheMaps.get(0) , onlyCache, fetchFlag, fetchAccountNumbersList, internalFlag);
						log.info("going to return cached Data");
						
						return returnCachedData;
					}
				}
			}
		}
		catch(Exception e)
		{
			log.info(e.getMessage());
			e.printStackTrace();
		}
		//
		
		try 
		{
			if(todate.contains("skipDatecalc"))
			{
				d									= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
				df 									= new SimpleDateFormat("MM-dd-yyyy hh:mm");
				todate    							= todate.substring(0, todate.length() - 12);
				fromdate	 						= fromdate.trim() + " 00:00";
				fromDate 							= df.parse(fromdate);
				fromDate							= new Date(fromDate.getTime() + 9*HOUR);
				fromDate							= d.parse(d.format(fromDate));
				DateFormat cdf 						= new SimpleDateFormat("MM-dd-yyyy");
				log.info("bulldozer this is the from Date after parsing :: "+fromDate);
				cacheKeyDate						= cdf.format(fromDate).toString();
				toDatems 							= Long.parseLong(todate, 10);
				fromDatems							= fromDate.getTime();
			}
			else
			{	
				d									= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
				df 									= new SimpleDateFormat("MM-dd-yyyy hh:mm");
				todate    							= todate.trim() + " 23:59";
				fromdate	 						= fromdate.trim() + " 00:00";
				fromDate 							= df.parse(fromdate);
				fromDate							= new Date(fromDate.getTime() + 9*HOUR);
				toDate 								= df.parse(todate);
				toDate								= new Date(toDate.getTime() + 9*HOUR);
				fromDate							= d.parse(d.format(fromDate));
				DateFormat cdf 						= new SimpleDateFormat("MM-dd-yyyy");
				log.info("bulldozer this is the from Date after parsing :: "+fromDate);
				cacheKeyDate						= cdf.format(fromDate).toString();
				toDate								= d.parse(d.format(toDate));
				fromDatems						    = fromDate.getTime();
				toDatems						    = toDate.getTime();
			}
		}
		catch (Exception e)
		{
			log.log(Level.SEVERE, "date error "+e.getMessage(), e);
		}
		
		if(fetchFlag)
		{
			fetchedData = true;
			if(fetchAccountNumbersList.size() > 20)
			{
				log.info("gonna query for all interactions and eliminate those interactions that dont fall in this accountsList :: "+fetchAccountNumbersList);
				fetchFlag = false;
			}
		}
			
//		if(internalFlag.equalsIgnoreCase("false"))
//		{
//			cacheresult = cachemanager.getCachedDataIfAvailabile(fromDate, toDate, "",false,accNo);	
//		}
//		else
//		{
//			cacheresult = cachemanager.getCachedDataIfAvailabile(fromDate, toDate, "",true,accNo);
//		}
				
		try
		{
			fullHistoryUrl = lModeUtil.getFullHistoryServicesURL();
			if (fetchFlag)
			{	
				for(String singleSubacc : fetchAccountNumbersList)
				{
					if(singleSubacc.equalsIgnoreCase(fetchAccountNumbersList.get(0)))
					{
						accNo = accNo+singleSubacc;
					}
					else
					{
						accNo = accNo+","+singleSubacc;
					}
				}
				 fullHistoryUrl += "/Interaction/getInteraction.do?minimumDate="+fromDatems+"&maximumDate="+toDatems+"&apiKey=a1605fa7-022e-4b95-941f-63e86d19a5a5&limit="+limit+"&accountNumber="+accNo+"&isParent=false";
			}
			else
			{
				fullHistoryUrl += "/Interaction/getInteraction.do?minimumDate="+fromDatems+"&maximumDate="+toDatems+"&apiKey=a1605fa7-022e-4b95-941f-63e86d19a5a5&limit="+limit+"&isParent=false";
			}
			urlfetcher 					= 			new URLFetch();
			log.info("this is the url we use to fetch"+fullHistoryUrl);
			tempResult  				=           (String)urlfetcher.httpUrlFetchGET(fullHistoryUrl);
	
			if(tempResult.equalsIgnoreCase("[]") || tempResult.equalsIgnoreCase(""))
			{
				log.info("quitting coz"+tempResult+"appeared");
				return "{}";
			}
			mapper 						= 			new ObjectMapper();
			historyJsonArraylist 		= 			mapper.readValue(tempResult, ArrayList.class);
			if (historyJsonArraylist.size() < limit)
			{
				dateForcursor = "no-overflow-here";
			}
		}
		catch (Exception e)
		{
			log.info("++  some weird exception has occured  "+e.getMessage());
			return "{}";
		}
		// initializing sets and lists whenever they are going to be used, otherwise they throw null pointer exceptions since they are initially declared as null.
		userIdSet         = new HashSet<String>();
		setOfUserIds 	 = new HashSet<String>();
		userId2Set 		= new HashSet<String>();
		// get the internal accounts list based on the internal flag	
		log.info("This is the internalflag~"+internalFlag);
		AdminQueueGae adminQobj = new AdminQueueGae();
		internalAccList 		= new ArrayList(adminQobj.getInternalAccounts());
		if (fetchFlag)
		{					
			for(HashMap<String,Object> singleInteractionMap : historyJsonArraylist)
			{
				historyInteractionStatusArray 			= 	(ArrayList<HashMap<String,Object>>) singleInteractionMap.get("interactionStatusList");
				lasthistoryInteractionStatusMap			=   new HashMap<String,Object>();
				lasthistoryInteractionStatusMap			=	historyInteractionStatusArray.get(historyInteractionStatusArray.size()-1);
				Long lastStatusDate						   = Long.parseLong((String)lasthistoryInteractionStatusMap.get("dateAddedInMillisecond"), 10);
				if((toDatems > lastStatusDate) && (fromDatems < lastStatusDate) && !String.valueOf(lasthistoryInteractionStatusMap.get("type")).equalsIgnoreCase("b0fdad11-0bf5-457b-804a-2914d546d8c2") && singleInteractionMap.get("interactionId") != null && !singleInteractionMap.get("interactionId").toString().trim().equalsIgnoreCase("null") && !singleInteractionMap.get("interactionId").toString().trim().equalsIgnoreCase("")  && !singleInteractionMap.get("accountNumber").toString().trim().equalsIgnoreCase("") )
				{
					if(singleInteractionMap.get("accountNumber") != null || !singleInteractionMap.get("accountNumber").toString().trim().equalsIgnoreCase(""))
					{
						subAccountSet.add((String) singleInteractionMap.get("accountNumber"));
					}
					for(HashMap<String,Object> singleStatusInteractionHistory : historyInteractionStatusArray)
					{
						if(!("".equalsIgnoreCase((String) singleStatusInteractionHistory.get("userId"))) && ((String) singleStatusInteractionHistory.get("userId") != null) && !(String.valueOf(singleStatusInteractionHistory.get("userId")).equalsIgnoreCase("null")))
						{
							String userId			=	"";
							userId 					= 	String.valueOf(singleStatusInteractionHistory.get("userId")).trim();
							userId					=	userId.trim();
							if(userId == null)
							{	
								continue;
							}
							if( (userId.equalsIgnoreCase("")) || (userId.equalsIgnoreCase("visitor")) || (userId.equalsIgnoreCase("system")) || (userId.contains("@a-cti.com")) || ((userId.contains("@")) && (userId.contains(".com"))) || (userId.contains("na")) || userId.contains("NA"))
							{
								finalAgentLoginMap.put(userId, userId);
							}
							else
							{
								userIdSet.add(userId);	
							}
						}
					}
					chatRemovedHistoryList.add(singleInteractionMap);
					continue;
				}
				else
				{
					log.info("this failed the type validation because it was a group chat maybe? or failed date validation, here is the interaction ID"+singleInteractionMap.get("interactionId"));
					continue; 
				}
			}
		}
		else
		{
//			if(internalFlag.equalsIgnoreCase("false"))
//			{
				for(HashMap<String,Object> singleInteractionMap : historyJsonArraylist)
				{	
//					if (!internalAccList.contains((String)singleInteractionMap.get("accountNumber")))
//					{
						historyInteractionStatusArray 			= 	(ArrayList<HashMap<String,Object>>) singleInteractionMap.get("interactionStatusList");
						lasthistoryInteractionStatusMap			=   new HashMap<String,Object>();
						lasthistoryInteractionStatusMap			=	historyInteractionStatusArray.get(historyInteractionStatusArray.size()-1);
						Long lastStatusDate						   = Long.parseLong((String)lasthistoryInteractionStatusMap.get("dateAddedInMillisecond"), 10);
						if((toDatems > lastStatusDate) && (fromDatems < lastStatusDate) && !String.valueOf(lasthistoryInteractionStatusMap.get("type")).equalsIgnoreCase("b0fdad11-0bf5-457b-804a-2914d546d8c2") && singleInteractionMap.get("interactionId") != null && !singleInteractionMap.get("interactionId").toString().trim().equalsIgnoreCase("null") && !singleInteractionMap.get("interactionId").toString().trim().equalsIgnoreCase("")  && !singleInteractionMap.get("accountNumber").toString().trim().equalsIgnoreCase("")  )
						{
							if(fetchAccountNumbersList.size() > 0)
							{
								if(!fetchAccountNumbersList.contains(singleInteractionMap.get("accountNumber")))
								{
									continue;
								}
							}
							if(singleInteractionMap.get("accountNumber") != null || !singleInteractionMap.get("accountNumber").toString().trim().equalsIgnoreCase(""))
							{
								subAccountSet.add((String) singleInteractionMap.get("accountNumber"));
							}
							for(HashMap<String,Object> singleStatusInteractionHistory : historyInteractionStatusArray)
							{
								if(!("".equalsIgnoreCase((String) singleStatusInteractionHistory.get("userId"))) && ((String) singleStatusInteractionHistory.get("userId") != null) && !(String.valueOf(singleStatusInteractionHistory.get("userId")).equalsIgnoreCase("null")))
								{
										String userId			=	"";
										userId 					= 	String.valueOf(singleStatusInteractionHistory.get("userId")).trim();
										userId					=	userId.trim();
										if(userId == null)
										{		
											continue;
										}
										if( (userId.equalsIgnoreCase("")) || (userId.equalsIgnoreCase("visitor")) || (userId.equalsIgnoreCase("system")) || (userId.contains("@a-cti.com")) || ((userId.contains("@")) && (userId.contains(".com"))) || (userId.contains("na")) || userId.contains("NA"))
										{
											finalAgentLoginMap.put(userId, userId);
										}
										else
										{
										    userIdSet.add(userId);	
										}
								}
							}
							chatRemovedHistoryList.add(singleInteractionMap);
							continue;
						}
						else
						{
							log.info("this failed the type validation because it was a group chat maybe? or failed date validation"+singleInteractionMap.get("interactionId"));
							continue; //log.info("this failed the type validation because it was a group chat maybe? or failed date validation"+historyInteractionStatusMap.get("accountNumber"));
						}
					}
				}
		
		if( !("no-overflow-here".equalsIgnoreCase(dateForcursor)) )
		{	
			historyInteractionStatusArray = (ArrayList<HashMap<String,Object>>) ( (HashMap<String,Object>) historyJsonArraylist.get(historyJsonArraylist.size()- 1)).get("interactionStatusList");
			HashMap<String,Object>  singleHistoryStatusMap = null;
			for (int index = historyInteractionStatusArray.size() -1 ; index >=0 ; index--) 
			{
				singleHistoryStatusMap =  historyInteractionStatusArray.get(index); 	
				lastDateAddedInMillisecond = Long.parseLong((String) singleHistoryStatusMap.get("dateAddedInMillisecond"));
				if((toDatems > lastDateAddedInMillisecond) && (fromDatems < lastDateAddedInMillisecond))
				{
					dateForcursor = lastDateAddedInMillisecond+"skipDatecalc";
					break;
				}
			}
		}
		
		
		if(chatRemovedHistoryList.size() < 1)
		{
			HashMap<String,Object> mapForfinalList	 =  new HashMap<String,Object>();
			mapForfinalList.put("ResultMap", "query again");
			mapForfinalList.put("datefornextquery", dateForcursor);
			mapForfinalList.put("fetchedValue", fetchedData);
			mapForfinalList.put("cacheCursor", "noCache");
			log.info("quitting coz all are of wrong type, we need to query next set");	
			jsonResult	=	mapper.writeValueAsString(mapForfinalList);
			log.info("this is the data returned :: if it blocked the code, please check it :: "+jsonResult);
			return jsonResult;
		}
		
		if(userIdSet.size() > 0)
		{
			finalAgentLoginMap.putAll(getLoginBasedOnUserIdFromDCM(userIdSet));
		}
		subaccountList  =   mapper.writeValueAsString(subAccountSet);
		domainnameList	=	new AdminQueueGae().getDomainNamesFromCache(subaccountList);
		domainlistMap   = 	mapper.readValue(domainnameList, new TypeReference<HashMap<String, String>>() {});
		
		jsonResult = formatFullHistoryArraylist(chatRemovedHistoryList, domainlistMap, finalAgentLoginMap, limit, historyJsonArraylist, dateForcursor, fetchedData, cacheKeyDate, fromDatems, toDatems, internalAccList, internalFlag);
		response.addHeader( "Access-Control-Allow-Origin", "*" );
		return jsonResult;
	}
	public String getCursorValue(String key)
	{
		String result 							=		null;
		ObjectInputStream lobjectInputStream 	= 		null;
		Object valueFromCache 					= 		null;

		try 
		{
			log.info("key ::"+key);

			MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			byte[] value = (byte[]) syncCache.get(key); 
			log.info(value+" ");
			if (value != null) 
			{
				ByteArrayInputStream lbyteInputStream 	= 	new ByteArrayInputStream(value);
				lobjectInputStream 						=	new ObjectInputStream(lbyteInputStream);
				valueFromCache 							=	lobjectInputStream.readObject();
				lbyteInputStream.close();
				lobjectInputStream.close();
				result 									=	(String) valueFromCache;
			}
			log.info("result ::"+result);
		} 
		catch (Exception e) 
		{
			log.log(Level.SEVERE,"Error getting data from local cache"+e.getMessage(),e);
		}
		return result;
	}
	public void setAppCache(String key,String data)
	{
		Object datao = data;
		log.info("key "+key+" data "+data);
		try 
		{
			if(data!=null && !data.trim().equalsIgnoreCase(""))
			{
				ByteArrayOutputStream out = new ByteArrayOutputStream();
				ObjectOutputStream os = new ObjectOutputStream(out);
				os.writeObject(datao);
				byte[] value= out.toByteArray();
				MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
				syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
				syncCache.put(key, value); 
				log.info("successfully set appcache!! :: "+key+" :: "+value);
			}
		} 
		catch (Exception e) 
		{
			log.log(Level.SEVERE,e.getMessage(),e);
		}
	}
		
	public String getSuBaccountNumberByDomainName(String xmlString)
	{
				String Decoded	=		URLDecoder.decode(xmlString);
				String json;
				try 
				{
					json = org.json.XML.toJSONObject(Decoded).toString();
					System.out.println("JSON"+json);
					
				} catch (Exception e) 
				{
					System.out.println("Decoded"+Decoded);
					log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
				}
			
			return null;
						
			    
	}
	public List<Transcripts> getQueriedResult(Query query,PersistenceManager pm,Cursor cursor,String cursorvalue,String status,Date fromdate,Date todate)
	{

		List<Transcripts> result    = null;
		log.info("status:: "+status);

		pm 		= JdoUtil.get().getPersistenceManager();

		if(status.equalsIgnoreCase("waiting"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Waiting(IR)'");
		else if(status.equalsIgnoreCase("inqueue"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'InQueue(IR)'");
		else if(status.equalsIgnoreCase("inprogress"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'In Progress'");
		else if(status.equalsIgnoreCase("completed"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed'");
		else if(status.equalsIgnoreCase("completed-resolved"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed-Resolved'");
		else if(status.equalsIgnoreCase("completed-f8"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed-F8'");
		else if(status.equalsIgnoreCase("completed-tabclose"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed-TabClose'");
		else if(status.equalsIgnoreCase("scheduled"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Scheduled'");
		else if(status.contains("requeue"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus.matches(\"requeue\")");
		else if(status.equalsIgnoreCase("answered"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Answered'");
		else if(status.equalsIgnoreCase("stuckinprogress"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Stuck In Process'");
		else if(status.equalsIgnoreCase("loadingerror"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus.matches(\"loading\")");
		else if(status.equalsIgnoreCase("callended"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Callended'");
		else if(status.equalsIgnoreCase("dialout"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Dialout'");
		else if(status.equalsIgnoreCase("answered-chat"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='SBChat' && interactionStatus == 'answered'");
		else if(status.equalsIgnoreCase("queued-chat"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='SBChat' && interactionStatus == 'queued'");
		else if(status.equalsIgnoreCase("closed-chat"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='SBChat' && interactionStatus == 'closed'");
		else	
			log.info("really!! are you seriously kidding me ?? :: "+status);

		log.info("query:: "+query);
		query.declareImports("import java.util.Date");
		query.declareParameters("Date fromdate,Date todate");
		query.setOrdering("date descending");
		query.setRange(0, 250);

		if(!cursorvalue.trim().equalsIgnoreCase("newc"))
		{
			cursor	= 	Cursor.fromWebSafeString(cursorvalue);
			Map<String,Object> extensionsMap	=	new HashMap<String,Object>();
			extensionsMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
			query.setExtensions(extensionsMap);
		}
		
		result = (List<Transcripts>) query.execute(fromdate,todate);	
		log.info("quired data size"+result.size());
		return result;

	}
	// List<Transcripts>
	public List<Transcripts> getQueriedResultForSpecificAccountNo(Query query,PersistenceManager pm,String cursorvalue,Cursor cursor,String status,Date fromdate,Date todate,String accNo)
	{
		AdminQueueGae adminqueuegae = new AdminQueueGae();
		List<Transcripts> result    = null;
		ArrayList<String> internalArraylist	=	new ArrayList<String>();
		String accdetail = adminqueuegae.getAccounts();
		ObjectMapper mapper = new ObjectMapper();
		HashMap data = null;
		//		log.severe("acc map ::"+accdetail);
		if (accNo	==	null)
		{
			try 
			{
				data = new ObjectMapper().readValue(accdetail, HashMap.class);
				internalArraylist	= (ArrayList<String>) data.get("internal");
			}
			catch (Exception e)
			{
				log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
			}	
		}
		else
		{
			try
			{
				internalArraylist	=	mapper.readValue(accNo, ArrayList.class);
			}
			catch(Exception e)
			{
				log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
			}
		}

		pm 		= JdoUtil.get().getPersistenceManager();

		if(status.equalsIgnoreCase("waiting"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Waiting(IR)' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("inqueue"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'InQueue(IR)' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("inprogress"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'In Progress' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("completed"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("completed-resolved"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed-Resolved' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("completed-f8"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed-F8' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("completed-tabclose"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Completed-TabClose' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("scheduled"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Scheduled' && subaccountNumber == internalArraylist");
		else if(status.contains("requeue"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus.matches(\"requeue\") && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("answered"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Answered' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("stuckinprogress"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Stuck In Process' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("loadingerror"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus.matches(\"loading\") && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("callended"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Callended' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("dialout"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='AR' && interactionStatus == 'Dialout' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("answered-chat"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='SBChat' && interactionStatus == 'answered' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("queued-chat"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='SBChat' && interactionStatus == 'queued' && subaccountNumber == internalArraylist");
		else if(status.equalsIgnoreCase("closed-chat"))
			query 	= pm.newQuery(Transcripts.class,"date>=fromdate && date<=todate && interactionType =='SBChat' && interactionStatus == 'closed' && subaccountNumber == internalArraylist");
		else
			log.info("really!! are you seriously kidding me ?? :: "+status);

		log.info("query:: "+query);
		query.declareImports("import java.util.Date;import java.util.ArrayList");
		query.declareParameters("Date fromdate,Date todate,ArrayList internalArraylist");
		query.setOrdering("date descending");
		query.setRange(0, 250);

		if(!cursorvalue.trim().equalsIgnoreCase("newc"))
		{
			cursor	= 	Cursor.fromWebSafeString(cursorvalue);
			Map<String,Object> extensionsMap	=	new HashMap<String,Object>();
			extensionsMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
			query.setExtensions(extensionsMap);
		}
		result = (List<Transcripts>) query.execute(fromdate,todate,internalArraylist);	
		return result;
	}
	@SuppressWarnings("unchecked")
	public String formatFullHistoryArraylist(ArrayList<HashMap<String, Object>> chatRemovedHistoryList, HashMap<String, String> domainlistMap, HashMap<String, String> finalAgentLoginMap, int limit, ArrayList<HashMap<String, Object>> historyJsonArraylist, String dateForcursor, boolean fetchedData, String cacheKeyDate, long fromDatems, long toDatems, ArrayList<String> internalAccList, String internalFlag)
	{
		ArrayList<HashMap<String, Object>> historyInteractionStatusArray = null;
		ArrayList<HashMap<String,Object>> interhistoryArray 			 = null;
		HashMap<String,Object> internalMap 								 = null;
		String msgFinal 												 =  "";
		String connectionIdfinal										 =  "";
		String dateAddedfinal 		    								 =  "";
		String dateFinal		 		 								 =  "";
		String actionFinal				 								 =  "";
		String dateForcursorReturned									 =  "";
		String metaData													 =	"";
		String userId													 =	"";
		String feedback													 =	"";
		CacheManagerHelper	cachemanager								 =  new CacheManagerHelper();
		CacheUpdateHelper cacheupdate									 =	new CacheUpdateHelper();
		boolean onlyonceflag    										 =  true;	
		HashMap<Object, HashMap<String, Object>> outerjsonMap			 =  null;
		String jsonResult 												 =  "";
		ObjectMapper mapper												 =  null;
		ArrayList<HashMap<String,Object>> finalReturnList				 =  new ArrayList<HashMap<String,Object>>();
		HashMap<String,Object> mapForfinalList							 =  new HashMap<String,Object>();
		CacheManagerHelper cacheHelper 									 =  new CacheManagerHelper();
		String unipin  													 =	"";
		String keySet													 =	"";
		Queue lQueue   													 =	QueueFactory.getQueue("cachetranscript");
		HashMap<String,ArrayList<String> > accountInteractionIdMap		 =  new HashMap<String, ArrayList<String> >();
		dateForcursorReturned											 =  dateForcursor;
		LinkedHashMap<String, String> messagesMap						 =	null;
		LinkedHashMap<String, String> feedbackMap						 =	null;
		
		try
		{
			mapper = new ObjectMapper();
			outerjsonMap = new HashMap<Object, HashMap<String,Object>>();
			for (HashMap<String,Object> singleInteractionMap : chatRemovedHistoryList)
			{	
				ArrayList<String> interactionsForSingleAccount = new ArrayList<String>();
				String currentAccNo = "";
				
				
				msgFinal			= "";	
				metaData			= "";
				userId				= "";
				feedback			= "";
				messagesMap		 	= 	new LinkedHashMap<>();
				feedbackMap			=	new LinkedHashMap<>();
				interhistoryArray	=	new ArrayList<HashMap<String,Object>>();
				internalMap = new HashMap<String,Object>();
				historyInteractionStatusArray 	= new ArrayList<HashMap<String,Object>>();
				if((String)singleInteractionMap.get("accountNumber") == null || (String)singleInteractionMap.get("accountNumber") == "" || (String)singleInteractionMap.get("accountNumber") == " " || "NA".equalsIgnoreCase( (String)singleInteractionMap.get("accountNumber")) || "null".equalsIgnoreCase( (String)singleInteractionMap.get("accountNumber")) )
				{
					internalMap.put("subAccountNumber","NA");
				}
				else
				{
				internalMap.put("subAccountNumber",(String)singleInteractionMap.get("accountNumber"));
					
					currentAccNo = (String) singleInteractionMap.get("accountNumber");
					if(accountInteractionIdMap.containsKey(currentAccNo))
					{
						ArrayList<String> listOfinteractionIDs = new ArrayList<String> (accountInteractionIdMap.get(currentAccNo) );
						listOfinteractionIDs.add((String) singleInteractionMap.get("interactionId"));
						accountInteractionIdMap.put(currentAccNo, listOfinteractionIDs);
					}
					else
					{
						ArrayList<String> listOfinteractionIDs = new ArrayList<String>();
						listOfinteractionIDs.add((String) singleInteractionMap.get("interactionId"));
						accountInteractionIdMap.put(currentAccNo, listOfinteractionIDs);
					}
				}
				
				if(domainlistMap.get(internalMap.get("subAccountNumber")) == null || domainlistMap.get(internalMap.get("subAccountNumber")) == "" || domainlistMap.get(internalMap.get("subAccountNumber")) == "NA")
				{
					internalMap.put("domain", "NA");
				}
				else 
				{
					internalMap.put("domain", (String) domainlistMap.get(internalMap.get("subAccountNumber")));
				}
				internalMap.put("interactionId",(String) singleInteractionMap.get("interactionId"));
				historyInteractionStatusArray = (ArrayList<HashMap<String,Object>>) singleInteractionMap.get("interactionStatusList");	
				int interactionHistoryLength = historyInteractionStatusArray.size();
				for(HashMap<String,Object> singleHistoryInteractionMap : historyInteractionStatusArray)
				{		
						HashMap<String,Object> 	interactionhistoryMap		=	new HashMap<String,Object>();
						String 		currentAction 							= 	(String) singleHistoryInteractionMap.get("status");	
						Long 		dateadded 								= 	Long.valueOf(((String) singleHistoryInteractionMap.get("dateAddedInMillisecond")));
						interactionhistoryMap.put("AgentLogin", (String) finalAgentLoginMap.get((String) singleHistoryInteractionMap.get("userId")));		
						String tempConidString = (String)singleHistoryInteractionMap.get("connectionId");
						if((tempConidString.equalsIgnoreCase("")) || (tempConidString.equalsIgnoreCase(" ")) || (tempConidString.equalsIgnoreCase("null")) || (tempConidString.equalsIgnoreCase(null)))
						{
							interactionhistoryMap.put("connectionId", "NA");
						}
						else
						{
							interactionhistoryMap.put("connectionId",(String) singleHistoryInteractionMap.get("connectionId"));
						}
						interactionhistoryMap.put("action",currentAction);
						interactionhistoryMap.put("dateAdded", dateadded);
						interactionhistoryMap.put("date", dateadded);
						ArrayList<HashMap<String,Object>> jdoArraylist 	=  	new ArrayList<HashMap<String,Object>>();
						//changes by karthi
						jdoArraylist 			=  	(ArrayList<HashMap<String,Object>>) singleHistoryInteractionMap.get("interactionInfoJDOList");
						
						if(jdoArraylist != null)
						{
						for(HashMap<String,Object> interactionInfoJDO: jdoArraylist)
						{
							if(interactionInfoJDO != null)
							{
								if(String.valueOf(interactionInfoJDO.get("title")).equalsIgnoreCase("phoneNumber") && !"".equalsIgnoreCase(String.valueOf(interactionInfoJDO.get("value"))))
								{
									interactionhistoryMap.put("phoneNumber",String.valueOf(interactionInfoJDO.get("value")).replaceAll("-", "").replaceAll(" ", ""));
								}
								if(String.valueOf(interactionInfoJDO.get("title")).equalsIgnoreCase("outboundConnectionID") && !"".equalsIgnoreCase(String.valueOf(interactionInfoJDO.get("value"))))
								{
									interactionhistoryMap.put("outboundConnectionID",String.valueOf(interactionInfoJDO.get("value")));
								}
							}
						}
					}
	
					interhistoryArray.add(interactionhistoryMap);
					if("70158413-3ae0-4896-80b7-50d411ad0cd2".equalsIgnoreCase(String.valueOf(singleHistoryInteractionMap.get("type"))) || "d1add1d7-c4f3-45a4-886d-b7d778fa1f98".equalsIgnoreCase(String.valueOf(singleHistoryInteractionMap.get("type"))) )
					{
						if(ResourceBundle.getBundle("ApplicationResources").getString("work.closed-unanswered-chat").equalsIgnoreCase(currentAction.trim()) || ResourceBundle.getBundle("ApplicationResources").getString("work.closed-chat").equalsIgnoreCase(currentAction.trim()) || ResourceBundle.getBundle("ApplicationResources").getString("work.prechatsurveyclosed").equalsIgnoreCase(currentAction.trim()) || ResourceBundle.getBundle("ApplicationResources").getString("work.offlineformclosed").equalsIgnoreCase(currentAction.trim()))
						{	
							jdoArraylist = (ArrayList<HashMap<String,Object>>) singleHistoryInteractionMap.get("interactionInfoJDOList");
							try
							{
								for(HashMap<String,Object> individualInteractionInfo : jdoArraylist)
								{	
									if(("contactinfo").equalsIgnoreCase(String.valueOf(individualInteractionInfo.get("title")).trim()))
									{
										msgFinal	=	individualInteractionInfo.get("value").toString();
									}
									if(("metaData").equalsIgnoreCase(String.valueOf(individualInteractionInfo.get("title")).trim()))
									{
										metaData	=	individualInteractionInfo.get("value").toString();
									}
									if(("feedback").equalsIgnoreCase(String.valueOf(individualInteractionInfo.get("title")).trim()))
									{
										feedback	=	individualInteractionInfo.get("value").toString();
									}
								}	
							}
							catch(Exception e)
							{
								msgFinal	=	"";
							}
								messagesMap.put(interactionhistoryMap.get("connectionId").toString(), msgFinal);
								feedbackMap.put(interactionhistoryMap.get("connectionId").toString(), feedback);
								msgFinal				=	mapper.writeValueAsString(messagesMap);
								feedback				=	mapper.writeValueAsString(feedbackMap);
						}
						if(ResourceBundle.getBundle("ApplicationResources").getString("work.answered-chat").equalsIgnoreCase(currentAction.trim()) || ResourceBundle.getBundle("ApplicationResources").getString("work.invited").equalsIgnoreCase(currentAction.trim()))
						{
							userId	=	String.valueOf(singleHistoryInteractionMap.get("userId"));
						}
					}
					else
					{
						if(singleHistoryInteractionMap.equals(historyInteractionStatusArray.get(0)))
						{	
							jdoArraylist = (ArrayList<HashMap<String,Object>>) singleHistoryInteractionMap.get("interactionInfoJDOList");	
							try
							{
								HashMap<String,String> interactionDetailFormatterMap	=	new HashMap<String,String>();
								for(HashMap<String,Object> interactionDetailMap : jdoArraylist)
								{
									if(interactionDetailMap.containsKey("title") && interactionDetailMap.containsKey("value"))
										interactionDetailFormatterMap.put(String.valueOf(interactionDetailMap.get("title")), String.valueOf(interactionDetailMap.get("value")));
								}
								msgFinal = mapper.writeValueAsString(interactionDetailFormatterMap);
							}
							catch (Exception e) 
							{
								e.printStackTrace();
							}
	
						}
					}
					if(singleHistoryInteractionMap.equals(historyInteractionStatusArray.get(0)))
					{	
						if(String.valueOf(singleHistoryInteractionMap.get("type")).equalsIgnoreCase("70158413-3ae0-4896-80b7-50d411ad0cd2") || String.valueOf(singleHistoryInteractionMap.get("type")).equalsIgnoreCase("d1add1d7-c4f3-45a4-886d-b7d778fa1f98"))
						{
							internalMap.put("interactionType", "SBChat");	
						}
						else
						{
							internalMap.put("interactionType", "AR");	
						}	
					}
	
					if (singleHistoryInteractionMap.equals(historyInteractionStatusArray.get(interactionHistoryLength-1)))
					{
						connectionIdfinal	= (String) singleHistoryInteractionMap.get("connectionId");
						dateAddedfinal = (String) singleHistoryInteractionMap.get("dateAddedInMillisecond");
						dateFinal	= (String) singleHistoryInteractionMap.get("dateAddedInMillisecond");
						if("70158413-3ae0-4896-80b7-50d411ad0cd2".equalsIgnoreCase(String.valueOf(singleHistoryInteractionMap.get("type"))) || "d1add1d7-c4f3-45a4-886d-b7d778fa1f98".equalsIgnoreCase(String.valueOf(singleHistoryInteractionMap.get("type"))) || !"".equalsIgnoreCase(userId))
						{
							if(!"".equalsIgnoreCase(userId))
							{
								internalMap.put("AgentLogin",(String) finalAgentLoginMap.get(userId));
								log.info("I am printing this to see the agent loging" + finalAgentLoginMap.get(userId));
							}
							else
							{
								internalMap.put("AgentLogin","NA");
							}
						}
						else
						{
							internalMap.put("AgentLogin",(String) finalAgentLoginMap.get((String) singleHistoryInteractionMap.get("userId")));
						}
						actionFinal	=	currentAction;
					}	
				     // The Below code would be removed later
//					if(singleHistoryInteractionMap.equals(historyInteractionStatusArray.get(interactionHistoryLength-1)) && singleInteractionMap.equals(chatRemovedHistoryList.get(chatRemovedHistoryList.size()-1)) && historyJsonArraylist.size() >= limit && onlyonceflag == true )
//					{
//						onlyonceflag = false;	
//						if( !("no-overflow-here".equalsIgnoreCase(dateForcursor)) )
//						{
//							dateForcursor = dateAddedfinal;
//							dateForcursorReturned = dateForcursor+"skipDatecalc";
//						}
//						else
//						{
//							dateForcursorReturned = dateForcursor;
//						}
//					}	
				}
				Long datefinal1 = Long.valueOf(dateFinal).longValue();
				msgFinal = URLEncoder.encode(msgFinal, "UTF-8");
				Long dateAddedfinal1 = Long.valueOf(dateAddedfinal).longValue();
				internalMap.put("interactionHistory",interhistoryArray);
				internalMap.put("connectionId", connectionIdfinal);
				internalMap.put("answerTime", "");
				internalMap.put("parentInteractionId",internalMap.get("interactionId"));
				internalMap.put("dateAdded", dateAddedfinal1);
				internalMap.put("date", datefinal1);
				internalMap.put("timeSpent","");
				internalMap.put("messages", msgFinal);
				internalMap.put("feedback", feedback);
				internalMap.put("metaData", metaData);
				internalMap.put("action", actionFinal);
				if(singleInteractionMap.get("scheduledTime") != null && !"".equalsIgnoreCase((String)singleInteractionMap.get("scheduledTime")) && !"na".equalsIgnoreCase((String)singleInteractionMap.get("scheduledTime")) && !"null".equalsIgnoreCase((String)singleInteractionMap.get("scheduledTime")))
				{
					internalMap.put("scheduledTime", singleInteractionMap.get("scheduledTime"));
				}
				else
				{
					internalMap.put("scheduledTime","NA");	
				}
				HashMap<Object, HashMap<String, Object>> singleInteractionforCache = new HashMap<Object, HashMap<String, Object>>();	
				singleInteractionforCache.put(internalMap.get("interactionId"), internalMap);
				cacheHelper.setCache( singleInteractionforCache , internalMap.get("interactionId").toString() );
				if(internalFlag.equalsIgnoreCase("false"))
				{
					if(!internalAccList.contains(currentAccNo))
					{
						outerjsonMap.put(internalMap.get("interactionId"), internalMap);	
					}
				}
				else
				{
					if(internalAccList.contains(currentAccNo))
					{
						outerjsonMap.put(internalMap.get("interactionId"), internalMap);	
					}
				}
			}
	
			log.info("this is the account-interactionID map :: "+accountInteractionIdMap);
	
			if(!fetchedData)
			{
				unipin = cacheupdate.UUIDGenerator();
				HashMap<String,Object> interactionListMap = new HashMap<String,Object>();
				interactionListMap.put("interactionIDList", accountInteractionIdMap);
				interactionListMap.put("cursorData", dateForcursorReturned);
				keySet	=	cacheHelper.setCache(interactionListMap, unipin);
			}
	
			HashMap<Object,Object> dataMap = new HashMap<Object, Object>();
			dataMap.put("newkey", unipin);
			dataMap.put("fromdate", fromDatems);
			dataMap.put("todate", toDatems);
			dataMap.put("cursorData", dateForcursorReturned);
			String param	=	mapper.writeValueAsString(dataMap);
			if("success".equalsIgnoreCase(keySet))
			{
				log.info("key set successfully "+unipin);
				log.info("this is the param value that will go to the queue settocache :: "+param);
				lQueue.add( TaskOptions.Builder.withUrl("/settocachenew").param("paramMap", param));
			}
	
			mapForfinalList.put("ResultMap", outerjsonMap);
			mapForfinalList.put("datefornextquery", dateForcursorReturned);
			mapForfinalList.put("fetchedValue", fetchedData);
			mapForfinalList.put("cacheCursor", "noCache");
			jsonResult	=	mapper.writeValueAsString(mapForfinalList);
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
		}
		return jsonResult;
	}
	
	
	
	
	
	public HashMap<String, String> getLoginBasedOnUserIdFromDCM(HashSet<String> userIdSet)
	{
		ModeUtil lModeUtil										 		= null;	
		String mode 					     		    		 		= "";
		String contactUrl								 		 		= "";
		ArrayList<HashMap<String, Object>> tempAgentList 		 		= null;
		CacheManagerHelper	cacheHelperObject 			 		 		= null;
		ArrayList<String> userIdforCMSList				 		 	    = null;
		HashMap<String,List<String>> getContactsMap						= null;
		HashMap<String,ArrayList<HashMap<String,Object>>> agentLoginMap = null;
		HashMap<String, String> finalAgentLoginMap						= new HashMap<String,String>(); 
		ObjectMapper mapper											    = null;
		String userIdJson 												= "";
		URLFetch urlfetcher 											= null;
		TypeReference<HashMap<String, Object>> objRef 					= new TypeReference<HashMap<String, Object>>() {};
		
		try
		{
			lModeUtil = new ModeUtil();
			mode = lModeUtil.getMode();
			cacheHelperObject = new CacheManagerHelper();
			userIdforCMSList	= new ArrayList<String>();
			mapper = new ObjectMapper();
			urlfetcher = new URLFetch();
			tempAgentList	=	new ArrayList<HashMap<String, Object>>();
			if(mode.equalsIgnoreCase("live"))
			{
			contactUrl = ResourceBundle.getBundle("ApplicationResources").getString("live.newcmsurl") + ResourceBundle.getBundle("ApplicationResources").getString("get.contacts");
			}
			else
			{
			contactUrl = ResourceBundle.getBundle("ApplicationResources").getString("staging.newcmsurl") + ResourceBundle.getBundle("ApplicationResources").getString("get.contacts");
			}
			System.out.println("The url for fetching contacts is : " + contactUrl);				
			for(String singleUserId : userIdSet)
			{
				String currentLogin = "";
				CacheOperationController ccutil = new CacheOperationController();
				try
				{
					currentLogin 		= mapper.readValue(ccutil.getcachenewApi(singleUserId), String.class);
				}
				catch(Exception e)
				{
					currentLogin = "null";
				}
				if( currentLogin != null &&  !("null").equalsIgnoreCase(currentLogin) && !("").equalsIgnoreCase(currentLogin.trim()) && !("NoData").equalsIgnoreCase(currentLogin))
				{
					log.info("this is what we got for this userID from cache ::"+singleUserId+"and this is the login ::"+currentLogin);
					finalAgentLoginMap.put(singleUserId, currentLogin);
				}
				else
				{
					log.info("adding to cms query List!!!"+singleUserId);
					userIdforCMSList.add(singleUserId);
				}
			}
			
			
			
			if(userIdforCMSList.size() > 0)
			{
				List<String> tempList = new ArrayList<String>();
				boolean flag = true;
				int tempSize = userIdforCMSList.size();
				int fromIndex = 0;
				int toIndex = 0;
				do
				{
					if(tempSize > 10)
					{
						toIndex = fromIndex + 10;						
					}
					else
					{
						toIndex = userIdforCMSList.size();
						flag = false;						
					}
					tempList = userIdforCMSList.subList(fromIndex, toIndex);
					getContactsMap	=   new HashMap<String,List<String>>(); //this map will be sent to the service
			        getContactsMap.put("contact", tempList);
				    agentLoginMap	=	new HashMap<String,ArrayList<HashMap<String,Object>>>(); //this map will be the result we receive from newCMS
				    try 
				    {
					    userIdJson = mapper.writeValueAsString(getContactsMap);
					    String agentLoginResult = urlfetcher.urlFetchPOST(userIdJson, contactUrl);
					    
					    System.out.println("Response from : " + agentLoginResult);
					    
					    agentLoginMap = mapper.readValue(agentLoginResult, objRef);
					    if(agentLoginMap != null && agentLoginMap.size() > 0)
					    	tempAgentList.addAll(agentLoginMap.get("contact")); 
				    }  
				    catch (Exception e) 
				    {
				    	log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
					 }
				    tempSize = tempSize - 10;
				    fromIndex = toIndex; 				    
				}
				while(flag);
			}
			if(tempAgentList.size() > 0)
			{
				for(HashMap<String, Object> agentMap : tempAgentList)
				{
				String currentId = (String) agentMap.get("id");
				if(!finalAgentLoginMap.containsKey(currentId))
				{
					try
					{
						cacheHelperObject.setCache(((String) agentMap.get("login")), currentId );
					}
					catch(Exception e)
					{
						log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);	
					}
				}
				log.info("adding this to cache it was fetched from CMS:: "+agentMap.get("id")+" :: "+agentMap.get("login"));
				finalAgentLoginMap.put((String) agentMap.get("id"), (String)agentMap.get("login")); //this map holds all userId : login pairs
				}
			}
		}
		catch(Exception e)
		{
			log.info("there was an exception in the  agent login finding function");
			log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
		}
		return finalAgentLoginMap;
	}
	
//	@SuppressWarnings("unchecked")
//	public String getAllCachedData( String cacheKeyforDate , boolean onlyCache, boolean fetchFlag, ArrayList<String> fetchAccountNumbersList, String internalFlag)
//	{
//		//pikapika
//		long startTime4 = System.nanoTime();
//		log.info("started block4 :: ");
//		//
//		String 					jsonResult			  = "";
//		HashMap<String,Object> mapForfinalList		  = new HashMap<String,Object>();
//		HashMap <String,Object> listOfinteractionsMap = new HashMap<String,Object>();
//		CacheManagerHelper cacheHelper				  = new CacheManagerHelper();
//		ObjectMapper mapper  						  = new ObjectMapper();
//		HashMap<Object, HashMap<String, Object>> returnInteractionsList	=  new HashMap< Object, HashMap<String,Object> >();
//		String finalInteractionId					  = "";
//		boolean internalAccFlag						  = true;
//		
//		log.info("This is the internalflag~"+internalFlag);
//		AdminQueueGae adminQobj 					  = new AdminQueueGae();
//		ArrayList<String> internalAccList	    	  = new ArrayList<String>();
//		internalAccList 							  = new ArrayList(adminQobj.getInternalAccounts());
//		
//		if(internalFlag.equalsIgnoreCase("false"))
//		{
//			internalAccFlag = false;
//		}
//		
//		log.info("gonna check for this key now :: "+cacheKeyforDate);
//		listOfinteractionsMap = (HashMap<String, Object>) cacheHelper.getrawcachenewApi( cacheKeyforDate );
//		log.info("successfully got the list of interactions map");
//		
//		//pikapika
//		long endTime4 = System.nanoTime();
//		log.info("ended block4 :: "+( (endTime4 - startTime4)/1000000) );
//		//
//			if(fetchFlag)
//			{
//				log.info("entered fetchFlag");
//				for( String singleInteractionId : listOfinteractionsMap.keySet())
//				{	
//					if(fetchAccountNumbersList.size() > 0)
//					{
//						if( ( fetchAccountNumbersList.contains(listOfinteractionsMap.get(singleInteractionId).toString() )) )
//						{
//							returnInteractionsList.putAll( (HashMap<String,HashMap<String,Object>>) cacheHelper.getrawcachenewApi( singleInteractionId ) );
//						}
//					}
//					else
//					{
//						return "{}";
//					}
//					finalInteractionId = 	singleInteractionId;
//				}
//			}
//			else if(internalAccFlag)
//			{
//				log.info("entered internal flag");
//				for( String singleInteractionId : listOfinteractionsMap.keySet())
//				{
//					 String currentAccNo = listOfinteractionsMap.get(singleInteractionId).toString();
//
//					if( internalAccList.contains(currentAccNo) )
//					{
//						try
//						{
//							returnInteractionsList.putAll( (HashMap<String,HashMap<String,Object>>) cacheHelper.getrawcachenewApi( singleInteractionId ) );
//						}
//						catch(Exception e)
//						{
//							log.info("this is the culprit interactionId :: "+singleInteractionId);
//							continue;
//						}
//					}	
//					finalInteractionId = 	singleInteractionId;
//				}
//			}
//			else
//			{
//				//pikapika
//				long startTime5 = System.nanoTime();
//				log.info("started block5 :: ");
//				//
//				log.info("entered for external flag");
//				
//				ArrayList<String> listOfinteractionsPresent = new ArrayList<String>( listOfinteractionsMap.keySet() );
//				finalInteractionId = listOfinteractionsPresent.get(listOfinteractionsPresent.size()-1);
//				for( String singleInteractionId : listOfinteractionsPresent)
//				{
//					String currentAccNo = listOfinteractionsMap.get(singleInteractionId).toString();
//					if( !( internalAccList.contains(currentAccNo)) )
//					{ 
//						try
//						{
//							returnInteractionsList.putAll( (HashMap<String,HashMap<String,Object>>) cacheHelper.getrawcachenewApi( singleInteractionId ) );
//						}
//						catch(Exception e)
//						{
//							log.info("this is culprit interactionId :: "+singleInteractionId);
//							continue;
//						}
//					}	
//				}
//				
//				//pikapika
//				long endTime5 = System.nanoTime();
//				log.info("ended block5 :: "+( (endTime5 - startTime5)/1000000) );
//				//
//			}
//		
//			//pikapika
//			long startTime6 = System.nanoTime();
//			log.info("started block6 :: ");
//			//
//			log.info("this is the final interactionId :: "+finalInteractionId);
//			HashMap<String,HashMap<String,Object>> finalMapforDate = ( (HashMap<String,HashMap<String,Object>>) cacheHelper.getrawcachenewApi( finalInteractionId ) );
//			HashMap<String,Object> finalInteractionforDate = (HashMap<String, Object>) finalMapforDate.get(finalInteractionId);
//			ArrayList<HashMap<String,Object>> interhistoryArray = (ArrayList<HashMap<String, Object>>) finalInteractionforDate.get("interactionHistory");					
//			long datefornextqueryLong = (long) interhistoryArray.get(interhistoryArray.size()-1).get("date");
//			String datefornextquery   =  ""+datefornextqueryLong+"skipDatecalc";
//			log.info("going to return this date :: "+datefornextquery);
//			log.info("size of returned data :: "+returnInteractionsList.size());
//			mapForfinalList.put("ResultMap", returnInteractionsList);
//			mapForfinalList.put("datefornextquery", datefornextquery);
//			mapForfinalList.put("fetchedValue", false);
//			if(fetchFlag)
//			{
//				mapForfinalList.put("fetchedValue", true);
//			}
//			mapForfinalList.put("cacheCursor", cacheKeyforDate);
//			try 
//			{	
//				jsonResult	=	mapper.writeValueAsString(mapForfinalList);
//			}
//			catch (Exception e)
//			{
//				e.printStackTrace();
//			} 
//			
//			//pikapika
//			long endTime6 = System.nanoTime();
//			log.info("ended block6 :: "+( (endTime6 - startTime6)/1000000) );
//			//
//			return jsonResult;
//	}
	
	@SuppressWarnings("unchecked")
	public String getAllCachedData( String cacheKeyforDate , boolean onlyCache, boolean fetchFlag, ArrayList<String> fetchAccountNumbersList, String internalFlag)
	{
		
		String 					jsonResult			  = "";
		HashMap<String,Object> mapForfinalList		  = new HashMap<String,Object>();
		HashMap <String,ArrayList<String> > listOfinteractionsMap = new HashMap<String,ArrayList<String>>();
		CacheManagerHelper cacheHelper				  = new CacheManagerHelper();
		ObjectMapper mapper  						  = new ObjectMapper();
		HashMap<Object, HashMap<String, Object>> returnInteractionsList	=  new HashMap< Object, HashMap<String,Object> >();
		String finalInteractionId					  = "";
		boolean internalAccFlag						  = true;
																
		AdminQueueGae adminQobj 					  = new AdminQueueGae();
		ArrayList<String> internalAccList	    	  = new ArrayList<String>();
		internalAccList 							  = new ArrayList(adminQobj.getInternalAccounts());
		
		HashMap<String, HashMap<String, Object>> tempSingleReturnedInteraction = null;
		if(internalFlag.equalsIgnoreCase("false"))
		{
			internalAccFlag = false;
		}
		
		log.info("gonna check for this key now :: "+cacheKeyforDate);
		listOfinteractionsMap = (HashMap<String, ArrayList<String>>) cacheHelper.getrawcachenewApi( cacheKeyforDate );
		
			if(fetchFlag)
			{
				if(fetchAccountNumbersList.size() > 0)
				{
					log.info("entered fetchFlag");
					ArrayList<String> listOfAccountNumberspresent = new ArrayList<String>( listOfinteractionsMap.keySet() );
					ArrayList<String> tempListOfInteractions = new ArrayList<String>();
					finalInteractionId = listOfinteractionsMap.get(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1)).get(listOfinteractionsMap.get(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1)).size()-1);
					for( String singleAccountNumber : fetchAccountNumbersList)
					{			
						if( ( listOfAccountNumberspresent.contains(singleAccountNumber)) )
						{
							ArrayList<String> listOfInteractionsUndersingleAccount = new ArrayList<String> (listOfinteractionsMap.get(singleAccountNumber) );
							for(String singleInteractionID : listOfInteractionsUndersingleAccount)
							{
								try
								{
									if(tempListOfInteractions.size() > 1000 ||  ( (singleAccountNumber.equalsIgnoreCase(fetchAccountNumbersList.get(fetchAccountNumbersList.size()-1))) && (singleInteractionID.equalsIgnoreCase(listOfInteractionsUndersingleAccount.get(listOfInteractionsUndersingleAccount.size()-1)) ) )  )
									{																																																	
										tempListOfInteractions.add(singleInteractionID);
										//log.info("size of the list of interactionIDs is ::"+tempListOfInteractions.size());
										CacheManagerHelper manager = new CacheManagerHelper();
										ArrayList<HashMap<String, HashMap<String,Object>>> returnedListOfData = new ArrayList<HashMap<String, HashMap<String,Object>>>();
							
										returnedListOfData = (ArrayList<HashMap<String, HashMap<String,Object>>>) manager.getMulitplerawcachenewApi(tempListOfInteractions);
										for(Object singleReturnedInteraction : returnedListOfData)
										{
											try
											{
												tempSingleReturnedInteraction = (HashMap<String, HashMap<String, Object>>) singleReturnedInteraction;
												returnInteractionsList.putAll(tempSingleReturnedInteraction);
											}
											catch(Exception e)
											{
												log.info("object List recieved from Cache have null values");
											}
										}
										tempListOfInteractions = new ArrayList<String>();
									}	
									else
									{
										tempListOfInteractions.add(singleInteractionID);
										continue;
									}
								}
								catch(Exception e)
								{
									log.log(java.util.logging.Level.SEVERE, "Exception while iteracting through cacahe objects", e);
									continue;
								}
							}
							if(tempListOfInteractions.size() > 0 && singleAccountNumber.equalsIgnoreCase(fetchAccountNumbersList.get(fetchAccountNumbersList.size()-1)))
							{
								//log.info("size of the list of interactionIDs is ::"+tempListOfInteractions.size());
								CacheManagerHelper manager = new CacheManagerHelper();
								ArrayList<HashMap<String, HashMap<String,Object>>> returnedListOfData = new ArrayList<HashMap<String, HashMap<String,Object>>>();								
								returnedListOfData = (ArrayList<HashMap<String, HashMap<String,Object>>>) manager.getMulitplerawcachenewApi(tempListOfInteractions);
								for(HashMap<String, HashMap<String, Object>> singleReturnedInteraction : returnedListOfData)
								{
									returnInteractionsList.putAll(singleReturnedInteraction);
								}
								tempListOfInteractions = new ArrayList<String>();
							}
						}
						if(tempListOfInteractions.size() > 0 && singleAccountNumber.equalsIgnoreCase(fetchAccountNumbersList.get(fetchAccountNumbersList.size()-1)))
						{
							//log.info("size of the list of interactionIDs is ::"+tempListOfInteractions.size());
							CacheManagerHelper manager = new CacheManagerHelper();
							ArrayList<HashMap<String, HashMap<String,Object>>> returnedListOfData = new ArrayList<HashMap<String, HashMap<String,Object>>>();
							returnedListOfData = (ArrayList<HashMap<String, HashMap<String,Object>>>) manager.getMulitplerawcachenewApi(tempListOfInteractions);
							for(HashMap<String, HashMap<String, Object>> singleReturnedInteraction : returnedListOfData)
							{
								returnInteractionsList.putAll(singleReturnedInteraction);
							}
							tempListOfInteractions = new ArrayList<String>();
						}
					}
				}
				else
				{
					return "{}";
				}
			}
			else if(internalAccFlag)
			{
				log.info("entered internal flag");
				ArrayList<String> listOfAccountNumberspresent = new ArrayList<String>( listOfinteractionsMap.keySet() );
				ArrayList<String> tempListOfInteractions = new ArrayList<String>();
				finalInteractionId = listOfinteractionsMap.get(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1)).get(listOfinteractionsMap.get(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1)).size()-1);

				for( String singleAccountNumber : internalAccList)
				{
					if( listOfAccountNumberspresent.contains(singleAccountNumber) )
					{
						try
						{
							ArrayList<String> listOfInteractionsUndersingleAccount = new ArrayList<String> (listOfinteractionsMap.get(singleAccountNumber) );
							for(String singleInteractionID : listOfInteractionsUndersingleAccount)
							{
								try
								{
									if(tempListOfInteractions.size() > 1000 ||  ( (singleAccountNumber.equalsIgnoreCase(internalAccList.get(internalAccList.size()-1))) && (singleInteractionID.equalsIgnoreCase(listOfInteractionsUndersingleAccount.get(listOfInteractionsUndersingleAccount.size()-1)) ) )  )
									{																																																	
										tempListOfInteractions.add(singleInteractionID);
										CacheManagerHelper manager = new CacheManagerHelper();
										ArrayList<HashMap<String, HashMap<String,Object>>> returnedListOfData = new ArrayList<HashMap<String, HashMap<String,Object>>>();
										returnedListOfData = (ArrayList<HashMap<String, HashMap<String,Object>>>) manager.getMulitplerawcachenewApi(tempListOfInteractions);
										
										for(Object singleReturnedInteraction : returnedListOfData)
										{
											try
											{
												tempSingleReturnedInteraction = (HashMap<String, HashMap<String, Object>>) singleReturnedInteraction;
												returnInteractionsList.putAll(tempSingleReturnedInteraction);
											}
											catch(Exception e)
											{
												log.info("object List recieved from Cache have null values");
											}
										}
										tempListOfInteractions = new ArrayList<String>();
									}	
									else
									{
										tempListOfInteractions.add(singleInteractionID);
										continue;
									}
								}
								catch(Exception e)
								{
									log.log(java.util.logging.Level.SEVERE, "Exception while iteracting through cacahe objects", e);
									continue;
								}
							}
						}
						
						catch(Exception e)
						{
							log.info("there is a problem"+e.getMessage());
							continue;
						}
					}
					if(tempListOfInteractions.size() > 0 && singleAccountNumber.equalsIgnoreCase(internalAccList.get(internalAccList.size()-1)))
					{
						//log.info("size of the list of interactionIDs is ::"+tempListOfInteractions.size());
						CacheManagerHelper manager = new CacheManagerHelper();
						ArrayList<HashMap<String, HashMap<String,Object>>> returnedListOfData = new ArrayList<HashMap<String, HashMap<String,Object>>>();
						returnedListOfData = (ArrayList<HashMap<String, HashMap<String,Object>>>) manager.getMulitplerawcachenewApi(tempListOfInteractions);
						for(HashMap<String, HashMap<String, Object>> singleReturnedInteraction : returnedListOfData)
						{
							returnInteractionsList.putAll(singleReturnedInteraction);
						}
						tempListOfInteractions = new ArrayList<String>();
					}
				}
			}
			else
			{
				long startTime5 = System.nanoTime();
				log.info("started block5 :: ");
				//
				log.info("entered for external flag");
				
				ArrayList<String> listOfAccountNumberspresent = new ArrayList<String>( listOfinteractionsMap.keySet() );
				finalInteractionId = listOfinteractionsMap.get(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1)).get(listOfinteractionsMap.get(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1)).size()-1);
				ArrayList<String> tempListOfInteractions = new ArrayList<String>();
				for( String singleAccountNumber : listOfAccountNumberspresent)
				{
					if( !( internalAccList.contains(singleAccountNumber)) )
					{ 
						try
						{
							ArrayList<String> listOfInteractionsUndersingleAccount = new ArrayList<String> (listOfinteractionsMap.get(singleAccountNumber) );
							for(String singleInteractionID : listOfInteractionsUndersingleAccount)
							{
								try
								{
									if(tempListOfInteractions.size() > 1000 ||  ( (singleAccountNumber.equalsIgnoreCase(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1))) && (singleInteractionID.equalsIgnoreCase(listOfInteractionsUndersingleAccount.get(listOfInteractionsUndersingleAccount.size()-1)) ) )  )
									{																																																	
										tempListOfInteractions.add(singleInteractionID);
										//log.info("size of the list of interactionIDs is ::"+tempListOfInteractions.size());
										CacheManagerHelper manager = new CacheManagerHelper();
										ArrayList<HashMap<String, HashMap<String,Object>>> returnedListOfData = new ArrayList<HashMap<String, HashMap<String,Object>>>();
										returnedListOfData = (ArrayList<HashMap<String, HashMap<String,Object>>>) manager.getMulitplerawcachenewApi(tempListOfInteractions);
										
										for(Object singleReturnedInteraction : returnedListOfData)
										{
											try
											{
												tempSingleReturnedInteraction = (HashMap<String, HashMap<String, Object>>) singleReturnedInteraction;
												returnInteractionsList.putAll(tempSingleReturnedInteraction);
											}
											catch(Exception e)
											{
												log.info("object List recieved from Cache have null values");
											}
										}
										tempListOfInteractions = new ArrayList<String>();
									}	
									else
									{
										tempListOfInteractions.add(singleInteractionID);
										continue;
									}
								}
								catch(Exception e)
								{
									log.log(java.util.logging.Level.SEVERE,"Exception occured while reteriving interactions from cache"+singleInteractionID+" Exception : "+e.getMessage(),e);
									continue;
								}
							}
						}
						catch(Exception e)
						{
							log.info("there is a problem with this accNo"+singleAccountNumber);
							log.info(e.getMessage());
							continue;
						}
					}	
						if(tempListOfInteractions.size() > 0 && singleAccountNumber.equalsIgnoreCase(listOfAccountNumberspresent.get(listOfAccountNumberspresent.size()-1)))
						{
							CacheManagerHelper manager = new CacheManagerHelper();
							ArrayList<HashMap<String, HashMap<String,Object>>> returnedListOfData = new ArrayList<HashMap<String, HashMap<String,Object>>>();
							
							returnedListOfData = (ArrayList<HashMap<String, HashMap<String,Object>>>) manager.getMulitplerawcachenewApi(tempListOfInteractions);
							for(HashMap<String, HashMap<String, Object>> singleReturnedInteraction : returnedListOfData)
							{
								returnInteractionsList.putAll(singleReturnedInteraction);
							}
							tempListOfInteractions = new ArrayList<String>();
						}
					}
				
				//pikapika
				long endTime5 = System.nanoTime();
				log.info("ended block5 :: "+( (endTime5 - startTime5)/1000000) );
				//
			}
	
			log.info("this is the final interactionId :: "+finalInteractionId);
			HashMap<String,HashMap<String,Object>> finalMapforDate = ( (HashMap<String,HashMap<String,Object>>) cacheHelper.getrawcachenewApi( finalInteractionId ) );
			HashMap<String,Object> finalInteractionforDate = (HashMap<String, Object>) finalMapforDate.get(finalInteractionId);
			ArrayList<HashMap<String,Object>> interhistoryArray = (ArrayList<HashMap<String, Object>>) finalInteractionforDate.get("interactionHistory");
			long datefornextqueryLong = (long) interhistoryArray.get(interhistoryArray.size()-1).get("date");
			String datefornextquery   =  ""+datefornextqueryLong+"skipDatecalc";
			log.info("size of returned data :: "+returnInteractionsList.size());
			mapForfinalList.put("ResultMap", returnInteractionsList);
			mapForfinalList.put("datefornextquery", datefornextquery);
			mapForfinalList.put("fetchedValue", false);
			if(fetchFlag)
			{
				mapForfinalList.put("fetchedValue", true);
			}
			mapForfinalList.put("cacheCursor", cacheKeyforDate);
			try 
			{	
				jsonResult	=	mapper.writeValueAsString(mapForfinalList);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			} 
			return jsonResult;
	}
	
}
