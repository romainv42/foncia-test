import m from "mithril"

export const home = {
  view: () => m("article", [
    m("h2", "Welcome"),
    localStorage.getItem("auth-token") ? null : m("a", { href: "/login", oncreate: m.route.link }, "Please login"),
  ]),
}
