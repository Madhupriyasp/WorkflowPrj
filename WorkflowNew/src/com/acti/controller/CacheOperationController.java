package com.acti.controller;

import java.io.IOException;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.DataFormatException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import sun.nio.cs.SingleByte;

import com.acti.service.CacheManagerHelper;
import com.acti.service.CacheUpdateHelper;
import com.acti.service.TranscriptServiceHelper;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

@Controller
public class CacheOperationController 
{
		public static final long HOUR 	= 3600*1000;
		private static final Logger log = Logger.getLogger(CacheOperationController.class.getName());
		@RequestMapping(value="/getcache/{Key}",method=RequestMethod.GET)
		public @ResponseBody String getcache(@PathVariable("Key") String key)
		{
				CacheManagerHelper	cachehelper		=	new CacheManagerHelper();	
				String transcriptData 				=   cachehelper.getrawcache(key);
				//log.info("i am in get call"+transcriptData);
				if(transcriptData	==	null || transcriptData =="")
				{
					return "NoData";
				}else
				{
					return transcriptData;
				}
		}
		@RequestMapping(value="/updatecache",method=RequestMethod.POST)
		public @ResponseBody String updatecache(@RequestBody String transcript)
		{
			return "success";
		}
		
		@RequestMapping(value="/calltoupdatecache",method=RequestMethod.POST)
		public @ResponseBody String calltoupdatecache(@RequestParam("uniqueId") String uniqueId)
		{
			Date startDate					=	new Date();
			boolean	updateflag				=	 false;
			long hour						=	 3600*1000;
			String	newKey					=	 "";
			String Status					=	 "";
			Date dateadded					=	 null;
			String transcript				=	 null;
			String	ltranscript				=	 "";
			HashMap	newCachedMap			=	 null;
			String Key						=	 null;
			String interactionId			=	 "";
			String subAccountNumber			=	 "";
			HashMap	interactionData 		=	 null;
			CacheManagerHelper	cachehelper	=	 null;
			ObjectMapper mapper 			=	 null;
			String oldCachedData			=	"";
			String newCachedData			=	"";
			HashMap	oldCachedMap			=	null;
			HashMap tempkeyMap				=	null;
			HashMap  lastHistoryInteraction	=	null;
			String	lHistoryString			=	"";
			StringWriter writer   			=   new StringWriter();
			CacheUpdateHelper cacheupdatehelper	=	new CacheUpdateHelper();
			try
			{
				Format formatter 	= 	new SimpleDateFormat("MM-dd-yyyy");
				DateFormat df 		=	new SimpleDateFormat("MM-dd-yyyy");	
				mapper 				=	new ObjectMapper();
				cachehelper			=	new CacheManagerHelper();	
				newCachedMap		=	new HashMap();
				tempkeyMap			=	new HashMap();
				oldCachedMap		=	new HashMap();
				interactionData		=	new HashMap();
				lastHistoryInteraction	= new HashMap();
				HashMap transcriptmap 	=	new HashMap();
				if(uniqueId != null)
				{
					transcript 		=	cachehelper.getrawcache(uniqueId);
					log.info(transcript);
				}
				if(transcript!="")
				{
								HashMap dataMap		=	mapper.readValue(transcript, HashMap.class);
									transcriptmap 	=	(HashMap)dataMap.get("transcriptData");
							lastHistoryInteraction 	=	(HashMap) dataMap.get("LastHistoryData");
							
				}
			//	JSONObject transcriptJSON 			=	new JSONObject(ltranscript);
				if("".equalsIgnoreCase((String)lastHistoryInteraction.get("interactionId")))
				{
					if(transcriptmap.containsKey("interactionHistories"))
					{
						ArrayList<HashMap> newHistoyList		=	(ArrayList<HashMap>) transcriptmap.get("interactionHistories");
						log.info("hist of conversion his"+newHistoyList.size());
					
						if(newHistoyList.size()>0)
						{
							lastHistoryInteraction		=	newHistoyList.get(newHistoyList.size()-1);
							lastHistoryInteraction		=	cacheupdatehelper.recreateInteractionHistoryToUpdate(lastHistoryInteraction);
						}
					}
				}
				ltranscript		=	cacheupdatehelper.formatARDetails(transcriptmap);
				if(ltranscript != null)
				{
					try
					{
						interactionData 	=	 mapper.readValue(ltranscript, HashMap.class);
					}
					catch(Exception e)
					{
						log.log(Level.SEVERE,"Error in getting data from conversionsupport ::"+e.getMessage(),e);
					}
				}
						
				if(interactionData.containsKey("interactionId"))
				{	
					interactionId			=	(String) interactionData.get("interactionId");
				}
				if(interactionData.containsKey("subAccountNumber"))
				{
					subAccountNumber		=	(String) interactionData.get("subAccountNumber");
				}
				Key 						=	cachehelper.getrawcache(interactionId);
				//getcachekey to remove interaction from it 
				if(Key != "")
				{
					//Execute f this is to update  new interaction
						log.info("key from "+Key);
						oldCachedData				=  cachehelper.getrawcache(Key);
						oldCachedMap				=	mapper.readValue(oldCachedData, HashMap.class);
						if(oldCachedMap.containsKey(subAccountNumber))
						{
							
							tempkeyMap				=	(HashMap) oldCachedMap.get(subAccountNumber);
							if(tempkeyMap.containsKey(interactionId))
							{
								mapper.writeValue(writer,tempkeyMap.get(interactionId));
								HashMap UniQueInteraction			=	mapper.readValue(writer.toString(), HashMap.class);
								
								writer   =   new StringWriter();
								mapper.writeValue(writer,UniQueInteraction.get("interactionHistory"));
								
								ArrayList<HashMap> cachedHistoyList	=	mapper.readValue(writer.toString(), ArrayList.class);
								
								if(lastHistoryInteraction != null)
								{
									cachedHistoyList.add(lastHistoryInteraction);
									cachedHistoyList		=	cacheupdatehelper.orderInteractionsList(cachedHistoyList);
									lastHistoryInteraction	=	cachedHistoyList.get(cachedHistoyList.size()-1);
									UniQueInteraction.put("interactionHistory", cachedHistoyList);
									UniQueInteraction.put("action", lastHistoryInteraction.get("action"));
									UniQueInteraction.put("date", lastHistoryInteraction.get("date"));
									UniQueInteraction.put("connectionId", lastHistoryInteraction.get("connectionId"));
									UniQueInteraction.put("dateAdded", lastHistoryInteraction.get("dateAdded"));
									UniQueInteraction.put("AgentLogin", lastHistoryInteraction.get("AgentLogin"));
									log.info("action is::"+lastHistoryInteraction.get("action"));
									if(UniQueInteraction.containsKey("action") && UniQueInteraction.containsKey("date"))
									{
										Boolean ExUpdateFlag	=		false;
										Status					=		(String) UniQueInteraction.get("action");
										dateadded				=		new Date((long) UniQueInteraction.get("date")-(9*hour));
										
										if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed")))){
											ExUpdateFlag	=	true;
											Status 			= 	"completed";
										}
										else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed-resolved")))){
											ExUpdateFlag	=	true;
											Status 			= 	"completed-resolved";
										}
										else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed-f8")))){
											ExUpdateFlag	=	true;
											Status 			= 	"completed-f8";
										}
										else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.Account-Disabled")))){
											ExUpdateFlag	=	true;
											Status 			= 	"Account Disabled";
										}
										else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed-tabclose")))){
											ExUpdateFlag	=	true;
											Status 			= 	"completed-tabclose";
										}
										else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.progress"))){
											ExUpdateFlag	=	true;
											Status 			=	"inprogress";
										}else if(Status.equals((ResourceBundle.getBundle("ApplicationResources").getString("work.queued-chat")))){
											ExUpdateFlag	=	true;
											Status 			=	"queued-chat";
										}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.queue"))){
											ExUpdateFlag	=	true;
											Status 			=	"inqueue";
										}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.waiting"))){
											ExUpdateFlag	=	true;
											Status 			=	"waiting";
										}else if(Status.equals(ResourceBundle.getBundle("ApplicationResources").getString("work.answered"))){
											ExUpdateFlag	=	true;
											Status 			=	"answered";
										}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.scheduled"))){
											ExUpdateFlag	=	true;
											Status 			=	"scheduled";
										}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.callended"))){
											ExUpdateFlag	=	true;
											Status 			=	"callended";
										}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.dialout"))){
											ExUpdateFlag	=	true;
											Status 			=	"dialout";
										}else if(Status.equals((ResourceBundle.getBundle("ApplicationResources").getString("work.answered-chat")))){
											ExUpdateFlag	=	true;
											Status 			=	"answered-chat";
										}else if(Status.equals((ResourceBundle.getBundle("ApplicationResources").getString("work.closed-chat")))){
											ExUpdateFlag	=	true;
											Status 			=	"closed-chat";
										}
										
										UniQueInteraction	=	cacheupdatehelper.FormatARForTime(UniQueInteraction);
										String interaction 	=	(String) UniQueInteraction.get("interactionId");
										String date 		= 	formatter.format(dateadded);
										String ExKey		=	date+Status;
										if(ExUpdateFlag == true)
										{
											log.info("old key ::: "+Key+"new key is :::"+ExKey);
											if(ExKey.equals(Key))
											{
												tempkeyMap.put(interaction, UniQueInteraction);
												oldCachedMap.put(subAccountNumber, tempkeyMap);
												cachehelper.setDataToCacheAsHash(ExKey, oldCachedMap);
												log.info("updated successfully::::in same key"+Status+"::"+interactionId);
											}
											else
											{
												tempkeyMap.remove(interaction);
												oldCachedMap.put(subAccountNumber, tempkeyMap);
												cachehelper.setDataToCacheAsHash(Key, oldCachedMap);
												
												newCachedData					= 	cachehelper.getrawcache(ExKey);
												if(!"".equals(newCachedData))
												{
													tempkeyMap		=	new HashMap();
													newCachedMap	=	mapper.readValue(newCachedData, HashMap.class);
													if(newCachedMap.containsKey(subAccountNumber))
													{
														tempkeyMap	=	(HashMap) newCachedMap.get(subAccountNumber);
														tempkeyMap.put(interaction, UniQueInteraction);
														newCachedMap.put(subAccountNumber, tempkeyMap);
													}
													else
													{
														tempkeyMap.put(interaction, UniQueInteraction);
														newCachedMap.put(subAccountNumber, tempkeyMap);
													}
													cachehelper.setDataToCacheAsHash(ExKey, newCachedMap);
												}
												else
												{
													tempkeyMap		=	new HashMap();
													newCachedMap	=	new HashMap();
													tempkeyMap.put(interaction, UniQueInteraction);
													newCachedMap.put(subAccountNumber, tempkeyMap);
													cachehelper.setDataToCacheAsHash(ExKey, newCachedMap);
												}
											
												cachehelper.setCacheAsBytes(ExKey.getBytes(),interaction);
												log.info("updated successfully:::"+Status+"::"+interactionId);
											}	
										}
										else
										{
											//remove it from prev key
											tempkeyMap.remove(interactionId);
											oldCachedMap.put(subAccountNumber, tempkeyMap);
											cachehelper.setDataToCacheAsHash(Key, oldCachedMap);
											//get new status key
											newCachedData					= 	cachehelper.getrawcache(ExKey);
											if(!"".equals(newCachedData))
											{
												tempkeyMap		=	new HashMap();
												newCachedMap	=	mapper.readValue(newCachedData, HashMap.class);
												if(newCachedMap.containsKey(subAccountNumber))
												{
													tempkeyMap	=	(HashMap) newCachedMap.get(subAccountNumber);
													tempkeyMap.put(interaction, UniQueInteraction);
													newCachedMap.put(subAccountNumber, tempkeyMap);
												}
												else
												{
													tempkeyMap.put(interaction, UniQueInteraction);
													newCachedMap.put(subAccountNumber, tempkeyMap);
												}
												cachehelper.setDataToCacheAsHash(ExKey, newCachedMap);
											}
											else
											{
												tempkeyMap		=	new HashMap();
												newCachedMap	=	new HashMap();
												tempkeyMap.put(interaction, UniQueInteraction);
												newCachedMap.put(subAccountNumber, tempkeyMap);
												cachehelper.setDataToCacheAsHash(ExKey, newCachedMap);
											}
											cachehelper.setCacheAsBytes(ExKey.getBytes(),interaction);
										
											log.info("history Object updated successfully:::"+Status+"::"+interactionId);
										}
										
									}
									else
									{
										log.info("unable to  update");
									}
										
								}else
								{
									log.info("HistoryList comming as null from conversion support	");
								}
							}
						}
				}
				else
				{
					if(interactionData.containsKey("action") && interactionData.containsKey("date"))
					{
							Status							=	(String) interactionData.get("action");
							dateadded						=	new Date((long) interactionData.get("date")-(9*hour));
							ArrayList<String> subAccNum		=	new ArrayList<String>();
							HashMap<String,String>domainMap = 	new HashMap<String,String>();
							if(interactionData.containsKey("subAccountNumber"))
							{
								subAccNum.add((String) interactionData.get("subAccountNumber"));
								String SubAccList	=	mapper.writeValueAsString(subAccNum);
									   SubAccList	=	new AdminQueueGae().getDomainNamesFromCache(SubAccList);
									   domainMap	=	mapper.readValue(SubAccList, HashMap.class);
								   if(domainMap.containsKey((String) interactionData.get("subAccountNumber")))
									   interactionData.put("domain", domainMap.get((String) interactionData.get("subAccountNumber")));
								   else
									   interactionData.put("domain", "NA");
								   //interactionData.put("domain", value)
							}
							if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed")))){
								updateflag	=	true;
								Status 		= 	"completed";
							}
							else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed-resolved")))){
								updateflag	=	true;
								Status 		= 	"completed-resolved";
							}
							else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed-f8")))){
								updateflag	=	true;
								Status 		= 	"completed-f8";
							}
							else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.completed-tabclose")))){
								updateflag	=	true;
								Status 		= 	"completed-tabclose";
							}
							else if(Status.equalsIgnoreCase((ResourceBundle.getBundle("ApplicationResources").getString("work.Account-Disabled")))){
								updateflag	=	true;
								Status 		= 	"Account Disabled";
							}
							else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.progress"))){
								updateflag	=	true;
								Status =	"inprogress";
							}else if(Status.equals((ResourceBundle.getBundle("ApplicationResources").getString("work.queued-chat")))){
								updateflag	=	true;
								Status =	"queued-chat";
							}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.queue"))){
								updateflag	=	true;
								Status =	"inqueue";
							}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.waiting"))){
								updateflag	=	true;
								Status =	"waiting";
							}else if(Status.equals(ResourceBundle.getBundle("ApplicationResources").getString("work.answered"))){
								updateflag	=	true;
								Status =	"answered";
							}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.scheduled"))){
								updateflag	=	true;
								Status =	"scheduled";
							}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.callended"))){
								updateflag	=	true;
								Status =	"callended";
							}else if(Status.toLowerCase().contains(ResourceBundle.getBundle("ApplicationResources").getString("work.dialout"))){
								updateflag	=	true;
								Status =	"dialout";
							}else if(Status.equals((ResourceBundle.getBundle("ApplicationResources").getString("work.answered-chat")))){
								updateflag	=	true;
								Status =	"answered-chat";
							}else if(Status.equals((ResourceBundle.getBundle("ApplicationResources").getString("work.closed-chat")))){
								updateflag	=	true;
								Status =	"closed-chat";
							}
							
							if(updateflag == true){
									
									String date = 	formatter.format(dateadded);
									newKey		=	date+Status;
									log.info("key is::::"+newKey);
									
									newCachedData					= 	cachehelper.getrawcache(newKey);
									if(!"".equals(newCachedData))
									{
										newCachedMap	=	mapper.readValue(newCachedData, HashMap.class);
										if(newCachedMap.containsKey(subAccountNumber))
										{
											tempkeyMap	=	(HashMap) newCachedMap.get(subAccountNumber);
											tempkeyMap.put(interactionId, interactionData);
											newCachedMap.put(subAccountNumber, tempkeyMap);
										}
										else
										{
											tempkeyMap.put(interactionId, interactionData);
											newCachedMap.put(subAccountNumber, tempkeyMap);
										}
										cachehelper.setDataToCacheAsHash(newKey, newCachedMap);
									}
									else
									{
									//to set data in the new key which is not present in cache	
										newCachedMap	=	new HashMap();
										tempkeyMap.put(interactionId, interactionData);
										newCachedMap.put(subAccountNumber, tempkeyMap);
										cachehelper.setDataToCacheAsHash(newKey, newCachedMap);
									}
								
									cachehelper.setCacheAsBytes(newKey.getBytes(),interactionId);
									log.info("updated successfully:::"+Status+"::"+interactionId);
							}else
							{
									log.info("Not applicable for update :::"+Status);
							}
					}
					else
					{
						log.info("unable to update interaction  :::"+interactionId);
					}
				}

					try
					{
						cachehelper.deleteCache(uniqueId);
					}
					catch(Exception e)
					{
						log.log(Level.SEVERE,"Error deleting garbage from cache"+uniqueId+e.getMessage(),e);
					}
			}catch(Exception e)
			{
				log.log(Level.SEVERE,e.getMessage(),e);
				log.info("unable to update interaction  :::"+interactionId);
			}
			long timeinMillies	=startDate.getTime()-new Date().getTime();
			log.info("UPDATE STOP ::: "+timeinMillies);
			
			 return transcript;
		}
		@RequestMapping(value="/settocache",method=RequestMethod.POST)
		public @ResponseBody void SetDataToCache(@RequestParam("paramMap") String parameter, HttpSession session,HttpServletResponse response,HttpServletRequest request,Model model )
		{
			
			CacheManagerHelper cachehelper				=	null;
			JSONObject	interactionJson					=	null;
			ObjectMapper mapper 						=	null;
			HashMap<String,Object> transcriptMap 		= 	null;
			HashMap<Object,Object>	param				=	null;
			String transcript							=	"";
			String oldTranscript						=	"";
			Date fromDate								=	null;
			String status								=	"";
			String tempTranscript2						=	"";
			String garbageKey							=	"";
			long fDate									= 	0;
			int TranscriptSizeIs						=	0;
			HashMap<String,Object> accountMap 			= 	null;
			HashMap statusMap							=	null;	
			HashMap ListofMap 							=	null;
			String transcriptstatusmap					=	null;	
			HashSet		accountSet						=	null;
			Iterator it 								=	null;
			StringWriter writer     					=	null;			
			try
			{
				writer    		=   new StringWriter();	
				ListofMap		=	new HashMap();
				statusMap		=	new HashMap();
				accountMap		=	new HashMap<String,Object>();
				accountSet		=	new HashSet();
				cachehelper		=	new CacheManagerHelper();	
				interactionJson	=	new JSONObject();
				mapper			=	new ObjectMapper();
				transcriptMap	=	new HashMap<String,Object>();
				param			=	mapper.readValue(parameter, HashMap.class);
				fDate			=	(long)param.get("fromdate");
				fromDate		=   new Date(fDate - (9*HOUR) );
				status			=	(String) param.get("status");
				garbageKey		=	(String) param.get("newkey");
				if(garbageKey != "")
				{
					tempTranscript2		=	cachehelper.getrawcache(garbageKey);
					ListofMap 			=	mapper.readValue(tempTranscript2, HashMap.class);
					
					mapper.writeValue(writer,ListofMap.get(status));
					
					transcriptstatusmap		=	writer.toString();
					statusMap				=	mapper.readValue(transcriptstatusmap, HashMap.class);
					TranscriptSizeIs		=	statusMap.size();
					
					log.info("size of Data is from database is "+TranscriptSizeIs);
				}
			}
			catch(Exception e)
			{
				log.log(Level.SEVERE,"Error getting in parameter ::"+e.getMessage(),e);
			}
				
			    SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
				String formattedDate = formatter.format(fromDate);
				String Key = formattedDate+status; 
				log.info("Key formed is ::::  "+Key);
				oldTranscript 		=	cachehelper.getrawcache(Key);
				if(!("".equals(oldTranscript.trim())))
				{
						try
						{
							accountMap	=	mapper.readValue(oldTranscript, HashMap.class);
						} 
						catch (Exception e)
						{
							log.log(Level.SEVERE,"Error getting data from local cache"+e.getMessage(),e);
						} 
				}
				if(statusMap.size()>0)
				{
					try 
					{
						it 	= 	statusMap.entrySet().iterator();
						
						while (it.hasNext()) 
					    {
							
					        Map.Entry pairs 		=	 (Map.Entry)it.next();
					        Object Trans 			=	 pairs.getValue();
					        transcriptMap			=	new HashMap<String,Object>();
							transcript   			= 	mapper.writeValueAsString(Trans);
							interactionJson 		= 	new JSONObject(transcript);
							if(interactionJson.get("interactionId") != null)
							{
								if(interactionJson.get("date") !=null)
								{
									
									Object interactionId    = 	interactionJson.get("interactionId");
									Object subaccountNumber	=	interactionJson.get("subAccountNumber");
									accountSet.add(subaccountNumber);
									if(accountMap.containsKey(subaccountNumber))
									{
										transcriptMap	=	(HashMap<String, Object>) accountMap.get(subaccountNumber);
										
									}
									transcriptMap.put(interactionId.toString(), Trans);
									accountMap.put(String.valueOf(subaccountNumber), transcriptMap);
									cachehelper.setCacheAsBytes(Key.getBytes(),interactionId.toString());
								}	
							}   
				        it.remove(); // avoids a ConcurrentModificationException
				       
				    }

					}
					catch (Exception e)
					{
						log.log(Level.SEVERE,"Error updating data from cache"+e.getMessage(),e);
					} 
				}
				try
				{
						
						cachehelper.setDataToCacheAsHash(Key,accountMap);	
						String isDominMapCached		=	cachehelper.getAccountNamesForAccounts(accountSet);
						
						log.info("isDominMapCached::: "+isDominMapCached+"::::size of data is "+accountMap.size());
						if(TranscriptSizeIs==250)
						{
							cachehelper.setCacheAsBytes("no".getBytes(),Key+"info");	
						}
						else
						{
							log.info("marking cache key has full data in it");
							cachehelper.setCacheAsBytes("yes".getBytes(),Key+"info");	
						}
				}
				catch(Exception e)
				{
					log.log(Level.SEVERE,"Error persisting data to cache"+e.getMessage(),e);
				}
			try
			{
				cachehelper.deleteCache(garbageKey);
			}
			catch(Exception e)
			{
				log.log(Level.SEVERE,"Error deleting garbage from cache"+garbageKey+e.getMessage(),e);
			}
		}
		
		
		@RequestMapping(value="/deletecache/{key}",method=RequestMethod.GET)
		public @ResponseBody String deleteCache(@PathVariable("key") String key)
		{
			CacheManagerHelper cacheHelperObj			=	null;
			String response								=	"Deleted Keys are ::";
			Pattern pattern								=	null;
			Matcher matcher								=	null;
	
			//Date(mm-dd-yyyy)
				try 
				{
					log.info("Came inside delete method and the key is ::: "+key);
						cacheHelperObj		=	new CacheManagerHelper();
						if(key.trim().length()==10||key.trim().length()==8)
						{
							matcher				=	pattern.compile("(0[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])-((19|20)\\d\\d)").matcher(key);
							if(matcher.find())
							{
								log.info("Calling :: deleteCacheInCollection("+key+") :: in Cache Manager Helper Class");
								for(String keys:cacheHelperObj.deleteCacheInCollection(key))
								{
									response	=	response+keys+"<br/>";
								}
								
							}
							else
							{
								log.info("Cache Key is not in Correct Format :::("+key+")");
								response		=	"Deletion of cache for this key  :::&nbsp;"+key+"&nbsp; is not in right format";
							}
						} 
						else
						{
							log.info("Key is not in Date Format invoking deleteCache:::("+key+"):::in Cache Manager Helper Class");
							response 		=	"Deletion of Cache for this key  ::&nbsp;"+key+" &nbsp;"+cacheHelperObj.deleteCache(key);
						}
					return response;
							
				} 
				
				catch (Exception e) 
				{
					log.log(Level.SEVERE,"Error in getting data from  cache"+e.getMessage(),e);
					return "failed";
					
				}
		}
		
		@RequestMapping(value="/getcachenewApi/{Key}",method=RequestMethod.GET)
		public @ResponseBody String getcachenewApi(@PathVariable("Key") String key)
		{
				CacheManagerHelper	cachehelper		=	new CacheManagerHelper();	
				Object transcriptData 				=   cachehelper.getrawcachenewApi(key);
				String transcriptDataReturned		=   "";
				ObjectMapper mapper = new ObjectMapper();
				try 
				{
					transcriptDataReturned = mapper.writeValueAsString(transcriptData);
				}
				catch (IOException e) 
				{
					e.printStackTrace();
					return "NoData";
				}
				if(transcriptData	==	null || transcriptData =="")
				{
					return "NoData";
				}else
				{
					return transcriptDataReturned;
				}
}

		@RequestMapping(value="/settocachenew",method=RequestMethod.POST)
		public @ResponseBody void SetDataToCachenewApi(@RequestParam("paramMap") String parameter, HttpSession session,HttpServletResponse response,HttpServletRequest request,Model model )
		{
			
			String cursorValuefromDB 				    	=   "";
			CacheManagerHelper cachehelper			 		=	null;
			JSONObject	interactionJson						=	null;
			ObjectMapper mapper 							=	null;
			HashMap<String,Object> interactionsMap	 		= 	null;
			HashMap<Object,Object>	param					=	null;
			String interactionsJson							=	"";
			String existingInteractionsforDate		   	    =	"";
			Date fromDate									=	null;
			String status									=	"";
			String newInteractionsString					=	"";
			HashMap<String,Object> newDataMap     			=   new HashMap<String,Object>();
			String garbageKey								=	"";
			long fDate										= 	0;
			int interactionSizeis							=	0;
			HashMap<String, ArrayList<String> > existingAccountinteractionIdMap  = 	null;
			HashMap<String,ArrayList<String>> nextKeyinteractionsMap   = null; 
			HashMap statusMap								=	null;	
			HashMap<String, ArrayList<String> > listofAccountsAndinteractionIDs =	null;
			String transcriptstatusmap						=	null;	
			HashSet		accountSet							=	null;
			Iterator it 									=	null;
			StringWriter writer     						=	null;		
			ArrayList<String> listOfKeysforDate  = new ArrayList<String>();  
			String currentKeytoAdd							=   "";
			boolean newEntry								=	false;

			try
			{
				writer    		    =   new StringWriter();	
				listofAccountsAndinteractionIDs =   new HashMap<String, ArrayList<String> >();
				nextKeyinteractionsMap   = new HashMap<String, ArrayList<String>>();; 
				statusMap		    =   new HashMap();
				existingAccountinteractionIdMap  =   new LinkedHashMap<String, ArrayList<String> >();
				accountSet			=	new HashSet();
				cachehelper			=	new CacheManagerHelper();	
				interactionJson		=	new JSONObject();
				mapper				=	new ObjectMapper();
				interactionsMap		=	new HashMap<String,Object>();
				param				=	mapper.readValue(parameter, HashMap.class);
				fDate				=	(long)param.get("fromdate");
				fromDate		    =   new Date(fDate - (9*HOUR) );
				garbageKey		    =	(String) param.get("newkey");
				cursorValuefromDB 	=   (String) param.get("cursorData");
				if(garbageKey != "")
				{
					newDataMap								= (HashMap<String, Object>) cachehelper.getrawcachenewApi(garbageKey);
					listofAccountsAndinteractionIDs			= (HashMap<String, ArrayList<String>>) newDataMap.get("interactionIDList");
					interactionSizeis				    	= listofAccountsAndinteractionIDs.size();		
					log.info("number of accountNumber mappings ::  "+interactionSizeis);
				}
			}
			catch(Exception e)
			{
				log.log(Level.SEVERE,"Error getting in parameter ::"+e.getMessage(),e);
			}
				
			    SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
				String formattedDate = formatter.format(fromDate);
				String Key = formattedDate;
				
				log.info("Key formed based on param value is ::::  "+Key);
				try
				{
					listOfKeysforDate  					=   (ArrayList<String>) cachehelper.getrawcachenewApi(Key);
				}
				catch(Exception e)
				{
					log.info("could not get the list of keys for the date, so we are creating a new list of keys");
					listOfKeysforDate = new ArrayList<String>();
				}
				if(listOfKeysforDate == null)
				{
					listOfKeysforDate = new ArrayList<String>();
				}
				if(listOfKeysforDate.size() > 0)
				{
					currentKeytoAdd = listOfKeysforDate.get(listOfKeysforDate.size()-1);
				}
				else
				{
					newEntry = true;
					currentKeytoAdd = Key+"-"+"01";
					try
					{
						cachehelper.setCache("NO", Key+"-Locked");
						log.info("this key has been set :: "+Key+"-Locked");
					}
					catch(Exception e)
					{
						e.printStackTrace();	
					}
				}
				try
				{
					existingAccountinteractionIdMap 		=	(HashMap<String, ArrayList<String> >) cachehelper.getrawcachenewApi(currentKeytoAdd);
					existingInteractionsforDate				=    existingAccountinteractionIdMap.toString();
				}
				catch(Exception e)
				{
					log.info("entered the exception part, this key could not be mapped into a hashMap check it ::"+currentKeytoAdd);
					existingInteractionsforDate = "";
					existingAccountinteractionIdMap = null;
				}
				log.info("printing the existing interactions for date object from cache :: "+existingAccountinteractionIdMap);
				if( (existingAccountinteractionIdMap == null) || ( ("".equals(existingInteractionsforDate.trim()) ) || ("NoData".equalsIgnoreCase(existingInteractionsforDate.trim()) ) )  )
				{
					log.info("adding only new data because existing is null");
					existingAccountinteractionIdMap = new LinkedHashMap<String, ArrayList<String> >();
					newEntry = true;
				}
	
				if(listofAccountsAndinteractionIDs.size() > 0 && newEntry == false)
				{
					if("addFirst".equalsIgnoreCase(cursorValuefromDB))
					{
						return;
					}
					
//					{
//						
//						log.info("came here to add a new interaction or update an existing one");
//						try
//						{
//							LinkedHashMap<String,ArrayList<String>> oldExistingAccountinteractionIdMap  = 	new LinkedHashMap<String,ArrayList<String>>(existingAccountinteractionIdMap);
//							LinkedHashMap<String,ArrayList<String>> addToCacheFinalMap					=   new LinkedHashMap<String,ArrayList<String>>();
//							ArrayList<String> listOfExistingAccountNumbersinCache 						=   new ArrayList<String>(oldExistingAccountinteractionIdMap.keySet() );
//							
//							addToCacheFinalMap.putAll(listofAccountsAndinteractionIDs);
//							
//							for(String singleExistingAccountNumber : oldExistingAccountinteractionIdMap.keySet())
//							{
//								if(addToCacheFinalMap.containsKey(singleExistingAccountNumber))
//								{
//									ArrayList<String> listofAlreadyExistingInteractionsforAccount = new ArrayList<String>(addToCacheFinalMap.get(singleExistingAccountNumber));
//									listofAlreadyExistingInteractionsforAccount.addAll(oldExistingAccountinteractionIdMap.get(singleExistingAccountNumber));	
//									addToCacheFinalMap.put(singleExistingAccountNumber, listofAlreadyExistingInteractionsforAccount);
//								}
//								else
//								{
//									addToCacheFinalMap.put(singleExistingAccountNumber, oldExistingAccountinteractionIdMap.get(singleExistingAccountNumber));
//								}
//							}
//							
//
//							cachehelper.setCache( addToCacheFinalMap, currentKeytoAdd);
//							if(nextKeyinteractionsMap.size() > 0)
//							{
//								String newKeytoAdd = CalculateNewKeyName(currentKeytoAdd);
//								cachehelper.setCache( nextKeyinteractionsMap, newKeytoAdd);
//								listOfKeysforDate.add(newKeytoAdd);
//								cachehelper.setCache( listOfKeysforDate , Key);
//							}
//						}
//						catch (Exception e)
//						{
//							log.info("failed to add or update properly, please check");
//							e.printStackTrace();
//						}
//					} 
					
					else
					{
						try 
						{
							for(String singleAccountNumber : listofAccountsAndinteractionIDs.keySet())
							{
								if(existingAccountinteractionIdMap.containsKey(singleAccountNumber))
								{
									HashSet<String> existingInteractionIdsForAccountList = new HashSet<String> (existingAccountinteractionIdMap.get(singleAccountNumber));
									existingInteractionIdsForAccountList.addAll(listofAccountsAndinteractionIDs.get(singleAccountNumber));
									existingAccountinteractionIdMap.put(singleAccountNumber, new ArrayList<String> (existingInteractionIdsForAccountList) );
								}
								else
								{
									existingAccountinteractionIdMap.put(singleAccountNumber, listofAccountsAndinteractionIDs.get(singleAccountNumber));
								}
								
//								if(existingAccountinteractionIdMap.size() > 1000)
//								{
//									nextKeyinteractionsMap.put(singleinteractionId, listofAccountsAndinteractionIDs.get(singleinteractionId));
//								}
//								else
//								{
//									existingAccountinteractionIdMap.put(singleinteractionId, listofAccountsAndinteractionIDs.get(singleinteractionId));
//								}
							}
							cachehelper.setCache( existingAccountinteractionIdMap, currentKeytoAdd);
							if(nextKeyinteractionsMap.size() > 0)
							{
								String newKeytoAdd = CalculateNewKeyName(currentKeytoAdd);
								cachehelper.setCache( nextKeyinteractionsMap, newKeytoAdd);
								listOfKeysforDate.add(newKeytoAdd);
								cachehelper.setCache( listOfKeysforDate , Key);
							}
						}
						catch (Exception e)
						{
							log.log(Level.SEVERE,"Error updating data from cache"+e.getMessage(),e);
						} 
					}
				}
				
				if(newEntry == true)
				{
					try
					{	
						listOfKeysforDate.remove(currentKeytoAdd);
						listOfKeysforDate.add(currentKeytoAdd);
						cachehelper.setCache( listOfKeysforDate , Key);			
						cachehelper.setCache( listofAccountsAndinteractionIDs, currentKeytoAdd);
					}
					catch(Exception e)
					{
						e.printStackTrace();
					}
				}
				try
				{
					log.info("entered the part for deleting garbage key and setting lock value for this cursor :: "+cursorValuefromDB);
					cachehelper.deleteCache(garbageKey);
					if("no-overflow-here".equalsIgnoreCase( cursorValuefromDB) )
					{
						try
						{				
							Key = Key+"-Locked";
							cachehelper.setCache( "YES", Key);
						}
						catch(Exception e)
						{
							e.printStackTrace();
						}
					}
				}
				catch(Exception e)
				{
					log.log(Level.SEVERE,"Error deleting garbage from cache"+garbageKey+e.getMessage(),e);
				}
		}
		
		public String CalculateNewKeyName (String previousKey)
		{
		//	String previousKey = "11-12-2014-02";
			
			String newKey = "";
			log.info("this is the oldKey :: "+previousKey);
			int countNum = Integer.parseInt(previousKey.substring(previousKey.length()-2));
			countNum = countNum+1;
		    if(countNum < 10)
		 	{
		    	newKey = "0"+countNum;
			}
		    else
		    {
		    	newKey = ""+countNum;
		    }
		    
		    previousKey = previousKey.substring(0,Math.max(previousKey.length() - 2, 0));
			
		    newKey = previousKey+newKey;
			System.out.println("this is newKey"+newKey);
			return newKey;
		}
		
		@RequestMapping(value="/deletecachenewApi/{key}",method=RequestMethod.GET)
		public @ResponseBody String deleteCachenewApi(@PathVariable("key") String key, HttpSession session,HttpServletResponse response,HttpServletRequest request,Model model )
		{
			CacheManagerHelper	cachehelper	     	=		new CacheManagerHelper();	
			String result 							= 		cachehelper.deleteCachenewMethod(key);
			if("failed".equalsIgnoreCase(result))
			{
				return "failed to delete";
			}
			return "successfully Deleted this key ::"+key;
		}
		
		@RequestMapping(value="/updatecachenewApi",method=RequestMethod.POST)
		public @ResponseBody String updatecachenewApi(@RequestBody String interactionData)
		{
			long startTime4 = System.nanoTime();
			log.info("started update block :: ");
			
			CacheUpdateHelper	cacheupdatehelper	=	new CacheUpdateHelper();
			CacheManagerHelper	cachemanager		=	new CacheManagerHelper();
			ObjectMapper mapper 					=   new ObjectMapper();
			HashMap<String,Object> outerIncomingMap	=   new HashMap<String, Object>();
			String interactionIdtoUpdate			=   "";
			HashMap<String,Object> existingInteraction = new HashMap<String,Object>();
			HashMap<String,Object> oldexistingInteraction = new HashMap<String,Object>();
			ArrayList<HashMap<String,Object>> interactionHistoryList = new ArrayList<HashMap<String,Object>>();
			HashMap<String,Object> newStatusMap		= new HashMap<String,Object>();
			String AgentLogin						= "";
			String AgentLoginfromCache				= "";
			CacheManagerHelper cacheHelper  	  	= new CacheManagerHelper();
			
			try 
			{	
				log.info("This is the interactionData that came to be updated :: "+interactionData);
				outerIncomingMap = mapper.readValue(interactionData, HashMap.class);
				HashMap<String,String> interactionMaptoUpdate   =  (HashMap<String,String>) outerIncomingMap.get("interaction");
				interactionIdtoUpdate =  interactionMaptoUpdate.get("interactionId");
				try
				{
					existingInteraction = (HashMap<String, Object>) cachemanager.getrawcachenewApi(interactionIdtoUpdate);
					log.info("this is the interaction before updating :: "+mapper.writeValueAsString(existingInteraction));
					oldexistingInteraction = (HashMap<String, Object>) existingInteraction.get(interactionIdtoUpdate);
				}
				catch(Exception e)
				{
					log.info("failed to get for this interactionId, its not in cache, going to wait for 4 seconds :: "+interactionIdtoUpdate);
					try {
					    Thread.sleep(4000);                 //1000 milliseconds is one second.
					} catch(InterruptedException ex) {
					    Thread.currentThread().interrupt();
					}
					try
					{
						existingInteraction = (HashMap<String, Object>) cachemanager.getrawcachenewApi(interactionIdtoUpdate);
						log.info("second call after 10 seconds this is the interaction before updating :: "+mapper.writeValueAsString(existingInteraction));
						oldexistingInteraction = (HashMap<String, Object>) existingInteraction.get(interactionIdtoUpdate);	
					}
					catch(Exception e2)
					{
						log.info("even after 4 seconds, the interaction is not in cache. going to return failuer, but this interaction will be present in fullhistory DB");			
						return "failure";				
					}
				}
				
				interactionHistoryList = (ArrayList<HashMap<String, Object>>) oldexistingInteraction.get("interactionHistory");
				HashMap<String,Object> FinalExistingStatusMap = interactionHistoryList.get(interactionHistoryList.size()-1);

				String userID = interactionMaptoUpdate.get("userId");
				if( (userID.equalsIgnoreCase("")) || (userID.equalsIgnoreCase("visitor")) || (userID.equalsIgnoreCase("system")) || (userID.contains("@a-cti.com")) || ((userID.contains("@")) && (userID.contains(".com"))) || (userID.contains("na")) || userID.contains("NA"))
				{
					AgentLogin = userID;
					newStatusMap.put("AgentLogin", AgentLogin);
				}
				else
				{
					AgentLoginfromCache = cachemanager.getrawcache(userID);		
					if( AgentLoginfromCache != null &&  !("null").equalsIgnoreCase(AgentLoginfromCache) && !("").equalsIgnoreCase(AgentLoginfromCache.trim()) )
					{
						AgentLogin = AgentLoginfromCache;
						newStatusMap.put("AgentLogin", AgentLogin);
					}	
					else
					{
						// get from CMS !!
						HashMap<String,ArrayList<HashMap<String,Object>>> agentLoginMap = new HashMap<String,ArrayList<HashMap<String,Object>>>(); //this map will be the result we receive from newCMS
						URLFetch urlfetcher  						   = new URLFetch();
						ModeUtil lModeUtil							   = new ModeUtil();
						String mode									   = lModeUtil.getMode();
						String contactUrl  							   = "";
						HashMap<String,List<String>>getContactsMap	   = new HashMap<String,List<String>>(); //this map will be sent to the service
				        ArrayList<String> tempList					   = new ArrayList<String>();
				        tempList.add(userID);
				        log.info("this is the userID at this point ::"+userID);
				        log.info("this is the list after adding the userID ::"+tempList);
						getContactsMap.put("contact", tempList);
				        String userIdJson 							   = mapper.writeValueAsString(getContactsMap);				        
						if(mode.equalsIgnoreCase("live"))
						{
							contactUrl = ResourceBundle.getBundle("ApplicationResources").getString("live.newcmsurl") + ResourceBundle.getBundle("ApplicationResources").getString("get.contacts");
						}
						else
						{
							contactUrl = ResourceBundle.getBundle("ApplicationResources").getString("staging.newcmsurl") + ResourceBundle.getBundle("ApplicationResources").getString("get.contacts");
						}
					    String agentLoginResult 					   = urlfetcher.urlFetchPOST(userIdJson, contactUrl);
						TypeReference<HashMap<String, Object>> objRef  = new TypeReference<HashMap<String, Object>>() {};
					    agentLoginMap = mapper.readValue(agentLoginResult, objRef);
					    log.info("this is the agent login Map got from CMS :: "+agentLoginMap);
					    AgentLogin  = (String) agentLoginMap.get("contact").get(0).get("login");
					    log.info("this is the agent login we got from CMS :: "+AgentLogin);
						newStatusMap.put("AgentLogin", AgentLogin);
					}
				}
				newStatusMap.put("connectionId", interactionMaptoUpdate.get("connectionId").toString());
				newStatusMap.put("action", interactionMaptoUpdate.get("status").toString());
				long dateAdded = 0;
				try
				{
					long dateAddedforNewStatus = Long.valueOf(interactionMaptoUpdate.get("dateAddedInMillisecond"), 10);
					dateAdded = dateAddedforNewStatus;
					newStatusMap.put("dateAdded", dateAdded);
					newStatusMap.put("date", dateAdded);		
				}
				catch(Exception e)
				{
					log.info("date calculation failed, so calculating new date");
					Date currentTime  = new Date();
					dateAdded = currentTime.getTime();
				}
				if( !("null".equalsIgnoreCase(interactionMaptoUpdate.get("connectionId").toString())) && !("".equalsIgnoreCase(interactionMaptoUpdate.get("connectionId").trim())) )
				{
					log.info("updating connectionId");
					oldexistingInteraction.put("connectionId", interactionMaptoUpdate.get("connectionId"));
				}
				oldexistingInteraction.put("dateAdded", dateAdded);
				oldexistingInteraction.put("date", dateAdded);
				oldexistingInteraction.put("AgentLogin", newStatusMap.get("AgentLogin") );
				oldexistingInteraction.put("action", interactionMaptoUpdate.get("status") );
				interactionHistoryList.add(newStatusMap);
				oldexistingInteraction.put("interactionHistory", interactionHistoryList);
				existingInteraction.put(interactionIdtoUpdate, oldexistingInteraction);
				log.info("going to add the interaction");
				cachemanager.setCache(existingInteraction, interactionIdtoUpdate);
				
				Date DateOfUpdate = new Date(dateAdded - (9*HOUR) );
				System.out.println("this is the date of updation :: "+DateOfUpdate);
				SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
				String formattedUpdateDate = formatter.format(DateOfUpdate);
				System.out.println("\n this is the formatted date of Update :: "+formattedUpdateDate);
				
				long dateAddedOfPreviousFinalStatus = (long) FinalExistingStatusMap.get("dateAdded");
				Date DateOfPreviousFinalStatus 		= new Date(dateAddedOfPreviousFinalStatus - (9*HOUR) );
				String formattedPreviousFinalDate   = formatter.format(DateOfPreviousFinalStatus);
				System.out.println("\n this is the formatted date of previously final status :: "+formattedPreviousFinalDate);

				
				if(formattedUpdateDate.equalsIgnoreCase(formattedPreviousFinalDate))
				{
					log.info("both dates are the same, so we dont have to move it to a different date Map");		
				}
				else
				{
					log.info("both dates are different, we need to move the interaction to a different date Map");
					CacheUpdateHelper cacheupdate =	new CacheUpdateHelper();
					String unipin                 = cacheupdate.UUIDGenerator();
					HashMap<String,Object> interactionListMap = new HashMap<String,Object>();
					HashMap<String,String> accountInteractionIdMap = new HashMap<String,String>();
					accountInteractionIdMap.put(interactionIdtoUpdate, (String) oldexistingInteraction.get("subAccountNumber") );
					interactionListMap.put("interactionIDList", accountInteractionIdMap);
					interactionListMap.put("cursorData", "addFirst");
					String keySet =	cacheHelper.setCache(interactionListMap, unipin);
					
					HashMap<Object,Object> dataMap = new HashMap<Object, Object>();
					dataMap.put("newkey", unipin);
					dataMap.put("fromdate", dateAdded);
					dataMap.put("todate", dateAdded);
					dataMap.put("cursorData", "addFirst");
					String param	=	mapper.writeValueAsString(dataMap);
//					if("success".equalsIgnoreCase(keySet))
//					{
//						log.info("key set successfully "+unipin);
//						log.info("this is the param value that will go to the queue settocache :: "+param);
//						Queue lQueue =	QueueFactory.getQueue("cachetranscript");
//						lQueue.add( TaskOptions.Builder.withUrl("/settocachenew").param("paramMap", param));
//						DeleteInteractionFromDateMap(interactionIdtoUpdate, formattedPreviousFinalDate);
//					}
				}

			}		
			catch (Exception e) 
			{
				e.printStackTrace();
				log.info("some exception has happened with updating in cache ");
				return "failure";
			}
			return "success";
		}
		
		public String DeleteInteractionFromDateMap(String interactionIdtoUpdate, String formattedPreviousFinalDate)
		{
			try
			{
				CacheManagerHelper cacheManager  = new CacheManagerHelper();
				ArrayList<String> ListOfDateMapping = new ArrayList<String>();
				ListOfDateMapping = (ArrayList<String>) cacheManager.getrawcachenewApi(formattedPreviousFinalDate);
				for (String singleDateMap : ListOfDateMapping)
				{
				 HashMap<String,Object>	existingAccountinteractionIdMap 		=	(HashMap<String, Object>) cacheManager.getrawcachenewApi(singleDateMap);
				 if(existingAccountinteractionIdMap.keySet().contains(interactionIdtoUpdate))
				 {
					 existingAccountinteractionIdMap.remove(interactionIdtoUpdate);
					 String deleteSuccess = cacheManager.setCache(existingAccountinteractionIdMap, singleDateMap);
					 if(!("failed").equalsIgnoreCase(deleteSuccess) )
					 {
						return "success";
}
				 }
				}
			}
			catch(Exception e)
			{
				e.printStackTrace();
				return "failed";
			}
			return "failed";
		}
		
		
		
		@RequestMapping(value="/newchatinteractionforcache",method=RequestMethod.POST)
		public @ResponseBody String newchatinteractionforcache(@RequestBody String interactionData)
		{	
			ObjectMapper mapper  = new ObjectMapper();
			ArrayList<HashMap<String,Object>> ListOfChats = new ArrayList<HashMap<String,Object>>();
			try
			{
				ListOfChats = mapper.readValue( interactionData, ArrayList.class);
				formatAndStoreChatinCache( ListOfChats );		
			}
			catch(Exception e)
			{
				return "failure";
			}
			return "success";
		}
		
		@RequestMapping(value="/batchInsertARforCache",method=RequestMethod.POST)
		public @ResponseBody String newARbatchForCache(@RequestBody String interactionData)
		{
			
			ObjectMapper mapper  = new ObjectMapper();
			ArrayList<HashMap<Object,Object>> listOfARs = new ArrayList<HashMap<Object,Object>>();
			try
			{
				listOfARs = mapper.readValue( interactionData, ArrayList.class);
				for(HashMap<Object,Object> singleArData : listOfARs)
				{
					formatAndStoreinCache( singleArData );
				}
			}
			catch(Exception e)
			{
				return "failure";
			}
			return "success";
		}
		
		
		
		
		@RequestMapping(value="/newinteractionforcache",method=RequestMethod.POST)
		public @ResponseBody String newinteractionforcache(@RequestBody String interactionData)
		{
			HashMap<Object,Object> newDataStoredinDB  = new HashMap<Object,Object>();
			try 
			{
				ObjectMapper mapper  = new ObjectMapper();
				newDataStoredinDB    = new HashMap<Object,Object>();
				newDataStoredinDB    = mapper.readValue( interactionData, HashMap.class);
			} 
			catch (Exception e) 
			{
				e.printStackTrace();
				return "failure";
			}
			
			String result = formatAndStoreinCache(newDataStoredinDB);
			return result;	
		}
			
			
		public String formatAndStoreinCache (HashMap<Object,Object> newDataStoredinDB)
		{
			
			long startTime4 = System.nanoTime();
			log.info("started add new AR in cache block :: ");
			
			CacheManagerHelper cachemanager										 = new CacheManagerHelper();
			ObjectMapper mapper 												 = new ObjectMapper();
			HashMap<String, String> newInteraction					    		 = new HashMap<String, String>();
			String subAccountNumber 										     = "";
			String interactionId											     = "";
			ArrayList<HashMap<String,Object>> interactionhistoryArray 			 = new ArrayList<HashMap<String,Object>>();
			HashMap<String,Object> singleInteractionHistory						 = new HashMap<String,Object>();
			ArrayList<HashMap<String,Object>> ListOfinteractionHistories		 = new ArrayList<HashMap<String,Object>>();
			String userId														 = "";
			String AgentLogin													 = "";
			String connecionId													 = "";
			String action														 = "";
			long dateAdded														 = 0;
			String messages														 = "";
			String metaData														 = "";
			ArrayList<HashMap<String,Object>>interactionInfoList				 = new ArrayList<HashMap<String, Object>>();	
			HashMap<String,String> interactionInfoMap							 = new HashMap<String,String>();
			String	domain														 = "";
			String domainnameList								 				 = "";
			String subAccountList												 = "";
			HashMap<String, String> domainlistMap								 = new HashMap<String,String>();
			String scheduledTime												 = "";
			String interactionType												 = "AR";
			String Type															 = "";			
			HashMap<String,Object> interactionToStore							 = new HashMap<String,Object>();
			HashMap<String,HashMap<String,Object>> interactiontoCache			 = new HashMap<String,HashMap<String,Object>>();
			
			newInteraction = (HashMap<String, String>) newDataStoredinDB.get("interaction");
			subAccountNumber = newInteraction.get("accountNumber");
			interactionId    = newInteraction.get("interactionId");
			userId  		 = newInteraction.get("userId");
			try 
			{
				AgentLogin    = getAgentLoginForUserId(userId);
			}
			catch (Exception e) 
			{
				e.printStackTrace();
			}
			connecionId = newInteraction.get("connectionId");
			action      = newInteraction.get("status");
			dateAdded   = Long.valueOf(newInteraction.get("dateAddedInMillisecond"), 10);
			interactionInfoList = (ArrayList<HashMap<String, Object>>) newDataStoredinDB.get("interactionInfo");
			Type 		  = newInteraction.get("type").toString();

			
			if("70158413-3ae0-4896-80b7-50d411ad0cd2".equalsIgnoreCase(Type) || "d1add1d7-c4f3-45a4-886d-b7d778fa1f98".equalsIgnoreCase(Type)  )
			{
				if(action.trim().equalsIgnoreCase(ResourceBundle.getBundle("ApplicationResources").getString("work.closed-unanswered-chat")) || action.trim().equalsIgnoreCase(ResourceBundle.getBundle("ApplicationResources").getString("work.closed-chat")) || action.trim().equalsIgnoreCase(ResourceBundle.getBundle("ApplicationResources").getString("work.prechatsurveyclosed")) || action.trim().equalsIgnoreCase(ResourceBundle.getBundle("ApplicationResources").getString("work.offlineformclosed")))
				{	
					try
					{
						for(HashMap<String,Object> individualInteractionInfo : interactionInfoList)
						{	
							if(("contactinfo").equalsIgnoreCase(String.valueOf(individualInteractionInfo.get("title")).trim()))
							{
								messages	=	individualInteractionInfo.get("value").toString();
							}
							if(("metaData").equalsIgnoreCase(String.valueOf(individualInteractionInfo.get("title")).trim()))
	 						{
	 							metaData	=	individualInteractionInfo.get("value").toString();
	 						}
						}		
					}
					catch(Exception e)
					{
						messages				=	"";
					}
				}
			}
			else
			{		
				try
				{
					HashMap<String,String> interactionDetailFormatterMap	=	new HashMap<String,String>();
					for(HashMap<String,Object> interactionDetailMap : interactionInfoList)
					{
						if(interactionDetailMap.containsKey("title") && interactionDetailMap.containsKey("value"))
						interactionDetailFormatterMap.put(String.valueOf(interactionDetailMap.get("title")), String.valueOf(interactionDetailMap.get("value")));
					}
					log.info("message fields are :"+interactionDetailFormatterMap);
					messages = mapper.writeValueAsString(interactionDetailFormatterMap);
				}
				catch (Exception e) 
				{
				e.printStackTrace();
				}
			}
			try
			{
				messages = URLEncoder.encode(messages, "UTF-8");
			}
			catch (Exception e) 
			{
				e.printStackTrace();
			}
			
			ArrayList<String> accountForDomainList = new ArrayList<String>();
			accountForDomainList.add(subAccountNumber);
			try
			{
				subAccountList  =   mapper.writeValueAsString(accountForDomainList);
				domainnameList	=	new AdminQueueGae().getDomainNamesFromCache(subAccountList);
				domainlistMap   = 	mapper.readValue(domainnameList, new TypeReference<HashMap<String, String>>() {});
				domain			=   domainlistMap.get(subAccountNumber);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
			
			scheduledTime = newInteraction.get("scheduledTime");
			
			if( Type.equalsIgnoreCase("70158413-3ae0-4896-80b7-50d411ad0cd2") || Type.equalsIgnoreCase("d1add1d7-c4f3-45a4-886d-b7d778fa1f98"))
			{
				interactionType = "SBChat";
			}
			
			
			singleInteractionHistory.put("AgentLogin", AgentLogin);
			singleInteractionHistory.put("connectionId", connecionId);
			singleInteractionHistory.put("action", action);
			singleInteractionHistory.put("dateAdded", dateAdded);
			singleInteractionHistory.put("date", dateAdded);
			
			interactionhistoryArray.add(singleInteractionHistory);
	
			interactionToStore.put("subAccountNumber", subAccountNumber);
			interactionToStore.put("interactionId", interactionId);
			interactionToStore.put("interactionHistory", interactionhistoryArray);
			interactionToStore.put("answerTime", "");
			interactionToStore.put("connectionId", connecionId);
			interactionToStore.put("dateAdded", dateAdded);
			interactionToStore.put("parentInteractionId", interactionId);
			interactionToStore.put("timeSpent", "");
			interactionToStore.put("date", dateAdded);
			interactionToStore.put("messages", messages);
			interactionToStore.put("metaData", metaData);
			interactionToStore.put("AgentLogin", AgentLogin);
			interactionToStore.put("domain", domain);
			interactionToStore.put("action", action);
			interactionToStore.put("scheduledTime", scheduledTime);
			interactionToStore.put("interactionType", interactionType);
			
			interactiontoCache.put(interactionId, interactionToStore);
			
			CacheUpdateHelper	cacheupdate	=	new CacheUpdateHelper();
			String unipin                   = cacheupdate.UUIDGenerator();
			HashMap<String,Object> interactionListMap = new HashMap<String,Object>();
			HashMap<String,String> accountInteractionIdMap = new HashMap<String,String>();
			accountInteractionIdMap.put(interactionId, (String) interactionToStore.get("subAccountNumber") );
			interactionListMap.put("interactionIDList", accountInteractionIdMap);
			interactionListMap.put("cursorData", "addFirst");
			String keySet = "";
			try 
			{
				cachemanager.setCache(interactiontoCache, interactionId);
				long endTime4 = System.nanoTime();
				log.info("ended add new to cache :: "+( (endTime4 - startTime4)/1000000) );
				
				keySet = cachemanager.setCache(interactionListMap, unipin);
			}
			catch (Exception e) 
			{
				e.printStackTrace();
			}
			
			HashMap<Object,Object> dataMap = new HashMap<Object, Object>();
			dataMap.put("newkey", unipin);
			dataMap.put("fromdate", dateAdded);
			dataMap.put("todate", dateAdded);
			dataMap.put("cursorData", "addFirst");
			String param = "";
			try
			{
				param = mapper.writeValueAsString(dataMap);
			}
			catch (Exception e) 
			{
				e.printStackTrace();
				return "failure";
			}
			if("success".equalsIgnoreCase(keySet))
			{
				log.info("key set successfully "+unipin);
				log.info("this is the param value that will go to the queue settocache :: "+param);
				Queue lQueue =	QueueFactory.getQueue("cachetranscript");
				lQueue.add( TaskOptions.Builder.withUrl("/settocachenew").param("paramMap", param));
			}	
			return "success";
		}
		
		
		
		public String getAgentLoginForUserId (String userID) throws JsonParseException, JsonMappingException, IOException
		{
			String AgentLogintoReturn = "";
			String AgentLoginfromCache= "";
			CacheManagerHelper cachemanager = new CacheManagerHelper();
			ObjectMapper mapper = new ObjectMapper();
			
			if( (userID.equalsIgnoreCase("")) || (userID.equalsIgnoreCase("visitor")) || (userID.equalsIgnoreCase("system")) || (userID.contains("@a-cti.com")) || ((userID.contains("@")) && (userID.contains(".com"))) || (userID.contains("na")) || userID.contains("NA"))
			{
				AgentLogintoReturn = userID;
				return AgentLogintoReturn;
			}
			else
			{
				AgentLoginfromCache = cachemanager.getrawcache(userID);		
				if( AgentLoginfromCache != null &&  !("null").equalsIgnoreCase(AgentLoginfromCache) && !("").equalsIgnoreCase(AgentLoginfromCache.trim()) )
				{
					AgentLogintoReturn = AgentLoginfromCache;
					return AgentLogintoReturn;
				}	
				else
				{
					// get from CMS !!
					HashMap<String,ArrayList<HashMap<String,Object>>> agentLoginMap = new HashMap<String,ArrayList<HashMap<String,Object>>>(); //this map will be the result we receive from newCMS
					URLFetch urlfetcher  						   = new URLFetch();
					ModeUtil lModeUtil							   = new ModeUtil();
					String mode									   = lModeUtil.getMode();
					String contactUrl  							   = "";
					HashMap<String,List<String>>getContactsMap	   = new HashMap<String,List<String>>(); //this map will be sent to the service
			        ArrayList<String> tempList					   = new ArrayList<String>();
			        tempList.add(userID);
			        log.info("this is the userID at this point ::"+userID);
			        log.info("this is the list after adding the userID ::"+tempList);
					getContactsMap.put("contact", tempList);
			        String userIdJson 							   = mapper.writeValueAsString(getContactsMap);				        
					if(mode.equalsIgnoreCase("live"))
					{
						contactUrl = ResourceBundle.getBundle("ApplicationResources").getString("live.newcmsurl") + ResourceBundle.getBundle("ApplicationResources").getString("get.contacts");
					}
					else
					{
						contactUrl = ResourceBundle.getBundle("ApplicationResources").getString("staging.newcmsurl") + ResourceBundle.getBundle("ApplicationResources").getString("get.contacts");
					}
				    String agentLoginResult 					   = urlfetcher.urlFetchPOST(userIdJson, contactUrl);
					TypeReference<HashMap<String, Object>> objRef  = new TypeReference<HashMap<String, Object>>() {};
				    agentLoginMap = mapper.readValue(agentLoginResult, objRef);
				    log.info("this is the agent login Map got from CMS :: "+agentLoginMap);
				    AgentLogintoReturn  = (String) agentLoginMap.get("contact").get(0).get("login");
				    log.info("this is the agent login we got from CMS :: "+AgentLogintoReturn);
				    return AgentLogintoReturn;
				}
			}
		}
		
		
	 	public String formatAndStoreChatinCache ( ArrayList<HashMap<String,Object> > newDataStoredinDB )
		{
	 		ArrayList<HashMap<String,Object>> chatHistoryList = new ArrayList<HashMap<String,Object>>();
	 		HashMap<String,Object> interactionObjectToStoreMap= new HashMap<String,Object>();
	 		String interactionId 						= "";
	 		String connectionId 						= "";
	 		String messages		 						= "";
	 		String metaData								= "";
	 		String AgentLogin	 						= "";
	 		String subAccountNumber 					= "";
	 	    long dateAdded								= 0 ;
	 	    String	domain								= "";
			String domainnameList						= "";
			String subAccountList						= "";
			String action								= "";
			HashMap<String, String> domainlistMap		= new HashMap<String,String>();
			ObjectMapper mapper							= new ObjectMapper();
	 		
	 		for (HashMap <String, Object> singleDataStoredinDB : newDataStoredinDB)
	 		{
	 			HashMap<Object, Object> singleChatStatus = new HashMap<Object, Object>();
	 			singleChatStatus = (HashMap<Object, Object>) singleDataStoredinDB.get("interaction");
	 			
	 			if("unanswered".equalsIgnoreCase((String) singleChatStatus.get("status")) || "b0fdad11-0bf5-457b-804a-2914d546d8c2".equalsIgnoreCase((String) singleChatStatus.get("type")) || ! ("a1605fa7-022e-4b95-941f-63e86d19a5a5".equalsIgnoreCase((String) singleChatStatus.get("apiKey")) ) )
	 			{
	 				log.info("not storing unanswered chat");
	 				return "failure";
	 			}
	 			
	 			HashMap<String, Object> singleChatHistoryMap = new HashMap<String,Object>();
	 			try
	 			{
	 				singleChatHistoryMap.put("AgentLogin", getAgentLoginForUserId((String )singleChatStatus.get("userId") ) );
	 			}
	 			catch(Exception e)
	 			{
	 				singleChatHistoryMap.put("AgentLogin","NA");
	 				log.info("the agent login function threw an exception and this is the userId :: "+singleChatStatus.get("userId"));
	 				e.printStackTrace();
	 			}
	 			singleChatHistoryMap.put("connectionId", singleChatStatus.get("connectionId") );
	 			singleChatHistoryMap.put("action", singleChatStatus.get("status") );
	 			singleChatHistoryMap.put("dateAdded", singleChatStatus.get("dateAddedInMillisecond") );
	 			singleChatHistoryMap.put("date", singleChatStatus.get("dateAddedInMillisecond") );
	 			chatHistoryList.add(singleChatHistoryMap);
	 			if(String.valueOf(singleChatStatus.get("status")).equalsIgnoreCase(ResourceBundle.getBundle("ApplicationResources").getString("work.answered-chat")) || String.valueOf(singleChatStatus.get("status")).equalsIgnoreCase(ResourceBundle.getBundle("ApplicationResources").getString("work.invited")))
	 			{
	 				try 
	 				{
		 				AgentLogin		 = getAgentLoginForUserId(String.valueOf(singleChatStatus.get("userId") ));
		 				log.info("Just printing this to see the agent login "+ String.valueOf(singleChatStatus.get("userId") ));
	 				}
	 				catch(Exception e) 
	 				{
	 					log.info("Error occured at "+e.getMessage());
	 				}
	 			}
	 			if(ResourceBundle.getBundle("ApplicationResources").getString("work.closed-unanswered-chat").equalsIgnoreCase((String) singleChatStatus.get("status")) || ResourceBundle.getBundle("ApplicationResources").getString("work.closed-chat").equalsIgnoreCase((String) singleChatStatus.get("status")) || ResourceBundle.getBundle("ApplicationResources").getString("work.offlineformclosed").equalsIgnoreCase((String) singleChatStatus.get("status")) || ResourceBundle.getBundle("ApplicationResources").getString("work.prechatsurveyclosed").equalsIgnoreCase((String) singleChatStatus.get("status")))
	 			{
	 				action			 = (String) singleChatStatus.get("status");
	 				interactionId    = (String) singleChatStatus.get("interactionId");
	 				connectionId     = (String) singleChatStatus.get("connectionId");
//	 				AgentLogin       = (String) singleChatHistoryMap.get("AgentLogin");
	 				subAccountNumber = (String) singleChatStatus.get("accountNumber");
	 				dateAdded		 = (long) singleChatStatus.get("dateAddedInMillisecond");
	 				log.info("this is the long date added value"+dateAdded);
	 			
	 				
	 				ArrayList<HashMap<String,String>> interactionInfoList =   (ArrayList<HashMap<String, String>>) singleDataStoredinDB.get("interactionInfo");
	 				try
	 				{
	 					for(HashMap<String,String> individualInteractionInfo : interactionInfoList)
	 					{	
	 						if(("contactinfo").equalsIgnoreCase(String.valueOf(individualInteractionInfo.get("title")).trim()))
	 						{
	 							messages	=	individualInteractionInfo.get("value").toString();
	 						}
	 						if(("metaData").equalsIgnoreCase(String.valueOf(individualInteractionInfo.get("title")).trim()))
	 						{							
								metaData	=	individualInteractionInfo.get("value").toString();
							}
	 					}		
	 				}
	 				catch(Exception e)
	 				{
	 					messages				=	"";
	 				}
	 			}
	 		}
	 		try 
	 		{
	 			messages 				= 	URLEncoder.encode(messages, "UTF-8");
	 		} 
	 		catch (Exception e) 
	 		{
	 			e.printStackTrace();
	 		}
	 		ArrayList<String> accountForDomainList = new ArrayList<String>();
			accountForDomainList.add(subAccountNumber);
			try
			{
				subAccountList  =   mapper.writeValueAsString(accountForDomainList);
				domainnameList	=	new AdminQueueGae().getDomainNamesFromCache(subAccountList);
				domainlistMap   = 	mapper.readValue(domainnameList, new TypeReference<HashMap<String, String>>() {});
				domain			=   domainlistMap.get(subAccountNumber);
				if(AgentLogin == null || "".equalsIgnoreCase(AgentLogin) || "null".equalsIgnoreCase(AgentLogin)) AgentLogin = "NA";
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
	 		interactionObjectToStoreMap.put("subAccountNumber", subAccountNumber);
	 		interactionObjectToStoreMap.put("interactionId", interactionId);
	 		interactionObjectToStoreMap.put("interactionHistory", chatHistoryList);
	 		interactionObjectToStoreMap.put("answerTime", "");
	 		interactionObjectToStoreMap.put("connectionId", connectionId);
	 		interactionObjectToStoreMap.put("dateAdded", dateAdded);
	 		interactionObjectToStoreMap.put("parentInteractionId", interactionId);
	 		interactionObjectToStoreMap.put("timeSpent", "");
	 		interactionObjectToStoreMap.put("date", dateAdded);
	 		interactionObjectToStoreMap.put("messages", messages);
	 		interactionObjectToStoreMap.put("metaData", metaData);
	 		interactionObjectToStoreMap.put("AgentLogin", AgentLogin);
	 		interactionObjectToStoreMap.put("domain", domain);
	 		interactionObjectToStoreMap.put("action", action);
	 		interactionObjectToStoreMap.put("scheduledTime", "NA");
	 		interactionObjectToStoreMap.put("interactionType", "SBChat");
	 		
	 		HashMap<String, Object> storetoCacheMap = new HashMap<String,Object>();
	 		storetoCacheMap.put(interactionId, interactionObjectToStoreMap);
	 		
	 		CacheManagerHelper cachemanager =   new CacheManagerHelper();
	 		CacheUpdateHelper	cacheupdate	=	new CacheUpdateHelper();
			String unipin                   = cacheupdate.UUIDGenerator();
			HashMap<String,Object> interactionListMap = new HashMap<String,Object>();
			HashMap<String,String> accountInteractionIdMap = new HashMap<String,String>();
			accountInteractionIdMap.put(interactionId, (String) interactionObjectToStoreMap.get("subAccountNumber") );
			interactionListMap.put("interactionIDList", accountInteractionIdMap);
			interactionListMap.put("cursorData", "addFirst");
			String keySet = "";
			try 
			{
				cachemanager.setCache(storetoCacheMap, interactionId);
				keySet = cachemanager.setCache(interactionListMap, unipin);
			}
			catch (Exception e) 
			{
				e.printStackTrace();
			}
			
			HashMap<Object,Object> dataMap = new HashMap<Object, Object>();
			dataMap.put("newkey", unipin);
			dataMap.put("fromdate", dateAdded);
			dataMap.put("todate", dateAdded);
			dataMap.put("cursorData", "addFirst");
			String param = "";
			try
			{
				param = mapper.writeValueAsString(dataMap);
			}
			catch (Exception e) 
			{
				e.printStackTrace();
				return "failure";
			}
			if("success".equalsIgnoreCase(keySet))
			{
				log.info("key set successfully "+unipin);
				log.info("this is the param value that will go to the queue settocache :: "+param);
				Queue lQueue =	QueueFactory.getQueue("cachetranscript");
				lQueue.add( TaskOptions.Builder.withUrl("/settocachenew").param("paramMap", param));
			}	
			return "success";
		}
	 		
}
