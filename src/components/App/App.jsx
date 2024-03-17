import React from "react";
import { TodoContainer } from "../TodoContainer";

const Wrapper = ({ children }) => (
  <div
    style={{
      maxWidth: 600,
      padding: 10,
      margin: "0 auto",
      marginTop: "10%",
    }}
  >
    {children}
  </div>
);

const App = () => (
  <Wrapper>
    <TodoContainer />
  </Wrapper>
);

export default App;
