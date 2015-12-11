package com.acti.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;

import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.acti.service.CacheManagerHelper;

//import com.acti.cs.services.GAECacheService;
/*
 * Author : Venkatesh Arivazhagan
 * Mail	  : v3a@a-cti.com
 */
public class CommonUtilities
	{
	private static final Logger log = Logger.getLogger(CommonUtilities.class.getName());
//	GAECacheService _cache = GAECacheService.getInstance();
		
	public static boolean checkForSession(HttpSession session)
		{
			log.info( "Inside checkForSession method" );
		try{
			
			if(session.getAttribute( "loginmap" )!=null)
				{
					HashMap <String , Object> lRetVal = (HashMap <String , Object>) session.getAttribute( "loginmap" );
					log.info("hash map content - "+lRetVal);
					if("true".equals(lRetVal.get("isLoginExist")) )
						{
							log.info( "Session available" );
							log.info( "The Unique pin & loginID of the user :: "+(String)lRetVal.get( "lUniquepin" )+" & "+(String)lRetVal.get( "username" ) );
							return true;						
						}
					else
						{
							log.info( "IsLoginExist is set to false" );
							return false;
						}
				}
			else
			{
				log.info( "Session unavailable" );
				return false;
			}
						
			}
			catch(Exception e)
			{
				log.info( "Exception in checkForSession method. Therefore We are returning false :: "+e.getMessage() );
				e.printStackTrace();
				return false;
			}
		}
	public static boolean checkIfAdmin( HashMap lLoginMap )
	{
	//	if ( checkForSession( session ) )
		if ( lLoginMap != null )
		{
			//HashMap <String , Object> lRetVal = (HashMap <String , Object>) session.getAttribute( "loginmap" );
			if ( "true".equals( lLoginMap.get( "IsAdmin" ) ) )
			{
				log.info( "It is the Administrator" );
				log.info( "The Unique loginID of the Administrator :: " + (String) lLoginMap.get( "lUniquepin" ) + " & "
				        + (String) lLoginMap.get( "username" ) );
				return true;
			}
			else
			{
				log.info( "It is NOT the Administrator" );
				return false;
			}
		}
		else
		{
			log.info( "Session unavailable" );
			return false;
		}
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
	public static void checkPreviousOrNext(String previousornext , Integer count , HttpSession session)
		{
			log.info( "Previous / Next ?! ::: "+previousornext );
			log.info( " count is " + count);
			int counter = 0;
			if ( count==null || count ==0 )
				{								
					count = 1;
					session.setAttribute( "count" , count );
				}
			if ( count  != 0 && previousornext !=null)
				{								
					if( "previous".equalsIgnoreCase( previousornext) )
						{
							counter = count ;
							if ( counter > 1 )
								{
									--counter;
									count = counter ;
									log.info( " after decrease counter  : " + counter );
									session.setAttribute( "count" , counter );
								}
						}

					if ( "next".equalsIgnoreCase( previousornext ) )
						{
							counter = count ;
							if ( counter > 0 )
								{
									counter++ ;
									count =  counter ;
									log.info( " after increase counter  : " + counter );
									session.setAttribute( "count" , counter );
								}
						}
					if ( "start".equalsIgnoreCase( previousornext ) )
						{
							count = 1;
							log.info( " making count = 1 as previousornext is : " + previousornext);
							session.setAttribute( "count" , count );
						}
				}
		}
	
	public static String formatUserName(String userName)
	
		{
			//log.info("Inside the format User Name");
		     try
		     {
		          String[] agentarr = userName.split("%20");
		          if("".equals(userName) || userName == null)
		          {
		           userName = "James.M";
		           return userName;
		          }
		          
		          if(agentarr.length >1)
		          {
		            String name0 	= agentarr[0].trim();
		            String name1 	= agentarr[1];
		            name0 			= name0.trim().substring(0,1).toUpperCase()+name0.trim().substring(1);
		            userName 		= name0 +" "+ name1.substring(0,1).toUpperCase()+".";
		            //log.info( "The Formatted Name :: "+userName );
		          }
		     }
		     catch(Exception e)
		     {
		    	 log.info("EXCEPTION Occured in formatUserName Method :: "+e.getMessage());
		    	 e.printStackTrace();
		     }
		 return userName;
		 
		}
	
	
	/*
	 * @return serialise String format of the Object passed in
	 */
	public static String convertToString(Object object)
	   {
	       log.info("Inside convertTostring method");
	       String lResult    =    null    ;
	       
	       try
	       {
	           if(object == null)
	           {
	               log.info("Object is coming as null. Therefore we return empty string.");
	               lResult    =     "" ;
	           }
	           else
	           {
	               log.info("The object is :: "+object);
	               ObjectMapper mapper    =    new ObjectMapper();
	               Writer strWriter        =    new StringWriter();
	               mapper.writeValue(strWriter, object);
	               lResult                =    strWriter.toString();
	               log.info("Object converted to :: "+lResult);
	           }
	       }
	       catch(Exception E)
	       {
	           log.log(Level.SEVERE,"Exception occurred while trying to convert object to string! :: "+E.getMessage());
	           E.printStackTrace();
	           lResult    =    ""    ;
	       }
	       
	       return lResult;
	   }
	public static String extractBytes(byte[] data) throws DataFormatException, IOException {
		ByteArrayOutputStream baos = null;
        
        String response = "";
       
        Inflater df = new Inflater(); // this function mainly generate the byte code
        df.setInput( data );
       
        baos = new ByteArrayOutputStream();
       
        byte[] buff = new byte [1024]; // segment segment pop....segment set 1024
        while ( !df.finished() )
        {
                int count = df.inflate( buff ); // returns the generated code... index
                baos.write(buff, 0, count);
        }
       
        if(baos != null){
                baos.close();
                response = new String(baos.toByteArray());
        }                              
       
        return response;
	}
	
	public static String getTimeInFormat(Long time){
		String hh			= "00";
		String mm			= "00";
		String ss			= "00";
		try
		{
		time			   	= Math.round(time/1000.0);
		Long hours 			= (long) Math.floor(time / (60*60));
		Long minutes 		= (long) Math.floor((time - (hours*3600)) / 60);
		Long seconds 		= (long) Math.floor(time - (hours*3600) - (minutes*60));
		if(hours < 10)
			hh = "0" + hours;
		else
			hh = hours.toString();
		
		if(minutes < 10)
			mm = "0" + minutes;
		else
			mm = minutes.toString();
		if(seconds < 10)
			ss = "0" + seconds;
		else
			ss = seconds.toString();
		}
		catch(Exception e)
		{
			log.info("EXCEPTION Occured in getTimeInFormat Method :: "+e.getMessage());
	    	 e.printStackTrace();
		}
		return hh + ":" + mm + ":" + ss; 
	}
	public boolean isNumeric(String str)  
	{  
	  try  
	  {  
	    double d = Double.parseDouble(str);  
	  }  
	  catch(NumberFormatException nfe)  
	  {  
	    return false;  
	  }  
	  return true;  
	}
	public Long[] convertStringArrToLongArr(String[] strings) 
	{
		Long[] longarray=new Long[strings.length];
	    int i=0;
	    for(String str:strings)
	    {
	    	try
	    	{
	    		longarray[i]=Long.parseLong(str.trim());//Exception in this line
		        i++;
	    	}
	    	catch(NumberFormatException nfe) 
	    	{
	    		log.info("EXCEPTION Occured while Conversion :: "+nfe.getMessage());
	    	}
	        
	    }
	    return longarray;
	}
}
