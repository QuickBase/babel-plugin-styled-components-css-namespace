import styled from 'styled-components';

const MyStyledComponent = styled.input`
  && {
    border: ${(props) => props.borderWidth} solid
      ${(props) => props.borderColor};
  }
`;

export default MyStyledComponent;
