import { Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./components/utils/ProtectedRoutes";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Redirect } from "./pages/Redirect";
import { ApiProvider } from "@reduxjs/toolkit/query/react"

import { discordApi } from "./features/discord/discordSlice";
import { PlayerControll } from "./pages/PlayerControll";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="/:serverId"  element={<PlayerControll />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/redirect" element={<Redirect />} />  
    </Routes>
  );
}

export default App;
