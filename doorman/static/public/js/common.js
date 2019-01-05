/*!
 * jQuery JavaScript Library v2.1.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:01Z
 */
(function(global,factory){if(typeof module==="object"&&typeof module.exports==="object"){module.exports=global.document?factory(global,true):function(w){if(!w.document){throw new Error("jQuery requires a window with a document");}
return factory(w);};}else{factory(global);}
}(typeof window!=="undefined"?window:this,function(window,noGlobal){var arr=[];var slice=arr.slice;var concat=arr.concat;var push=arr.push;var indexOf=arr.indexOf;var class2type={};var toString=class2type.toString;var hasOwn=class2type.hasOwnProperty;var support={};var
document=window.document,version="2.1.4",jQuery=function(selector,context){return new jQuery.fn.init(selector,context);},rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,rmsPrefix=/^-ms-/,rdashAlpha=/-([\da-z])/gi,fcamelCase=function(all,letter){return letter.toUpperCase();};jQuery.fn=jQuery.prototype={jquery:version,constructor:jQuery,selector:"",length:0,toArray:function(){return slice.call(this);},get:function(num){return num!=null?(num<0?this[num+this.length]:this[num]):slice.call(this);},pushStack:function(elems){var ret=jQuery.merge(this.constructor(),elems);ret.prevObject=this;ret.context=this.context;return ret;},each:function(callback,args){return jQuery.each(this,callback,args);},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},slice:function(){return this.pushStack(slice.apply(this,arguments));},first:function(){return this.eq(0);},last:function(){return this.eq(-1);},eq:function(i){var len=this.length,j=+i+(i<0?len:0);return this.pushStack(j>=0&&j<len?[this[j]]:[]);},end:function(){return this.prevObject||this.constructor(null);},push:push,sort:arr.sort,splice:arr.splice};jQuery.extend=jQuery.fn.extend=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false;if(typeof target==="boolean"){deep=target;target=arguments[i]||{};i++;}
if(typeof target!=="object"&&!jQuery.isFunction(target)){target={};}
if(i===length){target=this;i--;}
for(;i<length;i++){if((options=arguments[i])!=null){for(name in options){src=target[name];copy=options[name];if(target===copy){continue;}
if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=jQuery.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&jQuery.isArray(src)?src:[];}else{clone=src&&jQuery.isPlainObject(src)?src:{};}
target[name]=jQuery.extend(deep,clone,copy);}else if(copy!==undefined){target[name]=copy;}}}}
return target;};jQuery.extend({expando:"jQuery"+(version+Math.random()).replace(/\D/g,""),isReady:true,error:function(msg){throw new Error(msg);},noop:function(){},isFunction:function(obj){return jQuery.type(obj)==="function";},isArray:Array.isArray,isWindow:function(obj){return obj!=null&&obj===obj.window;},isNumeric:function(obj){return!jQuery.isArray(obj)&&(obj-parseFloat(obj)+1)>=0;},isPlainObject:function(obj){if(jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj)){return false;}
if(obj.constructor&&!hasOwn.call(obj.constructor.prototype,"isPrototypeOf")){return false;}
return true;},isEmptyObject:function(obj){var name;for(name in obj){return false;}
return true;},type:function(obj){if(obj==null){return obj+"";}
return typeof obj==="object"||typeof obj==="function"?class2type[toString.call(obj)]||"object":typeof obj;},globalEval:function(code){var script,indirect=eval;code=jQuery.trim(code);if(code){if(code.indexOf("use strict")===1){script=document.createElement("script");script.text=code;document.head.appendChild(script).parentNode.removeChild(script);}else{indirect(code);}}},camelCase:function(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase();},each:function(obj,callback,args){var value,i=0,length=obj.length,isArray=isArraylike(obj);if(args){if(isArray){for(;i<length;i++){value=callback.apply(obj[i],args);if(value===false){break;}}}else{for(i in obj){value=callback.apply(obj[i],args);if(value===false){break;}}}
}else{if(isArray){for(;i<length;i++){value=callback.call(obj[i],i,obj[i]);if(value===false){break;}}}else{for(i in obj){value=callback.call(obj[i],i,obj[i]);if(value===false){break;}}}}
return obj;},trim:function(text){return text==null?"":(text+"").replace(rtrim,"");},makeArray:function(arr,results){var ret=results||[];if(arr!=null){if(isArraylike(Object(arr))){jQuery.merge(ret,typeof arr==="string"?[arr]:arr);}else{push.call(ret,arr);}}
return ret;},inArray:function(elem,arr,i){return arr==null?-1:indexOf.call(arr,elem,i);},merge:function(first,second){var len=+second.length,j=0,i=first.length;for(;j<len;j++){first[i++]=second[j];}
first.length=i;return first;},grep:function(elems,callback,invert){var callbackInverse,matches=[],i=0,length=elems.length,callbackExpect=!invert;for(;i<length;i++){callbackInverse=!callback(elems[i],i);if(callbackInverse!==callbackExpect){matches.push(elems[i]);}}
return matches;},map:function(elems,callback,arg){var value,i=0,length=elems.length,isArray=isArraylike(elems),ret=[];if(isArray){for(;i<length;i++){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}}
}else{for(i in elems){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}}}
return concat.apply([],ret);},guid:1,proxy:function(fn,context){var tmp,args,proxy;if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp;}
if(!jQuery.isFunction(fn)){return undefined;}
args=slice.call(arguments,2);proxy=function(){return fn.apply(context||this,args.concat(slice.call(arguments)));};proxy.guid=fn.guid=fn.guid||jQuery.guid++;return proxy;},now:Date.now,support:support});jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase();});function isArraylike(obj){var length="length"in obj&&obj.length,type=jQuery.type(obj);if(type==="function"||jQuery.isWindow(obj)){return false;}
if(obj.nodeType===1&&length){return true;}
return type==="array"||length===0||typeof length==="number"&&length>0&&(length-1)in obj;}
var Sizzle=/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function(window){var i,support,Expr,getText,isXML,tokenize,compile,select,outermostContext,sortInput,hasDuplicate,setDocument,document,docElem,documentIsHTML,rbuggyQSA,rbuggyMatches,matches,contains,expando="sizzle"+1*new Date(),preferredDoc=window.document,dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),sortOrder=function(a,b){if(a===b){hasDuplicate=true;}
return 0;},MAX_NEGATIVE=1<<31,hasOwn=({}).hasOwnProperty,arr=[],pop=arr.pop,push_native=arr.push,push=arr.push,slice=arr.slice,indexOf=function(list,elem){var i=0,len=list.length;for(;i<len;i++){if(list[i]===elem){return i;}}
return-1;},booleans="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",whitespace="[\\x20\\t\\r\\n\\f]",characterEncoding="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",identifier=characterEncoding.replace("w","w#"),attributes="\\["+whitespace+"*("+characterEncoding+")(?:"+whitespace+
"*([*^$|!~]?=)"+whitespace+
"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+identifier+"))|)"+whitespace+
"*\\]",pseudos=":("+characterEncoding+")(?:\\(("+
"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|"+
"((?:\\\\.|[^\\\\()[\\]]|"+attributes+")*)|"+
".*"+
")\\)|)",rwhitespace=new RegExp(whitespace+"+","g"),rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+whitespace+"*([>+~]|"+whitespace+")"+whitespace+"*"),rattributeQuotes=new RegExp("="+whitespace+"*([^\\]'\"]*?)"+whitespace+"*\\]","g"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^"+identifier+"$"),matchExpr={"ID":new RegExp("^#("+characterEncoding+")"),"CLASS":new RegExp("^\\.("+characterEncoding+")"),"TAG":new RegExp("^("+characterEncoding.replace("w","w*")+")"),"ATTR":new RegExp("^"+attributes),"PSEUDO":new RegExp("^"+pseudos),"CHILD":new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+whitespace+
"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+
"*(\\d+)|))"+whitespace+"*\\)|)","i"),"bool":new RegExp("^(?:"+booleans+")$","i"),"needsContext":new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+
whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rnative=/^[^{]+\{\s*\[native \w/,rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[+~]/,rescape=/'|\\/g,runescape=new RegExp("\\\\([\\da-f]{1,6}"+whitespace+"?|("+whitespace+")|.)","ig"),funescape=function(_,escaped,escapedWhitespace){var high="0x"+escaped-0x10000;return high!==high||escapedWhitespace?escaped:high<0?String.fromCharCode(high+0x10000):String.fromCharCode(high>>10|0xD800,high&0x3FF|0xDC00);},unloadHandler=function(){setDocument();};try{push.apply((arr=slice.call(preferredDoc.childNodes)),preferredDoc.childNodes);arr[preferredDoc.childNodes.length].nodeType;}catch(e){push={apply:arr.length?function(target,els){push_native.apply(target,slice.call(els));}:function(target,els){var j=target.length,i=0;while((target[j++]=els[i++])){}
target.length=j-1;}};}
function Sizzle(selector,context,results,seed){var match,elem,m,nodeType,i,groups,old,nid,newContext,newSelector;if((context?context.ownerDocument||context:preferredDoc)!==document){setDocument(context);}
context=context||document;results=results||[];nodeType=context.nodeType;if(typeof selector!=="string"||!selector||nodeType!==1&&nodeType!==9&&nodeType!==11){return results;}
if(!seed&&documentIsHTML){if(nodeType!==11&&(match=rquickExpr.exec(selector))){if((m=match[1])){if(nodeType===9){elem=context.getElementById(m);if(elem&&elem.parentNode){if(elem.id===m){results.push(elem);return results;}}else{return results;}}else{if(context.ownerDocument&&(elem=context.ownerDocument.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results;}}
}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results;}else if((m=match[3])&&support.getElementsByClassName){push.apply(results,context.getElementsByClassName(m));return results;}}
if(support.qsa&&(!rbuggyQSA||!rbuggyQSA.test(selector))){nid=old=expando;newContext=context;newSelector=nodeType!==1&&selector;if(nodeType===1&&context.nodeName.toLowerCase()!=="object"){groups=tokenize(selector);if((old=context.getAttribute("id"))){nid=old.replace(rescape,"\\$&");}else{context.setAttribute("id",nid);}
nid="[id='"+nid+"'] ";i=groups.length;while(i--){groups[i]=nid+toSelector(groups[i]);}
newContext=rsibling.test(selector)&&testContext(context.parentNode)||context;newSelector=groups.join(",");}
if(newSelector){try{push.apply(results,newContext.querySelectorAll(newSelector));return results;}catch(qsaError){}finally{if(!old){context.removeAttribute("id");}}}}}
return select(selector.replace(rtrim,"$1"),context,results,seed);}
function createCache(){var keys=[];function cache(key,value){if(keys.push(key+" ")>Expr.cacheLength){delete cache[keys.shift()];}
return(cache[key+" "]=value);}
return cache;}
function markFunction(fn){fn[expando]=true;return fn;}
function assert(fn){var div=document.createElement("div");try{return!!fn(div);}catch(e){return false;}finally{if(div.parentNode){div.parentNode.removeChild(div);}
div=null;}}
function addHandle(attrs,handler){var arr=attrs.split("|"),i=attrs.length;while(i--){Expr.attrHandle[arr[i]]=handler;}}
function siblingCheck(a,b){var cur=b&&a,diff=cur&&a.nodeType===1&&b.nodeType===1&&(~b.sourceIndex||MAX_NEGATIVE)-
(~a.sourceIndex||MAX_NEGATIVE);if(diff){return diff;}
if(cur){while((cur=cur.nextSibling)){if(cur===b){return-1;}}}
return a?1:-1;}
function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type===type;};}
function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return(name==="input"||name==="button")&&elem.type===type;};}
function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length;while(i--){if(seed[(j=matchIndexes[i])]){seed[j]=!(matches[j]=seed[j]);}}});});}
function testContext(context){return context&&typeof context.getElementsByTagName!=="undefined"&&context;}
support=Sizzle.support={};isXML=Sizzle.isXML=function(elem){var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false;};setDocument=Sizzle.setDocument=function(node){var hasCompare,parent,doc=node?node.ownerDocument||node:preferredDoc;if(doc===document||doc.nodeType!==9||!doc.documentElement){return document;}
document=doc;docElem=doc.documentElement;parent=doc.defaultView;if(parent&&parent!==parent.top){if(parent.addEventListener){parent.addEventListener("unload",unloadHandler,false);}else if(parent.attachEvent){parent.attachEvent("onunload",unloadHandler);}}
documentIsHTML=!isXML(doc);support.attributes=assert(function(div){div.className="i";return!div.getAttribute("className");});support.getElementsByTagName=assert(function(div){div.appendChild(doc.createComment(""));return!div.getElementsByTagName("*").length;});support.getElementsByClassName=rnative.test(doc.getElementsByClassName);support.getById=assert(function(div){docElem.appendChild(div).id=expando;return!doc.getElementsByName||!doc.getElementsByName(expando).length;});if(support.getById){Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var m=context.getElementById(id);return m&&m.parentNode?[m]:[];}};Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id")===attrId;};};}else{delete Expr.find["ID"];Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return node&&node.value===attrId;};};}
Expr.find["TAG"]=support.getElementsByTagName?function(tag,context){if(typeof context.getElementsByTagName!=="undefined"){return context.getElementsByTagName(tag);}else if(support.qsa){return context.querySelectorAll(tag);}}:function(tag,context){var elem,tmp=[],i=0,results=context.getElementsByTagName(tag);if(tag==="*"){while((elem=results[i++])){if(elem.nodeType===1){tmp.push(elem);}}
return tmp;}
return results;};Expr.find["CLASS"]=support.getElementsByClassName&&function(className,context){if(documentIsHTML){return context.getElementsByClassName(className);}};rbuggyMatches=[];rbuggyQSA=[];if((support.qsa=rnative.test(doc.querySelectorAll))){assert(function(div){docElem.appendChild(div).innerHTML="<a id='"+expando+"'></a>"+
"<select id='"+expando+"-\f]' msallowcapture=''>"+
"<option selected=''></option></select>";if(div.querySelectorAll("[msallowcapture^='']").length){rbuggyQSA.push("[*^$]="+whitespace+"*(?:''|\"\")");}
if(!div.querySelectorAll("[selected]").length){rbuggyQSA.push("\\["+whitespace+"*(?:value|"+booleans+")");}
if(!div.querySelectorAll("[id~="+expando+"-]").length){rbuggyQSA.push("~=");}
if(!div.querySelectorAll(":checked").length){rbuggyQSA.push(":checked");}
if(!div.querySelectorAll("a#"+expando+"+*").length){rbuggyQSA.push(".#.+[+~]");}});assert(function(div){var input=doc.createElement("input");input.setAttribute("type","hidden");div.appendChild(input).setAttribute("name","D");if(div.querySelectorAll("[name=d]").length){rbuggyQSA.push("name"+whitespace+"*[*^$|!~]?=");}
if(!div.querySelectorAll(":enabled").length){rbuggyQSA.push(":enabled",":disabled");}
div.querySelectorAll("*,:x");rbuggyQSA.push(",.*:");});}
if((support.matchesSelector=rnative.test((matches=docElem.matches||docElem.webkitMatchesSelector||docElem.mozMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector)))){assert(function(div){support.disconnectedMatch=matches.call(div,"div");matches.call(div,"[s!='']:x");rbuggyMatches.push("!=",pseudos);});}
rbuggyQSA=rbuggyQSA.length&&new RegExp(rbuggyQSA.join("|"));rbuggyMatches=rbuggyMatches.length&&new RegExp(rbuggyMatches.join("|"));hasCompare=rnative.test(docElem.compareDocumentPosition);contains=hasCompare||rnative.test(docElem.contains)?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16));}:function(a,b){if(b){while((b=b.parentNode)){if(b===a){return true;}}}
return false;};sortOrder=hasCompare?function(a,b){if(a===b){hasDuplicate=true;return 0;}
var compare=!a.compareDocumentPosition-!b.compareDocumentPosition;if(compare){return compare;}
compare=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1;if(compare&1||(!support.sortDetached&&b.compareDocumentPosition(a)===compare)){if(a===doc||a.ownerDocument===preferredDoc&&contains(preferredDoc,a)){return-1;}
if(b===doc||b.ownerDocument===preferredDoc&&contains(preferredDoc,b)){return 1;}
return sortInput?(indexOf(sortInput,a)-indexOf(sortInput,b)):0;}
return compare&4?-1:1;}:function(a,b){if(a===b){hasDuplicate=true;return 0;}
var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b];if(!aup||!bup){return a===doc?-1:b===doc?1:aup?-1:bup?1:sortInput?(indexOf(sortInput,a)-indexOf(sortInput,b)):0;}else if(aup===bup){return siblingCheck(a,b);}
cur=a;while((cur=cur.parentNode)){ap.unshift(cur);}
cur=b;while((cur=cur.parentNode)){bp.unshift(cur);}
while(ap[i]===bp[i]){i++;}
return i?siblingCheck(ap[i],bp[i]):ap[i]===preferredDoc?-1:bp[i]===preferredDoc?1:0;};return doc;};Sizzle.matches=function(expr,elements){return Sizzle(expr,null,null,elements);};Sizzle.matchesSelector=function(elem,expr){if((elem.ownerDocument||elem)!==document){setDocument(elem);}
expr=expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector&&documentIsHTML&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&(!rbuggyQSA||!rbuggyQSA.test(expr))){try{var ret=matches.call(elem,expr);if(ret||support.disconnectedMatch||elem.document&&elem.document.nodeType!==11){return ret;}}catch(e){}}
return Sizzle(expr,document,null,[elem]).length>0;};Sizzle.contains=function(context,elem){if((context.ownerDocument||context)!==document){setDocument(context);}
return contains(context,elem);};Sizzle.attr=function(elem,name){if((elem.ownerDocument||elem)!==document){setDocument(elem);}
var fn=Expr.attrHandle[name.toLowerCase()],val=fn&&hasOwn.call(Expr.attrHandle,name.toLowerCase())?fn(elem,name,!documentIsHTML):undefined;return val!==undefined?val:support.attributes||!documentIsHTML?elem.getAttribute(name):(val=elem.getAttributeNode(name))&&val.specified?val.value:null;};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg);};Sizzle.uniqueSort=function(results){var elem,duplicates=[],j=0,i=0;hasDuplicate=!support.detectDuplicates;sortInput=!support.sortStable&&results.slice(0);results.sort(sortOrder);if(hasDuplicate){while((elem=results[i++])){if(elem===results[i]){j=duplicates.push(i);}}
while(j--){results.splice(duplicates[j],1);}}
sortInput=null;return results;};getText=Sizzle.getText=function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){while((node=elem[i++])){ret+=getText(node);}}else if(nodeType===1||nodeType===9||nodeType===11){if(typeof elem.textContent==="string"){return elem.textContent;}else{for(elem=elem.firstChild;elem;elem=elem.nextSibling){ret+=getText(elem);}}}else if(nodeType===3||nodeType===4){return elem.nodeValue;}
return ret;};Expr=Sizzle.selectors={cacheLength:50,createPseudo:markFunction,match:matchExpr,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{"ATTR":function(match){match[1]=match[1].replace(runescape,funescape);match[3]=(match[3]||match[4]||match[5]||"").replace(runescape,funescape);if(match[2]==="~="){match[3]=" "+match[3]+" ";}
return match.slice(0,4);},"CHILD":function(match){match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){if(!match[3]){Sizzle.error(match[0]);}
match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=+((match[7]+match[8])||match[3]==="odd");}else if(match[3]){Sizzle.error(match[0]);}
return match;},"PSEUDO":function(match){var excess,unquoted=!match[6]&&match[2];if(matchExpr["CHILD"].test(match[0])){return null;}
if(match[3]){match[2]=match[4]||match[5]||"";}else if(unquoted&&rpseudo.test(unquoted)&&(excess=tokenize(unquoted,true))&&(excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess);}
return match.slice(0,3);}},filter:{"TAG":function(nodeNameSelector){var nodeName=nodeNameSelector.replace(runescape,funescape).toLowerCase();return nodeNameSelector==="*"?function(){return true;}:function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName;};},"CLASS":function(className){var pattern=classCache[className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(typeof elem.className==="string"&&elem.className||typeof elem.getAttribute!=="undefined"&&elem.getAttribute("class")||"");});},"ATTR":function(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null){return operator==="!=";}
if(!operator){return true;}
result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.slice(-check.length)===check:operator==="~="?(" "+result.replace(rwhitespace," ")+" ").indexOf(check)>-1:operator==="|="?result===check||result.slice(0,check.length+1)===check+"-":false;};},"CHILD":function(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0?function(elem){return!!elem.parentNode;}:function(elem,context,xml){var cache,outerCache,node,diff,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType;if(parent){if(simple){while(dir){node=elem;while((node=node[dir])){if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1){return false;}}
start=dir=type==="only"&&!start&&"nextSibling";}
return true;}
start=[forward?parent.firstChild:parent.lastChild];if(forward&&useCache){outerCache=parent[expando]||(parent[expando]={});cache=outerCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=cache[0]===dirruns&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while((node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop())){if(node.nodeType===1&&++diff&&node===elem){outerCache[type]=[dirruns,nodeIndex,diff];break;}}
}else if(useCache&&(cache=(elem[expando]||(elem[expando]={}))[type])&&cache[0]===dirruns){diff=cache[1];}else{while((node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop())){if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){if(useCache){(node[expando]||(node[expando]={}))[type]=[dirruns,diff];}
if(node===elem){break;}}}}
diff-=last;return diff===first||(diff%first===0&&diff/first>=0);}};},"PSEUDO":function(pseudo,argument){var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo);if(fn[expando]){return fn(argument);}
if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i]);}}):function(elem){return fn(elem,0,args);};}
return fn;}},pseudos:{"not":markFunction(function(selector){var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length;while(i--){if((elem=unmatched[i])){seed[i]=!(matches[i]=elem);}}}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results);input[0]=null;return!results.pop();};}),"has":markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0;};}),"contains":markFunction(function(text){text=text.replace(runescape,funescape);return function(elem){return(elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1;};}),"lang":markFunction(function(lang){if(!ridentifier.test(lang||"")){Sizzle.error("unsupported lang: "+lang);}
lang=lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do{if((elemLang=documentIsHTML?elem.lang:elem.getAttribute("xml:lang")||elem.getAttribute("lang"))){elemLang=elemLang.toLowerCase();return elemLang===lang||elemLang.indexOf(lang+"-")===0;}}while((elem=elem.parentNode)&&elem.nodeType===1);return false;};}),"target":function(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id;},"root":function(elem){return elem===docElem;},"focus":function(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex);},"enabled":function(elem){return elem.disabled===false;},"disabled":function(elem){return elem.disabled===true;},"checked":function(elem){var nodeName=elem.nodeName.toLowerCase();return(nodeName==="input"&&!!elem.checked)||(nodeName==="option"&&!!elem.selected);},"selected":function(elem){if(elem.parentNode){elem.parentNode.selectedIndex;}
return elem.selected===true;},"empty":function(elem){for(elem=elem.firstChild;elem;elem=elem.nextSibling){if(elem.nodeType<6){return false;}}
return true;},"parent":function(elem){return!Expr.pseudos["empty"](elem);},"header":function(elem){return rheader.test(elem.nodeName);},"input":function(elem){return rinputs.test(elem.nodeName);},"button":function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button";},"text":function(elem){var attr;return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&((attr=elem.getAttribute("type"))==null||attr.toLowerCase()==="text");},"first":createPositionalPseudo(function(){return[0];}),"last":createPositionalPseudo(function(matchIndexes,length){return[length-1];}),"eq":createPositionalPseudo(function(matchIndexes,length,argument){return[argument<0?argument+length:argument];}),"even":createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2){matchIndexes.push(i);}
return matchIndexes;}),"odd":createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2){matchIndexes.push(i);}
return matchIndexes;}),"lt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;){matchIndexes.push(i);}
return matchIndexes;}),"gt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;++i<length;){matchIndexes.push(i);}
return matchIndexes;})}};Expr.pseudos["nth"]=Expr.pseudos["eq"];for(i in{radio:true,checkbox:true,file:true,password:true,image:true}){Expr.pseudos[i]=createInputPseudo(i);}
for(i in{submit:true,reset:true}){Expr.pseudos[i]=createButtonPseudo(i);}
function setFilters(){}
setFilters.prototype=Expr.filters=Expr.pseudos;Expr.setFilters=new setFilters();tokenize=Sizzle.tokenize=function(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector+" "];if(cached){return parseOnly?0:cached.slice(0);}
soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){if(!matched||(match=rcomma.exec(soFar))){if(match){soFar=soFar.slice(match[0].length)||soFar;}
groups.push((tokens=[]));}
matched=false;if((match=rcombinators.exec(soFar))){matched=match.shift();tokens.push({value:matched,type:match[0].replace(rtrim," ")});soFar=soFar.slice(matched.length);}
for(type in Expr.filter){if((match=matchExpr[type].exec(soFar))&&(!preFilters[type]||(match=preFilters[type](match)))){matched=match.shift();tokens.push({value:matched,type:type,matches:match});soFar=soFar.slice(matched.length);}}
if(!matched){break;}}
return parseOnly?soFar.length:soFar?Sizzle.error(selector):tokenCache(selector,groups).slice(0);};function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i<len;i++){selector+=tokens[i].value;}
return selector;}
function addCombinator(matcher,combinator,base){var dir=combinator.dir,checkNonElements=base&&dir==="parentNode",doneName=done++;return combinator.first?function(elem,context,xml){while((elem=elem[dir])){if(elem.nodeType===1||checkNonElements){return matcher(elem,context,xml);}}}:function(elem,context,xml){var oldCache,outerCache,newCache=[dirruns,doneName];if(xml){while((elem=elem[dir])){if(elem.nodeType===1||checkNonElements){if(matcher(elem,context,xml)){return true;}}}}else{while((elem=elem[dir])){if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={});if((oldCache=outerCache[dir])&&oldCache[0]===dirruns&&oldCache[1]===doneName){return(newCache[2]=oldCache[2]);}else{outerCache[dir]=newCache;if((newCache[2]=matcher(elem,context,xml))){return true;}}}}}};}
function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--){if(!matchers[i](elem,context,xml)){return false;}}
return true;}:matchers[0];}
function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++){Sizzle(selector,contexts[i],results);}
return results;}
function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++){if((elem=unmatched[i])){if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i);}}}}
return newUnmatched;}
function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando]){postFilter=setMatcher(postFilter);}
if(postFinder&&!postFinder[expando]){postFinder=setMatcher(postFinder,postSelector);}
return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length,elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]),matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher?postFinder||(seed?preFilter:preexisting||postFilter)?[]:results:matcherIn;if(matcher){matcher(matcherIn,matcherOut,context,xml);}
if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml);i=temp.length;while(i--){if((elem=temp[i])){matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem);}}}
if(seed){if(postFinder||preFilter){if(postFinder){temp=[];i=matcherOut.length;while(i--){if((elem=matcherOut[i])){temp.push((matcherIn[i]=elem));}}
postFinder(null,(matcherOut=[]),temp,xml);}
i=matcherOut.length;while(i--){if((elem=matcherOut[i])&&(temp=postFinder?indexOf(seed,elem):preMap[i])>-1){seed[temp]=!(results[temp]=elem);}}}
}else{matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml);}else{push.apply(results,matcherOut);}}});}
function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0,matchContext=addCombinator(function(elem){return elem===checkContext;},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf(checkContext,elem)>-1;},implicitRelative,true),matchers=[function(elem,context,xml){var ret=(!leadingRelative&&(xml||context!==outermostContext))||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml));checkContext=null;return ret;}];for(;i<len;i++){if((matcher=Expr.relative[tokens[i].type])){matchers=[addCombinator(elementMatcher(matchers),matcher)];}else{matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches);if(matcher[expando]){j=++i;for(;j<len;j++){if(Expr.relative[tokens[j].type]){break;}}
return setMatcher(i>1&&elementMatcher(matchers),i>1&&toSelector(tokens.slice(0,i-1).concat({value:tokens[i-2].type===" "?"*":""})).replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens((tokens=tokens.slice(j))),j<len&&toSelector(tokens));}
matchers.push(matcher);}}
return elementMatcher(matchers);}
function matcherFromGroupMatchers(elementMatchers,setMatchers){var bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function(seed,context,xml,results,outermost){var elem,j,matcher,matchedCount=0,i="0",unmatched=seed&&[],setMatched=[],contextBackup=outermostContext,elems=seed||byElement&&Expr.find["TAG"]("*",outermost),dirrunsUnique=(dirruns+=contextBackup==null?1:Math.random()||0.1),len=elems.length;if(outermost){outermostContext=context!==document&&context;}
for(;i!==len&&(elem=elems[i])!=null;i++){if(byElement&&elem){j=0;while((matcher=elementMatchers[j++])){if(matcher(elem,context,xml)){results.push(elem);break;}}
if(outermost){dirruns=dirrunsUnique;}}
if(bySet){if((elem=!matcher&&elem)){matchedCount--;}
if(seed){unmatched.push(elem);}}}
matchedCount+=i;if(bySet&&i!==matchedCount){j=0;while((matcher=setMatchers[j++])){matcher(unmatched,setMatched,context,xml);}
if(seed){if(matchedCount>0){while(i--){if(!(unmatched[i]||setMatched[i])){setMatched[i]=pop.call(results);}}}
setMatched=condense(setMatched);}
push.apply(results,setMatched);if(outermost&&!seed&&setMatched.length>0&&(matchedCount+setMatchers.length)>1){Sizzle.uniqueSort(results);}}
if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup;}
return unmatched;};return bySet?markFunction(superMatcher):superMatcher;}
compile=Sizzle.compile=function(selector,match ){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector+" "];if(!cached){if(!match){match=tokenize(selector);}
i=match.length;while(i--){cached=matcherFromTokens(match[i]);if(cached[expando]){setMatchers.push(cached);}else{elementMatchers.push(cached);}}
cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers));cached.selector=selector;}
return cached;};select=Sizzle.select=function(selector,context,results,seed){var i,tokens,token,type,find,compiled=typeof selector==="function"&&selector,match=!seed&&tokenize((selector=compiled.selector||selector));results=results||[];if(match.length===1){tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&support.getById&&context.nodeType===9&&documentIsHTML&&Expr.relative[tokens[1].type]){context=(Expr.find["ID"](token.matches[0].replace(runescape,funescape),context)||[])[0];if(!context){return results;}else if(compiled){context=context.parentNode;}
selector=selector.slice(tokens.shift().value.length);}
i=matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--){token=tokens[i];if(Expr.relative[(type=token.type)]){break;}
if((find=Expr.find[type])){if((seed=find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type)&&testContext(context.parentNode)||context))){tokens.splice(i,1);selector=seed.length&&toSelector(tokens);if(!selector){push.apply(results,seed);return results;}
break;}}}}
(compiled||compile(selector,match))(seed,context,!documentIsHTML,results,rsibling.test(selector)&&testContext(context.parentNode)||context);return results;};support.sortStable=expando.split("").sort(sortOrder).join("")===expando;support.detectDuplicates=!!hasDuplicate;setDocument();support.sortDetached=assert(function(div1){return div1.compareDocumentPosition(document.createElement("div"))&1;});if(!assert(function(div){div.innerHTML="<a href='#'></a>";return div.firstChild.getAttribute("href")==="#";})){addHandle("type|href|height|width",function(elem,name,isXML){if(!isXML){return elem.getAttribute(name,name.toLowerCase()==="type"?1:2);}});}
if(!support.attributes||!assert(function(div){div.innerHTML="<input/>";div.firstChild.setAttribute("value","");return div.firstChild.getAttribute("value")==="";})){addHandle("value",function(elem,name,isXML){if(!isXML&&elem.nodeName.toLowerCase()==="input"){return elem.defaultValue;}});}
if(!assert(function(div){return div.getAttribute("disabled")==null;})){addHandle(booleans,function(elem,name,isXML){var val;if(!isXML){return elem[name]===true?name.toLowerCase():(val=elem.getAttributeNode(name))&&val.specified?val.value:null;}});}
return Sizzle;})(window);jQuery.find=Sizzle;jQuery.expr=Sizzle.selectors;jQuery.expr[":"]=jQuery.expr.pseudos;jQuery.unique=Sizzle.uniqueSort;jQuery.text=Sizzle.getText;jQuery.isXMLDoc=Sizzle.isXML;jQuery.contains=Sizzle.contains;var rneedsContext=jQuery.expr.match.needsContext;var rsingleTag=(/^<(\w+)\s*\/?>(?:<\/\1>|)$/);var risSimple=/^.[^:#\[\.,]*$/;function winnow(elements,qualifier,not){if(jQuery.isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){return!!qualifier.call(elem,i,elem)!==not;});}
if(qualifier.nodeType){return jQuery.grep(elements,function(elem){return(elem===qualifier)!==not;});}
if(typeof qualifier==="string"){if(risSimple.test(qualifier)){return jQuery.filter(qualifier,elements,not);}
qualifier=jQuery.filter(qualifier,elements);}
return jQuery.grep(elements,function(elem){return(indexOf.call(qualifier,elem)>=0)!==not;});}
jQuery.filter=function(expr,elems,not){var elem=elems[0];if(not){expr=":not("+expr+")";}
return elems.length===1&&elem.nodeType===1?jQuery.find.matchesSelector(elem,expr)?[elem]:[]:jQuery.find.matches(expr,jQuery.grep(elems,function(elem){return elem.nodeType===1;}));};jQuery.fn.extend({find:function(selector){var i,len=this.length,ret=[],self=this;if(typeof selector!=="string"){return this.pushStack(jQuery(selector).filter(function(){for(i=0;i<len;i++){if(jQuery.contains(self[i],this)){return true;}}}));}
for(i=0;i<len;i++){jQuery.find(selector,self[i],ret);}
ret=this.pushStack(len>1?jQuery.unique(ret):ret);ret.selector=this.selector?this.selector+" "+selector:selector;return ret;},filter:function(selector){return this.pushStack(winnow(this,selector||[],false));},not:function(selector){return this.pushStack(winnow(this,selector||[],true));},is:function(selector){return!!winnow(this,typeof selector==="string"&&rneedsContext.test(selector)?jQuery(selector):selector||[],false).length;}});var rootjQuery,rquickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,init=jQuery.fn.init=function(selector,context){var match,elem;if(!selector){return this;}
if(typeof selector==="string"){if(selector[0]==="<"&&selector[selector.length-1]===">"&&selector.length>=3){match=[null,selector,null];}else{match=rquickExpr.exec(selector);}
if(match&&(match[1]||!context)){if(match[1]){context=context instanceof jQuery?context[0]:context;jQuery.merge(this,jQuery.parseHTML(match[1],context&&context.nodeType?context.ownerDocument||context:document,true));if(rsingleTag.test(match[1])&&jQuery.isPlainObject(context)){for(match in context){if(jQuery.isFunction(this[match])){this[match](context[match]);}else{this.attr(match,context[match]);}}}
return this;}else{elem=document.getElementById(match[2]);if(elem&&elem.parentNode){this.length=1;this[0]=elem;}
this.context=document;this.selector=selector;return this;}
}else if(!context||context.jquery){return(context||rootjQuery).find(selector);}else{return this.constructor(context).find(selector);}
}else if(selector.nodeType){this.context=this[0]=selector;this.length=1;return this;}else if(jQuery.isFunction(selector)){return typeof rootjQuery.ready!=="undefined"?rootjQuery.ready(selector):selector(jQuery);}
if(selector.selector!==undefined){this.selector=selector.selector;this.context=selector.context;}
return jQuery.makeArray(selector,this);};init.prototype=jQuery.fn;rootjQuery=jQuery(document);var rparentsprev=/^(?:parents|prev(?:Until|All))/,guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.extend({dir:function(elem,dir,until){var matched=[],truncate=until!==undefined;while((elem=elem[dir])&&elem.nodeType!==9){if(elem.nodeType===1){if(truncate&&jQuery(elem).is(until)){break;}
matched.push(elem);}}
return matched;},sibling:function(n,elem){var matched=[];for(;n;n=n.nextSibling){if(n.nodeType===1&&n!==elem){matched.push(n);}}
return matched;}});jQuery.fn.extend({has:function(target){var targets=jQuery(target,this),l=targets.length;return this.filter(function(){var i=0;for(;i<l;i++){if(jQuery.contains(this,targets[i])){return true;}}});},closest:function(selectors,context){var cur,i=0,l=this.length,matched=[],pos=rneedsContext.test(selectors)||typeof selectors!=="string"?jQuery(selectors,context||this.context):0;for(;i<l;i++){for(cur=this[i];cur&&cur!==context;cur=cur.parentNode){if(cur.nodeType<11&&(pos?pos.index(cur)>-1:cur.nodeType===1&&jQuery.find.matchesSelector(cur,selectors))){matched.push(cur);break;}}}
return this.pushStack(matched.length>1?jQuery.unique(matched):matched);},index:function(elem){if(!elem){return(this[0]&&this[0].parentNode)?this.first().prevAll().length:-1;}
if(typeof elem==="string"){return indexOf.call(jQuery(elem),this[0]);}
return indexOf.call(this,elem.jquery?elem[0]:elem);},add:function(selector,context){return this.pushStack(jQuery.unique(jQuery.merge(this.get(),jQuery(selector,context))));},addBack:function(selector){return this.add(selector==null?this.prevObject:this.prevObject.filter(selector));}});function sibling(cur,dir){while((cur=cur[dir])&&cur.nodeType!==1){}
return cur;}
jQuery.each({parent:function(elem){var parent=elem.parentNode;return parent&&parent.nodeType!==11?parent:null;},parents:function(elem){return jQuery.dir(elem,"parentNode");},parentsUntil:function(elem,i,until){return jQuery.dir(elem,"parentNode",until);},next:function(elem){return sibling(elem,"nextSibling");},prev:function(elem){return sibling(elem,"previousSibling");},nextAll:function(elem){return jQuery.dir(elem,"nextSibling");},prevAll:function(elem){return jQuery.dir(elem,"previousSibling");},nextUntil:function(elem,i,until){return jQuery.dir(elem,"nextSibling",until);},prevUntil:function(elem,i,until){return jQuery.dir(elem,"previousSibling",until);},siblings:function(elem){return jQuery.sibling((elem.parentNode||{}).firstChild,elem);},children:function(elem){return jQuery.sibling(elem.firstChild);},contents:function(elem){return elem.contentDocument||jQuery.merge([],elem.childNodes);}},function(name,fn){jQuery.fn[name]=function(until,selector){var matched=jQuery.map(this,fn,until);if(name.slice(-5)!=="Until"){selector=until;}
if(selector&&typeof selector==="string"){matched=jQuery.filter(selector,matched);}
if(this.length>1){if(!guaranteedUnique[name]){jQuery.unique(matched);}
if(rparentsprev.test(name)){matched.reverse();}}
return this.pushStack(matched);};});var rnotwhite=(/\S+/g);var optionsCache={};function createOptions(options){var object=optionsCache[options]={};jQuery.each(options.match(rnotwhite)||[],function(_,flag){object[flag]=true;});return object;}
jQuery.Callbacks=function(options){options=typeof options==="string"?(optionsCache[options]||createOptions(options)):jQuery.extend({},options);var
memory,fired,firing,firingStart,firingLength,firingIndex,list=[],stack=!options.once&&[],fire=function(data){memory=options.memory&&data;fired=true;firingIndex=firingStart||0;firingStart=0;firingLength=list.length;firing=true;for(;list&&firingIndex<firingLength;firingIndex++){if(list[firingIndex].apply(data[0],data[1])===false&&options.stopOnFalse){memory=false;break;}}
firing=false;if(list){if(stack){if(stack.length){fire(stack.shift());}}else if(memory){list=[];}else{self.disable();}}},self={add:function(){if(list){var start=list.length;(function add(args){jQuery.each(args,function(_,arg){var type=jQuery.type(arg);if(type==="function"){if(!options.unique||!self.has(arg)){list.push(arg);}}else if(arg&&arg.length&&type!=="string"){add(arg);}});})(arguments);if(firing){firingLength=list.length;}else if(memory){firingStart=start;fire(memory);}}
return this;},remove:function(){if(list){jQuery.each(arguments,function(_,arg){var index;while((index=jQuery.inArray(arg,list,index))>-1){list.splice(index,1);if(firing){if(index<=firingLength){firingLength--;}
if(index<=firingIndex){firingIndex--;}}}});}
return this;},has:function(fn){return fn?jQuery.inArray(fn,list)>-1:!!(list&&list.length);},empty:function(){list=[];firingLength=0;return this;},disable:function(){list=stack=memory=undefined;return this;},disabled:function(){return!list;},lock:function(){stack=undefined;if(!memory){self.disable();}
return this;},locked:function(){return!stack;},fireWith:function(context,args){if(list&&(!fired||stack)){args=args||[];args=[context,args.slice?args.slice():args];if(firing){stack.push(args);}else{fire(args);}}
return this;},fire:function(){self.fireWith(this,arguments);return this;},fired:function(){return!!fired;}};return self;};jQuery.extend({Deferred:function(func){var tuples=[["resolve","done",jQuery.Callbacks("once memory"),"resolved"],["reject","fail",jQuery.Callbacks("once memory"),"rejected"],["notify","progress",jQuery.Callbacks("memory")]],state="pending",promise={state:function(){return state;},always:function(){deferred.done(arguments).fail(arguments);return this;},then:function(){var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){var fn=jQuery.isFunction(fns[i])&&fns[i];deferred[tuple[1]](function(){var returned=fn&&fn.apply(this,arguments);if(returned&&jQuery.isFunction(returned.promise)){returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);}else{newDefer[tuple[0]+"With"](this===promise?newDefer.promise():this,fn?[returned]:arguments);}});});fns=null;}).promise();},promise:function(obj){return obj!=null?jQuery.extend(obj,promise):promise;}},deferred={};promise.pipe=promise.then;jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[3];promise[tuple[1]]=list.add;if(stateString){list.add(function(){state=stateString;},tuples[i^1][2].disable,tuples[2][2].lock);}
deferred[tuple[0]]=function(){deferred[tuple[0]+"With"](this===deferred?promise:this,arguments);return this;};deferred[tuple[0]+"With"]=list.fireWith;});promise.promise(deferred);if(func){func.call(deferred,deferred);}
return deferred;},when:function(subordinate ){var i=0,resolveValues=slice.call(arguments),length=resolveValues.length,remaining=length!==1||(subordinate&&jQuery.isFunction(subordinate.promise))?length:0,deferred=remaining===1?subordinate:jQuery.Deferred(),updateFunc=function(i,contexts,values){return function(value){contexts[i]=this;values[i]=arguments.length>1?slice.call(arguments):value;if(values===progressValues){deferred.notifyWith(contexts,values);}else if(!(--remaining)){deferred.resolveWith(contexts,values);}};},progressValues,progressContexts,resolveContexts;if(length>1){progressValues=new Array(length);progressContexts=new Array(length);resolveContexts=new Array(length);for(;i<length;i++){if(resolveValues[i]&&jQuery.isFunction(resolveValues[i].promise)){resolveValues[i].promise().done(updateFunc(i,resolveContexts,resolveValues)).fail(deferred.reject).progress(updateFunc(i,progressContexts,progressValues));}else{--remaining;}}}
if(!remaining){deferred.resolveWith(resolveContexts,resolveValues);}
return deferred.promise();}});var readyList;jQuery.fn.ready=function(fn){jQuery.ready.promise().done(fn);return this;};jQuery.extend({isReady:false,readyWait:1,holdReady:function(hold){if(hold){jQuery.readyWait++;}else{jQuery.ready(true);}},ready:function(wait){if(wait===true?--jQuery.readyWait:jQuery.isReady){return;}
jQuery.isReady=true;if(wait!==true&&--jQuery.readyWait>0){return;}
readyList.resolveWith(document,[jQuery]);if(jQuery.fn.triggerHandler){jQuery(document).triggerHandler("ready");jQuery(document).off("ready");}}});function completed(){document.removeEventListener("DOMContentLoaded",completed,false);window.removeEventListener("load",completed,false);jQuery.ready();}
jQuery.ready.promise=function(obj){if(!readyList){readyList=jQuery.Deferred();if(document.readyState==="complete"){setTimeout(jQuery.ready);}else{document.addEventListener("DOMContentLoaded",completed,false);window.addEventListener("load",completed,false);}}
return readyList.promise(obj);};jQuery.ready.promise();var access=jQuery.access=function(elems,fn,key,value,chainable,emptyGet,raw){var i=0,len=elems.length,bulk=key==null;if(jQuery.type(key)==="object"){chainable=true;for(i in key){jQuery.access(elems,fn,i,key[i],true,emptyGet,raw);}
}else if(value!==undefined){chainable=true;if(!jQuery.isFunction(value)){raw=true;}
if(bulk){if(raw){fn.call(elems,value);fn=null;}else{bulk=fn;fn=function(elem,key,value){return bulk.call(jQuery(elem),value);};}}
if(fn){for(;i<len;i++){fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)));}}}
return chainable?elems:bulk?fn.call(elems):len?fn(elems[0],key):emptyGet;};jQuery.acceptData=function(owner){return owner.nodeType===1||owner.nodeType===9||!(+owner.nodeType);};function Data(){Object.defineProperty(this.cache={},0,{get:function(){return{};}});this.expando=jQuery.expando+Data.uid++;}
Data.uid=1;Data.accepts=jQuery.acceptData;Data.prototype={key:function(owner){if(!Data.accepts(owner)){return 0;}
var descriptor={},unlock=owner[this.expando];if(!unlock){unlock=Data.uid++;try{descriptor[this.expando]={value:unlock};Object.defineProperties(owner,descriptor);}catch(e){descriptor[this.expando]=unlock;jQuery.extend(owner,descriptor);}}
if(!this.cache[unlock]){this.cache[unlock]={};}
return unlock;},set:function(owner,data,value){var prop,unlock=this.key(owner),cache=this.cache[unlock];if(typeof data==="string"){cache[data]=value;}else{if(jQuery.isEmptyObject(cache)){jQuery.extend(this.cache[unlock],data);}else{for(prop in data){cache[prop]=data[prop];}}}
return cache;},get:function(owner,key){var cache=this.cache[this.key(owner)];return key===undefined?cache:cache[key];},access:function(owner,key,value){var stored;if(key===undefined||((key&&typeof key==="string")&&value===undefined)){stored=this.get(owner,key);return stored!==undefined?stored:this.get(owner,jQuery.camelCase(key));}
this.set(owner,key,value);return value!==undefined?value:key;},remove:function(owner,key){var i,name,camel,unlock=this.key(owner),cache=this.cache[unlock];if(key===undefined){this.cache[unlock]={};}else{if(jQuery.isArray(key)){name=key.concat(key.map(jQuery.camelCase));}else{camel=jQuery.camelCase(key);if(key in cache){name=[key,camel];}else{name=camel;name=name in cache?[name]:(name.match(rnotwhite)||[]);}}
i=name.length;while(i--){delete cache[name[i]];}}},hasData:function(owner){return!jQuery.isEmptyObject(this.cache[owner[this.expando]]||{});},discard:function(owner){if(owner[this.expando]){delete this.cache[owner[this.expando]];}}};var data_priv=new Data();var data_user=new Data();var rbrace=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,rmultiDash=/([A-Z])/g;function dataAttr(elem,key,data){var name;if(data===undefined&&elem.nodeType===1){name="data-"+key.replace(rmultiDash,"-$1").toLowerCase();data=elem.getAttribute(name);if(typeof data==="string"){try{data=data==="true"?true:data==="false"?false:data==="null"?null:+data+""===data?+data:rbrace.test(data)?jQuery.parseJSON(data):data;}catch(e){}
data_user.set(elem,key,data);}else{data=undefined;}}
return data;}
jQuery.extend({hasData:function(elem){return data_user.hasData(elem)||data_priv.hasData(elem);},data:function(elem,name,data){return data_user.access(elem,name,data);},removeData:function(elem,name){data_user.remove(elem,name);},_data:function(elem,name,data){return data_priv.access(elem,name,data);},_removeData:function(elem,name){data_priv.remove(elem,name);}});jQuery.fn.extend({data:function(key,value){var i,name,data,elem=this[0],attrs=elem&&elem.attributes;if(key===undefined){if(this.length){data=data_user.get(elem);if(elem.nodeType===1&&!data_priv.get(elem,"hasDataAttrs")){i=attrs.length;while(i--){if(attrs[i]){name=attrs[i].name;if(name.indexOf("data-")===0){name=jQuery.camelCase(name.slice(5));dataAttr(elem,name,data[name]);}}}
data_priv.set(elem,"hasDataAttrs",true);}}
return data;}
if(typeof key==="object"){return this.each(function(){data_user.set(this,key);});}
return access(this,function(value){var data,camelKey=jQuery.camelCase(key);if(elem&&value===undefined){data=data_user.get(elem,key);if(data!==undefined){return data;}
data=data_user.get(elem,camelKey);if(data!==undefined){return data;}
data=dataAttr(elem,camelKey,undefined);if(data!==undefined){return data;}
return;}
this.each(function(){var data=data_user.get(this,camelKey);data_user.set(this,camelKey,value);if(key.indexOf("-")!==-1&&data!==undefined){data_user.set(this,key,value);}});},null,value,arguments.length>1,null,true);},removeData:function(key){return this.each(function(){data_user.remove(this,key);});}});jQuery.extend({queue:function(elem,type,data){var queue;if(elem){type=(type||"fx")+"queue";queue=data_priv.get(elem,type);if(data){if(!queue||jQuery.isArray(data)){queue=data_priv.access(elem,type,jQuery.makeArray(data));}else{queue.push(data);}}
return queue||[];}},dequeue:function(elem,type){type=type||"fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function(){jQuery.dequeue(elem,type);};if(fn==="inprogress"){fn=queue.shift();startLength--;}
if(fn){if(type==="fx"){queue.unshift("inprogress");}
delete hooks.stop;fn.call(elem,next,hooks);}
if(!startLength&&hooks){hooks.empty.fire();}},_queueHooks:function(elem,type){var key=type+"queueHooks";return data_priv.get(elem,key)||data_priv.access(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){data_priv.remove(elem,[type+"queue",key]);})});}});jQuery.fn.extend({queue:function(type,data){var setter=2;if(typeof type!=="string"){data=type;type="fx";setter--;}
if(arguments.length<setter){return jQuery.queue(this[0],type);}
return data===undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data);jQuery._queueHooks(this,type);if(type==="fx"&&queue[0]!=="inprogress"){jQuery.dequeue(this,type);}});},dequeue:function(type){return this.each(function(){jQuery.dequeue(this,type);});},clearQueue:function(type){return this.queue(type||"fx",[]);},promise:function(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function(){if(!(--count)){defer.resolveWith(elements,[elements]);}};if(typeof type!=="string"){obj=type;type=undefined;}
type=type||"fx";while(i--){tmp=data_priv.get(elements[i],type+"queueHooks");if(tmp&&tmp.empty){count++;tmp.empty.add(resolve);}}
resolve();return defer.promise(obj);}});var pnum=(/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;var cssExpand=["Top","Right","Bottom","Left"];var isHidden=function(elem,el){elem=el||elem;return jQuery.css(elem,"display")==="none"||!jQuery.contains(elem.ownerDocument,elem);};var rcheckableType=(/^(?:checkbox|radio)$/i);(function(){var fragment=document.createDocumentFragment(),div=fragment.appendChild(document.createElement("div")),input=document.createElement("input");input.setAttribute("type","radio");input.setAttribute("checked","checked");input.setAttribute("name","t");div.appendChild(input);support.checkClone=div.cloneNode(true).cloneNode(true).lastChild.checked;div.innerHTML="<textarea>x</textarea>";support.noCloneChecked=!!div.cloneNode(true).lastChild.defaultValue;})();var strundefined=typeof undefined;support.focusinBubbles="onfocusin"in window;var
rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|pointer|contextmenu)|click/,rfocusMorph=/^(?:focusinfocus|focusoutblur)$/,rtypenamespace=/^([^.]*)(?:\.(.+)|)$/;function returnTrue(){return true;}
function returnFalse(){return false;}
function safeActiveElement(){try{return document.activeElement;}catch(err){}}
jQuery.event={global:{},add:function(elem,types,handler,data,selector){var handleObjIn,eventHandle,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=data_priv.get(elem);if(!elemData){return;}
if(handler.handler){handleObjIn=handler;handler=handleObjIn.handler;selector=handleObjIn.selector;}
if(!handler.guid){handler.guid=jQuery.guid++;}
if(!(events=elemData.events)){events=elemData.events={};}
if(!(eventHandle=elemData.handle)){eventHandle=elemData.handle=function(e){return typeof jQuery!==strundefined&&jQuery.event.triggered!==e.type?jQuery.event.dispatch.apply(elem,arguments):undefined;};}
types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort();if(!type){continue;}
special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;special=jQuery.event.special[type]||{};handleObj=jQuery.extend({type:type,origType:origType,data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector&&jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn);if(!(handlers=events[type])){handlers=events[type]=[];handlers.delegateCount=0;if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false){if(elem.addEventListener){elem.addEventListener(type,eventHandle,false);}}}
if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid){handleObj.handler.guid=handler.guid;}}
if(selector){handlers.splice(handlers.delegateCount++,0,handleObj);}else{handlers.push(handleObj);}
jQuery.event.global[type]=true;}},remove:function(elem,types,handler,selector,mappedTypes){var j,origCount,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=data_priv.hasData(elem)&&data_priv.get(elem);if(!elemData||!(events=elemData.events)){return;}
types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort();if(!type){for(type in events){jQuery.event.remove(elem,type+types[t],handler,selector,true);}
continue;}
special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;handlers=events[type]||[];tmp=tmp[2]&&new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)");origCount=j=handlers.length;while(j--){handleObj=handlers[j];if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!tmp||tmp.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){handlers.splice(j,1);if(handleObj.selector){handlers.delegateCount--;}
if(special.remove){special.remove.call(elem,handleObj);}}}
if(origCount&&!handlers.length){if(!special.teardown||special.teardown.call(elem,namespaces,elemData.handle)===false){jQuery.removeEvent(elem,type,elemData.handle);}
delete events[type];}}
if(jQuery.isEmptyObject(events)){delete elemData.handle;data_priv.remove(elem,"events");}},trigger:function(event,data,elem,onlyHandlers){var i,cur,tmp,bubbleType,ontype,handle,special,eventPath=[elem||document],type=hasOwn.call(event,"type")?event.type:event,namespaces=hasOwn.call(event,"namespace")?event.namespace.split("."):[];cur=tmp=elem=elem||document;if(elem.nodeType===3||elem.nodeType===8){return;}
if(rfocusMorph.test(type+jQuery.event.triggered)){return;}
if(type.indexOf(".")>=0){namespaces=type.split(".");type=namespaces.shift();namespaces.sort();}
ontype=type.indexOf(":")<0&&"on"+type;event=event[jQuery.expando]?event:new jQuery.Event(type,typeof event==="object"&&event);event.isTrigger=onlyHandlers?2:3;event.namespace=namespaces.join(".");event.namespace_re=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"):null;event.result=undefined;if(!event.target){event.target=elem;}
data=data==null?[event]:jQuery.makeArray(data,[event]);special=jQuery.event.special[type]||{};if(!onlyHandlers&&special.trigger&&special.trigger.apply(elem,data)===false){return;}
if(!onlyHandlers&&!special.noBubble&&!jQuery.isWindow(elem)){bubbleType=special.delegateType||type;if(!rfocusMorph.test(bubbleType+type)){cur=cur.parentNode;}
for(;cur;cur=cur.parentNode){eventPath.push(cur);tmp=cur;}
if(tmp===(elem.ownerDocument||document)){eventPath.push(tmp.defaultView||tmp.parentWindow||window);}}
i=0;while((cur=eventPath[i++])&&!event.isPropagationStopped()){event.type=i>1?bubbleType:special.bindType||type;handle=(data_priv.get(cur,"events")||{})[event.type]&&data_priv.get(cur,"handle");if(handle){handle.apply(cur,data);}
handle=ontype&&cur[ontype];if(handle&&handle.apply&&jQuery.acceptData(cur)){event.result=handle.apply(cur,data);if(event.result===false){event.preventDefault();}}}
event.type=type;if(!onlyHandlers&&!event.isDefaultPrevented()){if((!special._default||special._default.apply(eventPath.pop(),data)===false)&&jQuery.acceptData(elem)){if(ontype&&jQuery.isFunction(elem[type])&&!jQuery.isWindow(elem)){tmp=elem[ontype];if(tmp){elem[ontype]=null;}
jQuery.event.triggered=type;elem[type]();jQuery.event.triggered=undefined;if(tmp){elem[ontype]=tmp;}}}}
return event.result;},dispatch:function(event){event=jQuery.event.fix(event);var i,j,ret,matched,handleObj,handlerQueue=[],args=slice.call(arguments),handlers=(data_priv.get(this,"events")||{})[event.type]||[],special=jQuery.event.special[event.type]||{};args[0]=event;event.delegateTarget=this;if(special.preDispatch&&special.preDispatch.call(this,event)===false){return;}
handlerQueue=jQuery.event.handlers.call(this,event,handlers);i=0;while((matched=handlerQueue[i++])&&!event.isPropagationStopped()){event.currentTarget=matched.elem;j=0;while((handleObj=matched.handlers[j++])&&!event.isImmediatePropagationStopped()){if(!event.namespace_re||event.namespace_re.test(handleObj.namespace)){event.handleObj=handleObj;event.data=handleObj.data;ret=((jQuery.event.special[handleObj.origType]||{}).handle||handleObj.handler).apply(matched.elem,args);if(ret!==undefined){if((event.result=ret)===false){event.preventDefault();event.stopPropagation();}}}}}
if(special.postDispatch){special.postDispatch.call(this,event);}
return event.result;},handlers:function(event,handlers){var i,matches,sel,handleObj,handlerQueue=[],delegateCount=handlers.delegateCount,cur=event.target;if(delegateCount&&cur.nodeType&&(!event.button||event.type!=="click")){for(;cur!==this;cur=cur.parentNode||this){if(cur.disabled!==true||event.type!=="click"){matches=[];for(i=0;i<delegateCount;i++){handleObj=handlers[i];sel=handleObj.selector+" ";if(matches[sel]===undefined){matches[sel]=handleObj.needsContext?jQuery(sel,this).index(cur)>=0:jQuery.find(sel,this,null,[cur]).length;}
if(matches[sel]){matches.push(handleObj);}}
if(matches.length){handlerQueue.push({elem:cur,handlers:matches});}}}}
if(delegateCount<handlers.length){handlerQueue.push({elem:this,handlers:handlers.slice(delegateCount)});}
return handlerQueue;},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(event,original){if(event.which==null){event.which=original.charCode!=null?original.charCode:original.keyCode;}
return event;}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(event,original){var eventDoc,doc,body,button=original.button;if(event.pageX==null&&original.clientX!=null){eventDoc=event.target.ownerDocument||document;doc=eventDoc.documentElement;body=eventDoc.body;event.pageX=original.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);event.pageY=original.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0);}
if(!event.which&&button!==undefined){event.which=(button&1?1:(button&2?3:(button&4?2:0)));}
return event;}},fix:function(event){if(event[jQuery.expando]){return event;}
var i,prop,copy,type=event.type,originalEvent=event,fixHook=this.fixHooks[type];if(!fixHook){this.fixHooks[type]=fixHook=rmouseEvent.test(type)?this.mouseHooks:rkeyEvent.test(type)?this.keyHooks:{};}
copy=fixHook.props?this.props.concat(fixHook.props):this.props;event=new jQuery.Event(originalEvent);i=copy.length;while(i--){prop=copy[i];event[prop]=originalEvent[prop];}
if(!event.target){event.target=document;}
if(event.target.nodeType===3){event.target=event.target.parentNode;}
return fixHook.filter?fixHook.filter(event,originalEvent):event;},special:{load:{noBubble:true},focus:{trigger:function(){if(this!==safeActiveElement()&&this.focus){this.focus();return false;}},delegateType:"focusin"},blur:{trigger:function(){if(this===safeActiveElement()&&this.blur){this.blur();return false;}},delegateType:"focusout"},click:{trigger:function(){if(this.type==="checkbox"&&this.click&&jQuery.nodeName(this,"input")){this.click();return false;}},_default:function(event){return jQuery.nodeName(event.target,"a");}},beforeunload:{postDispatch:function(event){if(event.result!==undefined&&event.originalEvent){event.originalEvent.returnValue=event.result;}}}},simulate:function(type,elem,event,bubble){var e=jQuery.extend(new jQuery.Event(),event,{type:type,isSimulated:true,originalEvent:{}});if(bubble){jQuery.event.trigger(e,null,elem);}else{jQuery.event.dispatch.call(elem,e);}
if(e.isDefaultPrevented()){event.preventDefault();}}};jQuery.removeEvent=function(elem,type,handle){if(elem.removeEventListener){elem.removeEventListener(type,handle,false);}};jQuery.Event=function(src,props){if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props);}
if(src&&src.type){this.originalEvent=src;this.type=src.type;this.isDefaultPrevented=src.defaultPrevented||src.defaultPrevented===undefined&&src.returnValue===false?returnTrue:returnFalse;}else{this.type=src;}
if(props){jQuery.extend(this,props);}
this.timeStamp=src&&src.timeStamp||jQuery.now();this[jQuery.expando]=true;};jQuery.Event.prototype={isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=returnTrue;if(e&&e.preventDefault){e.preventDefault();}},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=returnTrue;if(e&&e.stopPropagation){e.stopPropagation();}},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=returnTrue;if(e&&e.stopImmediatePropagation){e.stopImmediatePropagation();}
this.stopPropagation();}};jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(orig,fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj;if(!related||(related!==target&&!jQuery.contains(target,related))){event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=fix;}
return ret;}};});if(!support.focusinBubbles){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){var handler=function(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event),true);};jQuery.event.special[fix]={setup:function(){var doc=this.ownerDocument||this,attaches=data_priv.access(doc,fix);if(!attaches){doc.addEventListener(orig,handler,true);}
data_priv.access(doc,fix,(attaches||0)+1);},teardown:function(){var doc=this.ownerDocument||this,attaches=data_priv.access(doc,fix)-1;if(!attaches){doc.removeEventListener(orig,handler,true);data_priv.remove(doc,fix);}else{data_priv.access(doc,fix,attaches);}}};});}
jQuery.fn.extend({on:function(types,selector,data,fn,one){var origFn,type;if(typeof types==="object"){if(typeof selector!=="string"){data=data||selector;selector=undefined;}
for(type in types){this.on(type,selector,data,types[type],one);}
return this;}
if(data==null&&fn==null){fn=selector;data=selector=undefined;}else if(fn==null){if(typeof selector==="string"){fn=data;data=undefined;}else{fn=data;data=selector;selector=undefined;}}
if(fn===false){fn=returnFalse;}else if(!fn){return this;}
if(one===1){origFn=fn;fn=function(event){jQuery().off(event);return origFn.apply(this,arguments);};fn.guid=origFn.guid||(origFn.guid=jQuery.guid++);}
return this.each(function(){jQuery.event.add(this,types,fn,data,selector);});},one:function(types,selector,data,fn){return this.on(types,selector,data,fn,1);},off:function(types,selector,fn){var handleObj,type;if(types&&types.preventDefault&&types.handleObj){handleObj=types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType+"."+handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this;}
if(typeof types==="object"){for(type in types){this.off(type,selector,types[type]);}
return this;}
if(selector===false||typeof selector==="function"){fn=selector;selector=undefined;}
if(fn===false){fn=returnFalse;}
return this.each(function(){jQuery.event.remove(this,types,fn,selector);});},trigger:function(type,data){return this.each(function(){jQuery.event.trigger(type,data,this);});},triggerHandler:function(type,data){var elem=this[0];if(elem){return jQuery.event.trigger(type,data,elem,true);}}});var
rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,rtagName=/<([\w:]+)/,rhtml=/<|&#?\w+;/,rnoInnerhtml=/<(?:script|style|link)/i,rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rscriptType=/^$|\/(?:java|ecma)script/i,rscriptTypeMasked=/^true\/(.*)/,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,wrapMap={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;wrapMap.th=wrapMap.td;function manipulationTarget(elem,content){return jQuery.nodeName(elem,"table")&&jQuery.nodeName(content.nodeType!==11?content:content.firstChild,"tr")?elem.getElementsByTagName("tbody")[0]||elem.appendChild(elem.ownerDocument.createElement("tbody")):elem;}
function disableScript(elem){elem.type=(elem.getAttribute("type")!==null)+"/"+elem.type;return elem;}
function restoreScript(elem){var match=rscriptTypeMasked.exec(elem.type);if(match){elem.type=match[1];}else{elem.removeAttribute("type");}
return elem;}
function setGlobalEval(elems,refElements){var i=0,l=elems.length;for(;i<l;i++){data_priv.set(elems[i],"globalEval",!refElements||data_priv.get(refElements[i],"globalEval"));}}
function cloneCopyEvent(src,dest){var i,l,type,pdataOld,pdataCur,udataOld,udataCur,events;if(dest.nodeType!==1){return;}
if(data_priv.hasData(src)){pdataOld=data_priv.access(src);pdataCur=data_priv.set(dest,pdataOld);events=pdataOld.events;if(events){delete pdataCur.handle;pdataCur.events={};for(type in events){for(i=0,l=events[type].length;i<l;i++){jQuery.event.add(dest,type,events[type][i]);}}}}
if(data_user.hasData(src)){udataOld=data_user.access(src);udataCur=jQuery.extend({},udataOld);data_user.set(dest,udataCur);}}
function getAll(context,tag){var ret=context.getElementsByTagName?context.getElementsByTagName(tag||"*"):context.querySelectorAll?context.querySelectorAll(tag||"*"):[];return tag===undefined||tag&&jQuery.nodeName(context,tag)?jQuery.merge([context],ret):ret;}
function fixInput(src,dest){var nodeName=dest.nodeName.toLowerCase();if(nodeName==="input"&&rcheckableType.test(src.type)){dest.checked=src.checked;}else if(nodeName==="input"||nodeName==="textarea"){dest.defaultValue=src.defaultValue;}}
jQuery.extend({clone:function(elem,dataAndEvents,deepDataAndEvents){var i,l,srcElements,destElements,clone=elem.cloneNode(true),inPage=jQuery.contains(elem.ownerDocument,elem);if(!support.noCloneChecked&&(elem.nodeType===1||elem.nodeType===11)&&!jQuery.isXMLDoc(elem)){destElements=getAll(clone);srcElements=getAll(elem);for(i=0,l=srcElements.length;i<l;i++){fixInput(srcElements[i],destElements[i]);}}
if(dataAndEvents){if(deepDataAndEvents){srcElements=srcElements||getAll(elem);destElements=destElements||getAll(clone);for(i=0,l=srcElements.length;i<l;i++){cloneCopyEvent(srcElements[i],destElements[i]);}}else{cloneCopyEvent(elem,clone);}}
destElements=getAll(clone,"script");if(destElements.length>0){setGlobalEval(destElements,!inPage&&getAll(elem,"script"));}
return clone;},buildFragment:function(elems,context,scripts,selection){var elem,tmp,tag,wrap,contains,j,fragment=context.createDocumentFragment(),nodes=[],i=0,l=elems.length;for(;i<l;i++){elem=elems[i];if(elem||elem===0){if(jQuery.type(elem)==="object"){jQuery.merge(nodes,elem.nodeType?[elem]:elem);}else if(!rhtml.test(elem)){nodes.push(context.createTextNode(elem));}else{tmp=tmp||fragment.appendChild(context.createElement("div"));tag=(rtagName.exec(elem)||["",""])[1].toLowerCase();wrap=wrapMap[tag]||wrapMap._default;tmp.innerHTML=wrap[1]+elem.replace(rxhtmlTag,"<$1></$2>")+wrap[2];j=wrap[0];while(j--){tmp=tmp.lastChild;}
jQuery.merge(nodes,tmp.childNodes);tmp=fragment.firstChild;tmp.textContent="";}}}
fragment.textContent="";i=0;while((elem=nodes[i++])){if(selection&&jQuery.inArray(elem,selection)!==-1){continue;}
contains=jQuery.contains(elem.ownerDocument,elem);tmp=getAll(fragment.appendChild(elem),"script");if(contains){setGlobalEval(tmp);}
if(scripts){j=0;while((elem=tmp[j++])){if(rscriptType.test(elem.type||"")){scripts.push(elem);}}}}
return fragment;},cleanData:function(elems){var data,elem,type,key,special=jQuery.event.special,i=0;for(;(elem=elems[i])!==undefined;i++){if(jQuery.acceptData(elem)){key=elem[data_priv.expando];if(key&&(data=data_priv.cache[key])){if(data.events){for(type in data.events){if(special[type]){jQuery.event.remove(elem,type);}else{jQuery.removeEvent(elem,type,data.handle);}}}
if(data_priv.cache[key]){delete data_priv.cache[key];}}}
delete data_user.cache[elem[data_user.expando]];}}});jQuery.fn.extend({text:function(value){return access(this,function(value){return value===undefined?jQuery.text(this):this.empty().each(function(){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){this.textContent=value;}});},null,value,arguments.length);},append:function(){return this.domManip(arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.appendChild(elem);}});},prepend:function(){return this.domManip(arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.insertBefore(elem,target.firstChild);}});},before:function(){return this.domManip(arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this);}});},after:function(){return this.domManip(arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this.nextSibling);}});},remove:function(selector,keepData ){var elem,elems=selector?jQuery.filter(selector,this):this,i=0;for(;(elem=elems[i])!=null;i++){if(!keepData&&elem.nodeType===1){jQuery.cleanData(getAll(elem));}
if(elem.parentNode){if(keepData&&jQuery.contains(elem.ownerDocument,elem)){setGlobalEval(getAll(elem,"script"));}
elem.parentNode.removeChild(elem);}}
return this;},empty:function(){var elem,i=0;for(;(elem=this[i])!=null;i++){if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));elem.textContent="";}}
return this;},clone:function(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;deepDataAndEvents=deepDataAndEvents==null?dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents);});},html:function(value){return access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(value===undefined&&elem.nodeType===1){return elem.innerHTML;}
if(typeof value==="string"&&!rnoInnerhtml.test(value)&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=value.replace(rxhtmlTag,"<$1></$2>");try{for(;i<l;i++){elem=this[i]||{};if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));elem.innerHTML=value;}}
elem=0;}catch(e){}}
if(elem){this.empty().append(value);}},null,value,arguments.length);},replaceWith:function(){var arg=arguments[0];this.domManip(arguments,function(elem){arg=this.parentNode;jQuery.cleanData(getAll(this));if(arg){arg.replaceChild(elem,this);}});return arg&&(arg.length||arg.nodeType)?this:this.remove();},detach:function(selector){return this.remove(selector,true);},domManip:function(args,callback){args=concat.apply([],args);var fragment,first,scripts,hasScripts,node,doc,i=0,l=this.length,set=this,iNoClone=l-1,value=args[0],isFunction=jQuery.isFunction(value);if(isFunction||(l>1&&typeof value==="string"&&!support.checkClone&&rchecked.test(value))){return this.each(function(index){var self=set.eq(index);if(isFunction){args[0]=value.call(this,index,self.html());}
self.domManip(args,callback);});}
if(l){fragment=jQuery.buildFragment(args,this[0].ownerDocument,false,this);first=fragment.firstChild;if(fragment.childNodes.length===1){fragment=first;}
if(first){scripts=jQuery.map(getAll(fragment,"script"),disableScript);hasScripts=scripts.length;for(;i<l;i++){node=fragment;if(i!==iNoClone){node=jQuery.clone(node,true,true);if(hasScripts){jQuery.merge(scripts,getAll(node,"script"));}}
callback.call(this[i],node,i);}
if(hasScripts){doc=scripts[scripts.length-1].ownerDocument;jQuery.map(scripts,restoreScript);for(i=0;i<hasScripts;i++){node=scripts[i];if(rscriptType.test(node.type||"")&&!data_priv.access(node,"globalEval")&&jQuery.contains(doc,node)){if(node.src){if(jQuery._evalUrl){jQuery._evalUrl(node.src);}}else{jQuery.globalEval(node.textContent.replace(rcleanScript,""));}}}}}}
return this;}});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var elems,ret=[],insert=jQuery(selector),last=insert.length-1,i=0;for(;i<=last;i++){elems=i===last?this:this.clone(true);jQuery(insert[i])[original](elems);push.apply(ret,elems.get());}
return this.pushStack(ret);};});var iframe,elemdisplay={};function actualDisplay(name,doc){var style,elem=jQuery(doc.createElement(name)).appendTo(doc.body),display=window.getDefaultComputedStyle&&(style=window.getDefaultComputedStyle(elem[0]))?style.display:jQuery.css(elem[0],"display");elem.detach();return display;}
function defaultDisplay(nodeName){var doc=document,display=elemdisplay[nodeName];if(!display){display=actualDisplay(nodeName,doc);if(display==="none"||!display){iframe=(iframe||jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);doc=iframe[0].contentDocument;doc.write();doc.close();display=actualDisplay(nodeName,doc);iframe.detach();}
elemdisplay[nodeName]=display;}
return display;}
var rmargin=(/^margin/);var rnumnonpx=new RegExp("^("+pnum+")(?!px)[a-z%]+$","i");var getStyles=function(elem){if(elem.ownerDocument.defaultView.opener){return elem.ownerDocument.defaultView.getComputedStyle(elem,null);}
return window.getComputedStyle(elem,null);};function curCSS(elem,name,computed){var width,minWidth,maxWidth,ret,style=elem.style;computed=computed||getStyles(elem);if(computed){ret=computed.getPropertyValue(name)||computed[name];}
if(computed){if(ret===""&&!jQuery.contains(elem.ownerDocument,elem)){ret=jQuery.style(elem,name);}
if(rnumnonpx.test(ret)&&rmargin.test(name)){width=style.width;minWidth=style.minWidth;maxWidth=style.maxWidth;style.minWidth=style.maxWidth=style.width=ret;ret=computed.width;style.width=width;style.minWidth=minWidth;style.maxWidth=maxWidth;}}
return ret!==undefined?ret+"":ret;}
function addGetHookIf(conditionFn,hookFn){return{get:function(){if(conditionFn()){delete this.get;return;}
return(this.get=hookFn).apply(this,arguments);}};}
(function(){var pixelPositionVal,boxSizingReliableVal,docElem=document.documentElement,container=document.createElement("div"),div=document.createElement("div");if(!div.style){return;}
div.style.backgroundClip="content-box";div.cloneNode(true).style.backgroundClip="";support.clearCloneStyle=div.style.backgroundClip==="content-box";container.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;"+
"position:absolute";container.appendChild(div);function computePixelPositionAndBoxSizingReliable(){div.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;"+
"box-sizing:border-box;display:block;margin-top:1%;top:1%;"+
"border:1px;padding:1px;width:4px;position:absolute";div.innerHTML="";docElem.appendChild(container);var divStyle=window.getComputedStyle(div,null);pixelPositionVal=divStyle.top!=="1%";boxSizingReliableVal=divStyle.width==="4px";docElem.removeChild(container);}
if(window.getComputedStyle){jQuery.extend(support,{pixelPosition:function(){computePixelPositionAndBoxSizingReliable();return pixelPositionVal;},boxSizingReliable:function(){if(boxSizingReliableVal==null){computePixelPositionAndBoxSizingReliable();}
return boxSizingReliableVal;},reliableMarginRight:function(){var ret,marginDiv=div.appendChild(document.createElement("div"));marginDiv.style.cssText=div.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;"+
"box-sizing:content-box;display:block;margin:0;border:0;padding:0";marginDiv.style.marginRight=marginDiv.style.width="0";div.style.width="1px";docElem.appendChild(container);ret=!parseFloat(window.getComputedStyle(marginDiv,null).marginRight);docElem.removeChild(container);div.removeChild(marginDiv);return ret;}});}})();jQuery.swap=function(elem,options,callback,args){var ret,name,old={};for(name in options){old[name]=elem.style[name];elem.style[name]=options[name];}
ret=callback.apply(elem,args||[]);for(name in options){elem.style[name]=old[name];}
return ret;};var
rdisplayswap=/^(none|table(?!-c[ea]).+)/,rnumsplit=new RegExp("^("+pnum+")(.*)$","i"),rrelNum=new RegExp("^([+-])=("+pnum+")","i"),cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:"0",fontWeight:"400"},cssPrefixes=["Webkit","O","Moz","ms"];function vendorPropName(style,name){if(name in style){return name;}
var capName=name[0].toUpperCase()+name.slice(1),origName=name,i=cssPrefixes.length;while(i--){name=cssPrefixes[i]+capName;if(name in style){return name;}}
return origName;}
function setPositiveNumber(elem,value,subtract){var matches=rnumsplit.exec(value);return matches?Math.max(0,matches[1]-(subtract||0))+(matches[2]||"px"):value;}
function augmentWidthOrHeight(elem,name,extra,isBorderBox,styles){var i=extra===(isBorderBox?"border":"content")?4:name==="width"?1:0,val=0;for(;i<4;i+=2){if(extra==="margin"){val+=jQuery.css(elem,extra+cssExpand[i],true,styles);}
if(isBorderBox){if(extra==="content"){val-=jQuery.css(elem,"padding"+cssExpand[i],true,styles);}
if(extra!=="margin"){val-=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}else{val+=jQuery.css(elem,"padding"+cssExpand[i],true,styles);if(extra!=="padding"){val+=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}}
return val;}
function getWidthOrHeight(elem,name,extra){var valueIsBorderBox=true,val=name==="width"?elem.offsetWidth:elem.offsetHeight,styles=getStyles(elem),isBorderBox=jQuery.css(elem,"boxSizing",false,styles)==="border-box";if(val<=0||val==null){val=curCSS(elem,name,styles);if(val<0||val==null){val=elem.style[name];}
if(rnumnonpx.test(val)){return val;}
valueIsBorderBox=isBorderBox&&(support.boxSizingReliable()||val===elem.style[name]);val=parseFloat(val)||0;}
return(val+
augmentWidthOrHeight(elem,name,extra||(isBorderBox?"border":"content"),valueIsBorderBox,styles))+"px";}
function showHide(elements,show){var display,elem,hidden,values=[],index=0,length=elements.length;for(;index<length;index++){elem=elements[index];if(!elem.style){continue;}
values[index]=data_priv.get(elem,"olddisplay");display=elem.style.display;if(show){if(!values[index]&&display==="none"){elem.style.display="";}
if(elem.style.display===""&&isHidden(elem)){values[index]=data_priv.access(elem,"olddisplay",defaultDisplay(elem.nodeName));}}else{hidden=isHidden(elem);if(display!=="none"||!hidden){data_priv.set(elem,"olddisplay",hidden?display:jQuery.css(elem,"display"));}}}
for(index=0;index<length;index++){elem=elements[index];if(!elem.style){continue;}
if(!show||elem.style.display==="none"||elem.style.display===""){elem.style.display=show?values[index]||"":"none";}}
return elements;}
jQuery.extend({cssHooks:{opacity:{get:function(elem,computed){if(computed){var ret=curCSS(elem,"opacity");return ret===""?"1":ret;}}}},cssNumber:{"columnCount":true,"fillOpacity":true,"flexGrow":true,"flexShrink":true,"fontWeight":true,"lineHeight":true,"opacity":true,"order":true,"orphans":true,"widows":true,"zIndex":true,"zoom":true},cssProps:{"float":"cssFloat"},style:function(elem,name,value,extra){if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style){return;}
var ret,type,hooks,origName=jQuery.camelCase(name),style=elem.style;name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(style,origName));hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];if(value!==undefined){type=typeof value;if(type==="string"&&(ret=rrelNum.exec(value))){value=(ret[1]+1)*ret[2]+parseFloat(jQuery.css(elem,name));type="number";}
if(value==null||value!==value){return;}
if(type==="number"&&!jQuery.cssNumber[origName]){value+="px";}
if(!support.clearCloneStyle&&value===""&&name.indexOf("background")===0){style[name]="inherit";}
if(!hooks||!("set"in hooks)||(value=hooks.set(elem,value,extra))!==undefined){style[name]=value;}}else{if(hooks&&"get"in hooks&&(ret=hooks.get(elem,false,extra))!==undefined){return ret;}
return style[name];}},css:function(elem,name,extra,styles){var val,num,hooks,origName=jQuery.camelCase(name);name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(elem.style,origName));hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];if(hooks&&"get"in hooks){val=hooks.get(elem,true,extra);}
if(val===undefined){val=curCSS(elem,name,styles);}
if(val==="normal"&&name in cssNormalTransform){val=cssNormalTransform[name];}
if(extra===""||extra){num=parseFloat(val);return extra===true||jQuery.isNumeric(num)?num||0:val;}
return val;}});jQuery.each(["height","width"],function(i,name){jQuery.cssHooks[name]={get:function(elem,computed,extra){if(computed){return rdisplayswap.test(jQuery.css(elem,"display"))&&elem.offsetWidth===0?jQuery.swap(elem,cssShow,function(){return getWidthOrHeight(elem,name,extra);}):getWidthOrHeight(elem,name,extra);}},set:function(elem,value,extra){var styles=extra&&getStyles(elem);return setPositiveNumber(elem,value,extra?augmentWidthOrHeight(elem,name,extra,jQuery.css(elem,"boxSizing",false,styles)==="border-box",styles):0);}};});jQuery.cssHooks.marginRight=addGetHookIf(support.reliableMarginRight,function(elem,computed){if(computed){return jQuery.swap(elem,{"display":"inline-block"},curCSS,[elem,"marginRight"]);}});jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix+suffix]={expand:function(value){var i=0,expanded={},parts=typeof value==="string"?value.split(" "):[value];for(;i<4;i++){expanded[prefix+cssExpand[i]+suffix]=parts[i]||parts[i-2]||parts[0];}
return expanded;}};if(!rmargin.test(prefix)){jQuery.cssHooks[prefix+suffix].set=setPositiveNumber;}});jQuery.fn.extend({css:function(name,value){return access(this,function(elem,name,value){var styles,len,map={},i=0;if(jQuery.isArray(name)){styles=getStyles(elem);len=name.length;for(;i<len;i++){map[name[i]]=jQuery.css(elem,name[i],false,styles);}
return map;}
return value!==undefined?jQuery.style(elem,name,value):jQuery.css(elem,name);},name,value,arguments.length>1);},show:function(){return showHide(this,true);},hide:function(){return showHide(this);},toggle:function(state){if(typeof state==="boolean"){return state?this.show():this.hide();}
return this.each(function(){if(isHidden(this)){jQuery(this).show();}else{jQuery(this).hide();}});}});function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing);}
jQuery.Tween=Tween;Tween.prototype={constructor:Tween,init:function(elem,options,prop,end,easing,unit){this.elem=elem;this.prop=prop;this.easing=easing||"swing";this.options=options;this.start=this.now=this.cur();this.end=end;this.unit=unit||(jQuery.cssNumber[prop]?"":"px");},cur:function(){var hooks=Tween.propHooks[this.prop];return hooks&&hooks.get?hooks.get(this):Tween.propHooks._default.get(this);},run:function(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration){this.pos=eased=jQuery.easing[this.easing](percent,this.options.duration*percent,0,1,this.options.duration);}else{this.pos=eased=percent;}
this.now=(this.end-this.start)*eased+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this);}
if(hooks&&hooks.set){hooks.set(this);}else{Tween.propHooks._default.set(this);}
return this;}};Tween.prototype.init.prototype=Tween.prototype;Tween.propHooks={_default:{get:function(tween){var result;if(tween.elem[tween.prop]!=null&&(!tween.elem.style||tween.elem.style[tween.prop]==null)){return tween.elem[tween.prop];}
result=jQuery.css(tween.elem,tween.prop,"");return!result||result==="auto"?0:result;},set:function(tween){if(jQuery.fx.step[tween.prop]){jQuery.fx.step[tween.prop](tween);}else if(tween.elem.style&&(tween.elem.style[jQuery.cssProps[tween.prop]]!=null||jQuery.cssHooks[tween.prop])){jQuery.style(tween.elem,tween.prop,tween.now+tween.unit);}else{tween.elem[tween.prop]=tween.now;}}}};Tween.propHooks.scrollTop=Tween.propHooks.scrollLeft={set:function(tween){if(tween.elem.nodeType&&tween.elem.parentNode){tween.elem[tween.prop]=tween.now;}}};jQuery.easing={linear:function(p){return p;},swing:function(p){return 0.5-Math.cos(p*Math.PI)/2;}};jQuery.fx=Tween.prototype.init;jQuery.fx.step={};var
fxNow,timerId,rfxtypes=/^(?:toggle|show|hide)$/,rfxnum=new RegExp("^(?:([+-])=|)("+pnum+")([a-z%]*)$","i"),rrun=/queueHooks$/,animationPrefilters=[defaultPrefilter],tweeners={"*":[function(prop,value){var tween=this.createTween(prop,value),target=tween.cur(),parts=rfxnum.exec(value),unit=parts&&parts[3]||(jQuery.cssNumber[prop]?"":"px"),start=(jQuery.cssNumber[prop]||unit!=="px"&&+target)&&rfxnum.exec(jQuery.css(tween.elem,prop)),scale=1,maxIterations=20;if(start&&start[3]!==unit){unit=unit||start[3];parts=parts||[];start=+target||1;do{scale=scale||".5";start=start/scale;jQuery.style(tween.elem,prop,start+unit);}while(scale!==(scale=tween.cur()/target)&&scale!==1&&--maxIterations);}
if(parts){start=tween.start=+start||+target||0;tween.unit=unit;tween.end=parts[1]?start+(parts[1]+1)*parts[2]:+parts[2];}
return tween;}]};function createFxNow(){setTimeout(function(){fxNow=undefined;});return(fxNow=jQuery.now());}
function genFx(type,includeWidth){var which,i=0,attrs={height:type};includeWidth=includeWidth?1:0;for(;i<4;i+=2-includeWidth){which=cssExpand[i];attrs["margin"+which]=attrs["padding"+which]=type;}
if(includeWidth){attrs.opacity=attrs.width=type;}
return attrs;}
function createTween(value,prop,animation){var tween,collection=(tweeners[prop]||[]).concat(tweeners["*"]),index=0,length=collection.length;for(;index<length;index++){if((tween=collection[index].call(animation,prop,value))){return tween;}}}
function defaultPrefilter(elem,props,opts){var prop,value,toggle,tween,hooks,oldfire,display,checkDisplay,anim=this,orig={},style=elem.style,hidden=elem.nodeType&&isHidden(elem),dataShow=data_priv.get(elem,"fxshow");if(!opts.queue){hooks=jQuery._queueHooks(elem,"fx");if(hooks.unqueued==null){hooks.unqueued=0;oldfire=hooks.empty.fire;hooks.empty.fire=function(){if(!hooks.unqueued){oldfire();}};}
hooks.unqueued++;anim.always(function(){anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,"fx").length){hooks.empty.fire();}});});}
if(elem.nodeType===1&&("height"in props||"width"in props)){opts.overflow=[style.overflow,style.overflowX,style.overflowY];display=jQuery.css(elem,"display");checkDisplay=display==="none"?data_priv.get(elem,"olddisplay")||defaultDisplay(elem.nodeName):display;if(checkDisplay==="inline"&&jQuery.css(elem,"float")==="none"){style.display="inline-block";}}
if(opts.overflow){style.overflow="hidden";anim.always(function(){style.overflow=opts.overflow[0];style.overflowX=opts.overflow[1];style.overflowY=opts.overflow[2];});}
for(prop in props){value=props[prop];if(rfxtypes.exec(value)){delete props[prop];toggle=toggle||value==="toggle";if(value===(hidden?"hide":"show")){if(value==="show"&&dataShow&&dataShow[prop]!==undefined){hidden=true;}else{continue;}}
orig[prop]=dataShow&&dataShow[prop]||jQuery.style(elem,prop);}else{display=undefined;}}
if(!jQuery.isEmptyObject(orig)){if(dataShow){if("hidden"in dataShow){hidden=dataShow.hidden;}}else{dataShow=data_priv.access(elem,"fxshow",{});}
if(toggle){dataShow.hidden=!hidden;}
if(hidden){jQuery(elem).show();}else{anim.done(function(){jQuery(elem).hide();});}
anim.done(function(){var prop;data_priv.remove(elem,"fxshow");for(prop in orig){jQuery.style(elem,prop,orig[prop]);}});for(prop in orig){tween=createTween(hidden?dataShow[prop]:0,prop,anim);if(!(prop in dataShow)){dataShow[prop]=tween.start;if(hidden){tween.end=tween.start;tween.start=prop==="width"||prop==="height"?1:0;}}}
}else if((display==="none"?defaultDisplay(elem.nodeName):display)==="inline"){style.display=display;}}
function propFilter(props,specialEasing){var index,name,easing,value,hooks;for(index in props){name=jQuery.camelCase(index);easing=specialEasing[name];value=props[index];if(jQuery.isArray(value)){easing=value[1];value=props[index]=value[0];}
if(index!==name){props[name]=value;delete props[index];}
hooks=jQuery.cssHooks[name];if(hooks&&"expand"in hooks){value=hooks.expand(value);delete props[name];for(index in value){if(!(index in props)){props[index]=value[index];specialEasing[index]=easing;}}}else{specialEasing[name]=easing;}}}
function Animation(elem,properties,options){var result,stopped,index=0,length=animationPrefilters.length,deferred=jQuery.Deferred().always(function(){delete tick.elem;}),tick=function(){if(stopped){return false;}
var currentTime=fxNow||createFxNow(),remaining=Math.max(0,animation.startTime+animation.duration-currentTime),temp=remaining/animation.duration||0,percent=1-temp,index=0,length=animation.tweens.length;for(;index<length;index++){animation.tweens[index].run(percent);}
deferred.notifyWith(elem,[animation,percent,remaining]);if(percent<1&&length){return remaining;}else{deferred.resolveWith(elem,[animation]);return false;}},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{}},options),originalProperties:properties,originalOptions:options,startTime:fxNow||createFxNow(),duration:options.duration,tweens:[],createTween:function(prop,end){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop]||animation.opts.easing);animation.tweens.push(tween);return tween;},stop:function(gotoEnd){var index=0,length=gotoEnd?animation.tweens.length:0;if(stopped){return this;}
stopped=true;for(;index<length;index++){animation.tweens[index].run(1);}
if(gotoEnd){deferred.resolveWith(elem,[animation,gotoEnd]);}else{deferred.rejectWith(elem,[animation,gotoEnd]);}
return this;}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index<length;index++){result=animationPrefilters[index].call(animation,elem,props,animation.opts);if(result){return result;}}
jQuery.map(props,createTween,animation);if(jQuery.isFunction(animation.opts.start)){animation.opts.start.call(elem,animation);}
jQuery.fx.timer(jQuery.extend(tick,{elem:elem,anim:animation,queue:animation.opts.queue}));return animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);}
jQuery.Animation=jQuery.extend(Animation,{tweener:function(props,callback){if(jQuery.isFunction(props)){callback=props;props=["*"];}else{props=props.split(" ");}
var prop,index=0,length=props.length;for(;index<length;index++){prop=props[index];tweeners[prop]=tweeners[prop]||[];tweeners[prop].unshift(callback);}},prefilter:function(callback,prepend){if(prepend){animationPrefilters.unshift(callback);}else{animationPrefilters.push(callback);}}});jQuery.speed=function(speed,easing,fn){var opt=speed&&typeof speed==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:opt.duration in jQuery.fx.speeds?jQuery.fx.speeds[opt.duration]:jQuery.fx.speeds._default;if(opt.queue==null||opt.queue===true){opt.queue="fx";}
opt.old=opt.complete;opt.complete=function(){if(jQuery.isFunction(opt.old)){opt.old.call(this);}
if(opt.queue){jQuery.dequeue(this,opt.queue);}};return opt;};jQuery.fn.extend({fadeTo:function(speed,to,easing,callback){return this.filter(isHidden).css("opacity",0).show()
.end().animate({opacity:to},speed,easing,callback);},animate:function(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function(){var anim=Animation(this,jQuery.extend({},prop),optall);if(empty||data_priv.get(this,"finish")){anim.stop(true);}};doAnimation.finish=doAnimation;return empty||optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation);},stop:function(type,clearQueue,gotoEnd){var stopQueue=function(hooks){var stop=hooks.stop;delete hooks.stop;stop(gotoEnd);};if(typeof type!=="string"){gotoEnd=clearQueue;clearQueue=type;type=undefined;}
if(clearQueue&&type!==false){this.queue(type||"fx",[]);}
return this.each(function(){var dequeue=true,index=type!=null&&type+"queueHooks",timers=jQuery.timers,data=data_priv.get(this);if(index){if(data[index]&&data[index].stop){stopQueue(data[index]);}}else{for(index in data){if(data[index]&&data[index].stop&&rrun.test(index)){stopQueue(data[index]);}}}
for(index=timers.length;index--;){if(timers[index].elem===this&&(type==null||timers[index].queue===type)){timers[index].anim.stop(gotoEnd);dequeue=false;timers.splice(index,1);}}
if(dequeue||!gotoEnd){jQuery.dequeue(this,type);}});},finish:function(type){if(type!==false){type=type||"fx";}
return this.each(function(){var index,data=data_priv.get(this),queue=data[type+"queue"],hooks=data[type+"queueHooks"],timers=jQuery.timers,length=queue?queue.length:0;data.finish=true;jQuery.queue(this,type,[]);if(hooks&&hooks.stop){hooks.stop.call(this,true);}
for(index=timers.length;index--;){if(timers[index].elem===this&&timers[index].queue===type){timers[index].anim.stop(true);timers.splice(index,1);}}
for(index=0;index<length;index++){if(queue[index]&&queue[index].finish){queue[index].finish.call(this);}}
delete data.finish;});}});jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name]=function(speed,easing,callback){return speed==null||typeof speed==="boolean"?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback);};});jQuery.each({slideDown:genFx("show"),slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback);};});jQuery.timers=[];jQuery.fx.tick=function(){var timer,i=0,timers=jQuery.timers;fxNow=jQuery.now();for(;i<timers.length;i++){timer=timers[i];if(!timer()&&timers[i]===timer){timers.splice(i--,1);}}
if(!timers.length){jQuery.fx.stop();}
fxNow=undefined;};jQuery.fx.timer=function(timer){jQuery.timers.push(timer);if(timer()){jQuery.fx.start();}else{jQuery.timers.pop();}};jQuery.fx.interval=13;jQuery.fx.start=function(){if(!timerId){timerId=setInterval(jQuery.fx.tick,jQuery.fx.interval);}};jQuery.fx.stop=function(){clearInterval(timerId);timerId=null;};jQuery.fx.speeds={slow:600,fast:200,_default:400};jQuery.fn.delay=function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;type=type||"fx";return this.queue(type,function(next,hooks){var timeout=setTimeout(next,time);hooks.stop=function(){clearTimeout(timeout);};});};(function(){var input=document.createElement("input"),select=document.createElement("select"),opt=select.appendChild(document.createElement("option"));input.type="checkbox";support.checkOn=input.value!=="";support.optSelected=opt.selected;select.disabled=true;support.optDisabled=!opt.disabled;input=document.createElement("input");input.value="t";input.type="radio";support.radioValue=input.value==="t";})();var nodeHook,boolHook,attrHandle=jQuery.expr.attrHandle;jQuery.fn.extend({attr:function(name,value){return access(this,jQuery.attr,name,value,arguments.length>1);},removeAttr:function(name){return this.each(function(){jQuery.removeAttr(this,name);});}});jQuery.extend({attr:function(elem,name,value){var hooks,ret,nType=elem.nodeType;if(!elem||nType===3||nType===8||nType===2){return;}
if(typeof elem.getAttribute===strundefined){return jQuery.prop(elem,name,value);}
if(nType!==1||!jQuery.isXMLDoc(elem)){name=name.toLowerCase();hooks=jQuery.attrHooks[name]||(jQuery.expr.match.bool.test(name)?boolHook:nodeHook);}
if(value!==undefined){if(value===null){jQuery.removeAttr(elem,name);}else if(hooks&&"set"in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}else{elem.setAttribute(name,value+"");return value;}}else if(hooks&&"get"in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}else{ret=jQuery.find.attr(elem,name);return ret==null?undefined:ret;}},removeAttr:function(elem,value){var name,propName,i=0,attrNames=value&&value.match(rnotwhite);if(attrNames&&elem.nodeType===1){while((name=attrNames[i++])){propName=jQuery.propFix[name]||name;if(jQuery.expr.match.bool.test(name)){elem[propName]=false;}
elem.removeAttribute(name);}}},attrHooks:{type:{set:function(elem,value){if(!support.radioValue&&value==="radio"&&jQuery.nodeName(elem,"input")){var val=elem.value;elem.setAttribute("type",value);if(val){elem.value=val;}
return value;}}}}});boolHook={set:function(elem,value,name){if(value===false){jQuery.removeAttr(elem,name);}else{elem.setAttribute(name,name);}
return name;}};jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g),function(i,name){var getter=attrHandle[name]||jQuery.find.attr;attrHandle[name]=function(elem,name,isXML){var ret,handle;if(!isXML){handle=attrHandle[name];attrHandle[name]=ret;ret=getter(elem,name,isXML)!=null?name.toLowerCase():null;attrHandle[name]=handle;}
return ret;};});var rfocusable=/^(?:input|select|textarea|button)$/i;jQuery.fn.extend({prop:function(name,value){return access(this,jQuery.prop,name,value,arguments.length>1);},removeProp:function(name){return this.each(function(){delete this[jQuery.propFix[name]||name];});}});jQuery.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(elem,name,value){var ret,hooks,notxml,nType=elem.nodeType;if(!elem||nType===3||nType===8||nType===2){return;}
notxml=nType!==1||!jQuery.isXMLDoc(elem);if(notxml){name=jQuery.propFix[name]||name;hooks=jQuery.propHooks[name];}
if(value!==undefined){return hooks&&"set"in hooks&&(ret=hooks.set(elem,value,name))!==undefined?ret:(elem[name]=value);}else{return hooks&&"get"in hooks&&(ret=hooks.get(elem,name))!==null?ret:elem[name];}},propHooks:{tabIndex:{get:function(elem){return elem.hasAttribute("tabindex")||rfocusable.test(elem.nodeName)||elem.href?elem.tabIndex:-1;}}}});if(!support.optSelected){jQuery.propHooks.selected={get:function(elem){var parent=elem.parentNode;if(parent&&parent.parentNode){parent.parentNode.selectedIndex;}
return null;}};}
jQuery.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){jQuery.propFix[this.toLowerCase()]=this;});var rclass=/[\t\r\n\f]/g;jQuery.fn.extend({addClass:function(value){var classes,elem,cur,clazz,j,finalValue,proceed=typeof value==="string"&&value,i=0,len=this.length;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,this.className));});}
if(proceed){classes=(value||"").match(rnotwhite)||[];for(;i<len;i++){elem=this[i];cur=elem.nodeType===1&&(elem.className?(" "+elem.className+" ").replace(rclass," "):" ");if(cur){j=0;while((clazz=classes[j++])){if(cur.indexOf(" "+clazz+" ")<0){cur+=clazz+" ";}}
finalValue=jQuery.trim(cur);if(elem.className!==finalValue){elem.className=finalValue;}}}}
return this;},removeClass:function(value){var classes,elem,cur,clazz,j,finalValue,proceed=arguments.length===0||typeof value==="string"&&value,i=0,len=this.length;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,this.className));});}
if(proceed){classes=(value||"").match(rnotwhite)||[];for(;i<len;i++){elem=this[i];cur=elem.nodeType===1&&(elem.className?(" "+elem.className+" ").replace(rclass," "):"");if(cur){j=0;while((clazz=classes[j++])){while(cur.indexOf(" "+clazz+" ")>=0){cur=cur.replace(" "+clazz+" "," ");}}
finalValue=value?jQuery.trim(cur):"";if(elem.className!==finalValue){elem.className=finalValue;}}}}
return this;},toggleClass:function(value,stateVal){var type=typeof value;if(typeof stateVal==="boolean"&&type==="string"){return stateVal?this.addClass(value):this.removeClass(value);}
if(jQuery.isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,this.className,stateVal),stateVal);});}
return this.each(function(){if(type==="string"){var className,i=0,self=jQuery(this),classNames=value.match(rnotwhite)||[];while((className=classNames[i++])){if(self.hasClass(className)){self.removeClass(className);}else{self.addClass(className);}}
}else if(type===strundefined||type==="boolean"){if(this.className){data_priv.set(this,"__className__",this.className);}
this.className=this.className||value===false?"":data_priv.get(this,"__className__")||"";}});},hasClass:function(selector){var className=" "+selector+" ",i=0,l=this.length;for(;i<l;i++){if(this[i].nodeType===1&&(" "+this[i].className+" ").replace(rclass," ").indexOf(className)>=0){return true;}}
return false;}});var rreturn=/\r/g;jQuery.fn.extend({val:function(value){var hooks,ret,isFunction,elem=this[0];if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.type]||jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks&&"get"in hooks&&(ret=hooks.get(elem,"value"))!==undefined){return ret;}
ret=elem.value;return typeof ret==="string"?ret.replace(rreturn,""):ret==null?"":ret;}
return;}
isFunction=jQuery.isFunction(value);return this.each(function(i){var val;if(this.nodeType!==1){return;}
if(isFunction){val=value.call(this,i,jQuery(this).val());}else{val=value;}
if(val==null){val="";}else if(typeof val==="number"){val+="";}else if(jQuery.isArray(val)){val=jQuery.map(val,function(value){return value==null?"":value+"";});}
hooks=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()];if(!hooks||!("set"in hooks)||hooks.set(this,val,"value")===undefined){this.value=val;}});}});jQuery.extend({valHooks:{option:{get:function(elem){var val=jQuery.find.attr(elem,"value");return val!=null?val:jQuery.trim(jQuery.text(elem));}},select:{get:function(elem){var value,option,options=elem.options,index=elem.selectedIndex,one=elem.type==="select-one"||index<0,values=one?null:[],max=one?index+1:options.length,i=index<0?max:one?index:0;for(;i<max;i++){option=options[i];if((option.selected||i===index)&&(support.optDisabled?!option.disabled:option.getAttribute("disabled")===null)&&(!option.parentNode.disabled||!jQuery.nodeName(option.parentNode,"optgroup"))){value=jQuery(option).val();if(one){return value;}
values.push(value);}}
return values;},set:function(elem,value){var optionSet,option,options=elem.options,values=jQuery.makeArray(value),i=options.length;while(i--){option=options[i];if((option.selected=jQuery.inArray(option.value,values)>=0)){optionSet=true;}}
if(!optionSet){elem.selectedIndex=-1;}
return values;}}}});jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={set:function(elem,value){if(jQuery.isArray(value)){return(elem.checked=jQuery.inArray(jQuery(elem).val(),value)>=0);}}};if(!support.checkOn){jQuery.valHooks[this].get=function(elem){return elem.getAttribute("value")===null?"on":elem.value;};}});jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick "+
"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+
"change select submit keydown keypress keyup error contextmenu").split(" "),function(i,name){jQuery.fn[name]=function(data,fn){return arguments.length>0?this.on(name,null,data,fn):this.trigger(name);};});jQuery.fn.extend({hover:function(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver);},bind:function(types,data,fn){return this.on(types,null,data,fn);},unbind:function(types,fn){return this.off(types,null,fn);},delegate:function(selector,types,data,fn){return this.on(types,selector,data,fn);},undelegate:function(selector,types,fn){return arguments.length===1?this.off(selector,"**"):this.off(types,selector||"**",fn);}});var nonce=jQuery.now();var rquery=(/\?/);jQuery.parseJSON=function(data){return JSON.parse(data+"");};jQuery.parseXML=function(data){var xml,tmp;if(!data||typeof data!=="string"){return null;}
try{tmp=new DOMParser();xml=tmp.parseFromString(data,"text/xml");}catch(e){xml=undefined;}
if(!xml||xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: "+data);}
return xml;};var
rhash=/#.*$/,rts=/([?&])_=[^&]*/,rheaders=/^(.*?):[ \t]*([^\r\n]*)$/mg,rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//,rurl=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,prefilters={},transports={},allTypes="*/".concat("*"),ajaxLocation=window.location.href,ajaxLocParts=rurl.exec(ajaxLocation.toLowerCase())||[];function addToPrefiltersOrTransports(structure){return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;dataTypeExpression="*";}
var dataType,i=0,dataTypes=dataTypeExpression.toLowerCase().match(rnotwhite)||[];if(jQuery.isFunction(func)){while((dataType=dataTypes[i++])){if(dataType[0]==="+"){dataType=dataType.slice(1)||"*";(structure[dataType]=structure[dataType]||[]).unshift(func);}else{(structure[dataType]=structure[dataType]||[]).push(func);}}}};}
function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR){var inspected={},seekingTransport=(structure===transports);function inspect(dataType){var selected;inspected[dataType]=true;jQuery.each(structure[dataType]||[],function(_,prefilterOrFactory){var dataTypeOrTransport=prefilterOrFactory(options,originalOptions,jqXHR);if(typeof dataTypeOrTransport==="string"&&!seekingTransport&&!inspected[dataTypeOrTransport]){options.dataTypes.unshift(dataTypeOrTransport);inspect(dataTypeOrTransport);return false;}else if(seekingTransport){return!(selected=dataTypeOrTransport);}});return selected;}
return inspect(options.dataTypes[0])||!inspected["*"]&&inspect("*");}
function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions||{};for(key in src){if(src[key]!==undefined){(flatOptions[key]?target:(deep||(deep={})))[key]=src[key];}}
if(deep){jQuery.extend(true,target,deep);}
return target;}
function ajaxHandleResponses(s,jqXHR,responses){var ct,type,finalDataType,firstDataType,contents=s.contents,dataTypes=s.dataTypes;while(dataTypes[0]==="*"){dataTypes.shift();if(ct===undefined){ct=s.mimeType||jqXHR.getResponseHeader("Content-Type");}}
if(ct){for(type in contents){if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);break;}}}
if(dataTypes[0]in responses){finalDataType=dataTypes[0];}else{for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;break;}
if(!firstDataType){firstDataType=type;}}
finalDataType=finalDataType||firstDataType;}
if(finalDataType){if(finalDataType!==dataTypes[0]){dataTypes.unshift(finalDataType);}
return responses[finalDataType];}}
function ajaxConvert(s,response,jqXHR,isSuccess){var conv2,current,conv,tmp,prev,converters={},dataTypes=s.dataTypes.slice();if(dataTypes[1]){for(conv in s.converters){converters[conv.toLowerCase()]=s.converters[conv];}}
current=dataTypes.shift();while(current){if(s.responseFields[current]){jqXHR[s.responseFields[current]]=response;}
if(!prev&&isSuccess&&s.dataFilter){response=s.dataFilter(response,s.dataType);}
prev=current;current=dataTypes.shift();if(current){if(current==="*"){current=prev;}else if(prev!=="*"&&prev!==current){conv=converters[prev+" "+current]||converters["* "+current];if(!conv){for(conv2 in converters){tmp=conv2.split(" ");if(tmp[1]===current){conv=converters[prev+" "+tmp[0]]||converters["* "+tmp[0]];if(conv){if(conv===true){conv=converters[conv2];}else if(converters[conv2]!==true){current=tmp[0];dataTypes.unshift(tmp[1]);}
break;}}}}
if(conv!==true){if(conv&&s["throws"]){response=conv(response);}else{try{response=conv(response);}catch(e){return{state:"parsererror",error:conv?e:"No conversion from "+prev+" to "+current};}}}}}}
return{state:"success",data:response};}
jQuery.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:ajaxLocation,type:"GET",isLocal:rlocalProtocol.test(ajaxLocParts[1]),global:true,processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":allTypes,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":true,"text json":jQuery.parseJSON,"text xml":jQuery.parseXML},flatOptions:{url:true,context:true}},ajaxSetup:function(target,settings){return settings?ajaxExtend(ajaxExtend(target,jQuery.ajaxSettings),settings):ajaxExtend(jQuery.ajaxSettings,target);},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports),ajax:function(url,options){if(typeof url==="object"){options=url;url=undefined;}
options=options||{};var transport,cacheURL,responseHeadersString,responseHeaders,timeoutTimer,parts,fireGlobals,i,s=jQuery.ajaxSetup({},options),callbackContext=s.context||s,globalEventContext=s.context&&(callbackContext.nodeType||callbackContext.jquery)?jQuery(callbackContext):jQuery.event,deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"),statusCode=s.statusCode||{},requestHeaders={},requestHeadersNames={},state=0,strAbort="canceled",jqXHR={readyState:0,getResponseHeader:function(key){var match;if(state===2){if(!responseHeaders){responseHeaders={};while((match=rheaders.exec(responseHeadersString))){responseHeaders[match[1].toLowerCase()]=match[2];}}
match=responseHeaders[key.toLowerCase()];}
return match==null?null:match;},getAllResponseHeaders:function(){return state===2?responseHeadersString:null;},setRequestHeader:function(name,value){var lname=name.toLowerCase();if(!state){name=requestHeadersNames[lname]=requestHeadersNames[lname]||name;requestHeaders[name]=value;}
return this;},overrideMimeType:function(type){if(!state){s.mimeType=type;}
return this;},statusCode:function(map){var code;if(map){if(state<2){for(code in map){statusCode[code]=[statusCode[code],map[code]];}}else{jqXHR.always(map[jqXHR.status]);}}
return this;},abort:function(statusText){var finalText=statusText||strAbort;if(transport){transport.abort(finalText);}
done(0,finalText);return this;}};deferred.promise(jqXHR).complete=completeDeferred.add;jqXHR.success=jqXHR.done;jqXHR.error=jqXHR.fail;s.url=((url||s.url||ajaxLocation)+"").replace(rhash,"").replace(rprotocol,ajaxLocParts[1]+"//");s.type=options.method||options.type||s.method||s.type;s.dataTypes=jQuery.trim(s.dataType||"*").toLowerCase().match(rnotwhite)||[""];if(s.crossDomain==null){parts=rurl.exec(s.url.toLowerCase());s.crossDomain=!!(parts&&(parts[1]!==ajaxLocParts[1]||parts[2]!==ajaxLocParts[2]||(parts[3]||(parts[1]==="http:"?"80":"443"))!==(ajaxLocParts[3]||(ajaxLocParts[1]==="http:"?"80":"443"))));}
if(s.data&&s.processData&&typeof s.data!=="string"){s.data=jQuery.param(s.data,s.traditional);}
inspectPrefiltersOrTransports(prefilters,s,options,jqXHR);if(state===2){return jqXHR;}
fireGlobals=jQuery.event&&s.global;if(fireGlobals&&jQuery.active++===0){jQuery.event.trigger("ajaxStart");}
s.type=s.type.toUpperCase();s.hasContent=!rnoContent.test(s.type);cacheURL=s.url;if(!s.hasContent){if(s.data){cacheURL=(s.url+=(rquery.test(cacheURL)?"&":"?")+s.data);delete s.data;}
if(s.cache===false){s.url=rts.test(cacheURL)?cacheURL.replace(rts,"$1_="+nonce++):cacheURL+(rquery.test(cacheURL)?"&":"?")+"_="+nonce++;}}
if(s.ifModified){if(jQuery.lastModified[cacheURL]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[cacheURL]);}
if(jQuery.etag[cacheURL]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[cacheURL]);}}
if(s.data&&s.hasContent&&s.contentType!==false||options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType);}
jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]);for(i in s.headers){jqXHR.setRequestHeader(i,s.headers[i]);}
if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||state===2)){return jqXHR.abort();}
strAbort="abort";for(i in{success:1,error:1,complete:1}){jqXHR[i](s[i]);}
transport=inspectPrefiltersOrTransports(transports,s,options,jqXHR);if(!transport){done(-1,"No Transport");}else{jqXHR.readyState=1;if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s]);}
if(s.async&&s.timeout>0){timeoutTimer=setTimeout(function(){jqXHR.abort("timeout");},s.timeout);}
try{state=1;transport.send(requestHeaders,done);}catch(e){if(state<2){done(-1,e);}else{throw e;}}}
function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText;if(state===2){return;}
state=2;if(timeoutTimer){clearTimeout(timeoutTimer);}
transport=undefined;responseHeadersString=headers||"";jqXHR.readyState=status>0?4:0;isSuccess=status>=200&&status<300||status===304;if(responses){response=ajaxHandleResponses(s,jqXHR,responses);}
response=ajaxConvert(s,response,jqXHR,isSuccess);if(isSuccess){if(s.ifModified){modified=jqXHR.getResponseHeader("Last-Modified");if(modified){jQuery.lastModified[cacheURL]=modified;}
modified=jqXHR.getResponseHeader("etag");if(modified){jQuery.etag[cacheURL]=modified;}}
if(status===204||s.type==="HEAD"){statusText="nocontent";}else if(status===304){statusText="notmodified";}else{statusText=response.state;success=response.data;error=response.error;isSuccess=!error;}}else{error=statusText;if(status||!statusText){statusText="error";if(status<0){status=0;}}}
jqXHR.status=status;jqXHR.statusText=(nativeStatusText||statusText)+"";if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR]);}else{deferred.rejectWith(callbackContext,[jqXHR,statusText,error]);}
jqXHR.statusCode(statusCode);statusCode=undefined;if(fireGlobals){globalEventContext.trigger(isSuccess?"ajaxSuccess":"ajaxError",[jqXHR,s,isSuccess?success:error]);}
completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]);if(!(--jQuery.active)){jQuery.event.trigger("ajaxStop");}}}
return jqXHR;},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json");},getScript:function(url,callback){return jQuery.get(url,undefined,callback,"script");}});jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){if(jQuery.isFunction(data)){type=type||callback;callback=data;data=undefined;}
return jQuery.ajax({url:url,type:method,dataType:type,data:data,success:callback});};});jQuery._evalUrl=function(url){return jQuery.ajax({url:url,type:"GET",dataType:"script",async:false,global:false,"throws":true});};jQuery.fn.extend({wrapAll:function(html){var wrap;if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapAll(html.call(this,i));});}
if(this[0]){wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){wrap.insertBefore(this[0]);}
wrap.map(function(){var elem=this;while(elem.firstElementChild){elem=elem.firstElementChild;}
return elem;}).append(this);}
return this;},wrapInner:function(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i));});}
return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length){contents.wrapAll(html);}else{self.append(html);}});},wrap:function(html){var isFunction=jQuery.isFunction(html);return this.each(function(i){jQuery(this).wrapAll(isFunction?html.call(this,i):html);});},unwrap:function(){return this.parent().each(function(){if(!jQuery.nodeName(this,"body")){jQuery(this).replaceWith(this.childNodes);}}).end();}});jQuery.expr.filters.hidden=function(elem){return elem.offsetWidth<=0&&elem.offsetHeight<=0;};jQuery.expr.filters.visible=function(elem){return!jQuery.expr.filters.hidden(elem);};var r20=/%20/g,rbracket=/\[\]$/,rCRLF=/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;function buildParams(prefix,obj,traditional,add){var name;if(jQuery.isArray(obj)){jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix)){add(prefix,v);}else{buildParams(prefix+"["+(typeof v==="object"?i:"")+"]",v,traditional,add);}});}else if(!traditional&&jQuery.type(obj)==="object"){for(name in obj){buildParams(prefix+"["+name+"]",obj[name],traditional,add);}}else{add(prefix,obj);}}
jQuery.param=function(a,traditional){var prefix,s=[],add=function(key,value){value=jQuery.isFunction(value)?value():(value==null?"":value);s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value);};if(traditional===undefined){traditional=jQuery.ajaxSettings&&jQuery.ajaxSettings.traditional;}
if(jQuery.isArray(a)||(a.jquery&&!jQuery.isPlainObject(a))){jQuery.each(a,function(){add(this.name,this.value);});}else{for(prefix in a){buildParams(prefix,a[prefix],traditional,add);}}
return s.join("&").replace(r20,"+");};jQuery.fn.extend({serialize:function(){return jQuery.param(this.serializeArray());},serializeArray:function(){return this.map(function(){var elements=jQuery.prop(this,"elements");return elements?jQuery.makeArray(elements):this;}).filter(function(){var type=this.type;return this.name&&!jQuery(this).is(":disabled")&&rsubmittable.test(this.nodeName)&&!rsubmitterTypes.test(type)&&(this.checked||!rcheckableType.test(type));}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:jQuery.isArray(val)?jQuery.map(val,function(val){return{name:elem.name,value:val.replace(rCRLF,"\r\n")};}):{name:elem.name,value:val.replace(rCRLF,"\r\n")};}).get();}});jQuery.ajaxSettings.xhr=function(){try{return new XMLHttpRequest();}catch(e){}};var xhrId=0,xhrCallbacks={},xhrSuccessStatus={0:200,1223:204},xhrSupported=jQuery.ajaxSettings.xhr();if(window.attachEvent){window.attachEvent("onunload",function(){for(var key in xhrCallbacks){xhrCallbacks[key]();}});}
support.cors=!!xhrSupported&&("withCredentials"in xhrSupported);support.ajax=xhrSupported=!!xhrSupported;jQuery.ajaxTransport(function(options){var callback;if(support.cors||xhrSupported&&!options.crossDomain){return{send:function(headers,complete){var i,xhr=options.xhr(),id=++xhrId;xhr.open(options.type,options.url,options.async,options.username,options.password);if(options.xhrFields){for(i in options.xhrFields){xhr[i]=options.xhrFields[i];}}
if(options.mimeType&&xhr.overrideMimeType){xhr.overrideMimeType(options.mimeType);}
if(!options.crossDomain&&!headers["X-Requested-With"]){headers["X-Requested-With"]="XMLHttpRequest";}
for(i in headers){xhr.setRequestHeader(i,headers[i]);}
callback=function(type){return function(){if(callback){delete xhrCallbacks[id];callback=xhr.onload=xhr.onerror=null;if(type==="abort"){xhr.abort();}else if(type==="error"){complete(xhr.status,xhr.statusText);}else{complete(xhrSuccessStatus[xhr.status]||xhr.status,xhr.statusText,typeof xhr.responseText==="string"?{text:xhr.responseText}:undefined,xhr.getAllResponseHeaders());}}};};xhr.onload=callback();xhr.onerror=callback("error");callback=xhrCallbacks[id]=callback("abort");try{xhr.send(options.hasContent&&options.data||null);}catch(e){if(callback){throw e;}}},abort:function(){if(callback){callback();}}};}});jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(text){jQuery.globalEval(text);return text;}}});jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined){s.cache=false;}
if(s.crossDomain){s.type="GET";}});jQuery.ajaxTransport("script",function(s){if(s.crossDomain){var script,callback;return{send:function(_,complete){script=jQuery("<script>").prop({async:true,charset:s.scriptCharset,src:s.url}).on("load error",callback=function(evt){script.remove();callback=null;if(evt){complete(evt.type==="error"?404:200,evt.type);}});document.head.appendChild(script[0]);},abort:function(){if(callback){callback();}}};}});var oldCallbacks=[],rjsonp=/(=)\?(?=&|$)|\?\?/;jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var callback=oldCallbacks.pop()||(jQuery.expando+"_"+(nonce++));this[callback]=true;return callback;}});jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,jsonProp=s.jsonp!==false&&(rjsonp.test(s.url)?"url":typeof s.data==="string"&&!(s.contentType||"").indexOf("application/x-www-form-urlencoded")&&rjsonp.test(s.data)&&"data");if(jsonProp||s.dataTypes[0]==="jsonp"){callbackName=s.jsonpCallback=jQuery.isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback;if(jsonProp){s[jsonProp]=s[jsonProp].replace(rjsonp,"$1"+callbackName);}else if(s.jsonp!==false){s.url+=(rquery.test(s.url)?"&":"?")+s.jsonp+"="+callbackName;}
s.converters["script json"]=function(){if(!responseContainer){jQuery.error(callbackName+" was not called");}
return responseContainer[0];};s.dataTypes[0]="json";overwritten=window[callbackName];window[callbackName]=function(){responseContainer=arguments;};jqXHR.always(function(){window[callbackName]=overwritten;if(s[callbackName]){s.jsonpCallback=originalSettings.jsonpCallback;oldCallbacks.push(callbackName);}
if(responseContainer&&jQuery.isFunction(overwritten)){overwritten(responseContainer[0]);}
responseContainer=overwritten=undefined;});return"script";}});jQuery.parseHTML=function(data,context,keepScripts){if(!data||typeof data!=="string"){return null;}
if(typeof context==="boolean"){keepScripts=context;context=false;}
context=context||document;var parsed=rsingleTag.exec(data),scripts=!keepScripts&&[];if(parsed){return[context.createElement(parsed[1])];}
parsed=jQuery.buildFragment([data],context,scripts);if(scripts&&scripts.length){jQuery(scripts).remove();}
return jQuery.merge([],parsed.childNodes);};var _load=jQuery.fn.load;jQuery.fn.load=function(url,params,callback){if(typeof url!=="string"&&_load){return _load.apply(this,arguments);}
var selector,type,response,self=this,off=url.indexOf(" ");if(off>=0){selector=jQuery.trim(url.slice(off));url=url.slice(0,off);}
if(jQuery.isFunction(params)){callback=params;params=undefined;}else if(params&&typeof params==="object"){type="POST";}
if(self.length>0){jQuery.ajax({url:url,type:type,dataType:"html",data:params}).done(function(responseText){response=arguments;self.html(selector?jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector):responseText);}).complete(callback&&function(jqXHR,status){self.each(callback,response||[jqXHR.responseText,status,jqXHR]);});}
return this;};jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(i,type){jQuery.fn[type]=function(fn){return this.on(type,fn);};});jQuery.expr.filters.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem;}).length;};var docElem=window.document.documentElement;function getWindow(elem){return jQuery.isWindow(elem)?elem:elem.nodeType===9&&elem.defaultView;}
jQuery.offset={setOffset:function(elem,options,i){var curPosition,curLeft,curCSSTop,curTop,curOffset,curCSSLeft,calculatePosition,position=jQuery.css(elem,"position"),curElem=jQuery(elem),props={};if(position==="static"){elem.style.position="relative";}
curOffset=curElem.offset();curCSSTop=jQuery.css(elem,"top");curCSSLeft=jQuery.css(elem,"left");calculatePosition=(position==="absolute"||position==="fixed")&&(curCSSTop+curCSSLeft).indexOf("auto")>-1;if(calculatePosition){curPosition=curElem.position();curTop=curPosition.top;curLeft=curPosition.left;}else{curTop=parseFloat(curCSSTop)||0;curLeft=parseFloat(curCSSLeft)||0;}
if(jQuery.isFunction(options)){options=options.call(elem,i,curOffset);}
if(options.top!=null){props.top=(options.top-curOffset.top)+curTop;}
if(options.left!=null){props.left=(options.left-curOffset.left)+curLeft;}
if("using"in options){options.using.call(elem,props);}else{curElem.css(props);}}};jQuery.fn.extend({offset:function(options){if(arguments.length){return options===undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i);});}
var docElem,win,elem=this[0],box={top:0,left:0},doc=elem&&elem.ownerDocument;if(!doc){return;}
docElem=doc.documentElement;if(!jQuery.contains(docElem,elem)){return box;}
if(typeof elem.getBoundingClientRect!==strundefined){box=elem.getBoundingClientRect();}
win=getWindow(doc);return{top:box.top+win.pageYOffset-docElem.clientTop,left:box.left+win.pageXOffset-docElem.clientLeft};},position:function(){if(!this[0]){return;}
var offsetParent,offset,elem=this[0],parentOffset={top:0,left:0};if(jQuery.css(elem,"position")==="fixed"){offset=elem.getBoundingClientRect();}else{offsetParent=this.offsetParent();offset=this.offset();if(!jQuery.nodeName(offsetParent[0],"html")){parentOffset=offsetParent.offset();}
parentOffset.top+=jQuery.css(offsetParent[0],"borderTopWidth",true);parentOffset.left+=jQuery.css(offsetParent[0],"borderLeftWidth",true);}
return{top:offset.top-parentOffset.top-jQuery.css(elem,"marginTop",true),left:offset.left-parentOffset.left-jQuery.css(elem,"marginLeft",true)};},offsetParent:function(){return this.map(function(){var offsetParent=this.offsetParent||docElem;while(offsetParent&&(!jQuery.nodeName(offsetParent,"html")&&jQuery.css(offsetParent,"position")==="static")){offsetParent=offsetParent.offsetParent;}
return offsetParent||docElem;});}});jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(method,prop){var top="pageYOffset"===prop;jQuery.fn[method]=function(val){return access(this,function(elem,method,val){var win=getWindow(elem);if(val===undefined){return win?win[prop]:elem[method];}
if(win){win.scrollTo(!top?val:window.pageXOffset,top?val:window.pageYOffset);}else{elem[method]=val;}},method,val,arguments.length,null);};});jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop]=addGetHookIf(support.pixelPosition,function(elem,computed){if(computed){computed=curCSS(elem,prop);return rnumnonpx.test(computed)?jQuery(elem).position()[prop]+"px":computed;}});});jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner"+name,content:type,"":"outer"+name},function(defaultExtra,funcName){jQuery.fn[funcName]=function(margin,value){var chainable=arguments.length&&(defaultExtra||typeof margin!=="boolean"),extra=defaultExtra||(margin===true||value===true?"margin":"border");return access(this,function(elem,type,value){var doc;if(jQuery.isWindow(elem)){return elem.document.documentElement["client"+name];}
if(elem.nodeType===9){doc=elem.documentElement;return Math.max(elem.body["scroll"+name],doc["scroll"+name],elem.body["offset"+name],doc["offset"+name],doc["client"+name]);}
return value===undefined?jQuery.css(elem,type,extra):jQuery.style(elem,type,value,extra);},type,chainable?margin:undefined,chainable,null);};});});jQuery.fn.size=function(){return this.length;};jQuery.fn.andSelf=jQuery.fn.addBack;if(typeof define==="function"&&define.amd){define("jquery",[],function(){return jQuery;});}
var
_jQuery=window.jQuery,_$=window.$;jQuery.noConflict=function(deep){if(window.$===jQuery){window.$=_$;}
if(deep&&window.jQuery===jQuery){window.jQuery=_jQuery;}
return jQuery;};if(typeof noGlobal===strundefined){window.jQuery=window.$=jQuery;}
return jQuery;}));/*!
 * Bootstrap v3.2.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if(typeof jQuery==='undefined'){throw new Error('Bootstrap\'s JavaScript requires jQuery')}
+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false
var $el=this
$(this).one('bsTransitionEnd',function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()
if(!$.support.transition)return
$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);+function($){'use strict';var dismiss='[data-dismiss="alert"]'
var Alert=function(el){$(el).on('click',dismiss,this.close)}
Alert.VERSION='3.2.0'
Alert.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=$(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.hasClass('alert')?$this:$this.parent()}
$parent.trigger(e=$.Event('close.bs.alert'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.detach().trigger('closed.bs.alert').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one('bsTransitionEnd',removeElement).emulateTransitionEnd(150):removeElement()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.alert')
if(!data)$this.data('bs.alert',(data=new Alert(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.alert
$.fn.alert=Plugin
$.fn.alert.Constructor=Alert
$.fn.alert.noConflict=function(){$.fn.alert=old
return this}
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close)}(jQuery);+function($){'use strict';var Button=function(element,options){this.$element=$(element)
this.options=$.extend({},Button.DEFAULTS,options)
this.isLoading=false}
Button.VERSION='3.2.0'
Button.DEFAULTS={loadingText:'loading...'}
Button.prototype.setState=function(state){var d='disabled'
var $el=this.$element
var val=$el.is('input')?'val':'html'
var data=$el.data()
state=state+'Text'
if(data.resetText==null)$el.data('resetText',$el[val]())
$el[val](data[state]==null?this.options[state]:data[state])
setTimeout($.proxy(function(){if(state=='loadingText'){this.isLoading=true
$el.addClass(d).attr(d,d)}else if(this.isLoading){this.isLoading=false
$el.removeClass(d).removeAttr(d)}},this),0)}
Button.prototype.toggle=function(){var changed=true
var $parent=this.$element.closest('[data-toggle="buttons"]')
if($parent.length){var $input=this.$element.find('input')
if($input.prop('type')=='radio'){if($input.prop('checked')&&this.$element.hasClass('active'))changed=false
else $parent.find('.active').removeClass('active')}
if(changed)$input.prop('checked',!this.$element.hasClass('active')).trigger('change')}
if(changed)this.$element.toggleClass('active')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.button')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.button',(data=new Button(this,options)))
if(option=='toggle')data.toggle()
else if(option)data.setState(option)})}
var old=$.fn.button
$.fn.button=Plugin
$.fn.button.Constructor=Button
$.fn.button.noConflict=function(){$.fn.button=old
return this}
$(document).on('click.bs.button.data-api','[data-toggle^="button"]',function(e){var $btn=$(e.target)
if(!$btn.hasClass('btn'))$btn=$btn.closest('.btn')
Plugin.call($btn,'toggle')
e.preventDefault()})}(jQuery);+function($){'use strict';var Carousel=function(element,options){this.$element=$(element).on('keydown.bs.carousel',$.proxy(this.keydown,this))
this.$indicators=this.$element.find('.carousel-indicators')
this.options=options
this.paused=this.sliding=this.interval=this.$active=this.$items=null
this.options.pause=='hover'&&this.$element.on('mouseenter.bs.carousel',$.proxy(this.pause,this)).on('mouseleave.bs.carousel',$.proxy(this.cycle,this))}
Carousel.VERSION='3.2.0'
Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true}
Carousel.prototype.keydown=function(e){switch(e.which){case 37:this.prev();break
case 39:this.next();break
default:return}
e.preventDefault()}
Carousel.prototype.cycle=function(e){e||(this.paused=false)
this.interval&&clearInterval(this.interval)
this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval))
return this}
Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children('.item')
return this.$items.index(item||this.$active)}
Carousel.prototype.to=function(pos){var that=this
var activeIndex=this.getItemIndex(this.$active=this.$element.find('.item.active'))
if(pos>(this.$items.length-1)||pos<0)return
if(this.sliding)return this.$element.one('slid.bs.carousel',function(){that.to(pos)})
if(activeIndex==pos)return this.pause().cycle()
return this.slide(pos>activeIndex?'next':'prev',$(this.$items[pos]))}
Carousel.prototype.pause=function(e){e||(this.paused=true)
if(this.$element.find('.next, .prev').length&&$.support.transition){this.$element.trigger($.support.transition.end)
this.cycle(true)}
this.interval=clearInterval(this.interval)
return this}
Carousel.prototype.next=function(){if(this.sliding)return
return this.slide('next')}
Carousel.prototype.prev=function(){if(this.sliding)return
return this.slide('prev')}
Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active')
var $next=next||$active[type]()
var isCycling=this.interval
var direction=type=='next'?'left':'right'
var fallback=type=='next'?'first':'last'
var that=this
if(!$next.length){if(!this.options.wrap)return
$next=this.$element.find('.item')[fallback]()}
if($next.hasClass('active'))return(this.sliding=false)
var relatedTarget=$next[0]
var slideEvent=$.Event('slide.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
this.$element.trigger(slideEvent)
if(slideEvent.isDefaultPrevented())return
this.sliding=true
isCycling&&this.pause()
if(this.$indicators.length){this.$indicators.find('.active').removeClass('active')
var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)])
$nextIndicator&&$nextIndicator.addClass('active')}
var slidEvent=$.Event('slid.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
if($.support.transition&&this.$element.hasClass('slide')){$next.addClass(type)
$next[0].offsetWidth
$active.addClass(direction)
$next.addClass(direction)
$active.one('bsTransitionEnd',function(){$next.removeClass([type,direction].join(' ')).addClass('active')
$active.removeClass(['active',direction].join(' '))
that.sliding=false
setTimeout(function(){that.$element.trigger(slidEvent)},0)}).emulateTransitionEnd($active.css('transition-duration').slice(0,-1)*1000)}else{$active.removeClass('active')
$next.addClass('active')
this.sliding=false
this.$element.trigger(slidEvent)}
isCycling&&this.cycle()
return this}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.carousel')
var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=='object'&&option)
var action=typeof option=='string'?option:options.slide
if(!data)$this.data('bs.carousel',(data=new Carousel(this,options)))
if(typeof option=='number')data.to(option)
else if(action)data[action]()
else if(options.interval)data.pause().cycle()})}
var old=$.fn.carousel
$.fn.carousel=Plugin
$.fn.carousel.Constructor=Carousel
$.fn.carousel.noConflict=function(){$.fn.carousel=old
return this}
$(document).on('click.bs.carousel.data-api','[data-slide], [data-slide-to]',function(e){var href
var $this=$(this)
var $target=$($this.attr('data-target')||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''))
if(!$target.hasClass('carousel'))return
var options=$.extend({},$target.data(),$this.data())
var slideIndex=$this.attr('data-slide-to')
if(slideIndex)options.interval=false
Plugin.call($target,options)
if(slideIndex){$target.data('bs.carousel').to(slideIndex)}
e.preventDefault()})
$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this)
Plugin.call($carousel,$carousel.data())})})}(jQuery);+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.transitioning=null
if(this.options.parent)this.$parent=$(this.options.parent)
if(this.options.toggle)this.toggle()}
Collapse.VERSION='3.2.0'
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var actives=this.$parent&&this.$parent.find('> .panel > .in')
if(actives&&actives.length){var hasData=actives.data('bs.collapse')
if(hasData&&hasData.transitioning)return
Plugin.call(actives,'hide')
hasData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')[dimension](0)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element[dimension](this.$element[dimension]())[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse').removeClass('in')
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.trigger('hidden.bs.collapse').removeClass('collapsing').addClass('collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(350)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&option=='show')option=!option
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.collapse
$.fn.collapse=Plugin
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var href
var $this=$(this)
var target=$this.attr('data-target')||e.preventDefault()||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
var $target=$(target)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
var parent=$this.attr('data-parent')
var $parent=parent&&$(parent)
if(!data||!data.transitioning){if($parent)$parent.find('[data-toggle="collapse"][data-parent="'+parent+'"]').not($this).addClass('collapsed')
$this[$target.hasClass('in')?'addClass':'removeClass']('collapsed')}
Plugin.call($target,option)})}(jQuery);+function($){'use strict';var backdrop='.dropdown-backdrop'
var toggle='[data-toggle="dropdown"]'
var Dropdown=function(element){$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.VERSION='3.2.0'
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click',clearMenus)}
var relatedTarget={relatedTarget:this}
$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.trigger('focus')
$parent.toggleClass('open').trigger('shown.bs.dropdown',relatedTarget)}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27)/.test(e.keyCode))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if(!isActive||(isActive&&e.keyCode==27)){if(e.which==27)$parent.find(toggle).trigger('focus')
return $this.trigger('click')}
var desc=' li:not(.divider):visible a'
var $items=$parent.find('[role="menu"]'+desc+', [role="listbox"]'+desc)
if(!$items.length)return
var index=$items.index($items.filter(':focus'))
if(e.keyCode==38&&index>0)index--
if(e.keyCode==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).trigger('focus')}
function clearMenus(e){if(e&&e.which===3)return
$(backdrop).remove()
$(toggle).each(function(){var $parent=getParent($(this))
var relatedTarget={relatedTarget:this}
if(!$parent.hasClass('open'))return
$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$parent.removeClass('open').trigger('hidden.bs.dropdown',relatedTarget)})}
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector&&$(selector)
return $parent&&$parent.length?$parent:$this.parent()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.dropdown')
if(!data)$this.data('bs.dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.dropdown
$.fn.dropdown=Plugin
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle+', [role="menu"], [role="listbox"]',Dropdown.prototype.keydown)}(jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
this.$body=$(document.body)
this.$element=$(element)
this.$backdrop=this.isShown=null
this.scrollbarWidth=0
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.VERSION='3.2.0'
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.checkScrollbar()
this.$body.addClass('modal-open')
this.setScrollbar()
this.escape()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(that.$body)}
that.$element.show().scrollTop(0)
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in').attr('aria-hidden',false)
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$element.find('.modal-dialog').one('bsTransitionEnd',function(){that.$element.trigger('focus').trigger(e)}).emulateTransitionEnd(300):that.$element.trigger('focus').trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.$body.removeClass('modal-open')
this.resetScrollbar()
this.escape()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').attr('aria-hidden',true).off('click.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one('bsTransitionEnd',$.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.trigger('focus')}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keyup.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keyup.dismiss.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var that=this
var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').appendTo(this.$body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus.call(this.$element[0]):this.hide.call(this)},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one('bsTransitionEnd',callback).emulateTransitionEnd(150):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
var callbackRemove=function(){that.removeBackdrop()
callback&&callback()}
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one('bsTransitionEnd',callbackRemove).emulateTransitionEnd(150):callbackRemove()}else if(callback){callback()}}
Modal.prototype.checkScrollbar=function(){if(document.body.clientWidth>=window.innerWidth)return
this.scrollbarWidth=this.scrollbarWidth||this.measureScrollbar()}
Modal.prototype.setScrollbar=function(){var bodyPad=parseInt((this.$body.css('padding-right')||0),10)
if(this.scrollbarWidth)this.$body.css('padding-right',bodyPad+this.scrollbarWidth)}
Modal.prototype.resetScrollbar=function(){this.$body.css('padding-right','')}
Modal.prototype.measureScrollbar=function(){var scrollDiv=document.createElement('div')
scrollDiv.className='modal-scrollbar-measure'
this.$body.append(scrollDiv)
var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth
this.$body[0].removeChild(scrollDiv)
return scrollbarWidth}
function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
var old=$.fn.modal
$.fn.modal=Plugin
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var $target=$($this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,'')))
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.one('show.bs.modal',function(showEvent){if(showEvent.isDefaultPrevented())return 
$target.one('hidden.bs.modal',function(){$this.is(':visible')&&$this.trigger('focus')})})
Plugin.call($target,option,this)})}(jQuery);+function($){'use strict';var Tooltip=function(element,options){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null
this.init('tooltip',element,options)}
Tooltip.VERSION='3.2.0'
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false,viewport:{selector:'body',padding:0}}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.$viewport=this.options.viewport&&$(this.options.viewport.selector||this.options.viewport)
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
var inDom=$.contains(document.documentElement,this.$element[0])
if(e.isDefaultPrevented()||!inDom)return
var that=this
var $tip=this.tip()
var tipId=this.getUID(this.type)
this.setContent()
$tip.attr('id',tipId)
this.$element.attr('aria-describedby',tipId)
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var orgPlacement=placement
var $parent=this.$element.parent()
var parentDim=this.getPosition($parent)
placement=placement=='bottom'&&pos.top+pos.height+actualHeight-parentDim.scroll>parentDim.height?'top':placement=='top'&&pos.top-parentDim.scroll-actualHeight<0?'bottom':placement=='right'&&pos.right+actualWidth>parentDim.width?'left':placement=='left'&&pos.left-actualWidth<parentDim.left?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
var complete=function(){that.$element.trigger('shown.bs.'+that.type)
that.hoverState=null}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(150):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top=offset.top+marginTop
offset.left=offset.left+marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight}
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight)
if(delta.left)offset.left+=delta.left
else offset.top+=delta.top
var arrowDelta=delta.left?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight
var arrowPosition=delta.left?'left':'top'
var arrowOffsetPosition=delta.left?'offsetWidth':'offsetHeight'
$tip.offset(offset)
this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],arrowPosition)}
Tooltip.prototype.replaceArrow=function(delta,dimension,position){this.arrow().css(position,delta?(50*(1-delta/dimension)+'%'):'')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(){var that=this
var $tip=this.tip()
var e=$.Event('hide.bs.'+this.type)
this.$element.removeAttr('aria-describedby')
function complete(){if(that.hoverState!='in')$tip.detach()
that.$element.trigger('hidden.bs.'+that.type)}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(150):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof($e.attr('data-original-title'))!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function($element){$element=$element||this.$element
var el=$element[0]
var isBody=el.tagName=='BODY'
return $.extend({},(typeof el.getBoundingClientRect=='function')?el.getBoundingClientRect():null,{scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop(),width:isBody?$(window).width():$element.outerWidth(),height:isBody?$(window).height():$element.outerHeight()},isBody?{top:0,left:0}:$element.offset())}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0}
if(!this.$viewport)return delta
var viewportPadding=this.options.viewport&&this.options.viewport.padding||0
var viewportDimensions=this.getPosition(this.$viewport)
if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll
var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight
if(topEdgeOffset<viewportDimensions.top){delta.top=viewportDimensions.top-topEdgeOffset}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}}else{var leftEdgeOffset=pos.left-viewportPadding
var rightEdgeOffset=pos.left+viewportPadding+actualWidth
if(leftEdgeOffset<viewportDimensions.left){delta.left=viewportDimensions.left-leftEdgeOffset}else if(rightEdgeOffset>viewportDimensions.width){delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}}
return delta}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1000000)
while(document.getElementById(prefix))
return prefix}
Tooltip.prototype.tip=function(){return(this.$tip=this.$tip||$(this.options.template))}
Tooltip.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow'))}
Tooltip.prototype.validate=function(){if(!this.$element[0].parentNode){this.hide()
this.$element=null
this.options=null}}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=this
if(e){self=$(e.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions())
$(e.currentTarget).data('bs.'+this.type,self)}}
self.tip().hasClass('in')?self.leave(self):self.enter(self)}
Tooltip.prototype.destroy=function(){clearTimeout(this.timeout)
this.hide().$element.off('.'+this.type).removeData('bs.'+this.type)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&option=='destroy')return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tooltip
$.fn.tooltip=Plugin
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);+function($){'use strict';var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.VERSION='3.2.0'
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
$tip.find('.popover-title')[this.options.html?'html':'text'](title)
$tip.find('.popover-content').empty()[this.options.html?(typeof content=='string'?'html':'append'):'text'](content)
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.arrow'))}
Popover.prototype.tip=function(){if(!this.$tip)this.$tip=$(this.options.template)
return this.$tip}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data&&option=='destroy')return
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.popover
$.fn.popover=Plugin
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);+function($){'use strict';function ScrollSpy(element,options){var process=$.proxy(this.process,this)
this.$body=$('body')
this.$scrollElement=$(element).is('body')?$(window):$(element)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||'')+' .nav li > a'
this.offsets=[]
this.targets=[]
this.activeTarget=null
this.scrollHeight=0
this.$scrollElement.on('scroll.bs.scrollspy',process)
this.refresh()
this.process()}
ScrollSpy.VERSION='3.2.0'
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)}
ScrollSpy.prototype.refresh=function(){var offsetMethod='offset'
var offsetBase=0
if(!$.isWindow(this.$scrollElement[0])){offsetMethod='position'
offsetBase=this.$scrollElement.scrollTop()}
this.offsets=[]
this.targets=[]
this.scrollHeight=this.getScrollHeight()
var self=this
this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#./.test(href)&&$(href)
return($href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+offsetBase,href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){self.offsets.push(this[0])
self.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.getScrollHeight()
var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(this.scrollHeight!=scrollHeight){this.refresh()}
if(scrollTop>=maxScroll){return activeTarget!=(i=targets[targets.length-1])&&this.activate(i)}
if(activeTarget&&scrollTop<=offsets[0]){return activeTarget!=(i=targets[0])&&this.activate(i)}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(!offsets[i+1]||scrollTop<=offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active')
var selector=this.selector+
'[data-target="'+target+'"],'+
this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate.bs.scrollspy')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.scrollspy
$.fn.scrollspy=Plugin
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load.bs.scrollspy.data-api',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
Plugin.call($spy,$spy.data())})})}(jQuery);+function($){'use strict';var Tab=function(element){this.element=$(element)}
Tab.VERSION='3.2.0'
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var previous=$ul.find('.active:last a')[0]
var e=$.Event('show.bs.tab',{relatedTarget:previous})
$this.trigger(e)
if(e.isDefaultPrevented())return
var $target=$(selector)
this.activate($this.closest('li'),$ul)
this.activate($target,$target.parent(),function(){$this.trigger({type:'shown.bs.tab',relatedTarget:previous})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&$active.hasClass('fade')
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active')
element.addClass('active')
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu')){element.closest('li.dropdown').addClass('active')}
callback&&callback()}
transition?$active.one('bsTransitionEnd',next).emulateTransitionEnd(150):next()
$active.removeClass('in')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tab
$.fn.tab=Plugin
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"], [data-toggle="pill"]',function(e){e.preventDefault()
Plugin.call($(this),'show')})}(jQuery);+function($){'use strict';var Affix=function(element,options){this.options=$.extend({},Affix.DEFAULTS,options)
this.$target=$(this.options.target).on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this))
this.$element=$(element)
this.affixed=this.unpin=this.pinnedOffset=null
this.checkPosition()}
Affix.VERSION='3.2.0'
Affix.RESET='affix affix-top affix-bottom'
Affix.DEFAULTS={offset:0,target:window}
Affix.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset
this.$element.removeClass(Affix.RESET).addClass('affix')
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
return(this.pinnedOffset=position.top-scrollTop)}
Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1)}
Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return
var scrollHeight=$(document).height()
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
var offset=this.options.offset
var offsetTop=offset.top
var offsetBottom=offset.bottom
if(typeof offset!='object')offsetBottom=offsetTop=offset
if(typeof offsetTop=='function')offsetTop=offset.top(this.$element)
if(typeof offsetBottom=='function')offsetBottom=offset.bottom(this.$element)
var affix=this.unpin!=null&&(scrollTop+this.unpin<=position.top)?false:offsetBottom!=null&&(position.top+this.$element.height()>=scrollHeight-offsetBottom)?'bottom':offsetTop!=null&&(scrollTop<=offsetTop)?'top':false
if(this.affixed===affix)return
if(this.unpin!=null)this.$element.css('top','')
var affixType='affix'+(affix?'-'+affix:'')
var e=$.Event(affixType+'.bs.affix')
this.$element.trigger(e)
if(e.isDefaultPrevented())return
this.affixed=affix
this.unpin=affix=='bottom'?this.getPinnedOffset():null
this.$element.removeClass(Affix.RESET).addClass(affixType).trigger($.Event(affixType.replace('affix','affixed')))
if(affix=='bottom'){this.$element.offset({top:scrollHeight-this.$element.height()-offsetBottom})}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.affix')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.affix',(data=new Affix(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.affix
$.fn.affix=Plugin
$.fn.affix.Constructor=Affix
$.fn.affix.noConflict=function(){$.fn.affix=old
return this}
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this)
var data=$spy.data()
data.offset=data.offset||{}
if(data.offsetBottom)data.offset.bottom=data.offsetBottom
if(data.offsetTop)data.offset.top=data.offsetTop
Plugin.call($spy,data)})})}(jQuery);(function($){"use strict";var defaultOptions={tagClass:function(item){return'label label-info';},focusClass:'focus',itemValue:function(item){return item?item.toString():item;},itemText:function(item){return this.itemValue(item);},itemTitle:function(item){return null;},freeInput:true,addOnBlur:true,maxTags:undefined,maxChars:undefined,confirmKeys:[13,44],delimiter:',',delimiterRegex:null,cancelConfirmKeysOnEmpty:false,onTagExists:function(item,$tag){$tag.hide().fadeIn();},trimValue:false,allowDuplicates:false,triggerChange:true};function TagsInput(element,options){this.isInit=true;this.itemsArray=[];this.$element=$(element);this.$element.hide();this.isSelect=(element.tagName==='SELECT');this.multiple=(this.isSelect&&element.hasAttribute('multiple'));this.objectItems=options&&options.itemValue;this.placeholderText=element.hasAttribute('placeholder')?this.$element.attr('placeholder'):'';this.inputSize=Math.max(1,this.placeholderText.length);this.$container=$('<div class="bootstrap-tagsinput"></div>');this.$input=$('<input type="text" placeholder="'+this.placeholderText+'"/>').appendTo(this.$container);this.$element.before(this.$container);this.build(options);this.isInit=false;}
TagsInput.prototype={constructor:TagsInput,add:function(item,dontPushVal,options){var self=this;if(self.options.maxTags&&self.itemsArray.length>=self.options.maxTags)
return;if(item!==false&&!item)
return;if(typeof item==="string"&&self.options.trimValue){item=$.trim(item);}
if(typeof item==="object"&&!self.objectItems)
throw("Can't add objects when itemValue option is not set");if(item.toString().match(/^\s*$/))
return;if(self.isSelect&&!self.multiple&&self.itemsArray.length>0)
self.remove(self.itemsArray[0]);if(typeof item==="string"&&this.$element[0].tagName==='INPUT'){var delimiter=(self.options.delimiterRegex)?self.options.delimiterRegex:self.options.delimiter;var items=item.split(delimiter);if(items.length>1){for(var i=0;i<items.length;i++){this.add(items[i],true);}
if(!dontPushVal)
self.pushVal(self.options.triggerChange);return;}}
var itemValue=self.options.itemValue(item),itemText=self.options.itemText(item),tagClass=self.options.tagClass(item),itemTitle=self.options.itemTitle(item);var existing=$.grep(self.itemsArray,function(item){return self.options.itemValue(item)===itemValue;})[0];if(existing&&!self.options.allowDuplicates){if(self.options.onTagExists){var $existingTag=$(".tag",self.$container).filter(function(){return $(this).data("item")===existing;});self.options.onTagExists(item,$existingTag);}
return;}
if(self.items().toString().length+item.length+1>self.options.maxInputLength)
return;var beforeItemAddEvent=$.Event('beforeItemAdd',{item:item,cancel:false,options:options});self.$element.trigger(beforeItemAddEvent);if(beforeItemAddEvent.cancel)
return;self.itemsArray.push(item);var $tag=$('<span class="tag '+htmlEncode(tagClass)+(itemTitle!==null?('" title="'+itemTitle):'')+'">'+htmlEncode(itemText)+'<span data-role="remove"></span></span>');$tag.data('item',item);self.findInputWrapper().before($tag);$tag.after(' ');var optionExists=($('option[value="'+encodeURIComponent(itemValue)+'"]',self.$element).length||$('option[value="'+htmlEncode(itemValue)+'"]',self.$element).length);if(self.isSelect&&!optionExists){var $option=$('<option selected>'+htmlEncode(itemText)+'</option>');$option.data('item',item);$option.attr('value',itemValue);self.$element.append($option);}
if(!dontPushVal)
self.pushVal(self.options.triggerChange);if(self.options.maxTags===self.itemsArray.length||self.items().toString().length===self.options.maxInputLength)
self.$container.addClass('bootstrap-tagsinput-max');if($('.typeahead, .twitter-typeahead',self.$container).length){self.$input.typeahead('val','');}
if(this.isInit){self.$element.trigger($.Event('itemAddedOnInit',{item:item,options:options}));}else{self.$element.trigger($.Event('itemAdded',{item:item,options:options}));}},remove:function(item,dontPushVal,options){var self=this;if(self.objectItems){if(typeof item==="object")
item=$.grep(self.itemsArray,function(other){return self.options.itemValue(other)==self.options.itemValue(item);});else
item=$.grep(self.itemsArray,function(other){return self.options.itemValue(other)==item;});item=item[item.length-1];}
if(item){var beforeItemRemoveEvent=$.Event('beforeItemRemove',{item:item,cancel:false,options:options});self.$element.trigger(beforeItemRemoveEvent);if(beforeItemRemoveEvent.cancel)
return;$('.tag',self.$container).filter(function(){return $(this).data('item')===item;}).remove();$('option',self.$element).filter(function(){return $(this).data('item')===item;}).remove();if($.inArray(item,self.itemsArray)!==-1)
self.itemsArray.splice($.inArray(item,self.itemsArray),1);}
if(!dontPushVal)
self.pushVal(self.options.triggerChange);if(self.options.maxTags>self.itemsArray.length)
self.$container.removeClass('bootstrap-tagsinput-max');self.$element.trigger($.Event('itemRemoved',{item:item,options:options}));},removeAll:function(){var self=this;$('.tag',self.$container).remove();$('option',self.$element).remove();while(self.itemsArray.length>0)
self.itemsArray.pop();self.pushVal(self.options.triggerChange);},refresh:function(){var self=this;$('.tag',self.$container).each(function(){var $tag=$(this),item=$tag.data('item'),itemValue=self.options.itemValue(item),itemText=self.options.itemText(item),tagClass=self.options.tagClass(item);$tag.attr('class',null);$tag.addClass('tag '+htmlEncode(tagClass));$tag.contents().filter(function(){return this.nodeType==3;})[0].nodeValue=htmlEncode(itemText);if(self.isSelect){var option=$('option',self.$element).filter(function(){return $(this).data('item')===item;});option.attr('value',itemValue);}});},items:function(){return this.itemsArray;},pushVal:function(){var self=this,val=$.map(self.items(),function(item){return self.options.itemValue(item).toString();});self.$element.val(val,true);if(self.options.triggerChange)
self.$element.trigger('change');},build:function(options){var self=this;self.options=$.extend({},defaultOptions,options);if(self.objectItems)
self.options.freeInput=false;makeOptionItemFunction(self.options,'itemValue');makeOptionItemFunction(self.options,'itemText');makeOptionFunction(self.options,'tagClass');if(self.options.typeahead){var typeahead=self.options.typeahead||{};makeOptionFunction(typeahead,'source');self.$input.typeahead($.extend({},typeahead,{source:function(query,process){function processItems(items){var texts=[];for(var i=0;i<items.length;i++){var text=self.options.itemText(items[i]);map[text]=items[i];texts.push(text);}
process(texts);}
this.map={};var map=this.map,data=typeahead.source(query);if($.isFunction(data.success)){data.success(processItems);}else if($.isFunction(data.then)){data.then(processItems);}else{$.when(data).then(processItems);}},updater:function(text){self.add(this.map[text]);return this.map[text];},matcher:function(text){return(text.toLowerCase().indexOf(this.query.trim().toLowerCase())!==-1);},sorter:function(texts){return texts.sort();},highlighter:function(text){var regex=new RegExp('('+this.query+')','gi');return text.replace(regex,"<strong>$1</strong>");}}));}
if(self.options.typeaheadjs){var typeaheadConfig=null;var typeaheadDatasets={};var typeaheadjs=self.options.typeaheadjs;if($.isArray(typeaheadjs)){typeaheadConfig=typeaheadjs[0];typeaheadDatasets=typeaheadjs[1];}else{typeaheadDatasets=typeaheadjs;}
self.$input.typeahead(typeaheadConfig,typeaheadDatasets).on('typeahead:selected',$.proxy(function(obj,datum){if(typeaheadDatasets.valueKey)
self.add(datum[typeaheadDatasets.valueKey]);else
self.add(datum);self.$input.typeahead('val','');},self));}
self.$container.on('click',$.proxy(function(event){if(!self.$element.attr('disabled')){self.$input.removeAttr('disabled');}
self.$input.focus();},self));if(self.options.addOnBlur&&self.options.freeInput){self.$input.on('focusout',$.proxy(function(event){if($('.typeahead, .twitter-typeahead',self.$container).length===0){self.add(self.$input.val());self.$input.val('');}},self));}
self.$container.on({focusin:function(){self.$container.addClass(self.options.focusClass);},focusout:function(){self.$container.removeClass(self.options.focusClass);},});self.$container.on('keydown','input',$.proxy(function(event){var $input=$(event.target),$inputWrapper=self.findInputWrapper();if(self.$element.attr('disabled')){self.$input.attr('disabled','disabled');return;}
switch(event.which){case 8:if(doGetCaretPosition($input[0])===0){var prev=$inputWrapper.prev();if(prev.length){self.remove(prev.data('item'));}}
break;case 46:if(doGetCaretPosition($input[0])===0){var next=$inputWrapper.next();if(next.length){self.remove(next.data('item'));}}
break;case 37:var $prevTag=$inputWrapper.prev();if($input.val().length===0&&$prevTag[0]){$prevTag.before($inputWrapper);$input.focus();}
break;case 39:var $nextTag=$inputWrapper.next();if($input.val().length===0&&$nextTag[0]){$nextTag.after($inputWrapper);$input.focus();}
break;default:}
var textLength=$input.val().length,wordSpace=Math.ceil(textLength/5),size=textLength+wordSpace+1;$input.attr('size',Math.max(this.inputSize,$input.val().length));},self));self.$container.on('keypress','input',$.proxy(function(event){var $input=$(event.target);if(self.$element.attr('disabled')){self.$input.attr('disabled','disabled');return;}
var text=$input.val(),maxLengthReached=self.options.maxChars&&text.length>=self.options.maxChars;if(self.options.freeInput&&(keyCombinationInList(event,self.options.confirmKeys)||maxLengthReached)){if(text.length!==0){self.add(maxLengthReached?text.substr(0,self.options.maxChars):text);$input.val('');}
if(self.options.cancelConfirmKeysOnEmpty===false){event.preventDefault();}}
var textLength=$input.val().length,wordSpace=Math.ceil(textLength/5),size=textLength+wordSpace+1;$input.attr('size',Math.max(this.inputSize,$input.val().length));},self));self.$container.on('click','[data-role=remove]',$.proxy(function(event){if(self.$element.attr('disabled')){return;}
self.remove($(event.target).closest('.tag').data('item'));},self));if(self.options.itemValue===defaultOptions.itemValue){if(self.$element[0].tagName==='INPUT'){self.add(self.$element.val());}else{$('option',self.$element).each(function(){self.add($(this).attr('value'),true);});}}},destroy:function(){var self=this;self.$container.off('keypress','input');self.$container.off('click','[role=remove]');self.$container.remove();self.$element.removeData('tagsinput');self.$element.show();},focus:function(){this.$input.focus();},input:function(){return this.$input;},findInputWrapper:function(){var elt=this.$input[0],container=this.$container[0];while(elt&&elt.parentNode!==container)
elt=elt.parentNode;return $(elt);}};$.fn.tagsinput=function(arg1,arg2,arg3){var results=[];this.each(function(){var tagsinput=$(this).data('tagsinput');if(!tagsinput){tagsinput=new TagsInput(this,arg1);$(this).data('tagsinput',tagsinput);results.push(tagsinput);if(this.tagName==='SELECT'){$('option',$(this)).attr('selected','selected');}
$(this).val($(this).val());}else if(!arg1&&!arg2){results.push(tagsinput);}else if(tagsinput[arg1]!==undefined){if(tagsinput[arg1].length===3&&arg3!==undefined){var retVal=tagsinput[arg1](arg2,null,arg3);}else{var retVal=tagsinput[arg1](arg2);}
if(retVal!==undefined)
results.push(retVal);}});if(typeof arg1=='string'){return results.length>1?results:results[0];}else{return results;}};$.fn.tagsinput.Constructor=TagsInput;function makeOptionItemFunction(options,key){if(typeof options[key]!=='function'){var propertyName=options[key];options[key]=function(item){return item[propertyName];};}}
function makeOptionFunction(options,key){if(typeof options[key]!=='function'){var value=options[key];options[key]=function(){return value;};}}
var htmlEncodeContainer=$('<div />');function htmlEncode(value){if(value){return htmlEncodeContainer.text(value).html();}else{return'';}}
function doGetCaretPosition(oField){var iCaretPos=0;if(document.selection){oField.focus();var oSel=document.selection.createRange();oSel.moveStart('character',-oField.value.length);iCaretPos=oSel.text.length;}else if(oField.selectionStart||oField.selectionStart=='0'){iCaretPos=oField.selectionStart;}
return(iCaretPos);}
function keyCombinationInList(keyPressEvent,lookupList){var found=false;$.each(lookupList,function(index,keyCombination){if(typeof(keyCombination)==='number'&&keyPressEvent.which===keyCombination){found=true;return false;}
if(keyPressEvent.which===keyCombination.which){var alt=!keyCombination.hasOwnProperty('altKey')||keyPressEvent.altKey===keyCombination.altKey,shift=!keyCombination.hasOwnProperty('shiftKey')||keyPressEvent.shiftKey===keyCombination.shiftKey,ctrl=!keyCombination.hasOwnProperty('ctrlKey')||keyPressEvent.ctrlKey===keyCombination.ctrlKey;if(alt&&shift&&ctrl){found=true;return false;}}});return found;}
$(function(){$("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();});})(window.jQuery);/*!
 * jQuery.extendext 0.1.2
 *
 * Copyright 2014-2016 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * 
 * Based on jQuery.extend by jQuery Foundation, Inc. and other contributors
 */
(function(root,factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}
else if(typeof module==='object'&&module.exports){module.exports=factory(require('jquery'));}
else{factory(root.jQuery);}}(this,function($){"use strict";$.extendext=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false,arrayMode='default';if(typeof target==="boolean"){deep=target;target=arguments[i++]||{};}
if(typeof target==="string"){arrayMode=target.toLowerCase();if(arrayMode!=='concat'&&arrayMode!=='replace'&&arrayMode!=='extend'){arrayMode='default';}
target=arguments[i++]||{};}
if(typeof target!=="object"&&!$.isFunction(target)){target={};}
if(i===length){target=this;i--;}
for(;i<length;i++){if((options=arguments[i])!==null){if($.isArray(options)&&arrayMode!=='default'){clone=target&&$.isArray(target)?target:[];switch(arrayMode){case'concat':target=clone.concat($.extend(deep,[],options));break;case'replace':target=$.extend(deep,[],options);break;case'extend':options.forEach(function(e,i){if(typeof e==='object'){var type=$.isArray(e)?[]:{};clone[i]=$.extendext(deep,arrayMode,clone[i]||type,e);}else if(clone.indexOf(e)===-1){clone.push(e);}});target=clone;break;}}else{for(name in options){src=target[name];copy=options[name];if(target===copy){continue;}
if(deep&&copy&&($.isPlainObject(copy)||(copyIsArray=$.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&$.isArray(src)?src:[];}else{clone=src&&$.isPlainObject(src)?src:{};}
target[name]=$.extendext(deep,arrayMode,clone,copy);}else if(copy!==undefined){target[name]=copy;}}}}}
return target;};}));/*!
 * jQuery.extendext 0.1.2
 *
 * Copyright 2014-2016 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * 
 * Based on jQuery.extend by jQuery Foundation, Inc. and other contributors
 */
(function(root,factory){if(typeof define==='function'&&define.amd){define('jQuery.extendext',['jquery'],factory);}
else if(typeof module==='object'&&module.exports){module.exports=factory(require('jquery'));}
else{factory(root.jQuery);}}(this,function($){"use strict";$.extendext=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false,arrayMode='default';if(typeof target==="boolean"){deep=target;target=arguments[i++]||{};}
if(typeof target==="string"){arrayMode=target.toLowerCase();if(arrayMode!=='concat'&&arrayMode!=='replace'&&arrayMode!=='extend'){arrayMode='default';}
target=arguments[i++]||{};}
if(typeof target!=="object"&&!$.isFunction(target)){target={};}
if(i===length){target=this;i--;}
for(;i<length;i++){if((options=arguments[i])!==null){if($.isArray(options)&&arrayMode!=='default'){clone=target&&$.isArray(target)?target:[];switch(arrayMode){case'concat':target=clone.concat($.extend(deep,[],options));break;case'replace':target=$.extend(deep,[],options);break;case'extend':options.forEach(function(e,i){if(typeof e==='object'){var type=$.isArray(e)?[]:{};clone[i]=$.extendext(deep,arrayMode,clone[i]||type,e);}else if(clone.indexOf(e)===-1){clone.push(e);}});target=clone;break;}}else{for(name in options){src=target[name];copy=options[name];if(target===copy){continue;}
if(deep&&copy&&($.isPlainObject(copy)||(copyIsArray=$.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&$.isArray(src)?src:[];}else{clone=src&&$.isPlainObject(src)?src:{};}
target[name]=$.extendext(deep,arrayMode,clone,copy);}else if(copy!==undefined){target[name]=copy;}}}}}
return target;};}));(function(){"use strict";var doT={name:"doT",version:"1.1.1",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:true,append:true,selfcontained:false,doNotSkipEncoded:false},template:undefined,compile:undefined,log:true},_globals;doT.encodeHTMLSource=function(doNotSkipEncoded){var encodeHTMLRules={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},matchHTML=doNotSkipEncoded?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(code){return code?code.toString().replace(matchHTML,function(m){return encodeHTMLRules[m]||m;}):"";};};_globals=(function(){return this||(0,eval)("this");}());if(typeof module!=="undefined"&&module.exports){module.exports=doT;}else if(typeof define==="function"&&define.amd){define('doT',function(){return doT;});}else{_globals.doT=doT;}
var startend={append:{start:"'+(",end:")+'",startencode:"'+encodeHTML("},split:{start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("}},skip=/$^/;function resolveDefs(c,block,def){return((typeof block==="string")?block:block.toString()).replace(c.define||skip,function(m,code,assign,value){if(code.indexOf("def.")===0){code=code.substring(4);}
if(!(code in def)){if(assign===":"){if(c.defineParams)value.replace(c.defineParams,function(m,param,v){def[code]={arg:param,text:v};});if(!(code in def))def[code]=value;}else{new Function("def","def['"+code+"']="+value)(def);}}
return"";}).replace(c.use||skip,function(m,code){if(c.useParams)code=code.replace(c.useParams,function(m,s,d,param){if(def[d]&&def[d].arg&&param){var rw=(d+":"+param).replace(/'|\\/g,"_");def.__exp=def.__exp||{};def.__exp[rw]=def[d].text.replace(new RegExp("(^|[^\\w$])"+def[d].arg+"([^\\w$])","g"),"$1"+param+"$2");return s+"def.__exp['"+rw+"']";}});var v=new Function("def","return "+code)(def);return v?resolveDefs(c,v,def):v;});}
function unescape(code){return code.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ");}
doT.template=function(tmpl,c,def){c=c||doT.templateSettings;var cse=c.append?startend.append:startend.split,needhtmlencode,sid=0,indv,str=(c.use||c.define)?resolveDefs(c,tmpl,def||{}):tmpl;str=("var out='"+(c.strip?str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):str).replace(/'|\\/g,"\\$&").replace(c.interpolate||skip,function(m,code){return cse.start+unescape(code)+cse.end;}).replace(c.encode||skip,function(m,code){needhtmlencode=true;return cse.startencode+unescape(code)+cse.end;}).replace(c.conditional||skip,function(m,elsecase,code){return elsecase?(code?"';}else if("+unescape(code)+"){out+='":"';}else{out+='"):(code?"';if("+unescape(code)+"){out+='":"';}out+='");}).replace(c.iterate||skip,function(m,iterate,vname,iname){if(!iterate)return"';} } out+='";sid+=1;indv=iname||"i"+sid;iterate=unescape(iterate);return"';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
+vname+"=arr"+sid+"["+indv+"+=1];out+='";}).replace(c.evaluate||skip,function(m,code){return"';"+unescape(code)+"out+='";})
+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,'\\t').replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,'$1').replace(/\+''/g,"");if(needhtmlencode){if(!c.selfcontained&&_globals&&!_globals._encodeHTML)_globals._encodeHTML=doT.encodeHTMLSource(c.doNotSkipEncoded);str="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
+doT.encodeHTMLSource.toString()+"("+(c.doNotSkipEncoded||'')+"));"
+str;}
try{return new Function(c.varname,str);}catch(e){if(typeof console!=="undefined")console.log("Could not create a template function: "+str);throw e;}};doT.compile=function(tmpl,def){return doT.template(tmpl,null,def);};}());/*!
 * jQuery QueryBuilder 2.5.2
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */
(function(root,factory){if(typeof define=='function'&&define.amd){define('query-builder',['jquery','dot/doT','jquery-extendext'],factory);}
else if(typeof module==='object'&&module.exports){module.exports=factory(require('jquery'),require('dot/doT'),require('jquery-extendext'));}
else{factory(root.jQuery,root.doT);}}(this,function($,doT){"use strict";var QueryBuilder=function($el,options){$el[0].queryBuilder=this;this.$el=$el;this.settings=$.extendext(true,'replace',{},QueryBuilder.DEFAULTS,options);this.model=new Model();this.status={id:null,generated_id:false,group_id:0,rule_id:0,has_optgroup:false,has_operator_optgroup:false};this.filters=this.settings.filters;this.icons=this.settings.icons;this.operators=this.settings.operators;this.templates=this.settings.templates;this.plugins=this.settings.plugins;this.lang=null;if(QueryBuilder.regional['en']===undefined){Utils.error('Config','"i18n/en.js" not loaded.');}
this.lang=$.extendext(true,'replace',{},QueryBuilder.regional['en'],QueryBuilder.regional[this.settings.lang_code],this.settings.lang);if(this.settings.allow_groups===false){this.settings.allow_groups=0;}
else if(this.settings.allow_groups===true){this.settings.allow_groups=-1;}
Object.keys(this.templates).forEach(function(tpl){if(!this.templates[tpl]){this.templates[tpl]=QueryBuilder.templates[tpl];}
if(typeof this.templates[tpl]=='string'){this.templates[tpl]=doT.template(this.templates[tpl]);}},this);if(!this.$el.attr('id')){this.$el.attr('id','qb_'+Math.floor(Math.random()*99999));this.status.generated_id=true;}
this.status.id=this.$el.attr('id');this.$el.addClass('query-builder form-inline');this.filters=this.checkFilters(this.filters);this.operators=this.checkOperators(this.operators);this.bindEvents();this.initPlugins();};$.extend(QueryBuilder.prototype,{trigger:function(type){var event=new $.Event(this._tojQueryEvent(type),{builder:this});this.$el.triggerHandler(event,Array.prototype.slice.call(arguments,1));return event;},change:function(type,value){var event=new $.Event(this._tojQueryEvent(type,true),{builder:this,value:value});this.$el.triggerHandler(event,Array.prototype.slice.call(arguments,2));return event.value;},on:function(type,cb){this.$el.on(this._tojQueryEvent(type),cb);return this;},off:function(type,cb){this.$el.off(this._tojQueryEvent(type),cb);return this;},once:function(type,cb){this.$el.one(this._tojQueryEvent(type),cb);return this;},_tojQueryEvent:function(name,filter){return name.split(' ').map(function(type){return type+'.queryBuilder'+(filter?'.filter':'');}).join(' ');}});QueryBuilder.types={'string':'string','integer':'number','double':'number','date':'datetime','time':'datetime','datetime':'datetime','boolean':'boolean'};QueryBuilder.inputs=['text','number','textarea','radio','checkbox','select'];QueryBuilder.modifiable_options=['display_errors','allow_groups','allow_empty','default_condition','default_filter'];QueryBuilder.selectors={group_container:'.rules-group-container',rule_container:'.rule-container',filter_container:'.rule-filter-container',operator_container:'.rule-operator-container',value_container:'.rule-value-container',error_container:'.error-container',condition_container:'.rules-group-header .group-conditions',rule_header:'.rule-header',group_header:'.rules-group-header',group_actions:'.group-actions',rule_actions:'.rule-actions',rules_list:'.rules-group-body>.rules-list',group_condition:'.rules-group-header [name$=_cond]',rule_filter:'.rule-filter-container [name$=_filter]',rule_operator:'.rule-operator-container [name$=_operator]',rule_value:'.rule-value-container [name*=_value_]',add_rule:'[data-add=rule]',delete_rule:'[data-delete=rule]',add_group:'[data-add=group]',delete_group:'[data-delete=group]'};QueryBuilder.templates={};QueryBuilder.regional={};QueryBuilder.OPERATORS={equal:{type:'equal',nb_inputs:1,multiple:false,apply_to:['string','number','datetime','boolean']},not_equal:{type:'not_equal',nb_inputs:1,multiple:false,apply_to:['string','number','datetime','boolean']},in:{type:'in',nb_inputs:1,multiple:true,apply_to:['string','number','datetime']},not_in:{type:'not_in',nb_inputs:1,multiple:true,apply_to:['string','number','datetime']},less:{type:'less',nb_inputs:1,multiple:false,apply_to:['number','datetime']},less_or_equal:{type:'less_or_equal',nb_inputs:1,multiple:false,apply_to:['number','datetime']},greater:{type:'greater',nb_inputs:1,multiple:false,apply_to:['number','datetime']},greater_or_equal:{type:'greater_or_equal',nb_inputs:1,multiple:false,apply_to:['number','datetime']},between:{type:'between',nb_inputs:2,multiple:false,apply_to:['number','datetime']},not_between:{type:'not_between',nb_inputs:2,multiple:false,apply_to:['number','datetime']},begins_with:{type:'begins_with',nb_inputs:1,multiple:false,apply_to:['string']},not_begins_with:{type:'not_begins_with',nb_inputs:1,multiple:false,apply_to:['string']},contains:{type:'contains',nb_inputs:1,multiple:false,apply_to:['string']},not_contains:{type:'not_contains',nb_inputs:1,multiple:false,apply_to:['string']},ends_with:{type:'ends_with',nb_inputs:1,multiple:false,apply_to:['string']},not_ends_with:{type:'not_ends_with',nb_inputs:1,multiple:false,apply_to:['string']},is_empty:{type:'is_empty',nb_inputs:0,multiple:false,apply_to:['string']},is_not_empty:{type:'is_not_empty',nb_inputs:0,multiple:false,apply_to:['string']},is_null:{type:'is_null',nb_inputs:0,multiple:false,apply_to:['string','number','datetime','boolean']},is_not_null:{type:'is_not_null',nb_inputs:0,multiple:false,apply_to:['string','number','datetime','boolean']}};QueryBuilder.DEFAULTS={filters:[],plugins:[],sort_filters:false,display_errors:true,allow_groups:-1,allow_empty:false,conditions:['AND','OR'],default_condition:'AND',inputs_separator:' , ',select_placeholder:'------',display_empty_filter:true,default_filter:null,optgroups:{},default_rule_flags:{filter_readonly:false,operator_readonly:false,value_readonly:false,no_delete:false},default_group_flags:{condition_readonly:false,no_add_rule:false,no_add_group:false,no_delete:false},templates:{group:null,rule:null,filterSelect:null,operatorSelect:null,ruleValueSelect:null},lang_code:'en',lang:{},operators:['equal','not_equal','in','not_in','less','less_or_equal','greater','greater_or_equal','between','not_between','begins_with','not_begins_with','contains','not_contains','ends_with','not_ends_with','is_empty','is_not_empty','is_null','is_not_null'],icons:{add_group:'glyphicon glyphicon-plus-sign',add_rule:'glyphicon glyphicon-plus',remove_group:'glyphicon glyphicon-remove',remove_rule:'glyphicon glyphicon-remove',error:'glyphicon glyphicon-warning-sign'}};QueryBuilder.plugins={};QueryBuilder.defaults=function(options){if(typeof options=='object'){$.extendext(true,'replace',QueryBuilder.DEFAULTS,options);}
else if(typeof options=='string'){if(typeof QueryBuilder.DEFAULTS[options]=='object'){return $.extend(true,{},QueryBuilder.DEFAULTS[options]);}
else{return QueryBuilder.DEFAULTS[options];}}
else{return $.extend(true,{},QueryBuilder.DEFAULTS);}};QueryBuilder.define=function(name,fct,def){QueryBuilder.plugins[name]={fct:fct,def:def||{}};};QueryBuilder.extend=function(methods){$.extend(QueryBuilder.prototype,methods);};QueryBuilder.prototype.initPlugins=function(){if(!this.plugins){return;}
if($.isArray(this.plugins)){var tmp={};this.plugins.forEach(function(plugin){tmp[plugin]=null;});this.plugins=tmp;}
Object.keys(this.plugins).forEach(function(plugin){if(plugin in QueryBuilder.plugins){this.plugins[plugin]=$.extend(true,{},QueryBuilder.plugins[plugin].def,this.plugins[plugin]||{});QueryBuilder.plugins[plugin].fct.call(this,this.plugins[plugin]);}
else{Utils.error('Config','Unable to find plugin "{0}"',plugin);}},this);};QueryBuilder.prototype.getPluginOptions=function(name,property){var plugin;if(this.plugins&&this.plugins[name]){plugin=this.plugins[name];}
else if(QueryBuilder.plugins[name]){plugin=QueryBuilder.plugins[name].def;}
if(plugin){if(property){return plugin[property];}
else{return plugin;}}
else{Utils.error('Config','Unable to find plugin "{0}"',name);}};QueryBuilder.prototype.init=function(rules){this.trigger('afterInit');if(rules){this.setRules(rules);delete this.settings.rules;}
else{this.setRoot(true);}};QueryBuilder.prototype.checkFilters=function(filters){var definedFilters=[];if(!filters||filters.length===0){Utils.error('Config','Missing filters list');}
filters.forEach(function(filter,i){if(!filter.id){Utils.error('Config','Missing filter {0} id',i);}
if(definedFilters.indexOf(filter.id)!=-1){Utils.error('Config','Filter "{0}" already defined',filter.id);}
definedFilters.push(filter.id);if(!filter.type){filter.type='string';}
else if(!QueryBuilder.types[filter.type]){Utils.error('Config','Invalid type "{0}"',filter.type);}
if(!filter.input){filter.input=QueryBuilder.types[filter.type]==='number'?'number':'text';}
else if(typeof filter.input!='function'&&QueryBuilder.inputs.indexOf(filter.input)==-1){Utils.error('Config','Invalid input "{0}"',filter.input);}
if(filter.operators){filter.operators.forEach(function(operator){if(typeof operator!='string'){Utils.error('Config','Filter operators must be global operators types (string)');}});}
if(!filter.field){filter.field=filter.id;}
if(!filter.label){filter.label=filter.field;}
if(!filter.optgroup){filter.optgroup=null;}
else{this.status.has_optgroup=true;if(!this.settings.optgroups[filter.optgroup]){this.settings.optgroups[filter.optgroup]=filter.optgroup;}}
switch(filter.input){case'radio':case'checkbox':if(!filter.values||filter.values.length<1){Utils.error('Config','Missing filter "{0}" values',filter.id);}
break;case'select':var cleanValues=[];filter.has_optgroup=false;Utils.iterateOptions(filter.values,function(value,label,optgroup){cleanValues.push({value:value,label:label,optgroup:optgroup||null});if(optgroup){filter.has_optgroup=true;if(!this.settings.optgroups[optgroup]){this.settings.optgroups[optgroup]=optgroup;}}}.bind(this));if(filter.has_optgroup){filter.values=Utils.groupSort(cleanValues,'optgroup');}
else{filter.values=cleanValues;}
if(filter.placeholder){if(filter.placeholder_value===undefined){filter.placeholder_value=-1;}
filter.values.forEach(function(entry){if(entry.value==filter.placeholder_value){Utils.error('Config','Placeholder of filter "{0}" overlaps with one of its values',filter.id);}});}
break;}},this);if(this.settings.sort_filters){if(typeof this.settings.sort_filters=='function'){filters.sort(this.settings.sort_filters);}
else{var self=this;filters.sort(function(a,b){return self.translate(a.label).localeCompare(self.translate(b.label));});}}
if(this.status.has_optgroup){filters=Utils.groupSort(filters,'optgroup');}
return filters;};QueryBuilder.prototype.checkOperators=function(operators){var definedOperators=[];operators.forEach(function(operator,i){if(typeof operator=='string'){if(!QueryBuilder.OPERATORS[operator]){Utils.error('Config','Unknown operator "{0}"',operator);}
operators[i]=operator=$.extendext(true,'replace',{},QueryBuilder.OPERATORS[operator]);}
else{if(!operator.type){Utils.error('Config','Missing "type" for operator {0}',i);}
if(QueryBuilder.OPERATORS[operator.type]){operators[i]=operator=$.extendext(true,'replace',{},QueryBuilder.OPERATORS[operator.type],operator);}
if(operator.nb_inputs===undefined||operator.apply_to===undefined){Utils.error('Config','Missing "nb_inputs" and/or "apply_to" for operator "{0}"',operator.type);}}
if(definedOperators.indexOf(operator.type)!=-1){Utils.error('Config','Operator "{0}" already defined',operator.type);}
definedOperators.push(operator.type);if(!operator.optgroup){operator.optgroup=null;}
else{this.status.has_operator_optgroup=true;if(!this.settings.optgroups[operator.optgroup]){this.settings.optgroups[operator.optgroup]=operator.optgroup;}}},this);if(this.status.has_operator_optgroup){operators=Utils.groupSort(operators,'optgroup');}
return operators;};QueryBuilder.prototype.bindEvents=function(){var self=this;var Selectors=QueryBuilder.selectors;this.$el.on('change.queryBuilder',Selectors.group_condition,function(){if($(this).is(':checked')){var $group=$(this).closest(Selectors.group_container);self.getModel($group).condition=$(this).val();}});this.$el.on('change.queryBuilder',Selectors.rule_filter,function(){var $rule=$(this).closest(Selectors.rule_container);self.getModel($rule).filter=self.getFilterById($(this).val());});this.$el.on('change.queryBuilder',Selectors.rule_operator,function(){var $rule=$(this).closest(Selectors.rule_container);self.getModel($rule).operator=self.getOperatorByType($(this).val());});this.$el.on('click.queryBuilder',Selectors.add_rule,function(){var $group=$(this).closest(Selectors.group_container);self.addRule(self.getModel($group));});this.$el.on('click.queryBuilder',Selectors.delete_rule,function(){var $rule=$(this).closest(Selectors.rule_container);self.deleteRule(self.getModel($rule));});if(this.settings.allow_groups!==0){this.$el.on('click.queryBuilder',Selectors.add_group,function(){var $group=$(this).closest(Selectors.group_container);self.addGroup(self.getModel($group));});this.$el.on('click.queryBuilder',Selectors.delete_group,function(){var $group=$(this).closest(Selectors.group_container);self.deleteGroup(self.getModel($group));});}
this.model.on({'drop':function(e,node){node.$el.remove();self.refreshGroupsConditions();},'add':function(e,parent,node,index){if(index===0){node.$el.prependTo(parent.$el.find('>'+QueryBuilder.selectors.rules_list));}
else{node.$el.insertAfter(parent.rules[index-1].$el);}
self.refreshGroupsConditions();},'move':function(e,node,group,index){node.$el.detach();if(index===0){node.$el.prependTo(group.$el.find('>'+QueryBuilder.selectors.rules_list));}
else{node.$el.insertAfter(group.rules[index-1].$el);}
self.refreshGroupsConditions();},'update':function(e,node,field,value,oldValue){if(node instanceof Rule){switch(field){case'error':self.updateError(node);break;case'flags':self.applyRuleFlags(node);break;case'filter':self.updateRuleFilter(node,oldValue);break;case'operator':self.updateRuleOperator(node,oldValue);break;case'value':self.updateRuleValue(node,oldValue);break;}}
else{switch(field){case'error':self.updateError(node);break;case'flags':self.applyGroupFlags(node);break;case'condition':self.updateGroupCondition(node,oldValue);break;}}}});};QueryBuilder.prototype.setRoot=function(addRule,data,flags){addRule=(addRule===undefined||addRule===true);var group_id=this.nextGroupId();var $group=$(this.getGroupTemplate(group_id,1));this.$el.append($group);this.model.root=new Group(null,$group);this.model.root.model=this.model;this.model.root.data=data;this.model.root.flags=$.extend({},this.settings.default_group_flags,flags);this.model.root.condition=this.settings.default_condition;this.trigger('afterAddGroup',this.model.root);if(addRule){this.addRule(this.model.root);}
return this.model.root;};QueryBuilder.prototype.addGroup=function(parent,addRule,data,flags){addRule=(addRule===undefined||addRule===true);var level=parent.level+1;var e=this.trigger('beforeAddGroup',parent,addRule,level);if(e.isDefaultPrevented()){return null;}
var group_id=this.nextGroupId();var $group=$(this.getGroupTemplate(group_id,level));var model=parent.addGroup($group);model.data=data;model.flags=$.extend({},this.settings.default_group_flags,flags);model.condition=this.settings.default_condition;this.trigger('afterAddGroup',model);this.trigger('rulesChanged');if(addRule){this.addRule(model);}
return model;};QueryBuilder.prototype.deleteGroup=function(group){if(group.isRoot()){return false;}
var e=this.trigger('beforeDeleteGroup',group);if(e.isDefaultPrevented()){return false;}
var del=true;group.each('reverse',function(rule){del&=this.deleteRule(rule);},function(group){del&=this.deleteGroup(group);},this);if(del){group.drop();this.trigger('afterDeleteGroup');this.trigger('rulesChanged');}
return del;};QueryBuilder.prototype.updateGroupCondition=function(group,previousCondition){group.$el.find('>'+QueryBuilder.selectors.group_condition).each(function(){var $this=$(this);$this.prop('checked',$this.val()===group.condition);$this.parent().toggleClass('active',$this.val()===group.condition);});this.trigger('afterUpdateGroupCondition',group,previousCondition);this.trigger('rulesChanged');};QueryBuilder.prototype.refreshGroupsConditions=function(){(function walk(group){if(!group.flags||(group.flags&&!group.flags.condition_readonly)){group.$el.find('>'+QueryBuilder.selectors.group_condition).prop('disabled',group.rules.length<=1).parent().toggleClass('disabled',group.rules.length<=1);}
group.each(null,function(group){walk(group);},this);}(this.model.root));};QueryBuilder.prototype.addRule=function(parent,data,flags){var e=this.trigger('beforeAddRule',parent);if(e.isDefaultPrevented()){return null;}
var rule_id=this.nextRuleId();var $rule=$(this.getRuleTemplate(rule_id));var model=parent.addRule($rule);model.data=data;model.flags=$.extend({},this.settings.default_rule_flags,flags);this.trigger('afterAddRule',model);this.trigger('rulesChanged');this.createRuleFilters(model);if(this.settings.default_filter||!this.settings.display_empty_filter){model.filter=this.change('getDefaultFilter',this.getFilterById(this.settings.default_filter||this.filters[0].id),model);}
return model;};QueryBuilder.prototype.deleteRule=function(rule){if(rule.flags.no_delete){return false;}
var e=this.trigger('beforeDeleteRule',rule);if(e.isDefaultPrevented()){return false;}
rule.drop();this.trigger('afterDeleteRule');this.trigger('rulesChanged');return true;};QueryBuilder.prototype.createRuleFilters=function(rule){var filters=this.change('getRuleFilters',this.filters,rule);var $filterSelect=$(this.getRuleFilterSelect(rule,filters));rule.$el.find(QueryBuilder.selectors.filter_container).html($filterSelect);this.trigger('afterCreateRuleFilters',rule);this.applyRuleFlags(rule);};QueryBuilder.prototype.createRuleOperators=function(rule){var $operatorContainer=rule.$el.find(QueryBuilder.selectors.operator_container).empty();if(!rule.filter){return;}
var operators=this.getOperators(rule.filter);var $operatorSelect=$(this.getRuleOperatorSelect(rule,operators));$operatorContainer.html($operatorSelect);if(rule.filter.default_operator){rule.__.operator=this.getOperatorByType(rule.filter.default_operator);}
else{rule.__.operator=operators[0];}
rule.$el.find(QueryBuilder.selectors.rule_operator).val(rule.operator.type);this.trigger('afterCreateRuleOperators',rule,operators);this.applyRuleFlags(rule);};QueryBuilder.prototype.createRuleInput=function(rule){var $valueContainer=rule.$el.find(QueryBuilder.selectors.value_container).empty();rule.__.value=undefined;if(!rule.filter||!rule.operator||rule.operator.nb_inputs===0){return;}
var self=this;var $inputs=$();var filter=rule.filter;for(var i=0;i<rule.operator.nb_inputs;i++){var $ruleInput=$(this.getRuleInput(rule,i));if(i>0)$valueContainer.append(this.settings.inputs_separator);$valueContainer.append($ruleInput);$inputs=$inputs.add($ruleInput);}
$valueContainer.css('display','');$inputs.on('change '+(filter.input_event||''),function(){if(!rule._updating_input){rule._updating_value=true;rule.value=self.getRuleInputValue(rule);rule._updating_value=false;}});if(filter.plugin){$inputs[filter.plugin](filter.plugin_config||{});}
this.trigger('afterCreateRuleInput',rule);if(filter.default_value!==undefined){rule.value=filter.default_value;}
else{rule._updating_value=true;rule.value=self.getRuleInputValue(rule);rule._updating_value=false;}
this.applyRuleFlags(rule);};QueryBuilder.prototype.updateRuleFilter=function(rule,previousFilter){this.createRuleOperators(rule);this.createRuleInput(rule);rule.$el.find(QueryBuilder.selectors.rule_filter).val(rule.filter?rule.filter.id:'-1');if(previousFilter&&rule.filter&&previousFilter.id!==rule.filter.id){rule.data=undefined;}
this.trigger('afterUpdateRuleFilter',rule,previousFilter);this.trigger('rulesChanged');};QueryBuilder.prototype.updateRuleOperator=function(rule,previousOperator){var $valueContainer=rule.$el.find(QueryBuilder.selectors.value_container);if(!rule.operator||rule.operator.nb_inputs===0){$valueContainer.hide();rule.__.value=undefined;}
else{$valueContainer.css('display','');if($valueContainer.is(':empty')||!previousOperator||rule.operator.nb_inputs!==previousOperator.nb_inputs||rule.operator.optgroup!==previousOperator.optgroup){this.createRuleInput(rule);}}
if(rule.operator){rule.$el.find(QueryBuilder.selectors.rule_operator).val(rule.operator.type);rule.__.value=this.getRuleInputValue(rule);}
this.trigger('afterUpdateRuleOperator',rule,previousOperator);this.trigger('rulesChanged');};QueryBuilder.prototype.updateRuleValue=function(rule,previousValue){if(!rule._updating_value){this.setRuleInputValue(rule,rule.value);}
this.trigger('afterUpdateRuleValue',rule,previousValue);this.trigger('rulesChanged');};QueryBuilder.prototype.applyRuleFlags=function(rule){var flags=rule.flags;var Selectors=QueryBuilder.selectors;rule.$el.find(Selectors.rule_filter).prop('disabled',flags.filter_readonly);rule.$el.find(Selectors.rule_operator).prop('disabled',flags.operator_readonly);rule.$el.find(Selectors.rule_value).prop('disabled',flags.value_readonly);if(flags.no_delete){rule.$el.find(Selectors.delete_rule).remove();}
this.trigger('afterApplyRuleFlags',rule);};QueryBuilder.prototype.applyGroupFlags=function(group){var flags=group.flags;var Selectors=QueryBuilder.selectors;group.$el.find('>'+Selectors.group_condition).prop('disabled',flags.condition_readonly).parent().toggleClass('readonly',flags.condition_readonly);if(flags.no_add_rule){group.$el.find(Selectors.add_rule).remove();}
if(flags.no_add_group){group.$el.find(Selectors.add_group).remove();}
if(flags.no_delete){group.$el.find(Selectors.delete_group).remove();}
this.trigger('afterApplyGroupFlags',group);};QueryBuilder.prototype.clearErrors=function(node){node=node||this.model.root;if(!node){return;}
node.error=null;if(node instanceof Group){node.each(function(rule){rule.error=null;},function(group){this.clearErrors(group);},this);}};QueryBuilder.prototype.updateError=function(node){if(this.settings.display_errors){if(node.error===null){node.$el.removeClass('has-error');}
else{var errorMessage=this.translate('errors',node.error[0]);errorMessage=Utils.fmt(errorMessage,node.error.slice(1));errorMessage=this.change('displayError',errorMessage,node.error,node);node.$el.addClass('has-error').find(QueryBuilder.selectors.error_container).eq(0).attr('title',errorMessage);}}};QueryBuilder.prototype.triggerValidationError=function(node,error,value){if(!$.isArray(error)){error=[error];}
var e=this.trigger('validationError',node,error,value);if(!e.isDefaultPrevented()){node.error=error;}};QueryBuilder.prototype.destroy=function(){this.trigger('beforeDestroy');if(this.status.generated_id){this.$el.removeAttr('id');}
this.clear();this.model=null;this.$el.off('.queryBuilder').removeClass('query-builder').removeData('queryBuilder');delete this.$el[0].queryBuilder;};QueryBuilder.prototype.reset=function(){var e=this.trigger('beforeReset');if(e.isDefaultPrevented()){return;}
this.status.group_id=1;this.status.rule_id=0;this.model.root.empty();this.model.root.data=undefined;this.model.root.flags=$.extend({},this.settings.default_group_flags);this.model.root.condition=this.settings.default_condition;this.addRule(this.model.root);this.trigger('afterReset');this.trigger('rulesChanged');};QueryBuilder.prototype.clear=function(){var e=this.trigger('beforeClear');if(e.isDefaultPrevented()){return;}
this.status.group_id=0;this.status.rule_id=0;if(this.model.root){this.model.root.drop();this.model.root=null;}
this.trigger('afterClear');this.trigger('rulesChanged');};QueryBuilder.prototype.setOptions=function(options){$.each(options,function(opt,value){if(QueryBuilder.modifiable_options.indexOf(opt)!==-1){this.settings[opt]=value;}}.bind(this));};QueryBuilder.prototype.getModel=function(target){if(!target){return this.model.root;}
else if(target instanceof Node){return target;}
else{return $(target).data('queryBuilderModel');}};QueryBuilder.prototype.validate=function(options){options=$.extend({skip_empty:false},options);this.clearErrors();var self=this;var valid=(function parse(group){var done=0;var errors=0;group.each(function(rule){if(!rule.filter&&options.skip_empty){return;}
if(!rule.filter){self.triggerValidationError(rule,'no_filter',null);errors++;return;}
if(!rule.operator){self.triggerValidationError(rule,'no_operator',null);errors++;return;}
if(rule.operator.nb_inputs!==0){var valid=self.validateValue(rule,rule.value);if(valid!==true){self.triggerValidationError(rule,valid,rule.value);errors++;return;}}
done++;},function(group){var res=parse(group);if(res===true){done++;}
else if(res===false){errors++;}});if(errors>0){return false;}
else if(done===0&&!group.isRoot()&&options.skip_empty){return null;}
else if(done===0&&(!self.settings.allow_empty||!group.isRoot())){self.triggerValidationError(group,'empty_group',null);return false;}
return true;}(this.model.root));return this.change('validate',valid);};QueryBuilder.prototype.getRules=function(options){options=$.extend({get_flags:false,allow_invalid:false,skip_empty:false},options);var valid=this.validate(options);if(!valid&&!options.allow_invalid){return null;}
var self=this;var out=(function parse(group){var groupData={condition:group.condition,rules:[]};if(group.data){groupData.data=$.extendext(true,'replace',{},group.data);}
if(options.get_flags){var flags=self.getGroupFlags(group.flags,options.get_flags==='all');if(!$.isEmptyObject(flags)){groupData.flags=flags;}}
group.each(function(rule){if(!rule.filter&&options.skip_empty){return;}
var value=null;if(!rule.operator||rule.operator.nb_inputs!==0){value=rule.value;}
var ruleData={id:rule.filter?rule.filter.id:null,field:rule.filter?rule.filter.field:null,type:rule.filter?rule.filter.type:null,input:rule.filter?rule.filter.input:null,operator:rule.operator?rule.operator.type:null,value:value};if(rule.filter&&rule.filter.data||rule.data){ruleData.data=$.extendext(true,'replace',{},rule.filter.data,rule.data);}
if(options.get_flags){var flags=self.getRuleFlags(rule.flags,options.get_flags==='all');if(!$.isEmptyObject(flags)){ruleData.flags=flags;}}
groupData.rules.push(self.change('ruleToJson',ruleData,rule));},function(model){var data=parse(model);if(data.rules.length!==0||!options.skip_empty){groupData.rules.push(data);}},this);return self.change('groupToJson',groupData,group);}(this.model.root));out.valid=valid;return this.change('getRules',out);};QueryBuilder.prototype.setRules=function(data,options){options=$.extend({allow_invalid:false},options);if($.isArray(data)){data={condition:this.settings.default_condition,rules:data};}
if(!data||!data.rules||(data.rules.length===0&&!this.settings.allow_empty)){Utils.error('RulesParse','Incorrect data object passed');}
this.clear();this.setRoot(false,data.data,this.parseGroupFlags(data));data=this.change('setRules',data,options);var self=this;(function add(data,group){if(group===null){return;}
if(data.condition===undefined){data.condition=self.settings.default_condition;}
else if(self.settings.conditions.indexOf(data.condition)==-1){Utils.error(!options.allow_invalid,'UndefinedCondition','Invalid condition "{0}"',data.condition);data.condition=self.settings.default_condition;}
group.condition=data.condition;data.rules.forEach(function(item){var model;if(item.rules!==undefined){if(self.settings.allow_groups!==-1&&self.settings.allow_groups<group.level){Utils.error(!options.allow_invalid,'RulesParse','No more than {0} groups are allowed',self.settings.allow_groups);self.reset();}
else{model=self.addGroup(group,false,item.data,self.parseGroupFlags(item));if(model===null){return;}
add(item,model);}}
else{if(!item.empty){if(item.id===undefined){Utils.error(!options.allow_invalid,'RulesParse','Missing rule field id');item.empty=true;}
if(item.operator===undefined){item.operator='equal';}}
model=self.addRule(group,item.data,self.parseRuleFlags(item));if(model===null){return;}
if(!item.empty){model.filter=self.getFilterById(item.id,!options.allow_invalid);}
if(model.filter){model.operator=self.getOperatorByType(item.operator,!options.allow_invalid);if(!model.operator){model.operator=self.getOperators(model.filter)[0];}}
if(model.operator&&model.operator.nb_inputs!==0){if(item.value!==undefined){model.value=item.value;}
else if(model.filter.default_value!==undefined){model.value=model.filter.default_value;}}
if(self.change('jsonToRule',model,item)!=model){Utils.error('RulesParse','Plugin tried to change rule reference');}}});if(self.change('jsonToGroup',group,data)!=group){Utils.error('RulesParse','Plugin tried to change group reference');}}(data,this.model.root));this.trigger('afterSetRules');};QueryBuilder.prototype.validateValue=function(rule,value){var validation=rule.filter.validation||{};var result=true;if(validation.callback){result=validation.callback.call(this,value,rule);}
else{result=this._validateValue(rule,value);}
return this.change('validateValue',result,value,rule);};QueryBuilder.prototype._validateValue=function(rule,value){var filter=rule.filter;var operator=rule.operator;var validation=filter.validation||{};var result=true;var tmp,tempValue;if(rule.operator.nb_inputs===1){value=[value];}
for(var i=0;i<operator.nb_inputs;i++){if(!operator.multiple&&$.isArray(value[i])&&value[i].length>1){result=['operator_not_multiple',operator.type,this.translate('operators',operator.type)];break;}
switch(filter.input){case'radio':if(value[i]===undefined||value[i].length===0){if(!validation.allow_empty_value){result=['radio_empty'];}
break;}
break;case'checkbox':if(value[i]===undefined||value[i].length===0){if(!validation.allow_empty_value){result=['checkbox_empty'];}
break;}
break;case'select':if(value[i]===undefined||value[i].length===0||(filter.placeholder&&value[i]==filter.placeholder_value)){if(!validation.allow_empty_value){result=['select_empty'];}
break;}
break;default:tempValue=$.isArray(value[i])?value[i]:[value[i]];for(var j=0;j<tempValue.length;j++){switch(QueryBuilder.types[filter.type]){case'string':if(tempValue[j]===undefined||tempValue[j].length===0){if(!validation.allow_empty_value){result=['string_empty'];}
break;}
if(validation.min!==undefined){if(tempValue[j].length<parseInt(validation.min)){result=[this.getValidationMessage(validation,'min','string_exceed_min_length'),validation.min];break;}}
if(validation.max!==undefined){if(tempValue[j].length>parseInt(validation.max)){result=[this.getValidationMessage(validation,'max','string_exceed_max_length'),validation.max];break;}}
if(validation.format){if(typeof validation.format=='string'){validation.format=new RegExp(validation.format);}
if(!validation.format.test(tempValue[j])){result=[this.getValidationMessage(validation,'format','string_invalid_format'),validation.format];break;}}
break;case'number':if(tempValue[j]===undefined||tempValue[j].length===0){if(!validation.allow_empty_value){result=['number_nan'];}
break;}
if(isNaN(tempValue[j])){result=['number_nan'];break;}
if(filter.type=='integer'){if(parseInt(tempValue[j])!=tempValue[j]){result=['number_not_integer'];break;}}
else{if(parseFloat(tempValue[j])!=tempValue[j]){result=['number_not_double'];break;}}
if(validation.min!==undefined){if(tempValue[j]<parseFloat(validation.min)){result=[this.getValidationMessage(validation,'min','number_exceed_min'),validation.min];break;}}
if(validation.max!==undefined){if(tempValue[j]>parseFloat(validation.max)){result=[this.getValidationMessage(validation,'max','number_exceed_max'),validation.max];break;}}
if(validation.step!==undefined&&validation.step!=='any'){var v=(tempValue[j]/validation.step).toPrecision(14);if(parseInt(v)!=v){result=[this.getValidationMessage(validation,'step','number_wrong_step'),validation.step];break;}}
break;case'datetime':if(tempValue[j]===undefined||tempValue[j].length===0){if(!validation.allow_empty_value){result=['datetime_empty'];}
break;}
if(validation.format){if(!('moment'in window)){Utils.error('MissingLibrary','MomentJS is required for Date/Time validation. Get it here http://momentjs.com');}
var datetime=moment(tempValue[j],validation.format);if(!datetime.isValid()){result=[this.getValidationMessage(validation,'format','datetime_invalid'),validation.format];break;}
else{if(validation.min){if(datetime<moment(validation.min,validation.format)){result=[this.getValidationMessage(validation,'min','datetime_exceed_min'),validation.min];break;}}
if(validation.max){if(datetime>moment(validation.max,validation.format)){result=[this.getValidationMessage(validation,'max','datetime_exceed_max'),validation.max];break;}}}}
break;case'boolean':if(tempValue[j]===undefined||tempValue[j].length===0){if(!validation.allow_empty_value){result=['boolean_not_valid'];}
break;}
tmp=(''+tempValue[j]).trim().toLowerCase();if(tmp!=='true'&&tmp!=='false'&&tmp!=='1'&&tmp!=='0'&&tempValue[j]!==1&&tempValue[j]!==0){result=['boolean_not_valid'];break;}}
if(result!==true){break;}}}
if(result!==true){break;}}
if((rule.operator.type==='between'||rule.operator.type==='not_between')&&value.length===2){switch(QueryBuilder.types[filter.type]){case'number':if(value[0]>value[1]){result=['number_between_invalid',value[0],value[1]];}
break;case'datetime':if(validation.format){if(!('moment'in window)){Utils.error('MissingLibrary','MomentJS is required for Date/Time validation. Get it here http://momentjs.com');}
if(moment(value[0],validation.format).isAfter(moment(value[1],validation.format))){result=['datetime_between_invalid',value[0],value[1]];}}
break;}}
return result;};QueryBuilder.prototype.nextGroupId=function(){return this.status.id+'_group_'+(this.status.group_id++);};QueryBuilder.prototype.nextRuleId=function(){return this.status.id+'_rule_'+(this.status.rule_id++);};QueryBuilder.prototype.getOperators=function(filter){if(typeof filter=='string'){filter=this.getFilterById(filter);}
var result=[];for(var i=0,l=this.operators.length;i<l;i++){if(filter.operators){if(filter.operators.indexOf(this.operators[i].type)==-1){continue;}}
else if(this.operators[i].apply_to.indexOf(QueryBuilder.types[filter.type])==-1){continue;}
result.push(this.operators[i]);}
if(filter.operators){result.sort(function(a,b){return filter.operators.indexOf(a.type)-filter.operators.indexOf(b.type);});}
return this.change('getOperators',result,filter);};QueryBuilder.prototype.getFilterById=function(id,doThrow){if(id=='-1'){return null;}
for(var i=0,l=this.filters.length;i<l;i++){if(this.filters[i].id==id){return this.filters[i];}}
Utils.error(doThrow!==false,'UndefinedFilter','Undefined filter "{0}"',id);return null;};QueryBuilder.prototype.getOperatorByType=function(type,doThrow){if(type=='-1'){return null;}
for(var i=0,l=this.operators.length;i<l;i++){if(this.operators[i].type==type){return this.operators[i];}}
Utils.error(doThrow!==false,'UndefinedOperator','Undefined operator "{0}"',type);return null;};QueryBuilder.prototype.getRuleInputValue=function(rule){var filter=rule.filter;var operator=rule.operator;var value=[];if(filter.valueGetter){value=filter.valueGetter.call(this,rule);}
else{var $value=rule.$el.find(QueryBuilder.selectors.value_container);for(var i=0;i<operator.nb_inputs;i++){var name=Utils.escapeElementId(rule.id+'_value_'+i);var tmp;switch(filter.input){case'radio':value.push($value.find('[name='+name+']:checked').val());break;case'checkbox':tmp=[];$value.find('[name='+name+']:checked').each(function(){tmp.push($(this).val());});value.push(tmp);break;case'select':if(filter.multiple){tmp=[];$value.find('[name='+name+'] option:selected').each(function(){tmp.push($(this).val());});value.push(tmp);}
else{value.push($value.find('[name='+name+'] option:selected').val());}
break;default:value.push($value.find('[name='+name+']').val());}}
value=value.map(function(val){if(operator.multiple&&filter.value_separator&&typeof val=='string'){val=val.split(filter.value_separator);}
if($.isArray(val)){return val.map(function(subval){return Utils.changeType(subval,filter.type);});}
else{return Utils.changeType(val,filter.type);}});if(operator.nb_inputs===1){value=value[0];}
if(filter.valueParser){value=filter.valueParser.call(this,rule,value);}}
return this.change('getRuleValue',value,rule);};QueryBuilder.prototype.setRuleInputValue=function(rule,value){var filter=rule.filter;var operator=rule.operator;if(!filter||!operator){return;}
rule._updating_input=true;if(filter.valueSetter){filter.valueSetter.call(this,rule,value);}
else{var $value=rule.$el.find(QueryBuilder.selectors.value_container);if(operator.nb_inputs==1){value=[value];}
for(var i=0;i<operator.nb_inputs;i++){var name=Utils.escapeElementId(rule.id+'_value_'+i);switch(filter.input){case'radio':$value.find('[name='+name+'][value="'+value[i]+'"]').prop('checked',true).trigger('change');break;case'checkbox':if(!$.isArray(value[i])){value[i]=[value[i]];}
value[i].forEach(function(value){$value.find('[name='+name+'][value="'+value+'"]').prop('checked',true).trigger('change');});break;default:if(operator.multiple&&filter.value_separator&&$.isArray(value[i])){value[i]=value[i].join(filter.value_separator);}
$value.find('[name='+name+']').val(value[i]).trigger('change');break;}}}
rule._updating_input=false;};QueryBuilder.prototype.parseRuleFlags=function(rule){var flags=$.extend({},this.settings.default_rule_flags);if(rule.readonly){$.extend(flags,{filter_readonly:true,operator_readonly:true,value_readonly:true,no_delete:true});}
if(rule.flags){$.extend(flags,rule.flags);}
return this.change('parseRuleFlags',flags,rule);};QueryBuilder.prototype.getRuleFlags=function(flags,all){if(all){return $.extend({},flags);}
else{var ret={};$.each(this.settings.default_rule_flags,function(key,value){if(flags[key]!==value){ret[key]=flags[key];}});return ret;}};QueryBuilder.prototype.parseGroupFlags=function(group){var flags=$.extend({},this.settings.default_group_flags);if(group.readonly){$.extend(flags,{condition_readonly:true,no_add_rule:true,no_add_group:true,no_delete:true});}
if(group.flags){$.extend(flags,group.flags);}
return this.change('parseGroupFlags',flags,group);};QueryBuilder.prototype.getGroupFlags=function(flags,all){if(all){return $.extend({},flags);}
else{var ret={};$.each(this.settings.default_group_flags,function(key,value){if(flags[key]!==value){ret[key]=flags[key];}});return ret;}};QueryBuilder.prototype.translate=function(category,key){if(!key){key=category;category=undefined;}
var translation;if(typeof key==='object'){translation=key[this.settings.lang_code]||key['en'];}
else{translation=(category?this.lang[category]:this.lang)[key]||key;}
return this.change('translate',translation,key,category);};QueryBuilder.prototype.getValidationMessage=function(validation,type,def){return validation.messages&&validation.messages[type]||def;};QueryBuilder.templates.group='\
<div id="{{= it.group_id }}" class="rules-group-container"> \
  <div class="rules-group-header"> \
    <div class="btn-group pull-right group-actions"> \
      <button type="button" class="btn btn-xs btn-success" data-add="rule"> \
        <i class="{{= it.icons.add_rule }}"></i> {{= it.translate("add_rule") }} \
      </button> \
      {{? it.settings.allow_groups===-1 || it.settings.allow_groups>=it.level }} \
        <button type="button" class="btn btn-xs btn-success" data-add="group"> \
          <i class="{{= it.icons.add_group }}"></i> {{= it.translate("add_group") }} \
        </button> \
      {{?}} \
      {{? it.level>1 }} \
        <button type="button" class="btn btn-xs btn-danger" data-delete="group"> \
          <i class="{{= it.icons.remove_group }}"></i> {{= it.translate("delete_group") }} \
        </button> \
      {{?}} \
    </div> \
    <div class="btn-group group-conditions"> \
      {{~ it.conditions: condition }} \
        <label class="btn btn-xs btn-primary"> \
          <input type="radio" name="{{= it.group_id }}_cond" value="{{= condition }}"> {{= it.translate("conditions", condition) }} \
        </label> \
      {{~}} \
    </div> \
    {{? it.settings.display_errors }} \
      <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
    {{?}} \
  </div> \
  <div class=rules-group-body> \
    <div class=rules-list></div> \
  </div> \
</div>';QueryBuilder.templates.rule='\
<div id="{{= it.rule_id }}" class="rule-container"> \
  <div class="rule-header"> \
    <div class="btn-group pull-right rule-actions"> \
      <button type="button" class="btn btn-xs btn-danger" data-delete="rule"> \
        <i class="{{= it.icons.remove_rule }}"></i> {{= it.translate("delete_rule") }} \
      </button> \
    </div> \
  </div> \
  {{? it.settings.display_errors }} \
    <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
  {{?}} \
  <div class="rule-filter-container"></div> \
  <div class="rule-operator-container"></div> \
  <div class="rule-value-container"></div> \
</div>';QueryBuilder.templates.filterSelect='\
{{ var optgroup = null; }} \
<select class="form-control" name="{{= it.rule.id }}_filter"> \
  {{? it.settings.display_empty_filter }} \
    <option value="-1">{{= it.settings.select_placeholder }}</option> \
  {{?}} \
  {{~ it.filters: filter }} \
    {{? optgroup !== filter.optgroup }} \
      {{? optgroup !== null }}</optgroup>{{?}} \
      {{? (optgroup = filter.optgroup) !== null }} \
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}"> \
      {{?}} \
    {{?}} \
    <option value="{{= filter.id }}" {{? filter.icon}}data-icon="{{= filter.icon}}"{{?}}>{{= it.translate(filter.label) }}</option> \
  {{~}} \
  {{? optgroup !== null }}</optgroup>{{?}} \
</select>';QueryBuilder.templates.operatorSelect='\
{{? it.operators.length === 1 }} \
<span> \
{{= it.translate("operators", it.operators[0].type) }} \
</span> \
{{?}} \
{{ var optgroup = null; }} \
<select class="form-control {{? it.operators.length === 1 }}hide{{?}}" name="{{= it.rule.id }}_operator"> \
  {{~ it.operators: operator }} \
    {{? optgroup !== operator.optgroup }} \
      {{? optgroup !== null }}</optgroup>{{?}} \
      {{? (optgroup = operator.optgroup) !== null }} \
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}"> \
      {{?}} \
    {{?}} \
    <option value="{{= operator.type }}" {{? operator.icon}}data-icon="{{= operator.icon}}"{{?}}>{{= it.translate("operators", operator.type) }}</option> \
  {{~}} \
  {{? optgroup !== null }}</optgroup>{{?}} \
</select>';QueryBuilder.templates.ruleValueSelect='\
{{ var optgroup = null; }} \
<select class="form-control" name="{{= it.name }}" {{? it.rule.filter.multiple }}multiple{{?}}> \
  {{? it.rule.filter.placeholder }} \
    <option value="{{= it.rule.filter.placeholder_value }}" disabled selected>{{= it.rule.filter.placeholder }}</option> \
  {{?}} \
  {{~ it.rule.filter.values: entry }} \
    {{? optgroup !== entry.optgroup }} \
      {{? optgroup !== null }}</optgroup>{{?}} \
      {{? (optgroup = entry.optgroup) !== null }} \
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}"> \
      {{?}} \
    {{?}} \
    <option value="{{= entry.value }}">{{= entry.label }}</option> \
  {{~}} \
  {{? optgroup !== null }}</optgroup>{{?}} \
</select>';QueryBuilder.prototype.getGroupTemplate=function(group_id,level){var h=this.templates.group({builder:this,group_id:group_id,level:level,conditions:this.settings.conditions,icons:this.icons,settings:this.settings,translate:this.translate.bind(this)});return this.change('getGroupTemplate',h,level);};QueryBuilder.prototype.getRuleTemplate=function(rule_id){var h=this.templates.rule({builder:this,rule_id:rule_id,icons:this.icons,settings:this.settings,translate:this.translate.bind(this)});return this.change('getRuleTemplate',h);};QueryBuilder.prototype.getRuleFilterSelect=function(rule,filters){var h=this.templates.filterSelect({builder:this,rule:rule,filters:filters,icons:this.icons,settings:this.settings,translate:this.translate.bind(this)});return this.change('getRuleFilterSelect',h,rule,filters);};QueryBuilder.prototype.getRuleOperatorSelect=function(rule,operators){var h=this.templates.operatorSelect({builder:this,rule:rule,operators:operators,icons:this.icons,settings:this.settings,translate:this.translate.bind(this)});return this.change('getRuleOperatorSelect',h,rule,operators);};QueryBuilder.prototype.getRuleValueSelect=function(name,rule){var h=this.templates.ruleValueSelect({builder:this,name:name,rule:rule,icons:this.icons,settings:this.settings,translate:this.translate.bind(this)});return this.change('getRuleValueSelect',h,name,rule);};QueryBuilder.prototype.getRuleInput=function(rule,value_id){var filter=rule.filter;var validation=rule.filter.validation||{};var name=rule.id+'_value_'+value_id;var c=filter.vertical?' class=block':'';var h='';if(typeof filter.input=='function'){h=filter.input.call(this,rule,name);}
else{switch(filter.input){case'radio':case'checkbox':Utils.iterateOptions(filter.values,function(key,val){h+='<label'+c+'><input type="'+filter.input+'" name="'+name+'" value="'+key+'"> '+val+'</label> ';});break;case'select':h=this.getRuleValueSelect(name,rule);break;case'textarea':h+='<textarea class="form-control" name="'+name+'"';if(filter.size)h+=' cols="'+filter.size+'"';if(filter.rows)h+=' rows="'+filter.rows+'"';if(validation.min!==undefined)h+=' minlength="'+validation.min+'"';if(validation.max!==undefined)h+=' maxlength="'+validation.max+'"';if(filter.placeholder)h+=' placeholder="'+filter.placeholder+'"';h+='></textarea>';break;case'number':h+='<input class="form-control" type="number" name="'+name+'"';if(validation.step!==undefined)h+=' step="'+validation.step+'"';if(validation.min!==undefined)h+=' min="'+validation.min+'"';if(validation.max!==undefined)h+=' max="'+validation.max+'"';if(filter.placeholder)h+=' placeholder="'+filter.placeholder+'"';if(filter.size)h+=' size="'+filter.size+'"';h+='>';break;default:h+='<input class="form-control" type="text" name="'+name+'"';if(filter.placeholder)h+=' placeholder="'+filter.placeholder+'"';if(filter.type==='string'&&validation.min!==undefined)h+=' minlength="'+validation.min+'"';if(filter.type==='string'&&validation.max!==undefined)h+=' maxlength="'+validation.max+'"';if(filter.size)h+=' size="'+filter.size+'"';h+='>';}}
return this.change('getRuleInput',h,rule,name);};var Utils={};QueryBuilder.utils=Utils;Utils.iterateOptions=function(options,tpl){if(options){if($.isArray(options)){options.forEach(function(entry){if($.isPlainObject(entry)){if('value'in entry){tpl(entry.value,entry.label||entry.value,entry.optgroup);}
else{$.each(entry,function(key,val){tpl(key,val);return false;});}}
else{tpl(entry,entry);}});}
else{$.each(options,function(key,val){tpl(key,val);});}}};Utils.fmt=function(str,args){if(!Array.isArray(args)){args=Array.prototype.slice.call(arguments,1);}
return str.replace(/{([0-9]+)}/g,function(m,i){return args[parseInt(i)];});};Utils.error=function(){var i=0;var doThrow=typeof arguments[i]==='boolean'?arguments[i++]:true;var type=arguments[i++];var message=arguments[i++];var args=Array.isArray(arguments[i])?arguments[i]:Array.prototype.slice.call(arguments,i);if(doThrow){var err=new Error(Utils.fmt(message,args));err.name=type+'Error';err.args=args;throw err;}
else{console.error(type+'Error: '+Utils.fmt(message,args));}};Utils.changeType=function(value,type){if(value===''||value===undefined){return undefined;}
switch(type){case'integer':if(typeof value==='string'&&!/^-?\d+$/.test(value)){return value;}
return parseInt(value);case'double':if(typeof value==='string'&&!/^-?\d+\.?\d*$/.test(value)){return value;}
return parseFloat(value);case'boolean':if(typeof value==='string'&&!/^(0|1|true|false){1}$/i.test(value)){return value;}
return value===true||value===1||value.toLowerCase()==='true'||value==='1';default:return value;}};Utils.escapeString=function(value){if(typeof value!='string'){return value;}
return value.replace(/[\0\n\r\b\\\'\"]/g,function(s){switch(s){case'\0':return'\\0';case'\n':return'\\n';case'\r':return'\\r';case'\b':return'\\b';default:return'\\'+s;}})
.replace(/\t/g,'\\t').replace(/\x1a/g,'\\Z');};Utils.escapeRegExp=function(str){return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,'\\$&');};Utils.escapeElementId=function(str){return(str)?str.replace(/(\\)?([:.\[\],])/g,function($0,$1,$2){return $1?$0:'\\'+$2;}):str;};Utils.groupSort=function(items,key){var optgroups=[];var newItems=[];items.forEach(function(item){var idx;if(item[key]){idx=optgroups.lastIndexOf(item[key]);if(idx==-1){idx=optgroups.length;}
else{idx++;}}
else{idx=optgroups.length;}
optgroups.splice(idx,0,item[key]);newItems.splice(idx,0,item);});return newItems;};Utils.defineModelProperties=function(obj,fields){fields.forEach(function(field){Object.defineProperty(obj.prototype,field,{enumerable:true,get:function(){return this.__[field];},set:function(value){var previousValue=(this.__[field]!==null&&typeof this.__[field]=='object')?$.extend({},this.__[field]):this.__[field];this.__[field]=value;if(this.model!==null){this.model.trigger('update',this,field,value,previousValue);}}});});};function Model(){this.root=null;this.$=$(this);}
$.extend(Model.prototype,{trigger:function(type){var event=new $.Event(type);this.$.triggerHandler(event,Array.prototype.slice.call(arguments,1));return event;},on:function(){this.$.on.apply(this.$,Array.prototype.slice.call(arguments));return this;},off:function(){this.$.off.apply(this.$,Array.prototype.slice.call(arguments));return this;},once:function(){this.$.one.apply(this.$,Array.prototype.slice.call(arguments));return this;}});var Node=function(parent,$el){if(!(this instanceof Node)){return new Node(parent,$el);}
Object.defineProperty(this,'__',{value:{}});$el.data('queryBuilderModel',this);this.__.level=1;this.__.error=null;this.__.flags={};this.__.data=undefined;this.$el=$el;this.id=$el[0].id;this.model=null;this.parent=parent;};Utils.defineModelProperties(Node,['level','error','data','flags']);Object.defineProperty(Node.prototype,'parent',{enumerable:true,get:function(){return this.__.parent;},set:function(value){this.__.parent=value;this.level=value===null?1:value.level+1;this.model=value===null?null:value.model;}});Node.prototype.isRoot=function(){return(this.level===1);};Node.prototype.getPos=function(){if(this.isRoot()){return-1;}
else{return this.parent.getNodePos(this);}};Node.prototype.drop=function(){var model=this.model;if(!!this.parent){this.parent.removeNode(this);}
this.$el.removeData('queryBuilderModel');if(model!==null){model.trigger('drop',this);}};Node.prototype.moveAfter=function(target){if(!this.isRoot()){this.move(target.parent,target.getPos()+1);}};Node.prototype.moveAtBegin=function(target){if(!this.isRoot()){if(target===undefined){target=this.parent;}
this.move(target,0);}};Node.prototype.moveAtEnd=function(target){if(!this.isRoot()){if(target===undefined){target=this.parent;}
this.move(target,target.length()===0?0:target.length()-1);}};Node.prototype.move=function(target,index){if(!this.isRoot()){if(typeof target==='number'){index=target;target=this.parent;}
this.parent.removeNode(this);target.insertNode(this,index,false);if(this.model!==null){this.model.trigger('move',this,target,index);}}};var Group=function(parent,$el){if(!(this instanceof Group)){return new Group(parent,$el);}
Node.call(this,parent,$el);this.rules=[];this.__.condition=null;};Group.prototype=Object.create(Node.prototype);Group.prototype.constructor=Group;Utils.defineModelProperties(Group,['condition']);Group.prototype.empty=function(){this.each('reverse',function(rule){rule.drop();},function(group){group.drop();});};Group.prototype.drop=function(){this.empty();Node.prototype.drop.call(this);};Group.prototype.length=function(){return this.rules.length;};Group.prototype.insertNode=function(node,index,trigger){if(index===undefined){index=this.length();}
this.rules.splice(index,0,node);node.parent=this;if(trigger&&this.model!==null){this.model.trigger('add',this,node,index);}
return node;};Group.prototype.addGroup=function($el,index){return this.insertNode(new Group(this,$el),index,true);};Group.prototype.addRule=function($el,index){return this.insertNode(new Rule(this,$el),index,true);};Group.prototype.removeNode=function(node){var index=this.getNodePos(node);if(index!==-1){node.parent=null;this.rules.splice(index,1);}};Group.prototype.getNodePos=function(node){return this.rules.indexOf(node);};Group.prototype.each=function(reverse,cbRule,cbGroup,context){if(typeof reverse!=='boolean'&&typeof reverse!=='string'){context=cbGroup;cbGroup=cbRule;cbRule=reverse;reverse=false;}
context=context===undefined?null:context;var i=reverse?this.rules.length-1:0;var l=reverse?0:this.rules.length-1;var c=reverse?-1:1;var next=function(){return reverse?i>=l:i<=l;};var stop=false;for(;next();i+=c){if(this.rules[i]instanceof Group){if(!!cbGroup){stop=cbGroup.call(context,this.rules[i])===false;}}
else if(!!cbRule){stop=cbRule.call(context,this.rules[i])===false;}
if(stop){break;}}
return!stop;};Group.prototype.contains=function(node,recursive){if(this.getNodePos(node)!==-1){return true;}
else if(!recursive){return false;}
else{return!this.each(function(){return true;},function(group){return!group.contains(node,true);});}};var Rule=function(parent,$el){if(!(this instanceof Rule)){return new Rule(parent,$el);}
Node.call(this,parent,$el);this._updating_value=false;this._updating_input=false;this.__.filter=null;this.__.operator=null;this.__.value=undefined;};Rule.prototype=Object.create(Node.prototype);Rule.prototype.constructor=Rule;Utils.defineModelProperties(Rule,['filter','operator','value']);Rule.prototype.isRoot=function(){return false;};QueryBuilder.Group=Group;QueryBuilder.Rule=Rule;$.fn.queryBuilder=function(option){if(this.length===0){Utils.error('Config','No target defined');}
if(this.length>1){Utils.error('Config','Unable to initialize on multiple target');}
var data=this.data('queryBuilder');var options=(typeof option=='object'&&option)||{};if(!data&&option=='destroy'){return this;}
if(!data){var builder=new QueryBuilder(this,options);this.data('queryBuilder',builder);builder.init(options.rules);}
if(typeof option=='string'){return data[option].apply(data,Array.prototype.slice.call(arguments,1));}
return this;};$.fn.queryBuilder.constructor=QueryBuilder;$.fn.queryBuilder.defaults=QueryBuilder.defaults;$.fn.queryBuilder.extend=QueryBuilder.extend;$.fn.queryBuilder.define=QueryBuilder.define;$.fn.queryBuilder.regional=QueryBuilder.regional;QueryBuilder.define('bt-checkbox',function(options){if(options.font=='glyphicons'){this.$el.addClass('bt-checkbox-glyphicons');}
this.on('getRuleInput.filter',function(h,rule,name){var filter=rule.filter;if((filter.input==='radio'||filter.input==='checkbox')&&!filter.plugin){h.value='';if(!filter.colors){filter.colors={};}
if(filter.color){filter.colors._def_=filter.color;}
var style=filter.vertical?' style="display:block"':'';var i=0;Utils.iterateOptions(filter.values,function(key,val){var color=filter.colors[key]||filter.colors._def_||options.color;var id=name+'_'+(i++);h.value+='\
<div'+style+' class="'+filter.input+' '+filter.input+'-'+color+'"> \
  <input type="'+filter.input+'" name="'+name+'" id="'+id+'" value="'+key+'"> \
  <label for="'+id+'">'+val+'</label> \
</div>';});}});},{font:'glyphicons',color:'default'});QueryBuilder.define('bt-selectpicker',function(options){if(!$.fn.selectpicker||!$.fn.selectpicker.Constructor){Utils.error('MissingLibrary','Bootstrap Select is required to use "bt-selectpicker" plugin. Get it here: http://silviomoreto.github.io/bootstrap-select');}
var Selectors=QueryBuilder.selectors;this.on('afterCreateRuleFilters',function(e,rule){rule.$el.find(Selectors.rule_filter).removeClass('form-control').selectpicker(options);});this.on('afterCreateRuleOperators',function(e,rule){rule.$el.find(Selectors.rule_operator).removeClass('form-control').selectpicker(options);});this.on('afterUpdateRuleFilter',function(e,rule){rule.$el.find(Selectors.rule_filter).selectpicker('render');});this.on('afterUpdateRuleOperator',function(e,rule){rule.$el.find(Selectors.rule_operator).selectpicker('render');});this.on('beforeDeleteRule',function(e,rule){rule.$el.find(Selectors.rule_filter).selectpicker('destroy');rule.$el.find(Selectors.rule_operator).selectpicker('destroy');});},{container:'body',style:'btn-inverse btn-xs',width:'auto',showIcon:false});QueryBuilder.define('bt-tooltip-errors',function(options){if(!$.fn.tooltip||!$.fn.tooltip.Constructor||!$.fn.tooltip.Constructor.prototype.fixTitle){Utils.error('MissingLibrary','Bootstrap Tooltip is required to use "bt-tooltip-errors" plugin. Get it here: http://getbootstrap.com');}
var self=this;this.on('getRuleTemplate.filter getGroupTemplate.filter',function(h){var $h=$(h.value);$h.find(QueryBuilder.selectors.error_container).attr('data-toggle','tooltip');h.value=$h.prop('outerHTML');});this.model.on('update',function(e,node,field){if(field=='error'&&self.settings.display_errors){node.$el.find(QueryBuilder.selectors.error_container).eq(0).tooltip(options).tooltip('hide').tooltip('fixTitle');}});},{placement:'right'});QueryBuilder.extend({setFilters:function(deleteOrphans,filters){var self=this;if(filters===undefined){filters=deleteOrphans;deleteOrphans=false;}
filters=this.checkFilters(filters);filters=this.change('setFilters',filters);var filtersIds=filters.map(function(filter){return filter.id;});if(!deleteOrphans){(function checkOrphans(node){node.each(function(rule){if(rule.filter&&filtersIds.indexOf(rule.filter.id)===-1){Utils.error('ChangeFilter','A rule is using filter "{0}"',rule.filter.id);}},checkOrphans);}(this.model.root));}
this.filters=filters;(function updateBuilder(node){node.each(true,function(rule){if(rule.filter&&filtersIds.indexOf(rule.filter.id)===-1){rule.drop();self.trigger('rulesChanged');}
else{self.createRuleFilters(rule);rule.$el.find(QueryBuilder.selectors.rule_filter).val(rule.filter?rule.filter.id:'-1');self.trigger('afterUpdateRuleFilter',rule);}},updateBuilder);}(this.model.root));if(this.settings.plugins){if(this.settings.plugins['unique-filter']){this.updateDisabledFilters();}
if(this.settings.plugins['bt-selectpicker']){this.$el.find(QueryBuilder.selectors.rule_filter).selectpicker('render');}}
if(this.settings.default_filter){try{this.getFilterById(this.settings.default_filter);}
catch(e){this.settings.default_filter=null;}}
this.trigger('afterSetFilters',filters);},addFilter:function(newFilters,position){if(position===undefined||position=='#end'){position=this.filters.length;}
else if(position=='#start'){position=0;}
if(!$.isArray(newFilters)){newFilters=[newFilters];}
var filters=$.extend(true,[],this.filters);if(parseInt(position)==position){Array.prototype.splice.apply(filters,[position,0].concat(newFilters));}
else{if(this.filters.some(function(filter,index){if(filter.id==position){position=index+1;return true;}})){Array.prototype.splice.apply(filters,[position,0].concat(newFilters));}
else{Array.prototype.push.apply(filters,newFilters);}}
this.setFilters(filters);},removeFilter:function(filterIds,deleteOrphans){var filters=$.extend(true,[],this.filters);if(typeof filterIds==='string'){filterIds=[filterIds];}
filters=filters.filter(function(filter){return filterIds.indexOf(filter.id)===-1;});this.setFilters(deleteOrphans,filters);}});QueryBuilder.define('chosen-selectpicker',function(options){if(!$.fn.chosen){Utils.error('MissingLibrary','chosen is required to use "chosen-selectpicker" plugin. Get it here: https://github.com/harvesthq/chosen');}
if(this.settings.plugins['bt-selectpicker']){Utils.error('Conflict','bt-selectpicker is already selected as the dropdown plugin. Please remove chosen-selectpicker from the plugin list');}
var Selectors=QueryBuilder.selectors;this.on('afterCreateRuleFilters',function(e,rule){rule.$el.find(Selectors.rule_filter).removeClass('form-control').chosen(options);});this.on('afterCreateRuleOperators',function(e,rule){rule.$el.find(Selectors.rule_operator).removeClass('form-control').chosen(options);});this.on('afterUpdateRuleFilter',function(e,rule){rule.$el.find(Selectors.rule_filter).trigger('chosen:updated');});this.on('afterUpdateRuleOperator',function(e,rule){rule.$el.find(Selectors.rule_operator).trigger('chosen:updated');});this.on('beforeDeleteRule',function(e,rule){rule.$el.find(Selectors.rule_filter).chosen('destroy');rule.$el.find(Selectors.rule_operator).chosen('destroy');});});QueryBuilder.define('filter-description',function(options){if(options.mode==='inline'){this.on('afterUpdateRuleFilter afterUpdateRuleOperator',function(e,rule){var $p=rule.$el.find('p.filter-description');var description=e.builder.getFilterDescription(rule.filter,rule);if(!description){$p.hide();}
else{if($p.length===0){$p=$('<p class="filter-description"></p>');$p.appendTo(rule.$el);}
else{$p.css('display','');}
$p.html('<i class="'+options.icon+'"></i> '+description);}});}
else if(options.mode==='popover'){if(!$.fn.popover||!$.fn.popover.Constructor||!$.fn.popover.Constructor.prototype.fixTitle){Utils.error('MissingLibrary','Bootstrap Popover is required to use "filter-description" plugin. Get it here: http://getbootstrap.com');}
this.on('afterUpdateRuleFilter afterUpdateRuleOperator',function(e,rule){var $b=rule.$el.find('button.filter-description');var description=e.builder.getFilterDescription(rule.filter,rule);if(!description){$b.hide();if($b.data('bs.popover')){$b.popover('hide');}}
else{if($b.length===0){$b=$('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="popover"><i class="'+options.icon+'"></i></button>');$b.prependTo(rule.$el.find(QueryBuilder.selectors.rule_actions));$b.popover({placement:'left',container:'body',html:true});$b.on('mouseout',function(){$b.popover('hide');});}
else{$b.css('display','');}
$b.data('bs.popover').options.content=description;if($b.attr('aria-describedby')){$b.popover('show');}}});}
else if(options.mode==='bootbox'){if(!('bootbox'in window)){Utils.error('MissingLibrary','Bootbox is required to use "filter-description" plugin. Get it here: http://bootboxjs.com');}
this.on('afterUpdateRuleFilter afterUpdateRuleOperator',function(e,rule){var $b=rule.$el.find('button.filter-description');var description=e.builder.getFilterDescription(rule.filter,rule);if(!description){$b.hide();}
else{if($b.length===0){$b=$('<button type="button" class="btn btn-xs btn-info filter-description" data-toggle="bootbox"><i class="'+options.icon+'"></i></button>');$b.prependTo(rule.$el.find(QueryBuilder.selectors.rule_actions));$b.on('click',function(){bootbox.alert($b.data('description'));});}
else{$b.css('display','');}
$b.data('description',description);}});}},{icon:'glyphicon glyphicon-info-sign',mode:'popover'});QueryBuilder.extend({getFilterDescription:function(filter,rule){if(!filter){return undefined;}
else if(typeof filter.description=='function'){return filter.description.call(this,rule);}
else{return filter.description;}}});QueryBuilder.define('invert',function(options){var self=this;var Selectors=QueryBuilder.selectors;this.on('afterInit',function(){self.$el.on('click.queryBuilder','[data-invert=group]',function(){var $group=$(this).closest(Selectors.group_container);self.invert(self.getModel($group),options);});if(options.display_rules_button&&options.invert_rules){self.$el.on('click.queryBuilder','[data-invert=rule]',function(){var $rule=$(this).closest(Selectors.rule_container);self.invert(self.getModel($rule),options);});}});if(!options.disable_template){this.on('getGroupTemplate.filter',function(h){var $h=$(h.value);$h.find(Selectors.condition_container).after('<button type="button" class="btn btn-xs btn-default" data-invert="group">'+
'<i class="'+options.icon+'"></i> '+self.translate('invert')+
'</button>');h.value=$h.prop('outerHTML');});if(options.display_rules_button&&options.invert_rules){this.on('getRuleTemplate.filter',function(h){var $h=$(h.value);$h.find(Selectors.rule_actions).prepend('<button type="button" class="btn btn-xs btn-default" data-invert="rule">'+
'<i class="'+options.icon+'"></i> '+self.translate('invert')+
'</button>');h.value=$h.prop('outerHTML');});}}},{icon:'glyphicon glyphicon-random',recursive:true,invert_rules:true,display_rules_button:false,silent_fail:false,disable_template:false});QueryBuilder.defaults({operatorOpposites:{'equal':'not_equal','not_equal':'equal','in':'not_in','not_in':'in','less':'greater_or_equal','less_or_equal':'greater','greater':'less_or_equal','greater_or_equal':'less','between':'not_between','not_between':'between','begins_with':'not_begins_with','not_begins_with':'begins_with','contains':'not_contains','not_contains':'contains','ends_with':'not_ends_with','not_ends_with':'ends_with','is_empty':'is_not_empty','is_not_empty':'is_empty','is_null':'is_not_null','is_not_null':'is_null'},conditionOpposites:{'AND':'OR','OR':'AND'}});QueryBuilder.extend({invert:function(node,options){if(!(node instanceof Node)){if(!this.model.root)return;options=node;node=this.model.root;}
if(typeof options!='object')options={};if(options.recursive===undefined)options.recursive=true;if(options.invert_rules===undefined)options.invert_rules=true;if(options.silent_fail===undefined)options.silent_fail=false;if(options.trigger===undefined)options.trigger=true;if(node instanceof Group){if(this.settings.conditionOpposites[node.condition]){node.condition=this.settings.conditionOpposites[node.condition];}
else if(!options.silent_fail){Utils.error('InvertCondition','Unknown inverse of condition "{0}"',node.condition);}
if(options.recursive){var tempOpts=$.extend({},options,{trigger:false});node.each(function(rule){if(options.invert_rules){this.invert(rule,tempOpts);}},function(group){this.invert(group,tempOpts);},this);}}
else if(node instanceof Rule){if(node.operator&&!node.filter.no_invert){if(this.settings.operatorOpposites[node.operator.type]){var invert=this.settings.operatorOpposites[node.operator.type];if(!node.filter.operators||node.filter.operators.indexOf(invert)!=-1){node.operator=this.getOperatorByType(invert);}}
else if(!options.silent_fail){Utils.error('InvertOperator','Unknown inverse of operator "{0}"',node.operator.type);}}}
if(options.trigger){this.trigger('afterInvert',node,options);this.trigger('rulesChanged');}}});QueryBuilder.defaults({mongoOperators:{equal:function(v){return v[0];},not_equal:function(v){return{'$ne':v[0]};},in:function(v){return{'$in':v};},not_in:function(v){return{'$nin':v};},less:function(v){return{'$lt':v[0]};},less_or_equal:function(v){return{'$lte':v[0]};},greater:function(v){return{'$gt':v[0]};},greater_or_equal:function(v){return{'$gte':v[0]};},between:function(v){return{'$gte':v[0],'$lte':v[1]};},not_between:function(v){return{'$lt':v[0],'$gt':v[1]};},begins_with:function(v){return{'$regex':'^'+Utils.escapeRegExp(v[0])};},not_begins_with:function(v){return{'$regex':'^(?!'+Utils.escapeRegExp(v[0])+')'};},contains:function(v){return{'$regex':Utils.escapeRegExp(v[0])};},not_contains:function(v){return{'$regex':'^((?!'+Utils.escapeRegExp(v[0])+').)*$','$options':'s'};},ends_with:function(v){return{'$regex':Utils.escapeRegExp(v[0])+'$'};},not_ends_with:function(v){return{'$regex':'(?<!'+Utils.escapeRegExp(v[0])+')$'};},is_empty:function(v){return'';},is_not_empty:function(v){return{'$ne':''};},is_null:function(v){return null;},is_not_null:function(v){return{'$ne':null};}
},mongoRuleOperators:{$eq:function(v){return{'val':v,'op':v===null?'is_null':(v===''?'is_empty':'equal')};},$ne:function(v){v=v.$ne;return{'val':v,'op':v===null?'is_not_null':(v===''?'is_not_empty':'not_equal')};},$regex:function(v){v=v.$regex;if(v.slice(0,4)=='^(?!'&&v.slice(-1)==')'){return{'val':v.slice(4,-1),'op':'not_begins_with'};}
else if(v.slice(0,5)=='^((?!'&&v.slice(-5)==').)*$'){return{'val':v.slice(5,-5),'op':'not_contains'};}
else if(v.slice(0,4)=='(?<!'&&v.slice(-2)==')$'){return{'val':v.slice(4,-2),'op':'not_ends_with'};}
else if(v.slice(-1)=='$'){return{'val':v.slice(0,-1),'op':'ends_with'};}
else if(v.slice(0,1)=='^'){return{'val':v.slice(1),'op':'begins_with'};}
else{return{'val':v,'op':'contains'};}},between:function(v){return{'val':[v.$gte,v.$lte],'op':'between'};},not_between:function(v){return{'val':[v.$lt,v.$gt],'op':'not_between'};},$in:function(v){return{'val':v.$in,'op':'in'};},$nin:function(v){return{'val':v.$nin,'op':'not_in'};},$lt:function(v){return{'val':v.$lt,'op':'less'};},$lte:function(v){return{'val':v.$lte,'op':'less_or_equal'};},$gt:function(v){return{'val':v.$gt,'op':'greater'};},$gte:function(v){return{'val':v.$gte,'op':'greater_or_equal'};}}});QueryBuilder.extend({getMongo:function(data){data=(data===undefined)?this.getRules():data;if(!data){return null;}
var self=this;return(function parse(group){if(!group.condition){group.condition=self.settings.default_condition;}
if(['AND','OR'].indexOf(group.condition.toUpperCase())===-1){Utils.error('UndefinedMongoCondition','Unable to build MongoDB query with condition "{0}"',group.condition);}
if(!group.rules){return{};}
var parts=[];group.rules.forEach(function(rule){if(rule.rules&&rule.rules.length>0){parts.push(parse(rule));}
else{var mdb=self.settings.mongoOperators[rule.operator];var ope=self.getOperatorByType(rule.operator);if(mdb===undefined){Utils.error('UndefinedMongoOperator','Unknown MongoDB operation for operator "{0}"',rule.operator);}
if(ope.nb_inputs!==0){if(!(rule.value instanceof Array)){rule.value=[rule.value];}}
var field=self.change('getMongoDBField',rule.field,rule);var ruleExpression={};ruleExpression[field]=mdb.call(self,rule.value);parts.push(self.change('ruleToMongo',ruleExpression,rule,rule.value,mdb));}});var groupExpression={};groupExpression['$'+group.condition.toLowerCase()]=parts;return self.change('groupToMongo',groupExpression,group);}(data));},getRulesFromMongo:function(query){if(query===undefined||query===null){return null;}
var self=this;query=self.change('parseMongoNode',query);if('rules'in query&&'condition'in query){return query;}
if('id'in query&&'operator'in query&&'value'in query){return{condition:this.settings.default_condition,rules:[query]};}
var key=self.getMongoCondition(query);if(!key){Utils.error('MongoParse','Invalid MongoDB query format');}
return(function parse(data,topKey){var rules=data[topKey];var parts=[];rules.forEach(function(data){data=self.change('parseMongoNode',data);if('rules'in data&&'condition'in data){parts.push(data);return;}
if('id'in data&&'operator'in data&&'value'in data){parts.push(data);return;}
var key=self.getMongoCondition(data);if(key){parts.push(parse(data,key));}
else{var field=Object.keys(data)[0];var value=data[field];var operator=self.getMongoOperator(value);if(operator===undefined){Utils.error('MongoParse','Invalid MongoDB query format');}
var mdbrl=self.settings.mongoRuleOperators[operator];if(mdbrl===undefined){Utils.error('UndefinedMongoOperator','JSON Rule operation unknown for operator "{0}"',operator);}
var opVal=mdbrl.call(self,value);var id=self.getMongoDBFieldID(field,value);var rule=self.change('mongoToRule',{id:id,field:field,operator:opVal.op,value:opVal.val},data);parts.push(rule);}});return self.change('mongoToGroup',{condition:topKey.replace('$','').toUpperCase(),rules:parts},data);}(query,key));},setRulesFromMongo:function(query){this.setRules(this.getRulesFromMongo(query));},getMongoDBFieldID:function(field,value){var matchingFilters=this.filters.filter(function(filter){return filter.field===field;});var id;if(matchingFilters.length===1){id=matchingFilters[0].id;}
else{id=this.change('getMongoDBFieldID',field,value);}
return id;},getMongoOperator:function(data){if(data!==null&&typeof data==='object'){if(data.$gte!==undefined&&data.$lte!==undefined){return'between';}
if(data.$lt!==undefined&&data.$gt!==undefined){return'not_between';}
var knownKeys=Object.keys(data).filter(function(key){return!!this.settings.mongoRuleOperators[key];}.bind(this));if(knownKeys.length===1){return knownKeys[0];}}
else{return'$eq';}},getMongoCondition:function(data){var keys=Object.keys(data);for(var i=0,l=keys.length;i<l;i++){if(keys[i].toLowerCase()==='$or'||keys[i].toLowerCase()==='$and'){return keys[i];}}}});QueryBuilder.define('not-group',function(options){var self=this;this.on('afterInit',function(){self.$el.on('click.queryBuilder','[data-not=group]',function(){var $group=$(this).closest(QueryBuilder.selectors.group_container);var group=self.getModel($group);group.not=!group.not;});self.model.on('update',function(e,node,field){if(node instanceof Group&&field==='not'){self.updateGroupNot(node);}});});this.on('afterAddGroup',function(e,group){group.__.not=false;});if(!options.disable_template){this.on('getGroupTemplate.filter',function(h){var $h=$(h.value);$h.find(QueryBuilder.selectors.condition_container).prepend('<button type="button" class="btn btn-xs btn-default" data-not="group">'+
'<i class="'+options.icon_unchecked+'"></i> '+self.translate('NOT')+
'</button>');h.value=$h.prop('outerHTML');});}
this.on('groupToJson.filter',function(e,group){e.value.not=group.not;});this.on('jsonToGroup.filter',function(e,json){e.value.not=!!json.not;});this.on('groupToSQL.filter',function(e,group){if(group.not){e.value='NOT ( '+e.value+' )';}});this.on('parseSQLNode.filter',function(e){if(e.value.name&&e.value.name.toUpperCase()=='NOT'){e.value=e.value.arguments.value[0];if(['AND','OR'].indexOf(e.value.operation.toUpperCase())===-1){e.value=new SQLParser.nodes.Op(self.settings.default_condition,e.value,null);}
e.value.not=true;}});this.on('sqlGroupsDistinct.filter',function(e,group,data,i){if(data.not&&i>0){e.value=true;}});this.on('sqlToGroup.filter',function(e,data){e.value.not=!!data.not;});this.on('groupToMongo.filter',function(e,group){var key='$'+group.condition.toLowerCase();if(group.not&&e.value[key]){e.value={'$nor':[e.value]};}});this.on('parseMongoNode.filter',function(e){var keys=Object.keys(e.value);if(keys[0]=='$nor'){e.value=e.value[keys[0]][0];e.value.not=true;}});this.on('mongoToGroup.filter',function(e,data){e.value.not=!!data.not;});},{icon_unchecked:'glyphicon glyphicon-unchecked',icon_checked:'glyphicon glyphicon-check',disable_template:false});Utils.defineModelProperties(Group,['not']);QueryBuilder.selectors.group_not=QueryBuilder.selectors.group_header+' [data-not=group]';QueryBuilder.extend({updateGroupNot:function(group){var options=this.plugins['not-group'];group.$el.find('>'+QueryBuilder.selectors.group_not).toggleClass('active',group.not).find('i').attr('class',group.not?options.icon_checked:options.icon_unchecked);this.trigger('afterUpdateGroupNot',group);this.trigger('rulesChanged');}});QueryBuilder.define('sortable',function(options){if(!('interact'in window)){Utils.error('MissingLibrary','interact.js is required to use "sortable" plugin. Get it here: http://interactjs.io');}
if(options.default_no_sortable!==undefined){Utils.error(false,'Config','Sortable plugin : "default_no_sortable" options is deprecated, use standard "default_rule_flags" and "default_group_flags" instead');this.settings.default_rule_flags.no_sortable=this.settings.default_group_flags.no_sortable=options.default_no_sortable;}
interact.dynamicDrop(true);interact.pointerMoveTolerance(10);var placeholder;var ghost;var src;var moved;this.on('afterAddRule afterAddGroup',function(e,node){if(node==placeholder){return;}
var self=e.builder;if(options.inherit_no_sortable&&node.parent&&node.parent.flags.no_sortable){node.flags.no_sortable=true;}
if(options.inherit_no_drop&&node.parent&&node.parent.flags.no_drop){node.flags.no_drop=true;}
if(!node.flags.no_sortable){interact(node.$el[0]).draggable({allowFrom:QueryBuilder.selectors.drag_handle,onstart:function(event){moved=false;src=self.getModel(event.target);ghost=src.$el.clone().appendTo(src.$el.parent()).width(src.$el.outerWidth()).addClass('dragging');var ph=$('<div class="rule-placeholder">&nbsp;</div>').height(src.$el.outerHeight());placeholder=src.parent.addRule(ph,src.getPos());src.$el.hide();},onmove:function(event){ghost[0].style.top=event.clientY-15+'px';ghost[0].style.left=event.clientX-15+'px';},onend:function(event){if(event.dropzone){moveSortableToTarget(src,$(event.relatedTarget),self);moved=true;}
ghost.remove();ghost=undefined;placeholder.drop();placeholder=undefined;src.$el.css('display','');self.trigger('afterMove',src);self.trigger('rulesChanged');}});}
if(!node.flags.no_drop){interact(node.$el[0]).dropzone({accept:QueryBuilder.selectors.rule_and_group_containers,ondragenter:function(event){moveSortableToTarget(placeholder,$(event.target),self);},ondrop:function(event){if(!moved){moveSortableToTarget(src,$(event.target),self);}}});if(node instanceof Group){interact(node.$el.find(QueryBuilder.selectors.group_header)[0]).dropzone({accept:QueryBuilder.selectors.rule_and_group_containers,ondragenter:function(event){moveSortableToTarget(placeholder,$(event.target),self);},ondrop:function(event){if(!moved){moveSortableToTarget(src,$(event.target),self);}}});}}});this.on('beforeDeleteRule beforeDeleteGroup',function(e,node){if(!e.isDefaultPrevented()){interact(node.$el[0]).unset();if(node instanceof Group){interact(node.$el.find(QueryBuilder.selectors.group_header)[0]).unset();}}});this.on('afterApplyRuleFlags afterApplyGroupFlags',function(e,node){if(node.flags.no_sortable){node.$el.find('.drag-handle').remove();}});if(!options.disable_template){this.on('getGroupTemplate.filter',function(h,level){if(level>1){var $h=$(h.value);$h.find(QueryBuilder.selectors.condition_container).after('<div class="drag-handle"><i class="'+options.icon+'"></i></div>');h.value=$h.prop('outerHTML');}});this.on('getRuleTemplate.filter',function(h){var $h=$(h.value);$h.find(QueryBuilder.selectors.rule_header).after('<div class="drag-handle"><i class="'+options.icon+'"></i></div>');h.value=$h.prop('outerHTML');});}},{inherit_no_sortable:true,inherit_no_drop:true,icon:'glyphicon glyphicon-sort',disable_template:false});QueryBuilder.selectors.rule_and_group_containers=QueryBuilder.selectors.rule_container+', '+QueryBuilder.selectors.group_container;QueryBuilder.selectors.drag_handle='.drag-handle';QueryBuilder.defaults({default_rule_flags:{no_sortable:false,no_drop:false},default_group_flags:{no_sortable:false,no_drop:false}});function moveSortableToTarget(node,target,builder){var parent,method;var Selectors=QueryBuilder.selectors;parent=target.closest(Selectors.rule_container);if(parent.length){method='moveAfter';}
if(!method){parent=target.closest(Selectors.group_header);if(parent.length){parent=target.closest(Selectors.group_container);method='moveAtBegin';}}
if(!method){parent=target.closest(Selectors.group_container);if(parent.length){method='moveAtEnd';}}
if(method){node[method](builder.getModel(parent));if(builder&&node instanceof Rule){builder.setRuleInputValue(node,node.value);}}}
QueryBuilder.define('sql-support',function(options){},{boolean_as_integer:true});QueryBuilder.defaults({sqlOperators:{equal:{op:'= ?'},not_equal:{op:'!= ?'},in:{op:'IN(?)',sep:', '},not_in:{op:'NOT IN(?)',sep:', '},less:{op:'< ?'},less_or_equal:{op:'<= ?'},greater:{op:'> ?'},greater_or_equal:{op:'>= ?'},between:{op:'BETWEEN ?',sep:' AND '},not_between:{op:'NOT BETWEEN ?',sep:' AND '},begins_with:{op:'LIKE(?)',mod:'{0}%'},not_begins_with:{op:'NOT LIKE(?)',mod:'{0}%'},contains:{op:'LIKE(?)',mod:'%{0}%'},not_contains:{op:'NOT LIKE(?)',mod:'%{0}%'},ends_with:{op:'LIKE(?)',mod:'%{0}'},not_ends_with:{op:'NOT LIKE(?)',mod:'%{0}'},is_empty:{op:'= \'\''},is_not_empty:{op:'!= \'\''},is_null:{op:'IS NULL'},is_not_null:{op:'IS NOT NULL'}},sqlRuleOperator:{'=':function(v){return{val:v,op:v===''?'is_empty':'equal'};},'!=':function(v){return{val:v,op:v===''?'is_not_empty':'not_equal'};},'LIKE':function(v){if(v.slice(0,1)=='%'&&v.slice(-1)=='%'){return{val:v.slice(1,-1),op:'contains'};}
else if(v.slice(0,1)=='%'){return{val:v.slice(1),op:'ends_with'};}
else if(v.slice(-1)=='%'){return{val:v.slice(0,-1),op:'begins_with'};}
else{Utils.error('SQLParse','Invalid value for LIKE operator "{0}"',v);}},'NOT LIKE':function(v){if(v.slice(0,1)=='%'&&v.slice(-1)=='%'){return{val:v.slice(1,-1),op:'not_contains'};}
else if(v.slice(0,1)=='%'){return{val:v.slice(1),op:'not_ends_with'};}
else if(v.slice(-1)=='%'){return{val:v.slice(0,-1),op:'not_begins_with'};}
else{Utils.error('SQLParse','Invalid value for NOT LIKE operator "{0}"',v);}},'IN':function(v){return{val:v,op:'in'};},'NOT IN':function(v){return{val:v,op:'not_in'};},'<':function(v){return{val:v,op:'less'};},'<=':function(v){return{val:v,op:'less_or_equal'};},'>':function(v){return{val:v,op:'greater'};},'>=':function(v){return{val:v,op:'greater_or_equal'};},'BETWEEN':function(v){return{val:v,op:'between'};},'NOT BETWEEN':function(v){return{val:v,op:'not_between'};},'IS':function(v){if(v!==null){Utils.error('SQLParse','Invalid value for IS operator');}
return{val:null,op:'is_null'};},'IS NOT':function(v){if(v!==null){Utils.error('SQLParse','Invalid value for IS operator');}
return{val:null,op:'is_not_null'};}},sqlStatements:{'question_mark':function(){var params=[];return{add:function(rule,value){params.push(value);return'?';},run:function(){return params;}};},'numbered':function(char){if(!char||char.length>1)char='$';var index=0;var params=[];return{add:function(rule,value){params.push(value);index++;return char+index;},run:function(){return params;}};},'named':function(char){if(!char||char.length>1)char=':';var indexes={};var params={};return{add:function(rule,value){if(!indexes[rule.field])indexes[rule.field]=1;var key=rule.field+'_'+(indexes[rule.field]++);params[key]=value;return char+key;},run:function(){return params;}};}},sqlRuleStatement:{'question_mark':function(values){var index=0;return{parse:function(v){return v=='?'?values[index++]:v;},esc:function(sql){return sql.replace(/\?/g,'\'?\'');}};},'numbered':function(values,char){if(!char||char.length>1)char='$';var regex1=new RegExp('^\\'+char+'[0-9]+$');var regex2=new RegExp('\\'+char+'([0-9]+)','g');return{parse:function(v){return regex1.test(v)?values[v.slice(1)-1]:v;},esc:function(sql){return sql.replace(regex2,'\''+(char=='$'?'$$':char)+'$1\'');}};},'named':function(values,char){if(!char||char.length>1)char=':';var regex1=new RegExp('^\\'+char);var regex2=new RegExp('\\'+char+'('+Object.keys(values).join('|')+')','g');return{parse:function(v){return regex1.test(v)?values[v.slice(1)]:v;},esc:function(sql){return sql.replace(regex2,'\''+(char=='$'?'$$':char)+'$1\'');}};}}});QueryBuilder.extend({getSQL:function(stmt,nl,data){data=(data===undefined)?this.getRules():data;if(!data){return null;}
nl=!!nl?'\n':' ';var boolean_as_integer=this.getPluginOptions('sql-support','boolean_as_integer');if(stmt===true){stmt='question_mark';}
if(typeof stmt=='string'){var config=getStmtConfig(stmt);stmt=this.settings.sqlStatements[config[1]](config[2]);}
var self=this;var sql=(function parse(group){if(!group.condition){group.condition=self.settings.default_condition;}
if(['AND','OR'].indexOf(group.condition.toUpperCase())===-1){Utils.error('UndefinedSQLCondition','Unable to build SQL query with condition "{0}"',group.condition);}
if(!group.rules){return'';}
var parts=[];group.rules.forEach(function(rule){if(rule.rules&&rule.rules.length>0){parts.push('('+nl+parse(rule)+nl+')'+nl);}
else{var sql=self.settings.sqlOperators[rule.operator];var ope=self.getOperatorByType(rule.operator);var value='';if(sql===undefined){Utils.error('UndefinedSQLOperator','Unknown SQL operation for operator "{0}"',rule.operator);}
if(ope.nb_inputs!==0){if(!(rule.value instanceof Array)){rule.value=[rule.value];}
rule.value.forEach(function(v,i){if(i>0){value+=sql.sep;}
if(rule.type=='boolean'&&boolean_as_integer){v=v?1:0;}
else if(!stmt&&rule.type!=='integer'&&rule.type!=='double'&&rule.type!=='boolean'){v=Utils.escapeString(v);}
if(sql.mod){v=Utils.fmt(sql.mod,v);}
if(stmt){value+=stmt.add(rule,v);}
else{if(typeof v=='string'){v='\''+v+'\'';}
value+=v;}});}
var sqlFn=function(v){return sql.op.replace('?',function(){return v;});};var field=self.change('getSQLField',rule.field,rule);var ruleExpression=field+' '+sqlFn(value);parts.push(self.change('ruleToSQL',ruleExpression,rule,value,sqlFn));}});var groupExpression=parts.join(' '+group.condition+nl);return self.change('groupToSQL',groupExpression,group);}(data));if(stmt){return{sql:sql,params:stmt.run()};}
else{return{sql:sql};}},getRulesFromSQL:function(query,stmt){if(!('SQLParser'in window)){Utils.error('MissingLibrary','SQLParser is required to parse SQL queries. Get it here https://github.com/mistic100/sql-parser');}
var self=this;if(typeof query=='string'){query={sql:query};}
if(stmt===true)stmt='question_mark';if(typeof stmt=='string'){var config=getStmtConfig(stmt);stmt=this.settings.sqlRuleStatement[config[1]](query.params,config[2]);}
if(stmt){query.sql=stmt.esc(query.sql);}
if(query.sql.toUpperCase().indexOf('SELECT')!==0){query.sql='SELECT * FROM table WHERE '+query.sql;}
var parsed=SQLParser.parse(query.sql);if(!parsed.where){Utils.error('SQLParse','No WHERE clause found');}
var data=self.change('parseSQLNode',parsed.where.conditions);if('rules'in data&&'condition'in data){return data;}
if('id'in data&&'operator'in data&&'value'in data){return{condition:this.settings.default_condition,rules:[data]};}
var out=self.change('sqlToGroup',{condition:this.settings.default_condition,rules:[]},data);var curr=out;(function flatten(data,i){if(data===null){return;}
data=self.change('parseSQLNode',data);if('rules'in data&&'condition'in data){curr.rules.push(data);return;}
if('id'in data&&'operator'in data&&'value'in data){curr.rules.push(data);return;}
if(!('left'in data)||!('right'in data)||!('operation'in data)){Utils.error('SQLParse','Unable to parse WHERE clause');}
if(['AND','OR'].indexOf(data.operation.toUpperCase())!==-1){var createGroup=self.change('sqlGroupsDistinct',i>0&&curr.condition!=data.operation.toUpperCase(),curr,data,i);if(createGroup){var group=self.change('sqlToGroup',{condition:self.settings.default_condition,rules:[]},data);curr.rules.push(group);curr=group;}
curr.condition=data.operation.toUpperCase();i++;var next=curr;flatten(data.left,i);curr=next;flatten(data.right,i);}
else{if($.isPlainObject(data.right.value)){Utils.error('SQLParse','Value format not supported for {0}.',data.left.value);}
var value;if($.isArray(data.right.value)){value=data.right.value.map(function(v){return v.value;});}
else{value=data.right.value;}
if(stmt){if($.isArray(value)){value=value.map(stmt.parse);}
else{value=stmt.parse(value);}}
var operator=data.operation.toUpperCase();if(operator=='<>'){operator='!=';}
var sqlrl=self.settings.sqlRuleOperator[operator];if(sqlrl===undefined){Utils.error('UndefinedSQLOperator','Invalid SQL operation "{0}".',data.operation);}
var opVal=sqlrl.call(this,value,data.operation);var field;if('values'in data.left){field=data.left.values.join('.');}
else if('value'in data.left){field=data.left.value;}
else{Utils.error('SQLParse','Cannot find field name in {0}',JSON.stringify(data.left));}
var id=self.getSQLFieldID(field,value);var rule=self.change('sqlToRule',{id:id,field:field,operator:opVal.op,value:opVal.val},data);curr.rules.push(rule);}}(data,0));return out;},setRulesFromSQL:function(query,stmt){this.setRules(this.getRulesFromSQL(query,stmt));},getSQLFieldID:function(field,value){var matchingFilters=this.filters.filter(function(filter){return filter.field.toLowerCase()===field.toLowerCase();});var id;if(matchingFilters.length===1){id=matchingFilters[0].id;}
else{id=this.change('getSQLFieldID',field,value);}
return id;}});function getStmtConfig(stmt){var config=stmt.match(/(question_mark|numbered|named)(?:\((.)\))?/);if(!config)config=[null,'question_mark',undefined];return config;}
QueryBuilder.define('unique-filter',function(){this.status.used_filters={};this.on('afterUpdateRuleFilter',this.updateDisabledFilters);this.on('afterDeleteRule',this.updateDisabledFilters);this.on('afterCreateRuleFilters',this.applyDisabledFilters);this.on('afterReset',this.clearDisabledFilters);this.on('afterClear',this.clearDisabledFilters);this.on('getDefaultFilter.filter',function(e,model){var self=e.builder;self.updateDisabledFilters();if(e.value.id in self.status.used_filters){var found=self.filters.some(function(filter){if(!(filter.id in self.status.used_filters)||self.status.used_filters[filter.id].length>0&&self.status.used_filters[filter.id].indexOf(model.parent)===-1){e.value=filter;return true;}});if(!found){Utils.error(false,'UniqueFilter','No more non-unique filters available');e.value=undefined;}}});});QueryBuilder.extend({updateDisabledFilters:function(e){var self=e?e.builder:this;self.status.used_filters={};if(!self.model){return;}
(function walk(group){group.each(function(rule){if(rule.filter&&rule.filter.unique){if(!self.status.used_filters[rule.filter.id]){self.status.used_filters[rule.filter.id]=[];}
if(rule.filter.unique=='group'){self.status.used_filters[rule.filter.id].push(rule.parent);}}},function(group){walk(group);});}(self.model.root));self.applyDisabledFilters(e);},clearDisabledFilters:function(e){var self=e?e.builder:this;self.status.used_filters={};self.applyDisabledFilters(e);},applyDisabledFilters:function(e){var self=e?e.builder:this;self.$el.find(QueryBuilder.selectors.filter_container+' option').prop('disabled',false);$.each(self.status.used_filters,function(filterId,groups){if(groups.length===0){self.$el.find(QueryBuilder.selectors.filter_container+' option[value="'+filterId+'"]:not(:selected)').prop('disabled',true);}
else{groups.forEach(function(group){group.each(function(rule){rule.$el.find(QueryBuilder.selectors.filter_container+' option[value="'+filterId+'"]:not(:selected)').prop('disabled',true);});});}});if(self.settings.plugins&&self.settings.plugins['bt-selectpicker']){self.$el.find(QueryBuilder.selectors.rule_filter).selectpicker('render');}}});/*!
 * jQuery QueryBuilder 2.5.2
 * Locale: English (en)
 * Author: Damien "Mistic" Sorel, http://www.strangeplanet.fr
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */
QueryBuilder.regional['en']={"__locale":"English (en)","__author":"Damien \"Mistic\" Sorel, http://www.strangeplanet.fr","add_rule":"Add rule","add_group":"Add group","delete_rule":"Delete","delete_group":"Delete","conditions":{"AND":"AND","OR":"OR"},"operators":{"equal":"equal","not_equal":"not equal","in":"in","not_in":"not in","less":"less","less_or_equal":"less or equal","greater":"greater","greater_or_equal":"greater or equal","between":"between","not_between":"not between","begins_with":"begins with","not_begins_with":"doesn't begin with","contains":"contains","not_contains":"doesn't contain","ends_with":"ends with","not_ends_with":"doesn't end with","is_empty":"is empty","is_not_empty":"is not empty","is_null":"is null","is_not_null":"is not null"},"errors":{"no_filter":"No filter selected","empty_group":"The group is empty","radio_empty":"No value selected","checkbox_empty":"No value selected","select_empty":"No value selected","string_empty":"Empty value","string_exceed_min_length":"Must contain at least {0} characters","string_exceed_max_length":"Must not contain more than {0} characters","string_invalid_format":"Invalid format ({0})","number_nan":"Not a number","number_not_integer":"Not an integer","number_not_double":"Not a real number","number_exceed_min":"Must be greater than {0}","number_exceed_max":"Must be lower than {0}","number_wrong_step":"Must be a multiple of {0}","number_between_invalid":"Invalid values, {0} is greater than {1}","datetime_empty":"Empty value","datetime_invalid":"Invalid date format ({0})","datetime_exceed_min":"Must be after {0}","datetime_exceed_max":"Must be before {0}","datetime_between_invalid":"Invalid values, {0} is greater than {1}","boolean_not_valid":"Not a boolean","operator_not_multiple":"Operator \"{1}\" cannot accept multiple values"},"invert":"Invert","NOT":"NOT"};QueryBuilder.defaults({lang_code:'en'});return QueryBuilder;}));(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.interact=f()}})(function(){var define,module,exports;return(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){'use strict';if(typeof window==='undefined'){module.exports=function(window){require('./src/utils/window').init(window);return require('./src/index');};}else{module.exports=require('./src/index');}},{"./src/index":19,"./src/utils/window":52}],2:[function(require,module,exports){'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var extend=require('./utils/extend.js');function fireUntilImmediateStopped(event,listeners){for(var _i=0;_i<listeners.length;_i++){var _ref;_ref=listeners[_i];var listener=_ref;if(event.immediatePropagationStopped){break;}
listener(event);}}
var Eventable=function(){function Eventable(options){_classCallCheck(this,Eventable);this.options=extend({},options||{});}
Eventable.prototype.fire=function fire(event){var listeners=void 0;var onEvent='on'+event.type;var global=this.global;if(listeners=this[event.type]){fireUntilImmediateStopped(event,listeners);}
if(this[onEvent]){this[onEvent](event);}
if(!event.propagationStopped&&global&&(listeners=global[event.type])){fireUntilImmediateStopped(event,listeners);}};Eventable.prototype.on=function on(eventType,listener){if(this[eventType]){this[eventType].push(listener);}else{this[eventType]=[listener];}};Eventable.prototype.off=function off(eventType,listener){var eventList=this[eventType];var index=eventList?eventList.indexOf(listener):-1;if(index!==-1){eventList.splice(index,1);}
if(eventList&&eventList.length===0||!listener){this[eventType]=undefined;}};return Eventable;}();module.exports=Eventable;},{"./utils/extend.js":41}],3:[function(require,module,exports){'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var extend=require('./utils/extend');var getOriginXY=require('./utils/getOriginXY');var defaults=require('./defaultOptions');var signals=require('./utils/Signals').new();var InteractEvent=function(){function InteractEvent(interaction,event,action,phase,element,related){var preEnd=arguments.length>6&&arguments[6]!==undefined?arguments[6]:false;_classCallCheck(this,InteractEvent);var target=interaction.target;var deltaSource=(target&&target.options||defaults).deltaSource;var origin=getOriginXY(target,element,action);var starting=phase==='start';var ending=phase==='end';var coords=starting?interaction.startCoords:interaction.curCoords;var prevEvent=interaction.prevEvent;element=element||interaction.element;var page=extend({},coords.page);var client=extend({},coords.client);page.x-=origin.x;page.y-=origin.y;client.x-=origin.x;client.y-=origin.y;this.ctrlKey=event.ctrlKey;this.altKey=event.altKey;this.shiftKey=event.shiftKey;this.metaKey=event.metaKey;this.button=event.button;this.buttons=event.buttons;this.target=element;this.currentTarget=element;this.relatedTarget=related||null;this.preEnd=preEnd;this.type=action+(phase||'');this.interaction=interaction;this.interactable=target;this.t0=starting?interaction.downTimes[interaction.downTimes.length-1]:prevEvent.t0;var signalArg={interaction:interaction,event:event,action:action,phase:phase,element:element,related:related,page:page,client:client,coords:coords,starting:starting,ending:ending,deltaSource:deltaSource,iEvent:this};signals.fire('set-xy',signalArg);if(ending){this.pageX=prevEvent.pageX;this.pageY=prevEvent.pageY;this.clientX=prevEvent.clientX;this.clientY=prevEvent.clientY;}else{this.pageX=page.x;this.pageY=page.y;this.clientX=client.x;this.clientY=client.y;}
this.x0=interaction.startCoords.page.x-origin.x;this.y0=interaction.startCoords.page.y-origin.y;this.clientX0=interaction.startCoords.client.x-origin.x;this.clientY0=interaction.startCoords.client.y-origin.y;signals.fire('set-delta',signalArg);this.timeStamp=coords.timeStamp;this.dt=interaction.pointerDelta.timeStamp;this.duration=this.timeStamp-this.t0;this.speed=interaction.pointerDelta[deltaSource].speed;this.velocityX=interaction.pointerDelta[deltaSource].vx;this.velocityY=interaction.pointerDelta[deltaSource].vy;this.swipe=ending||phase==='inertiastart'?this.getSwipe():null;signals.fire('new',signalArg);}
InteractEvent.prototype.getSwipe=function getSwipe(){var interaction=this.interaction;if(interaction.prevEvent.speed<600||this.timeStamp-interaction.prevEvent.timeStamp>150){return null;}
var angle=180*Math.atan2(interaction.prevEvent.velocityY,interaction.prevEvent.velocityX)/Math.PI;var overlap=22.5;if(angle<0){angle+=360;}
var left=135-overlap<=angle&&angle<225+overlap;var up=225-overlap<=angle&&angle<315+overlap;var right=!left&&(315-overlap<=angle||angle<45+overlap);var down=!up&&45-overlap<=angle&&angle<135+overlap;return{up:up,down:down,left:left,right:right,angle:angle,speed:interaction.prevEvent.speed,velocity:{x:interaction.prevEvent.velocityX,y:interaction.prevEvent.velocityY}};};InteractEvent.prototype.preventDefault=function preventDefault(){};InteractEvent.prototype.stopImmediatePropagation=function stopImmediatePropagation(){this.immediatePropagationStopped=this.propagationStopped=true;};InteractEvent.prototype.stopPropagation=function stopPropagation(){this.propagationStopped=true;};return InteractEvent;}();signals.on('set-delta',function(_ref){var iEvent=_ref.iEvent,interaction=_ref.interaction,starting=_ref.starting,deltaSource=_ref.deltaSource;var prevEvent=starting?iEvent:interaction.prevEvent;if(deltaSource==='client'){iEvent.dx=iEvent.clientX-prevEvent.clientX;iEvent.dy=iEvent.clientY-prevEvent.clientY;}else{iEvent.dx=iEvent.pageX-prevEvent.pageX;iEvent.dy=iEvent.pageY-prevEvent.pageY;}});InteractEvent.signals=signals;module.exports=InteractEvent;},{"./defaultOptions":18,"./utils/Signals":34,"./utils/extend":41,"./utils/getOriginXY":42}],4:[function(require,module,exports){'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var clone=require('./utils/clone');var is=require('./utils/is');var events=require('./utils/events');var extend=require('./utils/extend');var actions=require('./actions/base');var scope=require('./scope');var Eventable=require('./Eventable');var defaults=require('./defaultOptions');var signals=require('./utils/Signals').new();var _require=require('./utils/domUtils'),getElementRect=_require.getElementRect,nodeContains=_require.nodeContains,trySelector=_require.trySelector,matchesSelector=_require.matchesSelector;var _require2=require('./utils/window'),getWindow=_require2.getWindow;var _require3=require('./utils/arr'),contains=_require3.contains;var _require4=require('./utils/browser'),wheelEvent=_require4.wheelEvent;scope.interactables=[];var Interactable=function(){function Interactable(target,options){_classCallCheck(this,Interactable);options=options||{};this.target=target;this.events=new Eventable();this._context=options.context||scope.document;this._win=getWindow(trySelector(target)?this._context:target);this._doc=this._win.document;signals.fire('new',{target:target,options:options,interactable:this,win:this._win});scope.addDocument(this._doc,this._win);scope.interactables.push(this);this.set(options);}
Interactable.prototype.setOnEvents=function setOnEvents(action,phases){var onAction='on'+action;if(is.function(phases.onstart)){this.events[onAction+'start']=phases.onstart;}
if(is.function(phases.onmove)){this.events[onAction+'move']=phases.onmove;}
if(is.function(phases.onend)){this.events[onAction+'end']=phases.onend;}
if(is.function(phases.oninertiastart)){this.events[onAction+'inertiastart']=phases.oninertiastart;}
return this;};Interactable.prototype.setPerAction=function setPerAction(action,options){for(var option in options){if(option in defaults[action]){if(is.object(options[option])){this.options[action][option]=clone(this.options[action][option]||{});extend(this.options[action][option],options[option]);if(is.object(defaults.perAction[option])&&'enabled'in defaults.perAction[option]){this.options[action][option].enabled=options[option].enabled===false?false:true;}}else if(is.bool(options[option])&&is.object(defaults.perAction[option])){this.options[action][option].enabled=options[option];}else if(options[option]!==undefined){this.options[action][option]=options[option];}}}};Interactable.prototype.getRect=function getRect(element){element=element||this.target;if(is.string(this.target)&&!is.element(element)){element=this._context.querySelector(this.target);}
return getElementRect(element);};Interactable.prototype.rectChecker=function rectChecker(checker){if(is.function(checker)){this.getRect=checker;return this;}
if(checker===null){delete this.options.getRect;return this;}
return this.getRect;};Interactable.prototype._backCompatOption=function _backCompatOption(optionName,newValue){if(trySelector(newValue)||is.object(newValue)){this.options[optionName]=newValue;for(var _i=0;_i<actions.names.length;_i++){var _ref;_ref=actions.names[_i];var action=_ref;this.options[action][optionName]=newValue;}
return this;}
return this.options[optionName];};Interactable.prototype.origin=function origin(newValue){return this._backCompatOption('origin',newValue);};Interactable.prototype.deltaSource=function deltaSource(newValue){if(newValue==='page'||newValue==='client'){this.options.deltaSource=newValue;return this;}
return this.options.deltaSource;};Interactable.prototype.context=function context(){return this._context;};Interactable.prototype.inContext=function inContext(element){return this._context===element.ownerDocument||nodeContains(this._context,element);};Interactable.prototype.fire=function fire(iEvent){this.events.fire(iEvent);return this;};Interactable.prototype._onOffMultiple=function _onOffMultiple(method,eventType,listener,options){if(is.string(eventType)&&eventType.search(' ')!==-1){eventType=eventType.trim().split(/ +/);}
if(is.array(eventType)){for(var _i2=0;_i2<eventType.length;_i2++){var _ref2;_ref2=eventType[_i2];var type=_ref2;this[method](type,listener,options);}
return true;}
if(is.object(eventType)){for(var prop in eventType){this[method](prop,eventType[prop],listener);}
return true;}};Interactable.prototype.on=function on(eventType,listener,options){if(this._onOffMultiple('on',eventType,listener,options)){return this;}
if(eventType==='wheel'){eventType=wheelEvent;}
if(contains(Interactable.eventTypes,eventType)){this.events.on(eventType,listener);}
else if(is.string(this.target)){events.addDelegate(this.target,this._context,eventType,listener,options);}else{events.add(this.target,eventType,listener,options);}
return this;};Interactable.prototype.off=function off(eventType,listener,options){if(this._onOffMultiple('off',eventType,listener,options)){return this;}
if(eventType==='wheel'){eventType=wheelEvent;}
if(contains(Interactable.eventTypes,eventType)){this.events.off(eventType,listener);}
else if(is.string(this.target)){events.removeDelegate(this.target,this._context,eventType,listener,options);}
else{events.remove(this.target,eventType,listener,options);}
return this;};Interactable.prototype.set=function set(options){if(!is.object(options)){options={};}
this.options=clone(defaults.base);var perActions=clone(defaults.perAction);for(var actionName in actions.methodDict){var methodName=actions.methodDict[actionName];this.options[actionName]=clone(defaults[actionName]);this.setPerAction(actionName,perActions);this[methodName](options[actionName]);}
for(var _i3=0;_i3<Interactable.settingsMethods.length;_i3++){var _ref3;_ref3=Interactable.settingsMethods[_i3];var setting=_ref3;this.options[setting]=defaults.base[setting];if(setting in options){this[setting](options[setting]);}}
signals.fire('set',{options:options,interactable:this});return this;};Interactable.prototype.unset=function unset(){events.remove(this.target,'all');if(is.string(this.target)){for(var type in events.delegatedEvents){var delegated=events.delegatedEvents[type];if(delegated.selectors[0]===this.target&&delegated.contexts[0]===this._context){delegated.selectors.splice(0,1);delegated.contexts.splice(0,1);delegated.listeners.splice(0,1);if(!delegated.selectors.length){delegated[type]=null;}}
events.remove(this._context,type,events.delegateListener);events.remove(this._context,type,events.delegateUseCapture,true);}}else{events.remove(this,'all');}
signals.fire('unset',{interactable:this});scope.interactables.splice(scope.interactables.indexOf(this),1);for(var _i4=0;_i4<(scope.interactions||[]).length;_i4++){var _ref4;_ref4=(scope.interactions||[])[_i4];var interaction=_ref4;if(interaction.target===this&&interaction.interacting()&&!interaction._ending){interaction.stop();}}
return scope.interact;};return Interactable;}();scope.interactables.indexOfElement=function indexOfElement(target,context){context=context||scope.document;for(var i=0;i<this.length;i++){var interactable=this[i];if(interactable.target===target&&interactable._context===context){return i;}}
return-1;};scope.interactables.get=function interactableGet(element,options,dontCheckInContext){var ret=this[this.indexOfElement(element,options&&options.context)];return ret&&(is.string(element)||dontCheckInContext||ret.inContext(element))?ret:null;};scope.interactables.forEachMatch=function(element,callback){for(var _i5=0;_i5<this.length;_i5++){var _ref5;_ref5=this[_i5];var interactable=_ref5;var ret=void 0;if((is.string(interactable.target)
?is.element(element)&&matchesSelector(element,interactable.target):element===interactable.target)&&interactable.inContext(element)){ret=callback(interactable);}
if(ret!==undefined){return ret;}}};Interactable.eventTypes=scope.eventTypes=[];Interactable.signals=signals;Interactable.settingsMethods=['deltaSource','origin','preventDefault','rectChecker'];module.exports=Interactable;},{"./Eventable":2,"./actions/base":6,"./defaultOptions":18,"./scope":33,"./utils/Signals":34,"./utils/arr":35,"./utils/browser":36,"./utils/clone":37,"./utils/domUtils":39,"./utils/events":40,"./utils/extend":41,"./utils/is":46,"./utils/window":52}],5:[function(require,module,exports){'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var scope=require('./scope');var utils=require('./utils');var events=require('./utils/events');var browser=require('./utils/browser');var domObjects=require('./utils/domObjects');var finder=require('./utils/interactionFinder');var signals=require('./utils/Signals').new();var listeners={};var methodNames=['pointerDown','pointerMove','pointerUp','updatePointer','removePointer'];var prevTouchTime=0;scope.interactions=[];var Interaction=function(){function Interaction(_ref){var pointerType=_ref.pointerType;_classCallCheck(this,Interaction);this.target=null;this.element=null;this.prepared={name:null,axis:null,edges:null};this.pointers=[];this.pointerIds=[];this.downTargets=[];this.downTimes=[];this.prevCoords={page:{x:0,y:0},client:{x:0,y:0},timeStamp:0};this.curCoords={page:{x:0,y:0},client:{x:0,y:0},timeStamp:0};this.startCoords={page:{x:0,y:0},client:{x:0,y:0},timeStamp:0};this.pointerDelta={page:{x:0,y:0,vx:0,vy:0,speed:0},client:{x:0,y:0,vx:0,vy:0,speed:0},timeStamp:0};this.downEvent=null;this.downPointer={};this._eventTarget=null;this._curEventTarget=null;this.prevEvent=null;this.pointerIsDown=false;this.pointerWasMoved=false;this._interacting=false;this._ending=false;this.pointerType=pointerType;signals.fire('new',this);scope.interactions.push(this);}
Interaction.prototype.pointerDown=function pointerDown(pointer,event,eventTarget){var pointerIndex=this.updatePointer(pointer,event,true);signals.fire('down',{pointer:pointer,event:event,eventTarget:eventTarget,pointerIndex:pointerIndex,interaction:this});};Interaction.prototype.start=function start(action,target,element){if(this.interacting()||!this.pointerIsDown||this.pointerIds.length<(action.name==='gesture'?2:1)){return;}
if(scope.interactions.indexOf(this)===-1){scope.interactions.push(this);}
utils.copyAction(this.prepared,action);this.target=target;this.element=element;signals.fire('action-start',{interaction:this,event:this.downEvent});};Interaction.prototype.pointerMove=function pointerMove(pointer,event,eventTarget){if(!this.simulation){this.updatePointer(pointer);utils.setCoords(this.curCoords,this.pointers);}
var duplicateMove=this.curCoords.page.x===this.prevCoords.page.x&&this.curCoords.page.y===this.prevCoords.page.y&&this.curCoords.client.x===this.prevCoords.client.x&&this.curCoords.client.y===this.prevCoords.client.y;var dx=void 0;var dy=void 0;if(this.pointerIsDown&&!this.pointerWasMoved){dx=this.curCoords.client.x-this.startCoords.client.x;dy=this.curCoords.client.y-this.startCoords.client.y;this.pointerWasMoved=utils.hypot(dx,dy)>Interaction.pointerMoveTolerance;}
var signalArg={pointer:pointer,pointerIndex:this.getPointerIndex(pointer),event:event,eventTarget:eventTarget,dx:dx,dy:dy,duplicate:duplicateMove,interaction:this,interactingBeforeMove:this.interacting()};if(!duplicateMove){utils.setCoordDeltas(this.pointerDelta,this.prevCoords,this.curCoords);}
signals.fire('move',signalArg);if(!duplicateMove){if(this.interacting()){this.doMove(signalArg);}
if(this.pointerWasMoved){utils.copyCoords(this.prevCoords,this.curCoords);}}};Interaction.prototype.doMove=function doMove(signalArg){signalArg=utils.extend({pointer:this.pointers[0],event:this.prevEvent,eventTarget:this._eventTarget,interaction:this},signalArg||{});signals.fire('before-action-move',signalArg);if(!this._dontFireMove){signals.fire('action-move',signalArg);}
this._dontFireMove=false;};Interaction.prototype.pointerUp=function pointerUp(pointer,event,eventTarget,curEventTarget){var pointerIndex=this.getPointerIndex(pointer);signals.fire(/cancel$/i.test(event.type)?'cancel':'up',{pointer:pointer,pointerIndex:pointerIndex,event:event,eventTarget:eventTarget,curEventTarget:curEventTarget,interaction:this});if(!this.simulation){this.end(event);}
this.pointerIsDown=false;this.removePointer(pointer,event);};Interaction.prototype.end=function end(event){this._ending=true;event=event||this.prevEvent;if(this.interacting()){signals.fire('action-end',{event:event,interaction:this});}
this.stop();this._ending=false;};Interaction.prototype.currentAction=function currentAction(){return this._interacting?this.prepared.name:null;};Interaction.prototype.interacting=function interacting(){return this._interacting;};Interaction.prototype.stop=function stop(){signals.fire('stop',{interaction:this});if(this._interacting){signals.fire('stop-active',{interaction:this});signals.fire('stop-'+this.prepared.name,{interaction:this});}
this.target=this.element=null;this._interacting=false;this.prepared.name=this.prevEvent=null;};Interaction.prototype.getPointerIndex=function getPointerIndex(pointer){if(this.pointerType==='mouse'||this.pointerType==='pen'){return 0;}
return this.pointerIds.indexOf(utils.getPointerId(pointer));};Interaction.prototype.updatePointer=function updatePointer(pointer,event){var down=arguments.length>2&&arguments[2]!==undefined?arguments[2]:event&&/(down|start)$/i.test(event.type);var id=utils.getPointerId(pointer);var index=this.getPointerIndex(pointer);if(index===-1){index=this.pointerIds.length;this.pointerIds[index]=id;}
if(down){signals.fire('update-pointer-down',{pointer:pointer,event:event,down:down,pointerId:id,pointerIndex:index,interaction:this});}
this.pointers[index]=pointer;return index;};Interaction.prototype.removePointer=function removePointer(pointer,event){var index=this.getPointerIndex(pointer);if(index===-1){return;}
signals.fire('remove-pointer',{pointer:pointer,event:event,pointerIndex:index,interaction:this});this.pointers.splice(index,1);this.pointerIds.splice(index,1);this.downTargets.splice(index,1);this.downTimes.splice(index,1);};Interaction.prototype._updateEventTargets=function _updateEventTargets(target,currentTarget){this._eventTarget=target;this._curEventTarget=currentTarget;};return Interaction;}();for(var _i=0;_i<methodNames.length;_i++){var method=methodNames[_i];listeners[method]=doOnInteractions(method);}
function doOnInteractions(method){return function(event){var pointerType=utils.getPointerType(event);var _utils$getEventTarget=utils.getEventTargets(event),eventTarget=_utils$getEventTarget[0],curEventTarget=_utils$getEventTarget[1];var matches=[];if(browser.supportsTouch&&/touch/.test(event.type)){prevTouchTime=new Date().getTime();for(var _i2=0;_i2<event.changedTouches.length;_i2++){var _ref2;_ref2=event.changedTouches[_i2];var changedTouch=_ref2;var pointer=changedTouch;var interaction=finder.search(pointer,event.type,eventTarget);matches.push([pointer,interaction||new Interaction({pointerType:pointerType})]);}}else{var invalidPointer=false;if(!browser.supportsPointerEvent&&/mouse/.test(event.type)){for(var i=0;i<scope.interactions.length&&!invalidPointer;i++){invalidPointer=scope.interactions[i].pointerType!=='mouse'&&scope.interactions[i].pointerIsDown;}
invalidPointer=invalidPointer||new Date().getTime()-prevTouchTime<500
||event.timeStamp===0;}
if(!invalidPointer){var _interaction=finder.search(event,event.type,eventTarget);if(!_interaction){_interaction=new Interaction({pointerType:pointerType});}
matches.push([event,_interaction]);}}
for(var _i3=0;_i3<matches.length;_i3++){var _ref3=matches[_i3];var _pointer=_ref3[0];var _interaction2=_ref3[1];_interaction2._updateEventTargets(eventTarget,curEventTarget);_interaction2[method](_pointer,event,eventTarget,curEventTarget);}};}
function endAll(event){for(var _i4=0;_i4<scope.interactions.length;_i4++){var _ref4;_ref4=scope.interactions[_i4];var interaction=_ref4;interaction.end(event);signals.fire('endall',{event:event,interaction:interaction});}}
var docEvents={};var pEventTypes=browser.pEventTypes;if(domObjects.PointerEvent){docEvents[pEventTypes.down]=listeners.pointerDown;docEvents[pEventTypes.move]=listeners.pointerMove;docEvents[pEventTypes.up]=listeners.pointerUp;docEvents[pEventTypes.cancel]=listeners.pointerUp;}else{docEvents.mousedown=listeners.pointerDown;docEvents.mousemove=listeners.pointerMove;docEvents.mouseup=listeners.pointerUp;docEvents.touchstart=listeners.pointerDown;docEvents.touchmove=listeners.pointerMove;docEvents.touchend=listeners.pointerUp;docEvents.touchcancel=listeners.pointerUp;}
docEvents.blur=endAll;function onDocSignal(_ref5,signalName){var doc=_ref5.doc;var eventMethod=signalName.indexOf('add')===0?events.add:events.remove;for(var eventType in scope.delegatedEvents){eventMethod(doc,eventType,events.delegateListener);eventMethod(doc,eventType,events.delegateUseCapture,true);}
for(var _eventType in docEvents){eventMethod(doc,_eventType,docEvents[_eventType],browser.isIOS?{passive:false}:undefined);}}
signals.on('update-pointer-down',function(_ref6){var interaction=_ref6.interaction,pointer=_ref6.pointer,pointerId=_ref6.pointerId,pointerIndex=_ref6.pointerIndex,event=_ref6.event,eventTarget=_ref6.eventTarget,down=_ref6.down;interaction.pointerIds[pointerIndex]=pointerId;interaction.pointers[pointerIndex]=pointer;if(down){interaction.pointerIsDown=true;}
if(!interaction.interacting()){utils.setCoords(interaction.startCoords,interaction.pointers);utils.copyCoords(interaction.curCoords,interaction.startCoords);utils.copyCoords(interaction.prevCoords,interaction.startCoords);interaction.downEvent=event;interaction.downTimes[pointerIndex]=interaction.curCoords.timeStamp;interaction.downTargets[pointerIndex]=eventTarget||event&&utils.getEventTargets(event)[0];interaction.pointerWasMoved=false;utils.pointerExtend(interaction.downPointer,pointer);}});scope.signals.on('add-document',onDocSignal);scope.signals.on('remove-document',onDocSignal);Interaction.pointerMoveTolerance=1;Interaction.doOnInteractions=doOnInteractions;Interaction.endAll=endAll;Interaction.signals=signals;Interaction.docEvents=docEvents;scope.endAllInteractions=endAll;module.exports=Interaction;},{"./scope":33,"./utils":44,"./utils/Signals":34,"./utils/browser":36,"./utils/domObjects":38,"./utils/events":40,"./utils/interactionFinder":45}],6:[function(require,module,exports){'use strict';var Interaction=require('../Interaction');var InteractEvent=require('../InteractEvent');var actions={firePrepared:firePrepared,names:[],methodDict:{}};Interaction.signals.on('action-start',function(_ref){var interaction=_ref.interaction,event=_ref.event;interaction._interacting=true;firePrepared(interaction,event,'start');});Interaction.signals.on('action-move',function(_ref2){var interaction=_ref2.interaction,event=_ref2.event,preEnd=_ref2.preEnd;firePrepared(interaction,event,'move',preEnd);if(!interaction.interacting()){return false;}});Interaction.signals.on('action-end',function(_ref3){var interaction=_ref3.interaction,event=_ref3.event;firePrepared(interaction,event,'end');});function firePrepared(interaction,event,phase,preEnd){var actionName=interaction.prepared.name;var newEvent=new InteractEvent(interaction,event,actionName,phase,interaction.element,null,preEnd);interaction.target.fire(newEvent);interaction.prevEvent=newEvent;}
module.exports=actions;},{"../InteractEvent":3,"../Interaction":5}],7:[function(require,module,exports){'use strict';var actions=require('./base');var utils=require('../utils');var InteractEvent=require('../InteractEvent');var Interactable=require('../Interactable');var Interaction=require('../Interaction');var defaultOptions=require('../defaultOptions');var drag={defaults:{enabled:false,mouseButtons:null,origin:null,snap:null,restrict:null,inertia:null,autoScroll:null,startAxis:'xy',lockAxis:'xy'},checker:function checker(pointer,event,interactable){var dragOptions=interactable.options.drag;return dragOptions.enabled?{name:'drag',axis:dragOptions.lockAxis==='start'?dragOptions.startAxis:dragOptions.lockAxis}:null;},getCursor:function getCursor(){return'move';}};Interaction.signals.on('before-action-move',function(_ref){var interaction=_ref.interaction;if(interaction.prepared.name!=='drag'){return;}
var axis=interaction.prepared.axis;if(axis==='x'){interaction.curCoords.page.y=interaction.startCoords.page.y;interaction.curCoords.client.y=interaction.startCoords.client.y;interaction.pointerDelta.page.speed=Math.abs(interaction.pointerDelta.page.vx);interaction.pointerDelta.client.speed=Math.abs(interaction.pointerDelta.client.vx);interaction.pointerDelta.client.vy=0;interaction.pointerDelta.page.vy=0;}else if(axis==='y'){interaction.curCoords.page.x=interaction.startCoords.page.x;interaction.curCoords.client.x=interaction.startCoords.client.x;interaction.pointerDelta.page.speed=Math.abs(interaction.pointerDelta.page.vy);interaction.pointerDelta.client.speed=Math.abs(interaction.pointerDelta.client.vy);interaction.pointerDelta.client.vx=0;interaction.pointerDelta.page.vx=0;}});InteractEvent.signals.on('new',function(_ref2){var iEvent=_ref2.iEvent,interaction=_ref2.interaction;if(iEvent.type!=='dragmove'){return;}
var axis=interaction.prepared.axis;if(axis==='x'){iEvent.pageY=interaction.startCoords.page.y;iEvent.clientY=interaction.startCoords.client.y;iEvent.dy=0;}else if(axis==='y'){iEvent.pageX=interaction.startCoords.page.x;iEvent.clientX=interaction.startCoords.client.x;iEvent.dx=0;}});Interactable.prototype.draggable=function(options){if(utils.is.object(options)){this.options.drag.enabled=options.enabled===false?false:true;this.setPerAction('drag',options);this.setOnEvents('drag',options);if(/^(xy|x|y|start)$/.test(options.lockAxis)){this.options.drag.lockAxis=options.lockAxis;}
if(/^(xy|x|y)$/.test(options.startAxis)){this.options.drag.startAxis=options.startAxis;}
return this;}
if(utils.is.bool(options)){this.options.drag.enabled=options;if(!options){this.ondragstart=this.ondragstart=this.ondragend=null;}
return this;}
return this.options.drag;};actions.drag=drag;actions.names.push('drag');utils.merge(Interactable.eventTypes,['dragstart','dragmove','draginertiastart','draginertiaresume','dragend']);actions.methodDict.drag='draggable';defaultOptions.drag=drag.defaults;module.exports=drag;},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../utils":44,"./base":6}],8:[function(require,module,exports){'use strict';var actions=require('./base');var utils=require('../utils');var scope=require('../scope');var interact=require('../interact');var InteractEvent=require('../InteractEvent');var Interactable=require('../Interactable');var Interaction=require('../Interaction');var defaultOptions=require('../defaultOptions');var drop={defaults:{enabled:false,accept:null,overlap:'pointer'}};var dynamicDrop=false;Interaction.signals.on('action-start',function(_ref){var interaction=_ref.interaction,event=_ref.event;if(interaction.prepared.name!=='drag'){return;}
interaction.activeDrops.dropzones=[];interaction.activeDrops.elements=[];interaction.activeDrops.rects=[];interaction.dropEvents=null;if(!interaction.dynamicDrop){setActiveDrops(interaction.activeDrops,interaction.element);}
var dragEvent=interaction.prevEvent;var dropEvents=getDropEvents(interaction,event,dragEvent);if(dropEvents.activate){fireActiveDrops(interaction.activeDrops,dropEvents.activate);}});InteractEvent.signals.on('new',function(_ref2){var interaction=_ref2.interaction,iEvent=_ref2.iEvent,event=_ref2.event;if(iEvent.type!=='dragmove'&&iEvent.type!=='dragend'){return;}
var draggableElement=interaction.element;var dragEvent=iEvent;var dropResult=getDrop(dragEvent,event,draggableElement);interaction.dropTarget=dropResult.dropzone;interaction.dropElement=dropResult.element;interaction.dropEvents=getDropEvents(interaction,event,dragEvent);});Interaction.signals.on('action-move',function(_ref3){var interaction=_ref3.interaction;if(interaction.prepared.name!=='drag'){return;}
fireDropEvents(interaction,interaction.dropEvents);});Interaction.signals.on('action-end',function(_ref4){var interaction=_ref4.interaction;if(interaction.prepared.name==='drag'){fireDropEvents(interaction,interaction.dropEvents);}});Interaction.signals.on('stop-drag',function(_ref5){var interaction=_ref5.interaction;interaction.activeDrops={dropzones:null,elements:null,rects:null};interaction.dropEvents=null;});function collectDrops(activeDrops,element){var drops=[];var elements=[];for(var _i=0;_i<scope.interactables.length;_i++){var _ref6;_ref6=scope.interactables[_i];var current=_ref6;if(!current.options.drop.enabled){continue;}
var accept=current.options.drop.accept;if(utils.is.element(accept)&&accept!==element||utils.is.string(accept)&&!utils.matchesSelector(element,accept)){continue;}
var dropElements=utils.is.string(current.target)?current._context.querySelectorAll(current.target):[current.target];for(var _i2=0;_i2<dropElements.length;_i2++){var _ref7;_ref7=dropElements[_i2];var currentElement=_ref7;if(currentElement!==element){drops.push(current);elements.push(currentElement);}}}
return{elements:elements,dropzones:drops};}
function fireActiveDrops(activeDrops,event){var prevElement=void 0;for(var i=0;i<activeDrops.dropzones.length;i++){var current=activeDrops.dropzones[i];var currentElement=activeDrops.elements[i];if(currentElement!==prevElement){event.target=currentElement;current.fire(event);}
prevElement=currentElement;}}
function setActiveDrops(activeDrops,dragElement){var possibleDrops=collectDrops(activeDrops,dragElement);activeDrops.dropzones=possibleDrops.dropzones;activeDrops.elements=possibleDrops.elements;activeDrops.rects=[];for(var i=0;i<activeDrops.dropzones.length;i++){activeDrops.rects[i]=activeDrops.dropzones[i].getRect(activeDrops.elements[i]);}}
function getDrop(dragEvent,event,dragElement){var interaction=dragEvent.interaction;var validDrops=[];if(dynamicDrop){setActiveDrops(interaction.activeDrops,dragElement);}
for(var j=0;j<interaction.activeDrops.dropzones.length;j++){var current=interaction.activeDrops.dropzones[j];var currentElement=interaction.activeDrops.elements[j];var rect=interaction.activeDrops.rects[j];validDrops.push(current.dropCheck(dragEvent,event,interaction.target,dragElement,currentElement,rect)?currentElement:null);}
var dropIndex=utils.indexOfDeepestElement(validDrops);return{dropzone:interaction.activeDrops.dropzones[dropIndex]||null,element:interaction.activeDrops.elements[dropIndex]||null};}
function getDropEvents(interaction,pointerEvent,dragEvent){var dropEvents={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};var tmpl={dragEvent:dragEvent,interaction:interaction,target:interaction.dropElement,dropzone:interaction.dropTarget,relatedTarget:dragEvent.target,draggable:dragEvent.interactable,timeStamp:dragEvent.timeStamp};if(interaction.dropElement!==interaction.prevDropElement){if(interaction.prevDropTarget){dropEvents.leave=utils.extend({type:'dragleave'},tmpl);dragEvent.dragLeave=dropEvents.leave.target=interaction.prevDropElement;dragEvent.prevDropzone=dropEvents.leave.dropzone=interaction.prevDropTarget;}
if(interaction.dropTarget){dropEvents.enter={dragEvent:dragEvent,interaction:interaction,target:interaction.dropElement,dropzone:interaction.dropTarget,relatedTarget:dragEvent.target,draggable:dragEvent.interactable,timeStamp:dragEvent.timeStamp,type:'dragenter'};dragEvent.dragEnter=interaction.dropElement;dragEvent.dropzone=interaction.dropTarget;}}
if(dragEvent.type==='dragend'&&interaction.dropTarget){dropEvents.drop=utils.extend({type:'drop'},tmpl);dragEvent.dropzone=interaction.dropTarget;dragEvent.relatedTarget=interaction.dropElement;}
if(dragEvent.type==='dragstart'){dropEvents.activate=utils.extend({type:'dropactivate'},tmpl);dropEvents.activate.target=null;dropEvents.activate.dropzone=null;}
if(dragEvent.type==='dragend'){dropEvents.deactivate=utils.extend({type:'dropdeactivate'},tmpl);dropEvents.deactivate.target=null;dropEvents.deactivate.dropzone=null;}
if(dragEvent.type==='dragmove'&&interaction.dropTarget){dropEvents.move=utils.extend({dragmove:dragEvent,type:'dropmove'},tmpl);dragEvent.dropzone=interaction.dropTarget;}
return dropEvents;}
function fireDropEvents(interaction,dropEvents){var activeDrops=interaction.activeDrops,prevDropTarget=interaction.prevDropTarget,dropTarget=interaction.dropTarget,dropElement=interaction.dropElement;if(dropEvents.leave){prevDropTarget.fire(dropEvents.leave);}
if(dropEvents.move){dropTarget.fire(dropEvents.move);}
if(dropEvents.enter){dropTarget.fire(dropEvents.enter);}
if(dropEvents.drop){dropTarget.fire(dropEvents.drop);}
if(dropEvents.deactivate){fireActiveDrops(activeDrops,dropEvents.deactivate);}
interaction.prevDropTarget=dropTarget;interaction.prevDropElement=dropElement;}
Interactable.prototype.dropzone=function(options){if(utils.is.object(options)){this.options.drop.enabled=options.enabled===false?false:true;if(utils.is.function(options.ondrop)){this.events.ondrop=options.ondrop;}
if(utils.is.function(options.ondropactivate)){this.events.ondropactivate=options.ondropactivate;}
if(utils.is.function(options.ondropdeactivate)){this.events.ondropdeactivate=options.ondropdeactivate;}
if(utils.is.function(options.ondragenter)){this.events.ondragenter=options.ondragenter;}
if(utils.is.function(options.ondragleave)){this.events.ondragleave=options.ondragleave;}
if(utils.is.function(options.ondropmove)){this.events.ondropmove=options.ondropmove;}
if(/^(pointer|center)$/.test(options.overlap)){this.options.drop.overlap=options.overlap;}else if(utils.is.number(options.overlap)){this.options.drop.overlap=Math.max(Math.min(1,options.overlap),0);}
if('accept'in options){this.options.drop.accept=options.accept;}
if('checker'in options){this.options.drop.checker=options.checker;}
return this;}
if(utils.is.bool(options)){this.options.drop.enabled=options;if(!options){this.ondragenter=this.ondragleave=this.ondrop=this.ondropactivate=this.ondropdeactivate=null;}
return this;}
return this.options.drop;};Interactable.prototype.dropCheck=function(dragEvent,event,draggable,draggableElement,dropElement,rect){var dropped=false;if(!(rect=rect||this.getRect(dropElement))){return this.options.drop.checker?this.options.drop.checker(dragEvent,event,dropped,this,dropElement,draggable,draggableElement):false;}
var dropOverlap=this.options.drop.overlap;if(dropOverlap==='pointer'){var origin=utils.getOriginXY(draggable,draggableElement,'drag');var page=utils.getPageXY(dragEvent);page.x+=origin.x;page.y+=origin.y;var horizontal=page.x>rect.left&&page.x<rect.right;var vertical=page.y>rect.top&&page.y<rect.bottom;dropped=horizontal&&vertical;}
var dragRect=draggable.getRect(draggableElement);if(dragRect&&dropOverlap==='center'){var cx=dragRect.left+dragRect.width/2;var cy=dragRect.top+dragRect.height/2;dropped=cx>=rect.left&&cx<=rect.right&&cy>=rect.top&&cy<=rect.bottom;}
if(dragRect&&utils.is.number(dropOverlap)){var overlapArea=Math.max(0,Math.min(rect.right,dragRect.right)-Math.max(rect.left,dragRect.left))*Math.max(0,Math.min(rect.bottom,dragRect.bottom)-Math.max(rect.top,dragRect.top));var overlapRatio=overlapArea/(dragRect.width*dragRect.height);dropped=overlapRatio>=dropOverlap;}
if(this.options.drop.checker){dropped=this.options.drop.checker(dragEvent,event,dropped,this,dropElement,draggable,draggableElement);}
return dropped;};Interactable.signals.on('unset',function(_ref8){var interactable=_ref8.interactable;interactable.dropzone(false);});Interactable.settingsMethods.push('dropChecker');Interaction.signals.on('new',function(interaction){interaction.dropTarget=null;interaction.dropElement=null;interaction.prevDropTarget=null;interaction.prevDropElement=null;interaction.dropEvents=null;interaction.activeDrops={dropzones:[],elements:[],rects:[]};});Interaction.signals.on('stop',function(_ref9){var interaction=_ref9.interaction;interaction.dropTarget=interaction.dropElement=interaction.prevDropTarget=interaction.prevDropElement=null;});interact.dynamicDrop=function(newValue){if(utils.is.bool(newValue)){dynamicDrop=newValue;return interact;}
return dynamicDrop;};utils.merge(Interactable.eventTypes,['dragenter','dragleave','dropactivate','dropdeactivate','dropmove','drop']);actions.methodDict.drop='dropzone';defaultOptions.drop=drop.defaults;module.exports=drop;},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../interact":21,"../scope":33,"../utils":44,"./base":6}],9:[function(require,module,exports){'use strict';var actions=require('./base');var utils=require('../utils');var InteractEvent=require('../InteractEvent');var Interactable=require('../Interactable');var Interaction=require('../Interaction');var defaultOptions=require('../defaultOptions');var gesture={defaults:{enabled:false,origin:null,restrict:null},checker:function checker(pointer,event,interactable,element,interaction){if(interaction.pointerIds.length>=2){return{name:'gesture'};}
return null;},getCursor:function getCursor(){return'';}};InteractEvent.signals.on('new',function(_ref){var iEvent=_ref.iEvent,interaction=_ref.interaction;if(iEvent.type!=='gesturestart'){return;}
iEvent.ds=0;interaction.gesture.startDistance=interaction.gesture.prevDistance=iEvent.distance;interaction.gesture.startAngle=interaction.gesture.prevAngle=iEvent.angle;interaction.gesture.scale=1;});InteractEvent.signals.on('new',function(_ref2){var iEvent=_ref2.iEvent,interaction=_ref2.interaction;if(iEvent.type!=='gesturemove'){return;}
iEvent.ds=iEvent.scale-interaction.gesture.scale;interaction.target.fire(iEvent);interaction.gesture.prevAngle=iEvent.angle;interaction.gesture.prevDistance=iEvent.distance;if(iEvent.scale!==Infinity&&iEvent.scale!==null&&iEvent.scale!==undefined&&!isNaN(iEvent.scale)){interaction.gesture.scale=iEvent.scale;}});Interactable.prototype.gesturable=function(options){if(utils.is.object(options)){this.options.gesture.enabled=options.enabled===false?false:true;this.setPerAction('gesture',options);this.setOnEvents('gesture',options);return this;}
if(utils.is.bool(options)){this.options.gesture.enabled=options;if(!options){this.ongesturestart=this.ongesturestart=this.ongestureend=null;}
return this;}
return this.options.gesture;};InteractEvent.signals.on('set-delta',function(_ref3){var interaction=_ref3.interaction,iEvent=_ref3.iEvent,action=_ref3.action,event=_ref3.event,starting=_ref3.starting,ending=_ref3.ending,deltaSource=_ref3.deltaSource;if(action!=='gesture'){return;}
var pointers=interaction.pointers;iEvent.touches=[pointers[0],pointers[1]];if(starting){iEvent.distance=utils.touchDistance(pointers,deltaSource);iEvent.box=utils.touchBBox(pointers);iEvent.scale=1;iEvent.ds=0;iEvent.angle=utils.touchAngle(pointers,undefined,deltaSource);iEvent.da=0;}else if(ending||event instanceof InteractEvent){iEvent.distance=interaction.prevEvent.distance;iEvent.box=interaction.prevEvent.box;iEvent.scale=interaction.prevEvent.scale;iEvent.ds=iEvent.scale-1;iEvent.angle=interaction.prevEvent.angle;iEvent.da=iEvent.angle-interaction.gesture.startAngle;}else{iEvent.distance=utils.touchDistance(pointers,deltaSource);iEvent.box=utils.touchBBox(pointers);iEvent.scale=iEvent.distance/interaction.gesture.startDistance;iEvent.angle=utils.touchAngle(pointers,interaction.gesture.prevAngle,deltaSource);iEvent.ds=iEvent.scale-interaction.gesture.prevScale;iEvent.da=iEvent.angle-interaction.gesture.prevAngle;}});Interaction.signals.on('new',function(interaction){interaction.gesture={start:{x:0,y:0},startDistance:0,prevDistance:0,distance:0,scale:1,startAngle:0,prevAngle:0};});actions.gesture=gesture;actions.names.push('gesture');utils.merge(Interactable.eventTypes,['gesturestart','gesturemove','gestureend']);actions.methodDict.gesture='gesturable';defaultOptions.gesture=gesture.defaults;module.exports=gesture;},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../utils":44,"./base":6}],10:[function(require,module,exports){'use strict';var actions=require('./base');var utils=require('../utils');var browser=require('../utils/browser');var InteractEvent=require('../InteractEvent');var Interactable=require('../Interactable');var Interaction=require('../Interaction');var defaultOptions=require('../defaultOptions');var defaultMargin=browser.supportsTouch||browser.supportsPointerEvent?20:10;var resize={defaults:{enabled:false,mouseButtons:null,origin:null,snap:null,restrict:null,inertia:null,autoScroll:null,square:false,preserveAspectRatio:false,axis:'xy',margin:NaN,edges:null,invert:'none'},checker:function checker(pointer,event,interactable,element,interaction,rect){if(!rect){return null;}
var page=utils.extend({},interaction.curCoords.page);var options=interactable.options;if(options.resize.enabled){var resizeOptions=options.resize;var resizeEdges={left:false,right:false,top:false,bottom:false};if(utils.is.object(resizeOptions.edges)){for(var edge in resizeEdges){resizeEdges[edge]=checkResizeEdge(edge,resizeOptions.edges[edge],page,interaction._eventTarget,element,rect,resizeOptions.margin||defaultMargin);}
resizeEdges.left=resizeEdges.left&&!resizeEdges.right;resizeEdges.top=resizeEdges.top&&!resizeEdges.bottom;if(resizeEdges.left||resizeEdges.right||resizeEdges.top||resizeEdges.bottom){return{name:'resize',edges:resizeEdges};}}else{var right=options.resize.axis!=='y'&&page.x>rect.right-defaultMargin;var bottom=options.resize.axis!=='x'&&page.y>rect.bottom-defaultMargin;if(right||bottom){return{name:'resize',axes:(right?'x':'')+(bottom?'y':'')};}}}
return null;},cursors:browser.isIe9?{x:'e-resize',y:'s-resize',xy:'se-resize',top:'n-resize',left:'w-resize',bottom:'s-resize',right:'e-resize',topleft:'se-resize',bottomright:'se-resize',topright:'ne-resize',bottomleft:'ne-resize'}:{x:'ew-resize',y:'ns-resize',xy:'nwse-resize',top:'ns-resize',left:'ew-resize',bottom:'ns-resize',right:'ew-resize',topleft:'nwse-resize',bottomright:'nwse-resize',topright:'nesw-resize',bottomleft:'nesw-resize'},getCursor:function getCursor(action){if(action.axis){return resize.cursors[action.name+action.axis];}else if(action.edges){var cursorKey='';var edgeNames=['top','bottom','left','right'];for(var i=0;i<4;i++){if(action.edges[edgeNames[i]]){cursorKey+=edgeNames[i];}}
return resize.cursors[cursorKey];}}};InteractEvent.signals.on('new',function(_ref){var iEvent=_ref.iEvent,interaction=_ref.interaction;if(iEvent.type!=='resizestart'||!interaction.prepared.edges){return;}
var startRect=interaction.target.getRect(interaction.element);var resizeOptions=interaction.target.options.resize;if(resizeOptions.square||resizeOptions.preserveAspectRatio){var linkedEdges=utils.extend({},interaction.prepared.edges);linkedEdges.top=linkedEdges.top||linkedEdges.left&&!linkedEdges.bottom;linkedEdges.left=linkedEdges.left||linkedEdges.top&&!linkedEdges.right;linkedEdges.bottom=linkedEdges.bottom||linkedEdges.right&&!linkedEdges.top;linkedEdges.right=linkedEdges.right||linkedEdges.bottom&&!linkedEdges.left;interaction.prepared._linkedEdges=linkedEdges;}else{interaction.prepared._linkedEdges=null;}
if(resizeOptions.preserveAspectRatio){interaction.resizeStartAspectRatio=startRect.width/startRect.height;}
interaction.resizeRects={start:startRect,current:utils.extend({},startRect),inverted:utils.extend({},startRect),previous:utils.extend({},startRect),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}};iEvent.rect=interaction.resizeRects.inverted;iEvent.deltaRect=interaction.resizeRects.delta;});InteractEvent.signals.on('new',function(_ref2){var iEvent=_ref2.iEvent,phase=_ref2.phase,interaction=_ref2.interaction;if(phase!=='move'||!interaction.prepared.edges){return;}
var resizeOptions=interaction.target.options.resize;var invert=resizeOptions.invert;var invertible=invert==='reposition'||invert==='negate';var edges=interaction.prepared.edges;var start=interaction.resizeRects.start;var current=interaction.resizeRects.current;var inverted=interaction.resizeRects.inverted;var delta=interaction.resizeRects.delta;var previous=utils.extend(interaction.resizeRects.previous,inverted);var originalEdges=edges;var dx=iEvent.dx;var dy=iEvent.dy;if(resizeOptions.preserveAspectRatio||resizeOptions.square){var startAspectRatio=resizeOptions.preserveAspectRatio?interaction.resizeStartAspectRatio:1;edges=interaction.prepared._linkedEdges;if(originalEdges.left&&originalEdges.bottom||originalEdges.right&&originalEdges.top){dy=-dx/startAspectRatio;}else if(originalEdges.left||originalEdges.right){dy=dx/startAspectRatio;}else if(originalEdges.top||originalEdges.bottom){dx=dy*startAspectRatio;}}
if(edges.top){current.top+=dy;}
if(edges.bottom){current.bottom+=dy;}
if(edges.left){current.left+=dx;}
if(edges.right){current.right+=dx;}
if(invertible){utils.extend(inverted,current);if(invert==='reposition'){var swap=void 0;if(inverted.top>inverted.bottom){swap=inverted.top;inverted.top=inverted.bottom;inverted.bottom=swap;}
if(inverted.left>inverted.right){swap=inverted.left;inverted.left=inverted.right;inverted.right=swap;}}}else{inverted.top=Math.min(current.top,start.bottom);inverted.bottom=Math.max(current.bottom,start.top);inverted.left=Math.min(current.left,start.right);inverted.right=Math.max(current.right,start.left);}
inverted.width=inverted.right-inverted.left;inverted.height=inverted.bottom-inverted.top;for(var edge in inverted){delta[edge]=inverted[edge]-previous[edge];}
iEvent.edges=interaction.prepared.edges;iEvent.rect=inverted;iEvent.deltaRect=delta;});Interactable.prototype.resizable=function(options){if(utils.is.object(options)){this.options.resize.enabled=options.enabled===false?false:true;this.setPerAction('resize',options);this.setOnEvents('resize',options);if(/^x$|^y$|^xy$/.test(options.axis)){this.options.resize.axis=options.axis;}else if(options.axis===null){this.options.resize.axis=defaultOptions.resize.axis;}
if(utils.is.bool(options.preserveAspectRatio)){this.options.resize.preserveAspectRatio=options.preserveAspectRatio;}else if(utils.is.bool(options.square)){this.options.resize.square=options.square;}
return this;}
if(utils.is.bool(options)){this.options.resize.enabled=options;if(!options){this.onresizestart=this.onresizestart=this.onresizeend=null;}
return this;}
return this.options.resize;};function checkResizeEdge(name,value,page,element,interactableElement,rect,margin){if(!value){return false;}
if(value===true){var width=utils.is.number(rect.width)?rect.width:rect.right-rect.left;var height=utils.is.number(rect.height)?rect.height:rect.bottom-rect.top;if(width<0){if(name==='left'){name='right';}else if(name==='right'){name='left';}}
if(height<0){if(name==='top'){name='bottom';}else if(name==='bottom'){name='top';}}
if(name==='left'){return page.x<(width>=0?rect.left:rect.right)+margin;}
if(name==='top'){return page.y<(height>=0?rect.top:rect.bottom)+margin;}
if(name==='right'){return page.x>(width>=0?rect.right:rect.left)-margin;}
if(name==='bottom'){return page.y>(height>=0?rect.bottom:rect.top)-margin;}}
if(!utils.is.element(element)){return false;}
return utils.is.element(value)
?value===element
:utils.matchesUpTo(element,value,interactableElement);}
Interaction.signals.on('new',function(interaction){interaction.resizeAxes='xy';});InteractEvent.signals.on('set-delta',function(_ref3){var interaction=_ref3.interaction,iEvent=_ref3.iEvent,action=_ref3.action;if(action!=='resize'||!interaction.resizeAxes){return;}
var options=interaction.target.options;if(options.resize.square){if(interaction.resizeAxes==='y'){iEvent.dx=iEvent.dy;}else{iEvent.dy=iEvent.dx;}
iEvent.axes='xy';}else{iEvent.axes=interaction.resizeAxes;if(interaction.resizeAxes==='x'){iEvent.dy=0;}else if(interaction.resizeAxes==='y'){iEvent.dx=0;}}});actions.resize=resize;actions.names.push('resize');utils.merge(Interactable.eventTypes,['resizestart','resizemove','resizeinertiastart','resizeinertiaresume','resizeend']);actions.methodDict.resize='resizable';defaultOptions.resize=resize.defaults;module.exports=resize;},{"../InteractEvent":3,"../Interactable":4,"../Interaction":5,"../defaultOptions":18,"../utils":44,"../utils/browser":36,"./base":6}],11:[function(require,module,exports){'use strict';var raf=require('./utils/raf');var getWindow=require('./utils/window').getWindow;var is=require('./utils/is');var domUtils=require('./utils/domUtils');var Interaction=require('./Interaction');var defaultOptions=require('./defaultOptions');var autoScroll={defaults:{enabled:false,container:null,margin:60,speed:300},interaction:null,i:null,x:0,y:0,isScrolling:false,prevTime:0,start:function start(interaction){autoScroll.isScrolling=true;raf.cancel(autoScroll.i);autoScroll.interaction=interaction;autoScroll.prevTime=new Date().getTime();autoScroll.i=raf.request(autoScroll.scroll);},stop:function stop(){autoScroll.isScrolling=false;raf.cancel(autoScroll.i);},scroll:function scroll(){var options=autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll;var container=options.container||getWindow(autoScroll.interaction.element);var now=new Date().getTime();var dt=(now-autoScroll.prevTime)/1000;var s=options.speed*dt;if(s>=1){if(is.window(container)){container.scrollBy(autoScroll.x*s,autoScroll.y*s);}else if(container){container.scrollLeft+=autoScroll.x*s;container.scrollTop+=autoScroll.y*s;}
autoScroll.prevTime=now;}
if(autoScroll.isScrolling){raf.cancel(autoScroll.i);autoScroll.i=raf.request(autoScroll.scroll);}},check:function check(interactable,actionName){var options=interactable.options;return options[actionName].autoScroll&&options[actionName].autoScroll.enabled;},onInteractionMove:function onInteractionMove(_ref){var interaction=_ref.interaction,pointer=_ref.pointer;if(!(interaction.interacting()&&autoScroll.check(interaction.target,interaction.prepared.name))){return;}
if(interaction.simulation){autoScroll.x=autoScroll.y=0;return;}
var top=void 0;var right=void 0;var bottom=void 0;var left=void 0;var options=interaction.target.options[interaction.prepared.name].autoScroll;var container=options.container||getWindow(interaction.element);if(is.window(container)){left=pointer.clientX<autoScroll.margin;top=pointer.clientY<autoScroll.margin;right=pointer.clientX>container.innerWidth-autoScroll.margin;bottom=pointer.clientY>container.innerHeight-autoScroll.margin;}else{var rect=domUtils.getElementClientRect(container);left=pointer.clientX<rect.left+autoScroll.margin;top=pointer.clientY<rect.top+autoScroll.margin;right=pointer.clientX>rect.right-autoScroll.margin;bottom=pointer.clientY>rect.bottom-autoScroll.margin;}
autoScroll.x=right?1:left?-1:0;autoScroll.y=bottom?1:top?-1:0;if(!autoScroll.isScrolling){autoScroll.margin=options.margin;autoScroll.speed=options.speed;autoScroll.start(interaction);}}};Interaction.signals.on('stop-active',function(){autoScroll.stop();});Interaction.signals.on('action-move',autoScroll.onInteractionMove);defaultOptions.perAction.autoScroll=autoScroll.defaults;module.exports=autoScroll;},{"./Interaction":5,"./defaultOptions":18,"./utils/domUtils":39,"./utils/is":46,"./utils/raf":50,"./utils/window":52}],12:[function(require,module,exports){'use strict';var Interactable=require('../Interactable');var actions=require('../actions/base');var is=require('../utils/is');var domUtils=require('../utils/domUtils');var _require=require('../utils'),warnOnce=_require.warnOnce;Interactable.prototype.getAction=function(pointer,event,interaction,element){var action=this.defaultActionChecker(pointer,event,interaction,element);if(this.options.actionChecker){return this.options.actionChecker(pointer,event,action,this,element,interaction);}
return action;};Interactable.prototype.ignoreFrom=warnOnce(function(newValue){return this._backCompatOption('ignoreFrom',newValue);},'Interactable.ignoreForm() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue}).');Interactable.prototype.allowFrom=warnOnce(function(newValue){return this._backCompatOption('allowFrom',newValue);},'Interactable.allowForm() has been deprecated. Use Interactble.draggable({allowFrom: newValue}).');Interactable.prototype.testIgnore=function(ignoreFrom,interactableElement,element){if(!ignoreFrom||!is.element(element)){return false;}
if(is.string(ignoreFrom)){return domUtils.matchesUpTo(element,ignoreFrom,interactableElement);}else if(is.element(ignoreFrom)){return domUtils.nodeContains(ignoreFrom,element);}
return false;};Interactable.prototype.testAllow=function(allowFrom,interactableElement,element){if(!allowFrom){return true;}
if(!is.element(element)){return false;}
if(is.string(allowFrom)){return domUtils.matchesUpTo(element,allowFrom,interactableElement);}else if(is.element(allowFrom)){return domUtils.nodeContains(allowFrom,element);}
return false;};Interactable.prototype.testIgnoreAllow=function(options,interactableElement,eventTarget){return!this.testIgnore(options.ignoreFrom,interactableElement,eventTarget)&&this.testAllow(options.allowFrom,interactableElement,eventTarget);};Interactable.prototype.actionChecker=function(checker){if(is.function(checker)){this.options.actionChecker=checker;return this;}
if(checker===null){delete this.options.actionChecker;return this;}
return this.options.actionChecker;};Interactable.prototype.styleCursor=function(newValue){if(is.bool(newValue)){this.options.styleCursor=newValue;return this;}
if(newValue===null){delete this.options.styleCursor;return this;}
return this.options.styleCursor;};Interactable.prototype.defaultActionChecker=function(pointer,event,interaction,element){var rect=this.getRect(element);var buttons=event.buttons||{0:1,1:4,3:8,4:16}[event.button];var action=null;for(var _i=0;_i<actions.names.length;_i++){var _ref;_ref=actions.names[_i];var actionName=_ref;if(interaction.pointerIsDown&&/mouse|pointer/.test(interaction.pointerType)&&(buttons&this.options[actionName].mouseButtons)===0){continue;}
action=actions[actionName].checker(pointer,event,this,element,interaction,rect);if(action){return action;}}};},{"../Interactable":4,"../actions/base":6,"../utils":44,"../utils/domUtils":39,"../utils/is":46}],13:[function(require,module,exports){'use strict';var interact=require('../interact');var Interactable=require('../Interactable');var Interaction=require('../Interaction');var actions=require('../actions/base');var defaultOptions=require('../defaultOptions');var scope=require('../scope');var utils=require('../utils');var signals=require('../utils/Signals').new();require('./InteractableMethods');var autoStart={signals:signals,withinInteractionLimit:withinInteractionLimit,maxInteractions:Infinity,defaults:{perAction:{manualStart:false,max:Infinity,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}},setActionDefaults:function setActionDefaults(action){utils.extend(action.defaults,autoStart.defaults.perAction);},validateAction:validateAction};Interaction.signals.on('down',function(_ref){var interaction=_ref.interaction,pointer=_ref.pointer,event=_ref.event,eventTarget=_ref.eventTarget;if(interaction.interacting()){return;}
var actionInfo=getActionInfo(interaction,pointer,event,eventTarget);prepare(interaction,actionInfo);});Interaction.signals.on('move',function(_ref2){var interaction=_ref2.interaction,pointer=_ref2.pointer,event=_ref2.event,eventTarget=_ref2.eventTarget;if(interaction.pointerType!=='mouse'||interaction.pointerIsDown||interaction.interacting()){return;}
var actionInfo=getActionInfo(interaction,pointer,event,eventTarget);prepare(interaction,actionInfo);});Interaction.signals.on('move',function(arg){var interaction=arg.interaction,event=arg.event;if(!interaction.pointerIsDown||interaction.interacting()||!interaction.pointerWasMoved||!interaction.prepared.name){return;}
signals.fire('before-start',arg);var target=interaction.target;if(interaction.prepared.name&&target){if(target.options[interaction.prepared.name].manualStart||!withinInteractionLimit(target,interaction.element,interaction.prepared)){interaction.stop(event);}else{interaction.start(interaction.prepared,target,interaction.element);}}});function validateAction(action,interactable,element,eventTarget){if(utils.is.object(action)&&interactable.testIgnoreAllow(interactable.options[action.name],element,eventTarget)&&interactable.options[action.name].enabled&&withinInteractionLimit(interactable,element,action)){return action;}
return null;}
function validateSelector(interaction,pointer,event,matches,matchElements,eventTarget){for(var i=0,len=matches.length;i<len;i++){var match=matches[i];var matchElement=matchElements[i];var action=validateAction(match.getAction(pointer,event,interaction,matchElement),match,matchElement,eventTarget);if(action){return{action:action,target:match,element:matchElement};}}
return{};}
function getActionInfo(interaction,pointer,event,eventTarget){var matches=[];var matchElements=[];var element=eventTarget;function pushMatches(interactable){matches.push(interactable);matchElements.push(element);}
while(utils.is.element(element)){matches=[];matchElements=[];scope.interactables.forEachMatch(element,pushMatches);var actionInfo=validateSelector(interaction,pointer,event,matches,matchElements,eventTarget);if(actionInfo.action&&!actionInfo.target.options[actionInfo.action.name].manualStart){return actionInfo;}
element=utils.parentNode(element);}
return{};}
function prepare(interaction,_ref3){var action=_ref3.action,target=_ref3.target,element=_ref3.element;action=action||{};if(interaction.target&&interaction.target.options.styleCursor){interaction.target._doc.documentElement.style.cursor='';}
interaction.target=target;interaction.element=element;utils.copyAction(interaction.prepared,action);if(target&&target.options.styleCursor){var cursor=action?actions[action.name].getCursor(action):'';interaction.target._doc.documentElement.style.cursor=cursor;}
signals.fire('prepared',{interaction:interaction});}
Interaction.signals.on('stop',function(_ref4){var interaction=_ref4.interaction;var target=interaction.target;if(target&&target.options.styleCursor){target._doc.documentElement.style.cursor='';}});function withinInteractionLimit(interactable,element,action){var options=interactable.options;var maxActions=options[action.name].max;var maxPerElement=options[action.name].maxPerElement;var activeInteractions=0;var targetCount=0;var targetElementCount=0;if(!(maxActions&&maxPerElement&&autoStart.maxInteractions)){return;}
for(var _i=0;_i<scope.interactions.length;_i++){var _ref5;_ref5=scope.interactions[_i];var interaction=_ref5;var otherAction=interaction.prepared.name;if(!interaction.interacting()){continue;}
activeInteractions++;if(activeInteractions>=autoStart.maxInteractions){return false;}
if(interaction.target!==interactable){continue;}
targetCount+=otherAction===action.name|0;if(targetCount>=maxActions){return false;}
if(interaction.element===element){targetElementCount++;if(otherAction!==action.name||targetElementCount>=maxPerElement){return false;}}}
return autoStart.maxInteractions>0;}
interact.maxInteractions=function(newValue){if(utils.is.number(newValue)){autoStart.maxInteractions=newValue;return interact;}
return autoStart.maxInteractions;};Interactable.settingsMethods.push('styleCursor');Interactable.settingsMethods.push('actionChecker');Interactable.settingsMethods.push('ignoreFrom');Interactable.settingsMethods.push('allowFrom');defaultOptions.base.actionChecker=null;defaultOptions.base.styleCursor=true;utils.extend(defaultOptions.perAction,autoStart.defaults.perAction);module.exports=autoStart;},{"../Interactable":4,"../Interaction":5,"../actions/base":6,"../defaultOptions":18,"../interact":21,"../scope":33,"../utils":44,"../utils/Signals":34,"./InteractableMethods":12}],14:[function(require,module,exports){'use strict';var autoStart=require('./base');var scope=require('../scope');var is=require('../utils/is');var _require=require('../utils/domUtils'),parentNode=_require.parentNode;autoStart.setActionDefaults(require('../actions/drag'));autoStart.signals.on('before-start',function(_ref){var interaction=_ref.interaction,eventTarget=_ref.eventTarget,dx=_ref.dx,dy=_ref.dy;if(interaction.prepared.name!=='drag'){return;}
var absX=Math.abs(dx);var absY=Math.abs(dy);var targetOptions=interaction.target.options.drag;var startAxis=targetOptions.startAxis;var currentAxis=absX>absY?'x':absX<absY?'y':'xy';interaction.prepared.axis=targetOptions.lockAxis==='start'?currentAxis[0]:targetOptions.lockAxis;if(currentAxis!=='xy'&&startAxis!=='xy'&&startAxis!==currentAxis){interaction.prepared.name=null;var element=eventTarget;var getDraggable=function getDraggable(interactable){if(interactable===interaction.target){return;}
var options=interaction.target.options.drag;if(!options.manualStart&&interactable.testIgnoreAllow(options,element,eventTarget)){var action=interactable.getAction(interaction.downPointer,interaction.downEvent,interaction,element);if(action&&action.name==='drag'&&checkStartAxis(currentAxis,interactable)&&autoStart.validateAction(action,interactable,element,eventTarget)){return interactable;}}};while(is.element(element)){var interactable=scope.interactables.forEachMatch(element,getDraggable);if(interactable){interaction.prepared.name='drag';interaction.target=interactable;interaction.element=element;break;}
element=parentNode(element);}}});function checkStartAxis(startAxis,interactable){if(!interactable){return false;}
var thisAxis=interactable.options.drag.startAxis;return startAxis==='xy'||thisAxis==='xy'||thisAxis===startAxis;}},{"../actions/drag":7,"../scope":33,"../utils/domUtils":39,"../utils/is":46,"./base":13}],15:[function(require,module,exports){'use strict';require('./base').setActionDefaults(require('../actions/gesture'));},{"../actions/gesture":9,"./base":13}],16:[function(require,module,exports){'use strict';var autoStart=require('./base');var Interaction=require('../Interaction');autoStart.defaults.perAction.hold=0;autoStart.defaults.perAction.delay=0;Interaction.signals.on('new',function(interaction){interaction.autoStartHoldTimer=null;});autoStart.signals.on('prepared',function(_ref){var interaction=_ref.interaction;var hold=getHoldDuration(interaction);if(hold>0){interaction.autoStartHoldTimer=setTimeout(function(){interaction.start(interaction.prepared,interaction.target,interaction.element);},hold);}});Interaction.signals.on('move',function(_ref2){var interaction=_ref2.interaction,duplicate=_ref2.duplicate;if(interaction.pointerWasMoved&&!duplicate){clearTimeout(interaction.autoStartHoldTimer);}});autoStart.signals.on('before-start',function(_ref3){var interaction=_ref3.interaction;var hold=getHoldDuration(interaction);if(hold>0){interaction.prepared.name=null;}});function getHoldDuration(interaction){var actionName=interaction.prepared&&interaction.prepared.name;if(!actionName){return null;}
var options=interaction.target.options;return options[actionName].hold||options[actionName].delay;}
module.exports={getHoldDuration:getHoldDuration};},{"../Interaction":5,"./base":13}],17:[function(require,module,exports){'use strict';require('./base').setActionDefaults(require('../actions/resize'));},{"../actions/resize":10,"./base":13}],18:[function(require,module,exports){'use strict';module.exports={base:{accept:null,preventDefault:'auto',deltaSource:'page'},perAction:{origin:{x:0,y:0},inertia:{enabled:false,resistance:10,minSpeed:100,endSpeed:10,allowResume:true,smoothEndDuration:300}}};},{}],19:[function(require,module,exports){'use strict';require('./inertia');require('./modifiers/snap');require('./modifiers/restrict');require('./pointerEvents/base');require('./pointerEvents/holdRepeat');require('./pointerEvents/interactableTargets');require('./autoStart/hold');require('./actions/gesture');require('./actions/resize');require('./actions/drag');require('./actions/drop');require('./modifiers/snapSize');require('./modifiers/restrictEdges');require('./modifiers/restrictSize');require('./autoStart/gesture');require('./autoStart/resize');require('./autoStart/drag');require('./interactablePreventDefault.js');require('./autoScroll');module.exports=require('./interact');},{"./actions/drag":7,"./actions/drop":8,"./actions/gesture":9,"./actions/resize":10,"./autoScroll":11,"./autoStart/drag":14,"./autoStart/gesture":15,"./autoStart/hold":16,"./autoStart/resize":17,"./inertia":20,"./interact":21,"./interactablePreventDefault.js":22,"./modifiers/restrict":24,"./modifiers/restrictEdges":25,"./modifiers/restrictSize":26,"./modifiers/snap":27,"./modifiers/snapSize":28,"./pointerEvents/base":30,"./pointerEvents/holdRepeat":31,"./pointerEvents/interactableTargets":32}],20:[function(require,module,exports){'use strict';var InteractEvent=require('./InteractEvent');var Interaction=require('./Interaction');var modifiers=require('./modifiers/base');var utils=require('./utils');var animationFrame=require('./utils/raf');Interaction.signals.on('new',function(interaction){interaction.inertiaStatus={active:false,smoothEnd:false,allowResume:false,startEvent:null,upCoords:{},xe:0,ye:0,sx:0,sy:0,t0:0,vx0:0,vys:0,duration:0,lambda_v0:0,one_ve_v0:0,i:null};interaction.boundInertiaFrame=function(){return inertiaFrame.apply(interaction);};interaction.boundSmoothEndFrame=function(){return smoothEndFrame.apply(interaction);};});Interaction.signals.on('down',function(_ref){var interaction=_ref.interaction,event=_ref.event,pointer=_ref.pointer,eventTarget=_ref.eventTarget;var status=interaction.inertiaStatus;if(status.active){var element=eventTarget;while(utils.is.element(element)){if(element===interaction.element){animationFrame.cancel(status.i);status.active=false;interaction.simulation=null;interaction.updatePointer(pointer);utils.setCoords(interaction.curCoords,interaction.pointers);var signalArg={interaction:interaction};Interaction.signals.fire('before-action-move',signalArg);Interaction.signals.fire('action-resume',signalArg);var resumeEvent=new InteractEvent(interaction,event,interaction.prepared.name,'inertiaresume',interaction.element);interaction.target.fire(resumeEvent);interaction.prevEvent=resumeEvent;modifiers.resetStatuses(interaction.modifierStatuses);utils.copyCoords(interaction.prevCoords,interaction.curCoords);break;}
element=utils.parentNode(element);}}});Interaction.signals.on('up',function(_ref2){var interaction=_ref2.interaction,event=_ref2.event;var status=interaction.inertiaStatus;if(!interaction.interacting()||status.active){return;}
var target=interaction.target;var options=target&&target.options;var inertiaOptions=options&&interaction.prepared.name&&options[interaction.prepared.name].inertia;var now=new Date().getTime();var statuses={};var page=utils.extend({},interaction.curCoords.page);var pointerSpeed=interaction.pointerDelta.client.speed;var smoothEnd=false;var modifierResult=void 0;var inertiaPossible=inertiaOptions&&inertiaOptions.enabled&&interaction.prepared.name!=='gesture'&&event!==status.startEvent;var inertia=inertiaPossible&&now-interaction.curCoords.timeStamp<50&&pointerSpeed>inertiaOptions.minSpeed&&pointerSpeed>inertiaOptions.endSpeed;var modifierArg={interaction:interaction,pageCoords:page,statuses:statuses,preEnd:true,requireEndOnly:true};if(inertiaPossible&&!inertia){modifiers.resetStatuses(statuses);modifierResult=modifiers.setAll(modifierArg);if(modifierResult.shouldMove&&modifierResult.locked){smoothEnd=true;}}
if(!(inertia||smoothEnd)){return;}
utils.copyCoords(status.upCoords,interaction.curCoords);interaction.pointers[0]=status.startEvent=new InteractEvent(interaction,event,interaction.prepared.name,'inertiastart',interaction.element);status.t0=now;status.active=true;status.allowResume=inertiaOptions.allowResume;interaction.simulation=status;target.fire(status.startEvent);if(inertia){status.vx0=interaction.pointerDelta.client.vx;status.vy0=interaction.pointerDelta.client.vy;status.v0=pointerSpeed;calcInertia(interaction,status);utils.extend(page,interaction.curCoords.page);page.x+=status.xe;page.y+=status.ye;modifiers.resetStatuses(statuses);modifierResult=modifiers.setAll(modifierArg);status.modifiedXe+=modifierResult.dx;status.modifiedYe+=modifierResult.dy;status.i=animationFrame.request(interaction.boundInertiaFrame);}else{status.smoothEnd=true;status.xe=modifierResult.dx;status.ye=modifierResult.dy;status.sx=status.sy=0;status.i=animationFrame.request(interaction.boundSmoothEndFrame);}});Interaction.signals.on('stop-active',function(_ref3){var interaction=_ref3.interaction;var status=interaction.inertiaStatus;if(status.active){animationFrame.cancel(status.i);status.active=false;interaction.simulation=null;}});function calcInertia(interaction,status){var inertiaOptions=interaction.target.options[interaction.prepared.name].inertia;var lambda=inertiaOptions.resistance;var inertiaDur=-Math.log(inertiaOptions.endSpeed/status.v0)/lambda;status.x0=interaction.prevEvent.pageX;status.y0=interaction.prevEvent.pageY;status.t0=status.startEvent.timeStamp/1000;status.sx=status.sy=0;status.modifiedXe=status.xe=(status.vx0-inertiaDur)/lambda;status.modifiedYe=status.ye=(status.vy0-inertiaDur)/lambda;status.te=inertiaDur;status.lambda_v0=lambda/status.v0;status.one_ve_v0=1-inertiaOptions.endSpeed/status.v0;}
function inertiaFrame(){updateInertiaCoords(this);utils.setCoordDeltas(this.pointerDelta,this.prevCoords,this.curCoords);var status=this.inertiaStatus;var options=this.target.options[this.prepared.name].inertia;var lambda=options.resistance;var t=new Date().getTime()/1000-status.t0;if(t<status.te){var progress=1-(Math.exp(-lambda*t)-status.lambda_v0)/status.one_ve_v0;if(status.modifiedXe===status.xe&&status.modifiedYe===status.ye){status.sx=status.xe*progress;status.sy=status.ye*progress;}else{var quadPoint=utils.getQuadraticCurvePoint(0,0,status.xe,status.ye,status.modifiedXe,status.modifiedYe,progress);status.sx=quadPoint.x;status.sy=quadPoint.y;}
this.doMove();status.i=animationFrame.request(this.boundInertiaFrame);}else{status.sx=status.modifiedXe;status.sy=status.modifiedYe;this.doMove();this.end(status.startEvent);status.active=false;this.simulation=null;}
utils.copyCoords(this.prevCoords,this.curCoords);}
function smoothEndFrame(){updateInertiaCoords(this);var status=this.inertiaStatus;var t=new Date().getTime()-status.t0;var duration=this.target.options[this.prepared.name].inertia.smoothEndDuration;if(t<duration){status.sx=utils.easeOutQuad(t,0,status.xe,duration);status.sy=utils.easeOutQuad(t,0,status.ye,duration);this.pointerMove(status.startEvent,status.startEvent);status.i=animationFrame.request(this.boundSmoothEndFrame);}else{status.sx=status.xe;status.sy=status.ye;this.pointerMove(status.startEvent,status.startEvent);this.end(status.startEvent);status.smoothEnd=status.active=false;this.simulation=null;}}
function updateInertiaCoords(interaction){var status=interaction.inertiaStatus;if(!status.active){return;}
var pageUp=status.upCoords.page;var clientUp=status.upCoords.client;utils.setCoords(interaction.curCoords,[{pageX:pageUp.x+status.sx,pageY:pageUp.y+status.sy,clientX:clientUp.x+status.sx,clientY:clientUp.y+status.sy}]);}},{"./InteractEvent":3,"./Interaction":5,"./modifiers/base":23,"./utils":44,"./utils/raf":50}],21:[function(require,module,exports){'use strict';var browser=require('./utils/browser');var events=require('./utils/events');var utils=require('./utils');var scope=require('./scope');var Interactable=require('./Interactable');var Interaction=require('./Interaction');var globalEvents={};function interact(element,options){var interactable=scope.interactables.get(element,options);if(!interactable){interactable=new Interactable(element,options);interactable.events.global=globalEvents;}
return interactable;}
interact.isSet=function(element,options){return scope.interactables.indexOfElement(element,options&&options.context)!==-1;};interact.on=function(type,listener,options){if(utils.is.string(type)&&type.search(' ')!==-1){type=type.trim().split(/ +/);}
if(utils.is.array(type)){for(var _i=0;_i<type.length;_i++){var _ref;_ref=type[_i];var eventType=_ref;interact.on(eventType,listener,options);}
return interact;}
if(utils.is.object(type)){for(var prop in type){interact.on(prop,type[prop],listener);}
return interact;}
if(utils.contains(Interactable.eventTypes,type)){if(!globalEvents[type]){globalEvents[type]=[listener];}else{globalEvents[type].push(listener);}}
else{events.add(scope.document,type,listener,{options:options});}
return interact;};interact.off=function(type,listener,options){if(utils.is.string(type)&&type.search(' ')!==-1){type=type.trim().split(/ +/);}
if(utils.is.array(type)){for(var _i2=0;_i2<type.length;_i2++){var _ref2;_ref2=type[_i2];var eventType=_ref2;interact.off(eventType,listener,options);}
return interact;}
if(utils.is.object(type)){for(var prop in type){interact.off(prop,type[prop],listener);}
return interact;}
if(!utils.contains(Interactable.eventTypes,type)){events.remove(scope.document,type,listener,options);}else{var index=void 0;if(type in globalEvents&&(index=globalEvents[type].indexOf(listener))!==-1){globalEvents[type].splice(index,1);}}
return interact;};interact.debug=function(){return scope;};interact.getPointerAverage=utils.pointerAverage;interact.getTouchBBox=utils.touchBBox;interact.getTouchDistance=utils.touchDistance;interact.getTouchAngle=utils.touchAngle;interact.getElementRect=utils.getElementRect;interact.getElementClientRect=utils.getElementClientRect;interact.matchesSelector=utils.matchesSelector;interact.closest=utils.closest;interact.supportsTouch=function(){return browser.supportsTouch;};interact.supportsPointerEvent=function(){return browser.supportsPointerEvent;};interact.stop=function(event){for(var i=scope.interactions.length-1;i>=0;i--){scope.interactions[i].stop(event);}
return interact;};interact.pointerMoveTolerance=function(newValue){if(utils.is.number(newValue)){Interaction.pointerMoveTolerance=newValue;return interact;}
return Interaction.pointerMoveTolerance;};interact.addDocument=scope.addDocument;interact.removeDocument=scope.removeDocument;scope.interact=interact;module.exports=interact;},{"./Interactable":4,"./Interaction":5,"./scope":33,"./utils":44,"./utils/browser":36,"./utils/events":40}],22:[function(require,module,exports){'use strict';var Interactable=require('./Interactable');var Interaction=require('./Interaction');var scope=require('./scope');var is=require('./utils/is');var events=require('./utils/events');var browser=require('./utils/browser');var _require=require('./utils/domUtils'),nodeContains=_require.nodeContains,matchesSelector=_require.matchesSelector;Interactable.prototype.preventDefault=function(newValue){if(/^(always|never|auto)$/.test(newValue)){this.options.preventDefault=newValue;return this;}
if(is.bool(newValue)){this.options.preventDefault=newValue?'always':'never';return this;}
return this.options.preventDefault;};Interactable.prototype.checkAndPreventDefault=function(event){var setting=this.options.preventDefault;if(setting==='never'){return;}
if(setting==='always'){event.preventDefault();return;}
if(events.supportsPassive&&/^touch(start|move)$/.test(event.type)&&!browser.isIOS){return;}
if(/^(mouse|pointer|touch)*(down|start)/i.test(event.type)){return;}
if(is.element(event.target)&&matchesSelector(event.target,'input,select,textarea,[contenteditable=true],[contenteditable=true] *')){return;}
event.preventDefault();};function onInteractionEvent(_ref){var interaction=_ref.interaction,event=_ref.event;if(interaction.target){interaction.target.checkAndPreventDefault(event);}}
var _arr=['down','move','up','cancel'];for(var _i=0;_i<_arr.length;_i++){var eventSignal=_arr[_i];Interaction.signals.on(eventSignal,onInteractionEvent);}
Interaction.docEvents.dragstart=function preventNativeDrag(event){for(var _i2=0;_i2<scope.interactions.length;_i2++){var _ref2;_ref2=scope.interactions[_i2];var interaction=_ref2;if(interaction.element&&(interaction.element===event.target||nodeContains(interaction.element,event.target))){interaction.target.checkAndPreventDefault(event);return;}}};},{"./Interactable":4,"./Interaction":5,"./scope":33,"./utils/browser":36,"./utils/domUtils":39,"./utils/events":40,"./utils/is":46}],23:[function(require,module,exports){'use strict';var InteractEvent=require('../InteractEvent');var Interaction=require('../Interaction');var extend=require('../utils/extend');var modifiers={names:[],setOffsets:function setOffsets(arg){var interaction=arg.interaction,page=arg.pageCoords;var target=interaction.target,element=interaction.element,startOffset=interaction.startOffset;var rect=target.getRect(element);if(rect){startOffset.left=page.x-rect.left;startOffset.top=page.y-rect.top;startOffset.right=rect.right-page.x;startOffset.bottom=rect.bottom-page.y;if(!('width'in rect)){rect.width=rect.right-rect.left;}
if(!('height'in rect)){rect.height=rect.bottom-rect.top;}}else{startOffset.left=startOffset.top=startOffset.right=startOffset.bottom=0;}
arg.rect=rect;arg.interactable=target;arg.element=element;for(var _i=0;_i<modifiers.names.length;_i++){var _ref;_ref=modifiers.names[_i];var modifierName=_ref;arg.options=target.options[interaction.prepared.name][modifierName];if(!arg.options){continue;}
interaction.modifierOffsets[modifierName]=modifiers[modifierName].setOffset(arg);}},setAll:function setAll(arg){var interaction=arg.interaction,statuses=arg.statuses,preEnd=arg.preEnd,requireEndOnly=arg.requireEndOnly;var result={dx:0,dy:0,changed:false,locked:false,shouldMove:true};arg.modifiedCoords=extend({},arg.pageCoords);for(var _i2=0;_i2<modifiers.names.length;_i2++){var _ref2;_ref2=modifiers.names[_i2];var modifierName=_ref2;var modifier=modifiers[modifierName];var options=interaction.target.options[interaction.prepared.name][modifierName];if(!shouldDo(options,preEnd,requireEndOnly)){continue;}
arg.status=arg.status=statuses[modifierName];arg.options=options;arg.offset=arg.interaction.modifierOffsets[modifierName];modifier.set(arg);if(arg.status.locked){arg.modifiedCoords.x+=arg.status.dx;arg.modifiedCoords.y+=arg.status.dy;result.dx+=arg.status.dx;result.dy+=arg.status.dy;result.locked=true;}}
result.shouldMove=!arg.status||!result.locked||arg.status.changed;return result;},resetStatuses:function resetStatuses(statuses){for(var _i3=0;_i3<modifiers.names.length;_i3++){var _ref3;_ref3=modifiers.names[_i3];var modifierName=_ref3;var status=statuses[modifierName]||{};status.dx=status.dy=0;status.modifiedX=status.modifiedY=NaN;status.locked=false;status.changed=true;statuses[modifierName]=status;}
return statuses;},start:function start(_ref4,signalName){var interaction=_ref4.interaction;var arg={interaction:interaction,pageCoords:(signalName==='action-resume'?interaction.curCoords:interaction.startCoords).page,startOffset:interaction.startOffset,statuses:interaction.modifierStatuses,preEnd:false,requireEndOnly:false};modifiers.setOffsets(arg);modifiers.resetStatuses(arg.statuses);arg.pageCoords=extend({},interaction.startCoords.page);interaction.modifierResult=modifiers.setAll(arg);},beforeMove:function beforeMove(_ref5){var interaction=_ref5.interaction,preEnd=_ref5.preEnd,interactingBeforeMove=_ref5.interactingBeforeMove;var modifierResult=modifiers.setAll({interaction:interaction,preEnd:preEnd,pageCoords:interaction.curCoords.page,statuses:interaction.modifierStatuses,requireEndOnly:false});if(!modifierResult.shouldMove&&interactingBeforeMove){interaction._dontFireMove=true;}
interaction.modifierResult=modifierResult;},end:function end(_ref6){var interaction=_ref6.interaction,event=_ref6.event;for(var _i4=0;_i4<modifiers.names.length;_i4++){var _ref7;_ref7=modifiers.names[_i4];var modifierName=_ref7;var options=interaction.target.options[interaction.prepared.name][modifierName];if(shouldDo(options,true,true)){interaction.doMove({event:event,preEnd:true});break;}}},setXY:function setXY(arg){var iEvent=arg.iEvent,interaction=arg.interaction;var modifierArg=extend({},arg);for(var i=0;i<modifiers.names.length;i++){var modifierName=modifiers.names[i];modifierArg.options=interaction.target.options[interaction.prepared.name][modifierName];if(!modifierArg.options){continue;}
var modifier=modifiers[modifierName];modifierArg.status=interaction.modifierStatuses[modifierName];iEvent[modifierName]=modifier.modifyCoords(modifierArg);}}};Interaction.signals.on('new',function(interaction){interaction.startOffset={left:0,right:0,top:0,bottom:0};interaction.modifierOffsets={};interaction.modifierStatuses=modifiers.resetStatuses({});interaction.modifierResult=null;});Interaction.signals.on('action-start',modifiers.start);Interaction.signals.on('action-resume',modifiers.start);Interaction.signals.on('before-action-move',modifiers.beforeMove);Interaction.signals.on('action-end',modifiers.end);InteractEvent.signals.on('set-xy',modifiers.setXY);function shouldDo(options,preEnd,requireEndOnly){return options&&options.enabled&&(preEnd||!options.endOnly)&&(!requireEndOnly||options.endOnly);}
module.exports=modifiers;},{"../InteractEvent":3,"../Interaction":5,"../utils/extend":41}],24:[function(require,module,exports){'use strict';var modifiers=require('./base');var utils=require('../utils');var defaultOptions=require('../defaultOptions');var restrict={defaults:{enabled:false,endOnly:false,restriction:null,elementRect:null},setOffset:function setOffset(_ref){var rect=_ref.rect,startOffset=_ref.startOffset,options=_ref.options;var elementRect=options&&options.elementRect;var offset={};if(rect&&elementRect){offset.left=startOffset.left-rect.width*elementRect.left;offset.top=startOffset.top-rect.height*elementRect.top;offset.right=startOffset.right-rect.width*(1-elementRect.right);offset.bottom=startOffset.bottom-rect.height*(1-elementRect.bottom);}else{offset.left=offset.top=offset.right=offset.bottom=0;}
return offset;},set:function set(_ref2){var modifiedCoords=_ref2.modifiedCoords,interaction=_ref2.interaction,status=_ref2.status,options=_ref2.options;if(!options){return status;}
var page=status.useStatusXY?{x:status.x,y:status.y}:utils.extend({},modifiedCoords);var restriction=getRestrictionRect(options.restriction,interaction,page);if(!restriction){return status;}
status.dx=0;status.dy=0;status.locked=false;var rect=restriction;var modifiedX=page.x;var modifiedY=page.y;var offset=interaction.modifierOffsets.restrict;if('x'in restriction&&'y'in restriction){modifiedX=Math.max(Math.min(rect.x+rect.width-offset.right,page.x),rect.x+offset.left);modifiedY=Math.max(Math.min(rect.y+rect.height-offset.bottom,page.y),rect.y+offset.top);}else{modifiedX=Math.max(Math.min(rect.right-offset.right,page.x),rect.left+offset.left);modifiedY=Math.max(Math.min(rect.bottom-offset.bottom,page.y),rect.top+offset.top);}
status.dx=modifiedX-page.x;status.dy=modifiedY-page.y;status.changed=status.modifiedX!==modifiedX||status.modifiedY!==modifiedY;status.locked=!!(status.dx||status.dy);status.modifiedX=modifiedX;status.modifiedY=modifiedY;},modifyCoords:function modifyCoords(_ref3){var page=_ref3.page,client=_ref3.client,status=_ref3.status,phase=_ref3.phase,options=_ref3.options;var elementRect=options&&options.elementRect;if(options&&options.enabled&&!(phase==='start'&&elementRect&&status.locked)){if(status.locked){page.x+=status.dx;page.y+=status.dy;client.x+=status.dx;client.y+=status.dy;return{dx:status.dx,dy:status.dy};}}},getRestrictionRect:getRestrictionRect};function getRestrictionRect(value,interaction,page){if(utils.is.function(value)){return utils.resolveRectLike(value,interaction.target,interaction.element,[page.x,page.y,interaction]);}else{return utils.resolveRectLike(value,interaction.target,interaction.element);}}
modifiers.restrict=restrict;modifiers.names.push('restrict');defaultOptions.perAction.restrict=restrict.defaults;module.exports=restrict;},{"../defaultOptions":18,"../utils":44,"./base":23}],25:[function(require,module,exports){'use strict';var modifiers=require('./base');var utils=require('../utils');var rectUtils=require('../utils/rect');var defaultOptions=require('../defaultOptions');var resize=require('../actions/resize');var _require=require('./restrict'),getRestrictionRect=_require.getRestrictionRect;var noInner={top:+Infinity,left:+Infinity,bottom:-Infinity,right:-Infinity};var noOuter={top:-Infinity,left:-Infinity,bottom:+Infinity,right:+Infinity};var restrictEdges={defaults:{enabled:false,endOnly:false,min:null,max:null,offset:null},setOffset:function setOffset(_ref){var interaction=_ref.interaction,startOffset=_ref.startOffset,options=_ref.options;if(!options){return utils.extend({},startOffset);}
var offset=getRestrictionRect(options.offset,interaction,interaction.startCoords.page);if(offset){return{top:startOffset.top+offset.y,left:startOffset.left+offset.x,bottom:startOffset.bottom+offset.y,right:startOffset.right+offset.x};}
return startOffset;},set:function set(_ref2){var modifiedCoords=_ref2.modifiedCoords,interaction=_ref2.interaction,status=_ref2.status,offset=_ref2.offset,options=_ref2.options;var edges=interaction.prepared.linkedEdges||interaction.prepared.edges;if(!interaction.interacting()||!edges){return;}
var page=status.useStatusXY?{x:status.x,y:status.y}:utils.extend({},modifiedCoords);var inner=rectUtils.xywhToTlbr(getRestrictionRect(options.inner,interaction,page))||noInner;var outer=rectUtils.xywhToTlbr(getRestrictionRect(options.outer,interaction,page))||noOuter;var modifiedX=page.x;var modifiedY=page.y;status.dx=0;status.dy=0;status.locked=false;if(edges.top){modifiedY=Math.min(Math.max(outer.top+offset.top,page.y),inner.top+offset.top);}else if(edges.bottom){modifiedY=Math.max(Math.min(outer.bottom-offset.bottom,page.y),inner.bottom-offset.bottom);}
if(edges.left){modifiedX=Math.min(Math.max(outer.left+offset.left,page.x),inner.left+offset.left);}else if(edges.right){modifiedX=Math.max(Math.min(outer.right-offset.right,page.x),inner.right-offset.right);}
status.dx=modifiedX-page.x;status.dy=modifiedY-page.y;status.changed=status.modifiedX!==modifiedX||status.modifiedY!==modifiedY;status.locked=!!(status.dx||status.dy);status.modifiedX=modifiedX;status.modifiedY=modifiedY;},modifyCoords:function modifyCoords(_ref3){var page=_ref3.page,client=_ref3.client,status=_ref3.status,phase=_ref3.phase,options=_ref3.options;if(options&&options.enabled&&!(phase==='start'&&status.locked)){if(status.locked){page.x+=status.dx;page.y+=status.dy;client.x+=status.dx;client.y+=status.dy;return{dx:status.dx,dy:status.dy};}}},noInner:noInner,noOuter:noOuter,getRestrictionRect:getRestrictionRect};modifiers.restrictEdges=restrictEdges;modifiers.names.push('restrictEdges');defaultOptions.perAction.restrictEdges=restrictEdges.defaults;resize.defaults.restrictEdges=restrictEdges.defaults;module.exports=restrictEdges;},{"../actions/resize":10,"../defaultOptions":18,"../utils":44,"../utils/rect":51,"./base":23,"./restrict":24}],26:[function(require,module,exports){'use strict';var modifiers=require('./base');var restrictEdges=require('./restrictEdges');var utils=require('../utils');var rectUtils=require('../utils/rect');var defaultOptions=require('../defaultOptions');var resize=require('../actions/resize');var noMin={width:-Infinity,height:-Infinity};var noMax={width:+Infinity,height:+Infinity};var restrictSize={defaults:{enabled:false,endOnly:false,min:null,max:null},setOffset:function setOffset(_ref){var interaction=_ref.interaction;return interaction.startOffset;},set:function set(arg){var interaction=arg.interaction,options=arg.options;var edges=interaction.prepared.linkedEdges||interaction.prepared.edges;if(!interaction.interacting()||!edges){return;}
var rect=rectUtils.xywhToTlbr(interaction.resizeRects.inverted);var minSize=rectUtils.tlbrToXywh(restrictEdges.getRestrictionRect(options.min,interaction))||noMin;var maxSize=rectUtils.tlbrToXywh(restrictEdges.getRestrictionRect(options.max,interaction))||noMax;arg.options={enabled:options.enabled,endOnly:options.endOnly,inner:utils.extend({},restrictEdges.noInner),outer:utils.extend({},restrictEdges.noOuter)};if(edges.top){arg.options.inner.top=rect.bottom-minSize.height;arg.options.outer.top=rect.bottom-maxSize.height;}else if(edges.bottom){arg.options.inner.bottom=rect.top+minSize.height;arg.options.outer.bottom=rect.top+maxSize.height;}
if(edges.left){arg.options.inner.left=rect.right-minSize.width;arg.options.outer.left=rect.right-maxSize.width;}else if(edges.right){arg.options.inner.right=rect.left+minSize.width;arg.options.outer.right=rect.left+maxSize.width;}
restrictEdges.set(arg);},modifyCoords:restrictEdges.modifyCoords};modifiers.restrictSize=restrictSize;modifiers.names.push('restrictSize');defaultOptions.perAction.restrictSize=restrictSize.defaults;resize.defaults.restrictSize=restrictSize.defaults;module.exports=restrictSize;},{"../actions/resize":10,"../defaultOptions":18,"../utils":44,"../utils/rect":51,"./base":23,"./restrictEdges":25}],27:[function(require,module,exports){'use strict';var modifiers=require('./base');var interact=require('../interact');var utils=require('../utils');var defaultOptions=require('../defaultOptions');var snap={defaults:{enabled:false,endOnly:false,range:Infinity,targets:null,offsets:null,relativePoints:null},setOffset:function setOffset(_ref){var interaction=_ref.interaction,interactable=_ref.interactable,element=_ref.element,rect=_ref.rect,startOffset=_ref.startOffset,options=_ref.options;var offsets=[];var optionsOrigin=utils.rectToXY(utils.resolveRectLike(options.origin));var origin=optionsOrigin||utils.getOriginXY(interactable,element,interaction.prepared.name);options=options||interactable.options[interaction.prepared.name].snap||{};var snapOffset=void 0;if(options.offset==='startCoords'){snapOffset={x:interaction.startCoords.page.x-origin.x,y:interaction.startCoords.page.y-origin.y};}else{var offsetRect=utils.resolveRectLike(options.offset,interactable,element,[interaction]);snapOffset=utils.rectToXY(offsetRect)||{x:0,y:0};}
if(rect&&options.relativePoints&&options.relativePoints.length){for(var _i=0;_i<options.relativePoints.length;_i++){var _ref3;_ref3=options.relativePoints[_i];var _ref2=_ref3;var relativeX=_ref2.x;var relativeY=_ref2.y;offsets.push({x:startOffset.left-rect.width*relativeX+snapOffset.x,y:startOffset.top-rect.height*relativeY+snapOffset.y});}}else{offsets.push(snapOffset);}
return offsets;},set:function set(_ref4){var interaction=_ref4.interaction,modifiedCoords=_ref4.modifiedCoords,status=_ref4.status,options=_ref4.options,offsets=_ref4.offset;var targets=[];var target=void 0;var page=void 0;var i=void 0;if(status.useStatusXY){page={x:status.x,y:status.y};}else{var origin=utils.getOriginXY(interaction.target,interaction.element,interaction.prepared.name);page=utils.extend({},modifiedCoords);page.x-=origin.x;page.y-=origin.y;}
status.realX=page.x;status.realY=page.y;var len=options.targets?options.targets.length:0;for(var _i2=0;_i2<offsets.length;_i2++){var _ref6;_ref6=offsets[_i2];var _ref5=_ref6;var offsetX=_ref5.x;var offsetY=_ref5.y;var relativeX=page.x-offsetX;var relativeY=page.y-offsetY;for(var _i3=0;_i3<(options.targets||[]).length;_i3++){var _ref7;_ref7=(options.targets||[])[_i3];var snapTarget=_ref7;if(utils.is.function(snapTarget)){target=snapTarget(relativeX,relativeY,interaction);}else{target=snapTarget;}
if(!target){continue;}
targets.push({x:utils.is.number(target.x)?target.x+offsetX:relativeX,y:utils.is.number(target.y)?target.y+offsetY:relativeY,range:utils.is.number(target.range)?target.range:options.range});}}
var closest={target:null,inRange:false,distance:0,range:0,dx:0,dy:0};for(i=0,len=targets.length;i<len;i++){target=targets[i];var range=target.range;var dx=target.x-page.x;var dy=target.y-page.y;var distance=utils.hypot(dx,dy);var inRange=distance<=range;if(range===Infinity&&closest.inRange&&closest.range!==Infinity){inRange=false;}
if(!closest.target||(inRange
?closest.inRange&&range!==Infinity
?distance/range<closest.distance/closest.range
:range===Infinity&&closest.range!==Infinity||distance<closest.distance:!closest.inRange&&distance<closest.distance)){closest.target=target;closest.distance=distance;closest.range=range;closest.inRange=inRange;closest.dx=dx;closest.dy=dy;status.range=range;}}
var snapChanged=void 0;if(closest.target){snapChanged=status.modifiedX!==closest.target.x||status.modifiedY!==closest.target.y;status.modifiedX=closest.target.x;status.modifiedY=closest.target.y;}else{snapChanged=true;status.modifiedX=NaN;status.modifiedY=NaN;}
status.dx=closest.dx;status.dy=closest.dy;status.changed=snapChanged||closest.inRange&&!status.locked;status.locked=closest.inRange;},modifyCoords:function modifyCoords(_ref8){var page=_ref8.page,client=_ref8.client,status=_ref8.status,phase=_ref8.phase,options=_ref8.options;var relativePoints=options&&options.relativePoints;if(options&&options.enabled&&!(phase==='start'&&relativePoints&&relativePoints.length)){if(status.locked){page.x+=status.dx;page.y+=status.dy;client.x+=status.dx;client.y+=status.dy;}
return{range:status.range,locked:status.locked,x:status.modifiedX,y:status.modifiedY,realX:status.realX,realY:status.realY,dx:status.dx,dy:status.dy};}}};interact.createSnapGrid=function(grid){return function(x,y){var limits=grid.limits||{left:-Infinity,right:Infinity,top:-Infinity,bottom:Infinity};var offsetX=0;var offsetY=0;if(utils.is.object(grid.offset)){offsetX=grid.offset.x;offsetY=grid.offset.y;}
var gridx=Math.round((x-offsetX)/grid.x);var gridy=Math.round((y-offsetY)/grid.y);var newX=Math.max(limits.left,Math.min(limits.right,gridx*grid.x+offsetX));var newY=Math.max(limits.top,Math.min(limits.bottom,gridy*grid.y+offsetY));return{x:newX,y:newY,range:grid.range};};};modifiers.snap=snap;modifiers.names.push('snap');defaultOptions.perAction.snap=snap.defaults;module.exports=snap;},{"../defaultOptions":18,"../interact":21,"../utils":44,"./base":23}],28:[function(require,module,exports){'use strict';var modifiers=require('./base');var snap=require('./snap');var defaultOptions=require('../defaultOptions');var resize=require('../actions/resize');var utils=require('../utils/');var snapSize={defaults:{enabled:false,endOnly:false,range:Infinity,targets:null,offsets:null},setOffset:function setOffset(arg){var interaction=arg.interaction,options=arg.options;var edges=interaction.prepared.edges;if(!edges){return;}
arg.options={relativePoints:[{x:edges.left?0:1,y:edges.top?0:1}],origin:{x:0,y:0},offset:'self',range:options.range};var offsets=snap.setOffset(arg);arg.options=options;return offsets;},set:function set(arg){var interaction=arg.interaction,options=arg.options,offset=arg.offset,modifiedCoords=arg.modifiedCoords;var page=utils.extend({},modifiedCoords);var relativeX=page.x-offset[0].x;var relativeY=page.y-offset[0].y;arg.options=utils.extend({},options);arg.options.targets=[];for(var _i=0;_i<(options.targets||[]).length;_i++){var _ref;_ref=(options.targets||[])[_i];var snapTarget=_ref;var target=void 0;if(utils.is.function(snapTarget)){target=snapTarget(relativeX,relativeY,interaction);}else{target=snapTarget;}
if(!target){continue;}
if('width'in target&&'height'in target){target.x=target.width;target.y=target.height;}
arg.options.targets.push(target);}
snap.set(arg);},modifyCoords:function modifyCoords(arg){var options=arg.options;arg.options=utils.extend({},options);arg.options.enabled=options.enabled;arg.options.relativePoints=[null];snap.modifyCoords(arg);}};modifiers.snapSize=snapSize;modifiers.names.push('snapSize');defaultOptions.perAction.snapSize=snapSize.defaults;resize.defaults.snapSize=snapSize.defaults;module.exports=snapSize;},{"../actions/resize":10,"../defaultOptions":18,"../utils/":44,"./base":23,"./snap":27}],29:[function(require,module,exports){'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var pointerUtils=require('../utils/pointerUtils');module.exports=function(){function PointerEvent(type,pointer,event,eventTarget,interaction){_classCallCheck(this,PointerEvent);pointerUtils.pointerExtend(this,event);if(event!==pointer){pointerUtils.pointerExtend(this,pointer);}
this.interaction=interaction;this.timeStamp=new Date().getTime();this.originalEvent=event;this.type=type;this.pointerId=pointerUtils.getPointerId(pointer);this.pointerType=pointerUtils.getPointerType(pointer);this.target=eventTarget;this.currentTarget=null;if(type==='tap'){var pointerIndex=interaction.getPointerIndex(pointer);this.dt=this.timeStamp-interaction.downTimes[pointerIndex];var interval=this.timeStamp-interaction.tapTime;this.double=!!(interaction.prevTap&&interaction.prevTap.type!=='doubletap'&&interaction.prevTap.target===this.target&&interval<500);}else if(type==='doubletap'){this.dt=pointer.timeStamp-interaction.tapTime;}}
PointerEvent.prototype.subtractOrigin=function subtractOrigin(_ref){var originX=_ref.x,originY=_ref.y;this.pageX-=originX;this.pageY-=originY;this.clientX-=originX;this.clientY-=originY;return this;};PointerEvent.prototype.addOrigin=function addOrigin(_ref2){var originX=_ref2.x,originY=_ref2.y;this.pageX+=originX;this.pageY+=originY;this.clientX+=originX;this.clientY+=originY;return this;};PointerEvent.prototype.preventDefault=function preventDefault(){this.originalEvent.preventDefault();};PointerEvent.prototype.stopPropagation=function stopPropagation(){this.propagationStopped=true;};PointerEvent.prototype.stopImmediatePropagation=function stopImmediatePropagation(){this.immediatePropagationStopped=this.propagationStopped=true;};return PointerEvent;}();},{"../utils/pointerUtils":49}],30:[function(require,module,exports){'use strict';var PointerEvent=require('./PointerEvent');var Interaction=require('../Interaction');var utils=require('../utils');var defaults=require('../defaultOptions');var signals=require('../utils/Signals').new();var simpleSignals=['down','up','cancel'];var simpleEvents=['down','up','cancel'];var pointerEvents={PointerEvent:PointerEvent,fire:fire,collectEventTargets:collectEventTargets,signals:signals,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:['down','move','up','cancel','tap','doubletap','hold']};function fire(arg){var interaction=arg.interaction,pointer=arg.pointer,event=arg.event,eventTarget=arg.eventTarget,_arg$type=arg.type,type=_arg$type===undefined?arg.pointerEvent.type:_arg$type,_arg$targets=arg.targets,targets=_arg$targets===undefined?collectEventTargets(arg):_arg$targets,_arg$pointerEvent=arg.pointerEvent,pointerEvent=_arg$pointerEvent===undefined?new PointerEvent(type,pointer,event,eventTarget,interaction):_arg$pointerEvent;var signalArg={interaction:interaction,pointer:pointer,event:event,eventTarget:eventTarget,targets:targets,type:type,pointerEvent:pointerEvent};for(var i=0;i<targets.length;i++){var target=targets[i];for(var prop in target.props||{}){pointerEvent[prop]=target.props[prop];}
var origin=utils.getOriginXY(target.eventable,target.element);pointerEvent.subtractOrigin(origin);pointerEvent.eventable=target.eventable;pointerEvent.currentTarget=target.element;target.eventable.fire(pointerEvent);pointerEvent.addOrigin(origin);if(pointerEvent.immediatePropagationStopped||pointerEvent.propagationStopped&&i+1<targets.length&&targets[i+1].element!==pointerEvent.currentTarget){break;}}
signals.fire('fired',signalArg);if(type==='tap'){var prevTap=pointerEvent.double?fire({interaction:interaction,pointer:pointer,event:event,eventTarget:eventTarget,type:'doubletap'}):pointerEvent;interaction.prevTap=prevTap;interaction.tapTime=prevTap.timeStamp;}
return pointerEvent;}
function collectEventTargets(_ref){var interaction=_ref.interaction,pointer=_ref.pointer,event=_ref.event,eventTarget=_ref.eventTarget,type=_ref.type;var pointerIndex=interaction.getPointerIndex(pointer);if(type==='tap'&&(interaction.pointerWasMoved
||!(interaction.downTargets[pointerIndex]&&interaction.downTargets[pointerIndex]===eventTarget))){return[];}
var path=utils.getPath(eventTarget);var signalArg={interaction:interaction,pointer:pointer,event:event,eventTarget:eventTarget,type:type,path:path,targets:[],element:null};for(var _i=0;_i<path.length;_i++){var _ref2;_ref2=path[_i];var element=_ref2;signalArg.element=element;signals.fire('collect-targets',signalArg);}
if(type==='hold'){signalArg.targets=signalArg.targets.filter(function(target){return target.eventable.options.holdDuration===interaction.holdTimers[pointerIndex].duration;});}
return signalArg.targets;}
Interaction.signals.on('update-pointer-down',function(_ref3){var interaction=_ref3.interaction,pointerIndex=_ref3.pointerIndex;interaction.holdTimers[pointerIndex]={duration:Infinity,timeout:null};});Interaction.signals.on('remove-pointer',function(_ref4){var interaction=_ref4.interaction,pointerIndex=_ref4.pointerIndex;interaction.holdTimers.splice(pointerIndex,1);});Interaction.signals.on('move',function(_ref5){var interaction=_ref5.interaction,pointer=_ref5.pointer,event=_ref5.event,eventTarget=_ref5.eventTarget,duplicateMove=_ref5.duplicateMove;var pointerIndex=interaction.getPointerIndex(pointer);if(!duplicateMove&&(!interaction.pointerIsDown||interaction.pointerWasMoved)){if(interaction.pointerIsDown){clearTimeout(interaction.holdTimers[pointerIndex].timeout);}
fire({interaction:interaction,pointer:pointer,event:event,eventTarget:eventTarget,type:'move'});}});Interaction.signals.on('down',function(_ref6){var interaction=_ref6.interaction,pointer=_ref6.pointer,event=_ref6.event,eventTarget=_ref6.eventTarget,pointerIndex=_ref6.pointerIndex;var timer=interaction.holdTimers[pointerIndex];var path=utils.getPath(eventTarget);var signalArg={interaction:interaction,pointer:pointer,event:event,eventTarget:eventTarget,type:'hold',targets:[],path:path,element:null};for(var _i2=0;_i2<path.length;_i2++){var _ref7;_ref7=path[_i2];var element=_ref7;signalArg.element=element;signals.fire('collect-targets',signalArg);}
if(!signalArg.targets.length){return;}
var minDuration=Infinity;for(var _i3=0;_i3<signalArg.targets.length;_i3++){var _ref8;_ref8=signalArg.targets[_i3];var target=_ref8;var holdDuration=target.eventable.options.holdDuration;if(holdDuration<minDuration){minDuration=holdDuration;}}
timer.duration=minDuration;timer.timeout=setTimeout(function(){fire({interaction:interaction,eventTarget:eventTarget,pointer:pointer,event:event,type:'hold'});},minDuration);});Interaction.signals.on('up',function(_ref9){var interaction=_ref9.interaction,pointer=_ref9.pointer,event=_ref9.event,eventTarget=_ref9.eventTarget;if(!interaction.pointerWasMoved){fire({interaction:interaction,eventTarget:eventTarget,pointer:pointer,event:event,type:'tap'});}});var _arr=['up','cancel'];for(var _i4=0;_i4<_arr.length;_i4++){var signalName=_arr[_i4];Interaction.signals.on(signalName,function(_ref11){var interaction=_ref11.interaction,pointerIndex=_ref11.pointerIndex;if(interaction.holdTimers[pointerIndex]){clearTimeout(interaction.holdTimers[pointerIndex].timeout);}});}
function createSignalListener(type){return function(_ref10){var interaction=_ref10.interaction,pointer=_ref10.pointer,event=_ref10.event,eventTarget=_ref10.eventTarget;fire({interaction:interaction,eventTarget:eventTarget,pointer:pointer,event:event,type:type});};}
for(var i=0;i<simpleSignals.length;i++){Interaction.signals.on(simpleSignals[i],createSignalListener(simpleEvents[i]));}
Interaction.signals.on('new',function(interaction){interaction.prevTap=null;interaction.tapTime=0;interaction.holdTimers=[];});defaults.pointerEvents=pointerEvents.defaults;module.exports=pointerEvents;},{"../Interaction":5,"../defaultOptions":18,"../utils":44,"../utils/Signals":34,"./PointerEvent":29}],31:[function(require,module,exports){'use strict';var pointerEvents=require('./base');var Interaction=require('../Interaction');pointerEvents.signals.on('new',onNew);pointerEvents.signals.on('fired',onFired);var _arr=['move','up','cancel','endall'];for(var _i=0;_i<_arr.length;_i++){var signal=_arr[_i];Interaction.signals.on(signal,endHoldRepeat);}
function onNew(_ref){var pointerEvent=_ref.pointerEvent;if(pointerEvent.type!=='hold'){return;}
pointerEvent.count=(pointerEvent.count||0)+1;}
function onFired(_ref2){var interaction=_ref2.interaction,pointerEvent=_ref2.pointerEvent,eventTarget=_ref2.eventTarget,targets=_ref2.targets;if(pointerEvent.type!=='hold'||!targets.length){return;}
var interval=targets[0].eventable.options.holdRepeatInterval;if(interval<=0){return;}
interaction.holdIntervalHandle=setTimeout(function(){pointerEvents.fire({interaction:interaction,eventTarget:eventTarget,type:'hold',pointer:pointerEvent,event:pointerEvent});},interval);}
function endHoldRepeat(_ref3){var interaction=_ref3.interaction;if(interaction.holdIntervalHandle){clearInterval(interaction.holdIntervalHandle);interaction.holdIntervalHandle=null;}}
pointerEvents.defaults.holdRepeatInterval=0;pointerEvents.types.push('holdrepeat');module.exports={onNew:onNew,onFired:onFired,endHoldRepeat:endHoldRepeat};},{"../Interaction":5,"./base":30}],32:[function(require,module,exports){'use strict';var pointerEvents=require('./base');var Interactable=require('../Interactable');var is=require('../utils/is');var scope=require('../scope');var extend=require('../utils/extend');var _require=require('../utils/arr'),merge=_require.merge;pointerEvents.signals.on('collect-targets',function(_ref){var targets=_ref.targets,element=_ref.element,type=_ref.type,eventTarget=_ref.eventTarget;scope.interactables.forEachMatch(element,function(interactable){var eventable=interactable.events;var options=eventable.options;if(eventable[type]&&is.element(element)&&interactable.testIgnoreAllow(options,element,eventTarget)){targets.push({element:element,eventable:eventable,props:{interactable:interactable}});}});});Interactable.signals.on('new',function(_ref2){var interactable=_ref2.interactable;interactable.events.getRect=function(element){return interactable.getRect(element);};});Interactable.signals.on('set',function(_ref3){var interactable=_ref3.interactable,options=_ref3.options;extend(interactable.events.options,pointerEvents.defaults);extend(interactable.events.options,options);});merge(Interactable.eventTypes,pointerEvents.types);Interactable.prototype.pointerEvents=function(options){extend(this.events.options,options);return this;};var __backCompatOption=Interactable.prototype._backCompatOption;Interactable.prototype._backCompatOption=function(optionName,newValue){var ret=__backCompatOption.call(this,optionName,newValue);if(ret===this){this.events.options[optionName]=newValue;}
return ret;};Interactable.settingsMethods.push('pointerEvents');},{"../Interactable":4,"../scope":33,"../utils/arr":35,"../utils/extend":41,"../utils/is":46,"./base":30}],33:[function(require,module,exports){'use strict';var utils=require('./utils');var events=require('./utils/events');var signals=require('./utils/Signals').new();var _require=require('./utils/window'),getWindow=_require.getWindow;var scope={signals:signals,events:events,utils:utils,document:require('./utils/domObjects').document,documents:[],addDocument:function addDocument(doc,win){if(utils.contains(scope.documents,doc)){return false;}
win=win||getWindow(doc);scope.documents.push(doc);events.documents.push(doc);if(doc!==scope.document){events.add(win,'unload',scope.onWindowUnload);}
signals.fire('add-document',{doc:doc,win:win});},removeDocument:function removeDocument(doc,win){var index=scope.documents.indexOf(doc);win=win||getWindow(doc);events.remove(win,'unload',scope.onWindowUnload);scope.documents.splice(index,1);events.documents.splice(index,1);signals.fire('remove-document',{win:win,doc:doc});},onWindowUnload:function onWindowUnload(){scope.removeDocument(this.document,this);}};module.exports=scope;},{"./utils":44,"./utils/Signals":34,"./utils/domObjects":38,"./utils/events":40,"./utils/window":52}],34:[function(require,module,exports){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var Signals=function(){function Signals(){_classCallCheck(this,Signals);this.listeners={};}
Signals.prototype.on=function on(name,listener){if(!this.listeners[name]){this.listeners[name]=[listener];return;}
this.listeners[name].push(listener);};Signals.prototype.off=function off(name,listener){if(!this.listeners[name]){return;}
var index=this.listeners[name].indexOf(listener);if(index!==-1){this.listeners[name].splice(index,1);}};Signals.prototype.fire=function fire(name,arg){var targetListeners=this.listeners[name];if(!targetListeners){return;}
for(var _i=0;_i<targetListeners.length;_i++){var _ref;_ref=targetListeners[_i];var listener=_ref;if(listener(arg,name)===false){return;}}};return Signals;}();Signals.new=function(){return new Signals();};module.exports=Signals;},{}],35:[function(require,module,exports){"use strict";function contains(array,target){return array.indexOf(target)!==-1;}
function merge(target,source){for(var _i=0;_i<source.length;_i++){var _ref;_ref=source[_i];var item=_ref;target.push(item);}
return target;}
module.exports={contains:contains,merge:merge};},{}],36:[function(require,module,exports){'use strict';var _require=require('./window'),window=_require.window;var is=require('./is');var domObjects=require('./domObjects');var Element=domObjects.Element;var navigator=window.navigator;var browser={supportsTouch:!!('ontouchstart'in window||is.function(window.DocumentTouch)&&domObjects.document instanceof window.DocumentTouch),supportsPointerEvent:!!domObjects.PointerEvent,isIOS:/iP(hone|od|ad)/.test(navigator.platform),isIOS7:/iP(hone|od|ad)/.test(navigator.platform)&&/OS 7[^\d]/.test(navigator.appVersion),isIe9:/MSIE 9/.test(navigator.userAgent),prefixedMatchesSelector:'matches'in Element.prototype?'matches':'webkitMatchesSelector'in Element.prototype?'webkitMatchesSelector':'mozMatchesSelector'in Element.prototype?'mozMatchesSelector':'oMatchesSelector'in Element.prototype?'oMatchesSelector':'msMatchesSelector',pEventTypes:domObjects.PointerEvent?domObjects.PointerEvent===window.MSPointerEvent?{up:'MSPointerUp',down:'MSPointerDown',over:'mouseover',out:'mouseout',move:'MSPointerMove',cancel:'MSPointerCancel'}:{up:'pointerup',down:'pointerdown',over:'pointerover',out:'pointerout',move:'pointermove',cancel:'pointercancel'}:null,wheelEvent:'onmousewheel'in domObjects.document?'mousewheel':'wheel'};browser.isOperaMobile=navigator.appName==='Opera'&&browser.supportsTouch&&navigator.userAgent.match('Presto');module.exports=browser;},{"./domObjects":38,"./is":46,"./window":52}],37:[function(require,module,exports){'use strict';var is=require('./is');module.exports=function clone(source){var dest={};for(var prop in source){if(is.plainObject(source[prop])){dest[prop]=clone(source[prop]);}else{dest[prop]=source[prop];}}
return dest;};},{"./is":46}],38:[function(require,module,exports){'use strict';var domObjects={};var win=require('./window').window;function blank(){}
domObjects.document=win.document;domObjects.DocumentFragment=win.DocumentFragment||blank;domObjects.SVGElement=win.SVGElement||blank;domObjects.SVGSVGElement=win.SVGSVGElement||blank;domObjects.SVGElementInstance=win.SVGElementInstance||blank;domObjects.Element=win.Element||blank;domObjects.HTMLElement=win.HTMLElement||domObjects.Element;domObjects.Event=win.Event;domObjects.Touch=win.Touch||blank;domObjects.PointerEvent=win.PointerEvent||win.MSPointerEvent;module.exports=domObjects;},{"./window":52}],39:[function(require,module,exports){'use strict';var win=require('./window');var browser=require('./browser');var is=require('./is');var domObjects=require('./domObjects');var domUtils={nodeContains:function nodeContains(parent,child){while(child){if(child===parent){return true;}
child=child.parentNode;}
return false;},closest:function closest(element,selector){while(is.element(element)){if(domUtils.matchesSelector(element,selector)){return element;}
element=domUtils.parentNode(element);}
return null;},parentNode:function parentNode(node){var parent=node.parentNode;if(is.docFrag(parent)){while((parent=parent.host)&&is.docFrag(parent)){continue;}
return parent;}
return parent;},matchesSelector:function matchesSelector(element,selector){if(win.window!==win.realWindow){selector=selector.replace(/\/deep\//g,' ');}
return element[browser.prefixedMatchesSelector](selector);},indexOfDeepestElement:function indexOfDeepestElement(elements){var deepestZoneParents=[];var dropzoneParents=[];var dropzone=void 0;var deepestZone=elements[0];var index=deepestZone?0:-1;var parent=void 0;var child=void 0;var i=void 0;var n=void 0;for(i=1;i<elements.length;i++){dropzone=elements[i];if(!dropzone||dropzone===deepestZone){continue;}
if(!deepestZone){deepestZone=dropzone;index=i;continue;}
if(dropzone.parentNode===dropzone.ownerDocument){continue;}
else if(deepestZone.parentNode===dropzone.ownerDocument){deepestZone=dropzone;index=i;continue;}
if(!deepestZoneParents.length){parent=deepestZone;while(parent.parentNode&&parent.parentNode!==parent.ownerDocument){deepestZoneParents.unshift(parent);parent=parent.parentNode;}}
if(deepestZone instanceof domObjects.HTMLElement&&dropzone instanceof domObjects.SVGElement&&!(dropzone instanceof domObjects.SVGSVGElement)){if(dropzone===deepestZone.parentNode){continue;}
parent=dropzone.ownerSVGElement;}else{parent=dropzone;}
dropzoneParents=[];while(parent.parentNode!==parent.ownerDocument){dropzoneParents.unshift(parent);parent=parent.parentNode;}
n=0;while(dropzoneParents[n]&&dropzoneParents[n]===deepestZoneParents[n]){n++;}
var parents=[dropzoneParents[n-1],dropzoneParents[n],deepestZoneParents[n]];child=parents[0].lastChild;while(child){if(child===parents[1]){deepestZone=dropzone;index=i;deepestZoneParents=[];break;}else if(child===parents[2]){break;}
child=child.previousSibling;}}
return index;},matchesUpTo:function matchesUpTo(element,selector,limit){while(is.element(element)){if(domUtils.matchesSelector(element,selector)){return true;}
element=domUtils.parentNode(element);if(element===limit){return domUtils.matchesSelector(element,selector);}}
return false;},getActualElement:function getActualElement(element){return element instanceof domObjects.SVGElementInstance?element.correspondingUseElement:element;},getScrollXY:function getScrollXY(relevantWindow){relevantWindow=relevantWindow||win.window;return{x:relevantWindow.scrollX||relevantWindow.document.documentElement.scrollLeft,y:relevantWindow.scrollY||relevantWindow.document.documentElement.scrollTop};},getElementClientRect:function getElementClientRect(element){var clientRect=element instanceof domObjects.SVGElement?element.getBoundingClientRect():element.getClientRects()[0];return clientRect&&{left:clientRect.left,right:clientRect.right,top:clientRect.top,bottom:clientRect.bottom,width:clientRect.width||clientRect.right-clientRect.left,height:clientRect.height||clientRect.bottom-clientRect.top};},getElementRect:function getElementRect(element){var clientRect=domUtils.getElementClientRect(element);if(!browser.isIOS7&&clientRect){var scroll=domUtils.getScrollXY(win.getWindow(element));clientRect.left+=scroll.x;clientRect.right+=scroll.x;clientRect.top+=scroll.y;clientRect.bottom+=scroll.y;}
return clientRect;},getPath:function getPath(element){var path=[];while(element){path.push(element);element=domUtils.parentNode(element);}
return path;},trySelector:function trySelector(value){if(!is.string(value)){return false;}
domObjects.document.querySelector(value);return true;}};module.exports=domUtils;},{"./browser":36,"./domObjects":38,"./is":46,"./window":52}],40:[function(require,module,exports){'use strict';var is=require('./is');var domUtils=require('./domUtils');var pointerUtils=require('./pointerUtils');var pExtend=require('./pointerExtend');var _require=require('./window'),window=_require.window;var _require2=require('./arr'),contains=_require2.contains;var elements=[];var targets=[];var delegatedEvents={};var documents=[];var supportsOptions=function(){var supported=false;window.document.createElement('div').addEventListener('test',null,{get capture(){supported=true;}});return supported;}();function add(element,type,listener,optionalArg){var options=getOptions(optionalArg);var elementIndex=elements.indexOf(element);var target=targets[elementIndex];if(!target){target={events:{},typeCount:0};elementIndex=elements.push(element)-1;targets.push(target);}
if(!target.events[type]){target.events[type]=[];target.typeCount++;}
if(!contains(target.events[type],listener)){element.addEventListener(type,listener,supportsOptions?options:!!options.capture);target.events[type].push(listener);}}
function remove(element,type,listener,optionalArg){var options=getOptions(optionalArg);var elementIndex=elements.indexOf(element);var target=targets[elementIndex];if(!target||!target.events){return;}
if(type==='all'){for(type in target.events){if(target.events.hasOwnProperty(type)){remove(element,type,'all');}}
return;}
if(target.events[type]){var len=target.events[type].length;if(listener==='all'){for(var i=0;i<len;i++){remove(element,type,target.events[type][i],options);}
return;}else{for(var _i=0;_i<len;_i++){if(target.events[type][_i]===listener){element.removeEventListener('on'+type,listener,supportsOptions?options:!!options.capture);target.events[type].splice(_i,1);break;}}}
if(target.events[type]&&target.events[type].length===0){target.events[type]=null;target.typeCount--;}}
if(!target.typeCount){targets.splice(elementIndex,1);elements.splice(elementIndex,1);}}
function addDelegate(selector,context,type,listener,optionalArg){var options=getOptions(optionalArg);if(!delegatedEvents[type]){delegatedEvents[type]={selectors:[],contexts:[],listeners:[]};for(var _i2=0;_i2<documents.length;_i2++){var doc=documents[_i2];add(doc,type,delegateListener);add(doc,type,delegateUseCapture,true);}}
var delegated=delegatedEvents[type];var index=void 0;for(index=delegated.selectors.length-1;index>=0;index--){if(delegated.selectors[index]===selector&&delegated.contexts[index]===context){break;}}
if(index===-1){index=delegated.selectors.length;delegated.selectors.push(selector);delegated.contexts.push(context);delegated.listeners.push([]);}
delegated.listeners[index].push([listener,!!options.capture,options.passive]);}
function removeDelegate(selector,context,type,listener,optionalArg){var options=getOptions(optionalArg);var delegated=delegatedEvents[type];var matchFound=false;var index=void 0;if(!delegated){return;}
for(index=delegated.selectors.length-1;index>=0;index--){if(delegated.selectors[index]===selector&&delegated.contexts[index]===context){var listeners=delegated.listeners[index];for(var i=listeners.length-1;i>=0;i--){var _listeners$i=listeners[i],fn=_listeners$i[0],capture=_listeners$i[1],passive=_listeners$i[2];if(fn===listener&&capture===!!options.capture&&passive===options.passive){listeners.splice(i,1);if(!listeners.length){delegated.selectors.splice(index,1);delegated.contexts.splice(index,1);delegated.listeners.splice(index,1);remove(context,type,delegateListener);remove(context,type,delegateUseCapture,true);if(!delegated.selectors.length){delegatedEvents[type]=null;}}
matchFound=true;break;}}
if(matchFound){break;}}}}
function delegateListener(event,optionalArg){var options=getOptions(optionalArg);var fakeEvent={};var delegated=delegatedEvents[event.type];var _pointerUtils$getEven=pointerUtils.getEventTargets(event),eventTarget=_pointerUtils$getEven[0];var element=eventTarget;pExtend(fakeEvent,event);fakeEvent.originalEvent=event;fakeEvent.preventDefault=preventOriginalDefault;while(is.element(element)){for(var i=0;i<delegated.selectors.length;i++){var selector=delegated.selectors[i];var context=delegated.contexts[i];if(domUtils.matchesSelector(element,selector)&&domUtils.nodeContains(context,eventTarget)&&domUtils.nodeContains(context,element)){var listeners=delegated.listeners[i];fakeEvent.currentTarget=element;for(var j=0;j<listeners.length;j++){var _listeners$j=listeners[j],fn=_listeners$j[0],capture=_listeners$j[1],passive=_listeners$j[2];if(capture===!!options.capture&&passive===options.passive){fn(fakeEvent);}}}}
element=domUtils.parentNode(element);}}
function delegateUseCapture(event){return delegateListener.call(this,event,true);}
function preventOriginalDefault(){this.originalEvent.preventDefault();}
function getOptions(param){return is.object(param)?param:{capture:param};}
module.exports={add:add,remove:remove,addDelegate:addDelegate,removeDelegate:removeDelegate,delegateListener:delegateListener,delegateUseCapture:delegateUseCapture,delegatedEvents:delegatedEvents,documents:documents,supportsOptions:supportsOptions,_elements:elements,_targets:targets};},{"./arr":35,"./domUtils":39,"./is":46,"./pointerExtend":48,"./pointerUtils":49,"./window":52}],41:[function(require,module,exports){"use strict";module.exports=function extend(dest,source){for(var prop in source){dest[prop]=source[prop];}
return dest;};},{}],42:[function(require,module,exports){'use strict';var _require=require('./rect'),resolveRectLike=_require.resolveRectLike,rectToXY=_require.rectToXY;module.exports=function(target,element,action){var actionOptions=target.options[action];var actionOrigin=actionOptions&&actionOptions.origin;var origin=actionOrigin||target.options.origin;var originRect=resolveRectLike(origin,target,element,[target&&element]);return rectToXY(originRect)||{x:0,y:0};};},{"./rect":51}],43:[function(require,module,exports){"use strict";module.exports=function(x,y){return Math.sqrt(x*x+y*y);};},{}],44:[function(require,module,exports){'use strict';var extend=require('./extend');var win=require('./window');var utils={warnOnce:function warnOnce(method,message){var warned=false;return function(){if(!warned){win.window.console.warn(message);warned=true;}
return method.apply(this,arguments);};},_getQBezierValue:function _getQBezierValue(t,p1,p2,p3){var iT=1-t;return iT*iT*p1+2*iT*t*p2+t*t*p3;},getQuadraticCurvePoint:function getQuadraticCurvePoint(startX,startY,cpX,cpY,endX,endY,position){return{x:utils._getQBezierValue(position,startX,cpX,endX),y:utils._getQBezierValue(position,startY,cpY,endY)};},easeOutQuad:function easeOutQuad(t,b,c,d){t/=d;return-c*t*(t-2)+b;},copyAction:function copyAction(dest,src){dest.name=src.name;dest.axis=src.axis;dest.edges=src.edges;return dest;},is:require('./is'),extend:extend,hypot:require('./hypot'),getOriginXY:require('./getOriginXY')};extend(utils,require('./arr'));extend(utils,require('./domUtils'));extend(utils,require('./pointerUtils'));extend(utils,require('./rect'));module.exports=utils;},{"./arr":35,"./domUtils":39,"./extend":41,"./getOriginXY":42,"./hypot":43,"./is":46,"./pointerUtils":49,"./rect":51,"./window":52}],45:[function(require,module,exports){'use strict';var scope=require('../scope');var utils=require('./index');var finder={methodOrder:['simulationResume','mouseOrPen','hasPointer','idle'],search:function search(pointer,eventType,eventTarget){var pointerType=utils.getPointerType(pointer);var pointerId=utils.getPointerId(pointer);var details={pointer:pointer,pointerId:pointerId,pointerType:pointerType,eventType:eventType,eventTarget:eventTarget};for(var _i=0;_i<finder.methodOrder.length;_i++){var _ref;_ref=finder.methodOrder[_i];var method=_ref;var interaction=finder[method](details);if(interaction){return interaction;}}},simulationResume:function simulationResume(_ref2){var pointerType=_ref2.pointerType,eventType=_ref2.eventType,eventTarget=_ref2.eventTarget;if(!/down|start/i.test(eventType)){return null;}
for(var _i2=0;_i2<scope.interactions.length;_i2++){var _ref3;_ref3=scope.interactions[_i2];var interaction=_ref3;var element=eventTarget;if(interaction.simulation&&interaction.simulation.allowResume&&interaction.pointerType===pointerType){while(element){if(element===interaction.element){return interaction;}
element=utils.parentNode(element);}}}
return null;},mouseOrPen:function mouseOrPen(_ref4){var pointerId=_ref4.pointerId,pointerType=_ref4.pointerType,eventType=_ref4.eventType;if(pointerType!=='mouse'&&pointerType!=='pen'){return null;}
var firstNonActive=void 0;for(var _i3=0;_i3<scope.interactions.length;_i3++){var _ref5;_ref5=scope.interactions[_i3];var interaction=_ref5;if(interaction.pointerType===pointerType){if(interaction.simulation&&!utils.contains(interaction.pointerIds,pointerId)){continue;}
if(interaction.interacting()){return interaction;}
else if(!firstNonActive){firstNonActive=interaction;}}}
if(firstNonActive){return firstNonActive;}
for(var _i4=0;_i4<scope.interactions.length;_i4++){var _ref6;_ref6=scope.interactions[_i4];var _interaction=_ref6;if(_interaction.pointerType===pointerType&&!(/down/i.test(eventType)&&_interaction.simulation)){return _interaction;}}
return null;},hasPointer:function hasPointer(_ref7){var pointerId=_ref7.pointerId;for(var _i5=0;_i5<scope.interactions.length;_i5++){var _ref8;_ref8=scope.interactions[_i5];var interaction=_ref8;if(utils.contains(interaction.pointerIds,pointerId)){return interaction;}}},idle:function idle(_ref9){var pointerType=_ref9.pointerType;for(var _i6=0;_i6<scope.interactions.length;_i6++){var _ref10;_ref10=scope.interactions[_i6];var interaction=_ref10;if(interaction.pointerIds.length===1){var target=interaction.target;if(target&&!target.options.gesture.enabled){continue;}}
else if(interaction.pointerIds.length>=2){continue;}
if(!interaction.interacting()&&pointerType===interaction.pointerType){return interaction;}}
return null;}};module.exports=finder;},{"../scope":33,"./index":44}],46:[function(require,module,exports){'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};var win=require('./window');var isWindow=require('./isWindow');var is={array:function array(){},window:function window(thing){return thing===win.window||isWindow(thing);},docFrag:function docFrag(thing){return is.object(thing)&&thing.nodeType===11;},object:function object(thing){return!!thing&&(typeof thing==='undefined'?'undefined':_typeof(thing))==='object';},function:function _function(thing){return typeof thing==='function';},number:function number(thing){return typeof thing==='number';},bool:function bool(thing){return typeof thing==='boolean';},string:function string(thing){return typeof thing==='string';},element:function element(thing){if(!thing||(typeof thing==='undefined'?'undefined':_typeof(thing))!=='object'){return false;}
var _window=win.getWindow(thing)||win.window;return(/object|function/.test(_typeof(_window.Element))?thing instanceof _window.Element:thing.nodeType===1&&typeof thing.nodeName==='string');},plainObject:function plainObject(thing){return is.object(thing)&&thing.constructor.name==='Object';}};is.array=function(thing){return is.object(thing)&&typeof thing.length!=='undefined'&&is.function(thing.splice);};module.exports=is;},{"./isWindow":47,"./window":52}],47:[function(require,module,exports){"use strict";module.exports=function(thing){return!!(thing&&thing.Window)&&thing instanceof thing.Window;};},{}],48:[function(require,module,exports){'use strict';function pointerExtend(dest,source){for(var prop in source){var prefixedPropREs=module.exports.prefixedPropREs;var deprecated=false;for(var vendor in prefixedPropREs){if(prop.indexOf(vendor)===0&&prefixedPropREs[vendor].test(prop)){deprecated=true;break;}}
if(!deprecated&&typeof source[prop]!=='function'){dest[prop]=source[prop];}}
return dest;}
pointerExtend.prefixedPropREs={webkit:/(Movement[XY]|Radius[XY]|RotationAngle|Force)$/};module.exports=pointerExtend;},{}],49:[function(require,module,exports){'use strict';var hypot=require('./hypot');var browser=require('./browser');var dom=require('./domObjects');var domUtils=require('./domUtils');var domObjects=require('./domObjects');var is=require('./is');var pointerExtend=require('./pointerExtend');var pointerUtils={copyCoords:function copyCoords(dest,src){dest.page=dest.page||{};dest.page.x=src.page.x;dest.page.y=src.page.y;dest.client=dest.client||{};dest.client.x=src.client.x;dest.client.y=src.client.y;dest.timeStamp=src.timeStamp;},setCoordDeltas:function setCoordDeltas(targetObj,prev,cur){targetObj.page.x=cur.page.x-prev.page.x;targetObj.page.y=cur.page.y-prev.page.y;targetObj.client.x=cur.client.x-prev.client.x;targetObj.client.y=cur.client.y-prev.client.y;targetObj.timeStamp=cur.timeStamp-prev.timeStamp;var dt=Math.max(targetObj.timeStamp/1000,0.001);targetObj.page.speed=hypot(targetObj.page.x,targetObj.page.y)/dt;targetObj.page.vx=targetObj.page.x/dt;targetObj.page.vy=targetObj.page.y/dt;targetObj.client.speed=hypot(targetObj.client.x,targetObj.page.y)/dt;targetObj.client.vx=targetObj.client.x/dt;targetObj.client.vy=targetObj.client.y/dt;},isNativePointer:function isNativePointer(pointer){return pointer instanceof dom.Event||pointer instanceof dom.Touch;},getXY:function getXY(type,pointer,xy){xy=xy||{};type=type||'page';xy.x=pointer[type+'X'];xy.y=pointer[type+'Y'];return xy;},getPageXY:function getPageXY(pointer,page){page=page||{};if(browser.isOperaMobile&&pointerUtils.isNativePointer(pointer)){pointerUtils.getXY('screen',pointer,page);page.x+=window.scrollX;page.y+=window.scrollY;}else{pointerUtils.getXY('page',pointer,page);}
return page;},getClientXY:function getClientXY(pointer,client){client=client||{};if(browser.isOperaMobile&&pointerUtils.isNativePointer(pointer)){pointerUtils.getXY('screen',pointer,client);}else{pointerUtils.getXY('client',pointer,client);}
return client;},getPointerId:function getPointerId(pointer){return is.number(pointer.pointerId)?pointer.pointerId:pointer.identifier;},setCoords:function setCoords(targetObj,pointers,timeStamp){var pointer=pointers.length>1?pointerUtils.pointerAverage(pointers):pointers[0];var tmpXY={};pointerUtils.getPageXY(pointer,tmpXY);targetObj.page.x=tmpXY.x;targetObj.page.y=tmpXY.y;pointerUtils.getClientXY(pointer,tmpXY);targetObj.client.x=tmpXY.x;targetObj.client.y=tmpXY.y;targetObj.timeStamp=is.number(timeStamp)?timeStamp:new Date().getTime();},pointerExtend:pointerExtend,getTouchPair:function getTouchPair(event){var touches=[];if(is.array(event)){touches[0]=event[0];touches[1]=event[1];}
else{if(event.type==='touchend'){if(event.touches.length===1){touches[0]=event.touches[0];touches[1]=event.changedTouches[0];}else if(event.touches.length===0){touches[0]=event.changedTouches[0];touches[1]=event.changedTouches[1];}}else{touches[0]=event.touches[0];touches[1]=event.touches[1];}}
return touches;},pointerAverage:function pointerAverage(pointers){var average={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0};for(var _i=0;_i<pointers.length;_i++){var _ref;_ref=pointers[_i];var pointer=_ref;for(var _prop in average){average[_prop]+=pointer[_prop];}}
for(var prop in average){average[prop]/=pointers.length;}
return average;},touchBBox:function touchBBox(event){if(!event.length&&!(event.touches&&event.touches.length>1)){return;}
var touches=pointerUtils.getTouchPair(event);var minX=Math.min(touches[0].pageX,touches[1].pageX);var minY=Math.min(touches[0].pageY,touches[1].pageY);var maxX=Math.max(touches[0].pageX,touches[1].pageX);var maxY=Math.max(touches[0].pageY,touches[1].pageY);return{x:minX,y:minY,left:minX,top:minY,width:maxX-minX,height:maxY-minY};},touchDistance:function touchDistance(event,deltaSource){var sourceX=deltaSource+'X';var sourceY=deltaSource+'Y';var touches=pointerUtils.getTouchPair(event);var dx=touches[0][sourceX]-touches[1][sourceX];var dy=touches[0][sourceY]-touches[1][sourceY];return hypot(dx,dy);},touchAngle:function touchAngle(event,prevAngle,deltaSource){var sourceX=deltaSource+'X';var sourceY=deltaSource+'Y';var touches=pointerUtils.getTouchPair(event);var dx=touches[1][sourceX]-touches[0][sourceX];var dy=touches[1][sourceY]-touches[0][sourceY];var angle=180*Math.atan2(dy,dx)/Math.PI;return angle;},getPointerType:function getPointerType(pointer){return is.string(pointer.pointerType)?pointer.pointerType:is.number(pointer.pointerType)?[undefined,undefined,'touch','pen','mouse'][pointer.pointerType]
:/touch/.test(pointer.type)||pointer instanceof domObjects.Touch?'touch':'mouse';},getEventTargets:function getEventTargets(event){var path=is.function(event.composedPath)?event.composedPath():event.path;return[domUtils.getActualElement(path?path[0]:event.target),domUtils.getActualElement(event.currentTarget)];}};module.exports=pointerUtils;},{"./browser":36,"./domObjects":38,"./domUtils":39,"./hypot":43,"./is":46,"./pointerExtend":48}],50:[function(require,module,exports){'use strict';var _require=require('./window'),window=_require.window;var vendors=['ms','moz','webkit','o'];var lastTime=0;var request=void 0;var cancel=void 0;for(var x=0;x<vendors.length&&!window.requestAnimationFrame;x++){request=window[vendors[x]+'RequestAnimationFrame'];cancel=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame'];}
if(!request){request=function request(callback){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=setTimeout(function(){callback(currTime+timeToCall);},timeToCall);lastTime=currTime+timeToCall;return id;};}
if(!cancel){cancel=function cancel(id){clearTimeout(id);};}
module.exports={request:request,cancel:cancel};},{"./window":52}],51:[function(require,module,exports){'use strict';var extend=require('./extend');var is=require('./is');var _require=require('./domUtils'),closest=_require.closest,parentNode=_require.parentNode,getElementRect=_require.getElementRect;var rectUtils={getStringOptionResult:function getStringOptionResult(value,interactable,element){if(!is.string(value)){return null;}
if(value==='parent'){value=parentNode(element);}else if(value==='self'){value=interactable.getRect(element);}else{value=closest(element,value);}
return value;},resolveRectLike:function resolveRectLike(value,interactable,element,functionArgs){value=rectUtils.getStringOptionResult(value,interactable,element)||value;if(is.function(value)){value=value.apply(null,functionArgs);}
if(is.element(value)){value=getElementRect(value);}
return value;},rectToXY:function rectToXY(rect){return rect&&{x:'x'in rect?rect.x:rect.left,y:'y'in rect?rect.y:rect.top};},xywhToTlbr:function xywhToTlbr(rect){if(rect&&!('left'in rect&&'top'in rect)){rect=extend({},rect);rect.left=rect.x||0;rect.top=rect.y||0;rect.right=rect.right||rect.left+rect.width;rect.bottom=rect.bottom||rect.top+rect.height;}
return rect;},tlbrToXywh:function tlbrToXywh(rect){if(rect&&!('x'in rect&&'y'in rect)){rect=extend({},rect);rect.x=rect.left||0;rect.top=rect.top||0;rect.width=rect.width||rect.right-rect.x;rect.height=rect.height||rect.bottom-rect.y;}
return rect;}};module.exports=rectUtils;},{"./domUtils":39,"./extend":41,"./is":46}],52:[function(require,module,exports){'use strict';var win=module.exports;var isWindow=require('./isWindow');function init(window){win.realWindow=window;var el=window.document.createTextNode('');if(el.ownerDocument!==window.document&&typeof window.wrap==='function'&&window.wrap(el)===el){window=window.wrap(window);}
win.window=window;}
if(typeof window==='undefined'){win.window=undefined;win.realWindow=undefined;}else{init(window);}
win.getWindow=function getWindow(node){if(isWindow(node)){return node;}
var rootNode=node.ownerDocument||node;return rootNode.defaultView||rootNode.parentWindow||win.window;};win.init=init;},{"./isWindow":47}]},{},[1])(1)});$(function(){var csrftoken=$('meta[name=csrf-token]').attr('content')
$.ajaxSetup({beforeSend:function(xhr,settings){if(!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)&&!this.crossDomain){xhr.setRequestHeader("X-CSRFToken",csrftoken)}}})
$(function(){var hash=window.location.hash;hash&&$('ul.nav a[href="'+hash+'"]').tab('show');$('.nav-tabs a').click(function(e){$(this).tab('show');window.location.hash=this.hash;$(window).scrollTop(0);});});$(".tagsinput").tagsinput({tagClass:"label label-default",trimValue:true});$('.tagsinput').on('itemAdded',function(event){var data=JSON.stringify([]);if($(this).val()!=null)
data=JSON.stringify($(this).tagsinput('items'));$.ajax({url:$(this).data('uri'),contentType:"application/json",data:data,dataType:"json",type:"POST"}).done(function(data,textStatus,jqXHR){console.log(jqXHR.status);})});$('.tagsinput').on('itemRemoved',function(event){var data=JSON.stringify([]);if($(this).val()!=null)
data=JSON.stringify($(this).tagsinput('items'));$.ajax({url:$(this).data('uri'),contentType:"application/json",data:data,dataType:"json",type:"POST"}).done(function(data,textStatus,jqXHR){console.log(jqXHR.status);})});$('.glyphicon-trash').on('click',function(event){var tr=$(this).parents('tr');$.ajax({url:$(this).data('uri'),contentType:"application/json",type:"DELETE"}).done(function(data,textStatus,jqXHR){$(tr).remove();console.log(jqXHR.status);})})
$('.activate-node').on('click',function(event){if($(this).data('uri')==null||$(this).data('uri')=="")
return;var el=$(this);$.post($(this).data('uri'),{is_active:$(this).hasClass('glyphicon-unchecked')||null}).done(function(data,textStatus,jqXHR){$(el).toggleClass('glyphicon-check glyphicon-unchecked');});})
$('body').scrollspy({target:'.bs-docs-sidebar',offset:70})
$('#sidebar').affix({offset:{top:0}})
var $queryBuilder=$('#query-builder');if($queryBuilder.length){var QueryBuilder=$.fn.queryBuilder.constructor;var SUPPORTED_OPERATOR_NAMES=['equal','not_equal','begins_with','not_begins_with','contains','not_contains','ends_with','not_ends_with','is_empty','is_not_empty','less','less_or_equal','greater','greater_or_equal',];var SUPPORTED_OPERATORS=SUPPORTED_OPERATOR_NAMES.map(function(operator){return QueryBuilder.OPERATORS[operator];});var COLUMN_OPERATORS=SUPPORTED_OPERATOR_NAMES.map(function(operator){return{type:'column_'+operator,nb_inputs:QueryBuilder.OPERATORS[operator].nb_inputs+1,multiple:true,apply_to:['string'],};});var SUPPORTED_COLUMN_OPERATORS=SUPPORTED_OPERATOR_NAMES.map(function(operator){return'column_'+operator;});var CUSTOM_LANG={};SUPPORTED_OPERATOR_NAMES.forEach(function(op){CUSTOM_LANG['column_'+op]=QueryBuilder.regional.en.operators[op];});Array.prototype.push.apply(SUPPORTED_OPERATOR_NAMES,['matches_regex','not_matches_regex']);Array.prototype.push.apply(SUPPORTED_OPERATORS,[{type:'matches_regex',nb_inputs:1,multiple:true,apply_to:['string'],},{type:'not_matches_regex',nb_inputs:1,multiple:true,apply_to:['string'],},]);CUSTOM_LANG['matches_regex']='matches regex';CUSTOM_LANG['not_matches_regex']="doesn't match regex";Array.prototype.push.apply(SUPPORTED_COLUMN_OPERATORS,['column_matches_regex','column_not_matches_regex']);Array.prototype.push.apply(COLUMN_OPERATORS,[{type:'column_matches_regex',nb_inputs:2,multiple:true,apply_to:['string'],},{type:'column_not_matches_regex',nb_inputs:2,multiple:true,apply_to:['string'],},]);CUSTOM_LANG['column_matches_regex']='matches regex';CUSTOM_LANG['column_not_matches_regex']="doesn't match regex";var existingRules;try{var v=$('#rules-hidden').val();if(v){existingRules=JSON.parse(v);}}catch(e){}
$queryBuilder.queryBuilder({filters:[{id:'query_name',type:'string',label:'Query Name',operators:SUPPORTED_OPERATOR_NAMES,},{id:'action',type:'string',label:'Action',operators:SUPPORTED_OPERATOR_NAMES,},{id:'host_identifier',type:'string',label:'Host Identifier',operators:SUPPORTED_OPERATOR_NAMES,},{id:'timestamp',type:'integer',label:'Timestamp',operators:SUPPORTED_OPERATOR_NAMES,},{id:'column',type:'string',label:'Column',operators:SUPPORTED_COLUMN_OPERATORS,placeholder:'value',},],operators:SUPPORTED_OPERATORS.concat(COLUMN_OPERATORS),lang:{operators:CUSTOM_LANG,},plugins:{'bt-tooltip-errors':{delay:100,placement:'bottom',},'sortable':{icon:'glyphicon glyphicon-move',},},rules:existingRules,});$queryBuilder.on('getRuleInput.queryBuilder.filter',function(evt,rule,name){if(rule.operator.type.match(/^column_/)&&name.match(/value_0$/)){var el=$(evt.value);$(el).attr('placeholder','column name');;evt.value=el[0].outerHTML;}});$('#submit-button').on('click',function(e){var $builder=$queryBuilder;if(!$builder){return true;}
if(!$builder.queryBuilder('validate')){e.preventDefault();return false;}
var rules=JSON.stringify($builder.queryBuilder('getRules'));$('#rules-hidden').val(rules);return true;});}})