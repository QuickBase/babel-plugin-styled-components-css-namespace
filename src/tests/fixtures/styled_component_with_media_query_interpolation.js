const styled = { div() {} };

const mediaQuery = '@media only screen and (min-width: 426px)';

const MyStyledComponent = styled.div`
  background-color: red;
  ${mediaQuery} {
    background-color: blue;
  }
`;

export default MyStyledComponent;
