package com.acti.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.acti.controller.AdminQueueGae;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

public class CacheManagerHelper
{
	private static final Logger log = Logger.getLogger(CacheManagerHelper.class.getName());
	public void setDataToCacheAsHash(String priKey,HashMap<String, Object> Datamap)
	{
		String key = priKey;
		ObjectMapper mapper = new ObjectMapper();
		
		try
		{
			StringWriter writer   =   new StringWriter();
			mapper.writeValue(writer,Datamap);
			String transcript 		= writer.toString();
			setCacheAsBytes(transcript.getBytes(), key);
		}
		catch (Exception e) 
		{
			log.log(Level.SEVERE, e.getMessage(), e);
		}
	}
	public String setCacheAsBytes(byte[] fileBytes,String key) throws Exception {


		int offset = 0;
		HashMap<String,Object> transcriptMap	= new HashMap<String,Object>();
		//int fileCounter 		= 0;
		int count				= 0;
		int nextkeycounter		= 0;	
		int iterationreq		=	fileBytes.length / 900000+1;
		while (offset < fileBytes.length)
		{
			transcriptMap	= new HashMap<String,Object>();
			byte[] outputBytes;

			if(fileBytes.length - offset < 900000 )
			{
				outputBytes = new byte[fileBytes.length - offset];
				System.arraycopy(fileBytes, offset, outputBytes, 0, fileBytes.length - offset);
				transcriptMap.put("value", outputBytes);
				if(count+1<iterationreq)
				{
					nextkeycounter = count+1;
					transcriptMap.put("nextkey", key+"_"+nextkeycounter);
				}
				else
				{
					transcriptMap.put("nextkey","");
				}
				
				if(count != 0)
					persistDataToCache(key+"_"+count,transcriptMap);
				else
					persistDataToCache(key,transcriptMap);
				count	=	count+1;
				log.info("this is the key :: "+key+" and this is the count :: "+count+"and this is the object stored :: "+transcriptMap);
				break;
			}
		
			outputBytes = new byte[900000];
			System.arraycopy(fileBytes, offset, outputBytes, 0, 900000);
			offset +=900000 ; 
			transcriptMap.put("value", outputBytes);
			
			if(count+1<iterationreq)
			{
				nextkeycounter = count+1;
				transcriptMap.put("nextkey",key+"_"+nextkeycounter);
			}else
			{
				transcriptMap.put("nextkey","");
			}
			if(count != 0)
			persistDataToCache(key+"_"+count,transcriptMap);
			else
			persistDataToCache(key,transcriptMap);
			count	=	count+1;
		}
		return "success";
	}
	
	public HashMap getDatafromCachenew(String key)
	{
		String Transcriptdata		=	"";
		ObjectMapper mapper 		= new ObjectMapper();
		HashMap Transcriptmap 	    = null;
		byte[] objectContent = null;
		HashMap <Object , Object> memCacheMapper = null;
		boolean isSkip = false;
		try
		{
				memCacheMapper = getDataFromCache( key );
				if( memCacheMapper != null ) 
				{
					objectContent = new byte[0];
					isSkip = true;
					while( StringUtils.isNotEmpty( key ))
					{
						if( isSkip )
							isSkip = false;
						else 
							memCacheMapper = getDataFromCache( key );
							
							byte[] tempList = (byte[]) memCacheMapper.get("value");
							byte[] tempOriginal = objectContent;
							objectContent = new byte[objectContent.length+tempList.length];
							
							System.arraycopy(tempOriginal, 0, objectContent, 0, tempOriginal.length);
							System.arraycopy(tempList, 0, objectContent, tempOriginal.length, tempList.length);
							
							key = (String)memCacheMapper.get( "nextkey" );	
					}
				}
				if(objectContent !=null)
				{
					Transcriptdata	=	new String(objectContent);
					if(Transcriptdata != null)
					{
						Transcriptmap	=	mapper.readValue(Transcriptdata, HashMap.class);
					}
				}
		}
		catch ( Exception e )
		{
			log.log(Level.SEVERE,"Error in getting cache so returning null getDatafromCachenew()"+e.getMessage(),e);
			return null;
		}
		
		return Transcriptmap;
	}
	
