const styled = { div() {} };

const MyStyledComponent = styled.div`
  background-color: red;
  @media only screen and (min-width: 426px) {
    background-color: blue;
  }
`;

export default MyStyledComponent;
