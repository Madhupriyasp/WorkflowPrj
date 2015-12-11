package com.acti.service;

import java.io.StringWriter;
import java.io.Writer;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.TimeZone;
import java.util.logging.Logger;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.acti.util.ModeUtil;
import com.acti.util.SimpleMD5;
import com.acti.util.URLFetch;



public class LoginService 
{
	private static final Logger log = Logger.getLogger(LoginService.class.getName());

	public HashMap<String, Object > getLoginMap(String userName, String password)
	{

		ModeUtil lModeUtil 							= null;
		SimpleMD5 lSimpleMD5   	         			= null;
		HashMap<String,String> ploginMap			= null;
		HashMap<String, Object> newloginMap         = new HashMap<String, Object>();
		String	loginJson							= null;
		String 	md5password							= null;
		String  pPassword 						    = null;
		HashMap responseMap                         = new HashMap();
		ObjectMapper objectmapper                   = new ObjectMapper();
		ArrayList linkedAccountslist                = new ArrayList();
		String linkedAccountsID                     = null;  

		try
		{

			log.info("Going to hit NewCms for authentication");

			lModeUtil 					= 	new ModeUtil();
			lSimpleMD5   	         	=   new SimpleMD5();
			ploginMap 					=   new HashMap<String,String> ();
			String new_cmsUrl     		=   lModeUtil.getNewCmsUrl();


			try
			{
				pPassword 					 =   SimpleMD5.MD5(password);
			} 
			catch (Exception e)
			{
				e.printStackTrace();
			} 
			ploginMap.put("login", userName);
			ploginMap.put("password",pPassword );

			String inputjson                 		=   convertObjectToString(ploginMap);

			URLFetch urlFetch						=    new URLFetch();
			loginJson		                    	= 	 urlFetch.urlFetchPOST(inputjson ,new_cmsUrl+"/services/data/v2.0/objects/Account/validateLogin?apikey=SEN42");

			log.info("the loginjson got from the server is ::"+ loginJson);

			responseMap              =   objectmapper.readValue(loginJson, HashMap.class);
			log.info("response from map2"+responseMap);

			HashMap contactdetails = (HashMap) responseMap.get("contact");

			boolean deleteFlag = false;
			if(contactdetails.containsKey("deleted"))
			{
				if(contactdetails.get("deleted") != null)
					deleteFlag = (Boolean)contactdetails.get("deleted");
				log.info("deleteFlag:::"+deleteFlag);
			
				if(deleteFlag == true)
				{
					log.info("The Agent is Iactive hence not allowing him to loggin");
					newloginMap.put("wrongpassword", "Invalid Login !");
					return newloginMap;
				}
			}
			log.info("contactID"+contactdetails.get("id"));

			contactdetails.get("linkedContacts");


			log.info("linkedContacts::"+ contactdetails.get("linkedContacts"));
			linkedAccountslist =  (ArrayList) contactdetails.get("linkedAccounts");
			log.info("linkedAccounts"+linkedAccountslist.get(0));			    

			linkedAccountsID = (String) linkedAccountslist.get(0);

			boolean login          =(Boolean) responseMap.get("isLoginExist");
			String isLoginExist 	= String.valueOf(login);

			String lUserFirstName=(String) contactdetails.get("firstName");
			String lUserLastName = (String) contactdetails.get("lastName");
			String password1 = (String) contactdetails.get("password");
			String username    = (String) contactdetails.get("login");
			String lBrandID  =  (String)contactdetails.get("brandID");
			String peopleid  = (String)contactdetails.get("id");

			newloginMap.put("lUniquepin", linkedAccountsID);//adding accountid as uniquepin
			newloginMap.put("lUserFirstName", lUserFirstName);
			newloginMap.put("lUserLastName", lUserLastName);
			newloginMap.put("password", password1);
			newloginMap.put("username", username);
			newloginMap.put("isLoginExist", isLoginExist);
			newloginMap.put("lBrandID", lBrandID);
			newloginMap.put("photoURL","" );
			newloginMap.put("locationid", "");
			newloginMap.put("peopleID", peopleid);


			ArrayList l1 = new ArrayList();
			l1 =(ArrayList) responseMap.get("skillSet");

			ArrayList l2 = new ArrayList();

			if(responseMap.get("contactSkillSet") != null)
			{
				l2 = (ArrayList) responseMap.get("contactSkillSet");
				HashMap skillmap = new HashMap();

				for(int i = 0 ; i < l2.size(); i++)
				{
					HashMap m2 = new HashMap();
					m2 = (HashMap)l2.get(i);

					String skilllevel_contactskilset = (String) m2.get("skillLevel");
					String skillsetid_contactskillset = (String) m2.get("skillSetID");
					String contactid_contactskillsett = (String) m2.get("contactID");
					if((contactdetails.get("id").toString()).equals(contactid_contactskillsett))
					{
						log.info("contactdetails:::"+contactdetails.get("id")+"contactid_contactskillsett::"+contactid_contactskillsett);
						for(int j = 0 ; j < l1.size(); j++)
						{
							HashMap m1 = new HashMap();
							m1 = (HashMap)l1.get(j);
							String skillsetid_skillset = (String) m1.get("skillSetId");
							String skilltitle_skillset = (String) m1.get("title");

							log.info("skillsetid_skillset:::"+skillsetid_skillset+"skilltitle_skillset::"+skilltitle_skillset);

							if(skillsetid_contactskillset.equals(skillsetid_skillset))
							{
								log.info("skillsetid_contactskillset:::"+skillsetid_contactskillset+"skillsetid_contactskillset::"+skillsetid_contactskillset);
								skillmap.put(skilltitle_skillset, skilllevel_contactskilset);
							}
						}
					}
				}
				newloginMap.put("skillMap", skillmap);
			}
		}
		catch (Exception e) 
		{
			log.info("The Agent is Iactive hence not allowing him to loggin");
			newloginMap.put("wrongpassword", "Invalid Login !");
			log.log(java.util.logging.Level.SEVERE,"",e);
			return newloginMap;
		}


		return newloginMap;

	}

