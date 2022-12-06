/* src/cpp/main.cpp */
#pragma comment (lib, "dwmapi.lib")
#include <napi.h>
#include <dwmapi.h>

// TODO: 增加判断当前窗口主题函数 

static void changeTheme(Napi::Buffer<void *> wndHandle) {
  HWND hwnd = static_cast<HWND>(*reinterpret_cast<void **>(wndHandle.Data()));
  BOOL USE_DARK_MODE = true;
  const int DWMWA_USE_IMMERSIVE_DARK_MODE = 20;
  // TODO: 判断Windows版本号以传不同参数，win11是20，win 10部分版本是19
  DwmSetWindowAttribute(
    hwnd,
    DWMWA_USE_IMMERSIVE_DARK_MODE,
    &USE_DARK_MODE,
    sizeof(USE_DARK_MODE)
  );
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

NODE_API_MODULE(titlebar, Init)