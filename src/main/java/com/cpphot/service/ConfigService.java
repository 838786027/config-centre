/**
 * @author caixiaopeng
 * @create_datetime 2018/7/21 9:59
 */

package com.cpphot.service;

import com.alibaba.fastjson.JSONObject;
import com.cpphot.dao.ConfigDao;
import com.cpphot.domain.DO.ConfigDO;
import com.cpphot.domain.VO.ConfigVO;
import com.gosun.ace.domain.BO.JqGridPageBO;
import com.gosun.ace.domain.QUERY.JqGridFilterQUERY;
import com.gosun.ace.service.BaseJqGridService;
import com.gosun.ace.service.JqGridFilterQUERYHqlAdapter;
import com.gosun.hibernate.query.param.MySQLQueryParam;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConfigService implements BaseJqGridService {
    @Autowired
    private ConfigDao configDao;

    @Override
    public JqGridPageBO list(int start, int rows, String sortField, String sortType, JqGridFilterQUERY filterQUERY, String extraJson) {
        JSONObject extra = JSONObject.parseObject(extraJson);
        String projectName = extra.getString("projectName");
        String projectVersion = extra.getString("projectVersion");
        String where = "projectName=:projectName and projectVersion=:projectVersion";
        if (filterQUERY != null) {
            where += " and (" + new JqGridFilterQUERYHqlAdapter(filterQUERY, ConfigDO.class).toString() + ")";
        }
        MySQLQueryParam queryParam = new MySQLQueryParam();
        queryParam.setOffset(start)
                .setLimit(rows)
                .setWhere(where)
                .addParam("projectName", projectName)
                .addParam("projectVersion", projectVersion);
        if (StringUtils.isNotBlank(sortField) && StringUtils.isNotBlank(sortType)) {
            queryParam.setGroupBy(sortField + " " + sortType);
        }
        List<ConfigDO> configs = configDao.listByHQL(queryParam);
        JqGridPageBO page = new JqGridPageBO();
        page.setRecords(configDao.countByHQL(queryParam));
        page.setRows(do2vo(configs));
        return page;
    }

    @Override
    public boolean save(String voJson, String extraJson) {
        System.out.println(voJson);
        System.out.println(extraJson);
        ConfigVO configVO = JSONObject.parseObject(voJson, ConfigVO.class);
        ConfigDO configDO = vo2do(configVO);
        configDao.save(configDO);
        return true;
    }

    @Override
    public boolean update(String voJson, String extraJson) {
        System.out.println(voJson);
        System.out.println(extraJson);
        ConfigVO configVO = JSONObject.parseObject(voJson, ConfigVO.class);
        ConfigDO configDO = vo2do(configVO);
        configDao.update(configDO);
        return true;
    }

    @Override
    public boolean removeById(String id, String extraJson) {
        String[] ids = id.split("|");
        String projectName = ids[0];
        String projectVersion = ids[1];
        String key = ids[2];
        System.out.println(extraJson);
        ConfigDO configDO = new ConfigDO();
        configDO.setProjectName(projectName);
        configDO.setProjectVersion(projectVersion);
        configDO.setKey(key);
        return configDao.deleteById(configDO);
    }

    @Override
    public boolean removeByFilters(JqGridFilterQUERY filterQUERY, String extraJson) {
        return false;
    }

    public ConfigVO do2vo(ConfigDO configDO) {
        ConfigVO configVO = new ConfigVO();
        configVO.setKey(configDO.getKey());
        configVO.setProjectName(configDO.getProjectName());
        configVO.setProjectVersion(configDO.getProjectVersion());
        configVO.setValue(configDO.getValue());
        configVO.setRemark(configDO.getRemark());
        configVO.setGmtCreate(configDO.getGmtCreate());
        configVO.setGmtModified(configDO.getGmtModified());
        configVO.setId(configVO.getProjectName() + "|" + configVO.getProjectVersion() + "|" + configVO.getKey());
        return configVO;
    }

    public List<ConfigVO> do2vo(List<ConfigDO> dos) {
        return dos.stream().map(configDO -> do2vo(configDO)).collect(Collectors.toList());
    }

    public ConfigDO vo2do(ConfigVO configVO) {
        ConfigDO configDO= new ConfigDO();
        configDO.setKey(configVO.getKey());
        configDO.setProjectName(configVO.getProjectName());
        configDO.setProjectVersion(configVO.getProjectVersion());
        configDO.setValue(configVO.getValue());
        configDO.setRemark(configVO.getRemark());
        configDO.setGmtCreate(configVO.getGmtCreate());
        configDO.setGmtModified(configVO.getGmtModified());
        return configDO;
    }

    public List<ConfigDO> vo2do(List<ConfigVO> vos) {
        return vos.stream().map(configVO -> vo2do(configVO)).collect(Collectors.toList());
    }
}
