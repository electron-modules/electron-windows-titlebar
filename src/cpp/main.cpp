#include <napi.h>
#include <dwmapi.h>

#pragma comment (lib, "dwmapi.lib")

/**
 * Windows 11 insider build number: 10.0.22000.194
 * ref: https://chromium.googlesource.com/chromium/src/+/master/base/win/windows_version.h#58
*/
static BOOL isWindows11OrLater() {
  OSVERSIONINFO info;
  info.dwOSVersionInfoSize = sizeof(info);
  GetVersionEx(&info);

  if (info.dwMajorVersion > 10) {
    return true;
  } else if (info.dwMajorVersion == 10) {
    return info.dwBuildNumber >= 22000;
  }
  return false;
}

/**
 * DWMWA_USE_IMMERSIVE_DARK_MODE = 20 is supported starting with Windows 11 Build 22000
 * ref: https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/ne-dwmapi-dwmwindowattribute
*/
static void changeTheme(Napi::Buffer<void *> wndHandle, bool isDark) {
  // step 1, get windows build version
  const int DWMWA_USE_IMMERSIVE_DARK_MODE = isWindows11OrLater() ? 20 : 19;
  // step 2, set window attribute to dark mode
  HWND hwnd = static_cast<HWND>(*reinterpret_cast<void **>(wndHandle.Data()));
  BOOL USE_DARK_MODE = isDark;
  DwmSetWindowAttribute(
    hwnd,
    DWMWA_USE_IMMERSIVE_DARK_MODE,
    &USE_DARK_MODE,
    sizeof(USE_DARK_MODE)
  );
  // step 3, redraw the current window
  // ref: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowpos
  SetWindowPos(hwnd, 0, 0, 0, 0, 0, SWP_DRAWFRAME|SWP_NOACTIVATE|SWP_NOZORDER|SWP_NOMOVE|SWP_NOSIZE);
}

void switchLightMode(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsBuffer()) {
    Napi::TypeError::New(env, "hwnd buffer expected").ThrowAsJavaScriptException();
  }
  changeTheme(info[0].As<Napi::Buffer<void*>>(), false);
}

void switchDarkMode(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsBuffer()) {
    Napi::TypeError::New(env, "hwnd buffer expected").ThrowAsJavaScriptException();
  }
  changeTheme(info[0].As<Napi::Buffer<void*>>(), true);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("switchLightMode", Napi::Function::New(env, switchLightMode));
  exports.Set("switchDarkMode", Napi::Function::New(env, switchDarkMode));
  return exports;
}

NODE_API_MODULE(titlebar, Init);
