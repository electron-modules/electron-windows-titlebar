import { useState } from 'react';
import ReactDOM from 'react-dom';
import TitleBar from '../../src/TitleBar';
import styles from './index.module.less';

const onMinimize = () => {
  window?.electron?.ipcRenderer.send('window-action', { action: 'minimize' });
};
const onMaximize = () => {
  window?.electron?.ipcRenderer.send('window-action', { action: 'maximize' });
};
const onUnMaximize = () => {
  window?.electron?.ipcRenderer.send('window-action', { action: 'unmaximize' });
};
const onClose = () => {
  window?.electron?.ipcRenderer.send('window-action', { action: 'close' });
};

const container = document.querySelector('#app');

const viewModel = () => {
  const [isDark, setIsDark] = useState(false);
  function toggleDarkMode() {
    setIsDark(!isDark);
  }
  const titleBarProps = isDark ? {
    titleText: 'Dark Mode',
    titleTextColor: '#fff',
    titleBarColor: '#3d3c3c',
    iconColor: '#fff',
  } : {
    titleText: 'Light Mode',
    titleTextColor: '#000',
    titleBarColor: '#f7f7f6',
    iconColor: '#000',
  };
  
  return {
    titleBarProps,
    toggleDarkMode,
  };
};

const App = () => {
  const vm = viewModel();
  return (
    <>
      <TitleBar
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onUnMaximize={onUnMaximize}
        onClose={onClose}
        {...vm.titleBarProps}
      />
      <div className={styles.button}>
        <button onClick={vm.toggleDarkMode}>toggle dark mode</button>
      </div>
    </>
  );
};

ReactDOM.render(<App />, container);