	public void persistDataToCache(String key,HashMap<String,Object> map)
	{
		Object datao = map;
		log.info("key "+key);
		try 
		{
			if(map!=null)
			{
				ByteArrayOutputStream out = new ByteArrayOutputStream();
				ObjectOutputStream os = new ObjectOutputStream(out);
				os.writeObject(datao);
				byte[] value= out.toByteArray();
				MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
				syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
				syncCache.put(key, value); 
			//	log.info("length is here"+value.length);
			}
		} 
		catch (Exception e) 
		{
			log.log(Level.SEVERE,"Error in persistDataToCache() "+e.getMessage(),e);
		}
	}
	
	//Use this function When 
	private HashMap<Object,Object> getDataFromCache(String key)
	{
		HashMap<Object,Object> result 					=	null;
		ObjectInputStream lobjectInputStream 			= 	null;
		Object valueFromCache 							= 	null;

		try 
		{
			//log.info("trying to get data from cache for key ::"+key);

			MemcacheService syncCache 					= 	MemcacheServiceFactory.getMemcacheService();
			
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			
			byte[] value	 							=	(byte[]) syncCache.get(key); 
			
			if (value != null) 
			{
				ByteArrayInputStream lbyteInputStream 	= 	new ByteArrayInputStream(value);
				lobjectInputStream 						=	new ObjectInputStream(lbyteInputStream);
				valueFromCache 							=	lobjectInputStream.readObject();
				lbyteInputStream.close();
				lobjectInputStream.close();
				result 									=	(HashMap<Object, Object>) valueFromCache;
			}
			//log.info("result ::"+result);
		} 
		catch (Exception e) 
		{
			log.log(Level.SEVERE,"Error getting data from local cache"+e.getMessage(),e);
		}
		return result;
	}
	
