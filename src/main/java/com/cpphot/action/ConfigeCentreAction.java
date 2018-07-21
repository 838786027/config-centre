/**
 * @author caixiaopeng
 * @create_datetime 2018/7/21 10:06
 */

package com.cpphot.action;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/config_centre")
public class ConfigeCentreAction {

    @RequestMapping("/webpage")
    public String getWebPage() {
        return "/config_centre";
    }
}
