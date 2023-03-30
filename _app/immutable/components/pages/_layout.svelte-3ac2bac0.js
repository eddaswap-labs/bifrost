import { S as SvelteComponent, i as init, s as safe_not_equal, H as create_slot, k as element, a as space, q as text, l as claim_element, m as children, c as claim_space, r as claim_text, h as detach, n as attr, b as insert_hydration, I as append_hydration, J as update_slot_base, K as get_all_dirty_from_scope, L as get_slot_changes, f as transition_in, t as transition_out, d as check_outros, M as listen, C as noop, N as create_out_transition, g as group_outros } from "../../chunks/index-994bc733.js";
import { f as fly } from "../../chunks/index-ae640bd0.js";
const app = "";
function create_if_block(ctx) {
  let div3;
  let div2;
  let div0;
  let t0;
  let t1;
  let div1;
  let span;
  let t2;
  let br;
  let t3;
  let div3_outro;
  let current;
  let mounted;
  let dispose;
  return {
    c() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      t0 = text("✕");
      t1 = space();
      div1 = element("div");
      span = element("span");
      t2 = text("Bridge is still under development. ");
      br = element("br");
      t3 = text(" You only see the beta release.");
      this.h();
    },
    l(nodes) {
      div3 = claim_element(nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, "✕");
      div0_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {});
      var div1_nodes = children(div1);
      span = claim_element(div1_nodes, "SPAN", {});
      var span_nodes = children(span);
      t2 = claim_text(span_nodes, "Bridge is still under development. ");
      br = claim_element(span_nodes, "BR", {});
      t3 = claim_text(span_nodes, " You only see the beta release.");
      span_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "cursor-pointer");
      attr(div2, "class", "alert alert-warning");
      attr(div3, "class", "toast");
    },
    m(target, anchor) {
      insert_hydration(target, div3, anchor);
      append_hydration(div3, div2);
      append_hydration(div2, div0);
      append_hydration(div0, t0);
      append_hydration(div2, t1);
      append_hydration(div2, div1);
      append_hydration(div1, span);
      append_hydration(span, t2);
      append_hydration(span, br);
      append_hydration(span, t3);
      current = true;
      if (!mounted) {
        dispose = listen(
          div0,
          "click",
          /*click_handler*/
          ctx[3]
        );
        mounted = true;
      }
    },
    p: noop,
    i(local) {
      if (current)
        return;
      if (div3_outro)
        div3_outro.end(1);
      current = true;
    },
    o(local) {
      div3_outro = create_out_transition(div3, fly, { x: 100, duration: 1e3 });
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      if (detaching && div3_outro)
        div3_outro.end();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment(ctx) {
  let div2;
  let t0;
  let footer;
  let div0;
  let a0;
  let t1;
  let t2;
  let a1;
  let t3;
  let t4;
  let div1;
  let p;
  let t5;
  let t6_value = new Date().getFullYear() + "";
  let t6;
  let t7;
  let t8;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[1],
    null
  );
  let if_block = (
    /*showAlert*/
    ctx[0] && create_if_block(ctx)
  );
  return {
    c() {
      div2 = element("div");
      if (default_slot)
        default_slot.c();
      t0 = space();
      footer = element("footer");
      div0 = element("div");
      a0 = element("a");
      t1 = text("Telegram");
      t2 = space();
      a1 = element("a");
      t3 = text("GitHub");
      t4 = space();
      div1 = element("div");
      p = element("p");
      t5 = text("© ");
      t6 = text(t6_value);
      t7 = text(" Synswap Labs");
      t8 = space();
      if (if_block)
        if_block.c();
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      if (default_slot)
        default_slot.l(div2_nodes);
      t0 = claim_space(div2_nodes);
      footer = claim_element(div2_nodes, "FOOTER", { class: true });
      var footer_nodes = children(footer);
      div0 = claim_element(footer_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      a0 = claim_element(div0_nodes, "A", {
        class: true,
        target: true,
        rel: true,
        href: true
      });
      var a0_nodes = children(a0);
      t1 = claim_text(a0_nodes, "Telegram");
      a0_nodes.forEach(detach);
      t2 = claim_space(div0_nodes);
      a1 = claim_element(div0_nodes, "A", {
        class: true,
        target: true,
        rel: true,
        href: true
      });
      var a1_nodes = children(a1);
      t3 = claim_text(a1_nodes, "GitHub");
      a1_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t4 = claim_space(footer_nodes);
      div1 = claim_element(footer_nodes, "DIV", {});
      var div1_nodes = children(div1);
      p = claim_element(div1_nodes, "P", {});
      var p_nodes = children(p);
      t5 = claim_text(p_nodes, "© ");
      t6 = claim_text(p_nodes, t6_value);
      t7 = claim_text(p_nodes, " Synswap Labs");
      p_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      footer_nodes.forEach(detach);
      t8 = claim_space(div2_nodes);
      if (if_block)
        if_block.l(div2_nodes);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a0, "class", "link link-hover");
      attr(a0, "target", "_blank");
      attr(a0, "rel", "noreferrer");
      attr(a0, "href", "https://t.me/bifrost_defi");
      attr(a1, "class", "link link-hover");
      attr(a1, "target", "_blank");
      attr(a1, "rel", "noreferrer");
      attr(a1, "href", "https://github.com/synswap-labs");
      attr(div0, "class", "grid grid-flow-col gap-4");
      attr(footer, "class", "footer footer-center p-5 gap-2 text-base-content rounded");
      attr(div2, "class", "w-full flex flex-col min-h-screen justify-between bg-gradient-to-t from-base-300 to-primary/[.08]");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      if (default_slot) {
        default_slot.m(div2, null);
      }
      append_hydration(div2, t0);
      append_hydration(div2, footer);
      append_hydration(footer, div0);
      append_hydration(div0, a0);
      append_hydration(a0, t1);
      append_hydration(div0, t2);
      append_hydration(div0, a1);
      append_hydration(a1, t3);
      append_hydration(footer, t4);
      append_hydration(footer, div1);
      append_hydration(div1, p);
      append_hydration(p, t5);
      append_hydration(p, t6);
      append_hydration(p, t7);
      append_hydration(div2, t8);
      if (if_block)
        if_block.m(div2, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        2)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[1],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[1]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[1],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (/*showAlert*/
      ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*showAlert*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div2, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (default_slot)
        default_slot.d(detaching);
      if (if_block)
        if_block.d();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let showAlert = true;
  const click_handler = () => {
    $$invalidate(0, showAlert = false);
  };
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(1, $$scope = $$props2.$$scope);
  };
  return [showAlert, $$scope, slots, click_handler];
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
