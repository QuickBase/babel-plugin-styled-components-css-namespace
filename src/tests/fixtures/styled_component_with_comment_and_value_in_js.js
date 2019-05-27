const styled = { div() {} };

const MyStyledComponent = styled.div`
  /* comment */
  color: ${() => 'blue'};
`;

export default MyStyledComponent;
