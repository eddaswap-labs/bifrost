import { S as SvelteComponent, i as init, s as safe_not_equal, k as element, a as space, q as text, V as svg_element, l as claim_element, m as children, c as claim_space, r as claim_text, h as detach, W as claim_svg_element, U as src_url_equal, n as attr, b as insert_hydration, I as append_hydration, u as set_data, C as noop, X as destroy_each, e as empty, D as subscribe, M as listen } from "./index-64643071.js";
import { w as writable } from "./paths-9d4e3692.js";
import { c as crossfade, q as quintOut } from "./index-872a1312.js";
const Arrows = "" + new URL("../assets/arrows-ebfb004d.svg", import.meta.url).href;
const ETHLogo = "" + new URL("../assets/eth_logo-7d70db0d.png", import.meta.url).href;
const TZSLogo = "" + new URL("../assets/tzs_logo-7098441a.svg", import.meta.url).href;
const TONLogo = "" + new URL("../assets/ton_logo-db693a23.svg", import.meta.url).href;
let coins = [
  {
    nativeSymbol: "ETH",
    wrappedSymbol: "bETH",
    logo: ETHLogo,
    logoSize: 20
  },
  {
    nativeSymbol: "TZS",
    wrappedSymbol: "bTZS",
    logo: TZSLogo,
    logoSize: 20
  },
  {
    nativeSymbol: "TON",
    wrappedSymbol: "bTON",
    logo: TONLogo,
    logoSize: 25
  }
];
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[4] = list[i];
  child_ctx[6] = i;
  return child_ctx;
}
function create_if_block(ctx) {
  let li;
  let button;
  let img;
  let img_src_value;
  let t0;
  let t1_value = (
    /*coin*/
    ctx[4].nativeSymbol + ""
  );
  let t1;
  let t2;
  let mounted;
  let dispose;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[3](
        /*id*/
        ctx[6]
      )
    );
  }
  return {
    c() {
      li = element("li");
      button = element("button");
      img = element("img");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      this.h();
    },
    l(nodes) {
      li = claim_element(nodes, "LI", {});
      var li_nodes = children(li);
      button = claim_element(li_nodes, "BUTTON", {});
      var button_nodes = children(button);
      img = claim_element(button_nodes, "IMG", {
        class: true,
        src: true,
        alt: true,
        width: true
      });
      t0 = claim_space(button_nodes);
      t1 = claim_text(button_nodes, t1_value);
      button_nodes.forEach(detach);
      t2 = claim_space(li_nodes);
      li_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(img, "class", "mr-2");
      if (!src_url_equal(img.src, img_src_value = /*coin*/
      ctx[4].logo))
        attr(img, "src", img_src_value);
      attr(img, "alt", "logo");
      attr(
        img,
        "width",
        /*coin*/
        ctx[4].logoSize
      );
    },
    m(target, anchor) {
      insert_hydration(target, li, anchor);
      append_hydration(li, button);
      append_hydration(button, img);
      append_hydration(button, t0);
      append_hydration(button, t1);
      append_hydration(li, t2);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(li);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block(ctx) {
  let if_block_anchor;
  let if_block = (
    /*id*/
    ctx[6] !== /*$selectedId*/
    ctx[1] && create_if_block(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    l(nodes) {
      if (if_block)
        if_block.l(nodes);
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_hydration(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (/*id*/
      ctx2[6] !== /*$selectedId*/
      ctx2[1]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_fragment(ctx) {
  let div1;
  let label;
  let div0;
  let img;
  let img_src_value;
  let img_width_value;
  let t0;
  let t1_value = coins[
    /*$selectedId*/
    ctx[1]
  ].nativeSymbol + "";
  let t1;
  let t2;
  let svg;
  let path;
  let t3;
  let ul;
  let each_value = coins;
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      div1 = element("div");
      label = element("label");
      div0 = element("div");
      img = element("img");
      t0 = space();
      t1 = text(t1_value);
      t2 = space();
      svg = svg_element("svg");
      path = svg_element("path");
      t3 = space();
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div1 = claim_element(nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      label = claim_element(div1_nodes, "LABEL", { tabindex: true, class: true });
      var label_nodes = children(label);
      div0 = claim_element(label_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      img = claim_element(div0_nodes, "IMG", { src: true, alt: true, width: true });
      t0 = claim_space(div0_nodes);
      t1 = claim_text(div0_nodes, t1_value);
      div0_nodes.forEach(detach);
      t2 = claim_space(label_nodes);
      svg = claim_svg_element(label_nodes, "svg", {
        "aria-hidden": true,
        class: true,
        viewBox: true,
        xmlns: true
      });
      var svg_nodes = children(svg);
      path = claim_svg_element(svg_nodes, "path", {
        "fill-rule": true,
        d: true,
        "clip-rule": true
      });
      children(path).forEach(detach);
      svg_nodes.forEach(detach);
      label_nodes.forEach(detach);
      t3 = claim_space(div1_nodes);
      ul = claim_element(div1_nodes, "UL", { tabindex: true, class: true });
      var ul_nodes = children(ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(ul_nodes);
      }
      ul_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      this.h();
    },
    h() {
      if (!src_url_equal(img.src, img_src_value = coins[
        /*$selectedId*/
        ctx[1]
      ].logo))
        attr(img, "src", img_src_value);
      attr(img, "alt", "");
      attr(img, "width", img_width_value = coins[
        /*$selectedId*/
        ctx[1]
      ].logoSize);
      attr(div0, "class", "flex flex-row gap-3 items-center");
      attr(path, "fill-rule", "evenodd");
      attr(path, "d", "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z");
      attr(path, "clip-rule", "evenodd");
      attr(svg, "aria-hidden", "true");
      attr(svg, "class", "w-4 h-4");
      attr(svg, "viewBox", "0 0 20 20");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(label, "tabindex", "0");
      attr(label, "class", "btn flex-shrink-0 z-10 inline-flex items-center justify-between border border-black text-sm font-medium text-center text-gray-500 bg-base-100 w-full h-12");
      attr(ul, "tabindex", "0");
      attr(ul, "class", "dropdown-content menu p-2 shadow bg-base-100 w-full border border-black");
      attr(div1, "class", "dropdown w-full");
    },
    m(target, anchor) {
      insert_hydration(target, div1, anchor);
      append_hydration(div1, label);
      append_hydration(label, div0);
      append_hydration(div0, img);
      append_hydration(div0, t0);
      append_hydration(div0, t1);
      append_hydration(label, t2);
      append_hydration(label, svg);
      append_hydration(svg, path);
      append_hydration(div1, t3);
      append_hydration(div1, ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(ul, null);
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*$selectedId*/
      2 && !src_url_equal(img.src, img_src_value = coins[
        /*$selectedId*/
        ctx2[1]
      ].logo)) {
        attr(img, "src", img_src_value);
      }
      if (dirty & /*$selectedId*/
      2 && img_width_value !== (img_width_value = coins[
        /*$selectedId*/
        ctx2[1]
      ].logoSize)) {
        attr(img, "width", img_width_value);
      }
      if (dirty & /*$selectedId*/
      2 && t1_value !== (t1_value = coins[
        /*$selectedId*/
        ctx2[1]
      ].nativeSymbol + ""))
        set_data(t1, t1_value);
      if (dirty & /*selectCoin, coins, $selectedId*/
      6) {
        each_value = coins;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $selectedId, $$unsubscribe_selectedId = noop, $$subscribe_selectedId = () => ($$unsubscribe_selectedId(), $$unsubscribe_selectedId = subscribe(selectedId, ($$value) => $$invalidate(1, $selectedId = $$value)), selectedId);
  $$self.$$.on_destroy.push(() => $$unsubscribe_selectedId());
  let { selectedId = writable(0) } = $$props;
  $$subscribe_selectedId();
  const selectCoin = (id) => {
    selectedId.set(id);
  };
  const click_handler = (id) => {
    selectCoin(id);
  };
  $$self.$$set = ($$props2) => {
    if ("selectedId" in $$props2)
      $$subscribe_selectedId($$invalidate(0, selectedId = $$props2.selectedId));
  };
  return [selectedId, $selectedId, selectCoin, click_handler];
}
class CoinSelect extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { selectedId: 0 });
  }
}
const [send, receive] = crossfade({
  duration: (d) => Math.sqrt(d * 300),
  fallback(node, params) {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;
    return {
      duration: 600,
      easing: quintOut,
      css: (t) => `
                transform: ${transform} scale(${t});
            `
    };
  }
});
export {
  Arrows as A,
  CoinSelect as C,
  coins as c,
  receive as r,
  send as s
};
