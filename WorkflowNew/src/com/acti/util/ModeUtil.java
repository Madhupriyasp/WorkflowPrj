package com.acti.util;

import java.util.ResourceBundle;
import java.util.logging.Logger;

import com.google.appengine.api.utils.SystemProperty;


public class ModeUtil {
	
	private static final Logger log = Logger.getLogger( ModeUtil.class.getName() );
	
	public String getMode()
	{
		String mode = "";
		String applicationId = SystemProperty.applicationId.get();
		

		try
		{
			if(applicationId.equals("workflow-live")||applicationId.endsWith("workflow-app") || applicationId.equals("conversionsupportlive-hrd"))
	        {
	      		log.info("pointing to live ");	
	      		mode = "LIVE";
	        	
	        }
	        else if(applicationId.equals("workflowapp-staging") || applicationId.equals("conversionsupportstaging-hrd"))
	        {
	        		        	
	        	log.info("pointing to staging");	
	        	mode = "STAGING";
	        	
	        }
	        else if(applicationId.equals("dev-workflow-app"))
	        {
	        		        	
	        	log.info("pointing to staging");	
	        	mode = "DEV";
	        	
	        }
	        else if(applicationId.equals("conversionsupportdev"))
	        {
	        	log.info("pointing to dev");		   
	        	mode = "DEV";
	        }
	        else
	        {
	        	log.info("pointing to local");		   
	        	mode = "LOCAL";
	        }

		}
		catch(Exception e)
		{
			e.printStackTrace();
			log.info("Exception in the method getMode ::"+e.getMessage());
		}
		return mode;
	}
	public String getCmsUrl()
	{
		String CmsUrl    = null;
		try
		{
			String mode  = this.getMode();
			if("live".equalsIgnoreCase(mode))
			{
				CmsUrl = ResourceBundle.getBundle("ApplicationResources").getString("live.cms.url");
			}
			else if ("staging".equalsIgnoreCase(mode))
			{
				CmsUrl = ResourceBundle.getBundle("ApplicationResources").getString("stagingDataStore.url");
			}
			else if("dev".equalsIgnoreCase(mode))
			{
				CmsUrl = ResourceBundle.getBundle("ApplicationResources").getString("stagingDataStore.url");
			}
			else
			{
				CmsUrl = ResourceBundle.getBundle("ApplicationResources").getString("stagingDataStore.url");
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			log.info("Exception while getting the cmsurl ::"+e.getMessage());
		}
		return CmsUrl;
	}
	public String getWebServiceURLByMode()
	{
		String webservicesURL = "";
		try
		{
			
			String mode 		= this.getMode();
			if(mode.equalsIgnoreCase("live"))
	        {
	      		log.info("pointing to live ");		  
	      	    webservicesURL							=  ResourceBundle.getBundle("ApplicationResources").getString("betawebservices.url");
	      	    log.info(" live webservicesURL :: "+webservicesURL);
	        }
		    else if(mode.equalsIgnoreCase("staging"))
	        {
	        	log.info("pointing to staging");		   
	        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("stagingwebservices.url");
	        	log.info(" staging webservicesURL :: "+webservicesURL);
	        }
	        else if(mode.equalsIgnoreCase("dev"))
	        {
	        	log.info("pointing to dev");		   
	        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("stagingwebservices.url");
	        	log.info("dev webservicesURL :: "+webservicesURL);
	        }
	        else if(mode.equalsIgnoreCase("local"))
	        {
	        	log.info("pointing to local");		   
	        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("localwebservices.url");
	        	log.info(" local webservicesURL :: "+webservicesURL);
	        }
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return webservicesURL;
	}
	
	
public String getWebchatUrlByMode()
{

	String webservicesURL = "";
	try
	{
		
		String mode 		= this.getMode();
		if(mode.equalsIgnoreCase("live"))
        {
      		log.info("pointing to live ");		  
      	    webservicesURL							=  ResourceBundle.getBundle("ApplicationResources").getString("live.webchat.url");
      	    log.info(" live webservicesURL :: "+webservicesURL);
        }
	    else if(mode.equalsIgnoreCase("staging"))
        {
        	log.info("pointing to staging");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.webchat.url");
        	log.info(" staging webservicesURL :: "+webservicesURL);
        }
        else if(mode.equalsIgnoreCase("dev"))
        {
        	log.info("pointing to dev");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("dev.webchat.url");
        	log.info("dev webservicesURL :: "+webservicesURL);
        }
        else 
        {
        	log.info("pointing to local");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("local.webchat.url");
        	log.info(" local webservicesURL :: "+webservicesURL);
        }
	}
	catch (Exception e) 
	{
		e.printStackTrace();
	}
	return webservicesURL;

}


public String getNewCmsUrl()
{
	String newcmsurl = null;
	
	ResourceBundle	lBundle	=	ResourceBundle.getBundle("ApplicationResources");
	if( "live".equalsIgnoreCase( this.getMode() ) )
	{
		log.info("Returning live datastoreurl");
		newcmsurl			=	lBundle.getString("live.newcmsurl");
	}
	else if( "staging".equalsIgnoreCase( this.getMode() ) )
	{
		log.info("Returning staging datastoreurl");
		newcmsurl			=	lBundle.getString("staging.newcmsurl");
	}
	else if( "dev".equalsIgnoreCase( this.getMode() ) )
	{
		log.info("Returning dev datastoreurl");
		newcmsurl			=	lBundle.getString("staging.newcmsurl");
	}
	else 
	{
		log.info("Returning local datastoreurl");
		newcmsurl			=	lBundle.getString("local.newcmsurl");
	}
	return newcmsurl;
}


public String getDataStoreURLByMode()
{
	String dataStoreURL = "";
	try
	{
		
		String mode 		= this.getMode();
		if(mode.equalsIgnoreCase("live"))
        {
      		log.info("pointing to live ");		  
      		dataStoreURL							=  ResourceBundle.getBundle("ApplicationResources").getString("liveDataStore.url");
      	    log.info(" live dataStoreURL :: "+dataStoreURL);
        }
	    else if(mode.equalsIgnoreCase("staging"))
        {
        	log.info("pointing to staging");		   
        	dataStoreURL							=	ResourceBundle.getBundle("ApplicationResources").getString("stagingDataStore.url");
        	log.info(" staging dataStoreURL :: "+dataStoreURL);
        }
        else if(mode.equalsIgnoreCase("dev"))
        {
        	log.info("pointing to dev");		   
        	dataStoreURL							=	ResourceBundle.getBundle("ApplicationResources").getString("stagingDataStore.url");
        	log.info("dev dataStoreURL :: "+dataStoreURL);
        }
        else if(mode.equalsIgnoreCase("local"))
        {
        	log.info("pointing to local");		   
        	dataStoreURL							=	ResourceBundle.getBundle("ApplicationResources").getString("localDataStore.url");
        	log.info(" local dataStoreURL :: "+dataStoreURL);
        }
	}
	catch (Exception e) 
	{
		e.printStackTrace();
	}
	return dataStoreURL;
}

public String getConversionsupportURL()
{

	String webservicesURL = "";
	try
	{
		
		String mode 		= this.getMode();
		if(mode.equalsIgnoreCase("live"))
        {
      		log.info("pointing to live ");		  
      	    webservicesURL							=  ResourceBundle.getBundle("ApplicationResources").getString("live.conversionsupport.url");
      	    log.info(" live webservicesURL :: "+webservicesURL);
        }
	    else if(mode.equalsIgnoreCase("staging"))
        {
        	log.info("pointing to staging");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.conversionsupport.url");
        	log.info(" staging webservicesURL :: "+webservicesURL);
        }
        else if(mode.equalsIgnoreCase("dev"))
        {
        	log.info("pointing to dev");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.conversionsupport.url");
        	log.info("dev webservicesURL :: "+webservicesURL);
        }
        else 
        {
        	log.info("pointing to local");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.conversionsupport.url");
        	log.info(" local webservicesURL :: "+webservicesURL);
        }
	}
	catch (Exception e) 
	{
		e.printStackTrace();
	}
	return webservicesURL;

}

public String getConversionSupportbackendURL()
{

	String webservicesURL = "";
	try
	{
		
		String mode 		= this.getMode();
		if(mode.equalsIgnoreCase("live"))
        {
      		log.info("pointing to live ");		  
      	    webservicesURL							=  ResourceBundle.getBundle("ApplicationResources").getString("live.backendconversionsupport.url");
      	    log.info(" live webservicesURL :: "+webservicesURL);
        }
	    else if(mode.equalsIgnoreCase("staging"))
        {
        	log.info("pointing to staging");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.backendconversionsupport.url");
        	log.info(" staging webservicesURL :: "+webservicesURL);
        }
        else if(mode.equalsIgnoreCase("dev"))
        {
        	log.info("pointing to dev");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.backendconversionsupport.url");
        	log.info("dev webservicesURL :: "+webservicesURL);
        }
        else 
        {
        	log.info("pointing to local");		   
        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.backendconversionsupport.url");
        	log.info(" local webservicesURL :: "+webservicesURL);
        }
	}
	catch (Exception e) 
	{
		e.printStackTrace();
	}
	return webservicesURL;

}

	public String getArTriggerUrl()
	{

		String arTriggerUrl = "";
		try
		{
			
			String mode 		= this.getMode();
			if(mode.equalsIgnoreCase("live"))
	        {
	      		log.info("pointing to live ");		  
	      		arTriggerUrl							=  ResourceBundle.getBundle("ApplicationResources").getString("live.triggerar.url");
	      	    log.info(" live webservicesURL :: "+arTriggerUrl);
	        }
		    else if(mode.equalsIgnoreCase("staging"))
	        {
	        	log.info("pointing to staging");		   
	        	arTriggerUrl							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.triggerar.url");
	        	log.info(" staging webservicesURL :: "+arTriggerUrl);
	        }
	        else if(mode.equalsIgnoreCase("dev"))
	        {
	        	log.info("pointing to dev");		   
	        	arTriggerUrl							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.triggerar.url");
	        	log.info("dev webservicesURL :: "+arTriggerUrl);
	        }
	        else 
	        {
	        	log.info("pointing to local");		   
	        	arTriggerUrl							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.triggerar.url");
	        	log.info(" local webservicesURL :: "+arTriggerUrl);
	        }
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return arTriggerUrl;

	}

	public String getWorkflowUrl(){
		String workflowUrl = "";
		try
		{
			
			String mode 		= this.getMode();
			if(mode.equalsIgnoreCase("live"))
	        {		  
	      		workflowUrl							=  ResourceBundle.getBundle("ApplicationResources").getString("live.workflow.url");
	      	    log.info(" live workflowUrl :: "+workflowUrl);
	        }
		    else if(mode.equalsIgnoreCase("staging"))
	        {
	        	workflowUrl							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.workflow.url");
	        	log.info(" staging workflowUrl :: "+workflowUrl);
	        }
		    else if(mode.equalsIgnoreCase("local"))
		    {
	        	workflowUrl							=	ResourceBundle.getBundle("ApplicationResources").getString("local.workflow.url");
	        	log.info(" local workflowUrl :: "+workflowUrl);
		    }
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return workflowUrl;
	}
	public String getGoogleSignOutUrl() {
		String googleSignOutUrl = "";
		try
		{
			
			String mode 		= this.getMode();
			if(mode.equalsIgnoreCase("live"))
	        {
	      		log.info("pointing to live ");		  
	      		googleSignOutUrl							=  ResourceBundle.getBundle("ApplicationResources").getString("live.google.signOut");
	      	    log.info(" live googleSignOutUrl :: "+googleSignOutUrl);
	        }
		    else if(mode.equalsIgnoreCase("staging") || mode.equalsIgnoreCase("local"))
	        {
	        	log.info("pointing to staging");		   
	        	googleSignOutUrl							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.google.signOut");
	        	log.info(" staging googleSignOutUrl :: "+googleSignOutUrl);
	        }
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return googleSignOutUrl;
	}
	public String getFullHistoryServicesURL()
	{
		String fullHistoryURL = "";
		try
		{
			
			String mode 		= this.getMode();
			if(mode.equalsIgnoreCase("live"))
	        {
	      		log.info("pointing to live ");		  
	      	    fullHistoryURL							=  ResourceBundle.getBundle("ApplicationResources").getString("live.history.api");
	      	    log.info(" live webservicesURL :: "+fullHistoryURL);
	        }
		    else if(mode.equalsIgnoreCase("staging"))
	        {
	        	log.info("pointing to staging");		   
	        	fullHistoryURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.history.api");
	        	log.info(" staging webservicesURL :: "+fullHistoryURL);
	        }
	        else 
	        {
	        	log.info("pointing to local");		   
	        	fullHistoryURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.history.api");
	        	log.info(" local webservicesURL :: "+fullHistoryURL);
	        }
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return fullHistoryURL;
	}
	public String getArCoreEngineURLByMode()
	{
		String webservicesURL = "";
		try
		{
			
			String mode 		= this.getMode();
			if(mode.equalsIgnoreCase("live"))
	        {
	      		log.info("pointing to live ");		  
	      	    webservicesURL							=  ResourceBundle.getBundle("ApplicationResources").getString("live.arcoreengine.api");
	      	    log.info(" live webservicesURL :: "+webservicesURL);
	        }
		    else
	        {
	        	log.info("pointing to staging");		   
	        	webservicesURL							=	ResourceBundle.getBundle("ApplicationResources").getString("staging.arcoreengine.api");
	        	log.info(" staging webservicesURL :: "+webservicesURL);
	        }
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return webservicesURL;
	}
	public String getSynclioUrl() {
		String newcmsurl = null;
		
		ResourceBundle	lBundle	=	ResourceBundle.getBundle("ApplicationResources");
		if( "live".equalsIgnoreCase( this.getMode() ) )
		{
			log.info("Returning live datastoreurl");
			newcmsurl			=	lBundle.getString("live.synclio.api");
		}
		else if( "staging".equalsIgnoreCase( this.getMode() ) )
		{
			log.info("Returning staging datastoreurl");
			newcmsurl			=	lBundle.getString("staging.synclio.api");
		}
		else if( "dev".equalsIgnoreCase( this.getMode() ) )
		{
			log.info("Returning dev datastoreurl");
			newcmsurl			=	lBundle.getString("staging.synclio.api");
		}
		else 
		{
			log.info("Returning local datastoreurl");
			newcmsurl			=	lBundle.getString("staging.synclio.api");
		}
		return newcmsurl;
}
	
	
}
