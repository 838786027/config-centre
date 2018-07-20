package com.cpphot.service;

import com.cpphot.dao.ProjectDao;
import com.cpphot.domain.DO.ProjectDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectDao projectDao;

    public List<ProjectDO> list() {
        return projectDao.list();
    }
}
