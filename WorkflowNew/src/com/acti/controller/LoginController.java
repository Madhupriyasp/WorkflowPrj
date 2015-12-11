package com.acti.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.acti.FinalObjects.FinalObjects;
import com.acti.service.LoginService;
import com.acti.util.CommonUtilities;
import com.acti.util.ModeUtil;


@Controller
public class LoginController {
	private static final Logger log = Logger.getLogger(LoginController.class.getName());
	
	@RequestMapping(value="/",method=RequestMethod.GET)
	public String LoginRedirect(HttpServletRequest request,Model model, HttpServletResponse response)
	{
		LoginService loginService = new LoginService();
		HttpSession session = request.getSession();
		
		/*
		String internal_flag = request.getParameter("internalacc");
		String fetch_flag	 = request.getParameter("fetch");
		String fetch_accno	 = request.getParameter("accno");
		*/
		String googleLogin		= (String) session.getAttribute("googleLogin");
		/*
		if(internal_flag == null)
			internal_flag = "false";
		if(fetch_flag  == null )
			fetch_flag = "false";
		if(fetch_accno == null)
			fetch_accno = "";
		*/

		/*
		model.addAttribute("Timezone", loginService.getCurrentTimeZone());
		model.addAttribute("internal_flag", internal_flag);
		model.addAttribute("fetch_flag", fetch_flag);
		model.addAttribute("fetch_accno", fetch_accno);
		*/
		String page =	"redirect:workflowlogin";
		
		Cookie cookies[]=request.getCookies();
		if(cookies!=null){
			for (Cookie ele : cookies)
				if (ele.getName().equals("username"))
				{ 
					ele.setMaxAge((int)6.31139e7);
					response.addCookie(ele);
					session.setAttribute("username", ele.getValue());
				}else if(ele.getName().equals("loginMap")){
					ele.setMaxAge((int)6.31139e7);
					response.addCookie(ele);
					HashMap<String, Object> loginMapTemp=null;
					
					try {
						loginMapTemp = FinalObjects.getObjectMapper().readValue( ele.getValue(), new TypeReference<HashMap<String, Object>>() {} );
					} catch (JsonParseException e) {
						e.printStackTrace();
					} catch (JsonMappingException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}					
					
					session.setAttribute("loginmap", loginMapTemp);
				}
		}
		
		HashMap<String, Object> loginMap =(HashMap<String, Object>) session.getAttribute("loginmap");
			
		
		if(loginMap!= null)
		{
			HashMap<String, Object> skillMap 	= (HashMap<String, Object>) loginMap.get("skillMap");
			if(skillMap!=null)
			{
					page	=	"redirect:adminqueuegae";
			}
			else
			{
				if(googleLogin != null && googleLogin == "true")
				{
					signOutWithGoogle(request, response, model);
				}
			}
		}
		else 
		{
			if(googleLogin != null && googleLogin.trim().equalsIgnoreCase("true"))
			{
				signOutWithGoogle(request, response, model);
			}
		}
		return page;
	}
	
