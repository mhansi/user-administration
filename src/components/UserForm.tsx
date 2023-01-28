import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { User } from "../types/User";

interface Props {
  user?: User;
  isModalOpen: boolean;
  modalCloseHandler: () => void;
  createOrUpdateUserHandler: (user: User, isUpdate: boolean) => void;
}

const UserForm = ({
  isModalOpen,
  user,
  modalCloseHandler,
  createOrUpdateUserHandler,
}: Props) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      const { firstName, lastName, email } = user;
      setFormData({
        firstName,
        lastName,
        email,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
      });
    }
  }, [user]);

  const changeHandler = (e: any) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submitHandler = (e: any) => {
    e.preventDefault();
    const newUser: User = {
      id: user ? user.id : Math.random(),
      ...formData,
    };
    createOrUpdateUserHandler(newUser, !!user);
    modalCloseHandler();
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={isModalOpen} onHide={modalCloseHandler}>
        <Modal.Header closeButton>
          <Modal.Title>{user ? "Update User" : "Create User"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={formData.firstName}
                type="text"
                placeholder="Ex: John"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                value={formData.lastName}
                type="text"
                placeholder="Ex: Doe"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                value={formData.email}
                type="email"
                placeholder="Ex: johndoe@example.com"
                onChange={changeHandler}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              {user ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

interface FormData extends Omit<User, "id"> {}

export default UserForm;
