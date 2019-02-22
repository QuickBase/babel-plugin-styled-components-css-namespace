import styled from 'styled-components';

const Child = styled.span;

export default styled.div`
  position: relative;
  ${Child} {
    ${props => props.childStyles};
  }
  ${Child} + &, & + ${Child} {
    margin-right: ${props => props.spaceBetween};
  }
`;
