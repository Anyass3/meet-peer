import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, e as element, a as space, c as claim_element, b as children, g as detach_dev, h as claim_space, j as attr_dev, k as add_location, q as set_style, l as insert_dev, m as append_dev, n as noop, y as onDestroy, t as text, o as create_component, z as query_selector_all, f as claim_text, p as claim_component, r as mount_component, u as transition_in, w as transition_out, x as destroy_component } from './client.ed8e7645.js';

/* src/components/speakIndicator.svelte generated by Svelte v3.31.0 */

const file = "src/components/speakIndicator.svelte";

function create_fragment(ctx) {
	let div3;
	let div0;
	let div0_style_value;
	let t0;
	let div1;
	let div1_class_value;
	let div1_style_value;
	let t1;
	let div2;
	let div2_style_value;

	const block = {
		c: function create() {
			div3 = element("div");
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			t1 = space();
			div2 = element("div");
			this.h();
		},
		l: function claim(nodes) {
			div3 = claim_element(nodes, "DIV", { class: true, style: true });
			var div3_nodes = children(div3);
			div0 = claim_element(div3_nodes, "DIV", { class: true, style: true });
			children(div0).forEach(detach_dev);
			t0 = claim_space(div3_nodes);
			div1 = claim_element(div3_nodes, "DIV", { class: true, style: true });
			children(div1).forEach(detach_dev);
			t1 = claim_space(div3_nodes);
			div2 = claim_element(div3_nodes, "DIV", { class: true, style: true });
			children(div2).forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div0, "class", cls);
			attr_dev(div0, "style", div0_style_value = /*style*/ ctx[2](/*side*/ ctx[1]));
			add_location(div0, file, 7, 4, 251);
			attr_dev(div1, "class", div1_class_value = "" + (cls + " mx-1"));
			attr_dev(div1, "style", div1_style_value = /*style*/ ctx[2](/*middle*/ ctx[0]));
			add_location(div1, file, 8, 4, 295);
			attr_dev(div2, "class", cls);
			attr_dev(div2, "style", div2_style_value = /*style*/ ctx[2](/*side*/ ctx[1]));
			add_location(div2, file, 9, 4, 348);
			attr_dev(div3, "class", "m-0 p-0 d-flex ai-end item");
			set_style(div3, "height", "12.5px");
			add_location(div3, file, 6, 0, 184);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div0);
			append_dev(div3, t0);
			append_dev(div3, div1);
			append_dev(div3, t1);
			append_dev(div3, div2);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*side*/ 2 && div0_style_value !== (div0_style_value = /*style*/ ctx[2](/*side*/ ctx[1]))) {
				attr_dev(div0, "style", div0_style_value);
			}

			if (dirty & /*middle*/ 1 && div1_style_value !== (div1_style_value = /*style*/ ctx[2](/*middle*/ ctx[0]))) {
				attr_dev(div1, "style", div1_style_value);
			}

			if (dirty & /*side*/ 2 && div2_style_value !== (div2_style_value = /*style*/ ctx[2](/*side*/ ctx[1]))) {
				attr_dev(div2, "style", div2_style_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const cls = "as-end bg-success rounded";

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("SpeakIndicator", slots, []);
	let { middle = 0 } = $$props;
	let { side = 0 } = $$props;
	const style = i => `width:6px;height:${i}px;transition:width ease`;
	const writable_props = ["middle", "side"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SpeakIndicator> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("middle" in $$props) $$invalidate(0, middle = $$props.middle);
		if ("side" in $$props) $$invalidate(1, side = $$props.side);
	};

	$$self.$capture_state = () => ({ middle, side, cls, style });

	$$self.$inject_state = $$props => {
		if ("middle" in $$props) $$invalidate(0, middle = $$props.middle);
		if ("side" in $$props) $$invalidate(1, side = $$props.side);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [middle, side, style];
}

class SpeakIndicator extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { middle: 0, side: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SpeakIndicator",
			options,
			id: create_fragment.name
		});
	}

	get middle() {
		throw new Error("<SpeakIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set middle(value) {
		throw new Error("<SpeakIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get side() {
		throw new Error("<SpeakIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set side(value) {
		throw new Error("<SpeakIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/about.svelte generated by Svelte v3.31.0 */
const file$1 = "src/routes/about.svelte";

function create_fragment$1(ctx) {
	let t0;
	let h1;
	let t1;
	let t2;
	let p;
	let t3;
	let t4;
	let indicator;
	let current;

	indicator = new SpeakIndicator({
			props: {
				middle: /*middle*/ ctx[0],
				side: /*side*/ ctx[1]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			t0 = space();
			h1 = element("h1");
			t1 = text("About this site");
			t2 = space();
			p = element("p");
			t3 = text("This is the 'about' page. There's not much here.");
			t4 = space();
			create_component(indicator.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-1ine71f\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			h1 = claim_element(nodes, "H1", {});
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "About this site");
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			p = claim_element(nodes, "P", {});
			var p_nodes = children(p);
			t3 = claim_text(p_nodes, "This is the 'about' page. There's not much here.");
			p_nodes.forEach(detach_dev);
			t4 = claim_space(nodes);
			claim_component(indicator.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			document.title = "About";
			add_location(h1, file$1, 15, 0, 373);
			add_location(p, file$1, 17, 0, 399);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, h1, anchor);
			append_dev(h1, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, p, anchor);
			append_dev(p, t3);
			insert_dev(target, t4, anchor);
			mount_component(indicator, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const indicator_changes = {};
			if (dirty & /*middle*/ 1) indicator_changes.middle = /*middle*/ ctx[0];
			if (dirty & /*side*/ 2) indicator_changes.side = /*side*/ ctx[1];
			indicator.$set(indicator_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(indicator.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(indicator.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(p);
			if (detaching) detach_dev(t4);
			destroy_component(indicator, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("About", slots, []);
	let middle = 0, side = 0;

	const int = setInterval(
		() => {
			const r = () => Math.random();
			$$invalidate(0, middle = r() * 12 + 0.5);
			$$invalidate(1, side = r() * 8 + 0.5);
		},
		1000
	);

	onDestroy(() => clearInterval(int));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ Indicator: SpeakIndicator, onDestroy, middle, side, int });

	$$self.$inject_state = $$props => {
		if ("middle" in $$props) $$invalidate(0, middle = $$props.middle);
		if ("side" in $$props) $$invalidate(1, side = $$props.side);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [middle, side];
}

class About extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "About",
			options,
			id: create_fragment$1.name
		});
	}
}

export default About;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJvdXQuOWYxZjhlNjYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NwZWFrSW5kaWNhdG9yLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvYWJvdXQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gICAgZXhwb3J0IGxldCBtaWRkbGUgPSAwO1xuICAgIGV4cG9ydCBsZXQgc2lkZSA9IDA7XG4gICAgY29uc3QgY2xzID0gXCJhcy1lbmQgYmctc3VjY2VzcyByb3VuZGVkXCI7XG4gICAgY29uc3Qgc3R5bGUgPSAoaSkgPT4gYHdpZHRoOjZweDtoZWlnaHQ6JHtpfXB4O3RyYW5zaXRpb246d2lkdGggZWFzZWA7XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cIm0tMCBwLTAgZC1mbGV4IGFpLWVuZCBpdGVtXCIgc3R5bGU9XCJoZWlnaHQ6MTIuNXB4XCI+XG4gICAgPGRpdiBjbGFzcz17Y2xzfSBzdHlsZT17c3R5bGUoc2lkZSl9IC8+XG4gICAgPGRpdiBjbGFzcz1cIntjbHN9IG14LTFcIiBzdHlsZT17c3R5bGUobWlkZGxlKX0gLz5cbiAgICA8ZGl2IGNsYXNzPXtjbHN9IHN0eWxlPXtzdHlsZShzaWRlKX0gLz5cbjwvZGl2PlxuIiwiPHNjcmlwdCBsYW5nPVwidHNcIj5cblx0aW1wb3J0IEluZGljYXRvciBmcm9tIFwiLi4vY29tcG9uZW50cy9zcGVha0luZGljYXRvci5zdmVsdGVcIjtcblxuXHRpbXBvcnQgeyBvbkRlc3Ryb3kgfSBmcm9tIFwic3ZlbHRlXCI7XG5cblx0bGV0IG1pZGRsZSA9IDAsXG5cdFx0c2lkZSA9IDA7XG5cdGNvbnN0IGludCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRjb25zdCByID0gKCkgPT4gTWF0aC5yYW5kb20oKTtcblx0XHRtaWRkbGUgPSByKCkgKiAxMiArIDAuNTtcblx0XHRzaWRlID0gcigpICogOCArIDAuNTtcblx0fSwgMTAwMCk7XG5cdG9uRGVzdHJveSgoKSA9PiBjbGVhckludGVydmFsKGludCkpO1xuPC9zY3JpcHQ+XG5cbjxzdmVsdGU6aGVhZD5cblx0PHRpdGxlPkFib3V0PC90aXRsZT5cbjwvc3ZlbHRlOmhlYWQ+XG5cbjxoMT5BYm91dCB0aGlzIHNpdGU8L2gxPlxuXG48cD5UaGlzIGlzIHRoZSAnYWJvdXQnIHBhZ2UuIFRoZXJlJ3Mgbm90IG11Y2ggaGVyZS48L3A+XG48SW5kaWNhdG9yIHttaWRkbGV9IHtzaWRlfSAvPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBT2dCLEdBQUc7d0RBQVMsR0FBSyxhQUFDLEdBQUk7O29EQUNyQixHQUFHO3dEQUFlLEdBQUssZUFBQyxHQUFNOzsyQkFDL0IsR0FBRzt3REFBUyxHQUFLLGFBQUMsR0FBSTs7Ozs7Ozs7Ozs7Ozs7O2dGQUZWLEdBQUssYUFBQyxHQUFJOzs7O2tGQUNILEdBQUssZUFBQyxHQUFNOzs7O2dGQUNuQixHQUFLLGFBQUMsR0FBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVBoQyxHQUFHLEdBQUcsMkJBQTJCOzs7OztPQUZWLE1BQU0sR0FBRyxDQUFDO09BQzVCLElBQUksR0FBRyxDQUFDO09BRWIsS0FBSyxHQUFJLENBQUMsd0JBQXlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQ0R0QyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDOztPQUNsQixHQUFHLEdBQUcsV0FBVzs7U0FDYixDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQU07bUJBQzNCLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLEdBQUc7bUJBQ3ZCLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUc7O0VBQ3JCLElBQUk7OztDQUNQLFNBQVMsT0FBTyxhQUFhLENBQUMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
