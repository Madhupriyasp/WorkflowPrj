package com.acti.controller;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import com.acti.util.UrlFetchUtil;

@ControllerAdvice
public class ExceptionHandlerController {

	private static Logger logger = Logger.getLogger(UrlFetchUtil.class.getPackage().getName());
	public static final String DEFAULT_ERROR_VIEW = "Error";
	
	@ExceptionHandler( value = Exception.class )
	public ModelAndView handleError( HttpServletRequest request, Exception exception ) throws Exception {
		logger.info( "Request: " + request.getRequestURL() + ". Raised a exception " + exception );
	    ModelAndView modelAndView = new ModelAndView();
	    modelAndView.addObject( "exception", exception );
	    modelAndView.addObject( "url", request.getRequestURL() );
	    modelAndView.setViewName( DEFAULT_ERROR_VIEW );
	    return modelAndView;
	}
	
}