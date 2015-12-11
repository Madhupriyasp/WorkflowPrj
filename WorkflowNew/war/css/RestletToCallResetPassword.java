package com.acti.cs.services;

import java.util.ResourceBundle;

import org.restlet.data.Form;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;
import org.restlet.resource.ResourceException;

public class RestletToCallResetPassword
{
	  public String CallRestlet(String loginId,String passWord)
		{
		String webservicesURL = ResourceBundle.getBundle("ApplicationResources").getString("webservices.url");
			ClientResource client = new ClientResource( webservicesURL+"/resetPassword" );
			System.out.println( "The Status is ::: " + client.getStatus() );
		
			String str = null;
			String loginMailId	=	loginId; // "SEN42";
			String password	=	passWord;

			try
				{
					client.post( getLoginRepresentation( loginMailId,password) );
					System.out.println( "Sent request to Restlet server!" );
				}
			catch ( ResourceException e1 )
				{
					System.out.println( "Caught ResourceException" );
					e1.printStackTrace();
				}
			catch ( Exception e1 )
				{
					System.out.println( "Caught Exception" );
					e1.printStackTrace();
				}
			System.out.println( "client.getStatus( after posting request ) :" + client.getStatus() );

			// getting the response
			try
				{
					System.out.println( " After creating objectRepresentation1 " );

					if ( client.getStatus().isSuccess() )
						{
							System.out.println( " if block started" );

						    str = client.getResponse().getEntityAsText();

							System.out.println( " Response string : " + str );

						}
					System.out.println( "After If Block " );
				}
			catch ( Exception e )
				{
					System.out.println( "Caught Exception while handling Response" );
					e.printStackTrace();
				}
			System.out.println( "client.getStatus( after getting response ) :" + client.getStatus() );
			return str;
		}

	
	public static Representation getLoginRepresentation( String loginMailId , String password )
		{
			Form form = new Form();
	
			form.add( "loginMailId" , loginMailId );
			form.add( "lPassword" , password );
			

			return form.getWebRepresentation();
		}
}
