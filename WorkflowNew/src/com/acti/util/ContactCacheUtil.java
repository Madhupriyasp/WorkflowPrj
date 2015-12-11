package com.acti.util;

import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;

import org.codehaus.jackson.type.TypeReference;

import com.acti.DTO.Contact;
import com.acti.FinalObjects.FinalObjects;

public class ContactCacheUtil {
	
	public static final Logger log = Logger.getLogger(ContactCacheUtil.class.getName());
	
	private static ContactCacheUtil contactCacheUtil;
	private Cache cache;
	
	private ContactCacheUtil() {
		try {
			CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
			cache = cacheFactory.createCache(Collections.emptyMap());
		}
		catch (CacheException e) {
			log.log( Level.WARNING, "Error in creating the Cache" );
		}
	}
	
	public static synchronized ContactCacheUtil getInstance() {
		if (contactCacheUtil==null) {
			contactCacheUtil = new ContactCacheUtil();
		}
		return contactCacheUtil;
	}
	
	public Contact get(String login) {
		Contact contact = null;
		try {
			// log.info( "Trying to get contactObject from chache" );
			if (cache.containsKey(login)) {
				String contactString = String.valueOf( cache.get(login) );
				contact = FinalObjects.getObjectMapper().readValue( contactString, new TypeReference<Contact>() {} );
			}
		} catch( Exception exception ) {
			// log.info( "Exception while converting json Strgin to contactObject :: " + exception.getMessage() );
		}
		return contact;
	}
	
	public void put(String login, Contact contact) {
		try {
			// log.info( "Trying to put get contactObject from chache" );
			cache.put( login, FinalObjects.getObjectMapper().writeValueAsString( contact ) );
		} catch( Exception exception ) {
			// log.info( "Exception while converting contact object to json string :: " + exception.getMessage() );
		}
	}
	
}
