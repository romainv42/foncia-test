import m from "mithril"
import pagination from "./paginate"

export const customers = {
  oncreate: (vnode) => {
    const refresh = (page, pageSize) => {
      m.request({
        url: "/api/customers",
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("auth-token")}`
        },
        data: { ...vnode.state.pagination }
      })
        .then(data => {
          vnode.state.customers = data.result;
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
  view: (vnode) => vnode.state.customers ?
    m("div", [
      m("table.table", [
        m("thead", [
          m("tr", [
            m("th", "Nom"),
            m("th", "Email"),
            m("th", "Nombre de lots")
          ])
        ]),
        m("tbody", vnode.state.customers.map(c => {
          return m("tr", [
            m("td", c.fullname),
            m("td", c.email),
            m("td", c.batchCount)
          ])
        }))
      ]),
      m(pagination, { pagination: vnode.state.pagination })
    ]) :
    m("p", "Loading")
};
