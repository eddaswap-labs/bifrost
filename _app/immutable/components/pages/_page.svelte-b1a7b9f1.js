import { S as SvelteComponent, i as init, s as safe_not_equal, k as element, a as space, l as claim_element, m as children, h as detach, c as claim_space, n as attr, b as insert_hydration, I as append_hydration, f as transition_in, t as transition_out, d as check_outros, o as onMount, M as component_subscribe, C as noop, q as text, r as claim_text, N as add_render_callback, O as create_in_transition, x as create_component, y as claim_component, P as src_url_equal, z as mount_component, Q as listen, R as create_out_transition, A as destroy_component, E as run_all, g as group_outros } from "../../chunks/index-9a875c02.js";
import { C as CoinSelect, A as Arrows, c as coins, s as send, f as fly, r as receive } from "../../chunks/pages.crossfade-2420eecd.js";
import { w as writable } from "../../chunks/index-dc764774.js";
function create_if_block_1(ctx) {
  let div;
  let if_block = (
    /*ready*/
    ctx[0] && create_if_block_2()
  );
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      if (if_block)
        if_block.l(div_nodes);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, "class", "hero-content text-left");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
    },
    p(ctx2, dirty) {
      if (/*ready*/
      ctx2[0]) {
        if (if_block) {
          if (dirty & /*ready*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_2();
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i(local) {
      transition_in(if_block);
    },
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
    }
  };
}
function create_if_block_2(ctx) {
  let div;
  let h1;
  let t0;
  let t1;
  let p;
  let t2;
  let div_intro;
  return {
    c() {
      div = element("div");
      h1 = element("h1");
      t0 = text("👾 Bifrost Protocol");
      t1 = space();
      p = element("p");
      t2 = text("Swap tokens between Ethereum, TON and Tezos with ease.");
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      h1 = claim_element(div_nodes, "H1", { class: true });
      var h1_nodes = children(h1);
      t0 = claim_text(h1_nodes, "👾 Bifrost Protocol");
      h1_nodes.forEach(detach);
      t1 = claim_space(div_nodes);
      p = claim_element(div_nodes, "P", { class: true });
      var p_nodes = children(p);
      t2 = claim_text(p_nodes, "Swap tokens between Ethereum, TON and Tezos with ease.");
      p_nodes.forEach(detach);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(h1, "class", "text-5xl font-bold");
      attr(p, "class", "py-8");
      attr(div, "class", "max-w-xl");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, h1);
      append_hydration(h1, t0);
      append_hydration(div, t1);
      append_hydration(div, p);
      append_hydration(p, t2);
    },
    i(local) {
      if (!div_intro) {
        add_render_callback(() => {
          div_intro = create_in_transition(div, fly, { x: -200, duration: 1500 });
          div_intro.start();
        });
      }
    },
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block(ctx) {
  let div2;
  let h4;
  let t0;
  let t1;
  let div0;
  let p0;
  let t2;
  let t3;
  let coinselect0;
  let t4;
  let button;
  let img;
  let img_src_value;
  let t5;
  let div1;
  let p1;
  let t6;
  let t7;
  let coinselect1;
  let t8;
  let a;
  let t9;
  let a_href_value;
  let div2_intro;
  let div2_outro;
  let current;
  let mounted;
  let dispose;
  coinselect0 = new CoinSelect({
    props: { selectedId: (
      /*fromCoin*/
      ctx[4]
    ) }
  });
  coinselect1 = new CoinSelect({ props: { selectedId: (
    /*toCoin*/
    ctx[5]
  ) } });
  return {
    c() {
      div2 = element("div");
      h4 = element("h4");
      t0 = text("Choose currencies");
      t1 = space();
      div0 = element("div");
      p0 = element("p");
      t2 = text("from");
      t3 = space();
      create_component(coinselect0.$$.fragment);
      t4 = space();
      button = element("button");
      img = element("img");
      t5 = space();
      div1 = element("div");
      p1 = element("p");
      t6 = text("to");
      t7 = space();
      create_component(coinselect1.$$.fragment);
      t8 = space();
      a = element("a");
      t9 = text("go swap!");
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      h4 = claim_element(div2_nodes, "H4", { class: true });
      var h4_nodes = children(h4);
      t0 = claim_text(h4_nodes, "Choose currencies");
      h4_nodes.forEach(detach);
      t1 = claim_space(div2_nodes);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      p0 = claim_element(div0_nodes, "P", {});
      var p0_nodes = children(p0);
      t2 = claim_text(p0_nodes, "from");
      p0_nodes.forEach(detach);
      t3 = claim_space(div0_nodes);
      claim_component(coinselect0.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach);
      t4 = claim_space(div2_nodes);
      button = claim_element(div2_nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      img = claim_element(button_nodes, "IMG", { src: true, width: true, alt: true });
      button_nodes.forEach(detach);
      t5 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      p1 = claim_element(div1_nodes, "P", {});
      var p1_nodes = children(p1);
      t6 = claim_text(p1_nodes, "to");
      p1_nodes.forEach(detach);
      t7 = claim_space(div1_nodes);
      claim_component(coinselect1.$$.fragment, div1_nodes);
      div1_nodes.forEach(detach);
      t8 = claim_space(div2_nodes);
      a = claim_element(div2_nodes, "A", { class: true, href: true });
      var a_nodes = children(a);
      t9 = claim_text(a_nodes, "go swap!");
      a_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(h4, "class", "mb-5");
      attr(div0, "class", "w-full");
      if (!src_url_equal(img.src, img_src_value = Arrows))
        attr(img, "src", img_src_value);
      attr(img, "width", 30);
      attr(img, "alt", "arrows");
      attr(button, "class", "mt-6 mb-1");
      attr(div1, "class", "w-full");
      attr(a, "class", "btn btn-primary btn-wide mt-7");
      attr(a, "href", a_href_value = "/swap?from=" + coins[
        /*$fromCoin*/
        ctx[3]
      ].nativeSymbol + "&to=" + coins[
        /*$toCoin*/
        ctx[2]
      ].nativeSymbol);
      attr(div2, "class", "bg-base-200 shadow-xl flex flex-col items-center py-8 mx-10 px-5 w-96 border-4 border-black");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, h4);
      append_hydration(h4, t0);
      append_hydration(div2, t1);
      append_hydration(div2, div0);
      append_hydration(div0, p0);
      append_hydration(p0, t2);
      append_hydration(div0, t3);
      mount_component(coinselect0, div0, null);
      append_hydration(div2, t4);
      append_hydration(div2, button);
      append_hydration(button, img);
      append_hydration(div2, t5);
      append_hydration(div2, div1);
      append_hydration(div1, p1);
      append_hydration(p1, t6);
      append_hydration(div1, t7);
      mount_component(coinselect1, div1, null);
      append_hydration(div2, t8);
      append_hydration(div2, a);
      append_hydration(a, t9);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button,
            "click",
            /*switchCoins*/
            ctx[7]
          ),
          listen(
            a,
            "click",
            /*hideHero*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*$fromCoin, $toCoin*/
      12 && a_href_value !== (a_href_value = "/swap?from=" + coins[
        /*$fromCoin*/
        ctx2[3]
      ].nativeSymbol + "&to=" + coins[
        /*$toCoin*/
        ctx2[2]
      ].nativeSymbol)) {
        attr(a, "href", a_href_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(coinselect0.$$.fragment, local);
      transition_in(coinselect1.$$.fragment, local);
      add_render_callback(() => {
        if (div2_outro)
          div2_outro.end(1);
        div2_intro = create_in_transition(div2, receive, { key: "swap" });
        div2_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(coinselect0.$$.fragment, local);
      transition_out(coinselect1.$$.fragment, local);
      if (div2_intro)
        div2_intro.invalidate();
      div2_outro = create_out_transition(div2, send, { key: "swap" });
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      destroy_component(coinselect0);
      destroy_component(coinselect1);
      if (detaching && div2_outro)
        div2_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment(ctx) {
  let div2;
  let div0;
  let t;
  let div1;
  let current;
  let if_block0 = (
    /*showHero*/
    ctx[1] && create_if_block_1(ctx)
  );
  let if_block1 = (
    /*ready*/
    ctx[0] && create_if_block(ctx)
  );
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      if (if_block0)
        if_block0.c();
      t = space();
      div1 = element("div");
      if (if_block1)
        if_block1.c();
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      if (if_block0)
        if_block0.l(div0_nodes);
      div0_nodes.forEach(detach);
      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      if (if_block1)
        if_block1.l(div1_nodes);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "hero md:h-full");
      attr(div1, "class", "container flex justify-center items-center");
      attr(div2, "class", "absolute w-full flex flex-col md:flex-row h-screen justify-center items-center bg-base-100");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, div0);
      if (if_block0)
        if_block0.m(div0, null);
      append_hydration(div2, t);
      append_hydration(div2, div1);
      if (if_block1)
        if_block1.m(div1, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (/*showHero*/
      ctx2[1]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*showHero*/
          2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div0, null);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (/*ready*/
      ctx2[0]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*ready*/
          1) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div1, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $toCoin;
  let $fromCoin;
  let ready = false;
  onMount(() => $$invalidate(0, ready = true));
  let fromCoin = writable(0);
  component_subscribe($$self, fromCoin, (value) => $$invalidate(3, $fromCoin = value));
  let toCoin = writable(1);
  component_subscribe($$self, toCoin, (value) => $$invalidate(2, $toCoin = value));
  let showHero = true;
  const hideHero = () => $$invalidate(1, showHero = false);
  const switchCoins = () => {
    const from = $fromCoin;
    fromCoin.set($toCoin);
    toCoin.set(from);
  };
  return [ready, showHero, $toCoin, $fromCoin, fromCoin, toCoin, hideHero, switchCoins];
}
class Page extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  Page as default
};
