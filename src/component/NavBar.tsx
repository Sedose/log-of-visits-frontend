import React, { useEffect, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Button,
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import '@fortawesome/fontawesome-free/css/all.css';

interface NavBarProps {
  isAuthenticated: boolean;
  login: any;
  logout: any;
  user: {
    appRole: string;
    displayName: string;
    email: string;
  };
  appLogin: Function;
}

const UserAvatar = ({ user }: any) => (user.avatar && (
  <img
    src={user.avatar}
    alt="user"
    className="rounded-circle align-self-center mr-2"
    style={{ width: '32px' }}
  />
)) || (
  <i
    className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
    style={{ width: '32px' }}
  />
);

interface AuthNavItemProps {
  isAuthenticated: boolean;
  login: any;
  logout: any;
  user: {
    appRole: string;
    displayName: string;
    email: string;
  };
}

const AuthNavItem = ({
  isAuthenticated,
  user,
  login,
  logout,
}: AuthNavItemProps) => (
  (isAuthenticated && (
  <UncontrolledDropdown>
    <DropdownToggle nav caret>
      <UserAvatar user={user} />
    </DropdownToggle>
    <DropdownMenu right>
      <h5 className="dropdown-item-text mb-0">{user.displayName}</h5>
      <p className="dropdown-item-text text-muted mb-0">{user.email}</p>
      <DropdownItem divider />
      <DropdownItem onClick={logout}>Вийти</DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
  )) || (
  <NavItem>
    <Button
      onClick={login}
      className="btn-link nav-link border-0"
      color="link"
    >
      Увійти
    </Button>
  </NavItem>
  )
);

export default ({
  isAuthenticated,
  user,
  login,
  logout,
  appLogin,
}: NavBarProps) => {
  const [isOpen, setOpen] = useState(false);
  const [link, setLink] = useState();

  useEffect(() => {
    setMainPageLinkAsync();
  }, []);

  const handleGoToMainPage = async () => {
    document.location.href = link ?? '';
  };

  async function setMainPageLinkAsync() {
    const userRole = await appLogin();
    setLink({
      STUDENT: '/student-main-page',
      LECTURER: '/lecturer-main-page',
      TRAINING_REPRESENTATIVE: '/training-representative-main-page',
    }[userRole] || '/');
  }

  return (
    <div>
      <Navbar color="dark" dark expand="md" fixed="top">
        <Container>
          <NavbarBrand href="/">Logs of visits</NavbarBrand>
          <NavbarToggler onClick={() => setOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <RouterNavLink to="" className="nav-link" exact onClick={handleGoToMainPage}>
                  Головна сторінка
                </RouterNavLink>
              </NavItem>
              {isAuthenticated && (
              <NavItem>
                <RouterNavLink to="/settings" className="nav-link" exact>
                  Налаштування
                </RouterNavLink>
              </NavItem>
              )}
            </Nav>
            <Nav className="justify-content-end" navbar>
              <NavItem>
                <NavLink
                  href="https://developer.microsoft.com/graph/docs/concepts/overview"
                  target="_blank"
                >
                  <i className="fas fa-external-link-alt mr-1" />
                  Docs
                </NavLink>
              </NavItem>
              <AuthNavItem
                isAuthenticated={isAuthenticated}
                login={login}
                logout={logout}
                user={user}
              />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
