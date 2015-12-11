package com.acti.DTO;

import java.io.Serializable;
import java.util.Date;

public class Location implements Serializable {
		
	private static final long serialVersionUID = -6143708554196629775L;

	private String ID;
	
	private String title;
	
	private String address;
	
	private String city;
	
	private String state;
	
	private String country;
	
	private String zip;
	
	private Boolean deleted;
		
	private Date createdDate = new Date();
		
	private Boolean primary;
	
	private String accountID;
	
	public String getID() {
		return ID;
	}

	public void setID(String locationID) {
		this.ID = locationID;
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
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

	public Boolean getPrimary() {
		return primary;
	}

	public void setPrimary(Boolean primary) {
		this.primary = primary;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}
}