	public String deleteCache(String key)
	{
		boolean isDeleted 						= 		false;
		String deleted							=		"success";	
		String deletedkey						=		"";	
		String keytoDelete						=		"";
		int keycounter							=		0;
		try 
		{
			
			while(deleted == "success")
			{
				if(keycounter == 0)
				{
					keytoDelete  = key;
				}else{
					keytoDelete	=	key+"_"+keycounter;
				}
			MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			isDeleted 	=	syncCache.delete(keytoDelete);
			deletedkey	=	deletedkey+" ::"+isDeleted+",";
			if(isDeleted == true)
				deleted = "success";
			else
				deleted = "failed";
		
			keycounter = keycounter+1;
			}
			return deletedkey;
		} 
		catch (Exception e) 
		{
			log.log(Level.SEVERE,"Error getting data from local cache"+e.getMessage(),e);
			return "failed";
		}
		
	}
	public String getcache(String key,boolean internal,String accountNo)
	{
	    CacheManagerHelper	cachehelper		=	null;
	    HashMap transcriptData 				= 	null;
	    HashMap	transcriptToSend			=	null;
	    String transcriptString				=	null;
	    Iterator it 						=	null;

		ArrayList specificAccount			=	null;
	    HashMap <String,String> interactiondataAccNo	=	null;
	    ObjectMapper mapper 				=	null;
	    try
	    {
	    	transcriptToSend		=	new HashMap();
	    	interactiondataAccNo	=	new HashMap();
	    	mapper			=	new ObjectMapper();
	    	//array 			=	new JSONArray();
			cachehelper		=	new CacheManagerHelper();	
			transcriptData 	=   cachehelper.getDatafromCachenew(key);
			if(accountNo == null)
			{
				specificAccount	=	new AdminQueueGae().getInternalAccounts();
			}
			else
			{
				specificAccount	=	mapper.readValue(accountNo, ArrayList.class);
			}
			
			if(transcriptData != null)
			{
				it 				= 	transcriptData.entrySet().iterator();
				
				while (it.hasNext()) 
			    {
			        Map.Entry pairs 	=	 (Map.Entry)it.next();
			        Object Trans 		=	 pairs.getValue();       
			        try
			        {
			        	interactiondataAccNo 		= 	(HashMap<String, String>) Trans;
			        	log.info("size of interaction for ::"+interactiondataAccNo.size()+" :: account no ::"+pairs.getKey());
			        	if(interactiondataAccNo.size()>0)
			        	{
			        		if(internal)
			        		{
			        			if(specificAccount.contains(pairs.getKey()))
			        			{
			        				transcriptToSend.putAll(interactiondataAccNo);
			        			}
			        		}
			        		else
			        		{
			        			if(!specificAccount.contains(pairs.getKey()))
			        			{
			        				transcriptToSend.putAll(interactiondataAccNo);
			        			}
			        		}
			        	}
						
					}
			        catch(Exception e)
			        {
			        	log.log(Level.SEVERE,"Error in getting accountNomap getDatafromCachenew()"+e.getMessage(),e);
			        }
			        it.remove(); // avoids a ConcurrentModificationException
			       
			    }
				transcriptString	=	mapper.writeValueAsString(transcriptToSend);
			}
	    }
	    catch(Exception e)
		{
			log.log(Level.SEVERE,"Error in getting accountNomap getDatafromCachenew()"+e.getMessage(),e);
		}
	    log.info("data in key is :::: "+transcriptToSend.size());
	    if(transcriptToSend.size() !=0 )
	    {
	    	return	transcriptString;
	    }

	 return "";
}
	
	
	public String getrawcache(String key)
	{
		String Transcriptdata		=	"";
		ObjectMapper mapper 		= new ObjectMapper();	
		byte[] objectContent = null;
		HashMap <Object , Object> memCacheMap = null;
		boolean isSkip = false;
		try
		{
		
			memCacheMap = getDataFromCache(key);
			if (memCacheMap != null)
			{
				objectContent = new byte[0];
				isSkip = true;
				while (StringUtils.isNotEmpty(key))
				{
					if (isSkip)
						isSkip = false;
					else
						memCacheMap = getDataFromCache(key);
	
					byte[] tempList = (byte[]) memCacheMap.get("value");
					byte[] tempOriginal = objectContent;
					objectContent = new byte[objectContent.length+ tempList.length];
	
					System.arraycopy(tempOriginal, 0, objectContent, 0,tempOriginal.length);
					System.arraycopy(tempList, 0, objectContent,tempOriginal.length, tempList.length);
	
					key = (String) memCacheMap.get("nextkey");
				}
			}
			if (objectContent != null) {
				Transcriptdata = new String(objectContent);
			}
		}
		catch ( Exception e )
			{
				log.log(Level.SEVERE,"Error in getting cache so returning null getDatafromCachenew()"+e.getMessage(),e);
				return null;
			}
		return Transcriptdata;
		
}
	public String getCachedDataIfAvailabile(Date fromdate ,Date todate,String status,boolean internal,String Accountno)
	{
		String result 				=	""; 
		String cachekeyinfo			=	"";
		HashMap ingteractionInfoMap	=	null;
		HashMap ingteractionMap		=	null;
		HashMap listOfMap			=	null;
		ObjectMapper mapper			=	null;

		try
		{
			ingteractionMap							=	new HashMap();
			ingteractionInfoMap						=	new HashMap();
			listOfMap								=	new HashMap();
			ingteractionInfoMap						=	new HashMap();
			mapper									=	new ObjectMapper();
			CacheManagerHelper cachemanager 		=	new CacheManagerHelper();
			MemcacheService syncCache 				=	MemcacheServiceFactory.getMemcacheService();
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			
			SimpleDateFormat formatter 				=	new SimpleDateFormat("MM-dd-yyyy");
			String formattedDate					=	formatter.format(fromdate);
			String key 								=	formattedDate + status;
			String infoKey 							=	formattedDate + status + "info";
		//	String interactionMapKey				=	formattedDate + status + "Infomap";			
			log.info("KEY got is ::" + key);
			
			if (syncCache.contains(key)) 
			{
				if (syncCache.contains(infoKey))
				{
					cachekeyinfo = cachemanager.getrawcache(infoKey);
					if (cachekeyinfo.equalsIgnoreCase("no"))
					{
						result = "failed";
					} 
					else
					{
							
						result 				= 	cachemanager.getcache(key,internal,Accountno);
						if(!"".equals(result))
						{
							ingteractionMap		=	mapper.readValue(result, HashMap.class);
						}
						
						listOfMap.put(status, ingteractionMap);
			
						StringWriter writer   =   new StringWriter();
						mapper.writeValue(writer,listOfMap);

						result    =  writer.toString();
					}
				}
				else
				{
					result = "failed";
				}
			}
			else
			{
				log.info("key not in cache");
				result = "failed";
			}
			//log.info("the key and the info key :: "+key+" :: "+infoKey);
		}
		catch (Exception e) 
		{
			log.log(Level.SEVERE,"Error in getting cache getCacheKeyDataIfAvailabile()"+ e.getMessage(), e);
			result = "failed";
		}
		
		//log.info("the result from the cache for :: "+result);
		return result;
	}
	public String isKeyExists(String key){
		String result							=	"false";
		
			try{
			CacheManagerHelper cachemanager 		=	new CacheManagerHelper();
			MemcacheService syncCache 				=	MemcacheServiceFactory.getMemcacheService();
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			log.info("KEY got is ::" + key);
			if (syncCache.contains(key)) 
			{
				result = "true";
			}else
			{
				result = "false";
			}
			return result;
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Error in getting contains key"+ e.getMessage(), e);
			return "false";
		}
	}
	public String getAccountNamesForAccounts(HashSet<String> accountSet){
		
		//ArrayList<String> accountNumberList	=	null;
		ArrayList<String> oldAccountList	=	null;
		String oldAccountlist				=	"";	
		String 	accList						=	null;
		HashMap oldAccList					=	null;
		HashMap newAccList					=	null;
		ObjectMapper mapper					=	null;
		AdminQueueGae adminquegae			=	null;
		Iterator it 						= 	null;
		String DominStrMap					=	null;
		List<String> list 					= 	null;
		ArrayList acctocall					=	null;
		try
		{
			acctocall			=	new ArrayList();
			list 				=	new ArrayList<String>(accountSet);
			newAccList			=	new HashMap();
			oldAccList			= 	new HashMap();
			adminquegae			= 	new AdminQueueGae();
			mapper				=	new ObjectMapper();
			//accountNumberList	=	new ArrayList<String>();
			oldAccountList		=	new ArrayList<String>();
			
		    //get previously filled Data in cache 
//			
//			try
//			{
//				for(int i=0;i<list.size();i++)
//				{
//					HashMap<Object,Object> accountsMap = getDataFromCache(list.get(i));
//				}
//			}
//			catch(Exception e)
//		    {
//		    	log.log(Level.SEVERE,"Error in setting domin name from cache:::"+ e.getMessage(), e);
//		    }
		    try
		    {
		    	for(int i=0;i<list.size();i++)
		    	{
		    		list.get(i);
		    		String result	=	isKeyExists(list.get(i));
		    		if(!("true".equals(result)))
		    		{
		    			acctocall.add(list.get(i));
		    		}
		    		
		    	}
		    }
		    catch(Exception e)
		    {
		    	log.log(Level.SEVERE,"Error in setting domin name from cache:::"+ e.getMessage(), e);
		    }
		    //get new domain list
		    try
		    {
		    	if(acctocall.size()>0)
		    	{
		    	    accList			=	  mapper.writeValueAsString(acctocall);
				    DominStrMap		=	  adminquegae.getDomainNames(accList);
				    if(DominStrMap != null && !DominStrMap.trim().equals("") && !DominStrMap.trim().equalsIgnoreCase("null"))
				    {
				    	newAccList		=	  mapper.readValue(DominStrMap, HashMap.class);
				    }
		    	}
					it 					= 	  newAccList.entrySet().iterator();
			    while (it.hasNext()) 
			    {
			        Map.Entry pairs 		= (Map.Entry)it.next();
			        String	AccountNumber	=	String.valueOf(pairs.getKey());
			        String  domainName		=	String.valueOf(pairs.getValue());
			        setCacheAsBytes(domainName.getBytes(),AccountNumber);
			        it.remove();
			    }
		    }
		    catch(Exception e)
		    {
		    	log.log(Level.SEVERE,"Error in setting domin name from cache:::"+ e.getMessage(), e);
		    }
		    
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Error in setting domin name to cache:::"+ e.getMessage(), e);
			return "failed";
		}
		return "success";
	}
	public Set<String> deleteCacheInCollection(String dateKey)
	{
		
		ArrayList<String> listOfStatus			=	null;
		MemcacheService syncCache 				=	MemcacheServiceFactory.getMemcacheService();
		String isGet							=	"success";
		Set<String> keysDeleted					=	new HashSet<String>();
		TreeSet		keysDelInOrder				=	null;
		boolean isDeleted						=	false; 
		try
		{
			listOfStatus					=	new ArrayList<String>();
			
			listOfStatus.add("inqueue");
			listOfStatus.add("queued-chat");
			listOfStatus.add("waiting");
			listOfStatus.add("answered-chat");
			listOfStatus.add("answered");
			listOfStatus.add("inprogress");
			listOfStatus.add("scheduled");
			listOfStatus.add("completed");
			listOfStatus.add("closed-chat");
			listOfStatus.add("completed-resolved");
			listOfStatus.add("completed-f8");
			listOfStatus.add("callended");
			listOfStatus.add("dialout");
			listOfStatus.add("completed-tabclose");
			
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			
			for(String list:listOfStatus)
			{
				isGet										=	"success";
				ArrayList<String> listOfKeysToDelete		=	new ArrayList<String>();
				String	keyTodelete							=	null;
				int keycounter								=	1;
				//String	keyTodelete1				=	null;
				if(syncCache.contains(dateKey+list.trim()))
				{
					listOfKeysToDelete.add(dateKey+list);
					while(isGet.trim()	==	"success")
					{
						if(keycounter	==	1)
						{
							
							keyTodelete		=	dateKey+list+"_"+keycounter;
						}
						else 
						{
							keyTodelete		=	dateKey+list+"_"+keycounter;
						}
						if(keyTodelete		!=	null)
						{
							if(syncCache.contains(keyTodelete))
							{
								listOfKeysToDelete.add(keyTodelete);
								isGet		=	"success";
								keycounter	=	keycounter+1;
							}
							else
							{
								isGet		=	"failed";
								break;
							}
						}
						
					}
				}
				else
				{
					continue;
				}
				
				
				syncCache.deleteAll(listOfKeysToDelete);
				keysDeleted.addAll(listOfKeysToDelete);
				
				keysDelInOrder		=	new TreeSet<String>(keysDeleted);
				
				log.info("Cache Keys Deleted are :::"+keysDelInOrder);
			}
			
			return keysDeleted;
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Exception Raised while deleting Cache in CacheManagerHelperClass:::"+e.getMessage(),e);
			return keysDeleted;
		}
	}
	
