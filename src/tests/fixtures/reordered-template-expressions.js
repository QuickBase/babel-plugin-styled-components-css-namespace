import styled from 'styled-components';

/*
  The PostCSS flattening pulls the &:hover and &:active out of the
  main style block, placing it _after_ the main block. Therefore
  the template expressions in those pseudo-class style blocks are
  not in the same relative position in the final processed CSS
  as they were in the original. The bug-fix tracks the _order_ of
  the expressions, so that when they're inserted back into the
  template each expression winds up in the correct position.
 */

export default styled.div`
  background: ${(props) => props.background};
  border: 1px solid ${(props) => props.borderColor};
  width: 100%;

  ${(props) => props.styles};

  &:hover {
    border-color: ${(props) => props.hoverBorder};
  }

  &:active {
    border-color: ${(props) => props.activeBorder};
    ${props.activeStyles};
  }

  ${(props) => props.moreStyles};
`;
