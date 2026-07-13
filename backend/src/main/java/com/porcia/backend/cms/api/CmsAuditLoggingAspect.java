package com.porcia.backend.cms.api;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Aspect
@Component
public class CmsAuditLoggingAspect {

    private static final Logger auditLogger = LoggerFactory.getLogger("CMS_AUDIT");
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @AfterReturning("execution(* com.porcia.backend.cms.api.CmsGenericCrudController.create(..))")
    public void logCreate(JoinPoint joinPoint) {
        String resource = (String) joinPoint.getArgs()[0];
        String user = getCurrentUser();
        auditLogger.info("CREATE | Resource: {} | User: {} | Timestamp: {}", 
            resource, user, LocalDateTime.now().format(formatter));
    }

    @AfterReturning("execution(* com.porcia.backend.cms.api.CmsGenericCrudController.update(..))")
    public void logUpdate(JoinPoint joinPoint) {
        String resource = (String) joinPoint.getArgs()[0];
        Long id = (Long) joinPoint.getArgs()[1];
        String user = getCurrentUser();
        auditLogger.info("UPDATE | Resource: {} | ID: {} | User: {} | Timestamp: {}", 
            resource, id, user, LocalDateTime.now().format(formatter));
    }

    @AfterReturning("execution(* com.porcia.backend.cms.api.CmsGenericCrudController.delete(..))")
    public void logDelete(JoinPoint joinPoint) {
        String resource = (String) joinPoint.getArgs()[0];
        Long id = (Long) joinPoint.getArgs()[1];
        String user = getCurrentUser();
        auditLogger.info("DELETE | Resource: {} | ID: {} | User: {} | Timestamp: {}", 
            resource, id, user, LocalDateTime.now().format(formatter));
    }

    @AfterThrowing(pointcut = "execution(* com.porcia.backend.cms.api.CmsGenericCrudController.*(..))", throwing = "ex")
    public void logError(JoinPoint joinPoint, Exception ex) {
        String method = joinPoint.getSignature().getName();
        String user = getCurrentUser();
        auditLogger.error("ERROR | Method: {} | User: {} | Error: {} | Timestamp: {}", 
            method, user, ex.getMessage(), LocalDateTime.now().format(formatter));
    }

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "ANONYMOUS";
    }
}
