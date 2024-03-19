import React from "react";
import { TodoContainer } from "../TodoContainer";

const Wrapper = ({ children }) => (
  <div
    style={{
      maxWidth: 600,
      margin: "0 auto",
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
