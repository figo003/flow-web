/**
 * @author 明浩
 * @time 2020-8-14
 * @dec 操作DOM 常用方法
 */

import { trigger } from "./index.js";
export function $(expr, con) {
  return typeof expr === "string"
    ? (con || document).querySelector(expr)
    : expr || null;
}

$.createElement = (tag, attrs) => {
  const elem = document.createElement(tag);
  for (let attr in attrs) {
    if (attr === "appendTo") {
      const parent = attrs.appendTo;
      parent.appendChild(elem);
    } else if (attr === "innerHTML") {
      elem.innerHTML = attrs.innerHTML;
    } else if (attr === "width" || attr === "height") {
      elem.style[attr] =
        String(attrs[attr]).indexOf("%") > -1
          ? attrs[attr]
          : attrs[attr] + "px";
      elem.setAttribute(attr, attrs[attr]);
    } else if (attr === "x") {
      elem.style.left = attrs[attr] + "px";
      elem.setAttribute(attr, attrs[attr]);
    } else if (attr === "y") {
      elem.style.top = attrs[attr] + "px";
      elem.setAttribute(attr, attrs[attr]);
    } else if (attr === "styles") {
      $.styles(elem, attrs[attr]);
    } else {
      elem.setAttribute(attr, attrs[attr]);
    }
  }
  return elem;
};

$.on = (element, event, selector, callback) => {
  if (!callback) {
    callback = selector;
    $.bind(element, event, callback);
  } else {
    $.delegate(element, event, selector, callback);
  }
};

$.off = (element, event, handler) => {
  element.removeEventListener(event, handler);
};

$.bind = (element, event, callback) => {
  event.split(/\s+/).forEach(function(event) {
    element.addEventListener(event, callback);
  });
};

$.delegate = (element, event, selector, callback) => {
  element.addEventListener(event, function(e) {
    const delegatedTarget = e.target.closest(selector);
    if (delegatedTarget) {
      e.delegatedTarget = delegatedTarget;
      callback.call(this, e, delegatedTarget);
    }
  });
};

$.closest = (selector, element) => {
  if (!element) return null;

  if (element.matches(selector)) {
    return element;
  }

  return $.closest(selector, element.parentNode);
};
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    let el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

$.attr = (element, attr, value) => {
  if (!value && value !== 0 && typeof attr === "string") {
    return element.getAttribute(attr);
  }

  if (typeof attr === "object") {
    for (let key in attr) {
      $.attr(element, key, attr[key]);
    }
    return;
  }
  if (attr === "width" || attr === "height") {
    element.style[attr] =
      String(value).indexOf("%") > -1 ? value : value + "px";
  } else if (attr === "x") {
    element.style.left = value + "px";
  } else if (attr === "y") {
    element.style.top = value + "px";
  }
  element.setAttribute(attr, value);
};

$.styles = (element, css, value) => {
  if (!value && value !== 0 && typeof style === "string") {
    return element.style[css];
  }

  if (typeof css === "object") {
    for (let key in css) {
      $.styles(element, key, css[key]);
    }
    return;
  }
  if (typeof value === "number") {
    value += "px";
  }
  element.style[css] = value;
};

$.loadJs = (url, callback) => {
  var script = document.createElement("script");
  script.type = "text/javascript";
  if (typeof callback !== "undefined") {
    if (script.readyState) {
      script.onreadystatechange = function() {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function() {
        callback();
      };
    }
  }
  script.src = url;
  document.body.appendChild(script);
};

$.trigger = (element, event) => {
  trigger(element, event);
};
