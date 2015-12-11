<!DOCTYPE html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
	<head>
		<title>Sorry, something went wrong - Workflow</title>
	</head>
	<body align="center">
		<h2 style="background-color: #000000; color: #FFFFFF; padding: 10px 0px;">WORKFLOW</h2>
		<h1>Oops...</h1>
	    <h3>Something went wrong.</h3>
		<h4>Sorry for the inconvenience. Please try again...</h4>
		
		<!-- Complete Exception Information Starts -->
	    <div align="left" <c:if test="${appMode == 'LIVE'}">style="display: none;"</c:if> >
		    <h3>Failed URL: ${url}</h3>
		    <h3>Exception:</h3>
		    <h5>
		    	${exception.message}
		        <c:forEach items="${exception.stackTrace}" var="ste">    ${ste} 
		   		</c:forEach>
		    </h5>
	    </div>
	    <!-- Complete Exception Information Ends -->
	    
	</body>
</html>