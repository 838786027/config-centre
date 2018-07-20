package com.cpphot.action;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexAction {
    @RequestMapping("/")
    public String getWebPage() {
        return "/config_centre";
    }
}
