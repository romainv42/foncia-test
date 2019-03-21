import m from "mithril"

const isAuth = () => localStorage.getItem("auth-token");

export const menu = {
  view: (vnode) => m(".navbar-menu.is-active", [
    m(".navbar-start", [
      vnode.attrs.routes.filter(r => r.menu && (r.secured ? isAuth() : true)).map(r => {
        return m("a.navbar-item", { href: r.path, oncreate: m.route.link }, r.label)
      })
    ])
  ])
};
