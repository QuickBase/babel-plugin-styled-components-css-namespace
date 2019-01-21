import styled from 'styled-components';

const MyStyledComponent = styled.div`
  & + & {
    background-color: 'yellow';
  }
`;

export default MyStyledComponent;
