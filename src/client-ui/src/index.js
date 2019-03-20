import m from "mithril"
import { menu, home, login, customers, administrators } from "./components";


const routes = [
  { label: "Accueil", path: "/", component: home, menu: true },
  { label: "Login", path: "/login", component: login, menu: false },
  { label: "Clients", path: "/clients", component: customers, menu: true, secured: true },
  { label: "Gestionnaires", path: "/gestionnaires", component: administrators.list, menu: true, secured: true },
  { label: "Details Gestionnaire", path: "/gestionnaires/:id", component: administrators.details, menu: false, secured: true },
];

m.render(document.getElementById("menu"), m(menu, { routes }));

const authChecker = (destination, path) => {
  if (!localStorage.getItem("auth-token")) {
    m.route.set("/login");
  } else {
    return destination
  }
};

m.route(document.getElementById("content"), "/", Object.assign({}, ...routes.map(r => {
  const res = {};
  res[r.path] = !r.secured ? r.component : {
    onmatch: (param, path) => authChecker(r.component)
  }
  return res;
})));
