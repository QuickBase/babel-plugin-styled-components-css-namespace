const styled = { input() {} };

export default styled.input`
  && {
    border: ${(props) => props.borderWidth} solid
      ${(props) => props.borderColor};
  }
`;
