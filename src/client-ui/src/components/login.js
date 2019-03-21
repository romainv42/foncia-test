import m from "mithril";

const auth = {
  username: "",
  password: "",

  setUsername: (value) => auth.username = value,
  setPassword: (value) => auth.password = value,
  login: () => m.request({
    method: "POST",
    url: "/api/auth",
    data: { ...auth }
  }).then(r => {
    localStorage.setItem("auth-token", r.access_token);
    return Promise.resolve();
  })
}

export const login = {
  view: (vnode) => m("form", [
    m(".field", [
      m("label.label", "Identifiant"),
      m(".control", [
        m("input[type=text]", {
          oninput: function (e) { auth.setUsername(e.target.value) },
          value: auth.username
        }),
      ])
    ]),
    m(".field", [
      m("label.label", "Mot de passe"),
      m(".control", [
        m("input[type=password]", {
          oninput: function (e) { auth.setPassword(e.target.value) },
          value: auth.password
        }),
      ])
    ]),
    m(".field", [
      m(".control", [
        vnode.state.error ? m("p.help.is-danger", "Bad login/password") : null,
        m("button[type=button].is-link", {
          onclick: () => auth.login()
            .then(() => {
              m.redraw();
              m.route.set("/");
            })
            .catch((err) => {
              vnode.state.error = true;
              m.redraw();
            })
        }, "Login")
      ])
    ]),


  ])
};
