package com.acti.service;

import java.io.IOException;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.TimeZone;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.acti.DTO.Transcripts;
import com.acti.JDO.AccountsJDO;
import com.acti.JDO.ChatAccountJDO;
import com.acti.JDO.EntireReportJDO;
import com.acti.controller.AdminQueueGae;
import com.acti.util.JdoUtil;
import com.acti.util.ModeUtil;
import com.acti.util.URLFetch;
import com.google.appengine.api.datastore.Cursor;
import com.google.apphosting.datastore.EntityV4.Key;

import org.codehaus.jackson.map.ObjectMapper;
import org.datanucleus.store.appengine.query.JDOCursorHelper;


public class ToolsService {

	private static final Logger log = Logger.getLogger(ToolsService.class.getName()) ;	
	@SuppressWarnings("unchecked")
	public String processCsv(HashMap<String,Object> csvInfo)
	{
		ArrayList<String> key 								 = new ArrayList<String>();
		ResourceBundle resourceBundle 						 = ResourceBundle.getBundle("ApplicationResources");
		ArrayList<List<String>>   csvData 					 = null;
		HashMap<String,String> interaction 					 = null;
		ModeUtil lModeUtil									 = new ModeUtil();
		HashSet<String>	subAccountNumberset				     = null;
		HashMap<String,Object> lookupTableInfo				 = null;
		String uploadTime									 = "";
		ArrayList<String>	subAccountNumberList		     = null;
		ArrayList<HashMap<String,String>> interactionList	 = new  ArrayList<HashMap<String,String>>();
		HashMap<String,Object> arDataMap 					 = null;
		String triggerArUrl									 = null;
		ObjectMapper mapper  								 = new ObjectMapper();
		URLFetch urlFetch								     = null;
		String response										 = "failed";
		String mode											 = "";
		String jobSystemURL 								 = "";
		try 
		{
			csvData				 = new ArrayList<List<String>>();
			mode 				 = new ModeUtil().getMode();
			subAccountNumberset  = new HashSet<String>();
			lookupTableInfo		 = new HashMap<String,Object>();
			urlFetch			 = new URLFetch();
			arDataMap		     = new HashMap<String,Object>();
			uploadTime			 = String.valueOf(new Date().getTime());
			triggerArUrl         = lModeUtil.getArCoreEngineURLByMode() + "/triggerARList" ;
			
			csvData 	 = (ArrayList<List<String>>) csvInfo.get("csvData");
			
			for(int i = 0; i <= csvData.get(0).size()-1 ; i++)
				key.add(csvData.get(0).get(i));
			
			for(int i = 1; i < csvData.size()-1; i++ )
			{
				interaction = new HashMap<String, String>();
				for(int j= 0; j <= csvData.get(i).size()-1; j++)
				{
					interaction.put(key.get(j),csvData.get(i).get(j));
					
					if(key.get(j).equalsIgnoreCase("accountnumber"))
						subAccountNumberset.add(csvData.get(i).get(j));
							
				}
				interactionList.add(interaction);
			}
			
			arDataMap.put("interactionList",interactionList);
			arDataMap.put("uploadTime", uploadTime);
			response = new URLFetch().urlFetchPOST(mapper.writeValueAsString(arDataMap), triggerArUrl);
			
			subAccountNumberList = new ArrayList<String>(subAccountNumberset);
			lookupTableInfo.put("subaccountNumbersList", subAccountNumberList);
			lookupTableInfo.put("uploadTime",uploadTime);
			lookupTableInfo.put("fileName", String.valueOf(csvInfo.get("csvFileName")));
			
			if(mode.equalsIgnoreCase("live"))
				jobSystemURL = resourceBundle.getString("live.cms.url");
			else
				jobSystemURL = resourceBundle.getString("staging.cms.url");
			
			jobSystemURL = jobSystemURL + "/addPendingInteractionsLookups";
			response     = urlFetch.urlFetchPOST(mapper.writeValueAsString(lookupTableInfo), jobSystemURL);
			
			log.info("Received response successfully after triggering AR");
		} 
		catch (Exception e) 
		{
			log.log(java.util.logging.Level.SEVERE, e.getMessage(), e);
		}
		return response;
	}

	
	// validaiton for uploading csv file for addskills
	
	
	
