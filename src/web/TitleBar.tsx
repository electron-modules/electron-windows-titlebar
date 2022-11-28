import { useState } from 'react';
import styles from './TitleBar.module.less';

interface TitleBarProps {
  titleText: string;
  titleTextColor: string;
  titleTextFontSize: string;
  titleBarHeight: string;
  titleBarColor: string;
  iconSize: string;
  iconColor: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onUnMaximize: () => void;
  onClose: () => void;
}

const Icons = {
  minimize: <svg viewBox="0 0 11 11"><path d="M11,4.9v1.1H0V4.399h11z" /></svg>,
  maximize: <svg viewBox="0 0 11 11"><path d="M0,1.7v7.6C0,10.2,0.8,11,1.7,11h7.6c0.9,0,1.7-0.8,1.7-1.7V1.7C11,0.8,10.2,0,9.3,0H1.7C0.8,0,0,0.8,0,1.7z M8.8,9.9H2.2c-0.6,0-1.1-0.5-1.1-1.1V2.2c0-0.6,0.5-1.1,1.1-1.1h6.7c0.6,0,1.1,0.5,1.1,1.1v6.7C9.9,9.4,9.4,9.9,8.8,9.9z" /></svg>,
  restore: <svg viewBox="0 0 11 11"><path d="M7.9,2.2h-7C0.4,2.2,0,2.6,0,3.1v7C0,10.6,0.4,11,0.9,11h7c0.5,0,0.9-0.4,0.9-0.9v-7C8.8,2.6,8.4,2.2,7.9,2.2z M7.7,9.6 c0,0.2-0.1,0.3-0.3,0.3h-6c-0.2,0-0.3-0.1-0.3-0.3v-6c0-0.2,0.1-0.3,0.3-0.3h6c0.2,0,0.3,0.1,0.3,0.3V9.6z" /><path d="M10,0H3.5v1.1h6.1c0.2,0,0.3,0.1,0.3,0.3v6.1H11V1C11,0.4,10.6,0,10,0z" /></svg>,
  close: <svg viewBox="0 0 11 11"><path d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z" /></svg>,
};

const TitleBar = (props: TitleBarProps) => {
  const {
    titleText, titleTextColor, titleTextFontSize,
    titleBarHeight, titleBarColor,
    iconSize, iconColor,
    onMinimize, onMaximize, onUnMaximize, onClose,
  } = props;
  function getIconItemStyle() {
    return {
      width: iconSize,
      height: iconSize,
    };
  }
  const iconItemStyle = getIconItemStyle();
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    if (isMaximized) {
      onUnMaximize();
    } else {
      onMaximize();
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        fontSize: titleTextFontSize,
        color: titleTextColor,
        height: titleBarHeight,
        lineHeight: titleBarHeight,
        backgroundColor: titleBarColor,
      }}
    >
      <div className={styles.draggaleArea}>
        {titleText}
      </div>
      <div className={styles.buttons} style={{ fill: iconColor }}>
        <div
          className={styles.buttonItem}
          style={iconItemStyle}
          onClick={() => onMinimize()}
        >
          {Icons.minimize}
        </div>
        <div
          className={styles.buttonItem}
          style={iconItemStyle}
          onClick={() => toggleMaximize()}
        >
          {isMaximized ? Icons.restore : Icons.maximize}
        </div>
        <div
          className={styles.buttonItem}
          style={iconItemStyle}
          onClick={() => onClose()}
        >
          {Icons.close}
        </div>
      </div>
    </div>
  );
};

TitleBar.defaultProps = {
  titleText: '',
  titleTextColor: '#fff',
  titleTextFontSize: '16px',
  titleBarHeight: '32px',
  titleBarColor: '#3d3c3c',
  iconSize: '12px',
  iconColor: '#fff',
  onMinimize() {},
  onMaximize() {},
  onUnMaximize() {},
  onClose() {},
};

export default TitleBar;
