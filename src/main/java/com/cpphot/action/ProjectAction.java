package com.cpphot.action;

import com.cpphot.domain.DO.ProjectDO;
import com.cpphot.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/project")
public class ProjectAction {
    @Autowired
    private ProjectService projectService;

    @RequestMapping("/list")
    @ResponseBody
    public List<ProjectDO> list() {
        return projectService.list();
    }
}
