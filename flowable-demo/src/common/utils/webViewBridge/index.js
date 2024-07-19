/*
 * @Author: tulin
 * @LastEditors  : tulin
 */
import WebViewBridge from "./base/WebViewBridge";
import * as PDFPlugin from "./plugins/PDFPlugin";
import * as OCRPlugin from "./plugins/OCRPlugin";
import * as FacePlugin from "./plugins/FacePlugin";
import * as SharePlugin from "./plugins/SharePlugin";
import * as JpushPlugin from "./plugins/JpushPlugin";
import * as LocationPlugin from "./plugins/LocationPlugin";
import * as DevicePlugin from "./plugins/DevicePlugin";
import * as ImagePickerPlugin from "./plugins/ImagePickerPlugin";
import * as DJSettingPlugin from "./plugins/DJSettingPlugin";

export {
  PDFPlugin, //PDF插件
  OCRPlugin, //OCR插件
  FacePlugin, //人脸识别插件
  SharePlugin, //分享插件
  JpushPlugin, //推送插件
  LocationPlugin, //定位插件
  DevicePlugin, //设备信息插件
  ImagePickerPlugin, //相机相册插件
  DJSettingPlugin, //壳设置插件
};
