package com.acti.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class LoginInterceptor implements HandlerInterceptor 
{

	@Override
	public boolean preHandle(HttpServletRequest request,HttpServletResponse response, Object handler) throws Exception 
	{
		HttpSession session = request.getSession();
		boolean continueProcess = false;
		
		System.out.println(request.getRequestURI());
		try
		{
			HashMap loginMap = (HashMap) session.getAttribute("loginMap");
			if(loginMap != null)
			{
				HashMap skillMap = (HashMap) loginMap.get("skillMap");
				if(skillMap!=null)
				{
//					if(!String.valueOf(skillMap.get("chtAdmin")).trim().equalsIgnoreCase("null"))
//					{
						continueProcess = true;
//					}
				}
			}
			
			System.out.println("will it redirect to login ::"+continueProcess);
			
		     if(!continueProcess && !(request.getRequestURI().contains("workflowlogin") || request.getRequestURI().contains("login")))
				response.sendRedirect("workflowlogin");
		     
		     if(request.getRequestURI().contains("workflowlogin") || request.getRequestURI().contains("login"))
		    	 continueProcess = true;
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return continueProcess;
	}

	// Not for now
	@Override
	public void afterCompletion(HttpServletRequest arg0,
			HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		
	}

	// Not for now
	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {
		
	}
}
