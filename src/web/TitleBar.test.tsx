import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import TitleBar from './TitleBar';

describe('TitleBar', () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it('renders title text', () => {
    act(() => {
      render(<TitleBar titleText="My Title" />, container!);
    });
    const wrapper = container!.firstElementChild as HTMLElement;
    const title = wrapper.firstElementChild as HTMLElement;
    expect(title.textContent).toBe('My Title');
  });

  it('triggers callbacks when buttons clicked', () => {
    const onMinimize = jest.fn();
    const onMaximize = jest.fn();
    const onUnMaximize = jest.fn();
    const onClose = jest.fn();

    act(() => {
      render(
        <TitleBar
          titleText=""
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onUnMaximize={onUnMaximize}
          onClose={onClose}
        />, container!);
    });

    const wrapper = container!.firstElementChild as HTMLElement;
    const buttons = wrapper.lastElementChild as HTMLElement;
    const buttonItems = buttons.children;

    act(() => {
      (buttonItems[0] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onMinimize).toHaveBeenCalledTimes(1);

    act(() => {
      (buttonItems[1] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onMaximize).toHaveBeenCalledTimes(1);

    act(() => {
      (buttonItems[1] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onUnMaximize).toHaveBeenCalledTimes(1);

    act(() => {
      (buttonItems[2] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