	public HashMap<String, Object> processnewCsv(ArrayList<ArrayList<String>> totalCsvData)
	{	
		//TODO: Validate the headers First if they are correct or not..?
		log.info("entered processnewCSV!");
		if(totalCsvData.size() > 1)
		{			
			ArrayList<String>	keys						= new ArrayList<String>(totalCsvData.get(0));
			HashMap<String,Object> 	responseMap				= new HashMap<String,Object>();
			Set<String>   uniqueAccountNumbers				= new HashSet<String>();
			Set<String>	  invalidAccountNumbers				= new HashSet<String>();
			ModeUtil lModeUtil								= new ModeUtil();
			ObjectMapper mapper 							= new ObjectMapper();
			ArrayList<HashMap<String, String>> totalLoginSkillList = new ArrayList<HashMap<String, String>>();
			
			ArrayList<HashMap<String, String>> finalLoginListTocall = new ArrayList<HashMap<String, String>>();
			ArrayList<HashMap<String,Object>>	finalActiveResponseList		=	new ArrayList<HashMap<String,Object>>();
			String skillAddURL	= 	"";	
			URLFetch urlfetch = new URLFetch();	
			HashMap<String, String> map1	= new HashMap<String, String>();
			try
			{								
				if(keys.contains("agentLogin") && keys.contains("skillTitle")  && keys.contains("skillTypeId")  && keys.contains("skillLevel")  && keys.contains("skillUrl") )
				{
					for(ArrayList<String> singleRow : totalCsvData)
					{
						try
						{			
							if (singleRow.equals(totalCsvData.get(0)))
							{
								continue;
							}
							HashMap<String, String> singleSkillData = new HashMap<String, String>();
							singleSkillData.put("operation","insert");
							singleSkillData.put("skillLevel",singleRow.get(3));
							singleSkillData.put("title", singleRow.get(1));
							singleSkillData.put("email", singleRow.get(0));
				
							if("webchat".equalsIgnoreCase(singleRow.get(2)) )
							{
								singleSkillData.put("interactionTypeId","70158413-3ae0-4896-80b7-50d411ad0cd2");
							}
							else
							{
								singleSkillData.put("interactionTypeId","8333d8c0-e22a-4e32-9bf5-0f578461823e");	
							}
							try
							{
								singleSkillData.put("url", singleRow.get(4));
							}
							catch(Exception e)
							{
								singleSkillData.put("url", "");	
							}
							
							totalLoginSkillList.add(singleSkillData);	
						}
						catch(Exception e)
						{
							log.info("skipping one row please check"+singleRow);
							continue;
						}
					}
						finalLoginListTocall = new ArrayList<HashMap<String, String>>(totalLoginSkillList);
						
						HashSet<String> setOfSkills = new HashSet<String>();
						HashMap<String, ArrayList<String>> skillAgentListMap = new HashMap<String, ArrayList<String>>();
						for (HashMap<String, String> singleLoginRow : totalLoginSkillList)
						{
							setOfSkills.add( singleLoginRow.get("title") );
							try
							{
								ArrayList<String> listOfAgentsUnderSkill = skillAgentListMap.get( singleLoginRow.get("title") );
								listOfAgentsUnderSkill.add(singleLoginRow.get("email"));		
								skillAgentListMap.put( singleLoginRow.get("title"), listOfAgentsUnderSkill);
							}
							catch(Exception e)
							{
								ArrayList<String> listOfAgentsUnderSkill = new ArrayList<String>();
								listOfAgentsUnderSkill.add(singleLoginRow.get("email"));		
								skillAgentListMap.put( singleLoginRow.get("title"), listOfAgentsUnderSkill);
							}
						}
						log.info("this is the map we shud check !!!"+skillAgentListMap);
						String agentExistCheckUrl = "";
						
						if("live".equalsIgnoreCase(lModeUtil.getMode()))
						{
							agentExistCheckUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString("live.newcmsurl" )+ResourceBundle.getBundle( "ApplicationResources" ).getString("agents.forskilltitle");
						}
						else
						{
							agentExistCheckUrl	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.newcmsurl" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "agents.forskilltitle" );
						}
						
						String currentCursor = "";
						for(String singleTitle : skillAgentListMap.keySet() )
						{
							do
							{
								log.info("this is the skill for which we are entering:: "+singleTitle);
								log.info("entered for this currentCursor value!! :: "+currentCursor);
								ArrayList<String> listOfAgentsUnderThisSkill = skillAgentListMap.get(singleTitle);
								String params = "?apikey=SEN42&skillSetTitle="+singleTitle+"&cursor="+currentCursor;
								String resultofAgentExist="";
								try
								{
									resultofAgentExist = urlfetch.httpUrlFetchGET(agentExistCheckUrl+params);
								}
								catch(Exception e)
								{
									currentCursor = "";
									break;
								}
						
							//try
							
								try
								{
									ArrayList<HashMap<String, Object>> contactSlkillSetList = new ArrayList<HashMap<String, Object>>(); 
									contactSlkillSetList = (ArrayList<HashMap<String, Object>>) mapper.readValue( resultofAgentExist, HashMap.class).get("contactSkillSet");
						
									ArrayList<HashMap<String, Object>> contactList = new ArrayList<HashMap<String, Object>>(); 
									contactList = (ArrayList<HashMap<String, Object>>) mapper.readValue( resultofAgentExist, HashMap.class).get("contact");
							
									for( HashMap<String, Object> singleContact: contactList)
									{
										if(listOfAgentsUnderThisSkill.contains( singleContact.get("login")) )
										{
											for ( HashMap<String,String> singleFinalMap : totalLoginSkillList )
											{
												if ( singleContact.get("login").toString().equalsIgnoreCase( singleFinalMap.get("email") ) && singleTitle.equalsIgnoreCase(singleFinalMap.get("title")) )
												{
													log.info("going to remove this !! updated"+singleFinalMap);
													try
													{
														int removeIndex = finalLoginListTocall.indexOf( (singleFinalMap) );
														finalLoginListTocall.remove(removeIndex);
													}
													catch(Exception e)
													{
														continue;
													}
												}
											}
										}
									}	
									//
									if (contactSlkillSetList.size() > 50 || contactSlkillSetList.size() == 50)
									{
										currentCursor = (String) mapper.readValue( resultofAgentExist, HashMap.class).get("cursor");
									}
									else
									{
										currentCursor = "";
									}
							//
							
								}
								catch(Exception e)
								{
									log.info("exception occured so we are forcefull removing the skill");
									for ( HashMap<String,String> singleFinalMap : totalLoginSkillList )
									{
										if ( singleTitle.equalsIgnoreCase( singleFinalMap.get("title") ) )
										{
											int removeIndex = finalLoginListTocall.indexOf( (singleFinalMap) );
											finalLoginListTocall.remove(removeIndex);
										}
									}								
									continue;
								}		
							}		
							while( !("".equalsIgnoreCase(currentCursor)) );							

						}
						
					log.info("bulldozer this is the final MAP!!"+finalLoginListTocall);	
					
					if("live".equalsIgnoreCase(lModeUtil.getMode()))
					{
						skillAddURL	= ResourceBundle.getBundle( "ApplicationResources" ).getString("live.newcmsurl" )+ResourceBundle.getBundle( "ApplicationResources" ).getString("multiple.skilladd.url");
					}
					else
					{
						skillAddURL	= ResourceBundle.getBundle( "ApplicationResources" ).getString( "staging.newcmsurl" )+ResourceBundle.getBundle( "ApplicationResources" ).getString( "multiple.skilladd.url" );
					}					
					
					if (finalLoginListTocall.size() > 0)
					{
						for(HashMap<String, String> singleSkills : finalLoginListTocall)
						{
							try
							{
								String resultObtained = urlfetch.urlFetchPOST(mapper.writeValueAsString( singleSkills ),skillAddURL);
								log.info("the result we obtained :"+resultObtained);
							}
							catch(Exception e)
							{
								log.info("this call failed, check it please :: "+singleSkills);
								continue;
							}
						}
					}
					else
					{
						responseMap.put("success", false);
						responseMap.put("resultMsg", "all skills already exist, nothing new was added");
						return responseMap;
					}
				}	
				else
				{
					responseMap.put("success", false);
					responseMap.put("resultMsg", "heading mismatch");
					return responseMap;
				}
				responseMap.put("success", true);
				responseMap.put("resultMsg", "successfully added");
			}
			catch(Exception e)
			{
				log.log(java.util.logging.Level.SEVERE, e.getMessage(), e);
				responseMap.put("success", false);
				responseMap.put("resultMsg", "Exception occured");

			}
			return responseMap;
		}	
		else
		{
			HashMap<String,Object> 	responseMap				= new HashMap<String,Object>();
			responseMap.put("success", false);
			responseMap.put("resultMsg", "file does not have any data");
			return responseMap;
		}
	}

