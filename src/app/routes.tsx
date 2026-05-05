import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { InicioPage } from "./pages/InicioPage";
import { RevisarPage } from "./pages/RevisarPage";
import { BorradorPage } from "./pages/BorradorPage";
import { HistorialPage } from "./pages/HistorialPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: InicioPage },
      { path: "historial", Component: HistorialPage },
      { path: "revisar", Component: RevisarPage },
      { path: "borrador", Component: BorradorPage },
    ],
  },
]);
