const styled = { div() {} };

const MyStyledComponent = styled.div`
  background-color: ${(props) => (props.isDark ? 'red' : 'yellow')};
  color: ${(props) => (props.isDark ? 'white' : 'navy')};
  font-size: 30px;
  padding: 20px;

  &:hover {
    ${(props) => (props.isDark ? 'color: red' : 'color: white')};
  }
`;

export default MyStyledComponent;
