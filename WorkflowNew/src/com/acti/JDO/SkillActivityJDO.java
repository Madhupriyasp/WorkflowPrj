package com.acti.JDO;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable
public class SkillActivityJDO 
{
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;

	// type should be account or an agent
	private String type;
	
	private String accountNumber;
	private String userLogin;
	private String agentLogin;
	private Date dateModified;
	private String skillChanged;
	private String skillUrl;
	private String skillLevel;
	private String oldSkill;
	public String getOldSkillLevel() {
		return oldSkillLevel;
	}

	public void setOldSkillLevel(String oldSkillLevel) {
		this.oldSkillLevel = oldSkillLevel;
	}

	public String getOldSkillURL() {
		return oldSkillURL;
	}

	public void setOldSkillURL(String oldSkillURL) {
		this.oldSkillURL = oldSkillURL;
	}

	private String oldSkillLevel;
	private String oldSkillURL;
	
	public String getoldSkill() {
		return oldSkill;
	}

	public void setoldSkill(String oldSkill) {
		this.oldSkill = oldSkill;
	}
	
	public String getskillLevel() {
		return skillLevel;
	}

	public void setskillLevel(String skillLevel) {
		this.skillLevel = skillLevel;
	}
	
	public String getskillUrl() {
		return skillUrl;
	}

	public void setskillUrl(String skillUrl) {
		this.skillUrl = skillUrl;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	public String getAccountnumber() {
		return accountNumber;
	}

	public void setAccountnumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	
	public String getuserLogin() {
		return userLogin;
	}

	public void setuserLogin(String userLogin) {
		this.userLogin = userLogin;
	}
	
	public String getagentLogin() {
		return agentLogin;
	}

	public void setagentLogin(String agentLogin) {
		this.agentLogin = agentLogin;
	}
	
	public Date getdateModified() {
		return dateModified;
	}

	public void setdateModified(Date dateModified) {
		this.dateModified = dateModified;
	}
	
	public String getskillChanged() {
		return skillChanged;
	}

	public void setskillChanged(String skillChanged) {
		this.skillChanged = skillChanged;
	}
	
	
	
}
