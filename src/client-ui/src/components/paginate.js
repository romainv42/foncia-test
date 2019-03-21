
/*
<nav class="pagination is-centered" role="navigation" aria-label="pagination">
  <a class="pagination-previous">Previous</a>
  <a class="pagination-next">Next page</a>
  <ul class="pagination-list">
    <li><a class="pagination-link" aria-label="Goto page 1">1</a></li>
    <li><span class="pagination-ellipsis">&hellip;</span></li>
    <li><a class="pagination-link" aria-label="Goto page 45">45</a></li>
    <li><a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a></li>
    <li><a class="pagination-link" aria-label="Goto page 47">47</a></li>
    <li><span class="pagination-ellipsis">&hellip;</span></li>
    <li><a class="pagination-link" aria-label="Goto page 86">86</a></li>
  </ul>
</nav>
*/

import m from "mithril"

export default {
  view: (vnode) => {
    // Don't display pagination if only one page
    if (vnode.attrs.pagination.count === 1) return null;

    const callPage = (page) => {
      vnode.attrs.pagination.page = page;
      vnode.attrs.pagination.method();
    };

    const innerItems = [];
    // Page One always displayed
    innerItems.push(m("li", [
      m("a.pagination-link", {
        class: vnode.attrs.pagination.page === 1 ? "is-current" : null,
        onclick: () => callPage(1)
      }, 1)
    ]));

    // Show ellipsis if needed
    if (vnode.attrs.pagination.page > 3) {
      innerItems.push(m("li", [
        m("span.pagination-ellipsis", "...")
      ]));
    }

    if (vnode.attrs.pagination.page > 1) {
      // Show previous page, if current is not 2 because already shown
      if (vnode.attrs.pagination.page !== 2) {
        innerItems.push(m("li", [
          m("a.pagination-link", {
            onclick: () => callPage(vnode.attrs.pagination.page - 1)
          }, vnode.attrs.pagination.page - 1)
        ]));
      }
    }
    if (vnode.attrs.pagination.page !== 1 && vnode.attrs.pagination.page !== vnode.attrs.pagination.count) {
      // Show current page
      innerItems.push(m("li", [
        m("a.pagination-link.is-current", vnode.attrs.pagination.page)
      ]));
    }

    if (vnode.attrs.pagination.page < vnode.attrs.pagination.count) {
      // Show next page, if current is not the one before last because will be shown
      if (vnode.attrs.pagination.page !== vnode.attrs.pagination.count - 1) {
        innerItems.push(m("li", [
          m("a.pagination-link", {
            onclick: () => callPage(vnode.attrs.pagination.page + 1)
          }, vnode.attrs.pagination.page + 1)
        ]));
      }
    }

    // Show ellipsis if needed
    if (vnode.attrs.pagination.page < vnode.attrs.pagination.count - 2) {
      innerItems.push(m("li", [
        m("span.pagination-ellipsis", "...")
      ]));
    }

    // Last page always displayed
    innerItems.push(m("li", [
      m("a.pagination-link", {
        class: vnode.attrs.pagination.page === vnode.attrs.pagination.count ? "is-current" : null,
        onclick: () => callPage(vnode.attrs.pagination.count)
      }, vnode.attrs.pagination.count)
    ]));

    return m("nav.pagination.is-centered[role='navigation',aria-label='pagination']", [
      m("a.pagination-previous", {
        onclick: () => {
          if (vnode.attrs.pagination.page > 1) {
            vnode.attrs.pagination.page--;
            vnode.attrs.pagination.method();
          }
        },
        class: vnode.attrs.pagination.page === 1 ? "inactive" : ""
      }, "Precedent"),
      m("a.pagination-next", {
        onclick: () => {
          if (vnode.attrs.pagination.page < vnode.attrs.pagination.count) {
            vnode.attrs.pagination.page++;
            vnode.attrs.pagination.method();
          }
        },
        class: vnode.attrs.pagination.page === vnode.attrs.pagination.count ? "inactive" : ""
      }, "Suivant"),
      m("ul.pagination-list", innerItems)
    ])
  }
}
