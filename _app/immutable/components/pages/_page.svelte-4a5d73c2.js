import { S as SvelteComponent, i as init, s as safe_not_equal, k as element, Q as svg_element, a as space, q as text, x as create_component, l as claim_element, m as children, R as claim_svg_element, h as detach, c as claim_space, r as claim_text, y as claim_component, n as attr, T as src_url_equal, b as insert_hydration, I as append_hydration, z as mount_component, M as listen, f as transition_in, t as transition_out, A as destroy_component, E as run_all, o as onMount, P as component_subscribe, C as noop, U as add_render_callback, V as create_in_transition } from "../../chunks/index-994bc733.js";
import { f as fly } from "../../chunks/index-ae640bd0.js";
import { b as base, w as writable } from "../../chunks/paths-4a482775.js";
import { C as CoinSelect, c as coins, B as BifrostLogo, A as Arrows } from "../../chunks/bifrost_logo-8ec52051.js";
const CubeVideo = "" + new URL("../../assets/cloner-cube-fc6c749e.gif", import.meta.url).href;
const _page_svelte_svelte_type_style_lang = "";
function create_if_block(ctx) {
  let div;
  let if_block = (
    /*ready*/
    ctx[0] && create_if_block_1()
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
          if_block.p(ctx2, dirty);
          if (dirty & /*ready*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1();
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
function create_if_block_1(ctx) {
  let div1;
  let div0;
  let img;
  let img_src_value;
  let t0;
  let h1;
  let t1;
  let t2;
  let h3;
  let t3;
  let div1_intro;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      img = element("img");
      t0 = space();
      h1 = element("h1");
      t1 = text("Eddaswap Protocol");
      t2 = space();
      h3 = element("h3");
      t3 = text("Swap assets between Ethereum, TON and Tezos with ease.");
      this.h();
    },
    l(nodes) {
      div1 = claim_element(nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      img = claim_element(div0_nodes, "IMG", { src: true, width: true, alt: true });
      t0 = claim_space(div0_nodes);
      h1 = claim_element(div0_nodes, "H1", { class: true });
      var h1_nodes = children(h1);
      t1 = claim_text(h1_nodes, "Eddaswap Protocol");
      h1_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      t2 = claim_space(div1_nodes);
      h3 = claim_element(div1_nodes, "H3", { class: true });
      var h3_nodes = children(h3);
      t3 = claim_text(h3_nodes, "Swap assets between Ethereum, TON and Tezos with ease.");
      h3_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      this.h();
    },
    h() {
      if (!src_url_equal(img.src, img_src_value = BifrostLogo))
        attr(img, "src", img_src_value);
      attr(img, "width", 60);
      attr(img, "alt", "logo");
      attr(h1, "class", "text-4xl lowercase w-full svelte-1cbot3g");
      attr(div0, "class", "flex flex-row gap-5 items-center w-full");
      attr(h3, "class", "text-xl py-8 lowercase svelte-1cbot3g");
      attr(div1, "class", "max-w-xl");
    },
    m(target, anchor) {
      insert_hydration(target, div1, anchor);
      append_hydration(div1, div0);
      append_hydration(div0, img);
      append_hydration(div0, t0);
      append_hydration(div0, h1);
      append_hydration(h1, t1);
      append_hydration(div1, t2);
      append_hydration(div1, h3);
      append_hydration(h3, t3);
    },
    p: noop,
    i(local) {
      if (!div1_intro) {
        add_render_callback(() => {
          div1_intro = create_in_transition(div1, fly, { x: -200, duration: 1500 });
          div1_intro.start();
        });
      }
    },
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div1);
    }
  };
}
function create_fragment(ctx) {
  let div4;
  let div1;
  let div0;
  let label;
  let svg;
  let path;
  let t0;
  let ul0;
  let li0;
  let a0;
  let t1;
  let t2;
  let li1;
  let a1;
  let t3;
  let t4;
  let li2;
  let a2;
  let t5;
  let t6;
  let div2;
  let ul1;
  let li3;
  let a3;
  let t7;
  let t8;
  let li4;
  let a4;
  let t9;
  let t10;
  let li5;
  let a5;
  let t11;
  let t12;
  let div3;
  let a6;
  let t13;
  let t14;
  let div7;
  let div5;
  let t15;
  let div6;
  let img0;
  let img0_src_value;
  let t16;
  let div13;
  let div11;
  let div10;
  let h40;
  let t17;
  let t18;
  let div8;
  let h41;
  let t19;
  let t20;
  let coinselect0;
  let t21;
  let button;
  let img1;
  let img1_src_value;
  let t22;
  let div9;
  let h42;
  let t23;
  let t24;
  let coinselect1;
  let t25;
  let a7;
  let t26;
  let a7_href_value;
  let t27;
  let div12;
  let h1;
  let t28;
  let t29;
  let p0;
  let t30;
  let t31;
  let p1;
  let t32;
  let current;
  let mounted;
  let dispose;
  let if_block = (
    /*showHero*/
    ctx[1] && create_if_block(ctx)
  );
  coinselect0 = new CoinSelect({
    props: {
      selectedId: (
        /*fromCoin*/
        ctx[4]
      ),
      excludedId: (
        /*toCoin*/
        ctx[5]
      )
    }
  });
  coinselect1 = new CoinSelect({
    props: {
      selectedId: (
        /*toCoin*/
        ctx[5]
      ),
      excludedId: (
        /*fromCoin*/
        ctx[4]
      )
    }
  });
  return {
    c() {
      div4 = element("div");
      div1 = element("div");
      div0 = element("div");
      label = element("label");
      svg = svg_element("svg");
      path = svg_element("path");
      t0 = space();
      ul0 = element("ul");
      li0 = element("li");
      a0 = element("a");
      t1 = text("docs");
      t2 = space();
      li1 = element("li");
      a1 = element("a");
      t3 = text("community");
      t4 = space();
      li2 = element("li");
      a2 = element("a");
      t5 = text("GitHub");
      t6 = space();
      div2 = element("div");
      ul1 = element("ul");
      li3 = element("li");
      a3 = element("a");
      t7 = text("docs");
      t8 = space();
      li4 = element("li");
      a4 = element("a");
      t9 = text("community");
      t10 = space();
      li5 = element("li");
      a5 = element("a");
      t11 = text("Github");
      t12 = space();
      div3 = element("div");
      a6 = element("a");
      t13 = text("launch app");
      t14 = space();
      div7 = element("div");
      div5 = element("div");
      if (if_block)
        if_block.c();
      t15 = space();
      div6 = element("div");
      img0 = element("img");
      t16 = space();
      div13 = element("div");
      div11 = element("div");
      div10 = element("div");
      h40 = element("h4");
      t17 = text("Choose networks");
      t18 = space();
      div8 = element("div");
      h41 = element("h4");
      t19 = text("from");
      t20 = space();
      create_component(coinselect0.$$.fragment);
      t21 = space();
      button = element("button");
      img1 = element("img");
      t22 = space();
      div9 = element("div");
      h42 = element("h4");
      t23 = text("to");
      t24 = space();
      create_component(coinselect1.$$.fragment);
      t25 = space();
      a7 = element("a");
      t26 = text("go swap!");
      t27 = space();
      div12 = element("div");
      h1 = element("h1");
      t28 = text("cross-chain bridge");
      t29 = space();
      p0 = element("p");
      t30 = text('We lock your coins and mint synthetic version of them on the destination blockchain. You can\n			trade and transfer "wrapped" tokens and they can still be exchanged back through the bridge.');
      t31 = space();
      p1 = element("p");
      t32 = text("Thus, all synthetic assets are pegged at 1-to-1 with an original and backed 100% by our\n			smart-contracts reserves.");
      this.h();
    },
    l(nodes) {
      div4 = claim_element(nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      div1 = claim_element(div4_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      label = claim_element(div0_nodes, "LABEL", { tabindex: true, class: true });
      var label_nodes = children(label);
      svg = claim_svg_element(label_nodes, "svg", {
        xmlns: true,
        class: true,
        fill: true,
        viewBox: true,
        stroke: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        "stroke-linecap": true,
        "stroke-linejoin": true,
        "stroke-width": true,
        d: true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      label_nodes.forEach(detach);
      t0 = claim_space(div0_nodes);
      ul0 = claim_element(div0_nodes, "UL", { tabindex: true, class: true });
      var ul0_nodes = children(ul0);
      li0 = claim_element(ul0_nodes, "LI", {});
      var li0_nodes = children(li0);
      a0 = claim_element(li0_nodes, "A", { class: true });
      var a0_nodes = children(a0);
      t1 = claim_text(a0_nodes, "docs");
      a0_nodes.forEach(detach);
      li0_nodes.forEach(detach);
      t2 = claim_space(ul0_nodes);
      li1 = claim_element(ul0_nodes, "LI", {});
      var li1_nodes = children(li1);
      a1 = claim_element(li1_nodes, "A", {
        target: true,
        rel: true,
        href: true,
        class: true
      });
      var a1_nodes = children(a1);
      t3 = claim_text(a1_nodes, "community");
      a1_nodes.forEach(detach);
      li1_nodes.forEach(detach);
      t4 = claim_space(ul0_nodes);
      li2 = claim_element(ul0_nodes, "LI", {});
      var li2_nodes = children(li2);
      a2 = claim_element(li2_nodes, "A", {
        target: true,
        rel: true,
        href: true,
        class: true
      });
      var a2_nodes = children(a2);
      t5 = claim_text(a2_nodes, "GitHub");
      a2_nodes.forEach(detach);
      li2_nodes.forEach(detach);
      ul0_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      t6 = claim_space(div4_nodes);
      div2 = claim_element(div4_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      ul1 = claim_element(div2_nodes, "UL", { class: true });
      var ul1_nodes = children(ul1);
      li3 = claim_element(ul1_nodes, "LI", { class: true });
      var li3_nodes = children(li3);
      a3 = claim_element(li3_nodes, "A", { class: true });
      var a3_nodes = children(a3);
      t7 = claim_text(a3_nodes, "docs");
      a3_nodes.forEach(detach);
      li3_nodes.forEach(detach);
      t8 = claim_space(ul1_nodes);
      li4 = claim_element(ul1_nodes, "LI", {});
      var li4_nodes = children(li4);
      a4 = claim_element(li4_nodes, "A", {
        target: true,
        rel: true,
        href: true,
        class: true
      });
      var a4_nodes = children(a4);
      t9 = claim_text(a4_nodes, "community");
      a4_nodes.forEach(detach);
      li4_nodes.forEach(detach);
      t10 = claim_space(ul1_nodes);
      li5 = claim_element(ul1_nodes, "LI", {});
      var li5_nodes = children(li5);
      a5 = claim_element(li5_nodes, "A", {
        target: true,
        rel: true,
        href: true,
        class: true
      });
      var a5_nodes = children(a5);
      t11 = claim_text(a5_nodes, "Github");
      a5_nodes.forEach(detach);
      li5_nodes.forEach(detach);
      ul1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      t12 = claim_space(div4_nodes);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      a6 = claim_element(div3_nodes, "A", { class: true, href: true });
      var a6_nodes = children(a6);
      t13 = claim_text(a6_nodes, "launch app");
      a6_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      t14 = claim_space(nodes);
      div7 = claim_element(nodes, "DIV", { class: true });
      var div7_nodes = children(div7);
      div5 = claim_element(div7_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      if (if_block)
        if_block.l(div5_nodes);
      div5_nodes.forEach(detach);
      t15 = claim_space(div7_nodes);
      div6 = claim_element(div7_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      img0 = claim_element(div6_nodes, "IMG", { class: true, src: true, alt: true });
      div6_nodes.forEach(detach);
      div7_nodes.forEach(detach);
      t16 = claim_space(nodes);
      div13 = claim_element(nodes, "DIV", { class: true });
      var div13_nodes = children(div13);
      div11 = claim_element(div13_nodes, "DIV", { class: true });
      var div11_nodes = children(div11);
      div10 = claim_element(div11_nodes, "DIV", { class: true });
      var div10_nodes = children(div10);
      h40 = claim_element(div10_nodes, "H4", { class: true });
      var h40_nodes = children(h40);
      t17 = claim_text(h40_nodes, "Choose networks");
      h40_nodes.forEach(detach);
      t18 = claim_space(div10_nodes);
      div8 = claim_element(div10_nodes, "DIV", { class: true });
      var div8_nodes = children(div8);
      h41 = claim_element(div8_nodes, "H4", { class: true });
      var h41_nodes = children(h41);
      t19 = claim_text(h41_nodes, "from");
      h41_nodes.forEach(detach);
      t20 = claim_space(div8_nodes);
      claim_component(coinselect0.$$.fragment, div8_nodes);
      div8_nodes.forEach(detach);
      t21 = claim_space(div10_nodes);
      button = claim_element(div10_nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      img1 = claim_element(button_nodes, "IMG", { src: true, width: true, alt: true });
      button_nodes.forEach(detach);
      t22 = claim_space(div10_nodes);
      div9 = claim_element(div10_nodes, "DIV", { class: true });
      var div9_nodes = children(div9);
      h42 = claim_element(div9_nodes, "H4", { class: true });
      var h42_nodes = children(h42);
      t23 = claim_text(h42_nodes, "to");
      h42_nodes.forEach(detach);
      t24 = claim_space(div9_nodes);
      claim_component(coinselect1.$$.fragment, div9_nodes);
      div9_nodes.forEach(detach);
      t25 = claim_space(div10_nodes);
      a7 = claim_element(div10_nodes, "A", { class: true, href: true });
      var a7_nodes = children(a7);
      t26 = claim_text(a7_nodes, "go swap!");
      a7_nodes.forEach(detach);
      div10_nodes.forEach(detach);
      div11_nodes.forEach(detach);
      t27 = claim_space(div13_nodes);
      div12 = claim_element(div13_nodes, "DIV", { class: true });
      var div12_nodes = children(div12);
      h1 = claim_element(div12_nodes, "H1", { class: true });
      var h1_nodes = children(h1);
      t28 = claim_text(h1_nodes, "cross-chain bridge");
      h1_nodes.forEach(detach);
      t29 = claim_space(div12_nodes);
      p0 = claim_element(div12_nodes, "P", { class: true });
      var p0_nodes = children(p0);
      t30 = claim_text(p0_nodes, 'We lock your coins and mint synthetic version of them on the destination blockchain. You can\n			trade and transfer "wrapped" tokens and they can still be exchanged back through the bridge.');
      p0_nodes.forEach(detach);
      t31 = claim_space(div12_nodes);
      p1 = claim_element(div12_nodes, "P", { class: true });
      var p1_nodes = children(p1);
      t32 = claim_text(p1_nodes, "Thus, all synthetic assets are pegged at 1-to-1 with an original and backed 100% by our\n			smart-contracts reserves.");
      p1_nodes.forEach(detach);
      div12_nodes.forEach(detach);
      div13_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(path, "stroke-linecap", "round");
      attr(path, "stroke-linejoin", "round");
      attr(path, "stroke-width", "2");
      attr(path, "d", "M4 6h16M4 12h8m-8 6h16");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "h-5 w-5");
      attr(svg, "fill", "none");
      attr(svg, "viewBox", "0 0 24 24");
      attr(svg, "stroke", "currentColor");
      attr(label, "tabindex", "0");
      attr(label, "class", "btn btn-ghost lg:hidden");
      attr(a0, "class", "svelte-1cbot3g");
      attr(a1, "target", "_blank");
      attr(a1, "rel", "noreferrer");
      attr(a1, "href", "https://t.me/bifrost_defi");
      attr(a1, "class", "svelte-1cbot3g");
      attr(a2, "target", "_blank");
      attr(a2, "rel", "noreferrer");
      attr(a2, "href", "https://github.com/eddaswap-labs");
      attr(a2, "class", "svelte-1cbot3g");
      attr(ul0, "tabindex", "0");
      attr(ul0, "class", "menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52");
      attr(div0, "class", "dropdown");
      attr(div1, "class", "navbar-start");
      attr(a3, "class", "svelte-1cbot3g");
      attr(li3, "class", "hover:text-white bg-none");
      attr(a4, "target", "_blank");
      attr(a4, "rel", "noreferrer");
      attr(a4, "href", "https://t.me/bifrost_defi");
      attr(a4, "class", "svelte-1cbot3g");
      attr(a5, "target", "_blank");
      attr(a5, "rel", "noreferrer");
      attr(a5, "href", "https://github.com/eddaswap-labs");
      attr(a5, "class", "svelte-1cbot3g");
      attr(ul1, "class", "menu menu-horizontal px-1 gap-2");
      attr(div2, "class", "navbar-center hidden lg:flex");
      attr(a6, "class", "btn btn-primary lowercase svelte-1cbot3g");
      attr(a6, "href", base + "/bridge");
      attr(div3, "class", "navbar-end");
      attr(div4, "class", "navbar bg-transparent px-5 py-2");
      attr(div5, "class", "hero md:h-full");
      attr(img0, "class", "w-3/4 max-w-lg");
      if (!src_url_equal(img0.src, img0_src_value = CubeVideo))
        attr(img0, "src", img0_src_value);
      attr(img0, "alt", "cube");
      attr(div6, "class", "container flex justify-center items-center");
      attr(div7, "class", "w-full flex flex-col md:flex-row h-screen justify-center items-center");
      attr(h40, "class", "text-xl mb-5 lowercase svelte-1cbot3g");
      attr(h41, "class", "svelte-1cbot3g");
      attr(div8, "class", "w-full");
      if (!src_url_equal(img1.src, img1_src_value = Arrows))
        attr(img1, "src", img1_src_value);
      attr(img1, "width", 30);
      attr(img1, "alt", "arrows");
      attr(button, "class", "mt-6 mb-1");
      attr(h42, "class", "svelte-1cbot3g");
      attr(div9, "class", "w-full");
      attr(a7, "class", "btn btn-primary w-full mt-7 lowercase svelte-1cbot3g");
      attr(a7, "href", a7_href_value = base + "/bridge?from=" + coins[
        /*$fromCoin*/
        ctx[3]
      ].nativeSymbol + "&to=" + coins[
        /*$toCoin*/
        ctx[2]
      ].nativeSymbol);
      attr(div10, "class", "card bg-base-200 flex flex-col items-center mx-10 p-3 w-96 border border-neutral");
      attr(div11, "class", "flex justify-center w-full md:w-1/2");
      attr(h1, "class", "text-4xl  svelte-1cbot3g");
      attr(p0, "class", "text-xl font-light text-gray-400 mt-5");
      attr(p1, "class", "text-xl font-light text-gray-400 mt-5");
      attr(div12, "class", "w-full md:w-1/2 p-10");
      attr(div13, "class", "flex flex-col-reverse md:flex-row items-center gap-5 md:p-12 md:h-96 mb-12");
    },
    m(target, anchor) {
      insert_hydration(target, div4, anchor);
      append_hydration(div4, div1);
      append_hydration(div1, div0);
      append_hydration(div0, label);
      append_hydration(label, svg);
      append_hydration(svg, path);
      append_hydration(div0, t0);
      append_hydration(div0, ul0);
      append_hydration(ul0, li0);
      append_hydration(li0, a0);
      append_hydration(a0, t1);
      append_hydration(ul0, t2);
      append_hydration(ul0, li1);
      append_hydration(li1, a1);
      append_hydration(a1, t3);
      append_hydration(ul0, t4);
      append_hydration(ul0, li2);
      append_hydration(li2, a2);
      append_hydration(a2, t5);
      append_hydration(div4, t6);
      append_hydration(div4, div2);
      append_hydration(div2, ul1);
      append_hydration(ul1, li3);
      append_hydration(li3, a3);
      append_hydration(a3, t7);
      append_hydration(ul1, t8);
      append_hydration(ul1, li4);
      append_hydration(li4, a4);
      append_hydration(a4, t9);
      append_hydration(ul1, t10);
      append_hydration(ul1, li5);
      append_hydration(li5, a5);
      append_hydration(a5, t11);
      append_hydration(div4, t12);
      append_hydration(div4, div3);
      append_hydration(div3, a6);
      append_hydration(a6, t13);
      insert_hydration(target, t14, anchor);
      insert_hydration(target, div7, anchor);
      append_hydration(div7, div5);
      if (if_block)
        if_block.m(div5, null);
      append_hydration(div7, t15);
      append_hydration(div7, div6);
      append_hydration(div6, img0);
      insert_hydration(target, t16, anchor);
      insert_hydration(target, div13, anchor);
      append_hydration(div13, div11);
      append_hydration(div11, div10);
      append_hydration(div10, h40);
      append_hydration(h40, t17);
      append_hydration(div10, t18);
      append_hydration(div10, div8);
      append_hydration(div8, h41);
      append_hydration(h41, t19);
      append_hydration(div8, t20);
      mount_component(coinselect0, div8, null);
      append_hydration(div10, t21);
      append_hydration(div10, button);
      append_hydration(button, img1);
      append_hydration(div10, t22);
      append_hydration(div10, div9);
      append_hydration(div9, h42);
      append_hydration(h42, t23);
      append_hydration(div9, t24);
      mount_component(coinselect1, div9, null);
      append_hydration(div10, t25);
      append_hydration(div10, a7);
      append_hydration(a7, t26);
      append_hydration(div13, t27);
      append_hydration(div13, div12);
      append_hydration(div12, h1);
      append_hydration(h1, t28);
      append_hydration(div12, t29);
      append_hydration(div12, p0);
      append_hydration(p0, t30);
      append_hydration(div12, t31);
      append_hydration(div12, p1);
      append_hydration(p1, t32);
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
            a7,
            "click",
            /*hideHero*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (/*showHero*/
      ctx2[1]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*showHero*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div5, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (!current || dirty & /*$fromCoin, $toCoin*/
      12 && a7_href_value !== (a7_href_value = base + "/bridge?from=" + coins[
        /*$fromCoin*/
        ctx2[3]
      ].nativeSymbol + "&to=" + coins[
        /*$toCoin*/
        ctx2[2]
      ].nativeSymbol)) {
        attr(a7, "href", a7_href_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      transition_in(coinselect0.$$.fragment, local);
      transition_in(coinselect1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(coinselect0.$$.fragment, local);
      transition_out(coinselect1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div4);
      if (detaching)
        detach(t14);
      if (detaching)
        detach(div7);
      if (if_block)
        if_block.d();
      if (detaching)
        detach(t16);
      if (detaching)
        detach(div13);
      destroy_component(coinselect0);
      destroy_component(coinselect1);
      mounted = false;
      run_all(dispose);
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
