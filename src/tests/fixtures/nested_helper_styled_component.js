const styled = { div() {} };
const css = { css() {} };

const styledCSS = css`
  width: 100px;
`;

const MyStyledComponent = styled.div`
  background-color: 'yellow';
  ${styledCSS};
`;

export default MyStyledComponent;
