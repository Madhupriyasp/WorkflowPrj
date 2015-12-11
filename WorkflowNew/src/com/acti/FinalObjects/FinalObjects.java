package com.acti.FinalObjects;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;

import com.acti.util.ModeUtil;

public class FinalObjects {

	private static JsonFactory factory 		 = new JsonFactory();
	private static final ObjectMapper objectMapper = new ObjectMapper(factory);
	
	private static final ModeUtil modeUtil = new ModeUtil();
	
	static{
		objectMapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES,false);
		objectMapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
		objectMapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
	}
	
	public static ObjectMapper getObjectMapper() {
		return objectMapper;
	}
	
	public static ModeUtil getModeUtil() {
		return modeUtil;
	}
	
}
