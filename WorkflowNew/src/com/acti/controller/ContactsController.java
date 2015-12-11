package com.acti.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.type.TypeReference;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.acti.DTO.Contact;
import com.acti.FinalObjects.FinalObjects;
import com.acti.factory.ContactFactory;
import com.acti.service.ContactService;
import com.acti.util.ModeUtil;

@Controller
public class ContactsController {
	
	private static final Logger logger = Logger.getLogger(AdminOperationController.class.getName());
	private static final ModeUtil modeUtil = new ModeUtil();
	
	@RequestMapping( value="/getContacts", method=RequestMethod.POST )
	public @ResponseBody String getContacts( @RequestBody String loginArrayListString, HttpServletRequest request , HttpServletResponse response ) throws Exception {
		logger.info("Inside 'getContacts' controller");
		String responseString = ContactService.getContactsService( loginArrayListString );
		return responseString;
	}
	
	@ExceptionHandler( value = Exception.class )
	public ModelAndView handleError( HttpServletRequest request, Exception exception, HttpServletResponse response ) throws Exception {
		logger.info( "Request: " + request.getRequestURL() + ". Raised a exception " + exception );
	    ModelAndView modelAndView = new ModelAndView();
	    modelAndView.addObject( "exception", exception );
	    modelAndView.addObject( "url", request.getRequestURL() );
	    modelAndView.addObject( "appMode", FinalObjects.getModeUtil().getMode() );
	    modelAndView.setViewName( ExceptionHandlerController.DEFAULT_ERROR_VIEW );
	    response.setStatus( 500 ); 	// Internal Server Error
	    return modelAndView;
	}
	
}
