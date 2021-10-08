import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Jumbotron } from 'reactstrap';

export default () => (
  <div>
    <Jumbotron paragraph variant="h6">
      Головна сторінка студента
    </Jumbotron>
    <Jumbotron paragraph variant="h6">
      Добрий день!
    </Jumbotron>
    <Button><Link to="register-coordinates">Зареєструвати координати</Link></Button>
  </div>
);
