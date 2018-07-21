package com.cpphot.dao;

import com.cpphot.domain.DO.ConfigDO;
import com.gosun.hibernate.dao.BaseSQLiteDao;
import com.gosun.hibernate.query.param.MySQLQueryParam;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ConfigDao extends BaseSQLiteDao<ConfigDO> {
}
