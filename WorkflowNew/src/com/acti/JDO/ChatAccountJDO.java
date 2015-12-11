package com.acti.JDO;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class ChatAccountJDO 
{
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key    key ;
	
	@Persistent
	private String clientId;
	
	@Persistent
	private String browserVersion;
	
	@Persistent
	private String clientUrl;
	
	@Persistent
	private String clientIPAddress;
	
	@Persistent
	private String clientBrowserName;
	
	@Persistent
	private String event;
	
	@Persistent
	private String os;
	
	@Persistent
	private String vSId;
		

	@Persistent
	private String historyId;
	
	@Persistent
	private String clientGuid;
	
	@Persistent
	private String chatWindowType;
	
	@Persistent
	private String signUpDate;
	
	@Persistent
	private String	activeStatus;
	
	@Persistent
	private String	uniquepin;
	
	@Persistent
	private String	brandId;
	
	@Persistent
	private String	intaractionTypeId;
	
	public String getIntaractionTypeId() {
		return intaractionTypeId;
	}

	public void setIntaractionTypeId(String intaractionTypeId) {
		this.intaractionTypeId = intaractionTypeId;
	}

	public String getBrandId() {
		return brandId;
	}

	public void setBrandId(String brandId) {
		this.brandId = brandId;
	}

	public String getUniquepin() {
		return uniquepin;
	}

	public void setUniquepin(String uniquepin) {
		this.uniquepin = uniquepin;
	}

	public String isActiveStatus() {
		return activeStatus;
	}

	public void setActiveStatus(String activeStatus) {
		this.activeStatus = activeStatus;
	}

	public String getSignUpDate() {
		return signUpDate;
	}


	public void setSignUpDate(String signUpDate) {
		this.signUpDate = signUpDate;
	}


	public String getChatWindowType() {
		return chatWindowType;
	}


	public void setChatWindowType(String chatWindowType) {
		this.chatWindowType = chatWindowType;
	}


	public String getHistoryId() {
		return historyId;
	}


	public void setHistoryId(String historyId) {
		this.historyId = historyId;
	}

	
	public String getVsId() {
		return vSId;
	}


	public void setVsId(String vSId) {
		this.vSId = vSId;
	}


	public String getClientGuid() {
		return clientGuid;
	}


	public void setClientGuid(String clientGuid) {
		this.clientGuid = clientGuid;
	}


	public String getClientIPAddress()
	{
		return clientIPAddress;
	}


	public void setClientIPAddress(String clientIPAddress)
	{
		this.clientIPAddress = clientIPAddress;
	}


	public String getClientBrowserName()
	{
		return clientBrowserName;
	}


	public void setClientBrowserName(String clientBrowserName)
	{
		this.clientBrowserName = clientBrowserName;
	}


	@Persistent
	private String date;
		
	/*public Key getKey()
	{
		return key;
	}


	public void setKey(Key key) 
	{
		this.key = key;
	}*/


	public String getClientId()
	{
		return clientId;
	}


	public void setClientId(String clientId) 
	{
		this.clientId = clientId;
	}


	/*public String getClientGuid() 
	{
		return clientGuid;
	}


	public void setClientGuid(String clientGuid)
	{
		this.clientGuid = clientGuid;
	}*/


	/*public String getDomainName()
	{
		return domainName;
	}


	public void setDomainName(String domainName) 
	{
		this.domainName = domainName;
	}*/


	public String getClientUrl()
	{
		return clientUrl;
	}


	public void setClientUrl(String clientUrl)
	{
		this.clientUrl = clientUrl;
	}


	public String getDate()
	{
		return date;
	}


	public void setDate(String date) 
	{
		this.date = date;
	}

	public String getEvent()
	{
		return event;
	}


	public void setEvent(String event) 
	{
		this.event = event;
	}
	
	
	public String getOs()
	{
		return os;
	}


	public void setOs(String os) 
	{
		this.os = os;
	}
	
	public String getBrowserVersion() 
	{
		return browserVersion;
	}

	public void setBrowserVersion(String browserVersion) 
	{
		this.browserVersion = browserVersion;
	}
	
	@Override
	public String toString() {
		return "[intaractionTypeId=" + intaractionTypeId + ", brandId="
				+ brandId + ", uniquepin=" + uniquepin
				+ ", signUpDate=" + signUpDate + ", chatWindowType=" + chatWindowType
				+ ", historyId=" + historyId + ", vSId="
				+ vSId + ", clientGuid=" + clientGuid
				+ ", clientIPAddress=" + clientIPAddress + ", clientBrowserName="
				+ clientBrowserName + ", clientId=" +clientId+ ", clientUrl= " +clientUrl+" , date= " +date+" , event= "+event+", os= "+os+", browserVersion= "+browserVersion+"]";
	}
	
}
