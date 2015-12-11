package com.acti.DTO;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.acti.DTO.ContactMethod;
import com.acti.DTO.Location;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.appengine.api.datastore.Text;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Contact implements Serializable {
	
	private static final long serialVersionUID = 5450747587137658657L;

	private String ID;
	
	private String type;
	
	private String category;
	
	private String fullName;
	
	private String firstName;
	
	private String middleName;
	
	private String lastName;
	
	private String accountNumber;
	
	private Boolean deleted;
	
	private Date createdDate = new Date();
	
	private Date lastUpdatedDate = new Date();
	
	private String source;
	
	private String title;
	
	private String login;
	
	private String password;
	
	private Text comments = new Text("");
	
	private String ownerID;
	
	private String brandID;
	
	private String subBrandID;
	
	private String photoID;
	
	private String timeZone;
	
	private String SSN;
	
	private String department;
	
	private String IPAddress;	
	
	private List<String> linkedContacts;
	
	private List<Long> linkedDeals;
	
	private List<String> linkedHistory;
	
	private List<String> linkedTasks;
	
	private List<String> linkedAccounts;
	
	private List<String> linkedTags;
	
	private List <ContactMethod> linkedContactMethods;
	
	private List <Location>		 linkedLocations;
	
	private List<String> linkedDocuments;
	
	private List<String> linkedCustomFields;

	private String accountID;
	
	public List<String> getLinkedCustomFields() {
		return linkedCustomFields;
	}

	public void setLinkedCustomFields(List<String> linkedCustomFields) {
		this.linkedCustomFields = linkedCustomFields;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	
	public String getID() {
		return ID;
	}

	public void setID(String iD) {
		ID = iD;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getLastUpdatedDate() {
		return lastUpdatedDate;
	}

	public void setLastUpdatedDate(Date lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getComments() {
		 return comments.getValue();
	}

	public void setComments(String comments) {
		this.comments = new Text( comments );
	}
	
	public String getOwnerID() {
		return ownerID;
	}

	public void setOwnerID(String ownerID) {
		this.ownerID = ownerID;
	}

	public String getBrandID() {
		return brandID;
	}

	public void setBrandID(String brandID) {
		this.brandID = brandID;
	}

	public String getSubBrandID() {
		return subBrandID;
	}

	public void setSubBrandID(String subBrandID) {
		this.subBrandID = subBrandID;
	}

	public String getPhotoID() {
		return photoID;
	}

	public void setPhotoID(String photoID) {
		this.photoID = photoID;
	}

	public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}

	public String getSSN() {
		return SSN;
	}

	public void setSSN(String sSN) {
		SSN = sSN;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getIPAddress() {
		return IPAddress;
	}

	public void setIPAddress(String iPAddress) {
		IPAddress = iPAddress;
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

	public List<String> getLinkedContacts() {
		return linkedContacts;
	}

	public void setLinkedContacts(List<String> linkedContacts) {
		this.linkedContacts = linkedContacts;
	}

	public List<Long> getLinkedDeals() {
		return linkedDeals;
	}

	public void setLinkedDeals(List<Long> linkedDeals) {
		this.linkedDeals = linkedDeals;
	}

	public List<String> getLinkedHistory() {
		return linkedHistory;
	}

	public void setLinkedHistory(List<String> linkedHistory) {
		this.linkedHistory = linkedHistory;
	}

	public List<String> getLinkedTasks() {
		return linkedTasks;
	}

	public void setLinkedTasks(List<String> linkedTasks) {
		this.linkedTasks = linkedTasks;
	}

	public List<String> getLinkedAccounts() {
		return linkedAccounts;
	}

	public void setLinkedAccounts(List<String> linkedAccounts) {
		this.linkedAccounts = linkedAccounts;
	}

	public List<String> getLinkedTags() {
		return linkedTags;
	}

	public void setLinkedTags(List<String> linkedTags) {
		this.linkedTags = linkedTags;
	}

	public List<ContactMethod> getLinkedContactMethods() {
		return linkedContactMethods;
	}

	public void setLinkedContactMethods(List<ContactMethod> linkedContactMethods) {
		this.linkedContactMethods = linkedContactMethods;
	}

	public List<Location> getLinkedLocations() {
		return linkedLocations;
	}

	public void setLinkedLocations(List<Location> linkedLocations) {
		this.linkedLocations = linkedLocations;
	}

	public List<String> getLinkedDocuments() {
		return linkedDocuments;
	}

	public void setLinkedDocuments(List<String> linkedDocuments) {
		this.linkedDocuments = linkedDocuments;
	}

}
