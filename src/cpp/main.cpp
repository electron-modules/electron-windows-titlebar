#include <napi.h>
#include <dwmapi.h>

#pragma comment (lib, "dwmapi.lib")

static void changeTheme(Napi::Buffer<void *> wndHandle) {
  // step 1, get windows build version
  const int DWMWA_USE_IMMERSIVE_DARK_MODE = 20;
  const int DWMWA_USE_IMMERSIVE_DARK_MODE_OLD_VERSION = 19;
  // step 2, set window attribute to dark mode
  HWND hwnd = static_cast<HWND>(*reinterpret_cast<void **>(wndHandle.Data()));
  BOOL USE_DARK_MODE = true;
  DwmSetWindowAttribute(
    hwnd,
    DWMWA_USE_IMMERSIVE_DARK_MODE,
    &USE_DARK_MODE,
    sizeof(USE_DARK_MODE)
  );
  DwmSetWindowAttribute(
    hwnd,
    DWMWA_USE_IMMERSIVE_DARK_MODE_OLD_VERSION,
    &USE_DARK_MODE,
    sizeof(USE_DARK_MODE)
  );
  // step 3, update window size to redraw the current window
  RECT rect;
  GetWindowRect(hwnd, &rect);
  SetWindowPos(hwnd, 0, rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top + 1, SWP_DRAWFRAME|SWP_NOACTIVATE|SWP_NOZORDER);
}

void ChangeThemeWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsBuffer()) {
    Napi::TypeError::New(env, "Buffer expected").ThrowAsJavaScriptException();
  }
  changeTheme(info[0].As<Napi::Buffer<void*>>());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("changeTheme", Napi::Function::New(env, ChangeThemeWrapped));
  return exports;
}

NODE_API_MODULE(titlebar, Init);
