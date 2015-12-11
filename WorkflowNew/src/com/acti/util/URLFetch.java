package com.acti.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Logger;

public class URLFetch
{
	private static Logger		log		      = Logger.getLogger( URLFetch.class.getPackage().getName() );
	
	public String httpUrlFetchGET(String url)
	{
		String line 				=	null;
		StringBuffer line1 			=	null;
		try
		{
			line1 					= 	new StringBuffer();
			URL urlToCall 			= 	new URL( url);
			HttpURLConnection con	=	(HttpURLConnection) urlToCall.openConnection();

			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setRequestMethod("GET");
			con.setConnectTimeout(70000);
			con.setReadTimeout(70000);
			con.setRequestProperty("Accept-Charset", "UTF-8");
			con.setRequestProperty("Content-Type", "application/json; charset=utf-8");
			
		        
		      //  ObjectMapper mapper = new ObjectMapper();
			//	Writer 		strWriter 	= new StringWriter();
			
			//getting the auth token from the response
			BufferedReader reader = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8")); 
			 log.info("The tostring of reader is  :  " + reader);
			
			while ((line = reader.readLine()) != null)
			{
			   line1.append(line);
			}
			
			//log.info("The response got from the jobsystem is : " + line1.toString());
		} 
		catch (IOException e)
		{
			
			log.log( java.util.logging.Level.SEVERE  , e.getMessage() ,  e );
			e.printStackTrace();
		}
		    
		return line1.toString();
	}
	
	public String urlFetchPOST(String jsonString,String dataStoreUrl)
	{
		String 			line 	= null;;
		Long 			start 	= null;
		StringBuffer 	line1 	= null;
		try
		{
			URL url 				= 	new URL(dataStoreUrl);
			HttpURLConnection con	=	(HttpURLConnection) url.openConnection();

			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setRequestMethod("POST");
			con.setConnectTimeout(60000);
			con.setReadTimeout(70000);
			con.setRequestProperty("Content-Type", "application/json");
			log.info("The json string the will be sent to the service is  : " +jsonString);
		        
			OutputStreamWriter out	= new OutputStreamWriter(con.getOutputStream(),"UTF-8");
			out.write(jsonString);
			out.close();
			
			start					=	System.currentTimeMillis();
			log.info("Time BEFORE sending request : " + start);
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(con.getInputStream(),"UTF-8")); 
			 log.info("The tostring of reader is  :  " + reader.toString());
			 
			 line1 	=	 new StringBuffer();
			log.info("Time After sending request : " + System.currentTimeMillis());
			log.info("total time  : " + (System.currentTimeMillis()	-	start));
			
			while ((line = reader.readLine()) != null)
			{
			   line1.append(line);
			}
		//	log.info("The buffred final string is ::: "+line1.toString());
		} 
		catch (IOException e)
		{
			log.log( java.util.logging.Level.SEVERE  , e.getMessage() ,  e );
		}
		
		return line1.toString();
	}
	public String httpPut(String content,String urlAndParam)
	{
	 String line         = null;
	 StringBuffer line1        =  null;
	 URL url          = null; 
	 BufferedReader reader       =   null;
	 log.info("Inside httpPut method :");
	 try
	 {
	  
	  line1          =  new StringBuffer();
	  url          =  new URL(urlAndParam);
	  log.info("Url to call :: "+url);
	  HttpURLConnection con     = (HttpURLConnection) url.openConnection();
	  con.setDoOutput(true);
	  con.setUseCaches(false);
	  con.setRequestMethod("PUT");
	  con.setConnectTimeout(60000);
	  con.setReadTimeout(60000);
	  con.setRequestProperty("Content-Type", "application/json");
	     log.info("Content is  : " + content);
	  OutputStreamWriter out= new OutputStreamWriter(con.getOutputStream());
	  out.write(content);
	  out.close();
	  
	  reader = new BufferedReader(new InputStreamReader(con.getInputStream())); 
	   log.info("The tostring of reader is  :  " + reader);
	  
	  while ((line = reader.readLine()) != null)
	  {
	     line1.append(line);
	  }
	  log.info("The response from the service is  : " + line1.toString());
	  
	 } 
	 catch (IOException e)
	 {
	  log.log( java.util.logging.Level.SEVERE  , e.getMessage() ,  e );
	 }
	 return line1.toString();
	}
	
	/*
	 * Delete Method - as2
	 */
	public String httpDelete(String Url)
	{
		
		 String line         = null;
		 StringBuffer line1        =  null;
		 URL url          = null; 
		 BufferedReader reader       =   null;
		 log.info("Inside httpDelete method :");
		 try
		 {
			 
		  log.info("the url got from the contact management system is:::"+Url);
		  
		  line1          =  new StringBuffer();
		  url            =  new URL(Url);
		  
		  log.info("Url to call :: "+url);
		  
		  HttpURLConnection con     = (HttpURLConnection) url.openConnection();
		  con.setDoOutput(true);
		  con.setUseCaches(false);
		  con.setRequestMethod("DELETE");
		  con.setConnectTimeout(60000);
		  con.setReadTimeout(60000);
		  con.setRequestProperty("Content-Type", "application/json");
		  
		  reader = new BufferedReader(new InputStreamReader(con.getInputStream())); 
		  
		  log.info("The tostring of reader is  :  " + reader);
		  
		  while ((line = reader.readLine()) != null)
		  {
		     line1.append(line);
		  }
		  
		  log.info("The response from the service is  : " + line1.toString());
		  
		 } 
		 catch (IOException e)
		 {
		  log.log( java.util.logging.Level.SEVERE  , e.getMessage() ,  e );
		  e.printStackTrace();
		 }
		 return line1.toString();
		 
	}

}
