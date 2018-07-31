const styled = { div() {} };

const MyStyledComponent = styled.div`
  label + & {
    background-color: 'yellow';
  }
`;

export default MyStyledComponent;
