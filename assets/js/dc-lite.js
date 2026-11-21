/*
 * dc-lite.js: a small standalone renderer for the Orbitum mockup pages.
 *
 * The mockups were drawn as Design Component (.dc.html) artboards. This file
 * renders the same templates in any browser, with no build step:
 *   {{holes}}, <sc-if>, <sc-for>, <dc-import>, event bindings (onClick …),
 *   callback refs, and a Component class with state / setState / renderVals.
 *
 * Page layout it expects:
 *   <template data-dc-main>…markup…</template>
 *   <script type="text/x-dc" data-dc-script data-props='{…}'>class Component extends DCLogic {…}</script>
 *   <template data-dc-component="Name">…</template> + <script type="text/x-dc" data-dc-for="Name">…</script>
 */
(function () {
  'use strict';

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch, cb) {
    var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, next || {});
    scheduleRender(cb);
  };
  DCLogic.prototype.forceUpdate = function (cb) { scheduleRender(cb); };
  window.DCLogic = DCLogic;

  // ---------- definitions ----------
  var defs = {}; // name -> { tpl: DocumentFragment, Cls, defaults }

  function readDefaults(script) {
    var out = {};
    try {
      var spec = JSON.parse(script.getAttribute('data-props') || '{}');
      Object.keys(spec).forEach(function (k) {
        if (k.charAt(0) !== '$' && spec[k] && 'default' in spec[k]) out[k] = spec[k].default;
      });
    } catch (e) { console.warn('[dc-lite] bad data-props', e); }
    return out;
  }
  function compileClass(script) {
    var src = script.textContent + '\n;return Component;';
    return new Function('DCLogic', src)(DCLogic); // eslint-disable-line no-new-func
  }
  function define(name, tplEl, script) {
    defs[name] = { tpl: tplEl.content, Cls: compileClass(script), defaults: readDefaults(script) };
  }

  // ---------- lookups ----------
  function lookup(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    var q = expr.match(/^(['"])(.*)\1$/);
    if (q) return q[2];
    var parts = expr.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  var WHOLE = /^\s*\{\{([^{}]+)\}\}\s*$/;
  var ANY = /\{\{([^{}]+)\}\}/g;
  function interp(str, scope) {
    return str.replace(ANY, function (_, e) { var v = lookup(e, scope); return v == null || v === false ? '' : String(v); });
  }
  function evalAttr(raw, scope) {
    var m = raw.match(WHOLE);
    if (m) return lookup(m[1], scope);
    return raw.indexOf('{{') >= 0 ? interp(raw, scope) : raw;
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }

  // ---------- virtual tree ----------
  // A vnode: {t:'text', v} | {t:'el', ns, tag, attrs:{}, events:{}, props:{}, ref, kids:[]}
  var EVENTS = { onclick: 'click', oninput: 'input', onkeydown: 'keydown', onkeyup: 'keyup', onmouseenter: 'mouseenter',
    onmouseleave: 'mouseleave', onfocus: 'focus', onblur: 'blur', onsubmit: 'submit', onchange: 'change',
    onmousedown: 'mousedown', onmouseup: 'mouseup', onpointerdown: 'pointerdown', onscroll: 'scroll' };
  var PROPS = { value: 1, checked: 1 };
  var BOOL = { checked: 1, disabled: 1, selected: 1, hidden: 1, open: 1, required: 1, readonly: 1, multiple: 1 };

  var instances, used, renderCount;

  function buildKids(nodes, scope, out, path) {
    for (var i = 0; i < nodes.length; i++) build(nodes[i], scope, out, path + '.' + i);
  }
  function build(node, scope, out, path) {
    if (node.nodeType === 3) {
      var txt = node.nodeValue;
      out.push({ t: 'text', v: txt.indexOf('{{') >= 0 ? interp(txt, scope) : txt });
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'helmet') return;
    if (tag === 'sc-if') {
      if (evalAttr(node.getAttribute('value') || '', scope)) buildKids(node.childNodes, scope, out, path);
      return;
    }
    if (tag === 'sc-for') {
      var list = evalAttr(node.getAttribute('list') || '', scope) || [];
      var as = node.getAttribute('as') || 'item';
      for (var j = 0; j < list.length; j++) {
        var s = Object.create(scope);
        s[as] = list[j]; s.$index = j;
        buildKids(node.childNodes, s, out, path + '[' + j + ']');
      }
      return;
    }
    if (tag === 'dc-import') {
      var name = node.getAttribute('name');
      var def = defs[name];
      if (!def) { console.warn('[dc-lite] missing component', name); return; }
      var props = Object.assign({}, def.defaults);
      for (var a = 0; a < node.attributes.length; a++) {
        var at = node.attributes[a];
        if (at.name === 'name' || at.name.indexOf('hint-') === 0) continue;
        props[camel(at.name)] = evalAttr(at.value, scope);
      }
      var key = name + '@' + path;
      var inst = instances[key];
      if (!inst) { inst = new def.Cls(props); inst.props = props; instances[key] = inst; }
      else inst.props = props;
      used[key] = true;
      buildKids(def.tpl.childNodes, inst.renderVals(), out, key);
      return;
    }
    var v = { t: 'el', ns: node.namespaceURI, tag: tag, attrs: {}, events: {}, props: {}, ref: null, kids: [] };
    for (var k = 0; k < node.attributes.length; k++) {
      var attr = node.attributes[k];
      var an = attr.name;
      var val = evalAttr(attr.value, scope);
      if (EVENTS[an]) {
        if (typeof val === 'function') {
          var type = EVENTS[an];
          if (an === 'onchange' && tag === 'input' && !/checkbox|radio/.test(node.getAttribute('type') || '')) type = 'input';
          if (an === 'onchange' && tag === 'textarea') type = 'input';
          v.events[type] = val;
        }
        continue;
      }
      if (an === 'ref') { if (typeof val === 'function') v.ref = val; continue; }
      if (PROPS[an] && (tag === 'input' || tag === 'textarea' || tag === 'select')) {
        v.props[an] = an === 'checked' ? !!val : (val == null ? '' : String(val));
        if (an === 'value' && /checkbox|radio/.test(node.getAttribute('type') || '')) v.attrs.value = String(val == null ? '' : val);
        continue;
      }
      if (an.indexOf('aria-') === 0 && typeof val === 'boolean') { v.attrs[an] = String(val); continue; }
      if (val === false || val == null) continue;
      if (val === true) { v.attrs[an] = BOOL[an] ? '' : 'true'; continue; }
      v.attrs[an] = typeof val === 'object' ? '' : String(val);
    }
    if (tag === 'template') { v.kids = []; } else buildKids(node.childNodes, scope, v.kids, path);
    out.push(v);
  }

  // ---------- DOM patching ----------
  function dispatch(e) {
    var h = e.currentTarget.__dcEv && e.currentTarget.__dcEv[e.type];
    if (h) h(e);
  }
  function create(v) {
    if (v.t === 'text') return document.createTextNode(v.v);
    var el = v.ns && v.ns !== 'http://www.w3.org/1999/xhtml' ? document.createElementNS(v.ns, v.tag) : document.createElement(v.tag);
    el.__dcEv = {};
    patchEl(el, v);
    return el;
  }
  function patchEl(el, v) {
    var old = el.attributes;
    for (var i = old.length - 1; i >= 0; i--) if (!(old[i].name in v.attrs)) el.removeAttribute(old[i].name);
    for (var a in v.attrs) if (el.getAttribute(a) !== v.attrs[a]) el.setAttribute(a, v.attrs[a]);
    var ev = el.__dcEv || (el.__dcEv = {});
    for (var t in ev) if (!v.events[t]) { el.removeEventListener(t, dispatch); delete ev[t]; }
    for (var n in v.events) { if (!ev[n]) el.addEventListener(n, dispatch); ev[n] = v.events[n]; }
    for (var p in v.props) if (el[p] !== v.props[p]) el[p] = v.props[p];
    patchKids(el, v.kids);
    if (v.ref) pendingRefs.push([v.ref, el]);
  }
  function same(node, v) {
    if (v.t === 'text') return node.nodeType === 3;
    return node.nodeType === 1 && node.localName === v.tag;
  }
  function patchKids(parent, kids) {
    var nodes = parent.childNodes;
    for (var i = 0; i < kids.length; i++) {
      var v = kids[i], node = nodes[i];
      if (node && same(node, v)) {
        if (v.t === 'text') { if (node.nodeValue !== v.v) node.nodeValue = v.v; }
        else patchEl(node, v);
      } else if (node) parent.replaceChild(create(v), node);
      else parent.appendChild(create(v));
    }
    while (nodes.length > kids.length) parent.removeChild(parent.lastChild);
  }

  // ---------- render loop ----------
  var root, mainInst, mainTpl, pendingRefs = [], queued = false, callbacks = [];
  function render() {
    queued = false;
    used = {};
    pendingRefs = [];
    var vt = [];
    buildKids(mainTpl.childNodes, mainInst.renderVals(), vt, 'root');
    for (var k in instances) if (!used[k]) delete instances[k];
    patchKids(root, vt);
    pendingRefs.forEach(function (r) { try { r[0](r[1]); } catch (e) { console.warn(e); } });
    var cbs = callbacks; callbacks = [];
    cbs.forEach(function (cb) { try { cb(); } catch (e) { console.warn(e); } });
    renderCount++;
  }
  function scheduleRender(cb) {
    if (cb) callbacks.push(cb);
    if (queued || !root) return;
    queued = true;
    Promise.resolve().then(render);
  }

  function boot() {
    document.querySelectorAll('template[data-dc-component]').forEach(function (tpl) {
      var name = tpl.getAttribute('data-dc-component');
      var script = document.querySelector('script[data-dc-for="' + name + '"]');
      if (script) define(name, tpl, script);
    });
    var mainTplEl = document.querySelector('template[data-dc-main]');
    var mainScript = document.querySelector('script[data-dc-script]');
    if (!mainTplEl || !mainScript) return;
    mainTpl = mainTplEl.content;
    var Cls = compileClass(mainScript);
    var props = readDefaults(mainScript);
    mainInst = new Cls(props);
    mainInst.props = props;
    instances = {};
    renderCount = 0;
    root = document.getElementById('dc-root') || document.body.appendChild(document.createElement('div'));
    render();
    if (mainInst.componentDidMount) mainInst.componentDidMount();
    document.documentElement.setAttribute('data-dc-ready', '');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
