import {
  createGlobalStyle,
  css,
  injectGlobal,
  keyframes
} from 'styled-components';

export const getBodyColorStyle = color => createGlobalStyle`
  body {
    color: ${color};
  }
`;

export const injectBodyStyles = styles => {
  injectGlobal`
    body {
      ${styles};
    }
  `;
};

export const Rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Clearfix = css`
  &:after {
    display: table;
    content: '';
    clear: 'both';
  }
`;
