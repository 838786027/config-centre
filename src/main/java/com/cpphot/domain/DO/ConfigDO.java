package com.cpphot.domain.DO;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "config")
public class ConfigDO implements Serializable {
    @Id
    @Column(name = "project_name")
    private String projectName;

    @Id
    @Column(name = "project_version")
    private String projectVersion;

    @Id
    @Column(name = "key")
    private String key;

    @Column(name = "value")
    private String value;

    @Column(name = "remark")
    private String remark;

    @Column(name = "gmt_create", insertable = false, updatable = false)
    private String gmtCreate;

    @Column(name = "gmt_modified", insertable = false, updatable = false)
    private String gmtModified;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(String gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    public String getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(String gmtModified) {
        this.gmtModified = gmtModified;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectVersion() {
        return projectVersion;
    }

    public void setProjectVersion(String projectVersion) {
        this.projectVersion = projectVersion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ConfigDO configDO = (ConfigDO) o;
        return Objects.equals(projectName, configDO.projectName) &&
                Objects.equals(projectVersion, configDO.projectVersion) &&
                Objects.equals(key, configDO.key);
    }

    @Override
    public int hashCode() {

        return Objects.hash(projectName, projectVersion, key);
    }

    @Override
    public String toString() {
        return "ConfigDO{" +
                "projectName='" + projectName + '\'' +
                ", projectVersion='" + projectVersion + '\'' +
                ", key='" + key + '\'' +
                ", value='" + value + '\'' +
                ", remark='" + remark + '\'' +
                ", gmtCreate=" + gmtCreate +
                ", gmtModified=" + gmtModified +
                '}';
    }
}
