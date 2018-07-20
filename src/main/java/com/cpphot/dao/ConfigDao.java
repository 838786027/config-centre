package com.cpphot.dao;

import com.cpphot.domain.DO.ConfigDO;
import com.gosun.hibernate.dao.BaseSQLiteDao;
import com.gosun.hibernate.query.param.MySQLQueryParam;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ConfigDao extends BaseSQLiteDao<ConfigDO> {
    public List<ConfigDO> listByProject(String projectName, String projectVersion) {
        MySQLQueryParam queryParam = new MySQLQueryParam();
        queryParam.setWhere("project_name=:project_name and project_version=:project_version")
                .addParam("project_name", projectName)
                .addParam("project_version", projectVersion);
        return listByHQL(queryParam);
    }
}
