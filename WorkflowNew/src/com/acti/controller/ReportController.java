package com.acti.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.ObjectMapper;
import org.mortbay.log.Log;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.acti.DTO.Transcripts;
import com.acti.FinalObjects.FinalObjects;
import com.acti.service.ArAccountManagerService;
import com.acti.service.LoginService;
import com.acti.service.ToolsService;
import com.acti.service.TranscriptServiceHelper;

@Controller
public class ReportController {
	
	Logger logger = Logger.getLogger( ReportController.class.getName() ) ;
	LoginService loginService = new LoginService();
	
	@RequestMapping(value="/reports",method=RequestMethod.GET )
	public ModelAndView showReportsPage( HttpServletRequest request, HttpServletResponse response ) {
		ModelAndView modelAndView = new ModelAndView();
		
			try
			{
				HttpSession session = request.getSession();
				boolean authenticated = false;
				HashMap loginMap = ( HashMap ) session.getAttribute( "loginmap" );
				if(loginMap != null)
				{
					HashMap skillMap = ( HashMap ) loginMap.get( "skillMap" );
					if( skillMap != null ) {
						authenticated = true;
					}
				}
				if( authenticated ) {
					modelAndView.addObject( "Timezone", loginService.getCurrentTimeZone() );
					modelAndView.addObject( "mode", FinalObjects.getModeUtil().getMode() );
					modelAndView.setViewName( "Reports" );
				} else {
					StringBuffer redirectUrlStringBuffer = request.getRequestURL();
					if( request.getQueryString() != null )
						redirectUrlStringBuffer.append( request.getQueryString() ); 
					modelAndView.setViewName( "redirect:workflowlogin" + "?" + "redirectUrl=" + redirectUrlStringBuffer );
				}
			}
			catch(Exception e) {
				modelAndView.setViewName( "redirect:workflowlogin" + "?" + "redirectUrl=" + request.getRequestURL() );
			}
		
		return modelAndView;
	}
	
	@RequestMapping(value="/getAccountBySkill",method=RequestMethod.GET )
	public @ResponseBody String getAccountBySkill( @RequestParam( value="skill", required=true ) String skill, HttpServletRequest request, HttpServletResponse response ) {
		return ArAccountManagerService.getAccountBySkill( skill );
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
	@RequestMapping(value="/statisticController",method=RequestMethod.GET )
	public String getstatistic(HttpSession session ,HttpServletRequest request, HttpServletResponse response ) 
	{

		logger.info("inside routing controller login map");
		HashMap <String , String> lRetVal = (HashMap <String , String>) session.getAttribute( "loginmap" );
		if ( lRetVal == null )
		{
			logger.info( "SESSION INVALID" );
			StringBuffer redirectUrlStringBuffer = request.getRequestURL();
			if( request.getQueryString() != null )
				redirectUrlStringBuffer.append( request.getQueryString() ); 
			return "redirect:workflowlogin"+ "?" + "redirectUrl=" + redirectUrlStringBuffer;
		}	
		return "Statistics";
	}

	@RequestMapping(value="/getDataFromFH", method =RequestMethod.GET)
	public @ResponseBody String getDataFromFH(HttpSession session, HttpServletRequest request , HttpServletResponse response)
	{
		return new ToolsService().getDailyReportOnActiveResponse();
	}
	@RequestMapping(value="/getStatisticreport/{fromDate}/{toDate}",method=RequestMethod.GET )
	public @ResponseBody String getStatisticreport(@PathVariable("fromDate") String fromdate,@PathVariable("toDate") String todate,HttpServletRequest request, HttpServletResponse response ) 
	{
		ObjectMapper mapper = new ObjectMapper();
		String data		=	"";
				try
				{
					 SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MM-dd-yyyy");
					data	=	mapper.writeValueAsString(new ToolsService().getStatisticsbyDate(simpleDateFormat.parse(fromdate),simpleDateFormat.parse(todate)));
				}
				catch(Exception e)
				{
					logger.info("excption while recieving data from the report"+e);
				}
		
		return data;
	}
}

