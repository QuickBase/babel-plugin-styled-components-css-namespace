import styled from 'styled-components';

const MyStyledComponent = styled.div`
  ${(props) => props.firstChildCss};
  ${(props) => props.secondChildCss};
`;

export default MyStyledComponent;
