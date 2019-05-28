const styled = { div() {} };

// prettier-ignore
const MyStyledComponent = styled.div`
  color: ${() => 'color: blue;'}
`;

export default MyStyledComponent;
