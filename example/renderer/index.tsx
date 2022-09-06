import ReactDOM from 'react-dom';
import TitleBar from '../../src/TitleBar';
import './index.module.less';

const onMinimize = () => {
  window.electron.ipcRenderer.send('window-action', { action: 'minimize' });
};
const onMaximize = () => {
  window.electron.ipcRenderer.send('window-action', { action: 'maximize' });
};
const onUnMaximize = () => {
  window.electron.ipcRenderer.send('window-action', { action: 'unmaximize' });
};
const onClose = () => {
  window.electron.ipcRenderer.send('window-action', { action: 'close' });
};

const container = document.querySelector('#app');

const App = () => {
  return (
    <TitleBar
      titleText="demo's title"
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnMaximize={onUnMaximize}
      onClose={onClose}
    />
  );
};

ReactDOM.render(<App />, container);
