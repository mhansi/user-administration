import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { User } from "../types/User";

interface Props {
  users: User[];
  selectUserHandler: (user: User) => void;
  sortHandler: (
    field: "id" | "firstName" | "lastName" | "email",
    isAsc: boolean
  ) => void;
}

const UserTable = ({ users, selectUserHandler, sortHandler }: Props) => {
  const [sortConfig, setSortConfig] = useState<{
    field: "id" | "firstName" | "lastName" | "email";
    isAsc: boolean;
  }>({
    field: "id",
    isAsc: false,
  });

  const setSortHandler = (field: "id" | "firstName" | "lastName" | "email") => {
    let sortConfigItem = sortConfig;
    if (sortConfigItem.field === field) {
      sortConfigItem.isAsc = !sortConfigItem.isAsc;
    } else {
      sortConfigItem = {
        field,
        isAsc: true,
      };
    }
    sortHandler(sortConfigItem.field, sortConfigItem.isAsc);
    setSortConfig(sortConfigItem);
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th className="cursor-pointer" onClick={() => setSortHandler("id")}>
            ID
          </th>
          <th
            className="cursor-pointer"
            onClick={() => setSortHandler("firstName")}
          >
            First Name
          </th>
          <th
            className="cursor-pointer"
            onClick={() => setSortHandler("lastName")}
          >
            Last Name
          </th>
          <th
            className="cursor-pointer"
            onClick={() => setSortHandler("email")}
          >
            Email
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </td>
            <td>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => selectUserHandler(user)}
              >
                Update
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