	public String setCache(Object data,String key) throws Exception
	{
		ByteArrayOutputStream byteObject = new ByteArrayOutputStream();
		ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteObject);
		objectOutputStream.writeObject(data);			
		objectOutputStream.flush();
		objectOutputStream.close();
		byteObject.close();

		byte[] fileBytes = byteObject.toByteArray();
		int offset 				= 0;
		HashMap<String,Object> transcriptMap	= new HashMap<String,Object>();
		int count				= 0;
		int nextkeycounter		= 0;	
		int iterationreq		=	fileBytes.length / 900000+1;
		while (offset < fileBytes.length)
		{
			try
			{
				transcriptMap	= new HashMap<String,Object>();
				byte[] outputBytes;
	
				if(fileBytes.length - offset < 900000 )
				{
					outputBytes = new byte[fileBytes.length - offset];
					System.arraycopy(fileBytes, offset, outputBytes, 0, fileBytes.length - offset);
					transcriptMap.put("value", outputBytes);
					if(count+1<iterationreq)
					{
						nextkeycounter = count+1;
						transcriptMap.put("nextkey", key+"_"+nextkeycounter);
					}
					else
					{
						transcriptMap.put("nextkey","");
					}
					
					if(count != 0)
						persistDataToCache(key+"_"+count,transcriptMap);
					else
						persistDataToCache(key,transcriptMap);
					count	=	count+1;
					break;
				}
			
				outputBytes = new byte[900000];
				System.arraycopy(fileBytes, offset, outputBytes, 0, 900000);
				offset +=900000 ; 
				transcriptMap.put("value", outputBytes);
				
				if(count+1<iterationreq)
				{
					nextkeycounter = count+1;
					transcriptMap.put("nextkey",key+"_"+nextkeycounter);
				}else
				{
					transcriptMap.put("nextkey","");
				}
				if(count != 0)
				persistDataToCache(key+"_"+count,transcriptMap);
				else
				persistDataToCache(key,transcriptMap);
				count	=	count+1;
			}
			catch(Exception e)
			{
				e.printStackTrace();
				return "failure";
			}
		}
		return "success";
}
	
	public Object getrawcacheNew(String key)
	{	
		byte[] objectContent 				  = null;
		HashMap <Object , Object> memCacheMap = null;
		Object valueFromCache 				  = null;
		boolean isSkip = false;
		try
		{
			ObjectInputStream lobjectInputStream 	= 		null;
			memCacheMap = getDataFromCache(key);
			if (memCacheMap != null)
			{
				objectContent = new byte[0];
				isSkip = true;
				while (StringUtils.isNotEmpty(key))
				{
					if (isSkip)
						isSkip = false;
					else
						memCacheMap = getDataFromCache(key);
	
					byte[] tempList = (byte[]) memCacheMap.get("value");
					byte[] tempOriginal = objectContent;
					objectContent = new byte[objectContent.length+ tempList.length];
	
					System.arraycopy(tempOriginal, 0, objectContent, 0,tempOriginal.length);
					System.arraycopy(tempList, 0, objectContent,tempOriginal.length, tempList.length);
	
					key = (String) memCacheMap.get("nextkey");
				}
			}
			if (objectContent != null) 
			{
				ByteArrayInputStream lbyteInputStream 	= 	new ByteArrayInputStream(objectContent);
				lobjectInputStream 						=	new ObjectInputStream(lbyteInputStream);
				valueFromCache 							=	lobjectInputStream.readObject();
				lbyteInputStream.close();
				lobjectInputStream.close();
			}
		}
		catch ( Exception e )
		{
			log.log(Level.SEVERE,"Error in getting cache so returning null getDatafromCachenew()"+e.getMessage(),e);
			return null;
		}
		return valueFromCache;
		
	}
	
	public String UUIDGenerator() {
		  
		Object object = new Object();
		      
		UUID uid = UUID.fromString("38400000-8cf0-11bd-b23e-10b96e4ef00d");  
		object 	=	UUID.randomUUID();
		
		return object.toString();
		}
	
	public Object getrawcachenewApi(String key)
	{	
		byte[] objectContent 				  = null;
		HashMap <Object , Object> memCacheMap = null;
		Object valueFromCache 				  = null;
		boolean isSkip = false;
		try
		{
			ObjectInputStream lobjectInputStream 	= 		null;
			memCacheMap = getDataFromCache(key);
			if (memCacheMap != null)
			{
				objectContent = new byte[0];
				isSkip = true;
				while (StringUtils.isNotEmpty(key))
				{
					if (isSkip)
						isSkip = false;
					else
						memCacheMap = getDataFromCache(key);
	
					byte[] tempList = (byte[]) memCacheMap.get("value");
					byte[] tempOriginal = objectContent;
					objectContent = new byte[objectContent.length+ tempList.length];
	
					System.arraycopy(tempOriginal, 0, objectContent, 0,tempOriginal.length);
					System.arraycopy(tempList, 0, objectContent,tempOriginal.length, tempList.length);
	
					key = (String) memCacheMap.get("nextkey");
				}
			}
			if (objectContent != null) 
			{
				ByteArrayInputStream lbyteInputStream 	= 	new ByteArrayInputStream(objectContent);
				lobjectInputStream 						=	new ObjectInputStream(lbyteInputStream);
				valueFromCache 							=	lobjectInputStream.readObject();
				lbyteInputStream.close();
				lobjectInputStream.close();
			}
		}
		catch ( Exception e )
		{
			log.log(Level.SEVERE,"Error in getting cache so returning null getDatafromCachenew()"+e.getMessage(),e);
			return "NoData";
		}
		return valueFromCache;
		
	}
	
	public String deleteCachenewMethod(String key)
	{
		boolean isDeleted 						= 		false;
		String deleted							=		"success";	
		String deletedkey						=		"";	
		String keytoDelete						=		"";
		int keycounter							=		0;
		try 
		{
			while(deleted == "success")
			{
				if(keycounter == 0)
				{
					keytoDelete  = key;
				}else{
					keytoDelete	=	key+"_"+keycounter;
				}
				MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
				syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
				isDeleted 	=	syncCache.delete(keytoDelete);
				deletedkey	=	deletedkey+" ::"+isDeleted+",";
				if(isDeleted == true)
					deleted = "success";
				else
					deleted = "failed";
			
				keycounter = keycounter+1;
			}
			return deletedkey;
		} 
		catch (Exception e) 
		{
			log.log(Level.SEVERE,"Error getting data from local cache"+e.getMessage(),e);
			return "failed";
		}
		
	}
	
	
	public Object getMulitplerawcachenewApi(ArrayList<String> keysList)
	{	
		ArrayList<Object> listOfmemCacheMap   = null;
		try
		{
			listOfmemCacheMap = getMultipleDataFromCache(keysList);
		}
		catch ( Exception e )
		{
			log.log(Level.SEVERE,"Error in getting cache so returning null getDatafromCachenew()"+e.getMessage(),e);
			return "NoData";
		}
		return listOfmemCacheMap;	
	}
	
	
	public ArrayList<Object> getMultipleDataFromCache(ArrayList<String> keysList)
	{
		HashMap<Object,Object> result 					=	null;
		ObjectInputStream lobjectInputStream 			= 	null;
		Object valueFromCache 							= 	null;
		boolean isSkip									=   false;
		byte[] objectContent							=   null;
		ArrayList<Object> ListOfReturnedValues          = new ArrayList<Object>();


		try 
		{
			//log.info("trying to get data from cache for key ::"+key);
			MemcacheService syncCache 					= 	MemcacheServiceFactory.getMemcacheService();
			
			syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
			Map<String,Object> multipleCacheResultMap = syncCache.getAll(keysList);
			for (String singleKey : multipleCacheResultMap.keySet())
			{
				try
				{
					byte[] value22	 							=	(byte[]) multipleCacheResultMap.get(singleKey); 
					if (value22 != null) 
					{
						ByteArrayInputStream lbyteInputStream 	= 	new ByteArrayInputStream(value22);
						lobjectInputStream 						=	new ObjectInputStream(lbyteInputStream);
						valueFromCache 							=	lobjectInputStream.readObject();
						lbyteInputStream.close();
						lobjectInputStream.close();
						result 									=	(HashMap<Object, Object>) valueFromCache;
						//
						if (result != null)
						{
							objectContent = new byte[0];
							isSkip = true;
							while (StringUtils.isNotEmpty(singleKey))
							{
								if (isSkip)
									isSkip = false;
								else
									result = getDataFromCache(singleKey);
				
								byte[] tempList = (byte[]) result.get("value");
								byte[] tempOriginal = objectContent;
								objectContent = new byte[objectContent.length+ tempList.length];
				
								System.arraycopy(tempOriginal, 0, objectContent, 0,tempOriginal.length);
								System.arraycopy(tempList, 0, objectContent,tempOriginal.length, tempList.length);
				
								singleKey = (String) result.get("nextkey");
							}
						}
						if (objectContent != null) 
						{
							ByteArrayInputStream sbyteInputStream 	= 	new ByteArrayInputStream(objectContent);
							lobjectInputStream 						=	new ObjectInputStream(sbyteInputStream);
							valueFromCache 							=	lobjectInputStream.readObject();
							lbyteInputStream.close();
							lobjectInputStream.close();
						}
						//
					}
					ListOfReturnedValues.add(valueFromCache);	
				}
				catch(Exception e)
				{
					log.info("some exception is there in this key!! please check it ::"+singleKey);
					continue;
				}
			}
		} 
		catch (Exception e) 
		{
			log.log(Level.SEVERE,"Error getting data from local cache"+e.getMessage(),e);
		}
		return ListOfReturnedValues;
	}
	
	
}
