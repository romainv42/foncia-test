import m from "mithril"

export const administrators = {
  list: {
    oncreate: (vnode) => {
      const refresh = (page, pageSize) => {
        m.request({
          url: "/api/administators",
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("auth-token")}`
          },
          data: { ...vnode.state.pagination }
        })
          .then(data => {
            vnode.state.administrators = data.result;
            vnode.state.pagination.count = Math.ceil(data.count / data.size);
            m.redraw();
          })
          .catch(err => {
            m.route.set("/login");
          });
      }
      refresh();

      vnode.state.pagination = { page: 1, pageSize: 10, method: refresh };
    },
    view: (vnode) => vnode.state.administrators ?
      m("div", [
        m("table.table", [
          m("thead", [
            m("tr", [
              m("th", "Nom"),
              m("th", "Email"),
              m("th", "Nombre de lots")
            ])
          ]),
          m("tbody", vnode.state.administrators.map(admin => {
            return m("tr", [
              m("td", [
                m("a", { href: `/gestionnaires/${admin._id}`, oncreate: m.route.link }, admin.fullname)
              ])
            ])
          }))
        ]),
        m(pagination, { pagination: vnode.state.pagination })
      ]) :
      m("p", "Loading")
  },
  details: {

  }
}
