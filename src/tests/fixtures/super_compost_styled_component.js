const styled = { div() {} };

const MyStyledComponent = styled.div`
  font-size: 12px;
  transform: rotate(120deg);
  &.bold,
  label + & {
    background-color: 'yellow';
  }

  label span + & {
    background-color: 'black';
  }
`;

export default MyStyledComponent;
