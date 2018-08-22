const styled = { div() {} };

const MyStyledComponent = styled.div`
  background-color: ${props => (props.isDark ? 'red' : 'yellow')};
  color: ${props => (props.isDark ? 'white' : 'navy')};
  font-size: 30px;
  padding: 20px;

  input + & {
    border: 1px solid black;
  }

  label + & {
    color: ${props => (props.isDark ? 'white' : 'navy')};
    border: 1px solid black;
  }

  input[type='button'] + & {
    border: 1px solid black;
  }

  label.subtitle + & {
    color: ${props => (props.isDark ? 'white' : 'navy')};
    border: 1px solid black;
  }
`;

export default MyStyledComponent;
