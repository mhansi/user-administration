import { Container, Navbar } from "react-bootstrap";

interface Props {
  searchKeyWordHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header = ({ searchKeyWordHandler }: Props) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <input
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            onChange={(e) => searchKeyWordHandler(e)}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
