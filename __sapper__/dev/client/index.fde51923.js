import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, e as element, t as text, a as space, c as claim_element, b as children, f as claim_text, g as detach_dev, h as claim_space, j as attr_dev, k as add_location, l as insert_dev, m as append_dev, n as noop, o as create_component, p as claim_component, q as set_style, r as mount_component, u as transition_in, w as transition_out, x as destroy_component } from './client.9d8e0b55.js';

/* src/components/Nav.svelte generated by Svelte v3.31.0 */

const file = "src/components/Nav.svelte";

function create_fragment(ctx) {
	let nav;
	let ul;
	let li0;
	let a0;
	let t0;
	let a0_aria_current_value;
	let t1;
	let li1;
	let a1;
	let t2;
	let a1_aria_current_value;
	let t3;
	let li2;
	let a2;
	let t4;
	let a2_aria_current_value;

	const block = {
		c: function create() {
			nav = element("nav");
			ul = element("ul");
			li0 = element("li");
			a0 = element("a");
			t0 = text("home");
			t1 = space();
			li1 = element("li");
			a1 = element("a");
			t2 = text("about");
			t3 = space();
			li2 = element("li");
			a2 = element("a");
			t4 = text("blog");
			this.h();
		},
		l: function claim(nodes) {
			nav = claim_element(nodes, "NAV", { class: true });
			var nav_nodes = children(nav);
			ul = claim_element(nav_nodes, "UL", { class: true });
			var ul_nodes = children(ul);
			li0 = claim_element(ul_nodes, "LI", { class: true });
			var li0_nodes = children(li0);

			a0 = claim_element(li0_nodes, "A", {
				"aria-current": true,
				href: true,
				class: true
			});

			var a0_nodes = children(a0);
			t0 = claim_text(a0_nodes, "home");
			a0_nodes.forEach(detach_dev);
			li0_nodes.forEach(detach_dev);
			t1 = claim_space(ul_nodes);
			li1 = claim_element(ul_nodes, "LI", { class: true });
			var li1_nodes = children(li1);

			a1 = claim_element(li1_nodes, "A", {
				"aria-current": true,
				href: true,
				class: true
			});

			var a1_nodes = children(a1);
			t2 = claim_text(a1_nodes, "about");
			a1_nodes.forEach(detach_dev);
			li1_nodes.forEach(detach_dev);
			t3 = claim_space(ul_nodes);
			li2 = claim_element(ul_nodes, "LI", { class: true });
			var li2_nodes = children(li2);

			a2 = claim_element(li2_nodes, "A", {
				rel: true,
				"aria-current": true,
				href: true,
				class: true
			});

			var a2_nodes = children(a2);
			t4 = claim_text(a2_nodes, "blog");
			a2_nodes.forEach(detach_dev);
			li2_nodes.forEach(detach_dev);
			ul_nodes.forEach(detach_dev);
			nav_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a0, "aria-current", a0_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined);
			attr_dev(a0, "href", ".");
			attr_dev(a0, "class", "svelte-1dbd5up");
			add_location(a0, file, 51, 6, 661);
			attr_dev(li0, "class", "svelte-1dbd5up");
			add_location(li0, file, 51, 2, 657);
			attr_dev(a1, "aria-current", a1_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined);
			attr_dev(a1, "href", "about");
			attr_dev(a1, "class", "svelte-1dbd5up");
			add_location(a1, file, 52, 6, 753);
			attr_dev(li1, "class", "svelte-1dbd5up");
			add_location(li1, file, 52, 2, 749);
			attr_dev(a2, "rel", "prefetch");
			attr_dev(a2, "aria-current", a2_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined);
			attr_dev(a2, "href", "blog");
			attr_dev(a2, "class", "svelte-1dbd5up");
			add_location(a2, file, 56, 6, 1006);
			attr_dev(li2, "class", "svelte-1dbd5up");
			add_location(li2, file, 56, 2, 1002);
			attr_dev(ul, "class", "svelte-1dbd5up");
			add_location(ul, file, 50, 1, 650);
			attr_dev(nav, "class", "svelte-1dbd5up");
			add_location(nav, file, 49, 0, 643);
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			append_dev(nav, ul);
			append_dev(ul, li0);
			append_dev(li0, a0);
			append_dev(a0, t0);
			append_dev(ul, t1);
			append_dev(ul, li1);
			append_dev(li1, a1);
			append_dev(a1, t2);
			append_dev(ul, t3);
			append_dev(ul, li2);
			append_dev(li2, a2);
			append_dev(a2, t4);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*segment*/ 1 && a0_aria_current_value !== (a0_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined)) {
				attr_dev(a0, "aria-current", a0_aria_current_value);
			}

			if (dirty & /*segment*/ 1 && a1_aria_current_value !== (a1_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined)) {
				attr_dev(a1, "aria-current", a1_aria_current_value);
			}

			if (dirty & /*segment*/ 1 && a2_aria_current_value !== (a2_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined)) {
				attr_dev(a2, "aria-current", a2_aria_current_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
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

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Nav", slots, []);
	let { segment } = $$props;
	const writable_props = ["segment"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
	};

	$$self.$capture_state = () => ({ segment });

	$$self.$inject_state = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [segment];
}

class Nav extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { segment: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*segment*/ ctx[0] === undefined && !("segment" in props)) {
			console.warn("<Nav> was created without expected prop 'segment'");
		}
	}

	get segment() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segment(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/index.svelte generated by Svelte v3.31.0 */
const file$1 = "src/routes/index.svelte";

function create_fragment$1(ctx) {
	let main;
	let nav;
	let t0;
	let div2;
	let h1;
	let t1;
	let t2;
	let div1;
	let a;
	let t3;
	let t4;
	let p;
	let t5;
	let t6;
	let div0;
	let input;
	let t7;
	let button;
	let t8;
	let current;

	nav = new Nav({
			props: { segment: /*segment*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			main = element("main");
			create_component(nav.$$.fragment);
			t0 = space();
			div2 = element("div");
			h1 = element("h1");
			t1 = text("Welcome to meet-peer");
			t2 = space();
			div1 = element("div");
			a = element("a");
			t3 = text("create new room");
			t4 = space();
			p = element("p");
			t5 = text("OR");
			t6 = space();
			div0 = element("div");
			input = element("input");
			t7 = space();
			button = element("button");
			t8 = text("join with code");
			this.h();
		},
		l: function claim(nodes) {
			main = claim_element(nodes, "MAIN", { class: true });
			var main_nodes = children(main);
			claim_component(nav.$$.fragment, main_nodes);
			t0 = claim_space(main_nodes);
			div2 = claim_element(main_nodes, "DIV", { id: true, class: true });
			var div2_nodes = children(div2);
			h1 = claim_element(div2_nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "Welcome to meet-peer");
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			a = claim_element(div1_nodes, "A", { href: true, class: true, style: true });
			var a_nodes = children(a);
			t3 = claim_text(a_nodes, "create new room");
			a_nodes.forEach(detach_dev);
			t4 = claim_space(div1_nodes);
			p = claim_element(div1_nodes, "P", {});
			var p_nodes = children(p);
			t5 = claim_text(p_nodes, "OR");
			p_nodes.forEach(detach_dev);
			t6 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			input = claim_element(div0_nodes, "INPUT", { id: true, class: true, type: true });
			t7 = claim_space(div0_nodes);
			button = claim_element(div0_nodes, "BUTTON", { class: true, id: true, to: true });
			var button_nodes = children(button);
			t8 = claim_text(button_nodes, "join with code");
			button_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			main_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "display-5");
			add_location(h1, file$1, 22, 2, 454);
			attr_dev(a, "href", "/new-room");
			attr_dev(a, "class", "btn btn-link");
			set_style(a, "font-size", "20px");
			add_location(a, file$1, 24, 3, 528);
			add_location(p, file$1, 29, 3, 630);
			attr_dev(input, "id", "join-code");
			attr_dev(input, "class", "form-control");
			attr_dev(input, "type", "text");
			add_location(input, file$1, 32, 4, 667);
			attr_dev(button, "class", "btn btn-primary mt-2");
			attr_dev(button, "id", "join-room");
			attr_dev(button, "to", "/room");
			add_location(button, file$1, 33, 4, 729);
			attr_dev(div0, "class", "mt-4");
			add_location(div0, file$1, 31, 3, 644);
			attr_dev(div1, "class", "m-auto");
			add_location(div1, file$1, 23, 2, 504);
			attr_dev(div2, "id", "h");
			attr_dev(div2, "class", "d-flex justify-around flex-column");
			add_location(div2, file$1, 21, 1, 397);
			attr_dev(main, "class", "svelte-atd7os");
			add_location(main, file$1, 19, 0, 370);
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			mount_component(nav, main, null);
			append_dev(main, t0);
			append_dev(main, div2);
			append_dev(div2, h1);
			append_dev(h1, t1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, a);
			append_dev(a, t3);
			append_dev(div1, t4);
			append_dev(div1, p);
			append_dev(p, t5);
			append_dev(div1, t6);
			append_dev(div1, div0);
			append_dev(div0, input);
			append_dev(div0, t7);
			append_dev(div0, button);
			append_dev(button, t8);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const nav_changes = {};
			if (dirty & /*segment*/ 1) nav_changes.segment = /*segment*/ ctx[0];
			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			destroy_component(nav);
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
	validate_slots("Routes", slots, []);
	let { segment } = $$props;
	const writable_props = ["segment"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Routes> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
	};

	$$self.$capture_state = () => ({ Nav, segment });

	$$self.$inject_state = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [segment];
}

class Routes extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { segment: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Routes",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*segment*/ ctx[0] === undefined && !("segment" in props)) {
			console.warn("<Routes> was created without expected prop 'segment'");
		}
	}

	get segment() {
		throw new Error("<Routes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segment(value) {
		throw new Error("<Routes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Routes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZmRlNTE5MjMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL05hdi5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL2luZGV4LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuXHRleHBvcnQgbGV0IHNlZ21lbnQ6IHN0cmluZztcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG5cdG5hdiB7XG5cdFx0Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjU1LDYyLDAsMC4xKTtcblx0XHRmb250LXdlaWdodDogMzAwO1xuXHRcdHBhZGRpbmc6IDAgMWVtO1xuXHR9XG5cblx0dWwge1xuXHRcdG1hcmdpbjogMDtcblx0XHRwYWRkaW5nOiAwO1xuXHR9XG5cblx0LyogY2xlYXJmaXggKi9cblx0dWw6OmFmdGVyIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRjbGVhcjogYm90aDtcblx0fVxuXG5cdGxpIHtcblx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRmbG9hdDogbGVmdDtcblx0fVxuXG5cdFthcmlhLWN1cnJlbnRdIHtcblx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHR9XG5cblx0W2FyaWEtY3VycmVudF06OmFmdGVyIHtcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0Y29udGVudDogJyc7XG5cdFx0d2lkdGg6IGNhbGMoMTAwJSAtIDFlbSk7XG5cdFx0aGVpZ2h0OiAycHg7XG5cdFx0YmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSw2MiwwKTtcblx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRib3R0b206IC0xcHg7XG5cdH1cblxuXHRhIHtcblx0XHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XG5cdFx0cGFkZGluZzogMWVtIDAuNWVtO1xuXHRcdGRpc3BsYXk6IGJsb2NrO1xuXHR9XG48L3N0eWxlPlxuXG48bmF2PlxuXHQ8dWw+XG5cdFx0PGxpPjxhIGFyaWEtY3VycmVudD1cIntzZWdtZW50ID09PSB1bmRlZmluZWQgPyAncGFnZScgOiB1bmRlZmluZWR9XCIgaHJlZj1cIi5cIj5ob21lPC9hPjwvbGk+XG5cdFx0PGxpPjxhIGFyaWEtY3VycmVudD1cIntzZWdtZW50ID09PSAnYWJvdXQnID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVwiIGhyZWY9XCJhYm91dFwiPmFib3V0PC9hPjwvbGk+XG5cblx0XHQ8IS0tIGZvciB0aGUgYmxvZyBsaW5rLCB3ZSdyZSB1c2luZyByZWw9cHJlZmV0Y2ggc28gdGhhdCBTYXBwZXIgcHJlZmV0Y2hlc1xuXHRcdCAgICAgdGhlIGJsb2cgZGF0YSB3aGVuIHdlIGhvdmVyIG92ZXIgdGhlIGxpbmsgb3IgdGFwIGl0IG9uIGEgdG91Y2hzY3JlZW4gLS0+XG5cdFx0PGxpPjxhIHJlbD1wcmVmZXRjaCBhcmlhLWN1cnJlbnQ9XCJ7c2VnbWVudCA9PT0gJ2Jsb2cnID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVwiIGhyZWY9XCJibG9nXCI+YmxvZzwvYT48L2xpPlxuXHQ8L3VsPlxuPC9uYXY+XG4iLCI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuXHRpbXBvcnQgTmF2IGZyb20gXCIuLi9jb21wb25lbnRzL05hdi5zdmVsdGVcIjtcblx0ZXhwb3J0IGxldCBzZWdtZW50OiBzdHJpbmc7XG5cdC8vIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCI7XG5cdC8vIGxldCBzb2NrZXQ7XG5cdC8vIG9uTW91bnQoKCkgPT4ge1xuXHQvLyBcdHNvY2tldCA9IGlvKFwiL1wiKTtcblx0Ly8gXHRjb25zb2xlLmxvZyhcInNvY2tldFwiLCBzb2NrZXQsIHNvY2tldC5pZCwgc29ja2V0LmNvbm5lY3RlZCk7XG5cdC8vIH0pO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cblx0bWFpbiB7XG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdHBhZGRpbmc6IDAuNWVtO1xuXHRcdG1hcmdpbjogMCBhdXRvO1xuXHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cdH1cbjwvc3R5bGU+XG5cbjxtYWluPlxuXHQ8TmF2IHtzZWdtZW50fSAvPlxuXHQ8ZGl2IGlkPVwiaFwiIGNsYXNzPVwiZC1mbGV4IGp1c3RpZnktYXJvdW5kIGZsZXgtY29sdW1uXCI+XG5cdFx0PGgxIGNsYXNzPVwiZGlzcGxheS01XCI+V2VsY29tZSB0byBtZWV0LXBlZXI8L2gxPlxuXHRcdDxkaXYgY2xhc3M9XCJtLWF1dG9cIj5cblx0XHRcdDxhXG5cdFx0XHRcdGhyZWY9XCIvbmV3LXJvb21cIlxuXHRcdFx0XHRjbGFzcz1cImJ0biBidG4tbGlua1wiXG5cdFx0XHRcdHN0eWxlPVwiZm9udC1zaXplOiAyMHB4O1wiPmNyZWF0ZSBuZXcgcm9vbTwvYT5cblxuXHRcdFx0PHA+T1I8L3A+XG5cblx0XHRcdDxkaXYgY2xhc3M9XCJtdC00XCI+XG5cdFx0XHRcdDxpbnB1dCBpZD1cImpvaW4tY29kZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiAvPlxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0Y2xhc3M9XCJidG4gYnRuLXByaW1hcnkgbXQtMlwiXG5cdFx0XHRcdFx0aWQ9XCJqb2luLXJvb21cIlxuXHRcdFx0XHRcdHRvPVwiL3Jvb21cIj5qb2luIHdpdGggY29kZTwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdDwvZGl2PlxuPC9tYWluPlxuXG48IS0tIFxuPHN2ZWx0ZTpoZWFkPjxzY3JpcHQgc3JjPVwiL3NvY2tldC5pby9zb2NrZXQuaW8uanNcIj5cblx0PC9zY3JpcHQ+PC9zdmVsdGU6aGVhZD4gLS0+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29FQW1Ed0IsR0FBTyxRQUFLLFNBQVMsR0FBRyxNQUFNLEdBQUcsU0FBUzs7Ozs7O29FQUMxQyxHQUFPLFFBQUssT0FBTyxHQUFHLE1BQU0sR0FBRyxTQUFTOzs7Ozs7O29FQUkzQixHQUFPLFFBQUssTUFBTSxHQUFHLE1BQU0sR0FBRyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBTHBELEdBQU8sUUFBSyxTQUFTLEdBQUcsTUFBTSxHQUFHLFNBQVM7Ozs7K0ZBQzFDLEdBQU8sUUFBSyxPQUFPLEdBQUcsTUFBTSxHQUFHLFNBQVM7Ozs7K0ZBSTNCLEdBQU8sUUFBSyxNQUFNLEdBQUcsTUFBTSxHQUFHLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F4RC9DLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0NDekIsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
