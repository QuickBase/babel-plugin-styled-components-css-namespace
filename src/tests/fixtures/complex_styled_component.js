const styled = { div() {} };

const MyStyledComponent = styled.div`
  background-color: yellow;
  color: {props => props.theme.color};
  
  .foo {
    border: 1px solid black;

    & .bar {
      background-color: blue;
    }
  }
`;
