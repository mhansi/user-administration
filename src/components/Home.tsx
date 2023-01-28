import { useEffect, useState } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { User } from "../types/User";
import Header from "./Header";
import PaginationBar from "./PaginationBar";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

const Home = () => {
  const usersPerPage = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(0);

  const [users, setUsers] = useState<User[]>([]);
  const [initialUsers, setInitialUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUsers] = useState<User>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [message, setMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    try {
      const fetchUsers = async (page: number) => {
        const response = await fetch(
          `https://reqres.in/api/users?page=${page}&per_page=${usersPerPage}`
        );
        const result = await response.json();
        const userList = result.data.map((user: any) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
        }));

        setTotalNumberOfPages(result.total_pages);
        setUsers(userList);
        setInitialUsers(userList);
        setLoading(false);
      };

      fetchUsers(currentPage);
    } catch (error) {
      setMessage("User fetch failed");
      setTimeout(() => {
        setMessage(undefined);
      }, 5000);
      setLoading(false);
    }
  }, [currentPage]);

  const currentPageHandler = (i: number) => {
    localStorage.setItem("currentPage", i.toString());
    setCurrentPage(i);
  };

  const openModalOnUserSelect = (user: User) => {
    setSelectedUsers(user);
    setIsModalOpen(true);
  };

  const modelCloseHandler = () => {
    setIsModalOpen(false);
    setSelectedUsers(undefined);
  };

  const createOrUpdateUserHandler = async (user: User, isUpdate: boolean) => {
    if (isUpdate) {
      try {
        const response = await fetch(`https://reqres.in/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: user.firstName,
            job: user.lastName,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          setUsers((prev) =>
            prev.map((item) => {
              if (item.id === user.id) return user;
              return item;
            })
          );
          setInitialUsers((prev) =>
            prev.map((item) => {
              if (item.id === user.id) return user;
              return item;
            })
          );
          setMessage("User updated");
          setTimeout(() => {
            setMessage(undefined);
          }, 5000);
        } else {
          setMessage("User update failed");
          setTimeout(() => {
            setMessage(undefined);
          }, 5000);
        }
      } catch (error) {
        setMessage("User update failed");
        setTimeout(() => {
          setMessage(undefined);
        }, 5000);
      }
    } else {
      try {
        const response = await fetch("https://reqres.in/api/users", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: user.firstName,
            job: user.lastName,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          // New user added in the table just to show the result. It is wrong as we using a pagination. we need to fetch the users again
          setUsers((prev) => [...prev, user]);
          setInitialUsers((prev) => [...prev, user]);

          setMessage(
            "User Created:  New user added in the table just to show the result. It is wrong as we using a pagination. we need to fetch the users again"
          );
          setTimeout(() => {
            setMessage(undefined);
          }, 5000);
        } else {
          setMessage("User Creation failed");
          setTimeout(() => {
            setMessage(undefined);
          }, 5000);
        }
      } catch (error) {
        setMessage("User Creation failed");
        setTimeout(() => {
          setMessage(undefined);
        }, 5000);
      }
    }
  };

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = initialUsers.filter((user) => {
        return (
          user.firstName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().startsWith(keyword.toLowerCase()) ||
          user.email.toLowerCase().startsWith(keyword.toLowerCase())
        );
      });
      setUsers(results);
    } else {
      setUsers(initialUsers);
    }
  };

  const sortHandler = (
    field: "id" | "firstName" | "lastName" | "email",
    isAsc: boolean
  ) => {
    let sortedList = [];
    if (isAsc) {
      sortedList = users.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    } else {
      sortedList = users.sort((a, b) => (a[field] > b[field] ? -1 : 1));
    }

    setUsers([...sortedList]);
  };

  return (
    <>
      <Header searchKeyWordHandler={searchHandler} />
      {loading ? (
        <p>Loading.....</p>
      ) : (
        <Container>
          {message && <Alert variant="primary">{message}</Alert>}
          <Row>
            <p>Click on column headers to sort ascending or decending order</p>
            <UserTable
              users={users}
              selectUserHandler={openModalOnUserSelect}
              sortHandler={sortHandler}
            />
          </Row>
          <Row>
            <Col md={6} xs={6}>
              <PaginationBar
                totalNumberOfPages={totalNumberOfPages}
                currentPage={currentPage}
                currectPageHandle={currentPageHandler}
              />
            </Col>
            <Col md={6} xs={6} className="ml-auto">
              <Button
                onClick={() => {
                  setSelectedUsers(undefined);
                  setIsModalOpen(true);
                }}
                variant="primary"
              >
                Create User
              </Button>
            </Col>
          </Row>
          <UserForm
            isModalOpen={isModalOpen}
            modalCloseHandler={modelCloseHandler}
            createOrUpdateUserHandler={createOrUpdateUserHandler}
            user={selectedUser}
          />
        </Container>
      )}
    </>
  );
};

export default Home;
