package com.acti.DTO;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.appengine.api.datastore.Key;
 
@JsonIgnoreProperties(ignoreUnknown = true)
public class ContactMethod implements Serializable {
	
	private static final long serialVersionUID = -1758746788595652556L;
	 
	private String key;

	private String ID;
	
	private String type;
	
	private String title;
	
	private String value;
	
	private Boolean deleted;

	private Date createdDate = new Date();
	
	private Boolean primary;

	private String typeID;
	
	private String locationID;
	
	private String accountID;

	public String getID() {
		return ID;
	}

	public void setID(String contactMethodID) {
		this.ID = contactMethodID;
	}
	
	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

	public boolean isDeleted() {
		return deleted;
	}
	
	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

	public Boolean isPrimary() {
		return primary;
	}

	public void setPrimary(Boolean primary) {
		this.primary = primary;
	}

	public String getTypeID() {
		return typeID;
	}

	public void setTypeID(String typeID) {
		this.typeID = typeID;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getLocationID() {
		return locationID;
	}

	public void setLocationID(String locationID) {
		this.locationID = locationID;
	}
}
