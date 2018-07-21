package com.cpphot.consts;

import com.gosun.util.ConfigUtils;

import java.util.Properties;

/**
 * 系统级别常量
 * @author caixiaopeng
 *
 */
public class SysConsts {
	public static final String VERSION;

	static {
        Properties prop = ConfigUtils.loadConfigFile("version.txt");
        VERSION = prop.getProperty("version");
    }
}
