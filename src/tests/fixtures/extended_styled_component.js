const styled = () => {};
styled.div = () => {};

const styledDiv = styled.div`
  width: 100px;
`;

const MyStyledComponent = styled(styledDiv)`
  background-color: 'yellow';
`;

export default MyStyledComponent;
