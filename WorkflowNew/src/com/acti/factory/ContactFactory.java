package com.acti.factory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.type.TypeReference;
import org.mortbay.log.Log;

import com.acti.DTO.Contact;
import com.acti.FinalObjects.FinalObjects;
import com.acti.util.ModeUtil;
import com.acti.util.UrlFetchUtil;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class ContactFactory {
	
	private static Logger logger = Logger.getLogger( ContactFactory.class.getPackage().getName());
	private static ModeUtil modeUtil = new ModeUtil();
	
	public static Map<String, Object> authenticateContact( String login ) {
		boolean isSuccess = false;
		Map<String, Object> returnHashMap = new HashMap<String, Object>();
		try {
			JSONObject requestJson = new JSONObject();
			Map<String, Object> responseBodyHashMap = new HashMap<String, Object>();
			requestJson.put( "login", login );
			String responseString = UrlFetchUtil.httpRequest( modeUtil.getNewCmsUrl() + ResourceBundle.getBundle("ApplicationResources").getString("cms.authenticate"), String.valueOf( requestJson ), "POST", "application/json", null, 2);
			JSONObject responseJsonObject = new JSONObject( responseString );
			if( responseJsonObject.has( "success" ) && ( boolean ) responseJsonObject.get( "success" ) ) {
				Contact contact = FinalObjects.getObjectMapper().readValue( String.valueOf( responseJsonObject.get( "contact" ) ), new TypeReference<Contact>() {} );
				returnHashMap.put( "contact", contact );
				isSuccess = true;
			}
		} catch( Exception exception ) {
			exception.printStackTrace();
		} finally {
			returnHashMap.put( "success", isSuccess );
		}
		return returnHashMap;
	}
	
	/*
	public static HashMap<String, Object> getContact( String apiKey, String contactId) {
		
		boolean isSuccess = false;
		HashMap<String, Object> returnHashMap = new HashMap<String, Object>();
		
		try {
			
			String responseString = UrlFetchUtil.httpRequest( Urls.getContactUrl( contactId ), null, "GET", null, null, 2);
			
			JSONObject responseJson = new JSONObject( responseString );
			
			if( responseJson.has("success") && (boolean) responseJson.get("success") ) {
				
				Contact contact = FinalVariables.getObjectMapper().readValue( String.valueOf( responseJson.get("contact") ), new TypeReference<Contact>() {});
				
				returnHashMap.put("contact", contact);
				
				isSuccess = true;
			}
			
		} catch (Exception e) {
			
			logger.log(Level.SEVERE, "Error Path : " + ContactFactory.class.getPackage().getName() + "; Method : getContact(); Detail : Error while getting a contact.");
			logger.log(Level.SEVERE, e.getMessage(), e);
			
		} finally {
			returnHashMap.put("success", isSuccess);
		}
		
		return returnHashMap;
		
	}
	
	public static HashMap<String, Object> getRequiredContacts( String accountId, String requestBody ) {
		
		boolean isSuccess = false;
		HashMap<String, Object> returnHashMap = new HashMap<String, Object>();
		
		try {

			String responseString = UrlFetchUtil.httpRequest( Urls.getGetReqContactsUr( accountId ) , requestBody, "POST", "application/json", null, 2);

			JSONObject responseJson = new JSONObject( responseString );
			
			if( responseJson.has("success") && (boolean) responseJson.get("success") ) {
				
				ArrayList<Contact> arrayListOfContacts = FinalVariables.getObjectMapper().readValue( String.valueOf( responseJson.get("contact") ), new TypeReference< ArrayList<Contact> >() {});
				
				returnHashMap.put("contact", arrayListOfContacts);
				
				isSuccess = true;
			}
			
		} catch (Exception e) {
			
			logger.log(Level.SEVERE, "Error Path : " + ContactFactory.class.getPackage().getName() + "; Method : getRequiredContacts(); Detail : Error while getting required contacts.");
			logger.log(Level.SEVERE, e.getMessage(), e);
			
		} finally {
			returnHashMap.put("success", isSuccess);
		}
		
		return returnHashMap;
		
	}
	
	public static HashMap<String, Object> getAllContacts( String accountId ) {
		
		boolean isSuccess = false;
		HashMap<String, Object> returnHashMap = new HashMap<String, Object>();
		
		try {
			
			String responseString = UrlFetchUtil.httpRequest( Urls.getUserAndSkillSetsUrl( accountId ), null, "GET", null, null, 2);
			
			System.out.println( responseString );
			
			JSONObject responseJson = new JSONObject( responseString );
			
			if( responseJson.has("success") && (boolean) responseJson.get("success") ) {
				
				ArrayList<Contact> arrayListOfContact = FinalVariables.getObjectMapper().readValue( String.valueOf( responseJson.get("person") ), new TypeReference<ArrayList<Contact>>() {});
				
				returnHashMap.put("persons", arrayListOfContact);
				
				isSuccess = true;
			}
			
		} catch (Exception e) {
			
			logger.log(Level.SEVERE, "Error Path : " + ContactFactory.class.getPackage().getName() + "; Method : getContact(); Detail : Error while getting a contact.");
			logger.log(Level.SEVERE, e.getMessage(), e);
			
		} finally {
			returnHashMap.put("success", isSuccess);
		}
		
		return returnHashMap;
		
	}
	*/

}
