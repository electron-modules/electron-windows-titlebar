#include <napi.h>
#include <dwmapi.h>
#include <VersionHelpers.h>

#pragma comment (lib, "dwmapi.lib")

/**
 * DWMWA_USE_IMMERSIVE_DARK_MODE = 20 is supported starting with Windows 10 20H2
 * ref: https://learn.microsoft.com/en-us/windows/win32/api/dwmapi/ne-dwmapi-dwmwindowattribute
*/
static void changeTheme(Napi::Buffer<void *> wndHandle, bool isDark) {
  // step 1, check windows version
  if (!IsWindows10OrGreater()) {
    return;
  }
  const int DWMWA_USE_IMMERSIVE_DARK_MODE_BEFORE_20H1 = 19;
  const int DWMWA_USE_IMMERSIVE_DARK_MODE = 20;
  // step 2, set window attribute to dark mode
  HWND hwnd = static_cast<HWND>(*reinterpret_cast<void **>(wndHandle.Data()));
  BOOL USE_DARK_MODE = isDark;
  DwmSetWindowAttribute(
    hwnd,
    DWMWA_USE_IMMERSIVE_DARK_MODE_BEFORE_20H1,
    &USE_DARK_MODE,
    sizeof(USE_DARK_MODE)
  );
  DwmSetWindowAttribute(
    hwnd,
    DWMWA_USE_IMMERSIVE_DARK_MODE,
    &USE_DARK_MODE,
    sizeof(USE_DARK_MODE)
  );
  // step 3, redraw the current window
  // ref: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowpos
  RECT rect;
  GetWindowRect(hwnd, &rect);
  SetWindowPos(hwnd, 0, rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top + 1, SWP_DRAWFRAME|SWP_NOACTIVATE|SWP_NOZORDER);
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
