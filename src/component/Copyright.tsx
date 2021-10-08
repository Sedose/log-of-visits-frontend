import React from 'react';
import styled from 'styled-components';

const CopyrightWrapper = styled.div`
  'align-self': 'center',
`;

export default () => (
  <CopyrightWrapper>
    {`Copyright © Online log of visits ${new Date().getFullYear()}`}
  </CopyrightWrapper>
);
