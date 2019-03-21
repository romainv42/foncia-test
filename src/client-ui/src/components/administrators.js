import m from "mithril"
import pagination from "./paginate"

export const administrators = {
  list: {
    oncreate: (vnode) => {
      const refresh = (page, pageSize) => {
        m.request({
          url: "/api/administrators",
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
              m("th", "Nom")
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
    oncreate: (vnode) => {
      m.request({
        url: `/api/administrators/detail/${vnode.attrs.id}`,
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("auth-token")}`
        }
      }).then(data => {
        vnode.state.administrator = data;
        vnode.state.pagination.count = Math.ceil(vnode.state.administrator.combinations.length / vnode.state.pagination.pageSize)
      }).catch(err => {
        m.route.set("/login");
      });

      vnode.state.pagination = { page: 1, pageSize: 10, method: () => m.redraw() };
    },
    view: (vnode) => vnode.state.administrator ? m(".container", [
      m("h3.title", vnode.state.administrator.fullname),
      m("h6.subtitle", "Combinaisons accessibles:"),
      m("ul", vnode.state.administrator.combinations
        .slice(
          (vnode.state.pagination.page - 1) * vnode.state.pagination.pageSize,
          ((vnode.state.pagination.page - 1) * vnode.state.pagination.pageSize) + vnode.state.pagination.pageSize)
        .map(c => m("li", c))),
      m(pagination, { pagination: vnode.state.pagination })

    ]) : null
  }
}
