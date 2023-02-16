import { S as SvelteComponent, i as init, s as safe_not_equal, H as create_slot, k as element, a as space, q as text, l as claim_element, m as children, c as claim_space, r as claim_text, h as detach, n as attr, b as insert_hydration, I as append_hydration, J as update_slot_base, K as get_all_dirty_from_scope, L as get_slot_changes, f as transition_in, t as transition_out } from "../../chunks/index-9a875c02.js";
const app = "";
function create_fragment(ctx) {
  let div5;
  let t0;
  let footer;
  let div0;
  let a;
  let t1;
  let t2;
  let div1;
  let p;
  let t3;
  let t4_value = new Date().getFullYear() + "";
  let t4;
  let t5;
  let t6;
  let div4;
  let div3;
  let div2;
  let span;
  let t7;
  let br;
  let t8;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[1].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[0],
    null
  );
  return {
    c() {
      div5 = element("div");
      if (default_slot)
        default_slot.c();
      t0 = space();
      footer = element("footer");
      div0 = element("div");
      a = element("a");
      t1 = text("Telegram");
      t2 = space();
      div1 = element("div");
      p = element("p");
      t3 = text("© ");
      t4 = text(t4_value);
      t5 = text(" Bifrost");
      t6 = space();
      div4 = element("div");
      div3 = element("div");
      div2 = element("div");
      span = element("span");
      t7 = text("Bridge is still under development. ");
      br = element("br");
      t8 = text(" You only see the beta release.");
      this.h();
    },
    l(nodes) {
      div5 = claim_element(nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      if (default_slot)
        default_slot.l(div5_nodes);
      t0 = claim_space(div5_nodes);
      footer = claim_element(div5_nodes, "FOOTER", { class: true });
      var footer_nodes = children(footer);
      div0 = claim_element(footer_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      a = claim_element(div0_nodes, "A", {
        class: true,
        target: true,
        rel: true,
        href: true
      });
      var a_nodes = children(a);
      t1 = claim_text(a_nodes, "Telegram");
      a_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t2 = claim_space(footer_nodes);
      div1 = claim_element(footer_nodes, "DIV", {});
      var div1_nodes = children(div1);
      p = claim_element(div1_nodes, "P", {});
      var p_nodes = children(p);
      t3 = claim_text(p_nodes, "© ");
      t4 = claim_text(p_nodes, t4_value);
      t5 = claim_text(p_nodes, " Bifrost");
      p_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      footer_nodes.forEach(detach);
      t6 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div2 = claim_element(div3_nodes, "DIV", {});
      var div2_nodes = children(div2);
      span = claim_element(div2_nodes, "SPAN", {});
      var span_nodes = children(span);
      t7 = claim_text(span_nodes, "Bridge is still under development. ");
      br = claim_element(span_nodes, "BR", {});
      t8 = claim_text(span_nodes, " You only see the beta release.");
      span_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a, "class", "link link-hover");
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer");
      attr(a, "href", "https://t.me/bifrost_defi");
      attr(div0, "class", "grid grid-flow-col gap-4");
      attr(footer, "class", "footer footer-center p-5 bg-base-100 gap-2 text-base-content rounded");
      attr(div3, "class", "alert alert-warning");
      attr(div4, "class", "toast");
      attr(div5, "class", "flex flex-col min-h-screen justify-between");
    },
    m(target, anchor) {
      insert_hydration(target, div5, anchor);
      if (default_slot) {
        default_slot.m(div5, null);
      }
      append_hydration(div5, t0);
      append_hydration(div5, footer);
      append_hydration(footer, div0);
      append_hydration(div0, a);
      append_hydration(a, t1);
      append_hydration(footer, t2);
      append_hydration(footer, div1);
      append_hydration(div1, p);
      append_hydration(p, t3);
      append_hydration(p, t4);
      append_hydration(p, t5);
      append_hydration(div5, t6);
      append_hydration(div5, div4);
      append_hydration(div4, div3);
      append_hydration(div3, div2);
      append_hydration(div2, span);
      append_hydration(span, t7);
      append_hydration(span, br);
      append_hydration(span, t8);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        1)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[0],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[0]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[0],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div5);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(0, $$scope = $$props2.$$scope);
  };
  return [$$scope, slots];
}
class Layout extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  Layout as default
};
