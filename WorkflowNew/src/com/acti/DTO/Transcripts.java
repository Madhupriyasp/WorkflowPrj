package com.acti.DTO;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Text;

@PersistenceCapable
@JsonIgnoreProperties(ignoreUnknown = true)
public class Transcripts implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;

	private String accountIdentifier;
	
	private String subaccountNumber;
	
	private Date date;

	private Date dateAdded;
	
	private String interactionType;
	
	private String interactionId;
	
	private String interactionStatus;
	
	private String routingMode;
	
	private String source;
	
	private String resolution;
	
	private Date startTime;
	
	private Date endTime;
	
	private long queuedTime;
	
	private long entireDuration;
	
	private long effectiveDuration;

	private String connectionId;
	
	private String initiator;
	
	private String chatWindowType;
	
	private Text messages;
	
	private String agentLogin;

	private String screenName;
	
	private String peopleId;
	
	private boolean read;
	
	private String randomuuid;
	
	
	@Persistent( defaultFetchGroup = "true" )
	private VisitorDetails visitorDetails;
	
	@Persistent(defaultFetchGroup="true")
	private List<InteractionHistory> interactionHistories;
	
	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
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

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Date getDateAdded() {
		return dateAdded;
	}

	public void setDateAdded(Date dateAdded) {
		this.dateAdded = dateAdded;
	}

	public String getInteractionType() {
		return interactionType;
	}

	public void setInteractionType(String interactionType) {
		this.interactionType = interactionType;
	}

	public String getInteractionId() {
		return interactionId;
	}

	public void setInteractionId(String interactionId) {
		this.interactionId = interactionId;
	}

	public String getInteractionStatus() {
		return interactionStatus;
	}

	public void setInteractionStatus(String interactionStatus) {
		this.interactionStatus = interactionStatus;
	}

	public String getRoutingMode() {
		return routingMode;
	}

	public void setRoutingMode(String routingMode) {
		this.routingMode = routingMode;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getResolution() {
		return resolution;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution;
	}
	
	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public long getQueuedTime() {
		return queuedTime;
	}

	public void setQueuedTime(long queuedTime) {
		this.queuedTime = queuedTime;
	}

	public long getEntireDuration() {
		return entireDuration;
	}

	public void setEntireDuration(long entireDuration) {
		this.entireDuration = entireDuration;
	}

	public long getEffectiveDuration() {
		return effectiveDuration;
	}

	public void setEffectiveDuration(long effectiveDuration) {
		this.effectiveDuration = effectiveDuration;
	}

	public String getConnectionId() {
		return connectionId;
	}

	public void setConnectionId(String connectionId) {
		this.connectionId = connectionId;
	}
	
	public String getInitiator() {
		return initiator;
	}

	public void setInitiator(String initiator) {
		this.initiator = initiator;
	}

	public String getChatWindowType() {
		return chatWindowType;
	}

	public void setChatWindowType(String chatWindowType) {
		this.chatWindowType = chatWindowType;
	}

	public Text getMessages() {
		return messages;
	}

	public void setMessages(Text messages) {
		this.messages = messages;
	}
	
	public String getAgentLogin() {
		return agentLogin;
	}

	public void setAgentLogin(String agentLogin) {
		this.agentLogin = agentLogin;
	}

	public String getScreenName() {
		return screenName;
	}

	public void setScreenName(String screenName) {
		this.screenName = screenName;
	}
	
	public String getPeopleId() {
		return peopleId;
	}

	public void setPeopleId(String peopleId) {
		this.peopleId = peopleId;
	}

	public boolean isRead() {
		return read;
	}

	public void setRead(boolean read) {
		this.read = read;
	}

	public VisitorDetails getVisitorDetails() {
		return visitorDetails;
	}

	public void setVisitorDetails(VisitorDetails visitorDetails) {
		this.visitorDetails = visitorDetails;
	}

	public List<InteractionHistory> getInteractionHistories() {
		return interactionHistories;
	}

	public void setInteractionHistories(List<InteractionHistory> interactionHistories) {
		this.interactionHistories = interactionHistories;
	}
	
	public void updateInteractionHistories(InteractionHistory interactionHistory)
	{
		if(this.interactionHistories == null )
			this.interactionHistories = new ArrayList<InteractionHistory>();
		
		this.interactionHistories.add(0, interactionHistory);
	}

	public String getMessagesAsString() {
		return messages.getValue();
	}
	
	public String getRandomuuid() {
		return randomuuid;
	}

	public void setRandomuuid(String randomuuid) {
		this.randomuuid = randomuuid;
	}
	
}