	public String getPendingInteractionsBySubAccountNo(String subAccountNumber)
	{
		ResourceBundle resourBundle = null;
		ModeUtil modeUtil 			= null;
		String cmsURL      = "";
		String lookupsList = "";
		try
		{
			modeUtil     = new ModeUtil();
			resourBundle = ResourceBundle.getBundle("ApplicationResources");
			
			if("live".equalsIgnoreCase(modeUtil.getMode()))
				cmsURL = resourBundle.getString("live.cms.url") + "/fetchPendingInteractionsLookups?subAccountNumber="+subAccountNumber;
			else
				cmsURL = resourBundle.getString("staging.cms.url") + "/fetchPendingInteractionsLookups?subAccountNumber="+subAccountNumber;
			
			lookupsList = new URLFetch().httpUrlFetchGET(cmsURL);
		}
		catch(Exception ex)
		{
			log.info("Exception occured while getting the pending interactions ::" +ex.getMessage());
		}
		return lookupsList;
	}
	
	public String getNoOfPendingInteractionsfromFH(String lookupEntries)
	{
		String PendingInteractionsCounts = "{}";
		ModeUtil      modeutil  		 = null;;
		String arCoreEngineURL           = "";
		
		try
		{
			modeutil                  = new ModeUtil();
			arCoreEngineURL 		  = modeutil.getArCoreEngineURLByMode()+"/getNoOfPendingInteractionsfromFH";
			PendingInteractionsCounts = new URLFetch().urlFetchPOST(lookupEntries, arCoreEngineURL);
		}
		catch(Exception ex)
		{
			log.info("an Exception occured while getting the pending interactions ::"+ex.getMessage());
		}	
		return PendingInteractionsCounts;
	}
	
	
	public String updatePendingInteractionsBySubAccountNo(String lookupToBeUpdated)
	{
		ResourceBundle resourBundle = null;
		ModeUtil modeUtil 			= null;
		String cmsURL        = "";
		String updatedLookup = "";
		try
		{
			log.info("lookupToBeUpdated here="+lookupToBeUpdated);
			modeUtil     = new ModeUtil();
			resourBundle = ResourceBundle.getBundle("ApplicationResources");
			
			if("live".equalsIgnoreCase(modeUtil.getMode()))
				cmsURL = resourBundle.getString("live.cms.url") + "/updatePendingInteractionsLookups";
			else
				cmsURL = resourBundle.getString("staging.cms.url") + "/updatePendingInteractionsLookups";
			
			updatedLookup = new URLFetch().urlFetchPOST(lookupToBeUpdated, cmsURL);
		}
		catch(Exception ex)
		{
			log.info("Exception occured while making a update call for pending interactions look ups"+ex.getMessage());
		}
		
		return updatedLookup;
		
	}
	

	
	public String getDailyReportOnActiveResponse() 
	{
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM-dd-yyyy");
		try
		{
			
			Date toTime = new Date();
			toTime 	= simpleDateFormat.parse(simpleDateFormat.format(toTime));
			toTime.setHours(toTime.getHours());
			
			Date fromTime	= new Date();	
			fromTime.setHours(fromTime.getHours()-24);
			fromTime 		= simpleDateFormat.parse(simpleDateFormat.format(fromTime));
			
			Calendar 	toTimeCal		= Calendar.getInstance();
			toTimeCal.setTime(toTime);
			Calendar 	fromTimeCal		= Calendar.getInstance();
			fromTimeCal.setTime(fromTime);
			
			log.info("To Time"+toTime);
			log.info("From Time"+fromTime);
		
			new FullHistoryService().generateReportsFromFullHistory(fromTimeCal, toTimeCal);
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE, e.getMessage(), e);
		}
		return "";
	}
	
	public String persistReportToDB(HashMap<String,HashMap<String,Integer>> reportList , Calendar fromTime)
	{
		//TODO : Create A report to set in DB
		EntireReportJDO entireReportJDO	=	null;
		ArrayList<EntireReportJDO> entireReportJDOList	=	null;
		HashMap<String,Integer> reportMap	= null;	
		PersistenceManager pm	= null;
		Date oneDayBefore	=	fromTime.getTime();
		try
		{
			pm = JdoUtil.get().getPersistenceManager();
			entireReportJDOList	=	new ArrayList<EntireReportJDO>();

			for(int i=0;i<=2;i++)
			{
				entireReportJDO	=	new EntireReportJDO();
				reportMap	=	new HashMap<String,Integer>();
				if( i == 0)
				{
					reportMap	= reportList.get("ARExternalReport");
					entireReportJDO.setType("AR-External");
				}
				else if(i==1)
				{
					reportMap	= reportList.get("ARInternalReport");
					entireReportJDO.setType("AR-Internal");
				}
				else
				{
					reportMap	= reportList.get("ChatExternalReport");
					entireReportJDO.setType("Chat-External");
				}

				entireReportJDO.setDate(oneDayBefore);
				if(reportMap.containsKey("Scheduled"))
					entireReportJDO.setScheduled(reportMap.get("Scheduled"));
				if(reportMap.containsKey("InActive"))
					entireReportJDO.setInActive(reportMap.get("InActive"));
				if(reportMap.containsKey("Answered"))
					entireReportJDO.setAnswered(reportMap.get("Answered"));
				if(reportMap.containsKey("InProgress"))
					entireReportJDO.setInProgress(reportMap.get("InProgress"));
				if(reportMap.containsKey("InProgressChat"))
					entireReportJDO.setInProgresschats(reportMap.get("InProgressChat"));
				if(reportMap.containsKey("unanswered"))
					entireReportJDO.setUnAnswered(reportMap.get("unanswered"));
				if(reportMap.containsKey("Completed"))
					entireReportJDO.setCompleted(reportMap.get("Completed"));
				if(reportMap.containsKey("Completed-F8"))
					entireReportJDO.setCompletedF8(reportMap.get("Completed-F8"));
				if(reportMap.containsKey("Callended"))
					entireReportJDO.setCallended(reportMap.get("Callended"));
				if(reportMap.containsKey("Dialout"))
					entireReportJDO.setDialout(reportMap.get("Dialout"));
				if(reportMap.containsKey("Completed-Fetch"))
					entireReportJDO.setCompletedFetch(reportMap.get("Completed-Fetch"));
				if(reportMap.containsKey("Completed-Resolved"))
					entireReportJDO.setCompletedResolved(reportMap.get("Completed-Resolved"));
				if(reportMap.containsKey("Completed-TabClose"))
					entireReportJDO.setCompletedTabClose(reportMap.get("Completed-TabClose"));
				if(reportMap.containsKey("closed"))
					entireReportJDO.setClosed(reportMap.get("closed"));
				if(reportMap.containsKey("Failed"))
					entireReportJDO.setFailed(reportMap.get("Failed"));
				if(reportMap.containsKey("InQueue(IR)"))
					entireReportJDO.setInqueue(reportMap.get("InQueue(IR)"));
				if(reportMap.containsKey("Misc"))
					entireReportJDO.setMisc(reportMap.get("Misc"));
				if(reportMap.containsKey("Total"))
					entireReportJDO.setTotal(reportMap.get("Total"));

				entireReportJDOList.add(entireReportJDO);
			}

			pm.makePersistentAll(entireReportJDOList);
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE, e.getMessage(), e);
		}
		finally
		{
			if(pm != null)
				pm.close();
		}

		return "";
	}
	
	public List<EntireReportJDO> getStatisticsbyDate(Date fromdate,Date todate)
	{
		log.info("From date is : "+fromdate);
		log.info("To date is : "+todate);
		PersistenceManager 		pm  	= null;
		List<EntireReportJDO> result    = null;
		Query 					query;
		pm 		= JdoUtil.get().getPersistenceManager();

			query 	= pm.newQuery(EntireReportJDO.class,"date>=fromdate && date<=todate");
		

		log.info("query:: "+query);
		query.declareImports("import java.util.Date");
		query.declareParameters("Date fromdate,Date todate");
		result = (List<EntireReportJDO>) query.execute(fromdate,todate);	
		log.info("quired data size"+result.size());
		return result;
	}
	
	public void insertOrUpdateChatAccountJDO(ArrayList<HashMap> lActiveAccountList)
	{
		ChatAccountJDO chatAccountJDO = null;
		String 				 clientID = "";
		try
		{
		  for(HashMap statusMap :lActiveAccountList)
		  {
			chatAccountJDO = new ChatAccountJDO();
			
			deleteChatAccountJdoentries((String)statusMap.get("clientid"),String.valueOf(statusMap.get("clienturl")));
				 
		    clientID = ((String)statusMap.get("clientid")).replaceAll("\\s","");
			createChatAccountJDO(chatAccountJDO,(String)statusMap.get("browsername"),clientID,(String)statusMap.get("brandId"),(String)statusMap.get("intaractionTypeId"),
						(String)statusMap.get("clienturl"),(String)statusMap.get("date"),(String)statusMap.get("clientipaddress"),(String)statusMap.get("browserversion"),(String)statusMap.get("event"),(String)statusMap.get("os"),(String)statusMap.get("historyid"),(String)statusMap.get("clientguid"),(String)statusMap.get("vsid"),(String)statusMap.get("chatwindowtype"),(String)statusMap.get("signupdate"),(String)statusMap.get("uniquepin"),(String)statusMap.get("activestatus"));
			PersistenceManager pm=JdoUtil.get().getPersistenceManager(); 
			try
			{
			   pm.makePersistent(chatAccountJDO);
			   log.info("Data  inserted to the bigtable successfully");
			} 
			finally
			{
			   pm.close();
			}
		  }
		}
		catch(Exception e)
		{
			e.printStackTrace();
			log.info("Exception in the method insertOrUpdateChatAccountJDO ::"+e.getMessage());
		}
	}
	
	@SuppressWarnings("unchecked")
	public void  deleteChatAccountJdoentries(String clientId,String clientURL)
	{
		PersistenceManager 			pm 							= 	null;
		Query 						query 						= 	null;
		List<ChatAccountJDO>        chatAccountJDOList			=   null;
		HashMap<String,String>		domainNameBySubAcc			=   null;
		ArAccountManagerService		arService					=   null;
		ObjectMapper 				mapper						=   null;
		
		try
		{
			log.info("deleteChatAccountJdoentries -> clientId::"+clientId+" clientURL::"+clientURL);
			clientId = clientId.replaceAll("\\s","");
			pm									=	JdoUtil.get().getPersistenceManager(); 
			query 								= 	pm.newQuery( ChatAccountJDO.class , "clientId=='"+clientId.trim()+"'");
			chatAccountJDOList					=	(List<ChatAccountJDO>)query.execute();
			
			if(chatAccountJDOList.size() > 0)
			{
				for(ChatAccountJDO li : chatAccountJDOList)
				{
					pm.deletePersistent(li);
				}
			}
			else
			{
				log.info("ChatAccountJDO is not present of this clientId::"+clientId);
				domainNameBySubAcc	=   new HashMap<String,String>();
				arService           =   new ArAccountManagerService();
				mapper              =   new ObjectMapper();
				domainNameBySubAcc.put("subAccountNumber", clientId);
				domainNameBySubAcc.put("domainName", clientURL);
				arService.updateAccount(mapper.writeValueAsString(domainNameBySubAcc));
			}
			
		}
		catch(Exception e)
		{
			log.log( java.util.logging.Level.INFO  , e.getMessage() ,  e);
		}
		finally
		{
			pm.close();
		}
	}

	public ChatAccountJDO createChatAccountJDO(ChatAccountJDO chatAccountJDO,String clientBrowserName,String clientId,String brandId,String intaractionTypeId,String clientUrl,String date,String clientIPAddress,String clientBrowserVersion,String event,String os,String historyId,String clientGuid,String vsId,String chatWindowType,String signUpDate,String uniquepin , String activeStatus)
	{
		try
		{
			chatAccountJDO.setClientBrowserName(clientBrowserName);
			chatAccountJDO.setClientId(clientId.replaceAll("\\s",""));
			chatAccountJDO.setClientUrl(clientUrl);
			chatAccountJDO.setDate(date);
			chatAccountJDO.setClientIPAddress(clientIPAddress);
			chatAccountJDO.setBrowserVersion(clientBrowserVersion);
			chatAccountJDO.setEvent(event);
			chatAccountJDO.setOs(os);
			chatAccountJDO.setHistoryId(historyId);
			chatAccountJDO.setClientGuid(clientGuid);
			chatAccountJDO.setVsId(vsId);
			chatAccountJDO.setChatWindowType(chatWindowType);
			chatAccountJDO.setSignUpDate(signUpDate);
			chatAccountJDO.setActiveStatus(activeStatus);
			chatAccountJDO.setUniquepin(uniquepin);
			chatAccountJDO.setBrandId(brandId);
			chatAccountJDO.setIntaractionTypeId(intaractionTypeId);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			log.info("Exception while creating ChatAccountJDO ::"+e.getMessage());
		}
		return chatAccountJDO;
	}
}
