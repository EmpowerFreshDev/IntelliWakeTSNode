"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const readline = require("readline");
const pkg = require("pg");
const KeyboardLine = async (question, validAnswers) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    (resolve) => rl.question(`${question} `, (answer) => {
      if (!validAnswers || validAnswers.includes(answer)) {
        resolve(answer);
        rl.close();
      }
    })
  );
};
const KeyboardKey = async (question, validKeys) => {
  return new Promise((resolve) => {
    if (!!question) console.log(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const getData = (key) => {
      if (key === "") process.exit();
      if (!validKeys || (Array.isArray(validKeys) ? validKeys.includes(key) : validKeys(key))) {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", getData);
        resolve(key);
      }
    };
    process.stdin.on("data", getData);
  });
};
var Fn = Object.defineProperty, Pn = Object.defineProperties;
var Bn = Object.getOwnPropertyDescriptors;
var rn = Object.getOwnPropertySymbols;
var xn = Object.prototype.hasOwnProperty, Rn = Object.prototype.propertyIsEnumerable;
var ne = Math.pow, We = (n, e, a) => e in n ? Fn(n, e, { enumerable: true, configurable: true, writable: true, value: a }) : n[e] = a, D = (n, e) => {
  for (var a in e || (e = {}))
    xn.call(e, a) && We(n, a, e[a]);
  if (rn)
    for (var a of rn(e))
      Rn.call(e, a) && We(n, a, e[a]);
  return n;
}, V = (n, e) => Pn(n, Bn(e));
const Yn = {
  primaryAscending: true,
  primaryEmptyToBottom: null,
  secondarySort: null,
  secondaryAscending: true,
  secondaryEmptyToBottom: null
};
({
  sortColumns: V(D({}, Yn), { primarySort: "" })
});
const re = (n) => n == null || n === "", F = (n) => n == null, Wn = (n, e, a = null) => {
  //!!emptyTo
  if (n === e)
    return null;
  if (a)
    if (a.endsWith("0")) {
      if (!n && e)
        return typeof e == "boolean" ? a === "Top0" ? 1 : -1 : a === "Top0" ? -1 : 1;
      if (!e && n)
        return typeof n == "boolean" ? a === "Top0" ? -1 : 1 : a === "Top0" ? 1 : -1;
    } else {
      if (re(n) && !re(e))
        return typeof e == "boolean" ? a === "Top" ? 1 : -1 : a === "Top" ? -1 : 1;
      if (re(e) && !re(n))
        return typeof n == "boolean" ? a === "Top" ? -1 : 1 : a === "Top" ? 1 : -1;
    }
  if (typeof n == "boolean" && typeof e == "boolean")
    return (n ? 1 : 0) - (e ? 1 : 0);
  const r = f(n, void 0, true), t = f(e, void 0, true);
  return !isNaN(r) && !isNaN(t) ? r - t : (n != null ? n : "").toString().localeCompare((e != null ? e : "").toString(), void 0, { sensitivity: "base" });
}, le = (n, e, a = null) => {
  var r;
  return (r = Wn(n, e, a)) != null ? r : 0;
};
const Ye = (n, e = true, a = 8) => (n != null ? n : "").trim().split(/(\s+)/).map((r) => e ? r.trim().toLowerCase() : r.trim()).filter((r) => !!r).filter((r, t) => !a || t < a), j = (n) => {
  if (!n)
    return [];
  const e = H(n);
  let a = [];
  const r = [" ", "_", ",", "-", "/", "\\", "'", '"', "=", "+", "~", ".", ",", "(", ")", "<", ">", "{", "}"];
  e:
    for (const t of e) {
      for (const i of r)
        if (t.includes(i)) {
          a = j([...a, ...t.split(i).filter((u) => !!u)]);
          continue e;
        }
      a = [
        ...a,
        ...t.replace(/([a-zA-Z])([0-9])/g, "$1 $2").replace(/([0-9])([a-zA-Z])/g, "$1 $2").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z0-9])/g, "$1 $2").replace(/([a-zA-Z0-9])([:;@#])/g, "$1 $2").replace(/([:;@#])([a-zA-Z0-9])/g, "$1 $2").split(" ")
      ].filter((i) => !!i);
    }
  return a.filter((t) => !!t);
}, Zn = (n) => n ? n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase() : "", Qe = (n) => n ? n === n.toUpperCase() ? n : n.toLowerCase() === "id" ? "ID" : Zn(n) : "", hr = (n) => j(n).map((e) => e.toLowerCase()).join("_"), Sr = (n) => j(n).map((e) => e === e.toUpperCase() ? e : Qe(e)).join(""), v = function(n, e = 0, a = null) {
  return f(n).toLocaleString(void 0, {
    maximumFractionDigits: e,
    minimumFractionDigits: a != null ? a : e
  });
}, Z = (n) => {
  let e = v(n);
  if (!e)
    return null;
  switch (e.substring(e.length - 2)) {
    case "11":
    case "12":
    case "13":
      e += "th";
      break;
    default:
      switch (e.substring(e.length - 1)) {
        case "1":
          e += "st";
          break;
        case "2":
          e += "nd";
          break;
        case "3":
          e += "rd";
          break;
        default:
          e += "th";
          break;
      }
  }
  return e;
};
const Be = "YYYY-MM-DD", ia = "HH:mm:ss", ua = Be + " " + ia, Xe = "MMM D, YYYY", Tn = `dd, ${Xe}`, te = "h:mm a", oa = `${Xe}, ${te}`, la = `${Tn}, ${te}`, je = "MMMM D, YYYY", Mn = `dddd, ${je}`, sa = `${je}, ${te}`, ca = `${Mn}, ${te}`, ma = (n) => {
  var e;
  return n ? (e = Y("now", n)) != null ? e : (/* @__PURE__ */ new Date()).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
}, fa = () => Intl.DateTimeFormat().resolvedOptions().timeZone, Ie = (n, e) => {
  var g;
  if (!n)
    return ((g = A(e != null ? e : "now", { ignoreIANA: true })) != null ? g : /* @__PURE__ */ new Date()).getTimezoneOffset();
  const a = e ? R(e, void 0, true) : null;
  let r = a ? new Date(a) : /* @__PURE__ */ new Date();
  function t(h) {
    const S = h.replace(":", " ").split(" ");
    return {
      day: parseInt(S[0]),
      hour: parseInt(S[1]),
      minute: parseInt(S[2])
    };
  }
  let i = r.toLocaleString(["nl-NL"], {
    timeZone: n,
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });
  const u = t(i), l = u.day * 1440 + u.hour * 60 + u.minute;
  i = r.toLocaleString(["nl-NL"], { day: "numeric", hour: "numeric", minute: "numeric", hour12: false });
  const o = t(i);
  let s = o.day * 1440 + o.hour * 60 + o.minute;
  return u.day > o.day && (s += u.day * 1440), (s - l + r.getTimezoneOffset()) % 1440;
}, Cn = (n) => n.includes(":"), en = (n) => n.includes("-") || /\d{8}/.test(n), bn = (n) => n === "now" || n === "today" || n.includes("T") || n.substring(15).includes("Z") || n.includes("+") || n.substring(15).includes("-"), ga = (n) => !!(n != null && n.includes("/")) && /^[a-zA-Z_\/]*$/.test(n), ha = (n) => {
  let e = n.split(" ");
  if (e.length === 1)
    return n;
  let a = e[1].split(":");
  return a.length === 1 ? n : (a.length === 2 && (a.push("00"), e[1] = a.join(":")), e.join(" "));
}, da = (n) => {
  var r, t, i, u;
  const e = ha(n);
  let a = [
    "([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?",
    "([0-9]{4})(-([0-9]{2})(-([0-9]{2})( ([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?",
    "([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?"
  ].reduce((l, o) => {
    const s = (e.length === 16 ? e + ":00" : e).match(new RegExp(o));
    return (s == null ? void 0 : s.at(4)) === void 0 ? l : l ? s && s[10] && !l[10] ? s : l : s;
  }, null);
  if (a) {
    let l = new Date(f(a[1]), 0, 1);
    a[1] && l.setUTCFullYear(f(a[1])), a[3] && l.setUTCMonth(f(a[3]) - 1), a[5] && l.setUTCDate(f(a[5])), l.setUTCHours(f((r = a[7]) != null ? r : 0)), l.setUTCMinutes(f((t = a[8]) != null ? t : 0)), l.setUTCSeconds(f((i = a[10]) != null ? i : 0)), l.setUTCMilliseconds(f(((u = a[12]) != null ? u : 0).toString().padEnd(3, "0").substring(0, 3)));
    let o = 0;
    if (a[14])
      o = f(a[16]) + parseInt(a[17], 10), o *= a[15] === "-" ? 1 : -1;
    else if (e.length > 12) {
      const g = e.substring(e.length - 3);
      (g.startsWith("-") || g.endsWith("+")) && (o -= f(g));
    }
    const s = l.valueOf() + o * 36e5;
    let m = new Date(s);
    return m ? m.valueOf() : null;
  }
  return null;
}, R = (n, e, a) => {
  var r;
  if (!n && n !== 0 && n !== "0")
    return null;
  if (typeof n == "number")
    return n;
  if (typeof n == "object")
    return n.valueOf();
  if (n.toString().toLowerCase() === "now" || n.toString().toLowerCase() === "today")
    return (/* @__PURE__ */ new Date()).valueOf();
  try {
    let t = da(n);
    if ((t === null || isNaN(t)) && (t = Date.parse(n.toString()), !isNaN(t)))
      return t;
    if (isNaN(t))
      return null;
    if (!a && !bn(n)) {
      let i = e;
      if (!i) {
        const u = n.split(" "), l = u[u.length - 1];
        ga(l) && (i = l);
      }
      t += ((r = Ie(i, n)) != null ? r : 0) * 6e4;
    }
    return t;
  } catch (t) {
    return null;
  }
}, p = (n, e) => {
  let a = R(n, e == null ? void 0 : e.timezoneSource, e == null ? void 0 : e.ignoreIANA);
  return !a && a !== 0 || !e ? a : $(a, e);
}, Y = (n, e) => {
  const a = p(n, e);
  return a ? new Date(a).toISOString() : null;
}, A = (n, e) => {
  const a = p(n, e);
  return !a && a !== 0 ? null : new Date(a);
}, ce = (n, e, a, r) => {
  var I, N, O;
  const t = typeof e == "string" && !bn(e), i = typeof e == "string" && !en(e) && Cn(e) ? `${b("now")} ${e}` : e;
  let u = A(R(i, t ? r : void 0));
  if (a)
    try {
      if (!u || isNaN(u.valueOf()))
        return null;
      const d = i && i !== "now" && i !== "today" ? u : void 0, c = (I = Ie(r, d)) != null ? I : 0, C = (N = Ie(a, d)) != null ? N : 0, U = t ? r ? ((O = Ie(void 0, d)) != null ? O : 0) - c - (C - c) : C - c - (C - c) : c - C;
      u = A(u, { minutes: U });
    } catch (d) {
      return console.log("Invalid Timezone", d), null;
    }
  if (!u || isNaN(u.valueOf()))
    return null;
  const l = (d, c) => {
    var C, U, W, ee, G, ge, he, de, Ae, Se, ye, ve, De, Te, Me, Ce, be, we, ke, Oe;
    if (a === "UTC")
      switch (d) {
        case "YYYY":
          return c.getUTCFullYear().toString().padStart(4, "0");
        case "YY":
          return c.getUTCFullYear().toString().substring(2).padStart(2, "0");
        case "Q":
          return Math.ceil((c.getUTCMonth() + 1) / 3).toString();
        case "Qo":
          return (C = Z(Math.ceil((c.getUTCMonth() + 1) / 3))) != null ? C : "";
        case "MMMM":
          return (U = Le[c.getUTCMonth()]) != null ? U : "";
        case "MMM":
          return ((W = Le[c.getUTCMonth()]) != null ? W : "").substring(0, 3);
        case "MM":
          return (c.getUTCMonth() + 1).toString().padStart(2, "0");
        case "Mo":
          return (ee = Z(c.getUTCMonth() + 1)) != null ? ee : "";
        case "M":
          return (c.getUTCMonth() + 1).toString();
        case "w":
          return f((G = Q(c)) == null ? void 0 : G.week).toString();
        case "DD":
          return c.getUTCDate().toString().padStart(2, "0");
        case "Do":
          return (ge = Z(c.getUTCDate())) != null ? ge : "";
        case "D":
          return c.getUTCDate().toString();
        case "d":
          return c.getUTCDay().toString();
        case "do":
          return (he = Z(c.getUTCDay())) != null ? he : "";
        case "dd":
          return ((de = ue[c.getUTCDay()]) != null ? de : "").substring(0, 2);
        case "ddd":
          return ((Ae = ue[c.getUTCDay()]) != null ? Ae : "").substring(0, 3);
        case "dddd":
          return (Se = ue[c.getUTCDay()]) != null ? Se : "";
        case "HH":
          return c.getUTCHours().toString().padStart(2, "0");
        case "H":
          return c.getUTCHours().toString();
        case "hh":
          return (c.getUTCHours() > 12 ? c.getUTCHours() - 12 : c.getUTCHours()).toString().padStart(2, "0");
        case "h": {
          const K = c.getUTCHours() > 12 ? c.getUTCHours() - 12 : c.getUTCHours();
          return (K === 0 ? 12 : K).toString();
        }
        case "mm":
          return c.getUTCMinutes().toString().padStart(2, "0");
        case "m":
          return c.getUTCMinutes().toString();
        case "ssss":
          return c.getUTCMilliseconds().toString().padStart(4, "0");
        case "sss":
          return c.getUTCMilliseconds().toString().padStart(3, "0");
        case "ss":
          return c.getUTCSeconds().toString().padStart(2, "0");
        case "s":
          return c.getUTCSeconds().toString();
        case "A":
          return c.getUTCHours() >= 12 ? "PM" : "AM";
        case "a":
          return c.getUTCHours() >= 12 ? "pm" : "am";
        default:
          return d;
      }
    else
      switch (d) {
        case "YYYY":
          return c.getFullYear().toString().padStart(4, "0");
        case "YY":
          return c.getFullYear().toString().substring(2).padStart(2, "0");
        case "Q":
          return Math.ceil((c.getMonth() + 1) / 3).toString();
        case "Qo":
          return (ye = Z(Math.ceil((c.getMonth() + 1) / 3))) != null ? ye : "";
        case "MMMM":
          return (ve = Le[c.getMonth()]) != null ? ve : "";
        case "MMM":
          return ((De = Le[c.getMonth()]) != null ? De : "").substring(0, 3);
        case "MM":
          return (c.getMonth() + 1).toString().padStart(2, "0");
        case "Mo":
          return (Te = Z(c.getMonth() + 1)) != null ? Te : "";
        case "M":
          return (c.getMonth() + 1).toString();
        case "w":
          return f((Me = Q(c)) == null ? void 0 : Me.week).toString();
        case "DD":
          return c.getDate().toString().padStart(2, "0");
        case "Do":
          return (Ce = Z(c.getDate())) != null ? Ce : "";
        case "D":
          return c.getDate().toString();
        case "d":
          return c.getDay().toString();
        case "do":
          return (be = Z(c.getDay())) != null ? be : "";
        case "dd":
          return ((we = ue[c.getDay()]) != null ? we : "").substring(0, 2);
        case "ddd":
          return ((ke = ue[c.getDay()]) != null ? ke : "").substring(0, 3);
        case "dddd":
          return (Oe = ue[c.getDay()]) != null ? Oe : "";
        case "HH":
          return c.getHours().toString().padStart(2, "0");
        case "H":
          return c.getHours().toString();
        case "hh":
          return (c.getHours() > 12 ? c.getHours() - 12 : c.getHours()).toString().padStart(2, "0");
        case "h": {
          const K = c.getHours() > 12 ? c.getHours() - 12 : c.getHours();
          return (K === 0 ? 12 : K).toString();
        }
        case "mm":
          return c.getMinutes().toString().padStart(2, "0");
        case "m":
          return c.getMinutes().toString();
        case "ssss":
          return c.getMilliseconds().toString().padStart(4, "0");
        case "sss":
          return c.getMilliseconds().toString().padStart(3, "0");
        case "ss":
          return c.getSeconds().toString().padStart(2, "0");
        case "s":
          return c.getSeconds().toString();
        case "A":
          return c.getHours() >= 12 ? "PM" : "AM";
        case "a":
          return c.getHours() >= 12 ? "pm" : "am";
        default:
          return d;
      }
  };
  let o;
  switch (n) {
    case "Local":
      o = "M/D/YYYY";
      break;
    case "LocalDoW":
      o = "dd, M/D/YYYY";
      break;
    case "LocalDateTime":
      o = "M/D/YYYY h:mm a";
      break;
    case "LocalDoWTime":
      o = "dd, M/D/YYYY h:mm a";
      break;
    case "Date":
      o = Be;
      break;
    case "DateTime":
      o = ua;
      break;
    case "DisplayDate":
      o = Xe;
      break;
    case "DisplayDateDoW":
      o = Tn;
      break;
    case "DisplayTime":
      o = te;
      break;
    case "DisplayDateTime":
      o = oa;
      break;
    case "DisplayDateDoWTime":
      o = la;
      break;
    case "DisplayDateLong":
      o = je;
      break;
    case "DisplayDateDoWLong":
      o = Mn;
      break;
    case "DisplayDateTimeLong":
      o = sa;
      break;
    case "DisplayDateDoWTimeLong":
      o = ca;
      break;
    case "ISO":
      if (u)
        return u.toISOString();
      o = "YYYY-MM-DDTHH:mm:ss.sssZ";
      break;
    case "ISOInput":
      o = "YYYY-MM-DDTHH:mm";
      break;
    default:
      o = n != null ? n : "YYYY-MM-DD h:mm:ss a";
      break;
  }
  const s = o.split("");
  let m = "", g = "", h = "", S = false;
  const M = ["Mo", "Qo", "Do", "do"];
  for (const d of s)
    S ? d === "]" ? S = false : m += d : d === "[" ? (m += l(h, u), h = "", g = "", S = true) : (d === g || g === "" || h.length > 0 && M.some(
      (c) => c.startsWith(h) && d === c.substring(h.length, h.length + 1)
    ) ? h += d : (m += l(h, u), h = d), g = d);
  return m += l(h, u), m;
}, me = (n, e, a, r) => ce(n, e, a, r), Aa = (n) => {
  var a;
  const e = (a = A(n)) != null ? a : /* @__PURE__ */ new Date();
  return `${e.getFullYear()}${(e.getMonth() + 1).toString().padStart(2, "0")}${e.getDate().toString().padStart(2, "0")}${e.getHours().toString().padStart(2, "0")}${e.getMinutes().toString().padStart(2, "0")}${e.getSeconds().toString().padStart(2, "0")}`;
}, it = (n) => {
  var a;
  const e = (a = A(n)) != null ? a : /* @__PURE__ */ new Date();
  return `${e.getFullYear()}-${(e.getMonth() + 1).toString().padStart(2, "0")}-${e.getDate().toString().padStart(2, "0")}_${e.getHours().toString().padStart(2, "0")}-${e.getMinutes().toString().padStart(2, "0")}-${e.getSeconds().toString().padStart(2, "0")}`;
}, Le = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
], ue = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], Sa = (n) => n % 4 === 0 && n % 100 !== 0 || n % 400 === 0, J = (n, e) => {
  var t;
  let a = e, r = n;
  for (; a < 0; )
    a += 12, r -= 1;
  for (; a > 11; )
    a -= 12, r += 1;
  return (t = [31, Sa(r) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][a]) != null ? t : null;
}, $e = (n, e) => {
  var l, o, s, m, g, h, S, M, I;
  let a = R(n);
  if (!a)
    return null;
  const r = e < 0, t = (l = A(n)) != null ? l : /* @__PURE__ */ new Date(), i = t.getUTCDate(), u = i === J(t.getUTCFullYear(), t.getUTCMonth());
  for (let N = 0; N < Math.abs(e); N++) {
    const O = (o = A(a)) != null ? o : /* @__PURE__ */ new Date(), d = O.getUTCFullYear(), c = O.getUTCMonth();
    if (u)
      r ? a -= 24 * 60 * 60 * 1e3 * ((s = J(d, c)) != null ? s : 0) : a += 24 * 60 * 60 * 1e3 * ((m = J(d, c + 1)) != null ? m : 0);
    else {
      r ? a -= 24 * 60 * 60 * 1e3 * ((g = J(d, c - 1)) != null ? g : 0) : a += 24 * 60 * 60 * 1e3 * ((h = J(d, c)) != null ? h : 0);
      let C = (S = A(a)) != null ? S : /* @__PURE__ */ new Date();
      C.getUTCDate() < 15 && C.getUTCDate() < i && (a -= 24 * 60 * 60 * 1e3 * C.getUTCDate()), C = (M = A(a)) != null ? M : /* @__PURE__ */ new Date();
      const U = (I = J(C.getUTCFullYear(), C.getUTCMonth())) != null ? I : 0;
      C.getUTCDate() > 15 && C.getUTCDate() < i && C.getUTCDate() < U && (a += 24 * 60 * 60 * 1e3 * ((U > i ? i : U) - C.getUTCDate()));
    }
  }
  return a;
}, $ = (n, e) => {
  var r, t, i, u, l, o, s, m, g, h, S, M, I, N, O, d, c, C, U, W, ee, G, ge, he, de, Ae, Se, ye, ve, De, Te, Me, Ce, be, we, ke, Oe, K;
  let a = R(n);
  for (const _ of Object.keys(e)) {
    if (a === null)
      return null;
    switch (_) {
      case "year":
      case "years":
        switch (e[_]) {
          case "StartOf":
            {
              const y = (r = A(a)) != null ? r : /* @__PURE__ */ new Date();
              a = (t = $(a, {
                month: y.getUTCMonth() * -1,
                months: "StartOf"
              })) != null ? t : 0;
            }
            break;
          case "EndOf":
            {
              const y = (i = A(a)) != null ? i : /* @__PURE__ */ new Date();
              a = (u = $(a, {
                month: 11 - y.getUTCMonth(),
                months: "EndOf"
              })) != null ? u : 0;
            }
            break;
          default:
            a = $e(a, f(e[_]) * 12);
            break;
        }
        break;
      case "month":
      case "months":
        switch (e[_]) {
          case "StartOf":
            {
              const y = (l = A(a)) != null ? l : /* @__PURE__ */ new Date();
              a = (o = $(a, {
                day: (y.getUTCDate() - 1) * -1,
                days: "StartOf"
              })) != null ? o : 0;
            }
            break;
          case "EndOf":
            {
              const y = (s = A(a)) != null ? s : /* @__PURE__ */ new Date();
              a = (g = $(a, {
                day: ((m = J(y.getUTCFullYear(), y.getUTCMonth())) != null ? m : 0) - y.getUTCDate(),
                days: "EndOf"
              })) != null ? g : 0;
            }
            break;
          default:
            a = $e(a, f(e[_]));
            break;
        }
        break;
      case "quarter":
      case "quarters":
        switch (e[_]) {
          case "StartOf":
            {
              const y = (h = A(a)) != null ? h : /* @__PURE__ */ new Date();
              a = (S = $(a, {
                month: y.getUTCMonth() % 3 * -1,
                months: "StartOf"
              })) != null ? S : 0;
            }
            break;
          case "EndOf":
            {
              const y = (M = A(a)) != null ? M : /* @__PURE__ */ new Date();
              a = (I = $(a, {
                month: 2 - y.getUTCMonth() % 3,
                months: "EndOf"
              })) != null ? I : 0;
            }
            break;
          default:
            a = $e(a, f(e[_]) * 3);
            break;
        }
        break;
      default:
        if (a === null)
          return null;
        switch (_) {
          case "week":
          case "weeks":
            switch (e[_]) {
              case "StartOf":
                {
                  const y = (N = A(a)) != null ? N : /* @__PURE__ */ new Date();
                  a = (O = $(a, {
                    day: y.getUTCDay() * -1,
                    days: "StartOf"
                  })) != null ? O : 0;
                }
                break;
              case "StartOfMon":
                {
                  const y = (d = A(a)) != null ? d : /* @__PURE__ */ new Date();
                  switch (y.getUTCDay()) {
                    case 0:
                      a = (c = $(a, {
                        day: -6,
                        days: "StartOf"
                      })) != null ? c : 0;
                      break;
                    case 1:
                      a = (C = $(a, {
                        days: "StartOf"
                      })) != null ? C : 0;
                      break;
                    default:
                      a = (U = $(a, {
                        day: (y.getUTCDay() - 1) * -1,
                        days: "StartOf"
                      })) != null ? U : 0;
                      break;
                  }
                }
                break;
              case "EndOf":
                {
                  const y = (W = A(a)) != null ? W : /* @__PURE__ */ new Date();
                  a = (ee = $(a, {
                    day: 6 - y.getUTCDay(),
                    days: "EndOf"
                  })) != null ? ee : 0;
                }
                break;
              default:
                a += f(e[_]) * 7 * 24 * 60 * 60 * 1e3;
                break;
            }
            break;
          case "day":
          case "days":
            switch (e[_]) {
              case "StartOf":
                {
                  const y = (G = A(a)) != null ? G : /* @__PURE__ */ new Date();
                  a = (he = $(a, {
                    // Added to support moving to the beginning of a day, but in a selected timezone
                    hour: y.getUTCHours() * -1 + (e.timezoneSource ? ((ge = Ie(e.timezoneSource)) != null ? ge : 0) / 60 : 0),
                    hours: "StartOf"
                  })) != null ? he : 0;
                }
                break;
              case "EndOf":
                {
                  const y = (de = A(a)) != null ? de : /* @__PURE__ */ new Date();
                  a = (Ae = $(a, {
                    hour: 23 - y.getUTCHours(),
                    hours: "EndOf"
                  })) != null ? Ae : 0;
                }
                break;
              default:
                a += f(e[_]) * 24 * 60 * 60 * 1e3;
                break;
            }
            break;
          case "hour":
          case "hours":
            switch (e[_]) {
              case "StartOf":
                {
                  const y = (Se = A(a)) != null ? Se : /* @__PURE__ */ new Date();
                  a = (ye = $(a, {
                    minute: y.getUTCMinutes() * -1,
                    minutes: "StartOf"
                  })) != null ? ye : 0;
                }
                break;
              case "EndOf":
                {
                  const y = (ve = A(a)) != null ? ve : /* @__PURE__ */ new Date();
                  a = (De = $(a, {
                    minute: 59 - y.getUTCMinutes(),
                    minutes: "EndOf"
                  })) != null ? De : 0;
                }
                break;
              default:
                a += f(e[_]) * 60 * 60 * 1e3;
                break;
            }
            break;
          case "minute":
          case "minutes":
            switch (e[_]) {
              case "StartOf":
                {
                  const y = (Te = A(a)) != null ? Te : /* @__PURE__ */ new Date();
                  a = (Me = $(a, {
                    second: y.getUTCSeconds() * -1,
                    seconds: "StartOf"
                  })) != null ? Me : 0;
                }
                break;
              case "EndOf":
                {
                  const y = (Ce = A(a)) != null ? Ce : /* @__PURE__ */ new Date();
                  a = (be = $(a, {
                    second: 59 - y.getUTCSeconds(),
                    seconds: "EndOf"
                  })) != null ? be : 0;
                }
                break;
              default:
                a += f(e[_]) * 60 * 1e3;
                break;
            }
            break;
          case "second":
          case "seconds":
            switch (e[_]) {
              case "StartOf":
                {
                  const y = (we = A(a)) != null ? we : /* @__PURE__ */ new Date();
                  a = (ke = $(a, {
                    millisecond: y.getUTCMilliseconds() * -1
                  })) != null ? ke : 0;
                }
                break;
              case "EndOf":
                {
                  const y = (Oe = A(a)) != null ? Oe : /* @__PURE__ */ new Date();
                  a = (K = $(a, {
                    millisecond: 999 - y.getUTCMilliseconds()
                  })) != null ? K : 0;
                }
                break;
              default:
                a += f(e[_]) * 1e3;
                break;
            }
            break;
          case "millisecond":
          case "milliseconds":
            a += f(e[_]);
            break;
        }
        break;
    }
  }
  return a;
}, ya = (n, e) => {
  const a = A(n != null ? n : "now", e);
  if (!a)
    return null;
  const r = new Date(a.valueOf()), t = (a.getDay() + 6) % 7;
  r.setDate(r.getDate() - t + 3);
  const i = r.valueOf();
  r.setMonth(0, 1), r.getDay() !== 4 && r.setMonth(0, 1 + (4 - r.getDay() + 7) % 7);
  const u = 1 + Math.ceil((i - r.valueOf()) / 6048e5), l = a;
  return l.setDate(l.getDate() + 3 - (l.getDay() + 6) % 7), { year: l.getFullYear(), week: u };
}, Q = (n, e) => {
  var a;
  return (a = ya(n, e)) != null ? a : { year: (/* @__PURE__ */ new Date()).getFullYear(), week: 1 };
};
const ie = (n, e) => {
  var a, r, t;
  if (!n)
    return null;
  try {
    const i = !n || typeof n == "object" || typeof n == "number" || ["now", "today"].includes(n) ? (r = me("Date", n, (a = e == null ? void 0 : e.timezoneDisplay) != null ? a : fa())) != null ? r : "" : (n != null ? n : "").substring(0, 10);
    if (!n || !i)
      return null;
    if (e != null && e.fromFormat) {
      if (i.length && i.length === e.fromFormat.length) {
        const l = e.fromFormat.indexOf("Y"), o = e.fromFormat.lastIndexOf("Y"), s = e.fromFormat.indexOf("M"), m = e.fromFormat.lastIndexOf("M"), g = e.fromFormat.indexOf("D"), h = e.fromFormat.lastIndexOf("D"), S = i.slice(l, o + 1), M = i.slice(s, m + 1), I = i.slice(g, h + 1);
        if (f(S) && f(M) && f(S))
          return ie(
            `${S.padStart(4, "20")}-${M.padStart(2, "0")}-${I.padStart(2, "0")}`,
            qe(e, "fromFormat")
          );
      }
      return null;
    }
    let u = new Date(i);
    return u instanceof Date && isFinite(u) ? (e && (u = (t = A(u, e)) != null ? t : u, Object.values(e).includes("EndOf") && u.setUTCHours(10)), me(e != null && e.formatLocale ? "Local" : "Date", u, "UTC")) : null;
  } catch (i) {
    return null;
  }
}, b = (n, e) => {
  var a, r, t;
  return (t = (r = ie(n, e)) != null ? r : me("Date", /* @__PURE__ */ new Date(), (a = void 0) != null ? a : "UTC")) != null ? t : (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}, X = (n, e) => {
  var a, r, t;
  if ((!n || typeof n == "string" && !Cn(n)) && n !== "now" && n !== "today")
    return null;
  try {
    let i = ce(
      e != null && e.formatLocale ? te : "HH:mm:ss",
      p(n, e),
      (a = e == null ? void 0 : e.timezoneSource) != null ? a : void 0
    );
    if (i)
      return i;
    let u = (n != null ? n : "").toString().toLowerCase().trim(), l = 0;
    u.endsWith("am") && (u = u.substring(0, u.length - 2).trim()), u.endsWith("a") && (u = u.substring(0, u.length - 1).trim()), u.endsWith("pm") && (u = u.substring(0, u.length - 2).trim(), l += 12), u.endsWith("p") && (u = u.substring(0, u.length - 1).trim(), l += 12), u.substring(1, 2) === ":" && (u = `0${u}`), u = b("now") + "T" + u;
    let o = p(u, e);
    if (o) {
      let s = ce(
        e != null && e.formatLocale ? te : "HH:mm:ss",
        o + l * 60 * 60 * 1e3,
        (r = e == null ? void 0 : e.timezoneSource) != null ? r : "UTC",
        (t = e == null ? void 0 : e.timezoneSource) != null ? t : "UTC"
      );
      if (s)
        return s;
    }
  } catch (i) {
  }
  return null;
}, kn = () => (/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "America/New_York" });
const T = function(n, e, a) {
  if (!a)
    return "";
  if (Array.isArray(n)) {
    let r = a;
    for (const t of n)
      r = T(t, e, r);
    return r;
  }
  return a.replace(new RegExp(n.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), e);
};
function Na(n) {
  const e = f(n, void 0, true);
  return e !== null && !isNaN(e);
}
function xt(n) {
  return Na(n) && f(n, 0) === f(n, 8);
}
const f = (n, e, a) => {
  if (typeof n == "number")
    return e !== void 0 ? Ze(n, e) : n;
  if (!n)
    return 0;
  if (e === void 0) {
    const t = +n;
    if (!Number.isNaN(t))
      return t;
  }
  let r = n.toString();
  return r = T("$", "", r), r = T('"', "", r), r = T("'", "", r), r = T(",", "", r), r = T("%", "", r), r.trim().length === 0 || isNaN(r) ? a ? NaN : 0 : e !== void 0 ? Ze(parseFloat(r), e) : parseFloat(r);
};
const Ia = (...n) => fe(n).reduce(
  (e, a) => e === null || a > e ? a : e,
  null
), an = (...n) => {
  var e;
  return (e = Ia(...n)) != null ? e : 0;
}, fe = (...n) => {
  let e = [];
  for (const a of n) {
    const r = H(a);
    for (const t of r) {
      const i = H(t);
      for (const u of i) {
        const l = E(u);
        l !== null && (e = [...e, l]);
      }
    }
  }
  return e;
};
const E = (n, e) => {
  if (n == null || n === "")
    return null;
  let a = f(n, e, true);
  return isNaN(a) ? null : a;
}, Ve = (n) => {
  if (!n)
    return null;
  if (typeof n == "object")
    return n;
  let e = null;
  try {
    e = JSON.parse(n);
  } catch (a) {
    return null;
  }
  return e;
};
const x = (n, e) => {
  var t, i;
  if (!n)
    return false;
  if (n === true)
    return n;
  const a = E(n);
  if (a !== null)
    return a > 0;
  let r = n.toString().toLowerCase().trim();
  return !((t = void 0) != null ? t : []).some((u) => u.toString().toLowerCase().trim() === r) && ["true", "active", "on", "yes", "y", "t", ...(i = void 0) != null ? i : []].some(
    (u) => u.toString().toLowerCase().trim() === r
  );
}, Ze = (n, e = 0, a = "round") => a === "round" ? +Math.round((f(n) + Number.EPSILON) * ne(10, e)) / ne(10, e) : a === "down" ? +Math.floor((f(n) + Number.EPSILON) * ne(10, e)) / ne(10, e) : +Math.ceil((f(n) + Number.EPSILON) * ne(10, e)) / ne(10, e), H = (n) => n == null ? [] : Array.isArray(n) ? n : [n];
function qe(n, ...e) {
  let a = D({}, n);
  for (let r of e)
    delete a[r];
  return a;
}
function Ai(n) {
  let e = D({}, n);
  for (let a in n)
    a in n && e[a] === void 0 && delete e[a];
  return e;
}
function Si(n, ...e) {
  let a = {};
  for (let r of e)
    r in n && (a[r] = n[r]);
  return a;
}
function Di(n, e, a = false) {
  if (!e || false)
    return "";
  const r = H(n);
  let t = e;
  do
    for (const i of r)
      t.endsWith(i) && (t = t.substring(0, t.length - i.length));
  while (a && r.some((i) => t.endsWith(i)));
  return t;
}
function Ti(n, ...e) {
  if (n || e.length === 0)
    return n;
  for (const a of e)
    if (a)
      return a;
  return e[e.length - 1];
}
const Xi = (n, e, a = []) => {
  let r = {};
  for (const t of Object.keys(n))
    !a.includes(t) && e[t] !== void 0 && (r[t] = n[t]);
  return r;
};
const dn = (n, e, a) => {
  if (n) {
    const r = n.indexOf(e);
    if (r >= 0) {
      let t = 0;
      for (let i = r + 1; i < n.length; i++)
        if (n.charAt(i) === e)
          t++;
        else if (n.charAt(i) === a)
          if (t)
            t--;
          else
            return [r, i];
    }
  }
  return null;
};
function nu(n, e, a) {
  if (!n)
    return [];
  let r = n;
  const t = [];
  let i = dn(r, e, a);
  for (; i; )
    t.push(r.substring(i[0] + 1, i[1])), r = r.substring(i[1] + 1), i = dn(r, e, a);
  return t;
}
var Sn;
((n) => {
  n.Header = (r = "calendar") => ({
    "Content-Type": "text/Calendar",
    "Content-Disposition": `inline; filename=${r}.ics`
  }), n.VCALENDAROpen_Text = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
`, n.VCALENDARClose_Text = `END:VCALENDAR
`;
  const e = (r, t) => {
    var i;
    return r ? `TZID=${"America/New_York"}:${(i = Aa(p(r))) != null ? i : ""}` : "";
  }, a = (r) => T(`\r
`, "\\n", T(`
`, "\\n", T("\r", "\\n", T(",", "\\,", T(";", "\\;", T("\\", "\\\\", r))))));
  n.VEVENT_Text = (r) => {
    var i, u;
    let t = "";
    return t += `BEGIN:VEVENT
`, t += `CLASS:PUBLIC
`, t += "CREATED;" + e((i = r.dateTimeCreated) != null ? i : (/* @__PURE__ */ new Date()).toISOString()) + `
`, t += "DESCRIPTION:" + a(r.description) + `
`, t += "DTSTART;" + e(r.dateTimeStart) + `
`, r.durationMinutes ? t += "DURATION:PT" + r.durationMinutes + `M
` : r.dateTimeEnd && (t += "DTEND;" + e(r.dateTimeEnd) + `
`), t += "DTSTAMP;" + e((/* @__PURE__ */ new Date()).toISOString()) + `
`, r.organizerName && r.organizerEmail && (t += `ORGANIZER;CN=${r.organizerName}:MAILTO:${r.organizerEmail}
`), t += "LAST-MODIFIED;" + e((u = r.dateTimeModified) != null ? u : (/* @__PURE__ */ new Date()).toISOString()) + `
`, r.location && (r.location_altrep ? t += `LOCATION;ALTREP="${a(r.location_altrep)}":` + a(r.location) + `
` : t += "LOCATION:" + a(r.location) + `
`), r.priority && (t += `PRIORITY:${r.priority}
`), t += `SEQUENCE:0
`, t += "SUMMARY:" + a(r.subject) + `
`, t += `TRANSP:OPAQUE
`, t += "UID:" + r.UID + `
`, r.alarmTriggerMinutes !== void 0 && (t += `BEGIN:VALARM
`, t += `TRIGGER:-PT${r.alarmTriggerMinutes}M
`, t += `ACTION:DISPLAY
`, t += `DESCRIPTION:Reminder
`, t += `END:VALARM
`), t += `END:VEVENT
`, t;
  }, n.ICS_Text = (r) => n.VCALENDAROpen_Text + (0, n.VEVENT_Text)(r) + n.VCALENDARClose_Text;
})(Sn || (Sn = {}));
const Ge = (n, e) => {
  var a, r, t, i, u, l, o, s, m, g;
  if (e.nullIfFalsey && !n || n === null || n === void 0)
    return e.nullable || e.nullIfFalsey ? null : e.type === "date" ? b((a = e.default) != null ? a : "now") : e.type === "datetime" ? Y((r = e.default) != null ? r : "now") : e.type === "time" ? X((t = e.default) != null ? t : "now") : e.type === "number" ? f(e.default) : e.type === "boolean" ? x((i = e.default) != null ? i : true) : e.type === "object" ? typeof e.default == "string" ? (u = Ve(e.default)) != null ? u : {} : (l = e.default) != null ? l : {} : ((o = e.default) != null ? o : "").toString();
  if (e.type === "boolean") {
    if (typeof n != "boolean")
      return x(n);
  } else if (e.type === "number") {
    if (typeof n != "number")
      return e.nullable ? E(n) : f(n);
  } else {
    if (e.type === "date")
      return e.nullable ? ie(n) : b(n);
    if (e.type === "datetime")
      return e.nullable ? Y(n) : (s = Y(n)) != null ? s : ma();
    if (e.type === "time")
      return e.nullable ? X(n) : (m = X(n)) != null ? m : "00:00";
    if (e.type === "object") {
      if (typeof n == "string")
        return (g = Ve(n)) != null ? g : e.nullable ? null : {};
      if (typeof n != "object")
        return e.nullable ? null : {};
    } else if (typeof n != "string")
      return n ? n.toString() : "";
  }
  return n;
}, Ke = (n, e) => {
  let a = n;
  if (e.length && n)
    switch (typeof n) {
      case "string":
        a = n.substring(0, e.length);
        break;
      case "number":
        const r = n.toString();
        if (!r.includes(".") && n.toString().length > e.length)
          throw new Error(
            `Value ${n} longer than ${v(e.length)}, is ${r.length}`
          );
        if (r.toString().length > e.length + 1) {
          const t = r.split(".")[0];
          if (t.toString().length > e.length)
            throw new Error(
              `Whole value ${n} longer than ${v(e.length)}, is ${r.length}`
            );
          if (a = f(n, e.length - t.length), a.toString().length > e.length + 1)
            throw new Error(
              `Value ${a} longer than ${v(e.length)}, is ${a.toString().length}`
            );
        }
    }
  if (!e.nullable || n) {
    if (e.values && !e.values.includes(n))
      return null;
    if (e.minValue !== void 0 && e.minValue > n)
      return e.minValue;
    if (e.maxValue !== void 0 && e.maxValue < n)
      return e.maxValue;
  }
  return a;
}, Va = (n, e) => {
  if (!n)
    return n;
  const a = D({}, n);
  for (const r of Object.keys(n)) {
    const t = e[r];
    t ? (t.isArray ? !a[r] && t.nullable ? a[r] = null : (a[r] = H(a[r]).filter(
      (i) => t.type !== "number" || i !== "" && !F(i)
    ).map((i) => Ge(i, t)).filter(
      (i) => t.arrayAllowFalsey || (t.type === "number" ? !F(i) : !!i)
    ).map((i) => Ke(i, t)).filter(
      (i) => t.arrayAllowFalsey || (t.type === "number" ? !F(i) : !!i)
    ), t.isArray && t.type === "object" && a[r].length === 1 && Array.isArray(a[r].at(0)) && (a[r] = a[r].at(0))) : a[r] = Ke(Ge(a[r], t), t), !t.nullIfFalsey && t.nullable && (t.type === "number" ? F(a[r]) || a[r] === "" : !a[r]) && typeof a[r] != "boolean" && (a[r] = null), t.nullIfFalsey && !a[r] && (a[r] = null)) : delete a[r];
  }
  for (const r of Object.keys(e))
    if (!(r in a)) {
      const t = e[r];
      t && (a[r] = Ke(Ge(a[r], t), t), t.isArray && !Array.isArray(a[r]) && (a[r] = H(a.key)));
    }
  return a;
}, su = (n, e) => {
  var r, t, i, u;
  let a = {};
  if (e != null && e.default)
    for (const l of Object.keys(e.default).filter((o) => {
      var s, m;
      return (s = e.includeColumns) != null && s.includes(o) ? true : !e.includeColumns && !((m = e.excludeColumns) != null && m.includes(o));
    })) {
      let o = Array.isArray(e.default[l]) || (r = e.arrayFormDataItems) != null && r.includes(l) ? (i = (t = n.getAll(l)) != null ? t : e == null ? void 0 : e.default[l]) != null ? i : null : n.get(l);
      o !== void 0 && typeof e.default[l] == "boolean" && (o = x(o)), o !== void 0 && typeof e.default[l] == "number" && (o = f(o)), a[l] = (u = o != null ? o : e == null ? void 0 : e.default[l]) != null ? u : null;
    }
  else
    n.forEach((l, o) => {
      const s = n.getAll(o);
      Array.isArray(s) && s.length > 1 ? a[o] = s : a[o] = l;
    });
  return e != null && e.constraint && (a = Va(a, e.constraint)), a;
};
const Ee = (n) => typeof n == "number" ? n : n.id;
var yn;
((n) => {
  n.IsSelected = (e, a) => !a.includes(Ee(e)), n.SelectedIDs = (e, a) => e.reduce(
    (r, t) => {
      const i = Ee(t);
      return a.find((u) => u === i) ? r : [...r, i];
    },
    []
  ), n.ToggleUnSelectedID = (e, a) => a.includes(e) ? a.filter((r) => r !== e) : [...a, e], n.SelectIDs = (e, a) => a.filter((r) => !e.find((t) => r === Ee(t))), n.UnSelectIDs = (e, a) => [...a, ...e.map((r) => Ee(r))], n.SelectedBetween = (e, a, r, t) => {
    const i = e.map((s) => Ee(s)), u = !(0, n.IsSelected)(r, t);
    let l = [], o = false;
    for (const s of i)
      if (s === a || s === r) {
        if (l.push(s), o)
          break;
        o = true;
      } else
        o && l.push(s);
    return u ? (0, n.SelectIDs)(l, t) : (0, n.UnSelectIDs)(l, t);
  };
})(yn || (yn = {}));
const PaginatorResponseFromRequestCount = (paginatorRequest, rowCount) => PaginatorReturnRowCount(PaginatorInitializeResponseFromRequest(paginatorRequest), f(rowCount));
const PaginatorInitializeResponseFromRequest = (paginatorRequest) => ({
  page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
  pageCount: 1,
  rowCount: 0,
  countPerPage: paginatorRequest.countPerPage,
  currentOffset: 1,
  rows: []
});
const PaginatorApplyRowCount = (paginatorResponse, rowCount) => {
  console.warn('"PaginatorApplyRowCount" will deprecate for "PaginatorReturnRowCount"');
  paginatorResponse.rowCount = f(rowCount);
  if (+rowCount > 0) {
    paginatorResponse.pageCount = Math.floor((f(rowCount) + f(paginatorResponse.countPerPage - 1)) / f(paginatorResponse.countPerPage));
    if (f(paginatorResponse.page) < 1) paginatorResponse.page = 1;
    if (f(paginatorResponse.page) > f(paginatorResponse.pageCount)) paginatorResponse.page = f(paginatorResponse.pageCount);
    paginatorResponse.currentOffset = (+paginatorResponse.page - 1) * +paginatorResponse.countPerPage;
  } else {
    paginatorResponse.pageCount = 0;
    paginatorResponse.currentOffset = 0;
    paginatorResponse.page = 1;
  }
};
const PaginatorReturnRowCount = (paginatorResponse, rowCount) => {
  let response = { ...paginatorResponse };
  response.rowCount = f(rowCount);
  response.page = f(response.page);
  if (response.rowCount > 0) {
    response.pageCount = Math.floor((f(rowCount) + (f(response.countPerPage) - 1)) / f(response.countPerPage));
    if (response.page < 1) response.page = 1;
    if (response.page > response.pageCount) response.page = response.pageCount;
    response.currentOffset = (response.page - 1) * response.countPerPage;
  } else {
    response.pageCount = 0;
    response.currentOffset = 0;
    response.page = 1;
  }
  return response;
};
class PGEnum {
  constructor(instanceData) {
    this.enumName = "";
    this.values = [];
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
  get columnName() {
    return hr(this.enumName);
  }
  get typeName() {
    return this.enumName;
  }
  static TypeName(columnName) {
    return Sr(columnName);
  }
  ddlRemove() {
    return `DROP TYPE IF EXISTS ${this.columnName} CASCADE `;
  }
  ddlDefinition() {
    return `CREATE TYPE ${this.columnName} AS ENUM ('${this.values.join("','")}')`;
  }
}
const _PGColumn = class _PGColumn {
  constructor(instanceData) {
    this.column_name = "";
    this.ordinal_position = 0;
    this.column_default = null;
    this.is_nullable = "YES";
    this.udt_name = "";
    this.character_maximum_length = null;
    this.character_octet_length = null;
    this.numeric_precision = null;
    this.numeric_scale = null;
    this.datetime_precision = null;
    this.is_identity = "NO";
    this.is_self_referencing = "NO";
    this.identity_generation = null;
    this.array_dimensions = [];
    this.check = null;
    this.checkStringValues = [];
    this.generatedAlwaysAs = null;
    this.column_comment = "";
    this.isAutoIncrement = true;
    this.jsType = () => {
      if (typeof this.udt_name !== "string") {
        return this.udt_name.enumName;
      } else if (this.jsonType()) {
        return "any";
      } else if (this.booleanType()) {
        return "boolean";
      } else if (this.integerFloatType()) {
        return "number";
      } else if (this.udt_name === _PGColumn.TYPE_BYTEA) {
        return "ArrayBuffer";
      } else if (this.udt_name === _PGColumn.TYPE_POINT) {
        return "[number, number]";
      } else if (this.udt_name.startsWith("e_")) {
        return PGEnum.TypeName(this.udt_name);
      } else {
        return "string";
      }
    };
    this.isArray = () => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!!H(this.array_dimensions)[0] || !!this.array_dimensions.length || ((_c = (_b = (_a = this.column_default) != null ? _a : "") == null ? void 0 : _b.toString()) == null ? void 0 : _c.includes("{}")) && !this.jsonType() || ((_f = (_e = (_d = this.column_default) != null ? _d : "") == null ? void 0 : _e.toString()) == null ? void 0 : _f.includes("[]")))
        return true;
      if (!this.jsonType()) return false;
      const regex = /\{.*\[.*\].*\}/;
      return regex.test((_g = this.column_comment) != null ? _g : "");
    };
    this.isNullable = () => x(this.is_nullable);
    this.enumType = () => {
      return typeof this.udt_name !== "string";
    };
    this.integerType = () => {
      return typeof this.udt_name === "string" && (this.udt_name.toLowerCase().startsWith("int") || [_PGColumn.TYPE_SMALLINT, _PGColumn.TYPE_INTEGER, _PGColumn.TYPE_BIGINT].includes(this.udt_name.toLowerCase()));
    };
    this.floatType = () => {
      return typeof this.udt_name === "string" && [_PGColumn.TYPE_NUMERIC, _PGColumn.TYPE_FLOAT8].includes(this.udt_name.toLowerCase());
    };
    this.integerFloatType = () => {
      return this.integerType() || this.floatType();
    };
    this.booleanType = () => {
      return typeof this.udt_name === "string" && [_PGColumn.TYPE_BOOLEAN].includes(this.udt_name.toLowerCase());
    };
    this.jsonType = () => {
      return typeof this.udt_name === "string" && [_PGColumn.TYPE_JSON, _PGColumn.TYPE_JSONB].includes(this.udt_name.toLowerCase());
    };
    this.generalStringType = () => {
      return typeof this.udt_name !== "string" || [_PGColumn.TYPE_VARCHAR].includes(this.udt_name.toLowerCase());
    };
    this.dateType = () => {
      return typeof this.udt_name === "string" && [
        _PGColumn.TYPE_DATE,
        _PGColumn.TYPE_TIME,
        _PGColumn.TYPE_TIMETZ,
        _PGColumn.TYPE_TIMESTAMP,
        _PGColumn.TYPE_TIMESTAMPTZ
      ].includes(this.udt_name.toLowerCase());
    };
    this.dateOnlyType = () => {
      return typeof this.udt_name === "string" && [
        _PGColumn.TYPE_DATE
      ].includes(this.udt_name.toLowerCase());
    };
    this.timeOnlyType = () => {
      return typeof this.udt_name === "string" && [
        _PGColumn.TYPE_TIME,
        _PGColumn.TYPE_TIMETZ
      ].includes(this.udt_name.toLowerCase());
    };
    this.dateTimeOnlyType = () => {
      return typeof this.udt_name === "string" && [
        _PGColumn.TYPE_TIMESTAMP,
        _PGColumn.TYPE_TIMESTAMPTZ
      ].includes(this.udt_name.toLowerCase());
    };
    this.blobType = () => {
      return typeof this.udt_name === "string" && [_PGColumn.TYPE_TEXT].includes(this.udt_name.toLowerCase());
    };
    this.otherType = () => {
      return !this.integerFloatType && !this.booleanType && !this.dateType() && !this.generalStringType() && !this.blobType();
    };
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key) && typeof instanceData !== "function") {
        this[key] = instanceData[key];
      }
    }
  }
  clean() {
  }
  ddlDefinition() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let ddl = '"' + this.column_name + '" ';
    ddl += typeof this.udt_name === "string" ? this.udt_name : this.udt_name.columnName;
    if (this.array_dimensions.length > 0) {
      ddl += `[${this.array_dimensions.map((array_dimension) => !!array_dimension ? array_dimension.toString() : "").join("],[")}] `;
    } else {
      if (this.udt_name !== _PGColumn.TYPE_POINT) {
        if (this.floatType() && this.udt_name !== _PGColumn.TYPE_FLOAT8) {
          ddl += "(" + this.numeric_precision + "," + ((_a = this.numeric_scale) != null ? _a : 0) + ") ";
        } else if (this.dateType()) {
          if (!!this.datetime_precision) {
            ddl += "(" + this.datetime_precision + ") ";
          } else {
            ddl += " ";
          }
        } else if (this.generalStringType()) {
          if (!this.blobType() && typeof this.udt_name === "string") {
            ddl += "(" + ((_b = this.character_maximum_length) != null ? _b : 255) + ") ";
          } else {
            ddl += " ";
          }
        } else {
          ddl += " ";
        }
      } else {
        ddl += " ";
      }
    }
    if (!x(this.is_nullable)) {
      ddl += "NOT NULL ";
    }
    if (!!this.generatedAlwaysAs) {
      ddl += `GENERATED ALWAYS AS (${_PGColumn.CleanComment(this.generatedAlwaysAs)}) STORED `;
    } else {
      if (typeof this.column_default === "string" && this.column_default.toLowerCase().includes("null")) {
        this.column_default = null;
      }
      if (this.column_default !== void 0 && this.column_default !== null || this.is_identity || this.isAutoIncrement) {
        if (!(this.dateType() && (!this.column_default || ((_c = this.column_default) != null ? _c : "").toString().toUpperCase().includes("NULL")))) {
          if (this.isArray()) {
            if (x(this.is_nullable)) {
              ddl += `DEFAULT ${(_d = this.column_default) != null ? _d : "NULL"} `;
            } else {
              ddl += `DEFAULT ${(_f = this.column_default) != null ? _f : typeof this.udt_name === "string" ? "'{}'" : (_e = this.udt_name.defaultValue) != null ? _e : "'{}"} `;
            }
          } else {
            if (!this.blobType()) {
              if (x(this.is_identity)) {
                if (this.isAutoIncrement) {
                  if (!!this.identity_generation) {
                    ddl += `GENERATED ${this.identity_generation} AS IDENTITY `;
                  } else {
                    ddl += `GENERATED BY DEFAULT AS IDENTITY `;
                  }
                }
              } else if (this.booleanType()) {
                if (x(this.is_nullable) || this.column_default === null) {
                  ddl += `DEFAULT NULL `;
                } else {
                  ddl += `DEFAULT ${x(this.column_default) ? "true" : "false"} `;
                }
              } else if (!this.column_default && typeof this.udt_name !== "string" && !!this.udt_name.defaultValue) {
                ddl += `DEFAULT '${this.udt_name.defaultValue}' `;
              } else {
                if (!!this.column_default) {
                  if (this.integerFloatType() || this.dateType() || ((_g = this.column_default) != null ? _g : "").toString().includes("::") || ((_h = this.column_default) != null ? _h : "").toString().includes("()")) {
                    ddl += `DEFAULT ${this.column_default} `;
                  } else {
                    ddl += `DEFAULT '${this.column_default}' `;
                  }
                } else if (x(this.is_nullable)) {
                  ddl += `DEFAULT NULL `;
                } else {
                  if (this.integerFloatType()) {
                    ddl += `DEFAULT 0 `;
                  } else if (this.dateType()) {
                    ddl += `DEFAULT now() `;
                  } else {
                    ddl += `DEFAULT '' `;
                  }
                }
              }
            }
          }
        }
      }
      if (!!this.check) {
        ddl += `CHECK (${this.check}) `;
      } else if (this.checkStringValues.length > 0) {
        ddl += `CHECK (${x(this.is_nullable) ? this.column_name + " IS NULL OR " : ""}${this.column_name} IN ('${this.checkStringValues.join("', '")}')) `;
      }
    }
    return ddl.trim();
  }
  static CleanComment(comment) {
    if (!comment) {
      return comment;
    }
    return comment.replace(/[\n\r]/g, " ");
  }
};
_PGColumn.TYPE_BOOLEAN = "bool";
_PGColumn.TYPE_NUMERIC = "numeric";
_PGColumn.TYPE_FLOAT8 = "float8";
_PGColumn.TYPE_POINT = "point";
_PGColumn.TYPE_SMALLINT = "smallint";
_PGColumn.TYPE_INTEGER = "integer";
_PGColumn.TYPE_BIGINT = "bigint";
_PGColumn.TYPE_VARCHAR = "varchar";
_PGColumn.TYPE_TEXT = "text";
_PGColumn.TYPE_JSON = "json";
_PGColumn.TYPE_JSONB = "jsonb";
_PGColumn.TYPE_DATE = "date";
_PGColumn.TYPE_TIME = "time";
_PGColumn.TYPE_TIMETZ = "timetz";
_PGColumn.TYPE_TIMESTAMP = "timestamp";
_PGColumn.TYPE_TIMESTAMPTZ = "timestamptz";
_PGColumn.TYPE_BYTEA = "bytea";
_PGColumn.TYPE_UUID = "uuid";
_PGColumn.TYPES_ALL = [
  _PGColumn.TYPE_BOOLEAN,
  _PGColumn.TYPE_NUMERIC,
  _PGColumn.TYPE_FLOAT8,
  _PGColumn.TYPE_POINT,
  _PGColumn.TYPE_SMALLINT,
  _PGColumn.TYPE_INTEGER,
  _PGColumn.TYPE_BIGINT,
  _PGColumn.TYPE_VARCHAR,
  _PGColumn.TYPE_TEXT,
  _PGColumn.TYPE_JSON,
  _PGColumn.TYPE_JSONB,
  _PGColumn.TYPE_BYTEA,
  _PGColumn.TYPE_DATE,
  _PGColumn.TYPE_TIME,
  _PGColumn.TYPE_TIMETZ,
  _PGColumn.TYPE_TIMESTAMP,
  _PGColumn.TYPE_TIMESTAMPTZ,
  _PGColumn.TYPE_UUID
];
let PGColumn = _PGColumn;
class PGIndex {
  constructor(instanceData) {
    this.columns = [];
    this.whereCondition = null;
    this.isUnique = false;
    this.concurrently = false;
    this.using = "BTREE";
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
  name(pgTable) {
    return "idx_" + pgTable.name.substring(an(pgTable.name.length - 25, 0)) + "_" + this.columns.map(
      (column) => column.replace(" ASC", "").replace(" DESC", "").replace(" NULLS", "").replace(" FIRST", "").replace(" LAST", "").replace("(", "_").replace(")", "_").trim()
    ).map((column) => column.substring(an(column.length - 25, 0))).join("_");
  }
  ddlDefinition(pgTable) {
    let ddl = "CREATE ";
    if (this.isUnique) {
      ddl += "UNIQUE ";
    }
    ddl += "INDEX IF NOT EXISTS ";
    ddl += `"${this.name(pgTable)}" `;
    ddl += "ON ";
    ddl += `"${pgTable.name}" `;
    ddl += "USING btree ";
    ddl += "(" + this.columns.join(",") + ")";
    if (this.whereCondition) {
      ddl += " WHERE " + this.whereCondition;
    }
    ddl += ";";
    return ddl;
  }
}
class PGForeignKey {
  constructor(instanceData) {
    this.columnNames = [];
    this.primaryTable = "";
    this.primaryColumns = [];
    this.onDelete = "RESTRICT";
    this.onUpdate = "RESTRICT";
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
  fkName(pgTable) {
    return pgTable.name + "_" + this.columnNames.map((column) => column.substring(an(column.length - 25, 0))).join("_") + "_fkey";
  }
  ddlConstraintDefinition(pgTable) {
    return `
		DO $$
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${this.fkName(pgTable)}') THEN
				ALTER TABLE "${pgTable.name}"
					ADD CONSTRAINT "${this.fkName(pgTable)}"
					FOREIGN KEY ("${this.columnNames.join('","')}") REFERENCES "${this.primaryTable}"("${this.primaryColumns.join(
      '","'
    )}") DEFERRABLE INITIALLY DEFERRED;
			END IF;
		END;
		$$;`;
  }
}
const TS_EOL = "\n";
const initialFixedWidthMapOptions = {
  startPosition: 0
};
class PGTable {
  constructor(instanceData) {
    this.name = "";
    this.description = "";
    this.check = null;
    this.inherits = [];
    this.columns = [];
    this.indexes = [];
    this.foreignKeys = [];
    this.importWithTypes = false;
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        switch (key) {
          case "columns":
            for (const column of instanceData[key]) {
              this[key].push(new PGColumn(column));
            }
            break;
          case "indexes":
            for (const index of instanceData[key]) {
              this[key].push(new PGIndex(index));
            }
            break;
          case "foreignKeys":
            for (const foreignKey of instanceData[key]) {
              this[key].push(new PGForeignKey(foreignKey));
            }
            break;
          default:
            this[key] = instanceData[key];
            break;
        }
      }
    }
  }
  indexOfColumn(columnName) {
    return this.columns.findIndex((column) => column.column_name === columnName);
  }
  indexesOfForeignKeyByColumn(columnName) {
    let indexes = [];
    for (let i = 0; i < this.foreignKeys.length; i++) {
      if (this.foreignKeys[i].columnNames.includes(columnName)) {
        indexes.push(i);
      }
    }
    return indexes;
  }
  getForeignKeysByColumn(columnName) {
    let fks = [];
    const indexes = this.indexesOfForeignKeyByColumn(columnName);
    for (const index of indexes) {
      fks.push(this.foreignKeys[index]);
    }
    return fks;
  }
  removeForeignKeysByColumn(columnName) {
    this.foreignKeys = this.foreignKeys.filter((foreignKey) => !foreignKey.columnNames.includes(columnName));
  }
  renameForeignKeysByColumn(fromName, toName, pgTables) {
    const thisObject = this;
    this.foreignKeys.forEach((fk) => {
      if (fk.columnNames.includes(fromName)) {
        fk.columnNames = [...fk.columnNames.filter((cN) => cN !== fromName), toName];
      }
    });
    if (pgTables) {
      pgTables.filter((pgTable) => pgTable.name !== thisObject.name).forEach((pgTable) => {
        pgTable.foreignKeys.forEach((fk) => {
          if (fk.primaryTable === thisObject.name) {
            if (fk.primaryColumns.includes(fromName)) {
              fk.primaryColumns = [...fk.primaryColumns.filter((pC) => pC !== fromName), toName];
            }
          }
        });
      });
    }
  }
  removeIndexsByColumn(columnName) {
    this.indexes = this.indexes.filter((index) => !index.columns.includes(columnName));
  }
  renameIndexsByColumn(fromName, toName) {
    this.indexes.forEach((idx) => {
      if (idx.columns.includes(fromName)) {
        idx.columns = [...idx.columns.filter((cN) => cN !== fromName), toName];
      }
    });
  }
  addForeignKey(pgForeignKey) {
    this.foreignKeys.push(pgForeignKey);
  }
  getColumn(columnName) {
    var _a;
    return (_a = this.columns.find((column) => column.column_name === columnName)) != null ? _a : null;
  }
  removeColumn(columnName) {
    const column = this.getColumn(columnName);
    if (!!column) {
      this.removeForeignKeysByColumn(columnName);
      this.removeIndexsByColumn(columnName);
      this.columns = this.columns.filter((column2) => column2.column_name !== columnName);
      this.reOrderColumns();
    }
  }
  renameColumn(fromName, toName, pgTables) {
    const column = this.getColumn(fromName);
    if (!!column) {
      column.column_name = toName;
      this.renameForeignKeysByColumn(fromName, toName, pgTables);
      this.renameIndexsByColumn(fromName, toName);
    }
  }
  addColumn(pgColumn) {
    const pgColumnToAdd = new PGColumn(pgColumn);
    if (!pgColumnToAdd.ordinal_position) {
      pgColumnToAdd.ordinal_position = 999999;
    }
    this.columns = this.columns.filter((column) => column.column_name !== pgColumnToAdd.column_name);
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].ordinal_position >= pgColumnToAdd.ordinal_position) {
        this.columns[i].ordinal_position++;
      }
    }
    this.columns.push(pgColumnToAdd);
    this.reOrderColumns();
  }
  reOrderColumns() {
    this.columns = this.columns.sort((a, b2) => a.ordinal_position - b2.ordinal_position);
    let position = 0;
    for (let i = 0; i < this.columns.length; i++) {
      position++;
      this.columns[i].ordinal_position = position;
    }
  }
  addIndex(pgIndex) {
    this.indexes.push(pgIndex);
  }
  tableHeaderText(forTableText, modifyStatement = "DO NOT MODIFY") {
    let text = "/**" + TS_EOL;
    text += " * Automatically generated: " + it("now") + TS_EOL;
    text += " * © " + (/* @__PURE__ */ new Date()).getFullYear() + ", Solid Basis Ventures, LLC." + TS_EOL;
    text += ` * ${modifyStatement}` + TS_EOL;
    text += " *" + TS_EOL;
    text += " * " + forTableText + ": " + this.name + TS_EOL;
    if (!!this.description) {
      text += " *" + TS_EOL;
      text += " * " + PGTable.CleanComment(this.description) + TS_EOL;
    }
    text += " */" + TS_EOL;
    text += TS_EOL;
    return text;
  }
  /**
   * Generates type definitions for a table.
   *
   * @param options
   */
  tsText(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    let text = this.tableHeaderText("Table Manager for");
    function AddSpaceImport(importObject) {
      return !(options == null ? void 0 : options.spaceInImports) ? H(importObject).filter((iO) => !!iO).join(", ") : " " + H(importObject).filter((iO) => !!iO).join(", ") + " ";
    }
    function AddQuote(item) {
      return !(options == null ? void 0 : options.singleQuote) ? `"${H(item).join('", "')}"` : `'${H(item).join("', '")}'`;
    }
    if (options == null ? void 0 : options.includeConstraint) {
      text += `import type {${AddSpaceImport("TObjectConstraint")}} from ${AddQuote(`@empowerfresh/intelliwake`)}${TS_EOL}`;
    }
    if (this.inherits.length > 0) {
      for (const inherit of this.inherits) {
        if (this.importWithTypes) {
          text += `import type {${AddSpaceImport(`I${inherit}`)}} from ${AddQuote(`./I${inherit}`)}${TS_EOL}`;
          text += `import {${AddSpaceImport(`initial_${inherit}`)}} from ${AddQuote(`./I${inherit}`)}${TS_EOL}`;
        } else {
          text += `import {${AddSpaceImport([`I${inherit}`, `initial_${inherit}`])}} from ${AddQuote(`./I${inherit}`)}${TS_EOL}`;
        }
      }
    }
    const enums = Array.from(
      new Set(
        [
          ...this.columns.map((column) => ({
            column_name: column.column_name,
            enum_name: typeof column.udt_name !== "string" ? column.udt_name.enumName : ""
          })),
          ...this.columns.map((column) => ({
            column_name: column.column_name,
            enum_name: typeof column.udt_name === "string" && column.udt_name.startsWith("e_") ? PGEnum.TypeName(column.udt_name) : ""
          })),
          ...this.columns.map((column) => {
            var _a2, _b2, _c2, _d2, _e2, _f2;
            const regExp = /{([^}]*)}/;
            const results = regExp.exec(column.column_comment);
            if (!!results && !!results[1]) {
              const commaItems = results[1].split(",");
              for (const commaItem of commaItems) {
                const items = commaItem.split(":");
                if (((_a2 = items[0]) != null ? _a2 : "").toLowerCase().trim() === "enum") {
                  const enumName = (_c2 = (_b2 = items[1]) == null ? void 0 : _b2.split(".")[0]) == null ? void 0 : _c2.trim();
                  let enumDefault = (_f2 = (_e2 = Ti((_d2 = items[1]) == null ? void 0 : _d2.split(".")[1], items[2], column.column_default)) == null ? void 0 : _e2.toString()) == null ? void 0 : _f2.trim();
                  if (enumDefault == null ? void 0 : enumDefault.startsWith("'{}'")) {
                    enumDefault = "[]";
                  }
                  if (!enumName) {
                    throw new Error("Enum requested in comment, but not specified  - Format {Enum: ETest} for nullable or {Enum: ETest.FirstValue}");
                  }
                  if (!x(column.is_nullable) && !enumDefault && !column.isArray()) {
                    throw new Error(`Not Nullable Enum requested in comment, but no default value specified for ${this.name}.${column.column_name} - ${column.column_comment}`);
                  }
                  return {
                    column_name: column.column_name,
                    enum_name: enumName,
                    default_value: column.isArray() ? x(column.is_nullable) ? "null" : enumDefault != null ? enumDefault : "[]" : !enumDefault ? "null" : `${enumName}.${enumDefault}`
                  };
                }
              }
            }
            return { column_name: column.column_name, enum_name: "" };
          })
        ].filter((enumName) => !!enumName.enum_name)
      )
    );
    const interfaces = Array.from(
      new Set(
        [
          ...this.columns.map((column) => {
            var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
            const regExp = /{([^}]*)}/;
            const results = regExp.exec(column.column_comment);
            if (!!results && !!results[1]) {
              const commaItems = results[1].split(",");
              for (const commaItem of commaItems) {
                const items = commaItem.split(":");
                if (((_a2 = items[0]) != null ? _a2 : "").toLowerCase().trim() === "interface") {
                  const interfaceName = (_c2 = (_b2 = items[1]) == null ? void 0 : _b2.split(".")[0]) == null ? void 0 : _c2.trim();
                  let interfaceDefault = (_g2 = (_f2 = (_e2 = Ti((_d2 = items[1]) == null ? void 0 : _d2.split(".")[1], items[2], column.column_default)) == null ? void 0 : _e2.toString()) == null ? void 0 : _f2.trim()) != null ? _g2 : x(column.is_nullable) ? "null" : "{}";
                  if (!interfaceName) {
                    throw new Error("Interface requested in comment, but not specified  - Format {Interface: ITest} for nullable or {Interface: ITest.initialValue}");
                  }
                  return {
                    column_name: column.column_name,
                    interface_name: interfaceName,
                    otherImportItem: interfaceDefault,
                    default_value: column.isArray() ? x(column.is_nullable) ? "null" : interfaceDefault != null ? interfaceDefault : "[]" : interfaceDefault
                  };
                }
              }
            }
            return { column_name: column.column_name, interface_name: "" };
          })
        ].filter((enumName) => !!enumName.interface_name)
      )
    );
    const types = this.columns.reduce((types2, column) => {
      var _a2, _b2, _c2;
      const regExp = /{([^}]*)}/;
      const results = regExp.exec(column.column_comment);
      if (!!results && !!results[1]) {
        const commaItems = results[1].split(",");
        for (const commaItem of commaItems) {
          const items = commaItem.split(":");
          if (((_a2 = items[0]) != null ? _a2 : "").toLowerCase().trim() === "type") {
            const typeName = (_c2 = (_b2 = items[1]) == null ? void 0 : _b2.split(".")[0]) == null ? void 0 : _c2.trim();
            if (!typeName) {
              throw new Error("Type requested in comment, but not specified  - Format {type: TTest}");
            }
            return [...types2, {
              column_name: column.column_name,
              type_name: typeName
            }];
          }
        }
      }
      return types2;
    }, []);
    enums.map((enumItem) => enumItem.enum_name).reduce(
      (results, enumItem) => {
        return results.some((res) => res === enumItem) ? results : [...results, T("[]", "", enumItem)];
      },
      types.reduce((results, typ) => {
        var _a2;
        const possibleEnum = T("]", "", (_a2 = typ.type_name.split("[")[1]) != null ? _a2 : "");
        if (possibleEnum.startsWith("E")) {
          if (!results.some((res) => res === possibleEnum)) {
            return [...results, possibleEnum];
          }
        }
        return results;
      }, [])
    ).reduce((results, enumItem) => results.some((result) => result === enumItem) ? results : [...results, enumItem], []).sort(le).forEach((enumItem) => {
      text += `import ${this.importWithTypes && !this.columns.some((column) => {
        var _a2, _b2, _c2, _d2;
        return T(" ", "", (_a2 = column.column_comment) != null ? _a2 : "").toLowerCase().includes(`{enum:${enumItem.toLowerCase()}`) && (T(" ", "", (_b2 = column.column_comment) != null ? _b2 : "").toLowerCase().includes(`{enum:${enumItem.toLowerCase()}.`) || !!column.column_default && !((_c2 = column.column_default) != null ? _c2 : "").toString().includes("{}") && ((_d2 = column.column_default) != null ? _d2 : "").toString().toLowerCase() !== "null");
      }) ? "type " : ""}{${AddSpaceImport(enumItem)}} from ${AddQuote(`../Enums/${enumItem}`)}${TS_EOL}`;
    });
    interfaces.reduce((results, interfaceItem) => results.some((result) => result.interface_name === interfaceItem.interface_name && (!!result.otherImportItem || !interfaceItem.otherImportItem)) ? results : [...results.filter((result) => result.interface_name !== interfaceItem.interface_name), interfaceItem], []).sort((a, b2) => le(a.interface_name, b2.interface_name)).forEach((interfaceItem) => {
      var _a2;
      text += `import ${this.importWithTypes ? "type " : ""}{${AddSpaceImport([interfaceItem.interface_name, !interfaceItem.otherImportItem || ((_a2 = interfaceItem == null ? void 0 : interfaceItem.otherImportItem) == null ? void 0 : _a2.toLowerCase()) === "null" ? "" : `, ${interfaceItem.otherImportItem}`])}} from ${AddQuote(`../Interfaces/${interfaceItem.interface_name}`)}${TS_EOL}`;
    });
    types.reduce((results, typeItem) => {
      const newName = typeItem.type_name.split("[")[0];
      return !newName || results.some((result) => result.type_name === newName) ? results : [...results.filter((result) => result.type_name !== newName), { ...typeItem, type_name: newName }];
    }, []).sort((a, b2) => le(a.type_name, b2.type_name)).forEach((typeItem) => {
      text += `import ${this.importWithTypes ? "type " : ""}{${AddSpaceImport(typeItem.type_name)}} from ${AddQuote(`../Types/${typeItem.type_name}`)}${TS_EOL}`;
    });
    const enumReferences = enums.filter((enumItem) => {
      if (enums.filter((eFilter) => eFilter.enum_name === enumItem.enum_name).length !== 1) return false;
      if (!this.columns.some((col) => {
        var _a2, _b2, _c2, _d2;
        return ((_b2 = (_a2 = col.column_comment) == null ? void 0 : _a2.toLowerCase()) == null ? void 0 : _b2.includes("{type")) && ((_d2 = (_c2 = col.column_comment) == null ? void 0 : _c2.toLowerCase()) == null ? void 0 : _d2.includes(`[${enumItem.enum_name.toLowerCase()}]`));
      })) return false;
      return true;
    }).sort((a, b2) => le(a.enum_name, b2.enum_name));
    text += TS_EOL;
    if (this.description) {
      text += `/** ${this.description} */${TS_EOL}`;
    }
    text += `export interface I${this.name}`;
    if (enumReferences.length) {
      text += `<${enumReferences.map((er) => `T${er.enum_name} extends ${er.enum_name} = ${er.enum_name}`).join(", ")}>`;
    }
    if (this.inherits.length > 0) {
      text += ` extends I${this.inherits.join(", I")}`;
    }
    text += ` {` + TS_EOL;
    function getTSType(pgColumn, eReferences) {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
      let tsType = T("[]", "", (_f2 = (_e2 = (_c2 = (_a2 = enums.find((enumItem) => enumItem.column_name === pgColumn.column_name)) == null ? void 0 : _a2.enum_name) != null ? _c2 : (_b2 = interfaces.find((interfaceItem) => interfaceItem.column_name === pgColumn.column_name)) == null ? void 0 : _b2.interface_name) != null ? _e2 : (_d2 = types.find((typeItem) => typeItem.column_name === pgColumn.column_name)) == null ? void 0 : _d2.type_name) != null ? _f2 : pgColumn.jsType()).trim();
      if (eReferences == null ? void 0 : eReferences.length) {
        if (eReferences.some((er) => er.enum_name === tsType)) {
          tsType = `T${tsType}`;
        } else {
          const bracketValue = ((_g2 = nu(tsType, "[", "]")) != null ? _g2 : [])[0];
          if (bracketValue && eReferences.some((er) => er.enum_name === bracketValue)) {
            tsType = tsType.replace("[", "[T");
          }
        }
      }
      if (pgColumn.array_dimensions.length > 0) {
        tsType += `[${pgColumn.array_dimensions.map(() => "").join("],[")}]`;
      } else if (pgColumn.isArray()) {
        tsType += "[]";
      }
      if (x((_h2 = pgColumn.is_nullable) != null ? _h2 : "YES")) {
        tsType += " | null";
      }
      return tsType;
    }
    for (const pgColumn of this.columns) {
      if (!!PGTable.CleanComment(pgColumn.column_comment)) {
        text += `	/** `;
        text += `${PGTable.CleanComment(pgColumn.column_comment)} `;
        text += `*/${TS_EOL}`;
      }
      text += "	";
      text += pgColumn.column_name;
      text += ": ";
      text += getTSType(pgColumn, enumReferences);
      text += TS_EOL;
    }
    text += "}" + TS_EOL;
    text += TS_EOL;
    text += `export const initial_${this.name}: I${this.name} = {` + TS_EOL;
    let addComma = false;
    if (this.inherits.length > 0) {
      text += `	...initial_${this.inherits.join(`,${TS_EOL}	...initial_`)},${TS_EOL}`;
    }
    for (const pgColumn of this.columns) {
      if (addComma) {
        text += "," + TS_EOL;
      }
      text += "	";
      text += pgColumn.column_name;
      text += ": ";
      const itemDefault = (_c = (_a = enums.find((enumItem) => enumItem.column_name === pgColumn.column_name)) == null ? void 0 : _a.default_value) != null ? _c : (_b = interfaces.find((interfaceItem) => interfaceItem.column_name === pgColumn.column_name)) == null ? void 0 : _b.default_value;
      if (!!itemDefault) {
        if (itemDefault.endsWith(".") && x(pgColumn.is_nullable) && !pgColumn.column_default) {
          text += "null";
        } else {
          text += itemDefault;
        }
      } else if (pgColumn.isArray()) {
        if (x(pgColumn.is_nullable)) {
          text += "null";
        } else {
          text += `[${pgColumn.array_dimensions.map(() => "").join("],[")}]`;
        }
      } else {
        if (!pgColumn.blobType()) {
          if (x(pgColumn.is_identity) && pgColumn.isAutoIncrement) {
            text += "0";
          } else if (pgColumn.booleanType()) {
            if (x(pgColumn.is_nullable)) {
              text += "null";
            } else {
              text += x(pgColumn.column_default) ? "true" : "false";
            }
          } else if (!!pgColumn.column_default || typeof pgColumn.udt_name !== "string" && !!pgColumn.udt_name.defaultValue) {
            if (pgColumn.dateType()) {
              text += "''";
            } else if (pgColumn.jsonType()) {
              if (Ti((_d = pgColumn.column_default) != null ? _d : "", "{}").toString().includes("{}")) {
                text += "{}";
              } else {
                text += ((_e = Ti(pgColumn.column_default, "{}")) != null ? _e : "{}").toString().substring(1, ((_f = pgColumn.column_default) != null ? _f : "").toString().indexOf("::") - 1);
              }
              text += ` as ${getTSType(pgColumn)}`;
            } else if (pgColumn.integerFloatType() || pgColumn.dateType()) {
              text += pgColumn.column_default;
            } else if (typeof pgColumn.udt_name !== "string") {
              text += "'" + ((_h = (_g = pgColumn.column_default) != null ? _g : pgColumn.udt_name.defaultValue) != null ? _h : "") + "' as " + pgColumn.jsType();
            } else if (!!pgColumn.column_default && pgColumn.column_default.toString().includes("::")) {
              if (pgColumn.udt_name.startsWith("e_")) {
                const colDefault = pgColumn.column_default.toString();
                text += PGEnum.TypeName(pgColumn.udt_name);
                text += ".";
                text += colDefault.substring(1, 1 + colDefault.indexOf("::") - 2);
              } else {
                text += "'" + ((_i = pgColumn.column_default) != null ? _i : "").toString().substring(1, ((_j = pgColumn.column_default) != null ? _j : "").toString().indexOf("::") - 1) + "'";
              }
            } else {
              text += "'" + ((_k = pgColumn.column_default) != null ? _k : "") + "'";
            }
          } else if (x(pgColumn.is_nullable)) {
            text += "null";
          } else {
            if (pgColumn.booleanType()) {
              text += "true";
            } else if (pgColumn.integerFloatType()) {
              text += "0";
            } else if (pgColumn.dateType()) {
              text += "''";
            } else if (pgColumn.jsonType()) {
              text += `{} as ${getTSType(pgColumn)}`;
            } else {
              text += "''";
            }
          }
        } else {
          text += "''";
        }
      }
      addComma = true;
    }
    text += TS_EOL + "}" + TS_EOL;
    if (options == null ? void 0 : options.includeConstraint) {
      const constraint = {};
      for (const pgColumn of this.columns) {
        const fieldConstraint = {};
        if (pgColumn.booleanType()) {
          fieldConstraint.type = "boolean";
          if (pgColumn.column_default && !pgColumn.isArray()) {
            fieldConstraint.default = x(pgColumn.column_default);
          }
        } else if (pgColumn.integerFloatType()) {
          fieldConstraint.type = "number";
          if (pgColumn.numeric_precision) {
            fieldConstraint.length = f(pgColumn.numeric_precision);
          }
          if (pgColumn.column_default && !pgColumn.isArray()) {
            fieldConstraint.default = f(pgColumn.column_default);
          }
        } else if (pgColumn.jsonType()) {
          fieldConstraint.type = "object";
        } else if (pgColumn.dateOnlyType()) {
          fieldConstraint.type = "date";
          if (pgColumn.column_default && !pgColumn.isArray()) {
            fieldConstraint.default = "now";
          }
        } else if (pgColumn.dateTimeOnlyType()) {
          fieldConstraint.type = "datetime";
          if (pgColumn.column_default && !pgColumn.isArray()) {
            fieldConstraint.default = "now";
          }
        } else if (pgColumn.timeOnlyType()) {
          fieldConstraint.type = "time";
          if (pgColumn.column_default && !pgColumn.isArray()) {
            fieldConstraint.default = "now";
          }
        } else {
          fieldConstraint.type = "string";
          if (pgColumn.character_maximum_length) {
            fieldConstraint.length = pgColumn.character_maximum_length;
          }
          if (pgColumn.column_default && !pgColumn.isArray()) {
            fieldConstraint.default = "";
          }
        }
        fieldConstraint.nullable = x(pgColumn.is_nullable);
        if (pgColumn.isArray()) {
          fieldConstraint.isArray = true;
          if (!fieldConstraint.nullable) {
            fieldConstraint.default = [];
          }
        }
        constraint[pgColumn.column_name] = fieldConstraint;
      }
      let stringified = JSON.stringify(constraint, void 0, (options == null ? void 0 : options.tabsForObjects) ? "	" : 4);
      if (options == null ? void 0 : options.noConstraintKeyQuotes) {
        stringified = stringified.replace(/\"([^(\")"]+)\":/g, "$1:");
      }
      if (options == null ? void 0 : options.singleQuote) {
        stringified = T('"', "'", stringified);
      }
      text += TS_EOL + `export const Constraint_${this.name}: TObjectConstraint<I${this.name}> = ${stringified}` + TS_EOL;
    }
    return text;
  }
  /*export class Cprogress_report_test extends _CTable<Iprogress_report_test> {
  	public readonly table: TTables
  
  	constructor(responseContext: ResponseContext, initialValues?: Partial<Iprogress_report_test>) {
  		super(responseContext, initialValues, {...initial_progress_report_test})
  
  		this.table = 'progress_report_test'
  	}
  }*/
  static TSTables(tables) {
    let text = `export type TTables =`;
    text += TS_EOL;
    text += "	";
    text += tables.filter((table) => !!table).sort((a, b2) => le(a, b2)).map((table) => `'${table}'`).join(TS_EOL + "	| ");
    text += TS_EOL;
    return text;
  }
  /**
   * Generates the text for a class that manages the table itself.  Must inherit from a local _CTable base class.
   *
   * @param relativePaths
   */
  tsTextTable(relativePaths) {
    var _a, _b, _c, _d, _e;
    const usePaths = {
      initials: Di("/", (_a = relativePaths == null ? void 0 : relativePaths.initials) != null ? _a : "@Common/Tables", true),
      tTables: Di("/", (_b = relativePaths == null ? void 0 : relativePaths.tTables) != null ? _b : "../Database", true),
      responseContext: Di("/", (_c = relativePaths == null ? void 0 : relativePaths.responseContext) != null ? _c : "../MiddleWare/ResponseContext", true),
      responseContextName: (_d = relativePaths == null ? void 0 : relativePaths.responseContextName) != null ? _d : "responseContext",
      responseContextClass: (_e = relativePaths == null ? void 0 : relativePaths.responseContextClass) != null ? _e : "ResponseContext",
      includeConstraint: !!(relativePaths == null ? void 0 : relativePaths.includeConstraint)
    };
    let text = this.tableHeaderText("Table Class for", "MODIFICATIONS WILL NOT BE OVERWRITTEN");
    if (this.importWithTypes) {
      text += `import {initial_${this.name}${usePaths.includeConstraint ? `, Constraint_${this.name}` : ""}} from '${usePaths.initials}/I${this.name}'` + TS_EOL;
      text += `import type {I${this.name}} from '${usePaths.initials}/I${this.name}'` + TS_EOL;
    } else {
      text += `import {initial_${this.name}, I${this.name}} from '${usePaths.initials}/I${this.name}'` + TS_EOL;
    }
    text += `import ${this.importWithTypes ? "type " : ""}{TTables} from '${usePaths.tTables}/TTables'` + TS_EOL;
    text += `import {_CTable} from './_CTable'` + TS_EOL;
    text += `import ${this.importWithTypes ? "type " : ""}{${usePaths.responseContextClass}} from '${usePaths.responseContext}'` + TS_EOL;
    for (const inherit of this.inherits) {
      text += `import {_C${inherit}} from "./_C${inherit}"` + TS_EOL;
    }
    text += TS_EOL;
    if (this.description) {
      text += `/** ${this.description} */${TS_EOL}`;
    }
    text += `export class C${this.name} extends _CTable<I${this.name}>`;
    if (this.inherits.length > 0) {
      text += `, C${this.inherits.join(", C")}`;
    }
    text += ` {` + TS_EOL;
    text += `	public readonly table: TTables` + TS_EOL;
    text += TS_EOL;
    text += `	constructor(${usePaths.responseContextName}: ${usePaths.responseContextClass}) {` + TS_EOL;
    text += `		super(${usePaths.responseContextName}, {...initial_${this.name}})` + TS_EOL;
    text += TS_EOL;
    if (usePaths.includeConstraint) {
      text += `		this.constraint = Constraint_${this.name}` + TS_EOL;
    }
    text += `		this.table = '${this.name}'` + TS_EOL;
    text += `	}` + TS_EOL;
    text += `}` + TS_EOL;
    return text;
  }
  tsTextTableUpdateDescription(currentText) {
    var _a;
    if (!currentText) return null;
    const currentTextLines = currentText.toString().split(TS_EOL);
    let classIdx = currentTextLines.findIndex((line) => line.startsWith("export class C"));
    if (classIdx > 0) {
      if ((_a = currentTextLines[classIdx - 1]) == null ? void 0 : _a.startsWith("/** ")) {
        currentTextLines.splice(classIdx - 1, 1);
        if (this.description) {
          currentTextLines.splice(classIdx - 1, 0, `/** ${this.description} */`);
        }
      } else {
        if (this.description) {
          currentTextLines.splice(classIdx, 0, `/** ${this.description} */`);
        }
      }
    }
    return currentTextLines.join(TS_EOL);
  }
  ddlPrimaryKey() {
    let found = false;
    let ddl = `PRIMARY KEY ("`;
    for (const column of this.columns) {
      if (x(column.is_identity)) {
        if (found) {
          ddl += `","`;
        }
        ddl += column.column_name;
        found = true;
      }
    }
    if (found) {
      ddl += `")`;
      return ddl;
    }
    return null;
  }
  ddlCreateTableText(createForeignKeys, createIndexes, dropFirst = true) {
    let ddl = "";
    if (dropFirst) {
      ddl += `DROP TABLE IF EXISTS ${this.name} CASCADE;` + TS_EOL;
    }
    ddl += `CREATE TABLE ${this.name}
		        (` + TS_EOL;
    let prevColumn = null;
    for (const pgColumn of this.columns) {
      if (prevColumn !== null) {
        ddl += "," + TS_EOL;
      }
      ddl += "	" + pgColumn.ddlDefinition();
      prevColumn = pgColumn;
    }
    const pk = this.ddlPrimaryKey();
    if (!!pk) {
      ddl += "," + TS_EOL + "	" + pk;
    }
    if (!!this.check) {
      const checkItems = (typeof this.check === "string" ? [this.check] : this.check).filter((item) => !!item);
      for (const checkItem of checkItems) {
        ddl += `,${TS_EOL}	CHECK (${checkItem})`;
      }
    }
    ddl += TS_EOL;
    ddl += ")";
    if (this.inherits.length > 0) {
      ddl += TS_EOL + `INHERITS (${this.inherits.join(",")})`;
    }
    ddl += ";";
    if (createIndexes) {
      ddl += this.ddlCreateIndexes();
    }
    if (createForeignKeys) {
      ddl += this.ddlCreateForeignKeysText();
    }
    for (const pgColumn of this.columns.filter((col) => !!col.column_comment)) {
      ddl += TS_EOL + `COMMENT ON COLUMN ${this.name}.${pgColumn.column_name} IS '${PGTable.CleanComment(pgColumn.column_comment, false)}';`;
    }
    return ddl;
  }
  ddlCreateIndexes() {
    let ddl = "";
    for (const index of this.indexes) {
      ddl += TS_EOL + index.ddlDefinition(this);
    }
    return ddl;
  }
  ddlCreateForeignKeysText() {
    let ddl = "";
    for (const foreignKey of this.foreignKeys) {
      ddl += foreignKey.ddlConstraintDefinition(this) + TS_EOL;
    }
    return ddl;
  }
  static CleanComment(comment, stripBrackets = true) {
    if (!comment) {
      return comment;
    }
    return stripBrackets ? comment.replace(/[\n\r]/g, " ").replace(/\{(.+?)\}/g, "").trim() : comment.replace(/[\n\r]/g, " ").trim();
  }
  fixedWidthMap(options) {
    var _a;
    const useOptions = { ...initialFixedWidthMapOptions, ...options };
    let currentPosition = useOptions.startPosition;
    let validColumn = !useOptions.startColumnName;
    let fixedWidthMaps = [];
    for (const column of this.columns) {
      if (useOptions.stopBeforeColumnName && column.column_name.toLowerCase() === useOptions.stopBeforeColumnName.toLowerCase()) {
        break;
      }
      if (!validColumn) {
        if (column.column_name.toLowerCase() === useOptions.startColumnName) {
          validColumn = true;
        }
      }
      if (validColumn) {
        const colLength = (_a = column.character_maximum_length) != null ? _a : 0;
        if (!colLength) {
          console.warn("Could not determine length for FixedWidthMap", column.column_name, column.udt_name);
        }
        fixedWidthMaps.push({
          column_name: column.column_name,
          startPosition: currentPosition,
          positionWidth: colLength
        });
        currentPosition += colLength;
      }
      if (useOptions.lastColumnName && column.column_name.toLowerCase() === useOptions.lastColumnName.toLowerCase()) {
        break;
      }
    }
    return fixedWidthMaps;
  }
}
class PGParams {
  constructor() {
    this.lastPosition = 0;
    this.values = [];
  }
  /**
   * Resets the state of the component so that it can be cleared and used for another SQL statement.
   *
   * @remarks
   * Call this method when you want to reset
   * the values stored in the component to their initial state.
   *
   * @public
   */
  reset() {
    this.lastPosition = 0;
    this.values = [];
  }
  /**
   * Adds a new value, returning the position of the value (like $1, $2, etc.) and appending the value to the 'values' array.
   *
   * @param value - The value to add to the `values` array.
   * @returns A string representing the new position of the added value in the format `$<position>`.
   *
   * @remarks
   * This method will increment the `lastPosition` property and then push the new value to the `values` array.
   * It will then return a string representation of the new position of that value.
   *
   * @example
   * const params = new PGParams()
   * console.log(await PGSQL.FetchOne(connection, `SELECT * FROM employee where id = ${params.add(5)}`, params.values))
   *
   * @public
   */
  add(value) {
    this.lastPosition++;
    this.values.push(value);
    return `$${this.lastPosition}`;
  }
  /**
   * Adds a new LIKE value by prefix and suffixing the string with %'s, returning the position of the value (like $1, $2, etc.) and appending the value to the 'values' array.
   *
   * @param value - The value to add to the `values` array with the format '%<value>%'.
   * @returns A string representing the new position of the added value in the format `$<position>`.
   *
   * @remarks
   * This method will increment the `lastPosition` property and then push the new value to the `values` array.
   * It will then return a string representation of the new position of that value.
   *
   * @example
   * const params = new PGParams()
   * console.log(await PGSQL.FetchMany(connection, `SELECT * FROM employee where name ILIKE ${params.addLike(5)}`, params.values))
   *
   * @public
   */
  addLike(value) {
    return this.add(`%${value}%`);
  }
  /**
   * Adds a new value, and if not null returns the position of the value (like $1, $2, etc.) and appending the value to the 'values' array, otherwise changes the SQL to be "<field>" IS NULL.
   *
   * @param field - The name of the field to check.
   * @param value - The value to add to the `values` array.
   * @returns Either '<field> IS NULL', or '<field> = <position>'.
   *
   * @remarks
   * If not null, this method will increment the `lastPosition` property and then push the new value to the `values` array.
   * It will then return a string representation of the new position of that value.
   *
   * @example
   * const params = new PGParams()
   * console.log(await PGSQL.FetchMany(connection, `SELECT * FROM employee where ${params.addEqualNullable('salary', null)}`, params.values))
   *
   * @public
   */
  addEqualNullable(field, value) {
    if (value === null || value === void 0) {
      return `${field} IS NULL`;
    } else {
      return `${field} = ${this.add(value)}`;
    }
  }
  /**
   * Replaces placeholders in the given SQL string with actual values from the `values` array.
   *
   * @param sql - The SQL string with placeholders in the format `$<position>`.
   * @returns The SQL string with actual values replacing corresponding placeholders.
   *
   * @remarks
   * This method will take an SQL string, look for placeholder expressions in the format `$<position>`,
   * and replace these placeholders with the corresponding values from the `values` array.
   * If the value is a string it will be surrounded with quotes.
   * The positions are counted from the end of the `values` array to the beginning.
   * Please notice that the counter starts from 1, thus the replacement of `$1` corresponds to the last value pushed to the array.
   *
   * @example
   * ```typescript
   * replaceSQLWithValues("SELECT * FROM users WHERE name = $1 AND age = $2")
   * // Assume $1 corresponds to 'John' and $2 corresponds to 30
   * // Returns: "SELECT * FROM users WHERE name = 'John' AND age = 30"
   * ```
   *
   * @public
   */
  replaceSQLWithValues(sql) {
    let returnSQL = sql;
    for (let i = this.values.length; i > 0; i--) {
      returnSQL = T(`$${i}`, typeof this.values[i - 1] === "string" ? `'${this.values[i - 1]}'` : this.values[i - 1], returnSQL);
    }
    return returnSQL;
  }
}
const { Client: pkgClient, Pool: pkgPool } = pkg;
exports.PGSQL = void 0;
((PGSQL2) => {
  PGSQL2.IgnoreDBMSAlert = "/*NO_DBMS_ALERT*/";
  PGSQL2.SetDBMSAlert = (milliseconds) => {
    if (!milliseconds) {
      delete process.env.DB_MS_ALERT;
    } else {
      process.env.DB_MS_ALERT = milliseconds.toString();
    }
  };
  PGSQL2.query = async (connection, sql, values) => {
    const start = Date.now();
    const connectionResolved = await Promise.resolve(connection);
    return connectionResolved.query(sql, values).then((response) => {
      const alert = E(process.env.DB_MS_ALERT);
      if (alert && !sql.includes(PGSQL2.IgnoreDBMSAlert)) {
        const ms = Date.now() - start;
        if (ms > alert) {
          console.log("----- Long SQL Query", v(ms), "ms");
          console.log(sql);
          console.log(values);
        }
      }
      return response;
    }).catch((err) => {
      console.log("------------ SQL Query");
      console.log(me("LocalDateTime", "now", "America/New_York"));
      console.log(err.message);
      console.log("Error Code:", err.code || "No code");
      console.log("Error Detail:", err.detail || "No detail");
      console.log("Error Position:", err.position || "No position");
      console.log("Error Stack:", err.stack || "No stack trace");
      console.log(sql);
      console.log(values);
      throw err;
    });
  };
  PGSQL2.timeout = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  PGSQL2.TableRowCount = async (connection, table, schema) => {
    var _a, _b, _c;
    const data = await (0, PGSQL2.query)(connection, `SELECT COUNT(*) AS count
		                                      FROM ${(!!schema ? `${schema}.` : "") + table}`, void 0);
    return (_c = ((_b = ((_a = data.rows) != null ? _a : [])[0]) != null ? _b : {})["count"]) != null ? _c : 0;
  };
  PGSQL2.CurrentSchema = (schema) => schema != null ? schema : "public";
  PGSQL2.TableExists = async (connection, table, schema) => {
    var _a, _b, _c;
    const sql = `SELECT COUNT(*) AS count
		             FROM information_schema.tables
		             WHERE table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
			           AND table_name = '${table}'`;
    const data = await (0, PGSQL2.query)(connection, sql, void 0);
    return ((_c = ((_b = ((_a = data.rows) != null ? _a : [])[0]) != null ? _b : {})["count"]) != null ? _c : 0) > 0;
  };
  PGSQL2.TableColumnExists = async (connection, table, column, schema) => {
    var _a, _b, _c;
    const sql = `SELECT COUNT(*) AS count
		             FROM information_schema.COLUMNS
		             WHERE table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
			           AND table_name = '${table}'
			           AND column_name = '${column}'`;
    const data = await (0, PGSQL2.query)(connection, sql, void 0);
    return ((_c = ((_b = ((_a = data.rows) != null ? _a : [])[0]) != null ? _b : {})["count"]) != null ? _c : 0) > 0;
  };
  PGSQL2.TriggerExists = async (connection, trigger, schema) => {
    var _a, _b, _c;
    const sql = `SELECT COUNT(*) AS count
		             FROM information_schema.triggers
		             WHERE trigger_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
			           AND trigger_name = '${trigger}'`;
    const data = await (0, PGSQL2.query)(connection, sql, void 0);
    return ((_c = ((_b = ((_a = data.rows) != null ? _a : [])[0]) != null ? _b : {})["count"]) != null ? _c : 0) > 0;
  };
  PGSQL2.TableResetIncrement = async (connection, table, column, toID) => {
    if (!!toID) {
      return PGSQL2.Execute(
        connection,
        `SELECT setval(pg_get_serial_sequence('${table}', '${column}'), ${toID});
			`
      );
    } else {
      return PGSQL2.Execute(
        connection,
        `SELECT SETVAL(PG_GET_SERIAL_SEQUENCE('${table}', '${column}'), MAX(${column}))
				 FROM ${table};
				`
      );
    }
  };
  PGSQL2.ConstraintExists = async (connection, constraint, schema) => {
    var _a, _b, _c;
    const sql = `
			SELECT COUNT(*) AS count
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
			  AND constraint_name = '${constraint}'`;
    const data = await (0, PGSQL2.query)(connection, sql, void 0);
    return ((_c = ((_b = ((_a = data.rows) != null ? _a : [])[0]) != null ? _b : {})["count"]) != null ? _c : 0) > 0;
  };
  PGSQL2.FKConstraints = async (connection, schema) => {
    const sql = `
			SELECT table_name, constraint_name
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
			  AND constraint_type = 'FOREIGN KEY'`;
    return PGSQL2.FetchMany(connection, sql);
  };
  PGSQL2.Functions = async (connection, schema) => {
    const sql = `
			SELECT routines.routine_name
			FROM information_schema.routines
			WHERE routines.specific_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
			  AND routine_type = 'FUNCTION'
			ORDER BY routines.routine_name`;
    return (await PGSQL2.FetchArray(connection, sql)).filter((func) => func.startsWith("func_"));
  };
  PGSQL2.IndexExists = async (connection, tablename, indexName, schema) => {
    var _a, _b, _c;
    const sql = `SELECT COUNT(*) AS count
		             FROM pg_indexes
		             WHERE schemaname = '${(0, PGSQL2.CurrentSchema)(schema)}'
			           AND tablename = '${tablename}'
			           AND indexname = '${indexName}'`;
    const data = await (0, PGSQL2.query)(connection, sql, void 0);
    return ((_c = ((_b = ((_a = data.rows) != null ? _a : [])[0]) != null ? _b : {})["count"]) != null ? _c : 0) > 0;
  };
  PGSQL2.GetByID = async (connection, table, id) => {
    var _a, _b;
    if (!id) {
      return Promise.resolve(null);
    } else {
      const sql = `SELECT *
			             FROM ${table}
			             WHERE id = $1`;
      const data = await (0, PGSQL2.query)(connection, sql, [id]);
      return !!((_a = data.rows) != null ? _a : [])[0] ? { ...((_b = data.rows) != null ? _b : [])[0] } : null;
    }
  };
  PGSQL2.GetCountSQL = async (connection, sql, values) => {
    var _a, _b, _c, _d, _e;
    const data = await (0, PGSQL2.query)(connection, sql, values);
    return f((_e = ((_b = ((_a = data.rows) != null ? _a : [])[0]) != null ? _b : {})["count"]) != null ? _e : ((_d = ((_c = data.rows) != null ? _c : [])[0]) != null ? _d : {})[0], 0);
  };
  PGSQL2.FetchOne = async (connection, sql, values) => {
    var _a, _b;
    const data = await (0, PGSQL2.query)(connection, sql, values);
    return !!((_a = data.rows) != null ? _a : [])[0] ? { ...((_b = data.rows) != null ? _b : [])[0] } : null;
  };
  PGSQL2.FetchOneValue = async (connection, sql, values) => {
    var _a, _b;
    return (_b = Object.values((_a = await (0, PGSQL2.FetchOne)(connection, sql, values)) != null ? _a : {})[0]) != null ? _b : null;
  };
  PGSQL2.FetchMany = async (connection, sql, values) => {
    var _a;
    const data = await (0, PGSQL2.query)(connection, sql, values);
    return (_a = data.rows) != null ? _a : [];
  };
  PGSQL2.FetchArray = async (connection, sql, values) => {
    var _a;
    const data = await (0, PGSQL2.query)(connection, sql, values);
    return ((_a = data.rows) != null ? _a : []).map((row) => row[Object.keys(row)[0]]);
  };
  PGSQL2.FetchExists = async (connection, sql, values) => {
    var _a, _b;
    const data = await (0, PGSQL2.query)(connection, `SELECT EXISTS (${sql}) as does_exist`, values);
    return !!((_b = ((_a = data.rows) != null ? _a : [])[0]) == null ? void 0 : _b.does_exist);
  };
  PGSQL2.InsertAndGetReturning = async (connection, table, values) => {
    var _a;
    let newValues = { ...values };
    if (!newValues.id) {
      delete newValues.id;
    }
    let params = new PGParams();
    const sql = `
			INSERT INTO ${table}
				("${Object.keys(newValues).join('","')}")
			VALUES (${Object.values(newValues).map((value) => params.add(value)).join(",")})
			RETURNING *`;
    const results = await (0, PGSQL2.query)(connection, sql, params.values);
    return ((_a = results.rows) != null ? _a : [])[0];
  };
  PGSQL2.InsertAndGetID = async (connection, table, values) => {
    var _a;
    let newValues = { ...values };
    if (!newValues.id) {
      delete newValues.id;
    }
    let params = new PGParams();
    const sql = `
			INSERT INTO ${table}
				("${Object.keys(newValues).join('","')}")
			VALUES (${Object.values(newValues).map((value) => params.add(value)).join(",")})
			RETURNING id`;
    const results = await (0, PGSQL2.query)(connection, sql, params.values);
    const id = (_a = results.rows[0]) == null ? void 0 : _a.id;
    if (!id) throw new Error("Could not load ID");
    return id;
  };
  PGSQL2.InsertBulk = async (connection, table, values) => {
    let params = new PGParams();
    const sql = `
			INSERT INTO ${table}
				("${Object.keys(values).join('","')}")
			VALUES (${Object.values(values).map((value) => params.add(value)).join(",")})`;
    await (0, PGSQL2.query)(connection, sql, params.values);
  };
  PGSQL2.UpdateAndGetReturning = async (connection, table, whereValues, updateValues) => {
    let params = new PGParams();
    const sql = `UPDATE ${table}
		             SET ${(0, PGSQL2.BuildSetComponents)(updateValues, params)}
		             WHERE ${(0, PGSQL2.BuildWhereComponents)(
      whereValues,
      params
    )}
		             RETURNING *`;
    const data = await (0, PGSQL2.query)(connection, sql, params.values);
    return data.rows[0];
  };
  PGSQL2.BuildWhereComponents = (whereValues, params) => Object.keys(whereValues).map((key) => whereValues[key] === void 0 || whereValues[key] === null ? `"${key}" IS NULL` : `"${key}"=${params.add(whereValues[key])}`).join(" AND ");
  PGSQL2.BuildSetComponents = (setValues, params) => Object.keys(setValues).map((key) => `"${key}"=${params.add(setValues[key])}`).join(",");
  PGSQL2.Save = async (connection, table, values) => {
    if (!values.id) {
      return (0, PGSQL2.InsertAndGetReturning)(connection, table, values);
    } else {
      let whereValues = { id: values.id };
      return (0, PGSQL2.UpdateAndGetReturning)(connection, table, whereValues, values);
    }
  };
  PGSQL2.Delete = async (connection, table, whereValues) => {
    let params = new PGParams();
    const sql = `DELETE
		             FROM ${table}
		             WHERE ${(0, PGSQL2.BuildWhereComponents)(whereValues, params)}`;
    await (0, PGSQL2.query)(connection, sql, params.values);
  };
  PGSQL2.ExecuteRaw = async (connection, sql) => (0, PGSQL2.Execute)(connection, sql);
  PGSQL2.Execute = async (connection, sql, values) => {
    const connectionResolved = await Promise.resolve(connection);
    try {
      if (!process.env.DB_MS_ALERT) {
        return await connectionResolved.query(sql, values);
      } else {
        const start = Date.now();
        const response = await connectionResolved.query(sql, values);
        const ms = Date.now() - start;
        if (ms > f(process.env.DB_MS_ALERT)) {
          console.log("----- Long SQL Query", ms / 1e3, "s", kn());
          console.log(sql);
          console.log(values);
        }
        return response;
      }
    } catch (err) {
      console.log("------------ SQL Execute", kn());
      console.log(err.message);
      console.log("Error Code:", err.code || "No code");
      console.log("Error Detail:", err.detail || "No detail");
      console.log("Error Position:", err.position || "No position");
      console.log("Error Stack:", err.stack || "No stack trace");
      console.log(sql);
      console.log(values);
      throw new Error(err.message);
    }
  };
  PGSQL2.ExecuteNoConsole = async (connection, sql, values) => {
    const connectionResolved = await Promise.resolve(connection);
    return await connectionResolved.query(sql, values);
  };
  PGSQL2.Transaction = async (connection, func) => {
    const connectionResolved = await connection;
    let is_Custom_Client = true;
    let transactionClient;
    if (connectionResolved instanceof pkgPool) {
      is_Custom_Client = false;
      transactionClient = await connectionResolved.connect();
    } else if (connectionResolved instanceof pkgClient) {
      transactionClient = connectionResolved;
    } else if ("Client" in connectionResolved) {
      transactionClient = connectionResolved.Client;
    } else {
      throw new Error("Invalid connection");
    }
    if (connectionResolved.inTransaction) return await func(transactionClient);
    connectionResolved.inTransaction = true;
    await (0, PGSQL2.Execute)(transactionClient, "START TRANSACTION");
    await (0, PGSQL2.Execute)(transactionClient, "SET CONSTRAINTS ALL DEFERRED");
    try {
      const response = await func(transactionClient);
      await (0, PGSQL2.Execute)(transactionClient, "COMMIT");
      return response;
    } catch (err) {
      await (0, PGSQL2.Execute)(transactionClient, "ROLLBACK");
      throw new Error(err);
    } finally {
      connectionResolved.inTransaction = false;
      if ("release" in transactionClient && typeof transactionClient.release === "function" && !is_Custom_Client) {
        transactionClient.release();
      }
    }
  };
  PGSQL2.TruncateAllTables = async (connection, exceptions = [], includeCascade = false) => {
    let tables = await (0, PGSQL2.TablesArray)(connection);
    await (0, PGSQL2.Execute)(connection, "START TRANSACTION");
    await (0, PGSQL2.Execute)(connection, "SET CONSTRAINTS ALL DEFERRED");
    try {
      for (const table of tables) {
        if (!exceptions.includes(table)) {
          await (0, PGSQL2.Execute)(connection, `TRUNCATE TABLE ${table} RESTART IDENTITY` + (includeCascade ? " CASCADE" : ""), void 0);
        }
      }
      await (0, PGSQL2.Execute)(connection, "COMMIT");
    } catch (err) {
      await (0, PGSQL2.Execute)(connection, "ROLLBACK");
      return false;
    }
    return true;
  };
  PGSQL2.TruncateTables = async (connection, tables, includeCascade = false) => {
    for (const table of tables) {
      await (0, PGSQL2.Execute)(connection, `TRUNCATE TABLE ${table} RESTART IDENTITY` + (includeCascade ? " CASCADE" : ""));
    }
  };
  PGSQL2.TablesArray = async (connection, schema) => {
    return (0, PGSQL2.FetchArray)(
      connection,
      `
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND table_type = 'BASE TABLE'`
    );
  };
  PGSQL2.ViewsArray = async (connection, schema) => {
    return await (0, PGSQL2.FetchArray)(
      connection,
      `
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND table_type = 'VIEW'`
    );
  };
  PGSQL2.ViewsMatArray = async (connection, schema) => {
    return await (0, PGSQL2.FetchArray)(
      connection,
      `
				SELECT matviewname
				FROM pg_matviews
				WHERE schemaname = '${(0, PGSQL2.CurrentSchema)(schema)}'`
    );
  };
  PGSQL2.TypesArray = async (connection) => {
    return await (0, PGSQL2.FetchArray)(
      connection,
      `
				SELECT typname
				FROM pg_type
				WHERE typcategory = 'E'
				ORDER BY typname`
    );
  };
  PGSQL2.FunctionsArray = async (connection, schema) => {
    return await (0, PGSQL2.FetchArray)(
      connection,
      `
				SELECT f.proname
				FROM pg_catalog.pg_proc f
					     INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND f.proname ILIKE 'func_%'`
    );
  };
  PGSQL2.FunctionsOIDArray = async (connection, schema) => {
    return await (0, PGSQL2.FetchArray)(
      connection,
      `
				SELECT f.oid
				FROM pg_catalog.pg_proc f
					     INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND f.proname ILIKE 'func_%'`
    );
  };
  PGSQL2.ExtensionsArray = async (connection) => {
    return await (0, PGSQL2.FetchArray)(
      connection,
      `
				SELECT extname
				FROM pg_extension
				WHERE extname != 'plpgsql'`
    );
  };
  PGSQL2.TableData = async (connection, table, schema) => {
    return (0, PGSQL2.FetchOne)(
      connection,
      `
				SELECT *
				FROM information_schema.tables
				WHERE table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND table_type = 'BASE TABLE'
				  AND table_name = $1`,
      [table]
    );
  };
  PGSQL2.TableColumnsData = async (connection, table, schema) => {
    return (0, PGSQL2.FetchMany)(
      connection,
      `
				SELECT *
				FROM information_schema.columns
				WHERE table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND table_name = $1
				ORDER BY ordinal_position`,
      [table]
    );
  };
  PGSQL2.TableFKsData = async (connection, table, schema) => {
    return (0, PGSQL2.FetchMany)(
      connection,
      `
				SELECT tc.table_schema,
				       tc.constraint_name,
				       tc.table_name,
				       MAX(tc.enforced),
				       JSON_AGG(kcu.column_name) AS "columnNames",
				       MAX(ccu.table_schema)     AS foreign_table_schema,
				       MAX(ccu.table_name)       AS "primaryTable",
				       JSON_AGG(ccu.column_name) AS "primaryColumns"
				FROM information_schema.table_constraints AS tc
					     JOIN information_schema.key_column_usage AS kcu
					          ON tc.constraint_name = kcu.constraint_name
						          AND tc.table_schema = kcu.table_schema
					     JOIN information_schema.constraint_column_usage AS ccu
					          ON ccu.constraint_name = tc.constraint_name
						          AND ccu.table_schema = tc.table_schema
				WHERE tc.table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND tc.constraint_type = 'FOREIGN KEY'
				  AND tc.table_name = $1
				GROUP BY tc.table_schema,
				         tc.constraint_name,
				         tc.table_name`,
      [table]
    );
  };
  PGSQL2.TableIndexesData = async (connection, table, schema) => {
    return (0, PGSQL2.FetchMany)(
      connection,
      `
				SELECT *
				FROM pg_indexes
				WHERE schemaname = '${(0, PGSQL2.CurrentSchema)(schema)}'
				  AND tablename = $1
				  AND (indexname NOT ILIKE '%_pkey'
					OR indexdef ILIKE '%(%,%)%')`,
      [table]
    );
  };
  PGSQL2.ViewData = async (connection, view) => {
    var _a, _b;
    return (_b = (_a = await (0, PGSQL2.FetchOne)(
      connection,
      `
          select pg_get_viewdef($1, true) as viewd`,
      [view]
    )) == null ? void 0 : _a.viewd) != null ? _b : null;
  };
  PGSQL2.ViewsMatData = async (connection, viewMat) => {
    var _a, _b;
    return (_b = (_a = await (0, PGSQL2.FetchOne)(
      connection,
      `
          select pg_get_viewdef($1, true) as viewd`,
      [viewMat]
    )) == null ? void 0 : _a.viewd) != null ? _b : null;
  };
  PGSQL2.FunctionData = async (connection, func) => {
    var _a, _b;
    return (_b = (_a = await (0, PGSQL2.FetchOne)(
      connection,
      `
          select pg_get_functiondef($1) as viewd`,
      [func]
    )) == null ? void 0 : _a.viewd) != null ? _b : null;
  };
  PGSQL2.TypeData = async (connection, type) => {
    return (0, PGSQL2.FetchArray)(
      connection,
      `
                SELECT unnest(enum_range(NULL::${type}))`
    );
  };
  PGSQL2.SortColumnSort = (sortColumn) => {
    let sort = "";
    if (!!sortColumn.primarySort) {
      sort += "ORDER BY ";
      if (!sortColumn.primaryAscending) {
        sort += `${AltColumn(sortColumn.primarySort)} DESC`;
      } else {
        switch (sortColumn.primaryEmptyToBottom) {
          case "string":
            sort += `NULLIF(${sortColumn.primarySort}, '')`;
            break;
          case "number":
            sort += `NULLIF(${sortColumn.primarySort}, 0)`;
            break;
          default:
            sort += `${AltColumn(sortColumn.primarySort)}`;
            break;
        }
      }
      if (!!sortColumn.primaryEmptyToBottom) sort += " NULLS LAST";
      if (!!sortColumn.secondarySort) {
        sort += ", ";
        if (!sortColumn.secondaryAscending) {
          sort += `${AltColumn(sortColumn.secondarySort)} DESC`;
        } else {
          switch (sortColumn.secondaryEmptyToBottom) {
            case "string":
              sort += `NULLIF(${sortColumn.secondarySort}, '')`;
              break;
            case "number":
              sort += `NULLIF(${sortColumn.secondarySort}, 0)`;
              break;
            default:
              sort += `${AltColumn(sortColumn.secondarySort)}`;
              break;
          }
        }
        if (!!sortColumn.secondaryEmptyToBottom) sort += " NULLS LAST";
      }
    }
    return sort;
  };
  PGSQL2.PaginatorOrderBy = (paginatorRequest) => (0, PGSQL2.SortColumnSort)(paginatorRequest.sortColumns);
  PGSQL2.LimitOffset = (limit, offset) => ` LIMIT ${limit} OFFSET ${offset} `;
  PGSQL2.PaginatorLimitOffset = (paginatorResponse) => (0, PGSQL2.LimitOffset)(paginatorResponse.countPerPage, paginatorResponse.currentOffset);
  const AltColumn = (column) => {
    if (column === "appointment_date") {
      return `concat_ws(' ', appointment_date, appointment_time)`;
    } else {
      return column;
    }
  };
  PGSQL2.CalcOffsetFromPage = (page, pageSize, totalRecords) => {
    if (f(totalRecords) > 0) {
      const pages = (0, PGSQL2.CalcPageCount)(pageSize, totalRecords);
      if (f(page) < 1) {
        page = 1;
      }
      if (f(page) > f(pages)) {
        page = pages;
      }
      return (f(page) - 1) * f(pageSize);
    } else {
      page = 1;
      return 0;
    }
  };
  PGSQL2.CalcPageCount = (pageSize, totalRecords) => {
    if (f(totalRecords) > 0) {
      return Math.floor((f(totalRecords) + (f(pageSize) - 1)) / f(pageSize));
    } else {
      return 0;
    }
  };
  PGSQL2.ResetIDs = async (connection) => {
    let tables = await PGSQL2.TablesArray(connection);
    for (const table of tables) {
      if (await (0, PGSQL2.TableColumnExists)(connection, table, "id")) {
        await (0, PGSQL2.TableResetIncrement)(connection, table, "id");
      }
    }
  };
  PGSQL2.GetTypes = async (connection) => {
    const enumItems = await (0, PGSQL2.TypesArray)(connection);
    let enums = [];
    for (const enumItem of enumItems) {
      enums.push(
        new PGEnum({
          enumName: enumItem,
          values: await (0, PGSQL2.TypeData)(connection, enumItem),
          defaultValue: void 0
        })
      );
    }
    return enums;
  };
  PGSQL2.TableComments = async (connection, table, schema) => {
    return PGSQL2.FetchOneValue(connection, `
			SELECT obj_description('${!schema ? "" : `${schema}.`}${table}'::regclass, 'pg_class')`);
  };
  PGSQL2.TableColumnComments = async (connection, table, schema) => {
    return PGSQL2.FetchMany(connection, `
			SELECT cols.column_name,
			       (SELECT pg_catalog.COL_DESCRIPTION(c.oid, cols.ordinal_position::INT)
			        FROM pg_catalog.pg_class c
			        WHERE c.oid = (SELECT cols.table_name::REGCLASS::OID)
				      AND c.relname = cols.table_name) AS column_comment

			FROM information_schema.columns cols
			WHERE cols.table_schema = '${(0, PGSQL2.CurrentSchema)(schema)}'
			  AND cols.table_name = '${table}'`);
  };
  PGSQL2.GetPGTable = async (connection, table, schema) => {
    var _a, _b, _c, _d, _e, _f;
    const pgTable = new PGTable();
    pgTable.name = table;
    pgTable.description = (_a = await (0, PGSQL2.TableComments)(connection, table, schema)) != null ? _a : "";
    const columnComments = await (0, PGSQL2.TableColumnComments)(connection, table, schema);
    const columns = await (0, PGSQL2.TableColumnsData)(connection, table, schema);
    for (const column of columns) {
      const pgColumn = new PGColumn({
        ...column,
        generatedAlwaysAs: column.generation_expression,
        isAutoIncrement: x(column.identity_increment),
        udt_name: column.udt_name.toString().startsWith("_") ? column.udt_name.toString().substring(1) : column.udt_name,
        array_dimensions: column.udt_name.toString().startsWith("_") ? [null] : [],
        column_default: ((_b = column.column_default) != null ? _b : "").toString().startsWith("'NULL'") || ((_c = column.column_default) != null ? _c : "").toString().startsWith("NULL::") ? null : ((_d = column.column_default) != null ? _d : "").toString().startsWith("''::") ? "" : column.column_default,
        column_comment: (_f = (_e = columnComments.find((col) => col.column_name === column.column_name)) == null ? void 0 : _e.column_comment) != null ? _f : ""
      });
      pgTable.columns.push(pgColumn);
    }
    const fks = await (0, PGSQL2.TableFKsData)(connection, table);
    for (const fk of fks) {
      const pgForeignKey = new PGForeignKey({
        columnNames: fk.columnNames.reduce((results, columnName) => results.includes(columnName) ? results : [...results, columnName], []),
        primaryTable: fk.primaryTable,
        primaryColumns: fk.primaryColumns.reduce((results, primaryColumn) => results.includes(primaryColumn) ? results : [...results, primaryColumn], [])
      });
      pgTable.foreignKeys.push(pgForeignKey);
    }
    const indexes = await (0, PGSQL2.TableIndexesData)(connection, table);
    for (const index of indexes) {
      const indexDef = index.indexdef;
      const wherePos = indexDef.toUpperCase().indexOf(" WHERE ");
      const pgIndex = new PGIndex({
        columns: indexDef.substring(indexDef.indexOf("(") + 1, wherePos > 0 ? wherePos - 1 : indexDef.length - 1).split(",").map((idx) => idx.trim()).filter((idx) => !!idx),
        isUnique: indexDef.includes(" UNIQUE "),
        whereCondition: wherePos > 0 ? indexDef.substring(wherePos + 7).trim() : null
      });
      pgTable.indexes.push(pgIndex);
    }
    return pgTable;
  };
  PGSQL2.CleanSQL = (sql) => T(";", "", sql);
})(exports.PGSQL || (exports.PGSQL = {}));
function IsValidPostgresInteger(value, unsigned = false) {
  if (!xt(value)) return false;
  if (Array.isArray(value)) return false;
  const minSignedInt = -2147483648;
  const maxSignedInt = 2147483647;
  const maxUnsignedInt = 4294967295;
  const useValue = E(value);
  if (typeof useValue !== "number" || !Number.isInteger(useValue)) {
    return false;
  }
  if (unsigned) {
    return useValue >= 0 && useValue <= maxUnsignedInt;
  } else {
    return useValue >= minSignedInt && useValue <= maxSignedInt;
  }
}
class CTableBase {
  constructor(connection, defaultValues, options) {
    var _a, _b, _c, _d, _e, _f;
    this.constraint = null;
    this.defaultImportColumns = null;
    this.defaultImportExcludeColumns = null;
    this.ignoreCustomerCheck = false;
    this.connection = connection;
    this.record = { ...defaultValues };
    this.recordBaseline = { ...this.record };
    this.recordDefault = { ...defaultValues };
    this.updateID = "id";
    this.constraint = (_a = options == null ? void 0 : options.constraint) != null ? _a : null;
    this.nullIfFalsey = (_b = options == null ? void 0 : options.nullIfFalsey) != null ? _b : [];
    this.arrayFormDataItems = (_c = options == null ? void 0 : options.arrayFormDataItems) != null ? _c : [];
    this.excludeColumnsSave = (_d = options == null ? void 0 : options.excludeColumnsSave) != null ? _d : [];
    this.excludeColumnsInsert = (_e = options == null ? void 0 : options.excludeColumnsInsert) != null ? _e : [];
    this.excludeColumnsUpdate = (_f = options == null ? void 0 : options.excludeColumnsUpdate) != null ? _f : [];
    this.ignoreCustomerCheck = !!(options == null ? void 0 : options.ignoreCustomerCheck);
    this.readerConnection = options == null ? void 0 : options.readerConnection;
  }
  /**
   * Applies the given constraint to the record, forcing it to conform to most database constraints
   *
   * @return {this} The current object, after applying the constraint to the record.
   */
  constrainRecord() {
    if (this.constraint) {
      this.record = Va(this.record, this.constraint);
    }
    return this;
  }
  /**
   * Updates the record object with the provided values.
   *
   * @param {Partial<RECORD>} values - The partial values to update the record with.
   * @return {this} - Returns the instance of the object that called the method.
   */
  setFromAny(values) {
    this.record = { ...this.record, ...Xi(values, this.recordDefault) };
    return this.constrainRecord();
  }
  /**
   * Sets the values of the record object from the provided formData object.
   *
   * @param {FormData} formData - The FormData object containing the data to set on the record.
   * @param {TObjectFromFormDataOptions<RECORD>} [options] - Optional options for converting the data.
   * @returns {this} - Returns the current instance of the class.
   */
  setFromFormData(formData, options) {
    this.record = { ...this.record, ...su(formData, options) };
    return this.constrainRecord();
  }
  /**
   * Inserts a record into the database table.
   *
   * @returns {Promise<this>} A Promise that resolves to the current instance of the object.
   * @throws {Error} Throws an error if the object cannot be created for insertion.
   */
  async insert() {
    await this.preInsert();
    this.constrainRecord();
    await this.convertToSave();
    const obj = this.objectToInsert();
    if (obj) {
      const results = await exports.PGSQL.InsertAndGetReturning(this.connection, this.table, obj);
      if (results) {
        this.setFromAny(results);
        await this.convertAfterLoad();
        await this.postInsert();
        this.setBaseline();
      }
    } else {
      throw new Error(`Could not create object to insert ${this.table}`);
    }
    return this;
  }
  /**
   * Updates the record in the database.
   *
   * @returns {Promise<this>} - A Promise that resolves to this object after the update is complete.
   * @throws {Error} - Throws an error if the object to update could not be created.
   */
  async update() {
    await this.preUpdate();
    this.constrainRecord();
    await this.convertToSave();
    const obj = this.objectToUpdate();
    if (obj) {
      const results = await exports.PGSQL.UpdateAndGetReturning(
        this.connection,
        this.table,
        H(this.updateID).reduce((result, id) => {
          result[id] = obj[id];
          return result;
        }, {}),
        qe(obj, "id")
      );
      if (results) {
        this.setFromAny(results);
        await this.convertAfterLoad();
        await this.postUpdate();
        this.setBaseline();
      }
    } else {
      throw new Error(`Could not create object to update ${this.table}`);
    }
    return this;
  }
  /**
   * Checks if the record is saved.
   *
   * @returns {Promise<boolean>} A Promise that resolves to true if the record is saved, or false otherwise.
   */
  async isSaved() {
    return this.record.id > 0;
  }
  /**
   * Saves the record with either an insert or update, as appropriate.
   *
   * @returns {Promise<this>} A promise that resolves to the current instance of the class after saving the record.
   * @throws {Error} If the record could not be saved.
   */
  async save() {
    await this.preIDCheck();
    if (this.record) {
      if (await this.isSaved()) {
        return this.update();
      } else {
        return this.insert();
      }
    }
    throw new Error("Could not save record");
  }
  /**
   * Deletes the record from the database table.
   *
   * @returns {Promise<this>} A Promise that resolves with the current instance after the deletion is successful.
   */
  async delete() {
    await this.preDelete();
    await exports.PGSQL.Delete(this.connection, this.table, Si(this.record, ...H(this.updateID)));
    return this;
  }
  /**
   * Loads a record by ID and sets changes.
   *
   * @param {Partial<RECORD>} values - The values to set for the record.
   * @param ignoreCustomerCheck
   * @returns {Promise<this>} - A promise that resolves with the current instance of the record.
   */
  async loadByIDAndSetChanges(values, ignoreCustomerCheck = false) {
    const id = values["id"];
    if (id) {
      await this.loadByID(id, ignoreCustomerCheck);
    }
    this.setFromAny(values);
    return this;
  }
  /**
   * Loads a record by ID and sets it as the current record.  If invalid value, throws an error.
   *
   * @param {number | string | null | undefined} id - The ID of the record to load.
   *
   * @param ignoreCustomerCheck
   * @returns {Promise<this>} - A promise that resolves with the current instance of the method's class.
   *
   * @throws {Error} Throws an error if no ID is specified.
   * @throws {Error} Throws an error if the record is not found.
   */
  async loadID(id, ignoreCustomerCheck = false) {
    var _a;
    if (!id) {
      throw new Error("No ID specified");
    }
    this.ignoreCustomerCheck = this.ignoreCustomerCheck || ignoreCustomerCheck;
    const record = await exports.PGSQL.GetByID((_a = this.readerConnection) != null ? _a : this.connection, this.table, f(id));
    if (!record) {
      throw new Error(`Record not found ${this.table}`);
    }
    this.record = record != null ? record : { ...this.recordDefault };
    await this.postSelect();
    this.setBaseline();
    return this;
  }
  /**
   * Load an item by its ID.  If no id exists, returns null.
   *
   * @param {number | string | null | undefined} id - The ID of the item to load.
   * @param ignoreCustomerCheck
   * @returns {Promise<this | null>} A Promise that resolves to the loaded item if successful, otherwise null.
   */
  async loadByID(id, ignoreCustomerCheck = false) {
    if (!id) return null;
    try {
      const item = await this.loadID(id, ignoreCustomerCheck);
      return item;
    } catch (err) {
      return null;
    }
  }
  /**
   * Reloads the current record by calling the loadByID method.
   *
   * @returns {Promise} A Promise that resolves after the record is reloaded.
   */
  async reload() {
    if (this.record.id) {
      await this.loadByID(this.record.id);
    }
  }
  /**
   * Loads the values from the database based on the provided options.
   *
   * @param {Partial<RECORD>} values - The values used to filter the records.
   * @param {object} [options] - The options for sorting and filtering the records.
   * @param {keyof RECORD} [options.sortPrimary] - The primary field used for sorting the records.
   * @param {boolean} [options.ascendingPrimary=true] - Indicates whether to sort the records in ascending order based on the primary field. Defaults to true.
   * @param {keyof RECORD} [options.sortSecondary] - The secondary field used for sorting the records.
   * @param {boolean} [options.ascendingSecondary=true] - Indicates whether to sort the records in ascending order based on the secondary field. Defaults to true.
   * @param {boolean} [options.ignoreCustomerCheck=false] - Indicates whether to ignore customer check while fetching the records. Defaults to false.
   *
   * @returns {Promise<this>} - A Promise that resolves with the updated object.
   * @throws {Error} If the item could not be fetched from the database.
   */
  async loadValues(values, options) {
    var _a, _b, _c;
    this.ignoreCustomerCheck = this.ignoreCustomerCheck || !!(options == null ? void 0 : options.ignoreCustomerCheck);
    const params = new PGParams();
    let where = ``;
    if (Object.keys(values).length > 0) {
      where = "WHERE " + exports.PGSQL.BuildWhereComponents(values, params);
    }
    let sort = "";
    if (options == null ? void 0 : options.sortPrimary) {
      sort += ` ORDER BY ${exports.PGSQL.CleanSQL(options.sortPrimary)} ${((_a = options == null ? void 0 : options.ascendingPrimary) != null ? _a : true) ? "ASC" : "DESC"}`;
      if (options == null ? void 0 : options.sortSecondary) {
        sort += `, ${exports.PGSQL.CleanSQL(options == null ? void 0 : options.sortSecondary)} ${((_b = options == null ? void 0 : options.ascendingSecondary) != null ? _b : true) ? "ASC" : "DESC"}`;
      }
    }
    const result = await exports.PGSQL.FetchOne(
      (_c = this.readerConnection) != null ? _c : this.connection,
      `SELECT *
			 FROM ${this.table} ${where}` + sort,
      params.values
    );
    if (!result) {
      throw new Error(`Could not fetch item ${this.table}`);
    } else {
      this.record = result;
    }
    await this.postSelect();
    this.setBaseline();
    return this;
  }
  /**
   * Loads records by their matching values.
   *
   * @param {Partial<RECORD>} values - The values to match against the records.
   * @param {TLoadOptions<RECORD>} [options] - The options for loading the records.
   * @returns {Promise<this | null>} A Promise that resolves to this object or `null` if an error occurs.
   */
  async loadByValues(values, options) {
    try {
      return await this.loadValues(values, options);
    } catch (err) {
      return null;
    }
  }
  /**
   * Checks if the given values exist.
   *
   * @param {Partial<RECORD>} values - The values to check for existence.
   *
   * @param ignoreCustomerCheck
   * @return {Promise<boolean>} - A promise that resolves to a boolean value indicating if the values exist.
   */
  async existsValues(values, ignoreCustomerCheck = false) {
    try {
      return !!await this.loadValues(values, { ignoreCustomerCheck });
    } catch (err) {
      return false;
    }
  }
  /**
   * Loads the specified values into the object or initializes it if no values are provided.
   *
   * @param {Partial<RECORD>} values - The values to load into the object.
   * @param {Object} [options] - The options for sorting the primary and secondary keys.
   * @param {keyof RECORD} [options.sortPrimary] - The primary key to sort by.
   * @param {boolean} [options.ascendingPrimary] - Specifies whether the primary key should be sorted in ascending order.
   * @param {keyof RECORD} [options.sortSecondary] - The secondary key to sort by.
   * @param {boolean} [options.ascendingSecondary] - Specifies whether the secondary key should be sorted in ascending order.
   *
   * @return {Promise<this>} - The object after loading the values or initializing it.
   */
  async loadValuesOrInitial(values, options) {
    try {
      return await this.loadValues(values, options);
    } catch (err) {
      return this;
    }
  }
  /**
   * Loads the ID or initializes the object.
   *
   * @param {number | string | null | undefined} id - The ID to load or null/undefined to initialize the object.
   * @param ignoreCustomerCheck
   * @return {Promise<this>} - A promise that resolves to the current object.
   */
  async loadIDOrInitial(id, ignoreCustomerCheck = false) {
    if (!id) return this;
    return this.loadValuesOrInitial({ id }, { ignoreCustomerCheck });
  }
  /**
   * Loads values or sets initial values for the record.
   *
   * @param {Partial<RECORD>} values - The values to be loaded or set.
   * @param {Object} [options] - Optional parameters for sorting the primary and secondary keys.
   * @param {keyof RECORD} [options.sortPrimary] - The primary key to sort the values by.
   * @param {boolean} [options.ascendingPrimary] - Indicates whether to sort the primary key in ascending order.
   * @param {keyof RECORD} [options.sortSecondary] - The secondary key to sort the values by.
   * @param {boolean} [options.ascendingSecondary] - Indicates whether to sort the secondary key in ascending order.
   * @returns {Promise<this>} - A Promise that resolves to the current object.
   */
  async loadValuesOrInitialSet(values, options) {
    try {
      return await this.loadValues(values, options);
    } catch (err) {
      this.setFromAny(values);
      return this;
    }
  }
  /**
   * Retrieves a list of records based on the specified IDs.
   *
   * @param {number[] | null} ids - An array of record IDs to retrieve. If not provided or is empty, an empty array will be returned.
   * @returns {Promise<RECORD[]>} - A promise that resolves to an array of record objects.
   */
  async listRecordsByIDs(ids) {
    var _a;
    if (!ids || ids.length === 0) return [];
    const sql = `SELECT *
		             FROM ${this.table}
		             WHERE id = ANY ($1::INT[]) `;
    return await exports.PGSQL.FetchMany((_a = this.readerConnection) != null ? _a : this.connection, sql, [ids]);
  }
  /**
   * Returns a list of records based on the provided values and options.
   *
   * @param {Partial<RECORD>} whereValues - The values to filter the records by.
   * @param {Object} options - The options to customize the query.
   * @param {keyof RECORD} options.sortPrimary - The primary field to sort the records by.
   * @param {boolean} options.ascendingPrimary - Specifies whether to sort the records in ascending order by the primary field.
   * @param {keyof RECORD} options.sortSecondary - The secondary field to sort the records by.
   * @param {boolean} options.ascendingSecondary - Specifies whether to sort the records in ascending order by the secondary field.
   * @param {boolean} options.ignoreCustomerCheck - Specifies whether to ignore customer checks in the query.
   *
   * @returns {Promise<RECORD[]>} The list of records that match the provided values and options.
   */
  async listRecordsByValues(whereValues, options) {
    var _a, _b, _c;
    const params = new PGParams();
    let sql = `SELECT *
		           FROM ${this.table}`;
    if (whereValues) {
      const useValues = Ai(whereValues);
      if (Object.keys(useValues).length > 0) {
        sql += " WHERE " + exports.PGSQL.BuildWhereComponents(useValues, params);
      }
    }
    if (options == null ? void 0 : options.sortPrimary) {
      sql += ` ORDER BY ${exports.PGSQL.CleanSQL(options == null ? void 0 : options.sortPrimary)} ${((_a = options == null ? void 0 : options.ascendingPrimary) != null ? _a : true) ? "ASC" : "DESC"}`;
      if (options == null ? void 0 : options.sortSecondary) {
        sql += `, ${exports.PGSQL.CleanSQL(options == null ? void 0 : options.sortSecondary)} ${((_b = options == null ? void 0 : options.ascendingSecondary) != null ? _b : true) ? "ASC" : "DESC"}`;
      }
    }
    return await exports.PGSQL.FetchMany((_c = this.readerConnection) != null ? _c : this.connection, sql, params.values);
  }
  /**
   * Lists the IDs of records based on the specified values, and sorts the results.
   *
   * @param {Partial<RECORD>} whereValues - Specifies the values to filter the records.
   * @param {keyof RECORD} sortPrimary - Specifies the primary field to sort the records by.
   * @param {boolean} ascendingPrimary - Indicates whether the primary field should be sorted in ascending order (true) or descending order (false). Default is true.
   * @param {keyof RECORD} sortSecondary - Specifies the secondary field to sort the records by.
   * @param {boolean} ascendingSecondary - Indicates whether the secondary field should be sorted in ascending order (true) or descending order (false). Default is true.
   * @return {Promise<number[]>} A promise that resolves with an array of IDs of the filtered and sorted records.
   */
  async listIDsByValues(whereValues, sortPrimary, ascendingPrimary = true, sortSecondary, ascendingSecondary = true) {
    var _a;
    const params = new PGParams();
    let sql = `SELECT id
		           FROM ${this.table}`;
    if (whereValues) {
      const useWhereValues = {};
      for (const key of Object.keys(whereValues)) {
        if (whereValues[key] !== void 0) {
          useWhereValues[key] = whereValues[key];
        }
      }
      if (Object.keys(useWhereValues).length > 0) {
        sql += " WHERE " + exports.PGSQL.BuildWhereComponents(useWhereValues, params);
      }
    }
    if (sortPrimary) {
      sql += ` ORDER BY ${params.add(sortPrimary)} ${ascendingPrimary ? "ASC" : "DESC"}`;
      if (sortSecondary) {
        sql += `, ${params.add(sortSecondary)} ${ascendingSecondary ? "ASC" : "DESC"}`;
      }
    }
    return await exports.PGSQL.FetchArray((_a = this.readerConnection) != null ? _a : this.connection, sql, params.values);
  }
  /**
   * Retrieves a record from the database table based on the given values.
   *
   * @param {Partial<RECORD>} whereValues - An object containing the values used to filter the records.
   * @param {Object} options - An optional object specifying sorting options.
   * @param {keyof RECORD} options.sortPrimary - The primary sort column.
   * @param {boolean} options.ascendingPrimary - Specifies whether to sort the primary column in ascending order. Default is true.
   * @param {keyof RECORD} options.sortSecondary - The secondary sort column.
   * @param {boolean} options.ascendingSecondary - Specifies whether to sort the secondary column in ascending order. Default is true.
   *
   * @return {Promise<RECORD | null>} - A promise that resolves to the retrieved record or null if no record is found.
   */
  async getRecordByValues(whereValues, options) {
    var _a, _b, _c;
    const params = new PGParams();
    let sql = `SELECT *
		           FROM ${this.table}`;
    if (whereValues) {
      if (Object.keys(whereValues).length > 0) {
        sql += " WHERE " + exports.PGSQL.BuildWhereComponents(whereValues, params);
      }
    }
    if (options == null ? void 0 : options.sortPrimary) {
      sql += ` ORDER BY ${exports.PGSQL.CleanSQL(options == null ? void 0 : options.sortPrimary)} ${((_a = options == null ? void 0 : options.ascendingPrimary) != null ? _a : true) ? "ASC" : "DESC"}`;
      if (options == null ? void 0 : options.sortSecondary) {
        sql += `, ${exports.PGSQL.CleanSQL(options == null ? void 0 : options.sortSecondary)} ${((_b = options == null ? void 0 : options.ascendingSecondary) != null ? _b : true) ? "ASC" : "DESC"}`;
      }
    }
    return exports.PGSQL.FetchOne((_c = this.readerConnection) != null ? _c : this.connection, sql, params.values);
  }
  /**
   * Retrieves a record from the database by its ID.
   *
   * @param {number} id - The ID of the record to retrieve.
   * @return {Promise<RECORD>} A promise resolving to the retrieved record.
   * @throws {Error} If the record could not be found.
   */
  async getRecordByID(id) {
    var _a;
    const sql = `SELECT *
		             FROM ${this.table}
		             WHERE id = $1`;
    const one = await exports.PGSQL.FetchOne((_a = this.readerConnection) != null ? _a : this.connection, sql, [id]);
    if (!one) throw new Error("Could not find record");
    return one;
  }
  /**
   * Supporting functions
   */
  /**
   * Performs pre-ID check.
   *
   * @returns {Promise<void>} A promise that resolves with no value.
   */
  async preIDCheck() {
  }
  /**
   * This method is called before saving a record, either insert or update
   *
   * @returns {Promise<void>} - A promise that resolves when the pre-save operations are complete.
   */
  async preSave() {
  }
  /**
   * Performs pre-insert operations before inserting data into the database.
   * This method is asynchronous.
   *
   * @returns {Promise<void>} A promise that resolves with no value when the pre-insert operations are completed.
   */
  async preInsert() {
    return this.preSave();
  }
  /**
   * This method is called before updating a record.
   * It can be overridden in child classes to perform custom logic or validation.
   *
   * @return {Promise<void>} - A promise that resolves when the pre-update process is complete.
   */
  async preUpdate() {
    return this.preSave();
  }
  /**
   * Performs actions before deletion.
   *
   * @return {Promise<void>} A promise that resolves when the pre-delete actions are completed or rejects with an error.
   */
  async preDelete() {
  }
  /**
   * Performs actions after save (insert or update).
   *
   * @return {Promise<void>} A promise that resolves when the save operation is complete.
   */
  async postSave() {
  }
  /**
   * Performs the operations after inserting a record.
   * Calls the 'postSave' method to handle the post-save operations.
   *
   * @return {Promise<void>} A promise that resolves after the post-insert operations are completed.
   */
  async postInsert() {
    await this.postSave();
  }
  /**
   * Updates the post by calling the postSave method asynchronously.
   *
   * @return {Promise<void>} A promise that resolves when the update is complete.
   */
  async postUpdate() {
    await this.postSave();
  }
  /**
   * Deletes a post.
   *
   * @returns {Promise<void>} A Promise that resolves when the post is deleted.
   */
  async postDelete() {
  }
  /**
   * Executes the postSelect method.
   *
   * @returns {Promise} A promise that resolves once the postSelect method is executed.
   */
  async postSelect() {
    await this.convertAfterLoad();
  }
  /**
   * Returns the object to be saved.
   *
   * @protected
   * @returns {any} - The object to be saved, or the original record if no modifications are required.
   */
  objectToSave() {
    var _a;
    if (this.record) {
      const obj = { ...this.record };
      if (this.constraint) {
        for (const key of Object.keys((_a = this.constraint) != null ? _a : {})) {
          if (this.constraint[key].type === "object" && this.constraint[key].isArray && typeof obj[key] !== "string") {
            obj[key] = JSON.stringify(obj[key]);
          }
        }
      }
      for (const excludeColumnSave of this.excludeColumnsSave) {
        delete obj[excludeColumnSave];
      }
      return obj;
    }
    return this.record;
  }
  /**
   * Returns the object to be inserted into the database.
   *
   * @protected
   * @returns {any} The object to be inserted.
   */
  objectToInsert() {
    const obj = this.objectToSave();
    if (obj) {
      for (const excludeColumnInsert of this.excludeColumnsInsert) {
        delete obj[excludeColumnInsert];
      }
    }
    return obj;
  }
  /**
   * Returns the object to be updated by removing the excluded columns from the object to be saved.
   *
   * @protected
   * @returns {any} The updated object, or null if the object to be saved is null.
   */
  objectToUpdate() {
    const obj = this.objectToSave();
    if (obj) {
      for (const excludeColumnUpdate of this.excludeColumnsUpdate) {
        delete obj[excludeColumnUpdate];
      }
    }
    return obj;
  }
  /**
   * Sets the baseline for the current object.
   *
   * @protected
   * @returns {this} The current object with the baseline set.
   */
  setBaseline() {
    if (this.constraint) {
      this.recordBaseline = Va(this.record, this.constraint);
    } else {
      this.recordBaseline = { ...this.record };
    }
    return this;
  }
  /**
   * Checks if the baseline has changed for the specified column(s) or all columns.
   *
   * @param {keyof RECORD | (keyof RECORD)[]} [forColumn] - The column(s) to check for changes.
   * If not provided, all columns will be checked.
   * @return {boolean} - Returns true if the baseline has changed for the specified column(s)
   * or all columns, false otherwise.
   */
  hasBaselineChanged(forColumn) {
    if (forColumn) {
      const columns = Array.isArray(forColumn) ? forColumn : [forColumn];
      return !!columns.find((column) => this.record[column] !== this.recordBaseline[column]);
    } else {
      let key;
      for (key in this.record) {
        if (!this.excludeColumnsSave.includes(key)) {
          if (this.record[key] !== this.recordBaseline[key]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  reportDiffs(comparedTo) {
    const results = {};
    let key;
    for (key in this.record) {
      if (!this.excludeColumnsSave.includes(key)) {
        if (this.record[key] !== comparedTo[key]) {
          results[key] = this.record[key];
        }
      }
    }
    return results;
  }
  /**
   * Sets whether or not to ignore customer check for this instance.
   *
   * @param {boolean} ignore - Indicates whether to ignore customer check or not.
   * @return {this} - Returns the current instance.
   */
  setIgnoreCustomerCheck(ignore = true) {
    this.ignoreCustomerCheck = ignore;
    return this;
  }
  /**
   * Ignores or resets the reader connection by setting it to undefined.
   *
   * @return {this} The instance of the class on which the method was called.
   */
  ignoreReaderConnection() {
    this.readerConnection = void 0;
    return this;
  }
  /**
   * Pipes a CSV stream into the database table.
   *
   * @param {Transform} pipeStream - The CSV stream to pipe into the database.
   * @param {IStreamInCSVOptions<RECORD>} [options] - Optional options for the CSV import.
   * @returns {void}
   */
  // public pipeInCSV(pipeStream: Transform, options?: IStreamInCSVOptions<RECORD>) {
  // 	if (!('query' in this.connection)) throw new Error('Could not load query in connection')
  //
  // 	const useColumns = options?.columns ??
  // 		((options?.excludeColumns ?? this.defaultImportExcludeColumns ?? []).length ?
  // 			Object.keys(this.recordDefault)
  // 			      .filter(key => !((options?.excludeColumns ?? this.defaultImportExcludeColumns ?? [])?.includes(key))) :
  // 			this.defaultImportColumns)
  //
  // 	const sql = `
  // 		COPY ${this.table} ${(useColumns ?? []).length > 0 ? `(${useColumns?.join(',')})` : ''} FROM STDIN
  // 		(
  // 		FORMAT ${options?.format ?? 'CSV'},
  // 		DELIMITER '${options?.delimiter ?? ','}'
  // 		${(options?.header ?? true) ? ', HEADER ' : ''}
  // 		)`
  //
  // 	return pipeStream.pipe(this.connection.query(copyStream.from(sql)))
  // }
  /**
   * Converts the data into a format suitable for saving.  Designed for encrypting data.
   *
   * @protected
   * @returns {Promise} A promise that resolves when the conversion is complete.
   */
  async convertToSave() {
  }
  /**
   * Converts data after it has been loaded.  Designed for de-crypting data.
   *
   * @protected
   * @return {Promise<void>} A promise that resolves when the data has been converted.
   */
  async convertAfterLoad() {
  }
}
class PGView {
  constructor(instanceData) {
    this.name = "";
    this.definition = "";
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
  static async GetFromDB(connection, name) {
    const definition = await exports.PGSQL.ViewData(connection, name);
    if (!!definition) {
      return new PGView({ name, definition });
    }
    return null;
  }
  ddlDefinition() {
    return `CREATE OR REPLACE VIEW ${this.name} AS ${this.definition}`;
  }
  async writeToDB(connection) {
    if (!!this.name && !!this.definition) {
      return exports.PGSQL.Execute(connection, this.ddlDefinition());
    }
    return null;
  }
}
class PGMatView {
  constructor(instanceData) {
    this.name = "";
    this.definition = "";
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
  static async GetFromDB(connection, name) {
    const definition = await exports.PGSQL.ViewsMatData(connection, name);
    if (!!definition) {
      return new PGMatView({ name, definition });
    }
    return null;
  }
  ddlDefinition() {
    return `CREATE MATERIALIZED VIEW ${this.name} AS ${this.definition}`;
  }
  async writeToDB(connection) {
    if (!!this.name && !!this.definition) {
      return await exports.PGSQL.Execute(connection, this.ddlDefinition());
    }
    return null;
  }
}
class PGFunc {
  constructor(instanceData) {
    this.name = "";
    this.definition = "";
    if (instanceData) {
      this.deserialize(instanceData);
    }
  }
  deserialize(instanceData) {
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
  static async GetFromDB(connection, name) {
    const definition = await exports.PGSQL.ViewData(connection, name);
    if (!!definition) {
      return new PGFunc({ name, definition });
    }
    return null;
  }
  ddlDefinition() {
    return this.definition;
  }
  async writeToDB(connection) {
    if (!!this.name && !!this.definition) {
      return exports.PGSQL.Execute(connection, this.ddlDefinition());
    }
    return null;
  }
}
const PGWhereSearchClause = (search, params, fields, startWithAnd = true) => {
  let where = "";
  let andAdded = false;
  if (!!search && fields.length > 0) {
    const terms = Ye(search);
    for (const term of terms) {
      if (andAdded || startWithAnd) where += "AND ";
      andAdded = true;
      where += `CONCAT_WS('|',` + fields.join(",") + `) ILIKE ${params.addLike(term)} `;
    }
  }
  return where;
};
exports.CTableBase = CTableBase;
exports.IsValidPostgresInteger = IsValidPostgresInteger;
exports.KeyboardKey = KeyboardKey;
exports.KeyboardLine = KeyboardLine;
exports.PGColumn = PGColumn;
exports.PGEnum = PGEnum;
exports.PGForeignKey = PGForeignKey;
exports.PGFunc = PGFunc;
exports.PGIndex = PGIndex;
exports.PGMatView = PGMatView;
exports.PGParams = PGParams;
exports.PGTable = PGTable;
exports.PGView = PGView;
exports.PGWhereSearchClause = PGWhereSearchClause;
exports.PaginatorApplyRowCount = PaginatorApplyRowCount;
exports.PaginatorInitializeResponseFromRequest = PaginatorInitializeResponseFromRequest;
exports.PaginatorResponseFromRequestCount = PaginatorResponseFromRequestCount;
exports.PaginatorReturnRowCount = PaginatorReturnRowCount;
exports.TS_EOL = TS_EOL;
exports.initialFixedWidthMapOptions = initialFixedWidthMapOptions;
//# sourceMappingURL=main.cjs.map
