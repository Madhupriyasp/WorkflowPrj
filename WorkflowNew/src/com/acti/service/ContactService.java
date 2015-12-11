package com.acti.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.codehaus.jackson.type.TypeReference;
import org.mortbay.log.Log;

import com.acti.DTO.Contact;
import com.acti.FinalObjects.FinalObjects;
import com.acti.factory.ContactFactory;
import com.acti.util.ContactCacheUtil;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public class ContactService {
	
	private static Logger logger = Logger.getLogger( ContactFactory.class.getPackage().getName());
	private static ContactCacheUtil contactCacheUtil = ContactCacheUtil.getInstance();
	
	public static String getContactsService( String loginArrayListString ) {
		boolean isSuccess = false;
		Map<String, Object> hashMapToReturn = new HashMap<String, Object>();
		String returnJsonString = "{\"success\":\"false\"}";
		try {
			List<String> loginArrayList = FinalObjects.getObjectMapper().readValue( loginArrayListString, new TypeReference<List<String>>() {} );
			hashMapToReturn = getContacts( loginArrayList );
			returnJsonString = FinalObjects.getObjectMapper().writeValueAsString( hashMapToReturn );
		} catch( JsonParseException | JsonMappingException mapperException ) {
			logger.info( "Exception while converting give response body string into ArrayList<String>" + mapperException.getMessage() );
		} catch( Exception exception ) {
			logger.info( "Exception :: " + exception.getMessage() );
		}
		return returnJsonString;
	}
	
	public static Map<String, Object> getContacts( List<String> loginArrayList ) {
		Map<String, Object> returnHashMap = new HashMap<String, Object>();
		Map<String, Object> hashMapTemp = null;
		List<Contact> contactArrayListTemp = null;
		boolean isSuccess = false;
		List<Contact> contactArrayListToReturn = new ArrayList<Contact>();
		List<String> loginArrayListToGetFromCms = new ArrayList<String>();
		Contact contact = null;
		try {
			for( String login : loginArrayList ) {
				contact = contactCacheUtil.get( login );
				if( contact != null ) {
					contactArrayListToReturn.add( contact );
				} else {
					loginArrayListToGetFromCms.add( login );
				}
			}
			hashMapTemp = getContactsFromCms( loginArrayListToGetFromCms );
			if( hashMapTemp.containsKey( "success" ) && (boolean) hashMapTemp.get( "success" ) ) {
				contactArrayListTemp = ( ArrayList<Contact> ) hashMapTemp.get( "contacts" );
				contactArrayListToReturn.addAll( contactArrayListTemp );
				returnHashMap.put( "contacts", contactArrayListToReturn );
				isSuccess = true;
			}
		} catch( Exception exception ) {
			Log.info( "Exception while getting contacts : " + exception.getMessage() );
		} finally {
			returnHashMap.put( "success", isSuccess );
		}
		return returnHashMap;
	}
	
	public static Map<String, Object> getContactsFromCms( List<String> loginArrayList ) {
		Map<String, Object> returnHashMap = new HashMap<String, Object>();
		boolean isSuccess = false;
		try {
			Map<String, Object> responseFromContactFactory = null;
			List<Contact> contactArrayList = new ArrayList<Contact>();
			
			for( String login : loginArrayList ) {
				responseFromContactFactory = ContactFactory.authenticateContact( login );
				if( responseFromContactFactory.containsKey( "success" ) && ( boolean ) responseFromContactFactory.get( "success" ) ) {
					Contact contact = (Contact) responseFromContactFactory.get( "contact" );
					contactArrayList.add( contact );
					contactCacheUtil.put( login, contact ); 		// Put contact object in cache
				} else {
					// throw new Exception( "Failed to get contacts object for login : " + login );
				}
			}
			returnHashMap.put( "contacts", contactArrayList );
			isSuccess = true;
		} catch( Exception exception ) {
			logger.info( "Exception while getting contacts : " + exception.getMessage() );
		} finally {
			returnHashMap.put( "success", isSuccess );
		}
		return returnHashMap;
	}
}
