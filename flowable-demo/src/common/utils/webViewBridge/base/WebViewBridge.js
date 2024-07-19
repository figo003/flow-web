/*
 * @Author: tulin
 * @LastEditors  : tulin
 */

setupWebViewJavascriptBridge(function (bridge) {
  window.bridgeObject = bridge;
});

export function setupWebViewJavascriptBridge(callback) {
  var u = navigator.userAgent;

  if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
    setupAndroidWebViewJavascriptBridge(function (bridge) {
      callback(bridge);
    });
  } else {
    setupiOSWebViewJavascriptBridge(function (bridge) {
      callback(bridge);
    });
  }
}

//Setting ios WebViewJavascriptBridge
function setupiOSWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }

  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}
/**
 * Setting Android WebViewJavascriptBridge
 */
function setupAndroidWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function () {
        callback(window.WebViewJavascriptBridge);
      },
      false,
    );
  }
}
