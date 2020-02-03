import React, { useState, useContext } from "react";

import {
  Container,
  Title,
  Buttons,
  Card,
  ErrorMessage
} from "../SignIn/styles";
import Input from "../../components/Input";
import Button from "../../components/Button";
import SizedBox from "../../components/SizedBox";
import VectorContainer from "../../components/VectorContainer";
import signin_vector from "../../assets/img/flame-sign-up.png";
import BackLink from "../../components/BackLink";
import axiosInstance from "../../services/api";
import AuthContext from "../../contexts/auth";

export default function SignUp({ history }) {
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [error, setError] = useState();

  const register = async () => {
    if (!email || !password || !username || !name) {
      setError("Please, fill all data.");
      return;
    }
    try {
      const response = await axiosInstance.post("/users", {
        email,
        password,
        username,
        name
      });

      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${response.data.token}`
      };

      const userData = {
        ...user,
        isLoggedIn: true,
        data: response.data.user,
        token: response.data.token
      };

      setUser(userData);

      localStorage.setItem("user", JSON.stringify(userData));

      history.push("/");
    } catch ({ response }) {
      console.log(response);
      setError(response?.data || "Unexpected error");
    }
  };

  return (
    <Container>
      <VectorContainer src={signin_vector} />
      <Title>Sign Up</Title>
      <Card width="50%">
        <BackLink onClick={() => history.push("/login")}>
          Back to Login
        </BackLink>
        <form className="col s12">
          <Input
            id="email"
            name="email"
            icon="mail_outline"
            type="email"
            label="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          ></Input>
          <Input
            id="password"
            name="password"
            icon="lock_outline"
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          ></Input>
          <Input
            id="username"
            name="username"
            icon="person_outline"
            type="text"
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          ></Input>
          <Input
            id="fullname"
            name="fullname"
            icon="face"
            type="text"
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          ></Input>
        </form>
        <ErrorMessage>{error}</ErrorMessage>
        <SizedBox height="20px" />
        <Buttons>
          <Button color="purple" onClick={register}>
            Create Account
          </Button>
        </Buttons>
      </Card>
    </Container>
  );
}
