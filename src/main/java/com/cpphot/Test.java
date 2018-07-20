package com.cpphot;

import com.cpphot.dao.ConfigDao;

public class Test {
    public static void main(String[] args) {
        //ProjectDao projectDao = new ProjectDao();
        //System.out.println(projectDao.list());
        ConfigDao configDao = new ConfigDao();
        System.out.println(configDao.list().get(0).getGmtCreate());
    }
}
