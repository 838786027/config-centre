/**
 * @author caixiaopeng
 * @create_datetime 2018/7/21 9:58
 */

package com.cpphot.action;

import com.cpphot.domain.DO.ConfigDO;
import com.cpphot.service.ConfigService;
import com.gosun.ace.action.BaseJqGridAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;

@Controller
@RequestMapping("/config")
public class ConfigAction extends BaseJqGridAction<ConfigService> {
    @Autowired
    private ConfigService configService;
}
