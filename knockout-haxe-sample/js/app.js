(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = true;
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var haxe = {};
haxe.Resource = function() { };
haxe.Resource.__name__ = true;
haxe.Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe.crypto.Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe.io.Bytes
};
haxe.crypto = {};
haxe.crypto.Base64 = function() { };
haxe.crypto.Base64.__name__ = true;
haxe.crypto.Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe.crypto.BaseCode(haxe.crypto.Base64.BYTES).decodeBytes(haxe.io.Bytes.ofString(str));
};
haxe.crypto.BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw "BaseCode : base length must be a power of two.";
	this.base = base;
	this.nbits = nbits;
};
haxe.crypto.BaseCode.__name__ = true;
haxe.crypto.BaseCode.prototype = {
	initTable: function() {
		var tbl = new Array();
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe.io.Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.get(pin++)];
				if(i == -1) throw "BaseCode : invalid encoded char";
				buf |= i;
			}
			curbits -= 8;
			out.set(pout++,buf >> curbits & 255);
		}
		return out;
	}
	,__class__: haxe.crypto.BaseCode
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io.Eof = function() { };
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; return $x; };
var ks = {};
ks.DiContainer = function() {
	this.container = new haxe.ds.StringMap();
	this.shared_objects = new haxe.ds.StringMap();
};
ks.DiContainer.__name__ = true;
ks.DiContainer.getInstance = function() {
	if(Type["typeof"](ks.DiContainer.instance) == ValueType.TNull) ks.DiContainer.instance = new ks.DiContainer();
	return ks.DiContainer.instance;
};
ks.DiContainer.prototype = {
	register: function(key,cb) {
		if(this.container.exists(key)) throw "Already exists key in container.";
		this.container.set(key,cb);
	}
	,make: function(key) {
		if(!this.container.exists(key)) throw "Not found key in container.";
		return (this.container.get(key))();
	}
	,share: function(key) {
		if(!this.shared_objects.exists(key)) {
			var value = this.make(key);
			this.shared_objects.set(key,value);
		}
		return this.shared_objects.get(key);
	}
	,__class__: ks.DiContainer
};
ks.Main = function() { };
ks.Main.__name__ = true;
ks.Main.boot = function() {
	var writer_api = ks.Service.getApi(ks.SERVICE_API.WRITER);
	var blog_api = ks.Service.getApi(ks.SERVICE_API.BLOG);
	new ks.components.HeaderNav();
	new ks.components.LoginForm();
	ks.Main.registeBlogrWriterComponent().then(ks.Main.registerBlogMainComponent,ks.Main.deferredOnError).then(ks.Main.registerBlogSubComponent,ks.Main.deferredOnError).then(function() {
		ko.applyBindings({ });
	},ks.Main.deferredOnError);
};
ks.Main.registeBlogrWriterComponent = function() {
	var d = $.Deferred();
	ks.Service.getApi(ks.SERVICE_API.WRITER).get({ id : 1},function(res) {
		var writer = new ks.data.Writer(res.data);
		new ks.components.BlogWriter(writer);
		d.resolve(writer);
	},function(e) {
		d.reject(e);
	});
	return d.promise();
};
ks.Main.registerBlogMainComponent = function(writer) {
	var d = $.Deferred();
	var request_params = { writer_id : writer.get_id(), blog_id : writer.get_top_blog_id()};
	ks.Service.getApi(ks.SERVICE_API.BLOG).get(request_params,function(res) {
		var blog = new ks.data.Blog(res.data);
		new ks.components.BlogHeader(blog);
		new ks.components.BlogSwitchMenu();
		new ks.components.BlogContent(blog);
		d.resolve(writer);
	},function(e) {
		d.reject(e);
	});
	return d.promise();
};
ks.Main.registerBlogSubComponent = function(writer) {
	var d = $.Deferred();
	ks.Service.getApi(ks.SERVICE_API.BLOG).get({ writer_id : writer.get_id()},function(res) {
		var blog_items = new ks.data.BlogItems(res.data);
		new ks.components.BlogList(writer.get_id(),blog_items.get_items());
		d.resolve();
	},function(e) {
		d.reject(e);
	});
	return d.promise();
};
ks.Main.deferredOnError = function(e) {
	if(Type["typeof"](e) != ValueType.TNull) console.log(e);
};
ks.Main.main = function() {
	new $(function() {
		ks.Service.registerApi(ks.SERVICE_API.BLOG,function() {
			return new ks.services.api.BlogApi();
		});
		ks.Service.registerApi(ks.SERVICE_API.WRITER,function() {
			return new ks.services.api.WriterApi();
		});
		ks.Service.registerEvent(ks.SERVICE_EVENT.BLOG_INIT_MENU,function() {
			return new ks.services.event.InitBlogMenuEvent();
		});
		ks.Service.registerEvent(ks.SERVICE_EVENT.BLOG_SWITCH_MENU,function() {
			return new ks.services.event.SwitchBlogMenuEvent();
		});
		ks.Service.registerEvent(ks.SERVICE_EVENT.BLOG_SWITCH_CONTENT,function() {
			return new ks.services.event.SwitchBlogContentEvent();
		});
		ks.Service.registerEvent(ks.SERVICE_EVENT.LOGINED,function() {
			return new ks.services.event.LoginedEvent();
		});
		ks.Service.registerEvent(ks.SERVICE_EVENT.LOGOUTED,function() {
			return new ks.services.event.LogoutedEvent();
		});
		ks.Main.boot();
	});
};
ks.SERVICE_EVENT = { __ename__ : true, __constructs__ : ["BLOG_INIT_MENU","BLOG_SWITCH_MENU","BLOG_SWITCH_CONTENT","LOGINED","LOGOUTED"] };
ks.SERVICE_EVENT.BLOG_INIT_MENU = ["BLOG_INIT_MENU",0];
ks.SERVICE_EVENT.BLOG_INIT_MENU.__enum__ = ks.SERVICE_EVENT;
ks.SERVICE_EVENT.BLOG_SWITCH_MENU = ["BLOG_SWITCH_MENU",1];
ks.SERVICE_EVENT.BLOG_SWITCH_MENU.__enum__ = ks.SERVICE_EVENT;
ks.SERVICE_EVENT.BLOG_SWITCH_CONTENT = ["BLOG_SWITCH_CONTENT",2];
ks.SERVICE_EVENT.BLOG_SWITCH_CONTENT.__enum__ = ks.SERVICE_EVENT;
ks.SERVICE_EVENT.LOGINED = ["LOGINED",3];
ks.SERVICE_EVENT.LOGINED.__enum__ = ks.SERVICE_EVENT;
ks.SERVICE_EVENT.LOGOUTED = ["LOGOUTED",4];
ks.SERVICE_EVENT.LOGOUTED.__enum__ = ks.SERVICE_EVENT;
ks.SERVICE_API = { __ename__ : true, __constructs__ : ["BLOG","WRITER"] };
ks.SERVICE_API.BLOG = ["BLOG",0];
ks.SERVICE_API.BLOG.__enum__ = ks.SERVICE_API;
ks.SERVICE_API.WRITER = ["WRITER",1];
ks.SERVICE_API.WRITER.__enum__ = ks.SERVICE_API;
ks.Service = function() { };
ks.Service.__name__ = true;
ks.Service.getEvent = function(service_key,share) {
	if(share == null) share = true;
	return ks.Service.get(ks.Service.event_to_s(service_key),share);
};
ks.Service.registerEvent = function(service_key,cb) {
	ks.Service.register(ks.Service.event_to_s(service_key),cb);
};
ks.Service.getApi = function(service_key,share) {
	if(share == null) share = true;
	return ks.Service.get(ks.Service.api_to_s(service_key),share);
};
ks.Service.registerApi = function(service_key,cb) {
	ks.Service.register(ks.Service.api_to_s(service_key),cb);
};
ks.Service.get = function(key,share) {
	var di = ks.DiContainer.getInstance();
	if(share) return di.share(key); else return di.make(key);
};
ks.Service.register = function(key,cb) {
	ks.DiContainer.getInstance().register(key,cb);
};
ks.Service.event_to_s = function(event) {
	switch(event[1]) {
	case 0:
		return "blog-initialize-menu-event";
	case 1:
		return "blog-switch-menu-event";
	case 2:
		return "blog-switch-content-event";
	case 3:
		return "logined-event";
	case 4:
		return "logouted-event";
	}
};
ks.Service.api_to_s = function(api) {
	switch(api[1]) {
	case 0:
		return "blog-api";
	case 1:
		return "writer-api";
	}
};
ks.components = {};
ks.components.BlogContent = function(data) {
	ko.components.register("blog-content",{ viewModel : { instance : new ks.view_models.BlogContentViewModel(data)}, template : ks.enums.EnumResource.toTemplate(ks.enums.RESOURCE.BLOG_CONTENT)});
};
ks.components.BlogContent.__name__ = true;
ks.components.BlogContent.prototype = {
	__class__: ks.components.BlogContent
};
ks.components.BlogHeader = function(data) {
	ko.components.register("blog-header",{ viewModel : { instance : new ks.view_models.BlogHeaderViewModel(data)}, template : ks.enums.EnumResource.toTemplate(ks.enums.RESOURCE.BLOG_HEADER)});
};
ks.components.BlogHeader.__name__ = true;
ks.components.BlogHeader.prototype = {
	__class__: ks.components.BlogHeader
};
ks.components.BlogList = function(writer_id,data) {
	ko.components.register("blog-list",{ viewModel : { instance : new ks.view_models.BlogListViewModel(writer_id,data)}, template : ks.enums.EnumResource.toTemplate(ks.enums.RESOURCE.BLOG_LIST)});
};
ks.components.BlogList.__name__ = true;
ks.components.BlogList.prototype = {
	__class__: ks.components.BlogList
};
ks.components.BlogSwitchMenu = function() {
	ko.components.register("blog-switch-menu",{ viewModel : { instance : new ks.view_models.BlogSwitchMenuViewModel()}, template : ks.enums.EnumResource.toTemplate(ks.enums.RESOURCE.BLOG_SWITCH_MENU)});
};
ks.components.BlogSwitchMenu.__name__ = true;
ks.components.BlogSwitchMenu.prototype = {
	__class__: ks.components.BlogSwitchMenu
};
ks.components.BlogWriter = function(data) {
	ko.components.register("blog-writer",{ viewModel : { instance : new ks.view_models.BlogWriterViewModel(data)}, template : ks.enums.EnumResource.toTemplate(ks.enums.RESOURCE.BLOG_WRITER)});
};
ks.components.BlogWriter.__name__ = true;
ks.components.BlogWriter.prototype = {
	__class__: ks.components.BlogWriter
};
ks.components.HeaderNav = function() {
	ko.components.register("header-nav",{ viewModel : { instance : new ks.view_models.HeaderNavViewModel()}, template : ks.enums.EnumResource.toTemplate(ks.enums.RESOURCE.HEADER_NAV)});
};
ks.components.HeaderNav.__name__ = true;
ks.components.HeaderNav.prototype = {
	__class__: ks.components.HeaderNav
};
ks.components.LoginForm = function() {
	ko.components.register("login-form",{ viewModel : { instance : new ks.view_models.LoginFormViewModel()}, template : ks.enums.EnumResource.toTemplate(ks.enums.RESOURCE.LOGIN_FORM)});
};
ks.components.LoginForm.__name__ = true;
ks.components.LoginForm.prototype = {
	__class__: ks.components.LoginForm
};
ks.data = {};
ks.data.Blog = function(data) {
	this.set_id(data.id);
	this.set_title(data.title);
	this.set_content(data.content);
	this.set_date(data.date);
};
ks.data.Blog.__name__ = true;
ks.data.Blog.prototype = {
	get_id: function() {
		return this.id;
	}
	,set_id: function(id) {
		return this.id = id;
	}
	,get_title: function() {
		return this.title;
	}
	,set_title: function(title) {
		return this.title = title;
	}
	,get_content: function() {
		return this.content;
	}
	,set_content: function(content) {
		return this.content = content;
	}
	,get_date: function() {
		return this.date;
	}
	,set_date: function(date) {
		return this.date = date;
	}
	,__class__: ks.data.Blog
};
ks.data.BlogItems = function(data) {
	this.items = data;
};
ks.data.BlogItems.__name__ = true;
ks.data.BlogItems.prototype = {
	get_items: function() {
		return this.items;
	}
	,__class__: ks.data.BlogItems
};
ks.data.Writer = function(data) {
	this.set_id(data.id);
	this.set_name(data.name);
	this.set_profile(data.profile);
	this.set_top_blog_id(data.top_blog_id);
	this.set_wiki_link(data.wiki_link);
};
ks.data.Writer.__name__ = true;
ks.data.Writer.prototype = {
	get_id: function() {
		return this.id;
	}
	,set_id: function(id) {
		return this.id = id;
	}
	,get_name: function() {
		return this.name;
	}
	,set_name: function(name) {
		return this.name = name;
	}
	,get_profile: function() {
		return this.profile;
	}
	,set_profile: function(profile) {
		return this.profile = profile;
	}
	,get_top_blog_id: function() {
		return this.top_blog_id;
	}
	,set_top_blog_id: function(top_blog_id) {
		return this.top_blog_id = top_blog_id;
	}
	,get_wiki_link: function() {
		return this.wiki_link;
	}
	,set_wiki_link: function(wiki_link) {
		return this.wiki_link = wiki_link;
	}
	,__class__: ks.data.Writer
};
ks.enums = {};
ks.enums.EVENT_KEY = { __ename__ : true, __constructs__ : ["INIT_BLOG_MENU","SWITCH_BLOG_MENU","SWITCH_BLOG_CONTENT","LOGINED","LOGOUTED"] };
ks.enums.EVENT_KEY.INIT_BLOG_MENU = ["INIT_BLOG_MENU",0];
ks.enums.EVENT_KEY.INIT_BLOG_MENU.__enum__ = ks.enums.EVENT_KEY;
ks.enums.EVENT_KEY.SWITCH_BLOG_MENU = ["SWITCH_BLOG_MENU",1];
ks.enums.EVENT_KEY.SWITCH_BLOG_MENU.__enum__ = ks.enums.EVENT_KEY;
ks.enums.EVENT_KEY.SWITCH_BLOG_CONTENT = ["SWITCH_BLOG_CONTENT",2];
ks.enums.EVENT_KEY.SWITCH_BLOG_CONTENT.__enum__ = ks.enums.EVENT_KEY;
ks.enums.EVENT_KEY.LOGINED = ["LOGINED",3];
ks.enums.EVENT_KEY.LOGINED.__enum__ = ks.enums.EVENT_KEY;
ks.enums.EVENT_KEY.LOGOUTED = ["LOGOUTED",4];
ks.enums.EVENT_KEY.LOGOUTED.__enum__ = ks.enums.EVENT_KEY;
ks.enums.EnumEvent = function() { };
ks.enums.EnumEvent.__name__ = true;
ks.enums.EnumEvent.to_s = function(key) {
	switch(key[1]) {
	case 0:
		return "initialize-blog-menu";
	case 1:
		return "switch-blog-menu";
	case 2:
		return "switch-blog-content";
	case 3:
		return "logined";
	case 4:
		return "logouted";
	}
};
ks.enums.RESOURCE = { __ename__ : true, __constructs__ : ["BLOG_HEADER","BLOG_CONTENT","BLOG_SWITCH_MENU","BLOG_WRITER","BLOG_LIST","HEADER_NAV","LOGIN_FORM"] };
ks.enums.RESOURCE.BLOG_HEADER = ["BLOG_HEADER",0];
ks.enums.RESOURCE.BLOG_HEADER.__enum__ = ks.enums.RESOURCE;
ks.enums.RESOURCE.BLOG_CONTENT = ["BLOG_CONTENT",1];
ks.enums.RESOURCE.BLOG_CONTENT.__enum__ = ks.enums.RESOURCE;
ks.enums.RESOURCE.BLOG_SWITCH_MENU = ["BLOG_SWITCH_MENU",2];
ks.enums.RESOURCE.BLOG_SWITCH_MENU.__enum__ = ks.enums.RESOURCE;
ks.enums.RESOURCE.BLOG_WRITER = ["BLOG_WRITER",3];
ks.enums.RESOURCE.BLOG_WRITER.__enum__ = ks.enums.RESOURCE;
ks.enums.RESOURCE.BLOG_LIST = ["BLOG_LIST",4];
ks.enums.RESOURCE.BLOG_LIST.__enum__ = ks.enums.RESOURCE;
ks.enums.RESOURCE.HEADER_NAV = ["HEADER_NAV",5];
ks.enums.RESOURCE.HEADER_NAV.__enum__ = ks.enums.RESOURCE;
ks.enums.RESOURCE.LOGIN_FORM = ["LOGIN_FORM",6];
ks.enums.RESOURCE.LOGIN_FORM.__enum__ = ks.enums.RESOURCE;
ks.enums.EnumResource = function() { };
ks.enums.EnumResource.__name__ = true;
ks.enums.EnumResource.toTemplate = function(resouce) {
	switch(resouce[1]) {
	case 0:
		return haxe.Resource.getString("blog-header");
	case 1:
		return haxe.Resource.getString("blog-content");
	case 2:
		return haxe.Resource.getString("blog-switch-menu");
	case 3:
		return haxe.Resource.getString("blog-writer");
	case 4:
		return haxe.Resource.getString("blog-list");
	case 5:
		return haxe.Resource.getString("header-nav");
	case 6:
		return haxe.Resource.getString("login-form");
	}
};
ks.services = {};
ks.services.api = {};
ks.services.api.BaseApi = function() {
	this.base_resouce_path = "/knockout-haxe-sample/api";
};
ks.services.api.BaseApi.__name__ = true;
ks.services.api.BaseApi.prototype = {
	baseDoneCallBack: function(response) {
		console.log(response);
	}
	,baseFailCallBack: function(err) {
		console.log(err);
	}
	,baseAlwaysCallBack: function() {
	}
	,__class__: ks.services.api.BaseApi
};
ks.services.api.RestApi = function() { };
ks.services.api.RestApi.__name__ = true;
ks.services.api.RestApi.prototype = {
	__class__: ks.services.api.RestApi
};
ks.services.api.BlogApi = function() {
	ks.services.api.BaseApi.call(this);
	this.resouce = "" + this.base_resouce_path + "/writer/:writer_id/blog";
};
ks.services.api.BlogApi.__name__ = true;
ks.services.api.BlogApi.__interfaces__ = [ks.services.api.RestApi];
ks.services.api.BlogApi.__super__ = ks.services.api.BaseApi;
ks.services.api.BlogApi.prototype = $extend(ks.services.api.BaseApi.prototype,{
	get: function(params,done_cb,fail_cb,always_cb) {
		var done;
		if(done_cb != null) done = done_cb; else done = $bind(this,this.baseDoneCallBack);
		var fail;
		if(fail_cb != null) fail = fail_cb; else fail = $bind(this,this.baseFailCallBack);
		var always;
		if(always_cb != null) always = always_cb; else always = $bind(this,this.baseAlwaysCallBack);
		$.getJSON(this.makeResouceUrl(params),{ }).done(done).fail(fail).always(always);
	}
	,patch: function(params,done_cb,fail_cb,always_cb) {
		console.log("This method is imcompatible.");
	}
	,makeResouceUrl: function(params) {
		var url = StringTools.replace(this.resouce,":writer_id",params.writer_id == null?"null":"" + params.writer_id);
		if(Type["typeof"](params.blog_id) == ValueType.TNull) return url + ".json";
		var id;
		if(params.blog_id == null) id = "null"; else id = "" + params.blog_id;
		return url + ("/" + id + ".json");
	}
	,__class__: ks.services.api.BlogApi
});
ks.services.api.WriterApi = function() {
	ks.services.api.BaseApi.call(this);
	this.resouce = "" + this.base_resouce_path + "/writer/";
};
ks.services.api.WriterApi.__name__ = true;
ks.services.api.WriterApi.__interfaces__ = [ks.services.api.RestApi];
ks.services.api.WriterApi.__super__ = ks.services.api.BaseApi;
ks.services.api.WriterApi.prototype = $extend(ks.services.api.BaseApi.prototype,{
	get: function(params,done_cb,fail_cb,always_cb) {
		var id;
		if(params.id == null) id = "null"; else id = "" + params.id;
		var done;
		if(done_cb != null) done = done_cb; else done = $bind(this,this.baseDoneCallBack);
		var fail;
		if(fail_cb != null) fail = fail_cb; else fail = $bind(this,this.baseFailCallBack);
		var always;
		if(always_cb != null) always = always_cb; else always = $bind(this,this.baseAlwaysCallBack);
		$.getJSON("" + this.resouce + id + ".json",{ }).done(done).fail(fail).always(always);
	}
	,patch: function(params,done_cb,fail_cb,always_cb) {
		console.log("This method is imcompatible.");
	}
	,__class__: ks.services.api.WriterApi
});
ks.services.event = {};
ks.services.event.BaseEvent = function(e,type,bubbles,cancelable) {
	if(cancelable == null) cancelable = true;
	if(bubbles == null) bubbles = false;
	if(type == null) type = "CustomEvent";
	this.key = ks.enums.EnumEvent.to_s(e);
	this.event = window.document.createEvent(type);
	this.event.initEvent(this.key,bubbles,cancelable);
};
ks.services.event.BaseEvent.__name__ = true;
ks.services.event.BaseEvent.prototype = {
	getBindData: function() {
		return this.data;
	}
	,__class__: ks.services.event.BaseEvent
};
ks.services.event.EventTarget = function() { };
ks.services.event.EventTarget.__name__ = true;
ks.services.event.EventTarget.prototype = {
	__class__: ks.services.event.EventTarget
};
ks.services.event.InitBlogMenuEvent = function() {
	ks.services.event.BaseEvent.call(this,ks.enums.EVENT_KEY.INIT_BLOG_MENU);
};
ks.services.event.InitBlogMenuEvent.__name__ = true;
ks.services.event.InitBlogMenuEvent.__interfaces__ = [ks.services.event.EventTarget];
ks.services.event.InitBlogMenuEvent.__super__ = ks.services.event.BaseEvent;
ks.services.event.InitBlogMenuEvent.prototype = $extend(ks.services.event.BaseEvent.prototype,{
	dispatch: function(data) {
		if(data == null) this.data = { }; else this.data = data;
		window.dispatchEvent(this.event);
	}
	,on: function(listener,useCaputur) {
		if(useCaputur == null) useCaputur = false;
		window.addEventListener(ks.enums.EnumEvent.to_s(ks.enums.EVENT_KEY.INIT_BLOG_MENU),(function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})(listener,$bind(this,this.getBindData)),useCaputur);
	}
	,__class__: ks.services.event.InitBlogMenuEvent
});
ks.services.event.LoginedEvent = function() {
	ks.services.event.BaseEvent.call(this,ks.enums.EVENT_KEY.LOGINED);
};
ks.services.event.LoginedEvent.__name__ = true;
ks.services.event.LoginedEvent.__interfaces__ = [ks.services.event.EventTarget];
ks.services.event.LoginedEvent.__super__ = ks.services.event.BaseEvent;
ks.services.event.LoginedEvent.prototype = $extend(ks.services.event.BaseEvent.prototype,{
	dispatch: function(data) {
		if(data == null) this.data = { }; else this.data = data;
		window.dispatchEvent(this.event);
	}
	,on: function(listener,useCaputur) {
		if(useCaputur == null) useCaputur = false;
		window.addEventListener(ks.enums.EnumEvent.to_s(ks.enums.EVENT_KEY.LOGINED),(function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})(listener,$bind(this,this.getBindData)),useCaputur);
	}
	,__class__: ks.services.event.LoginedEvent
});
ks.services.event.LogoutedEvent = function() {
	ks.services.event.BaseEvent.call(this,ks.enums.EVENT_KEY.LOGOUTED);
};
ks.services.event.LogoutedEvent.__name__ = true;
ks.services.event.LogoutedEvent.__interfaces__ = [ks.services.event.EventTarget];
ks.services.event.LogoutedEvent.__super__ = ks.services.event.BaseEvent;
ks.services.event.LogoutedEvent.prototype = $extend(ks.services.event.BaseEvent.prototype,{
	dispatch: function(data) {
		if(data == null) this.data = { }; else this.data = data;
		window.dispatchEvent(this.event);
	}
	,on: function(listener,useCaputur) {
		if(useCaputur == null) useCaputur = false;
		window.addEventListener(ks.enums.EnumEvent.to_s(ks.enums.EVENT_KEY.LOGOUTED),(function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})(listener,$bind(this,this.getBindData)),useCaputur);
	}
	,__class__: ks.services.event.LogoutedEvent
});
ks.services.event.SwitchBlogContentEvent = function() {
	ks.services.event.BaseEvent.call(this,ks.enums.EVENT_KEY.SWITCH_BLOG_CONTENT);
};
ks.services.event.SwitchBlogContentEvent.__name__ = true;
ks.services.event.SwitchBlogContentEvent.__interfaces__ = [ks.services.event.EventTarget];
ks.services.event.SwitchBlogContentEvent.__super__ = ks.services.event.BaseEvent;
ks.services.event.SwitchBlogContentEvent.prototype = $extend(ks.services.event.BaseEvent.prototype,{
	dispatch: function(data) {
		if(data == null) this.data = { }; else this.data = data;
		window.dispatchEvent(this.event);
	}
	,on: function(listener,useCaputur) {
		if(useCaputur == null) useCaputur = false;
		window.addEventListener(ks.enums.EnumEvent.to_s(ks.enums.EVENT_KEY.SWITCH_BLOG_CONTENT),(function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})(listener,$bind(this,this.getBindData)),useCaputur);
	}
	,__class__: ks.services.event.SwitchBlogContentEvent
});
ks.services.event.SwitchBlogMenuEvent = function() {
	ks.services.event.BaseEvent.call(this,ks.enums.EVENT_KEY.SWITCH_BLOG_MENU);
};
ks.services.event.SwitchBlogMenuEvent.__name__ = true;
ks.services.event.SwitchBlogMenuEvent.__interfaces__ = [ks.services.event.EventTarget];
ks.services.event.SwitchBlogMenuEvent.__super__ = ks.services.event.BaseEvent;
ks.services.event.SwitchBlogMenuEvent.prototype = $extend(ks.services.event.BaseEvent.prototype,{
	dispatch: function(data) {
		if(data == null) this.data = { }; else this.data = data;
		window.dispatchEvent(this.event);
	}
	,on: function(listener,useCaputur) {
		if(useCaputur == null) useCaputur = false;
		window.addEventListener(ks.enums.EnumEvent.to_s(ks.enums.EVENT_KEY.SWITCH_BLOG_MENU),(function(f,a1) {
			return function(a2) {
				return f(a1,a2);
			};
		})(listener,$bind(this,this.getBindData)),useCaputur);
	}
	,__class__: ks.services.event.SwitchBlogMenuEvent
});
ks.view_models = {};
ks.view_models.BlogContentViewModel = function(data) {
	this.id = data.get_id();
	this.content = ko.observable(data.get_content());
	this.editable = ko.observable(false);
	this.focused = ko.observable(false);
	this.onBlogMenuSwitched();
	this.onPageChange();
	this.content.subscribe($bind(this,this.save),null,null);
};
ks.view_models.BlogContentViewModel.__name__ = true;
ks.view_models.BlogContentViewModel.prototype = {
	onBlogMenuSwitched: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_SWITCH_MENU).on(function(data,event) {
			var newValue = !_g.editable();
			_g.editable(newValue);
			var newValue1 = !_g.focused();
			_g.focused(newValue1);
		});
	}
	,onPageChange: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_SWITCH_CONTENT).on(function(cb,e) {
			var blog = cb();
			ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_INIT_MENU).dispatch();
			var newValue = blog.get_content();
			_g.content(newValue);
			_g.editable(false);
			_g.focused(false);
		});
	}
	,save: function(changedContent) {
		ks.Service.getApi(ks.SERVICE_API.BLOG).patch({ id : this.id, content : this.content()});
	}
	,__class__: ks.view_models.BlogContentViewModel
};
ks.view_models.BlogHeaderViewModel = function(data) {
	this.title = ko.observable(data.get_title());
	this.date = ko.observable(data.get_date());
	this.onPageChange();
};
ks.view_models.BlogHeaderViewModel.__name__ = true;
ks.view_models.BlogHeaderViewModel.prototype = {
	onPageChange: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_SWITCH_CONTENT).on(function(cb,e) {
			var blog = cb();
			var newValue = blog.get_title();
			_g.title(newValue);
			var newValue1 = blog.get_date();
			_g.date(newValue1);
		});
	}
	,__class__: ks.view_models.BlogHeaderViewModel
};
ks.view_models.BlogListViewModel = function(writer_id,items) {
	var child_view_models = [];
	var _g = 0;
	while(_g < items.length) {
		var item = items[_g];
		++_g;
		var view_model = { id : item.id, title : item.title, move : $bind(this,this.pageChange)};
		child_view_models.push(view_model);
	}
	this.writer_id = writer_id;
	this.titles = ko.observableArray(child_view_models);
};
ks.view_models.BlogListViewModel.__name__ = true;
ks.view_models.BlogListViewModel.prototype = {
	pageChange: function(self,e) {
		ks.Service.getApi(ks.SERVICE_API.BLOG).get({ writer_id : 1, blog_id : self.id},function(res) {
			ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_SWITCH_CONTENT).dispatch(new ks.data.Blog(res.data));
		});
	}
	,__class__: ks.view_models.BlogListViewModel
};
ks.view_models.BlogSwitchMenuViewModel = function() {
	this.menu = ko.observableArray([new ks.view_models.BlogSwitchMenuItem("表示",true),new ks.view_models.BlogSwitchMenuItem("編集",false)]);
	this.visibility = ko.observable(false);
	this.onLogined();
	this.onLogouted();
};
ks.view_models.BlogSwitchMenuViewModel.__name__ = true;
ks.view_models.BlogSwitchMenuViewModel.prototype = {
	onLogined: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.LOGINED).on(function(cb,e) {
			_g.visibility(true);
		});
	}
	,onLogouted: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.LOGOUTED).on(function(cb,e) {
			_g.visibility(false);
		});
	}
	,__class__: ks.view_models.BlogSwitchMenuViewModel
};
ks.view_models.BlogSwitchMenuItem = function(text,active) {
	this.text = text;
	this.is_active = ko.observable(active);
	this.switch_menu = $bind(this,this.dispatchSwitch);
	this.onSwitchMenu();
	this.onInitMenu();
};
ks.view_models.BlogSwitchMenuItem.__name__ = true;
ks.view_models.BlogSwitchMenuItem.prototype = {
	onSwitchMenu: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_SWITCH_MENU).on(function(cb,e) {
			var newValue = !_g.is_active();
			_g.is_active(newValue);
		});
	}
	,onInitMenu: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_INIT_MENU).on(function(cb,e) {
			if(_g.text == "表示") _g.is_active(true);
			if(_g.text == "編集") _g.is_active(false);
		});
	}
	,dispatchSwitch: function(self,e) {
		e.preventDefault();
		ks.Service.getEvent(ks.SERVICE_EVENT.BLOG_SWITCH_MENU).dispatch();
	}
	,__class__: ks.view_models.BlogSwitchMenuItem
};
ks.view_models.BlogWriterViewModel = function(writer) {
	this.id = writer.get_id();
	this.name = writer.get_name();
	this.profile = writer.get_profile();
	this.wiki_link = writer.get_wiki_link();
};
ks.view_models.BlogWriterViewModel.__name__ = true;
ks.view_models.BlogWriterViewModel.prototype = {
	__class__: ks.view_models.BlogWriterViewModel
};
ks.view_models.HeaderNavViewModel = function() {
	this.identity = ko.observable(false);
	this.logout = $bind(this,this.dispatchLogout);
	this.onLogined();
};
ks.view_models.HeaderNavViewModel.__name__ = true;
ks.view_models.HeaderNavViewModel.prototype = {
	dispatchLogout: function(self,e) {
		this.identity(false);
		ks.Service.getEvent(ks.SERVICE_EVENT.LOGOUTED).dispatch();
	}
	,onLogined: function() {
		var _g = this;
		ks.Service.getEvent(ks.SERVICE_EVENT.LOGINED).on(function(cb,e) {
			_g.identity(true);
		});
	}
	,__class__: ks.view_models.HeaderNavViewModel
};
ks.view_models.LoginFormViewModel = function() {
	this.login = $bind(this,this.dispatchLogined);
	new $("#login-modal").modal();
};
ks.view_models.LoginFormViewModel.__name__ = true;
ks.view_models.LoginFormViewModel.prototype = {
	dispatchLogined: function(self,e) {
		new $("#login-modal").modal("hide");
		ks.Service.getEvent(ks.SERVICE_EVENT.LOGINED).dispatch();
	}
	,__class__: ks.view_models.LoginFormViewModel
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
haxe.Resource.content = [{ name : "blog-writer", data : "CjxzZWN0aW9uIGlkPSJibG9nLXdyaXRlciI+CiAgPGRpdiBjbGFzcz0icGFuZWwgcGFuZWwtZGVmYXVsdCI+CiAgICA8ZGl2IGNsYXNzPSJwYW5lbC1oZWFkaW5nIj4KICAgICAgPGg0IGRhdGEtYmluZD0idGV4dDogbmFtZSI+PC9oND4KICAgIDwvZGl2PgogICAgPGRpdiBkYXRhLWJpbmQ9InRleHQ6IHByb2ZpbGUiIGNsYXNzPSJwYW5lbC1ib2R5Ij48L2Rpdj4KICAgIDxwIGNsYXNzPSJ0ZXh0LXJpZ2h0Ij48YSBkYXRhLWJpbmQ9ImF0dHI6IHsgaHJlZjogd2lraV9saW5rIH0iIHRhcmdldD0iX2JsYW5rIj4+PiDjgoLjgaPjgajoqbPjgZfjgY88L2E+PC9wPgogIDwvZGl2Pgo8L3NlY3Rpb24+"},{ name : "blog-content", data : "CjxzZWN0aW9uIGlkPSJibG9nLWNvbnRlbnRzIj4KICA8cCBkYXRhLWJpbmQ9InRleHQ6IGNvbnRlbnQsIGF0dHI6IHsgY29udGVudGVkaXRhYmxlOiBlZGl0YWJsZSB9LCBoYXNmb2N1czogZm9jdXNlZCI+PC9wPgo8L3NlY3Rpb24+"},{ name : "header-nav", data : "CjxuYXYgaWQ9ImhlYWRlci1uYXYiPgogIDxkaXYgY2xhc3M9InRleHQtcmlnaHQiPgogICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGRhdGEtdGFyZ2V0PSIjbG9naW4tbW9kYWwiIGRhdGEtdG9nZ2xlPSJtb2RhbCIgZGF0YS1iaW5kPSJ2aXNpYmxlOiBpZGVudGl0eSgpID09PSBmYWxzZSIgY2xhc3M9ImJ0biBidG4tbGluayI+44Ot44Kw44Kk44OzPC9idXR0b24+CiAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgc3R5bGU9ImRpc3BsYXk6IG5vbmUiIGRhdGEtYmluZD0idmlzaWJsZTogaWRlbnRpdHkoKSA9PT0gdHJ1ZSwgZXZlbnQ6IHsgY2xpY2s6IGxvZ291dCB9IiBjbGFzcz0iYnRuIGJ0bi1saW5rIj7jg63jgrDjgqLjgqbjg4g8L2J1dHRvbj4KICA8L2Rpdj4KPC9uYXY+"},{ name : "login-form", data : "CjxkaXYgaWQ9ImxvZ2luLW1vZGFsIiB0YWJpbmRleD0iLTEiIHJvbGU9ImRpYWxvZyIgY2xhc3M9Im1vZGFsIGZhZGUiPgogIDxkaXYgY2xhc3M9Im1vZGFsLWRpYWxvZyI+CiAgICA8ZGl2IGNsYXNzPSJtb2RhbC1jb250ZW50Ij4KICAgICAgPGRpdiBjbGFzcz0ibW9kYWwtaGVhZGVyIj4KICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgZGF0YS1kaXNtaXNzPSJtb2RhbCIgYXJpYS1sYWJlbD0iQ2xvc2UiIGNsYXNzPSJjbG9zZSI+PHNwYW4gYXJpYS1oaWRkZW49InRydWUiPiZ0aW1lczs8L3NwYW4+PC9idXR0b24+CiAgICAgICAgPGg0PuOCouOCq+OCpuODs+ODiOaDheWgseOCkuWFpeWKm+OBl+OBpuODreOCsOOCpOODs+OBl+OBpuS4i+OBleOBhDwvaDQ+CiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJtb2RhbC1ib2R5Ij4KICAgICAgICA8Zm9ybT4KICAgICAgICAgIDxkaXYgY2xhc3M9ImZvcm0tZ3JvdXAiPgogICAgICAgICAgICA8bGFiZWwgZm9yPSJtYWlsIj7jg6Hjg7zjg6vjgqLjg4njg6zjgrk8L2xhYmVsPgogICAgICAgICAgICA8aW5wdXQgaWQ9Im1haWwiIHR5cGU9ImVtYWlsIiByZXF1aXJlZD0idHJ1ZSIgcGxhY2Vob2xkZXI9IuOBquOCk+OBp+OCguOBhOOBhOOCiCIgY2xhc3M9ImZvcm0tY29udHJvbCIvPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJmb3JtLWdyb3VwIj4KICAgICAgICAgICAgPGxhYmVsIGZvcj0icGFzcyI+44OR44K544Ov44O844OJPC9sYWJlbD4KICAgICAgICAgICAgPGlucHV0IGlkPSJwYXNzIiB0eXBlPSJwYXNzd29yZCIgcmVxdWlyZWQ9InRydWUiIHBsYWNlaG9sZGVyPSLjgarjgpPjgafjgoLjgYTjgYTjgogiIGNsYXNzPSJmb3JtLWNvbnRyb2wiLz4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZm9ybT4KICAgICAgPC9kaXY+CiAgICAgIDxkaXYgY2xhc3M9Im1vZGFsLWZvb3RlciI+CiAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGRhdGEtYmluZD0iZXZlbnQ6IHsgY2xpY2s6IGxvZ2luIH0iIGNsYXNzPSJidG4gYnRuLXByaW1hcnkiPuODreOCsOOCpOODszwvYnV0dG9uPgogICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBkYXRhLWRpc21pc3M9Im1vZGFsIiBjbGFzcz0iYnRuIGJ0bi1kZWZhdWx0Ij7jgq3jg6Pjg7Pjgrvjg6s8L2J1dHRvbj4KICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KICA8L2Rpdj4KPC9kaXY+"},{ name : "blog-header", data : "CjxzZWN0aW9uIGlkPSJibG9nLWhlYWRlciI+CiAgPGgxIGRhdGEtYmluZD0idGV4dDogdGl0bGUiPjwvaDE+CiAgPHAgZGF0YS1iaW5kPSJ0ZXh0OiBkYXRlIiBjbGFzcz0idGV4dC1yaWdodCI+PC9wPgo8L3NlY3Rpb24+"},{ name : "blog-list", data : "CjxzZWN0aW9uIGlkPSJibG9nLWxpc3QiPgogIDx1bCBkYXRhLWJpbmQ9ImZvcmVhY2g6IHRpdGxlcyIgY2xhc3M9Imxpc3QtZ3JvdXAiPgogICAgPGxpIGNsYXNzPSJsaXN0LWdyb3VwLWl0ZW0iPjxhIGhyZWY9IiMiIGRhdGEtYmluZD0idGV4dDogdGl0bGUsIGV2ZW50OiB7IGNsaWNrOiBtb3ZlIH0iPjwvYT48L2xpPgogIDwvdWw+Cjwvc2VjdGlvbj4"},{ name : "blog-switch-menu", data : "CjxzZWN0aW9uIGlkPSJibG9nLXN3aXRjaC1tZW51Ij4KICA8dWwgc3R5bGU9ImRpc3BsYXk6IG5vbmU7IiBkYXRhLWJpbmQ9ImZvcmVhY2g6IG1lbnUsIHZpc2libGU6IHZpc2liaWxpdHkoKSA9PT0gdHJ1ZSIgY2xhc3M9Im5hdiBuYXYtdGFicyI+CiAgICA8bGkgcm9sZT0icHJlc2VudGF0aW9uIiBkYXRhLWJpbmQ9ImNzczogeyBhY3RpdmU6IGlzX2FjdGl2ZSB9Ij48YSBocmVmPSIjIiBkYXRhLWJpbmQ9InRleHQ6IHRleHQsIGV2ZW50OiB7IGNsaWNrOiBzd2l0Y2hfbWVudSB9Ij48L2E+PC9saT4KICA8L3VsPgo8L3NlY3Rpb24+"}];
haxe.crypto.Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe.crypto.Base64.BYTES = haxe.io.Bytes.ofString(haxe.crypto.Base64.CHARS);
ks.Main.main();
})();
