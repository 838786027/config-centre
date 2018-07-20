package com.cpphot.domain.DO;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "project")
public class ProjectDO implements Serializable {
    @Id
    @Column(name = "name")
    private String name;

    @Id
    @Column(name = "version")
    private String version;

    @Column(name = "remark")
    private String remark;

    @Column(name = "gmt_create", insertable = false, updatable = false)
    private String gmtCreate;

    @Column(name = "gmt_modified", insertable = false, updatable = false)
    private String gmtModified;

    @Transient
    private List<ConfigDO> configs;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
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

    public String  getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(String gmtModified) {
        this.gmtModified = gmtModified;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectDO projectDO = (ProjectDO) o;
        return Objects.equals(name, projectDO.name) &&
                Objects.equals(version, projectDO.version);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, version);
    }

    @Override
    public String toString() {
        return "ProjectDO{" +
                "name='" + name + '\'' +
                ", version='" + version + '\'' +
                ", remark='" + remark + '\'' +
                ", gmtCreate=" + gmtCreate +
                ", gmtModified=" + gmtModified +
                '}';
    }
}
