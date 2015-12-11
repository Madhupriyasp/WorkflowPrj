package com.acti.controller;

import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class Workflow_newServlet extends HttpServlet {
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
//		resp.getWriter().println("Hello, world");
		resp.sendRedirect("/workflowlogin");
	}
}
