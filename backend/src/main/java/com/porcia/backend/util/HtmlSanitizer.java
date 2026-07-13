package com.porcia.backend.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

public class HtmlSanitizer {

    private static final PolicyFactory POLICY = new HtmlPolicyBuilder()
            .allowElements("p", "br", "strong", "em", "u", "h1", "h2", "h3", "h4", "h5", "h6",
                    "ul", "ol", "li", "blockquote", "a", "img", "table", "tr", "td", "th", "thead", "tbody")
            .allowAttributes("href").onElements("a")
            .allowAttributes("src", "alt", "width", "height").onElements("img")
            .allowAttributes("class").onElements("p", "div", "span", "a", "img")
            .allowUrlProtocols("http", "https", "mailto")
            .disallowElements("script", "style", "iframe", "object", "embed", "form", "input", "button")
            .toFactory();

    public static String sanitize(String html) {
        if (html == null || html.isBlank()) {
            return html;
        }
        return POLICY.sanitize(html);
    }

    public static String sanitizeText(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }
        // For plain text fields, just escape HTML entities
        return text.replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#x27;");
    }
}
