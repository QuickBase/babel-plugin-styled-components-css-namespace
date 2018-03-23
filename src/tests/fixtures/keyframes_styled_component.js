const styled = { div() {} };

const mymove = styled.keyframes`
  0% {
    color: transparent;
  }
  100% {
    color: radboats;
  }
`;

const MyStyledComponent = styled.div`
  animation: ${mymove} 5s infinite;
`;

export default MyStyledComponent;
