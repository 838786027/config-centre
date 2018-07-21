package com.cpphot.listener;

import com.cpphot.consts.SysConsts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.Properties;

@WebListener
public class ApplicationListener implements ServletContextListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationListener.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        LOGGER.info("应用初始化阶段");
        LOGGER.info("当前版本：" + SysConsts.VERSION);
        ServletContext sc = sce.getServletContext();
        WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(sc);
        sc.setAttribute("version", SysConsts.VERSION);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

    }
}
