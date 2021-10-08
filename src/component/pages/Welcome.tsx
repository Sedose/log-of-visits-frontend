import React from 'react';
import { Button, Jumbotron } from 'reactstrap';

interface WelcomeProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

const WelcomeContent = ({
  isAuthenticated,
  user,
  authButtonMethod,
}: WelcomeProps) => (isAuthenticated && (
<div>
  <h4>
    Добрий день, {user.displayName}!
  </h4>
  <p>Для початку скористайтеся панеллю навігації у верхній частині сторінки.</p>
</div>
)) || (
<Button color="primary" onClick={authButtonMethod}>
  Клацніть тут, щоб увійти
</Button>
);

export default ({ isAuthenticated, user, authButtonMethod }: WelcomeProps) => (
  <Jumbotron>
    <h1>Система управління відвідуванням студентів</h1>
    <p className="lead">Ця програма призначена для викладачів, представників учбових відділів</p>
    <WelcomeContent
      isAuthenticated={isAuthenticated}
      user={user}
      authButtonMethod={authButtonMethod}
    />
  </Jumbotron>
);
