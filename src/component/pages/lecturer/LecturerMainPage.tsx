import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Button, ButtonGroup, Jumbotron } from 'reactstrap';
import styled from 'styled-components';

const ButtonGroupWrapper = styled.div`
  margin: 12px 0px 0px;
`;

export default () => {
  const [choiceRegisterProvidingFiles, setChoiceRegisterProvidingFiles] = useState(false);
  const [choiceRegisterManually, setChoiceRegisterManually] = useState(false);

  return (
    <>
      {choiceRegisterProvidingFiles && <Redirect to="/register/providing-files" />}
      {choiceRegisterManually && <Redirect to="/register/manually" />}
      <div>
        <Jumbotron>
          <div>Сторінка викладача</div>
          <ButtonGroupWrapper>
            <ButtonGroup>
              <Button color="primary" onClick={() => setChoiceRegisterProvidingFiles(true)}>
                Зареєструвати присутність студентів, використовуючи файл Teams
              </Button>
              <Button color="primary" onClick={() => setChoiceRegisterManually(true)}>
                Зареєструвати присутність студентів власноруч
              </Button>
            </ButtonGroup>
          </ButtonGroupWrapper>
        </Jumbotron>
      </div>
    </>
  );
};
