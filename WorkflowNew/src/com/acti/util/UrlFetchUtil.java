package com.acti.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.codehaus.jackson.map.ObjectMapper;

public class UrlFetchUtil {

	private static Logger logger = Logger.getLogger(UrlFetchUtil.class.getPackage().getName());
	private static ObjectMapper objectMapper = new ObjectMapper();
	
	public static String httpRequest(String urlString, String params, String methodName, String contentType, String accessToken, int attampts){
		StringBuffer responseJson = new StringBuffer();
		
		try{
			
			logger.info(";-----; checking method " + methodName);
			
			URL url = new URL(urlString);
			
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setRequestMethod(methodName);
			connection.setReadTimeout(60000);
			connection.setConnectTimeout(60000);
			
			if(accessToken != null){
				connection.setRequestProperty("Authorization", "Bearer " + accessToken);
				connection.setRequestProperty("Gdata-version", "3.0");
			}
			
			if(contentType != null && !contentType.isEmpty()){
				connection.setRequestProperty("Content-Type",contentType);
			}
			if(params != null && !params.isEmpty()){			
				OutputStreamWriter writers = new OutputStreamWriter(connection.getOutputStream());			
				writers.write(params);
				writers.flush();
			}

			logger.info(";-----; response code " + connection.getResponseCode());
			if(connection.getResponseCode() == HttpURLConnection.HTTP_OK){
				BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	
				String responseString = "";
				while ((responseString = reader.readLine()) != null) {
					
					responseJson.append(responseString);
				}
			}else if(connection.getResponseCode() ==  HttpURLConnection.HTTP_UNAUTHORIZED){
				
				HashMap<String, String> errorMap = new HashMap<String, String>();
				
				errorMap.put("error", "Unauthorised User.");
				errorMap.put("HTTP Error Code", String.valueOf(connection.getResponseCode()));				
				
				String errorJson = objectMapper.writeValueAsString(errorMap);
				
				responseJson.append(errorJson);
			}else if(connection.getResponseCode() ==  HttpURLConnection.HTTP_INTERNAL_ERROR){
				
				if(attampts <= 2){
					responseJson.append(httpRequest(urlString, params, methodName, contentType, accessToken, attampts+1));
				}
				
			}else{
				
				try{
				
					BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
					
					String responseString = "";
					while ((responseString = reader.readLine()) != null) {
						
						responseJson.append(responseString);					
					}
					
					logger.info("responseJson " + responseJson);
				}catch(Exception e){
					StringWriter sw = new StringWriter();
					PrintWriter pw = new PrintWriter(sw);
					e.printStackTrace(pw);			
					logger.log(Level.SEVERE, e.getMessage(), e);
					
					HashMap<String, String> errorMap = new HashMap<String, String>();
					errorMap.put("error", "Error from server.");
					errorMap.put("HTTP Error Code", String.valueOf(connection.getResponseCode()));
					
					String errorJson = objectMapper.writeValueAsString(errorMap);
					
					responseJson.append(errorJson);
				}
				
			}
			
		}catch(Throwable e){			
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);			
//			logger.info(sw.toString());
			logger.log(Level.SEVERE, e.getMessage(), e);
			
		}
		
		return responseJson.toString();
	}

}
