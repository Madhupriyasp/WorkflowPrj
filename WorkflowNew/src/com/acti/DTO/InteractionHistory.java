package com.acti.DTO;

import java.io.Serializable;
import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable

public class InteractionHistory implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
	
	private Date date;
	
	private Date dateAdded;
	
	private String accountIdentifier;
	
	private String subaccountNumber;
	
	private String interactionId;
	
	private String agentLogin;
	
	private String peopleId;

	private String action;
	
	private Date time;
	
	private String connectionId;
	
	private String phoneNumber;
	
	private String outboundConnectionId;
	
	public String getConnectionId() {
		return connectionId;
	}

	public void setConnectionId(String connectionId) {
		this.connectionId = connectionId;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
	
	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}

	public Date getDateAdded() {
		return dateAdded;
	}

	public void setDateAdded(Date dateAdded) {
		this.dateAdded = dateAdded;
	}

	public String getAccountIdentifier() {
		return accountIdentifier;
	}

	public void setAccountIdentifier(String accountIdentifier) {
		this.accountIdentifier = accountIdentifier;
	}

	public String getSubaccountNumber() {
		return subaccountNumber;
	}

	public void setSubaccountNumber(String subaccountNumber) {
		this.subaccountNumber = subaccountNumber;
	}

	public String getInteractionId() {
		return interactionId;
	}

	public void setInteractionId(String interactionId) {
		this.interactionId = interactionId;
	}

	public String getAgentLogin() {
		return agentLogin;
	}

	public void setAgentLogin(String agentLogin) {
		this.agentLogin = agentLogin;
	}

	public String getPeopleId() {
		return peopleId;
	}

	public void setPeopleId(String peopleId) {
		this.peopleId = peopleId;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getoutboundConnectionId() {
		return outboundConnectionId;
	}

	public void setoutboundConnectionId(String outboundConnectionId) {
		this.outboundConnectionId = outboundConnectionId;
	}

	
}
