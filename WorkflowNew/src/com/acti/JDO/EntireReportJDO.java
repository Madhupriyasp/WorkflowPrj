package com.acti.JDO;

import java.io.Serializable;
import java.util.Date;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.google.appengine.api.datastore.Key;

@PersistenceCapable
@JsonIgnoreProperties(ignoreUnknown = true)
public class EntireReportJDO implements Serializable {

	/**
	 * @author Ronak
	 * This Table is responsible for the Daily reports on AR and on Chats
	 */
	private static final long serialVersionUID = 1L;

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;

	private Date date;

	private Integer Completed = 0;

	private Integer Scheduled = 0;

	private Integer Failed = 0;

	private Integer Answered = 0;

	private Integer InProgress = 0;

	private Integer InActive = 0;

	private Integer unAnswered = 0;

	private Integer InProgresschats = 0;

	private Integer inqueue = 0;
	
	private Integer Misc = 0;

	private Integer Total= 0;
	
	private Integer CompletedF8 = 0;
	
	private Integer Callended = 0;
	
	private Integer Dialout = 0;
	
	private Integer CompletedFetch = 0;
	
	private Integer CompletedResolved = 0;
	
	private Integer CompletedTabClose = 0;
	
	private Integer closed = 0;

	private String type;

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Integer getCompleted() {
		return Completed;
	}

	public void setCompleted(Integer completed) {
		Completed = completed;
	}

	public Integer getScheduled() {
		return Scheduled;
	}

	public void setScheduled(Integer scheduled) {
		Scheduled = scheduled;
	}

	public Integer getFailed() {
		return Failed;
	}

	public void setFailed(Integer failed) {
		Failed = failed;
	}

	public Integer getTotal() {
		return Total;
	}

	public void setTotal(Integer total) {
		Total = total;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getAnswered() {
		return Answered;
	}

	public void setAnswered(Integer answered) {
		Answered = answered;
	}

	public Integer getInProgress() {
		return InProgress;
	}

	public void setInProgress(Integer inProgress) {
		InProgress = inProgress;
	}

	public Integer getInActive() {
		return InActive;
	}

	public void setInActive(Integer inActive) {
		InActive = inActive;
	}

	public Integer getUnAnswered() {
		return unAnswered;
	}

	public void setUnAnswered(Integer unAnswered) {
		this.unAnswered = unAnswered;
	}

	public Integer getInProgresschats() {
		return InProgresschats;
	}

	public void setInProgresschats(Integer inProgresschats) {
		InProgresschats = inProgresschats;
	}
	public Integer getInqueue() {
		return inqueue;
	}

	public void setInqueue(Integer inqueue) {
		this.inqueue = inqueue;
	}

	public Integer getMisc() {
		return Misc;
	}

	public void setMisc(Integer misc) {
		Misc = misc;
	}

	public Integer getCompletedF8() {
		return CompletedF8;
	}

	public void setCompletedF8(Integer completedF8) {
		CompletedF8 = completedF8;
	}

	public Integer getCallended() {
		return Callended;
	}

	public void setCallended(Integer callended) {
		Callended = callended;
	}

	public Integer getDialout() {
		return Dialout;
	}

	public void setDialout(Integer dialout) {
		Dialout = dialout;
	}

	public Integer getCompletedFetch() {
		return CompletedFetch;
	}

	public void setCompletedFetch(Integer completedFetch) {
		CompletedFetch = completedFetch;
	}

	public Integer getCompletedResolved() {
		return CompletedResolved;
	}

	public void setCompletedResolved(Integer completedResolved) {
		CompletedResolved = completedResolved;
	}

	public Integer getCompletedTabClose() {
		return CompletedTabClose;
	}

	public void setCompletedTabClose(Integer completedTabClose) {
		CompletedTabClose = completedTabClose;
	}

	public Integer getClosed() {
		return closed;
	}

	public void setClosed(Integer closed) {
		this.closed = closed;
	}

	
}