	public String convertObjectToString(Object object)
	{
		String jsonString = " ";
		try
		{
			if(object == null)
			{
				return "Object is empty";
			}
			else
			{
			  ObjectMapper mapper         = new ObjectMapper();
			  Writer strWriter            =  new StringWriter(); 
			  mapper.writeValue(strWriter, object);
			  jsonString = strWriter.toString();
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			log.info("Exception while trying to convert object to string!: "+e.getMessage());
		}
		return jsonString;
	}
	public String getCurrentTimeZone()
	{		
		String currenttimeZone = "PST"; // default value incase errors or something happens
		try
		{
		Calendar calendar = Calendar.getInstance();       
		TimeZone tz = TimeZone.getTimeZone("America/Los_Angeles");
		Date todayDate = new Date();
		calendar.setTimeZone(tz);
		log.info("Offset from UTC="+tz.getOffset(calendar.getTimeInMillis())/(60*60*1000));
		boolean isDayLight =  tz.inDaylightTime(todayDate);
		log.info("this is the current timezone"+tz.getDisplayName(isDayLight, 0));
		currenttimeZone = tz.getDisplayName(isDayLight, 0);
		log.info("the timezone found from the function without any exceptions is "+tz.getDisplayName(isDayLight, 1));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			currenttimeZone = "PST";
		}
		return currenttimeZone;	
	}
	
	public HashMap<String, Object > getSkillMap(String contactId){
		
		ModeUtil modeUtil 										= null;
		String newCmsUrl 										= "";
		HashMap<String, Object> responseMap 					= null;
		ObjectMapper objectmapper                   			= new ObjectMapper();
		TypeReference<HashMap<String, Object>> objectRefType 	= new TypeReference<HashMap<String, Object>>() {};
		HashMap<String, Object> skillMap						= null;
		try
		{
			modeUtil 								= new ModeUtil();
			newCmsUrl 								= modeUtil.getNewCmsUrl();
			String url 								= newCmsUrl + "/services/data/v2.0/objects/Skills/getContactSkillSetAndSkillSet?apikey=SEN42&contactID="+contactId;
			
			URLFetch urlFetch						= new URLFetch();
			String responseJson 					= urlFetch.httpUrlFetchGET(url);	
			responseMap								= objectmapper.readValue(responseJson, objectRefType);
			
			ArrayList<HashMap<String, Object>> l1 	= (ArrayList<HashMap<String, Object>>) responseMap.get("skillSet");
			ArrayList<HashMap<String, Object>> l2   = null; 

			if(responseMap.get("contactSkillSet") != null)
			{
				l2 = (ArrayList<HashMap<String, Object>>) responseMap.get("contactSkillSet");
				skillMap = new HashMap<String, Object>();

				for(int i = 0 ; i < l2.size(); i++)
				{
					HashMap<String, Object> m2 = new HashMap<String, Object>();
					m2 = l2.get(i);

					String skillLevel_contactSkilSet = (String) m2.get("skillLevel");
					String skillSetId_contactSkillSet = (String) m2.get("skillSetID");
					String contactId_contactSkillSet = (String) m2.get("contactID");
					if((contactId.toString()).equals(contactId_contactSkillSet))
					{
						log.info("contactdetails:::"+contactId+"contactId_contactSkillSet::"+contactId_contactSkillSet);
						for(int j = 0 ; j < l1.size(); j++)
						{
							HashMap<String, Object> m1 = new HashMap<String, Object>();
							m1 = l1.get(j);
							String skillSetId_skillSet = (String) m1.get("skillSetId");
							String skillTitle_skillSet = (String) m1.get("title");

							log.info("skillSetId_skillSet:::"+skillSetId_skillSet+"skillTitle_skillSet::"+skillTitle_skillSet);

							if(skillSetId_contactSkillSet.equals(skillSetId_skillSet))
							{
								log.info("skillLevel_contactSkilSet:::"+skillLevel_contactSkilSet+"skillLevel_contactSkilSet::"+skillLevel_contactSkilSet);
								skillMap.put(skillTitle_skillSet, skillLevel_contactSkilSet);
							}
						}
					}
				}
			}
		}
		catch(Exception e)
		{
			log.info("Exception is : "+e.getMessage());
		}
		return skillMap;
	}
}