	@RequestMapping(value="/ManageQueue",method=RequestMethod.POST) 			// Authentication Controller
	public String loginController( @RequestParam(value = "redirectUrl", defaultValue = "", required = false) String redirectUrl, HttpServletRequest request,Model model,HttpServletResponse response )
	{
		LoginService loginService = new LoginService();
		HashMap loginMap	= null;
		String 	page		=	"";
		String  userName	=	null;
		String 	password    =   null;
		
		HttpSession session = request.getSession();
		
		try
		{
			/*
			model.addAttribute("internal_flag","false");
			model.addAttribute("fetch_flag","false");
			model.addAttribute("Timezone", loginService.getCurrentTimeZone());
			*/

			
			userName = request.getParameter("username");
			password = request.getParameter("password");
			log.info("username is"+userName);
			log.info("pass is"+password);
			
			page	=	"redirect:workflowlogin?userName=" + userName;
			
			if(userName!=null && !userName.trim().equalsIgnoreCase("null") && password!=null && !password.trim().equalsIgnoreCase("null"))
				{
					loginMap = new LoginService().getLoginMap(userName,password);
					
					if(loginMap!= null){
						HashMap skillMap = (HashMap) loginMap.get("skillMap");
						if(skillMap!=null)
						{
							session.setAttribute("username", userName);
							session.setAttribute("loginmap",loginMap);
							if(request.getParameter("remember_checkbox")!=null)	
							{
								Cookie cookie1=new Cookie("username",userName);
								cookie1.setMaxAge((int)6.31139e7);
								
								ObjectMapper objectMapper=new ObjectMapper();
								String result	=	objectMapper.writeValueAsString(loginMap);
								
								Cookie cookie2=new Cookie("loginMap",result);	
								cookie2.setMaxAge((int)6.31139e7);
								response.addCookie(cookie1);
								response.addCookie(cookie2);
							}
							
							if( redirectUrl != null ) {
								redirectUrl = redirectUrl.trim();
								System.out.println( "Redirect URL : " + redirectUrl );
								if( !redirectUrl.equalsIgnoreCase( "" ) ) {
									page = "redirect:" + redirectUrl;
								} else {
									page	=	"redirect:adminqueuegae";
								}
							} else {
								page	=	"redirect:adminqueuegae";
							}
						}
					}
				}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.out.println("exception");
			page	=	"redirect:workflowlogin";
		}
		System.out.println(page);
		if(page.equalsIgnoreCase("workflowLogin"))
		{	model.addAttribute("wrongpassword", "Invalid Credentials");
			model.addAttribute("userName", userName);
		}
		return page;
	}
	@RequestMapping(value="/ManageQueue",method=RequestMethod.GET)
	public void logincheck(HttpServletRequest request,HttpServletResponse response,Model model)
	{
		try {
			response.sendRedirect("/");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	@RequestMapping(value="/logout",method=RequestMethod.GET)
	public String logoutController(HttpServletRequest request, HttpServletResponse response)
	{
		
		HttpSession session = request.getSession();
		Cookie cookies[]=request.getCookies();
		try
		{
			session.invalidate();
			if(cookies!=null){
				for (Cookie ele : cookies)
					if (ele.getName().equals("username")||ele.getName().equals("loginMap"))
					{ 
						ele.setValue("");
						ele.setPath("/");
						ele.setMaxAge(0);
						response.addCookie(ele);
					}
			}
			return "redirect:workflowlogin";
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return "redirect:workflowlogin";
		}
	}
	
	@RequestMapping(value="workflowlogin",method=RequestMethod.GET)
	public String loginPage( @RequestParam(value = "redirectUrl", defaultValue = "", required = false) String redirectUrl, @RequestParam(value = "userName", defaultValue = "", required = false) String userName, HttpServletRequest request,HttpServletResponse response,Model model)
	{
		LoginService loginService = new LoginService();
		
		try
		{
			HttpSession session = request.getSession();
			
			Cookie cookies[]=request.getCookies();
			if(cookies!=null){
				for (Cookie ele : cookies)
					if (ele.getName().equals("username"))
					{ 
						ele.setMaxAge((int)6.31139e7);
						response.addCookie(ele);
						session.setAttribute("username", ele.getValue());
					}else if(ele.getName().equals("loginMap")){
						ele.setMaxAge((int)6.31139e7);
						response.addCookie(ele);
						HashMap<String, Object> loginMapTemp=null;
						
						try {
							loginMapTemp = FinalObjects.getObjectMapper().readValue( ele.getValue(), new TypeReference<HashMap<String, Object>>() {} );
						} catch (JsonParseException e) {
							e.printStackTrace();
						} catch (JsonMappingException e) {
							e.printStackTrace();
						} catch (IOException e) {
							e.printStackTrace();
						}					
						
						session.setAttribute("loginmap", loginMapTemp);
					}
			}
			
			
			boolean authenticated =false;
			HashMap loginMap = (HashMap) session.getAttribute("loginmap");
			System.out.println("login map "+loginMap);
			if(loginMap != null)
			{
				System.out.println("login not null");
				HashMap skillMap = (HashMap) loginMap.get("skillMap");
				if(skillMap!=null)
				{
					System.out.println("skill map not null");
					authenticated = true;

				}
			}
			if(authenticated) {
				if( redirectUrl != null ) {
					redirectUrl = redirectUrl.trim();
					if( !redirectUrl.equalsIgnoreCase( "" ) ) {
						return "redirect:" + redirectUrl;
					} else
						return "redirect:adminqueuegae";
				} else
					return "redirect:adminqueuegae";
			} else {
				if( redirectUrl != null ) {
					redirectUrl = redirectUrl.trim();
					model.addAttribute( "redirectUrl", redirectUrl );
				}
				model.addAttribute("Timezone", loginService.getCurrentTimeZone());
				
				if( userName != null && !userName.equalsIgnoreCase("") ){
					model.addAttribute("wrongpassword", "Invalid Credentials");
					model.addAttribute("userName", userName);
				}
					
				return "workflowLogin";
			}
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
			model.addAttribute("Timezone", loginService.getCurrentTimeZone());
			return "workflowLogin";
		}
	}
	
	@RequestMapping(value="adminqueuegae",method=RequestMethod.GET)
	public String adminQueuePage(HttpServletRequest request,HttpServletResponse response,Model model)
	{
		try
		{
			LoginService loginService = new LoginService();
			model.addAttribute("Timezone", loginService.getCurrentTimeZone());
			HttpSession session = request.getSession();
			boolean authenticated =false;
			HashMap loginMap = (HashMap) session.getAttribute("loginmap");
			System.out.println("login map "+loginMap);
			String internal_flag = request.getParameter("internalacc");
			String fetch_flag	 = request.getParameter("fetch");
			String fetch_accno	 = request.getParameter("accno");
			String fromdate  	 = request.getParameter("fromdate");
			String todate	 	 = request.getParameter("todate");
			if(loginMap != null)
			{
				System.out.println("login not null");
				HashMap skillMap = (HashMap) loginMap.get("skillMap");
				if(skillMap!=null)
				{
					System.out.println("skill map not null");
					System.out.println(String.valueOf(skillMap.get("chtAdmin")));
//					if(!String.valueOf(skillMap.get("chtAdmin")).trim().equalsIgnoreCase("null"))
//					{
						authenticated = true;
//					}
				}
			}
			if(authenticated) {
				model.addAttribute("Timezone", loginService.getCurrentTimeZone());
				model.addAttribute("internal_flag", internal_flag);
				model.addAttribute("fetch_flag", fetch_flag);
				model.addAttribute("fetch_accno", fetch_accno);
				model.addAttribute("fromdate",fromdate);
				model.addAttribute("todate",todate);
				return "AdminQueueGae";
			} else
				return "redirect:workflowlogin";
		}
		catch(Exception e)
		{
			log.log(java.util.logging.Level.SEVERE,e.getMessage(),e);
			return "redirect:workflowlogin";
		}
	}
	
	@RequestMapping(value="/fullOAuthCallback")
	public void signInWithGoogle(HttpServletRequest request,HttpServletResponse response, Model model) throws JsonParseException, JsonMappingException, IOException{
		
		 String responseJson = request.getParameter("responseJson");
         HttpSession session = request.getSession();

         ObjectMapper om 											= new ObjectMapper();
         TypeReference<HashMap<String, byte[]>> StringBytetypeRef 	= new TypeReference<HashMap<String, byte[]>>() {};
         TypeReference<HashMap<String, Object>> stringObjectTypeRef = new TypeReference<HashMap<String, Object>>() {};
         HashMap<String, byte[]> compressedDataMap 					= om.readValue(responseJson, StringBytetypeRef);
         HashMap<String,Object> responseMap 						= new HashMap<String,Object>(), contact;
		
		String username												= "";
		HashMap<String, Object> loginMap 							= null;
		try 
		{
			byte[] compressedData 									= compressedDataMap.get("response");
			String decompressedData 								= CommonUtilities.extractBytes(compressedData);
			responseMap 											= om.readValue(decompressedData, stringObjectTypeRef);
			contact 												= (HashMap<String, Object>) responseMap.get("contact");
			if(contact != null)
			{
				username 											= (String) contact.get("login");
				if(username != null && username != "" && !username.isEmpty())
				{
					session.setAttribute("username",username);
					
					loginMap										= new HashMap<String, Object>();
					LoginService loginService						= new LoginService();
					ArrayList linkedAccountslist 					= (ArrayList) contact.get("linkedAccounts");			    
					String linkedAccountsID 						= (String) linkedAccountslist.get(0);
					String userFirstName							= (String) contact.get("firstName");
					String userLastName 							= (String) contact.get("lastName");
					String password 								= (String) contact.get("password");
					String brandID 	 								= (String) contact.get("brandID");
					String contactId  								= (String) contact.get("id");
					String isLoginExist								=  String.valueOf(contact.get("deleted"));
					String photoId									= (String) contact.get("photoID");
					HashMap<String, Object> skillMap 				= loginService.getSkillMap(contactId);
					
					loginMap.put("lUniquepin", linkedAccountsID);								
					loginMap.put("lUserFirstName", userFirstName);
					loginMap.put("lUserLastName", userLastName);
					loginMap.put("password", password);
					loginMap.put("username", username);
					loginMap.put("isLoginExist", isLoginExist);
					loginMap.put("lBrandID", brandID);
					loginMap.put("photoURL",photoId);
					loginMap.put("locationid", "");
					loginMap.put("peopleID", contactId);
					loginMap.put("skillMap", skillMap);
					
					session.setAttribute("loginmap", loginMap);
					session.setAttribute("googleLogin", "true");
					session.setAttribute("photoURL", photoId);
				}
			}
			else
			{
				session.setAttribute("wrongpassword","Your account does not exist.");
			}
		} catch (Exception e) {
			

			log.info("the exception raised is : "+e.getMessage());
		}
		response.sendRedirect("/");
	}
	
	@RequestMapping(value="/fullOAuthErrorCallback")
	public String errorCallbackForGoogleOAuth(HttpServletRequest request,HttpServletResponse response, Model model, @RequestParam(value = "a-ctimail", required = false) String a_ctiMail, @RequestParam(value = "fullauthfail", required = false) String fullAuthFail){		
		if(a_ctiMail != null && a_ctiMail == "false")
			request.setAttribute("wrongpassword", "You are not authorised to Sign in.");
		else if(fullAuthFail == "true" || fullAuthFail != null)
			request.setAttribute("wrongpassword", "Authentication Failed");
		return "workflowLogin";
	}
	
	@RequestMapping(value="/logoutWithGoogle")
	public void signOutWithGoogle(HttpServletRequest request, HttpServletResponse response, Model model){
		HttpSession session = request.getSession();
		String msg 			= (String) session.getAttribute("wrongPassword");
		String redirectUrl	= "";
		String url 			= "";
		ModeUtil modeUtil	= null;
		try
		{
			modeUtil 		= 	new ModeUtil();
			
			if( (String) session.getAttribute("workflowURLLive") != null && !"".equalsIgnoreCase((String) session.getAttribute("workflowURLLive")) && !"null".equalsIgnoreCase((String) session.getAttribute("workflowURLLive")) )
				redirectUrl	= (String) session.getAttribute("workflowURLLive");
			else if( (String) session.getAttribute("workflowURLStaging") != null && !"".equalsIgnoreCase((String) session.getAttribute("workflowURLStaging")) && !"null".equalsIgnoreCase((String) session.getAttribute("workflowURLStaging")) )
				redirectUrl = (String) session.getAttribute("workflowURLStaging");
			else if( (String) session.getAttribute("workflowURLLocal") != null && !"".equalsIgnoreCase((String) session.getAttribute("workflowURLLocal")) && !"null".equalsIgnoreCase((String) session.getAttribute("workflowURLLocal")) )
				redirectUrl = (String) session.getAttribute("workflowURLLocal");

			if( "".equalsIgnoreCase(redirectUrl) || "null".equalsIgnoreCase(redirectUrl) || redirectUrl == null)
				redirectUrl = modeUtil.getWorkflowUrl();
			
			session.invalidate();
			url				= 	modeUtil.getGoogleSignOutUrl() + URLEncoder.encode(redirectUrl, "UTF-8");
			log.info("URL : " + url);
			response.sendRedirect(url);
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value="/setValueInSession", method = RequestMethod.GET)
	public @ResponseBody void setValueInSession(@RequestParam("key") String key, @RequestParam("value") String value, HttpSession session)
	{
		try
		{
			session.setAttribute(key, value);
			log.info("The session : " + key + " value : " + value);
		}
		catch(Exception e)
		{
			log.log(Level.SEVERE,"Error while setting value in session : "+e.getMessage(),e);
		}
	}
}

