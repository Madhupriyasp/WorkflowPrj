package com.acti.util;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

/*
 * @author M2V
 *
 */
public class JdoUtil
{
	
	 private static final Logger logger 						= Logger.getLogger(JdoUtil.class.getName());
	 private static final PersistenceManagerFactory pmfInstance = JDOHelper.getPersistenceManagerFactory("transactions-optional");

//	/ JDOHelper.
		    public static PersistenceManagerFactory get() 
		    {
		    	try
		    	{
		    		 return pmfInstance;
		    	}
		    	catch(Exception e)
		    	{
		    		logger.log(Level.SEVERE,"Exception in getting PersistenceManager!!!", e);
		    		e.printStackTrace();
		    		return null;
		    	}
		       
		    }
}



