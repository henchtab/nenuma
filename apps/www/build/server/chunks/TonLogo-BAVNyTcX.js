import { e as rest_props, v as value_or_fallback, t as copy_payload, w as assign_payload, j as bind_props, p as push, d as store_get, n as escape_html, u as unsubscribe_stores, b as pop, l as spread_props, i as slot, h as spread_attributes, o as sanitize_props, s as setContext, q as getContext, x as store_set, y as element } from './index3-C3tkxEZ9.js';
import { c as createBitAttrs, o as omit$1, w as withGet, m as makeElement, e as executeCallbacks, a as addMeltEventListener, k as kbd, s as styleToString$1, u as useEscapeKeydown, b as effect$1, p as portalAttr, d as createElHelpers, i as isHTMLElement$1, n as noop$1, f as isBrowser$1, g as isFunction, h as addEventListener$1, j as isElement } from './index4-oP-Y0xSz.js';
import { r as readable, d as derived, g as get, w as writable, a as readonly } from './index2-d8GdKNTl.js';
import { d as default_slot } from './misc-DisFbBK1.js';
import { c as cn } from './utils-Cu53aTbv.js';
import { i as isConnected, o as onDestroy, b as tick } from './ton-connect-Dy4dENFp.js';
import { r as removeUndefined$1, g as getOptionUpdater$1, t as toWritableStores$1, o as overridable$1 } from './updater-CjQ7rtaE.js';
import { c as createQuery, g as generateIds, l as last } from './shorten-address-DPX50Icu.js';
import { s as sleep$1 } from './sleep-CMjvr8cL.js';
import 'clsx';
import { A as ACCESS_TOKEN_COOKIE } from './constants-YcxnLy9M.js';
import './tma-DWgLwTMy.js';
import './_sentry-release-injection-file-DnBzmPpn.js';
import { I as Icon } from './Icon-DC-Mh-BG.js';
import { P as PUBLIC_API_URL } from './public-BbnfBXYT.js';
import cookie from 'js-cookie';

/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
// NOTE: separate `:not()` selectors has broader browser support than the newer
//  `:not([inert], [inert] *)` (Feb 2023)
// CAREFUL: JSDom does not support `:not([inert] *)` as a selector; using it causes
//  the entire query to fail, resulting in no nodes found, which will break a lot
//  of things... so we have to rely on JS to identify nodes inside an inert container
var candidateSelectors = ['input:not([inert])', 'select:not([inert])', 'textarea:not([inert])', 'a[href]:not([inert])', 'button:not([inert])', '[tabindex]:not(slot):not([inert])', 'audio[controls]:not([inert])', 'video[controls]:not([inert])', '[contenteditable]:not([contenteditable="false"]):not([inert])', 'details>summary:first-of-type:not([inert])', 'details:not([inert])'];
var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
var NoElement = typeof Element === 'undefined';
var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function (element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};

/**
 * Determines if a node is inert or in an inert ancestor.
 * @param {Element} [node]
 * @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
 *  see if any of them are inert. If false, only `node` itself is considered.
 * @returns {boolean} True if inert itself or by way of being in an inert ancestor.
 *  False if `node` is falsy.
 */
var isInert = function isInert(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
  //  JS API property; we have to check the attribute, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's an active element
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, 'inert');
  var inert = inertAtt === '' || inertAtt === 'true';

  // NOTE: this could also be handled with `node.matches('[inert], :is([inert] *)')`
  //  if it weren't for `matches()` not being a function on shadow roots; the following
  //  code works for any kind of node
  // CAREFUL: JSDom does not appear to support certain selectors like `:not([inert] *)`
  //  so it likely would not support `:is([inert] *)` either...
  var result = inert || lookUp && node && isInert(node.parentNode); // recursive

  return result;
};

/**
 * Determines if a node's content is editable.
 * @param {Element} [node]
 * @returns True if it's content-editable; false if it's not or `node` is falsy.
 */
var isContentEditable = function isContentEditable(node) {
  var _node$getAttribute2;
  // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
  //  to use the attribute directly to check for this, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's a non-editable element
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
  return attValue === '' || attValue === 'true';
};

/**
 * @param {Element} el container to check in
 * @param {boolean} includeContainer add container to check
 * @param {(node: Element) => boolean} filter filter candidates
 * @returns {Element[]}
 */
var getCandidates = function getCandidates(el, includeContainer, filter) {
  // even if `includeContainer=false`, we still have to check it for inertness because
  //  if it's inert, all its children are inert
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};

/**
 * @callback GetShadowRoot
 * @param {Element} element to check for shadow root
 * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
 */

/**
 * @callback ShadowRootFilter
 * @param {Element} shadowHostNode the element which contains shadow content
 * @returns {boolean} true if a shadow root could potentially contain valid candidates.
 */

/**
 * @typedef {Object} CandidateScope
 * @property {Element} scopeParent contains inner candidates
 * @property {Element[]} candidates list of candidates found in the scope parent
 */

/**
 * @typedef {Object} IterativeOptions
 * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
 *  if a function, implies shadow support is enabled and either returns the shadow root of an element
 *  or a boolean stating if it has an undisclosed shadow root
 * @property {(node: Element) => boolean} filter filter candidates
 * @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
 * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
 */

/**
 * @param {Element[]} elements list of element containers to match candidates from
 * @param {boolean} includeContainer add container list to check
 * @param {IterativeOptions} options
 * @returns {Array.<Element|CandidateScope>}
 */
var getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      // no need to look up since we're drilling down
      // anything inside this container will also be inert
      continue;
    }
    if (element.tagName === 'SLOT') {
      // add shadow dom slot scope (slot itself cannot be focusable)
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      // check candidate element
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }

      // iterate over shadow content if possible
      var shadowRoot = element.shadowRoot ||
      // check for an undisclosed shadow
      typeof options.getShadowRoot === 'function' && options.getShadowRoot(element);

      // no inert look up because we're already drilling down and checking for inertness
      //  on the way down, so all containers to this root node should have already been
      //  vetted as non-inert
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
        //  shadow exists, so look at light dom children as fallback BUT create a scope for any
        //  child candidates found because they're likely slotted elements (elements that are
        //  children of the web component element (which has the shadow), in the light dom, but
        //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
        //  _after_ we return from this recursive call
        var _nestedCandidates = getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        // there's not shadow so just dig into the element's (light dom) children
        //  __without__ giving the element special scope treatment
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};

/**
 * @private
 * Determines if the node has an explicitly specified `tabindex` attribute.
 * @param {HTMLElement} node
 * @returns {boolean} True if so; false if not.
 */
var hasTabIndex = function hasTabIndex(node) {
  return !isNaN(parseInt(node.getAttribute('tabindex'), 10));
};

/**
 * Determine the tab index of a given node.
 * @param {HTMLElement} node
 * @returns {number} Tab order (negative, 0, or positive number).
 * @throws {Error} If `node` is falsy.
 */
var getTabIndex = function getTabIndex(node) {
  if (!node) {
    throw new Error('No node provided');
  }
  if (node.tabIndex < 0) {
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    // yet they are still part of the regular tab order; in FF, they get a default
    // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    // order, consider their tab index to be 0.
    // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};

/**
 * Determine the tab index of a given node __for sort order purposes__.
 * @param {HTMLElement} node
 * @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
 *  has tabIndex -1, but needs to be sorted by document order in order for its content to be
 *  inserted into the correct sort position.
 * @returns {number} Tab order (negative, 0, or positive number).
 */
var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput$1 = function isInput(node) {
  return node.tagName === 'INPUT';
};
var isHiddenInput = function isHiddenInput(node) {
  return isInput$1(node) && node.type === 'hidden';
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
  var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
    return child.tagName === 'SUMMARY';
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio(node) {
  return isInput$1(node) && node.type === 'radio';
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
};

// determines if a node is ultimately attached to the window's document
var isNodeAttached = function isNodeAttached(node) {
  var _nodeRoot;
  // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
  //  (but NOT _the_ document; see second 'If' comment below for more).
  // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
  //  is attached, and the one we need to check if it's in the document or not (because the
  //  shadow, and all nodes it contains, is never considered in the document since shadows
  //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
  //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
  //  visibility, including all the nodes it contains). The host could be any normal node,
  //  or a custom element (i.e. web component). Either way, that's the one that is considered
  //  part of the document, not the shadow root, nor any of its children (i.e. the node being
  //  tested).
  // To further complicate things, we have to look all the way up until we find a shadow HOST
  //  that is attached (or find none) because the node might be in nested shadows...
  // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
  //  document (per the docs) and while it's a Document-type object, that document does not
  //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
  //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
  //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
  //  node is actually detached.
  // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
  //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
  //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
  //  `ownerDocument` will be `null`, hence the optional chaining on it.
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

  // in some cases, a detached node will return itself as the root instead of a document or
  //  shadow root object, in which case, we shouldn't try to look further up the host chain
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
      //  which means we need to get the host's host and check if that parent host is contained
      //  in (i.e. attached to) the document
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(),
    width = _node$getBoundingClie.width,
    height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
  var displayCheck = _ref.displayCheck,
    getShadowRoot = _ref.getShadowRoot;
  // NOTE: visibility will be `undefined` if node is detached from the document
  //  (see notes about this further down), which means we will consider it visible
  //  (this is legacy behavior from a very long way back)
  // NOTE: we check this regardless of `displayCheck="none"` because this is a
  //  _visibility_ check, not a _display_ check
  if (getComputedStyle(node).visibility === 'hidden') {
    return true;
  }
  var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
    return true;
  }
  if (!displayCheck || displayCheck === 'full' || displayCheck === 'legacy-full') {
    if (typeof getShadowRoot === 'function') {
      // figure out if we should consider the node to be in an undisclosed shadow and use the
      //  'non-zero-area' fallback
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
        ) {
          // node has an undisclosed shadow which means we can only treat it as a black box, so we
          //  fall back to a non-zero-area test
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          // iterate up slot
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          // cross shadow boundary
          node = rootNode.host;
        } else {
          // iterate up normal dom
          node = parentElement;
        }
      }
      node = originalNode;
    }
    // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
    //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
    //  it might be a falsy value, which means shadow DOM support is disabled

    // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
    //  now we can just test to see if it would normally be visible or not, provided it's
    //  attached to the main document.
    // NOTE: We must consider case where node is inside a shadow DOM and given directly to
    //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

    if (isNodeAttached(node)) {
      // this works wherever the node is: if there's at least one client rect, it's
      //  somehow displayed; it also covers the CSS 'display: contents' case where the
      //  node itself is hidden in place of its contents; and there's no need to search
      //  up the hierarchy either
      return !node.getClientRects().length;
    }

    // Else, the node isn't attached to the document, which means the `getClientRects()`
    //  API will __always__ return zero rects (this can happen, for example, if React
    //  is used to render nodes onto a detached tree, as confirmed in this thread:
    //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
    //
    // It also means that even window.getComputedStyle(node).display will return `undefined`
    //  because styles are only computed for nodes that are in the document.
    //
    // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
    //  somehow. Though it was never stated officially, anyone who has ever used tabbable
    //  APIs on nodes in detached containers has actually implicitly used tabbable in what
    //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
    //  considering __everything__ to be visible because of the innability to determine styles.
    //
    // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
    //  nodes as visible with the 'none' fallback.__
    if (displayCheck !== 'legacy-full') {
      return true; // hidden
    }
    // else, fallback to 'none' mode and consider the node visible
  } else if (displayCheck === 'non-zero-area') {
    // NOTE: Even though this tests that the node's client rect is non-zero to determine
    //  whether it's displayed, and that a detached node will __always__ have a zero-area
    //  client rect, we don't special-case for whether the node is attached or not. In
    //  this mode, we do want to consider nodes that have a zero area to be hidden at all
    //  times, and that includes attached or not.
    return isZeroArea(node);
  }

  // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
  //  it's visible
  return false;
};

// form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    // check if `node` is contained in a disabled <fieldset>
    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> among the children of the disabled <fieldset>
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          // when the first <legend> (in document order) is found
          if (child.tagName === 'LEGEND') {
            // if its parent <fieldset> is not nested in another disabled <fieldset>,
            // return whether `node` is a descendant of its first <legend>
            return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
          }
        }
        // the disabled <fieldset> containing `node` has no <legend>
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }

  // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
  if (node.disabled ||
  // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) ||
  // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  // If a custom element has an explicit negative tabindex,
  // browsers will not allow tab targeting said element's children.
  return false;
};

/**
 * @param {Array.<Element|CandidateScope>} candidates
 * @returns Element[]
 */
var sortByOrder = function sortByOrder(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function (item, i) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item: item,
        isScope: isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function (acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* #__PURE__ */candidateSelectors.concat('iframe').join(',');
var isFocusable = function isFocusable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};

/*!
* focus-trap 7.5.4
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var activeFocusTraps = {
  activateTrap: function activateTrap(trapStack, trap) {
    if (trapStack.length > 0) {
      var activeTrap = trapStack[trapStack.length - 1];
      if (activeTrap !== trap) {
        activeTrap.pause();
      }
    }
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex === -1) {
      trapStack.push(trap);
    } else {
      // move this existing trap to the front of the queue
      trapStack.splice(trapIndex, 1);
      trapStack.push(trap);
    }
  },
  deactivateTrap: function deactivateTrap(trapStack, trap) {
    var trapIndex = trapStack.indexOf(trap);
    if (trapIndex !== -1) {
      trapStack.splice(trapIndex, 1);
    }
    if (trapStack.length > 0) {
      trapStack[trapStack.length - 1].unpause();
    }
  }
};
var isSelectableInput = function isSelectableInput(node) {
  return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
};
var isEscapeEvent = function isEscapeEvent(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === 'Escape' || (e === null || e === void 0 ? void 0 : e.key) === 'Esc' || (e === null || e === void 0 ? void 0 : e.keyCode) === 27;
};
var isTabEvent = function isTabEvent(e) {
  return (e === null || e === void 0 ? void 0 : e.key) === 'Tab' || (e === null || e === void 0 ? void 0 : e.keyCode) === 9;
};

// checks for TAB by default
var isKeyForward = function isKeyForward(e) {
  return isTabEvent(e) && !e.shiftKey;
};

// checks for SHIFT+TAB by default
var isKeyBackward = function isKeyBackward(e) {
  return isTabEvent(e) && e.shiftKey;
};
var delay = function delay(fn) {
  return setTimeout(fn, 0);
};

// Array.find/findIndex() are not supported on IE; this replicates enough
//  of Array.findIndex() for our needs
var findIndex = function findIndex(arr, fn) {
  var idx = -1;
  arr.every(function (value, i) {
    if (fn(value)) {
      idx = i;
      return false; // break
    }

    return true; // next
  });

  return idx;
};

/**
 * Get an option's value when it could be a plain value, or a handler that provides
 *  the value.
 * @param {*} value Option's value to check.
 * @param {...*} [params] Any parameters to pass to the handler, if `value` is a function.
 * @returns {*} The `value`, or the handler's returned value.
 */
var valueOrHandler = function valueOrHandler(value) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }
  return typeof value === 'function' ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget(event) {
  // NOTE: If the trap is _inside_ a shadow DOM, event.target will always be the
  //  shadow host. However, event.target.composedPath() will be an array of
  //  nodes "clicked" from inner-most (the actual element inside the shadow) to
  //  outer-most (the host HTML document). If we have access to composedPath(),
  //  then use its first element; otherwise, fall back to event.target (and
  //  this only works for an _open_ shadow DOM; otherwise,
  //  composedPath()[0] === event.target always).
  return event.target.shadowRoot && typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target;
};

// NOTE: this must be _outside_ `createFocusTrap()` to make sure all traps in this
//  current instance use the same stack if `userOptions.trapStack` isn't specified
var internalTrapStack = [];
var createFocusTrap$1 = function createFocusTrap(elements, userOptions) {
  // SSR: a live trap shouldn't be created in this type of environment so this
  //  should be safe code to execute if the `document` option isn't specified
  var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
  var trapStack = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.trapStack) || internalTrapStack;
  var config = _objectSpread2({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true,
    isKeyForward: isKeyForward,
    isKeyBackward: isKeyBackward
  }, userOptions);
  var state = {
    // containers given to createFocusTrap()
    // @type {Array<HTMLElement>}
    containers: [],
    // list of objects identifying tabbable nodes in `containers` in the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    // @type {Array<{
    //   container: HTMLElement,
    //   tabbableNodes: Array<HTMLElement>, // empty if none
    //   focusableNodes: Array<HTMLElement>, // empty if none
    //   posTabIndexesFound: boolean,
    //   firstTabbableNode: HTMLElement|undefined,
    //   lastTabbableNode: HTMLElement|undefined,
    //   firstDomTabbableNode: HTMLElement|undefined,
    //   lastDomTabbableNode: HTMLElement|undefined,
    //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
    // }>}
    containerGroups: [],
    // same order/length as `containers` list

    // references to objects in `containerGroups`, but only those that actually have
    //  tabbable nodes in them
    // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
    //  the same length
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: undefined,
    // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
    recentNavEvent: undefined
  };
  var trap; // eslint-disable-line prefer-const -- some private functions reference it, and its methods reference private functions, so we must declare here and define later

  /**
   * Gets a configuration option value.
   * @param {Object|undefined} configOverrideOptions If true, and option is defined in this set,
   *  value will be taken from this object. Otherwise, value will be taken from base configuration.
   * @param {string} optionName Name of the option whose value is sought.
   * @param {string|undefined} [configOptionName] Name of option to use __instead of__ `optionName`
   *  IIF `configOverrideOptions` is not defined. Otherwise, `optionName` is used.
   */
  var getOption = function getOption(configOverrideOptions, optionName, configOptionName) {
    return configOverrideOptions && configOverrideOptions[optionName] !== undefined ? configOverrideOptions[optionName] : config[configOptionName || optionName];
  };

  /**
   * Finds the index of the container that contains the element.
   * @param {HTMLElement} element
   * @param {Event} [event] If available, and `element` isn't directly found in any container,
   *  the event's composed path is used to see if includes any known trap containers in the
   *  case where the element is inside a Shadow DOM.
   * @returns {number} Index of the container in either `state.containers` or
   *  `state.containerGroups` (the order/length of these lists are the same); -1
   *  if the element isn't found.
   */
  var findContainerIndex = function findContainerIndex(element, event) {
    var composedPath = typeof (event === null || event === void 0 ? void 0 : event.composedPath) === 'function' ? event.composedPath() : undefined;
    // NOTE: search `containerGroups` because it's possible a group contains no tabbable
    //  nodes, but still contains focusable nodes (e.g. if they all have `tabindex=-1`)
    //  and we still need to find the element in there
    return state.containerGroups.findIndex(function (_ref) {
      var container = _ref.container,
        tabbableNodes = _ref.tabbableNodes;
      return container.contains(element) || ( // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      composedPath === null || composedPath === void 0 ? void 0 : composedPath.includes(container)) || tabbableNodes.find(function (node) {
        return node === element;
      });
    });
  };

  /**
   * Gets the node for the given option, which is expected to be an option that
   *  can be either a DOM node, a string that is a selector to get a node, `false`
   *  (if a node is explicitly NOT given), or a function that returns any of these
   *  values.
   * @param {string} optionName
   * @returns {undefined | false | HTMLElement | SVGElement} Returns
   *  `undefined` if the option is not specified; `false` if the option
   *  resolved to `false` (node explicitly not given); otherwise, the resolved
   *  DOM node.
   * @throws {Error} If the option is set, not `false`, and is not, or does not
   *  resolve to a node.
   */
  var getNodeForOption = function getNodeForOption(optionName) {
    var optionValue = config[optionName];
    if (typeof optionValue === 'function') {
      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }
      optionValue = optionValue.apply(void 0, params);
    }
    if (optionValue === true) {
      optionValue = undefined; // use default value
    }

    if (!optionValue) {
      if (optionValue === undefined || optionValue === false) {
        return optionValue;
      }
      // else, empty string (invalid), null (invalid), 0 (invalid)

      throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
    }
    var node = optionValue; // could be HTMLElement, SVGElement, or non-empty string at this point

    if (typeof optionValue === 'string') {
      node = doc.querySelector(optionValue); // resolve to node, or null if fails
      if (!node) {
        throw new Error("`".concat(optionName, "` as selector refers to no known node"));
      }
    }
    return node;
  };
  var getInitialFocusNode = function getInitialFocusNode() {
    var node = getNodeForOption('initialFocus');

    // false explicitly indicates we want no initialFocus at all
    if (node === false) {
      return false;
    }
    if (node === undefined || !isFocusable(node, config.tabbableOptions)) {
      // option not specified nor focusable: use fallback options
      if (findContainerIndex(doc.activeElement) >= 0) {
        node = doc.activeElement;
      } else {
        var firstTabbableGroup = state.tabbableGroups[0];
        var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;

        // NOTE: `fallbackFocus` option function cannot return `false` (not supported)
        node = firstTabbableNode || getNodeForOption('fallbackFocus');
      }
    }
    if (!node) {
      throw new Error('Your focus-trap needs to have at least one focusable element');
    }
    return node;
  };
  var updateTabbableNodes = function updateTabbableNodes() {
    state.containerGroups = state.containers.map(function (container) {
      var tabbableNodes = tabbable(container, config.tabbableOptions);

      // NOTE: if we have tabbable nodes, we must have focusable nodes; focusable nodes
      //  are a superset of tabbable nodes since nodes with negative `tabindex` attributes
      //  are focusable but not tabbable
      var focusableNodes = focusable(container, config.tabbableOptions);
      var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : undefined;
      var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : undefined;
      var firstDomTabbableNode = focusableNodes.find(function (node) {
        return isTabbable(node);
      });
      var lastDomTabbableNode = focusableNodes.slice().reverse().find(function (node) {
        return isTabbable(node);
      });
      var posTabIndexesFound = !!tabbableNodes.find(function (node) {
        return getTabIndex(node) > 0;
      });
      return {
        container: container,
        tabbableNodes: tabbableNodes,
        focusableNodes: focusableNodes,
        /** True if at least one node with positive `tabindex` was found in this container. */
        posTabIndexesFound: posTabIndexesFound,
        /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
        firstTabbableNode: firstTabbableNode,
        /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
        lastTabbableNode: lastTabbableNode,
        // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
        //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        //  because that API doesn't work with Shadow DOM as well as it should (@see
        //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
        //  to address an edge case related to positive tabindex support, this seems like a much easier,
        //  "close enough most of the time" alternative for positive tabindexes which should generally
        //  be avoided anyway...
        /** First tabbable node in container, __DOM__ order; `undefined` if none. */
        firstDomTabbableNode: firstDomTabbableNode,
        /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
        lastDomTabbableNode: lastDomTabbableNode,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function nextTabbableNode(node) {
          var forward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          var nodeIdx = tabbableNodes.indexOf(node);
          if (nodeIdx < 0) {
            // either not tabbable nor focusable, or was focused but not tabbable (negative tabindex):
            //  since `node` should at least have been focusable, we assume that's the case and mimic
            //  what browsers do, which is set focus to the next node in __document position order__,
            //  regardless of positive tabindexes, if any -- and for reasons explained in the NOTE
            //  above related to `firstDomTabbable` and `lastDomTabbable` properties, we fall back to
            //  basic DOM order
            if (forward) {
              return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function (el) {
                return isTabbable(el);
              });
            }
            return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function (el) {
              return isTabbable(el);
            });
          }
          return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
        }
      };
    });
    state.tabbableGroups = state.containerGroups.filter(function (group) {
      return group.tabbableNodes.length > 0;
    });

    // throw if no groups have tabbable nodes and we don't have a fallback focus node either
    if (state.tabbableGroups.length <= 0 && !getNodeForOption('fallbackFocus') // returning false not supported for this option
    ) {
      throw new Error('Your focus-trap must have at least one container with at least one tabbable node in it at all times');
    }

    // NOTE: Positive tabindexes are only properly supported in single-container traps because
    //  doing it across multiple containers where tabindexes could be all over the place
    //  would require Tabbable to support multiple containers, would require additional
    //  specialized Shadow DOM support, and would require Tabbable's multi-container support
    //  to look at those containers in document position order rather than user-provided
    //  order (as they are treated in Focus-trap, for legacy reasons). See discussion on
    //  https://github.com/focus-trap/focus-trap/issues/375 for more details.
    if (state.containerGroups.find(function (g) {
      return g.posTabIndexesFound;
    }) && state.containerGroups.length > 1) {
      throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
    }
  };

  /**
   * Gets the current activeElement. If it's a web-component and has open shadow-root
   * it will recursively search inside shadow roots for the "true" activeElement.
   *
   * @param {Document | ShadowRoot} el
   *
   * @returns {HTMLElement} The element that currently has the focus
   **/
  var getActiveElement = function getActiveElement(el) {
    var activeElement = el.activeElement;
    if (!activeElement) {
      return;
    }
    if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
      return getActiveElement(activeElement.shadowRoot);
    }
    return activeElement;
  };
  var tryFocus = function tryFocus(node) {
    if (node === false) {
      return;
    }
    if (node === getActiveElement(document)) {
      return;
    }
    if (!node || !node.focus) {
      tryFocus(getInitialFocusNode());
      return;
    }
    node.focus({
      preventScroll: !!config.preventScroll
    });
    // NOTE: focus() API does not trigger focusIn event so set MRU node manually
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  };
  var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
    var node = getNodeForOption('setReturnFocus', previousActiveElement);
    return node ? node : node === false ? false : previousActiveElement;
  };

  /**
   * Finds the next node (in either direction) where focus should move according to a
   *  keyboard focus-in event.
   * @param {Object} params
   * @param {Node} [params.target] Known target __from which__ to navigate, if any.
   * @param {KeyboardEvent|FocusEvent} [params.event] Event to use if `target` isn't known (event
   *  will be used to determine the `target`). Ignored if `target` is specified.
   * @param {boolean} [params.isBackward] True if focus should move backward.
   * @returns {Node|undefined} The next node, or `undefined` if a next node couldn't be
   *  determined given the current state of the trap.
   */
  var findNextNavNode = function findNextNavNode(_ref2) {
    var target = _ref2.target,
      event = _ref2.event,
      _ref2$isBackward = _ref2.isBackward,
      isBackward = _ref2$isBackward === void 0 ? false : _ref2$isBackward;
    target = target || getActualTarget(event);
    updateTabbableNodes();
    var destinationNode = null;
    if (state.tabbableGroups.length > 0) {
      // make sure the target is actually contained in a group
      // NOTE: the target may also be the container itself if it's focusable
      //  with tabIndex='-1' and was given initial focus
      var containerIndex = findContainerIndex(target, event);
      var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : undefined;
      if (containerIndex < 0) {
        // target not found in any group: quite possible focus has escaped the trap,
        //  so bring it back into...
        if (isBackward) {
          // ...the last node in the last group
          destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
        } else {
          // ...the first node in the first group
          destinationNode = state.tabbableGroups[0].firstTabbableNode;
        }
      } else if (isBackward) {
        // REVERSE

        // is the target the first tabbable node in a group?
        var startOfGroupIndex = findIndex(state.tabbableGroups, function (_ref3) {
          var firstTabbableNode = _ref3.firstTabbableNode;
          return target === firstTabbableNode;
        });
        if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
          // an exception case where the target is either the container itself, or
          //  a non-tabbable node that was given focus (i.e. tabindex is negative
          //  and user clicked on it or node was programmatically given focus)
          //  and is not followed by any other tabbable node, in which
          //  case, we should handle shift+tab as if focus were on the container's
          //  first tabbable node, and go to the last tabbable node of the LAST group
          startOfGroupIndex = containerIndex;
        }
        if (startOfGroupIndex >= 0) {
          // YES: then shift+tab should go to the last tabbable node in the
          //  previous group (and wrap around to the last tabbable node of
          //  the LAST group if it's the first tabbable node of the FIRST group)
          var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
          var destinationGroup = state.tabbableGroups[destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
        } else if (!isTabEvent(event)) {
          // user must have customized the nav keys so we have to move focus manually _within_
          //  the active group: do this based on the order determined by tabbable()
          destinationNode = containerGroup.nextTabbableNode(target, false);
        }
      } else {
        // FORWARD

        // is the target the last tabbable node in a group?
        var lastOfGroupIndex = findIndex(state.tabbableGroups, function (_ref4) {
          var lastTabbableNode = _ref4.lastTabbableNode;
          return target === lastTabbableNode;
        });
        if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
          // an exception case where the target is the container itself, or
          //  a non-tabbable node that was given focus (i.e. tabindex is negative
          //  and user clicked on it or node was programmatically given focus)
          //  and is not followed by any other tabbable node, in which
          //  case, we should handle tab as if focus were on the container's
          //  last tabbable node, and go to the first tabbable node of the FIRST group
          lastOfGroupIndex = containerIndex;
        }
        if (lastOfGroupIndex >= 0) {
          // YES: then tab should go to the first tabbable node in the next
          //  group (and wrap around to the first tabbable node of the FIRST
          //  group if it's the last tabbable node of the LAST group)
          var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
          var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
          destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
        } else if (!isTabEvent(event)) {
          // user must have customized the nav keys so we have to move focus manually _within_
          //  the active group: do this based on the order determined by tabbable()
          destinationNode = containerGroup.nextTabbableNode(target);
        }
      }
    } else {
      // no groups available
      // NOTE: the fallbackFocus option does not support returning false to opt-out
      destinationNode = getNodeForOption('fallbackFocus');
    }
    return destinationNode;
  };

  // This needs to be done on mousedown and touchstart instead of click
  // so that it precedes the focus event.
  var checkPointerDown = function checkPointerDown(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      // allow the click since it ocurred inside the trap
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      // immediately deactivate the trap
      trap.deactivate({
        // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
        //  which will result in the outside click setting focus to the node
        //  that was clicked (and if not focusable, to "nothing"); by setting
        //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
        //  on activation (or the configured `setReturnFocus` node), whether the
        //  outside click was on a focusable node or not
        returnFocus: config.returnFocusOnDeactivate
      });
      return;
    }

    // This is needed for mobile devices.
    // (If we'll only let `click` events through,
    // then on mobile they will be blocked anyways if `touchstart` is blocked.)
    if (valueOrHandler(config.allowOutsideClick, e)) {
      // allow the click outside the trap to take place
      return;
    }

    // otherwise, prevent the click
    e.preventDefault();
  };

  // In case focus escapes the trap for some strange reason, pull it back in.
  // NOTE: the focusIn event is NOT cancelable, so if focus escapes, it may cause unexpected
  //  scrolling if the node that got focused was out of view; there's nothing we can do to
  //  prevent that from happening by the time we discover that focus escaped
  var checkFocusIn = function checkFocusIn(event) {
    var target = getActualTarget(event);
    var targetContained = findContainerIndex(target, event) >= 0;

    // In Firefox when you Tab out of an iframe the Document is briefly focused.
    if (targetContained || target instanceof Document) {
      if (targetContained) {
        state.mostRecentlyFocusedNode = target;
      }
    } else {
      // escaped! pull it back in to where it just left
      event.stopImmediatePropagation();

      // focus will escape if the MRU node had a positive tab index and user tried to nav forward;
      //  it will also escape if the MRU node had a 0 tab index and user tried to nav backward
      //  toward a node with a positive tab index
      var nextNode; // next node to focus, if we find one
      var navAcrossContainers = true;
      if (state.mostRecentlyFocusedNode) {
        if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
          // MRU container index must be >=0 otherwise we wouldn't have it as an MRU node...
          var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
          // there MAY not be any tabbable nodes in the container if there are at least 2 containers
          //  and the MRU node is focusable but not tabbable (focus-trap requires at least 1 container
          //  with at least one tabbable node in order to function, so this could be the other container
          //  with nothing tabbable in it)
          var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
          if (tabbableNodes.length > 0) {
            // MRU tab index MAY not be found if the MRU node is focusable but not tabbable
            var mruTabIdx = tabbableNodes.findIndex(function (node) {
              return node === state.mostRecentlyFocusedNode;
            });
            if (mruTabIdx >= 0) {
              if (config.isKeyForward(state.recentNavEvent)) {
                if (mruTabIdx + 1 < tabbableNodes.length) {
                  nextNode = tabbableNodes[mruTabIdx + 1];
                  navAcrossContainers = false;
                }
                // else, don't wrap within the container as focus should move to next/previous
                //  container
              } else {
                if (mruTabIdx - 1 >= 0) {
                  nextNode = tabbableNodes[mruTabIdx - 1];
                  navAcrossContainers = false;
                }
                // else, don't wrap within the container as focus should move to next/previous
                //  container
              }
              // else, don't find in container order without considering direction too
            }
          }
          // else, no tabbable nodes in that container (which means we must have at least one other
          //  container with at least one tabbable node in it, otherwise focus-trap would've thrown
          //  an error the last time updateTabbableNodes() was run): find next node among all known
          //  containers
        } else {
          // check to see if there's at least one tabbable node with a positive tab index inside
          //  the trap because focus seems to escape when navigating backward from a tabbable node
          //  with tabindex=0 when this is the case (instead of wrapping to the tabbable node with
          //  the greatest positive tab index like it should)
          if (!state.containerGroups.some(function (g) {
            return g.tabbableNodes.some(function (n) {
              return getTabIndex(n) > 0;
            });
          })) {
            // no containers with tabbable nodes with positive tab indexes which means the focus
            //  escaped for some other reason and we should just execute the fallback to the
            //  MRU node or initial focus node, if any
            navAcrossContainers = false;
          }
        }
      } else {
        // no MRU node means we're likely in some initial condition when the trap has just
        //  been activated and initial focus hasn't been given yet, in which case we should
        //  fall through to trying to focus the initial focus node, which is what should
        //  happen below at this point in the logic
        navAcrossContainers = false;
      }
      if (navAcrossContainers) {
        nextNode = findNextNavNode({
          // move FROM the MRU node, not event-related node (which will be the node that is
          //  outside the trap causing the focus escape we're trying to fix)
          target: state.mostRecentlyFocusedNode,
          isBackward: config.isKeyBackward(state.recentNavEvent)
        });
      }
      if (nextNode) {
        tryFocus(nextNode);
      } else {
        tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
      }
    }
    state.recentNavEvent = undefined; // clear
  };

  // Hijack key nav events on the first and last focusable nodes of the trap,
  // in order to prevent focus from escaping. If it escapes for even a
  // moment it can end up scrolling the page and causing confusion so we
  // kind of need to capture the action at the keydown phase.
  var checkKeyNav = function checkKeyNav(event) {
    var isBackward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    state.recentNavEvent = event;
    var destinationNode = findNextNavNode({
      event: event,
      isBackward: isBackward
    });
    if (destinationNode) {
      if (isTabEvent(event)) {
        // since tab natively moves focus, we wouldn't have a destination node unless we
        //  were on the edge of a container and had to move to the next/previous edge, in
        //  which case we want to prevent default to keep the browser from moving focus
        //  to where it normally would
        event.preventDefault();
      }
      tryFocus(destinationNode);
    }
    // else, let the browser take care of [shift+]tab and move the focus
  };

  var checkKey = function checkKey(event) {
    if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
      event.preventDefault();
      trap.deactivate();
      return;
    }
    if (config.isKeyForward(event) || config.isKeyBackward(event)) {
      checkKeyNav(event, config.isKeyBackward(event));
    }
  };
  var checkClick = function checkClick(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target, e) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  //
  // EVENT LISTENERS
  //

  var addListeners = function addListeners() {
    if (!state.active) {
      return;
    }

    // There can be only one listening focus trap at a time
    activeFocusTraps.activateTrap(trapStack, trap);

    // Delay ensures that the focused element doesn't capture the event
    // that caused the focus trap activation.
    state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function () {
      tryFocus(getInitialFocusNode());
    }) : tryFocus(getInitialFocusNode());
    doc.addEventListener('focusin', checkFocusIn, true);
    doc.addEventListener('mousedown', checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener('touchstart', checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener('click', checkClick, {
      capture: true,
      passive: false
    });
    doc.addEventListener('keydown', checkKey, {
      capture: true,
      passive: false
    });
    return trap;
  };
  var removeListeners = function removeListeners() {
    if (!state.active) {
      return;
    }
    doc.removeEventListener('focusin', checkFocusIn, true);
    doc.removeEventListener('mousedown', checkPointerDown, true);
    doc.removeEventListener('touchstart', checkPointerDown, true);
    doc.removeEventListener('click', checkClick, true);
    doc.removeEventListener('keydown', checkKey, true);
    return trap;
  };

  //
  // MUTATION OBSERVER
  //

  var checkDomRemoval = function checkDomRemoval(mutations) {
    var isFocusedNodeRemoved = mutations.some(function (mutation) {
      var removedNodes = Array.from(mutation.removedNodes);
      return removedNodes.some(function (node) {
        return node === state.mostRecentlyFocusedNode;
      });
    });

    // If the currently focused is removed then browsers will move focus to the
    // <body> element. If this happens, try to move focus back into the trap.
    if (isFocusedNodeRemoved) {
      tryFocus(getInitialFocusNode());
    }
  };

  // Use MutationObserver - if supported - to detect if focused node is removed
  // from the DOM.
  var mutationObserver = typeof window !== 'undefined' && 'MutationObserver' in window ? new MutationObserver(checkDomRemoval) : undefined;
  var updateObservedNodes = function updateObservedNodes() {
    if (!mutationObserver) {
      return;
    }
    mutationObserver.disconnect();
    if (state.active && !state.paused) {
      state.containers.map(function (container) {
        mutationObserver.observe(container, {
          subtree: true,
          childList: true
        });
      });
    }
  };

  //
  // TRAP DEFINITION
  //

  trap = {
    get active() {
      return state.active;
    },
    get paused() {
      return state.paused;
    },
    activate: function activate(activateOptions) {
      if (state.active) {
        return this;
      }
      var onActivate = getOption(activateOptions, 'onActivate');
      var onPostActivate = getOption(activateOptions, 'onPostActivate');
      var checkCanFocusTrap = getOption(activateOptions, 'checkCanFocusTrap');
      if (!checkCanFocusTrap) {
        updateTabbableNodes();
      }
      state.active = true;
      state.paused = false;
      state.nodeFocusedBeforeActivation = doc.activeElement;
      onActivate === null || onActivate === void 0 || onActivate();
      var finishActivation = function finishActivation() {
        if (checkCanFocusTrap) {
          updateTabbableNodes();
        }
        addListeners();
        updateObservedNodes();
        onPostActivate === null || onPostActivate === void 0 || onPostActivate();
      };
      if (checkCanFocusTrap) {
        checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
        return this;
      }
      finishActivation();
      return this;
    },
    deactivate: function deactivate(deactivateOptions) {
      if (!state.active) {
        return this;
      }
      var options = _objectSpread2({
        onDeactivate: config.onDeactivate,
        onPostDeactivate: config.onPostDeactivate,
        checkCanReturnFocus: config.checkCanReturnFocus
      }, deactivateOptions);
      clearTimeout(state.delayInitialFocusTimer); // noop if undefined
      state.delayInitialFocusTimer = undefined;
      removeListeners();
      state.active = false;
      state.paused = false;
      updateObservedNodes();
      activeFocusTraps.deactivateTrap(trapStack, trap);
      var onDeactivate = getOption(options, 'onDeactivate');
      var onPostDeactivate = getOption(options, 'onPostDeactivate');
      var checkCanReturnFocus = getOption(options, 'checkCanReturnFocus');
      var returnFocus = getOption(options, 'returnFocus', 'returnFocusOnDeactivate');
      onDeactivate === null || onDeactivate === void 0 || onDeactivate();
      var finishDeactivation = function finishDeactivation() {
        delay(function () {
          if (returnFocus) {
            tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
          }
          onPostDeactivate === null || onPostDeactivate === void 0 || onPostDeactivate();
        });
      };
      if (returnFocus && checkCanReturnFocus) {
        checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
        return this;
      }
      finishDeactivation();
      return this;
    },
    pause: function pause(pauseOptions) {
      if (state.paused || !state.active) {
        return this;
      }
      var onPause = getOption(pauseOptions, 'onPause');
      var onPostPause = getOption(pauseOptions, 'onPostPause');
      state.paused = true;
      onPause === null || onPause === void 0 || onPause();
      removeListeners();
      updateObservedNodes();
      onPostPause === null || onPostPause === void 0 || onPostPause();
      return this;
    },
    unpause: function unpause(unpauseOptions) {
      if (!state.paused || !state.active) {
        return this;
      }
      var onUnpause = getOption(unpauseOptions, 'onUnpause');
      var onPostUnpause = getOption(unpauseOptions, 'onPostUnpause');
      state.paused = false;
      onUnpause === null || onUnpause === void 0 || onUnpause();
      updateTabbableNodes();
      addListeners();
      updateObservedNodes();
      onPostUnpause === null || onPostUnpause === void 0 || onPostUnpause();
      return this;
    },
    updateContainerElements: function updateContainerElements(containerElements) {
      var elementsAsArray = [].concat(containerElements).filter(Boolean);
      state.containers = elementsAsArray.map(function (element) {
        return typeof element === 'string' ? doc.querySelector(element) : element;
      });
      if (state.active) {
        updateTabbableNodes();
      }
      updateObservedNodes();
      return this;
    }
  };

  // initialize container elements
  trap.updateContainerElements(elements);
  return trap;
};

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "499f27c3-089a-4a05-9489-db6adcea3d18", e._sentryDebugIdIdentifier = "sentry-dbid-499f27c3-089a-4a05-9489-db6adcea3d18");
  } catch (e2) {
  }
}();
async function getAccountInfo() {
  const response = await fetch(`${PUBLIC_API_URL}/api/account-info`, {
    headers: {
      Authorization: `Bearer ${cookie.get(ACCESS_TOKEN_COOKIE)}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
const isDom = () => typeof window !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
const pt = (v) => isDom() && v.test(getPlatform().toLowerCase());
const isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;
const isMac$1 = () => pt(/^mac/) && !isTouchDevice();
const isApple = () => pt(/mac|iphone|ipad|ipod/i);
const isIos = () => isApple() && !isMac$1();
const LOCK_CLASSNAME = "data-melt-scroll-lock";
function assignStyle(el, style) {
  if (!el)
    return;
  const previousStyle = el.style.cssText;
  Object.assign(el.style, style);
  return () => {
    el.style.cssText = previousStyle;
  };
}
function setCSSProperty$1(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function getPaddingProperty$1(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function removeScroll(_document) {
  const doc = document;
  const win = doc.defaultView ?? window;
  const { documentElement, body } = doc;
  const locked = body.hasAttribute(LOCK_CLASSNAME);
  if (locked)
    return noop$1;
  body.setAttribute(LOCK_CLASSNAME, "");
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty$1(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty$1(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  const setStyle2 = () => assignStyle(body, {
    overflow: "hidden",
    [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
  });
  const setIOSStyle = () => {
    const { scrollX, scrollY, visualViewport: visualViewport2 } = win;
    const offsetLeft = visualViewport2?.offsetLeft ?? 0;
    const offsetTop = visualViewport2?.offsetTop ?? 0;
    const restoreStyle = assignStyle(body, {
      position: "fixed",
      overflow: "hidden",
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: "0",
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
    });
    return () => {
      restoreStyle?.();
      win.scrollTo(scrollX, scrollY);
    };
  };
  const cleanups = [setScrollbarWidthProperty(), isIos() ? setIOSStyle() : setStyle2()];
  return () => {
    cleanups.forEach((fn) => fn?.());
    body.removeAttribute(LOCK_CLASSNAME);
  };
}
function getPortalParent(node) {
  let parent = node.parentElement;
  while (isHTMLElement$1(parent) && !parent.hasAttribute("data-portal")) {
    parent = parent.parentElement;
  }
  return parent || "body";
}
function getPortalDestination(node, portalProp) {
  if (portalProp !== void 0)
    return portalProp;
  const portalParent = getPortalParent(node);
  if (portalParent === "body")
    return document.body;
  return null;
}
async function handleFocus(args) {
  const { prop, defaultEl } = args;
  await Promise.all([sleep$1(1), tick]);
  if (prop === void 0) {
    defaultEl?.focus();
    return;
  }
  const returned = isFunction(prop) ? prop(defaultEl) : prop;
  if (typeof returned === "string") {
    const el = document.querySelector(returned);
    if (!isHTMLElement$1(el))
      return;
    el.focus();
  } else if (isHTMLElement$1(returned)) {
    returned.focus();
  }
}
function createFocusTrap(config = {}) {
  let trap;
  const { immediate, ...focusTrapOptions } = config;
  const hasFocus = writable(false);
  const isPaused = writable(false);
  const activate = (opts) => trap?.activate(opts);
  const deactivate = (opts) => {
    trap?.deactivate(opts);
  };
  const pause = () => {
    if (trap) {
      trap.pause();
      isPaused.set(true);
    }
  };
  const unpause = () => {
    if (trap) {
      trap.unpause();
      isPaused.set(false);
    }
  };
  const useFocusTrap = (node) => {
    trap = createFocusTrap$1(node, {
      ...focusTrapOptions,
      onActivate() {
        hasFocus.set(true);
        config.onActivate?.();
      },
      onDeactivate() {
        hasFocus.set(false);
        config.onDeactivate?.();
      }
    });
    if (immediate) {
      activate();
    }
    return {
      destroy() {
        deactivate();
        trap = void 0;
      }
    };
  };
  return {
    useFocusTrap,
    hasFocus: readonly(hasFocus),
    isPaused: readonly(isPaused),
    activate,
    deactivate,
    pause,
    unpause
  };
}
const visibleModals = [];
const useModal = (node, config) => {
  let unsubInteractOutside = noop$1;
  function removeNodeFromVisibleModals() {
    const index = visibleModals.indexOf(node);
    if (index >= 0) {
      visibleModals.splice(index, 1);
    }
  }
  function update(config2) {
    unsubInteractOutside();
    const { open, onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config2;
    sleep$1(100).then(() => {
      if (open) {
        visibleModals.push(node);
      } else {
        removeNodeFromVisibleModals();
      }
    });
    function isLastModal() {
      return last(visibleModals) === node;
    }
    function closeModal() {
      if (isLastModal() && onClose) {
        onClose();
        removeNodeFromVisibleModals();
      }
    }
    function onInteractOutsideStart(e) {
      const target = e.target;
      if (!isElement(target))
        return;
      if (target && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
    function onInteractOutside(e) {
      if (shouldCloseOnInteractOutside?.(e) && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeModal();
      }
    }
    unsubInteractOutside = useInteractOutside(node, {
      onInteractOutsideStart,
      onInteractOutside: closeOnInteractOutside ? onInteractOutside : void 0,
      enabled: open
    }).destroy;
  }
  update(config);
  return {
    update,
    destroy() {
      removeNodeFromVisibleModals();
      unsubInteractOutside();
    }
  };
};
const usePortal = (el, target = "body") => {
  let targetEl;
  if (!isHTMLElement$1(target) && typeof target !== "string") {
    return {
      destroy: noop$1
    };
  }
  async function update(newTarget) {
    target = newTarget;
    if (typeof target === "string") {
      targetEl = document.querySelector(target);
      if (targetEl === null) {
        await tick();
        targetEl = document.querySelector(target);
      }
      if (targetEl === null) {
        throw new Error(`No element found matching css selector: "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      targetEl = target;
    } else {
      throw new TypeError(`Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`);
    }
    el.dataset.portal = "";
    targetEl.appendChild(el);
    el.hidden = false;
  }
  function destroy() {
    el.remove();
  }
  update(target);
  return {
    update,
    destroy
  };
};
const useInteractOutside = (node, config) => {
  let unsub = noop$1;
  let unsubClick = noop$1;
  let isPointerDown = false;
  let isPointerDownInside = false;
  let ignoreEmulatedMouseEvents = false;
  function update(config2) {
    unsub();
    unsubClick();
    const { onInteractOutside, onInteractOutsideStart, enabled } = config2;
    if (!enabled)
      return;
    function onPointerDown(e) {
      if (onInteractOutside && isValidEvent(e, node)) {
        onInteractOutsideStart?.(e);
      }
      const target = e.target;
      if (isElement(target) && isOrContainsTarget(node, target)) {
        isPointerDownInside = true;
      }
      isPointerDown = true;
    }
    function triggerInteractOutside(e) {
      onInteractOutside?.(e);
    }
    const documentObj = getOwnerDocument(node);
    if (typeof PointerEvent !== "undefined") {
      const onPointerUp = (e) => {
        unsubClick();
        const handler = (e2) => {
          if (shouldTriggerInteractOutside(e2)) {
            triggerInteractOutside(e2);
          }
          resetPointerState();
        };
        if (e.pointerType === "touch") {
          unsubClick = addEventListener$1(documentObj, "click", handler, {
            capture: true,
            once: true
          });
          return;
        }
        handler(e);
      };
      unsub = executeCallbacks(addEventListener$1(documentObj, "pointerdown", onPointerDown, true), addEventListener$1(documentObj, "pointerup", onPointerUp, true));
    } else {
      const onMouseUp = (e) => {
        if (ignoreEmulatedMouseEvents) {
          ignoreEmulatedMouseEvents = false;
        } else if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      const onTouchEnd = (e) => {
        ignoreEmulatedMouseEvents = true;
        if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      unsub = executeCallbacks(addEventListener$1(documentObj, "mousedown", onPointerDown, true), addEventListener$1(documentObj, "mouseup", onMouseUp, true), addEventListener$1(documentObj, "touchstart", onPointerDown, true), addEventListener$1(documentObj, "touchend", onTouchEnd, true));
    }
  }
  function shouldTriggerInteractOutside(e) {
    if (isPointerDown && !isPointerDownInside && isValidEvent(e, node)) {
      return true;
    }
    return false;
  }
  function resetPointerState() {
    isPointerDown = false;
    isPointerDownInside = false;
  }
  update(config);
  return {
    update,
    destroy() {
      unsub();
      unsubClick();
    }
  };
};
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0)
    return false;
  const target = e.target;
  if (!isElement(target))
    return false;
  const ownerDocument = target.ownerDocument;
  if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
    return false;
  }
  return node && !isOrContainsTarget(node, target);
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
const { name } = createElHelpers("dialog");
const defaults = {
  preventScroll: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  role: "dialog",
  defaultOpen: false,
  portal: void 0,
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const dialogIdParts = ["content", "title", "description"];
function createDialog(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores$1(omit$1(withDefaults, "ids"));
  const { preventScroll: preventScroll2, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const activeTrigger = withGet.writable(null);
  const ids = toWritableStores$1({
    ...generateIds(dialogIdParts),
    ...withDefaults.ids
  });
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable$1(openWritable, withDefaults?.onOpenChange);
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
    return $open || $forceVisible;
  });
  let unsubScroll = noop$1;
  function handleOpen(e) {
    const el = e.currentTarget;
    const triggerEl = e.currentTarget;
    if (!isHTMLElement$1(el) || !isHTMLElement$1(triggerEl))
      return;
    open.set(true);
    activeTrigger.set(triggerEl);
  }
  function handleClose() {
    open.set(false);
    handleFocus({
      prop: closeFocus.get(),
      defaultEl: activeTrigger.get()
    });
  }
  const trigger = makeElement(name("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        type: "button"
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        handleOpen(e);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        handleOpen(e);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = makeElement(name("overlay"), {
    stores: [isVisible, open],
    returned: ([$isVisible, $open]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString$1({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": true,
        "data-state": $open ? "open" : "closed"
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop$1;
      if (closeOnEscape.get()) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      return {
        destroy() {
          unsubEscapeKeydown();
        }
      };
    }
  });
  const content = makeElement(name("content"), {
    stores: [isVisible, ids.content, ids.description, ids.title, open],
    returned: ([$isVisible, $contentId, $descriptionId, $titleId, $open]) => {
      return {
        id: $contentId,
        role: role.get(),
        "aria-describedby": $descriptionId,
        "aria-labelledby": $titleId,
        "aria-modal": $isVisible ? "true" : void 0,
        "data-state": $open ? "open" : "closed",
        tabindex: -1,
        hidden: $isVisible ? void 0 : true,
        style: styleToString$1({
          display: $isVisible ? void 0 : "none"
        })
      };
    },
    action: (node) => {
      let activate = noop$1;
      let deactivate = noop$1;
      const destroy = executeCallbacks(effect$1([open, closeOnOutsideClick, closeOnEscape], ([$open, $closeOnOutsideClick, $closeOnEscape]) => {
        if (!$open)
          return;
        const focusTrap = createFocusTrap({
          immediate: false,
          escapeDeactivates: $closeOnEscape,
          clickOutsideDeactivates: $closeOnOutsideClick,
          allowOutsideClick: true,
          returnFocusOnDeactivate: false,
          fallbackFocus: node
        });
        activate = focusTrap.activate;
        deactivate = focusTrap.deactivate;
        const ac = focusTrap.useFocusTrap(node);
        if (ac && ac.destroy) {
          return ac.destroy;
        } else {
          return focusTrap.deactivate;
        }
      }), effect$1([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
        return useModal(node, {
          open: $open,
          closeOnInteractOutside: $closeOnOutsideClick,
          onClose() {
            handleClose();
          },
          shouldCloseOnInteractOutside(e) {
            onOutsideClick.get()?.(e);
            if (e.defaultPrevented)
              return false;
            return true;
          }
        }).destroy;
      }), effect$1([closeOnEscape], ([$closeOnEscape]) => {
        if (!$closeOnEscape)
          return noop$1;
        return useEscapeKeydown(node, { handler: handleClose }).destroy;
      }), effect$1([isVisible], ([$isVisible]) => {
        tick().then(() => {
          if (!$isVisible) {
            deactivate();
          } else {
            activate();
          }
        });
      }));
      return {
        destroy: () => {
          unsubScroll();
          destroy();
        }
      };
    }
  });
  const portalled = makeElement(name("portalled"), {
    stores: portal,
    returned: ($portal) => ({
      "data-portal": portalAttr($portal)
    }),
    action: (node) => {
      const unsubPortal = effect$1([portal], ([$portal]) => {
        if ($portal === null)
          return noop$1;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return noop$1;
        return usePortal(node, portalDestination).destroy;
      });
      return {
        destroy() {
          unsubPortal();
        }
      };
    }
  });
  const title = makeElement(name("title"), {
    stores: [ids.title],
    returned: ([$titleId]) => ({
      id: $titleId
    })
  });
  const description = makeElement(name("description"), {
    stores: [ids.description],
    returned: ([$descriptionId]) => ({
      id: $descriptionId
    })
  });
  const close = makeElement(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.SPACE && e.key !== kbd.ENTER)
          return;
        e.preventDefault();
        handleClose();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect$1([open, preventScroll2], ([$open, $preventScroll]) => {
    if (!isBrowser$1)
      return;
    if ($preventScroll && $open)
      unsubScroll = removeScroll();
    if ($open) {
      const contentEl = document.getElementById(ids.content.get());
      handleFocus({ prop: openFocus.get(), defaultEl: contentEl });
    }
    return () => {
      if (!forceVisible.get()) {
        unsubScroll();
      }
    };
  });
  return {
    ids,
    elements: {
      content,
      trigger,
      title,
      description,
      overlay,
      close,
      portalled
    },
    states: {
      open
    },
    options
  };
}
function getDialogData() {
  const NAME = "dialog";
  const PARTS = [
    "close",
    "content",
    "description",
    "overlay",
    "portal",
    "title",
    "trigger"
  ];
  return {
    NAME,
    PARTS
  };
}
function setCtx$1(props) {
  const { NAME, PARTS } = getDialogData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const dialog = {
    ...createDialog({ ...removeUndefined$1(props), role: "dialog", forceVisible: true }),
    getAttrs
  };
  setContext(NAME, dialog);
  return {
    ...dialog,
    updateOption: getOptionUpdater$1(dialog.options)
  };
}
function getCtx$1() {
  const { NAME } = getDialogData();
  return getContext(NAME);
}
function Dialog($$payload, $$props) {
  push();
  var $$store_subs;
  let preventScroll2 = value_or_fallback($$props["preventScroll"], () => void 0);
  let closeOnEscape = value_or_fallback($$props["closeOnEscape"], () => void 0);
  let closeOnOutsideClick = value_or_fallback($$props["closeOnOutsideClick"], () => void 0);
  let portal = value_or_fallback($$props["portal"], () => void 0);
  let open = value_or_fallback($$props["open"], () => void 0);
  let onOpenChange = value_or_fallback($$props["onOpenChange"], () => void 0);
  let openFocus = value_or_fallback($$props["openFocus"], () => void 0);
  let closeFocus = value_or_fallback($$props["closeFocus"], () => void 0);
  let onOutsideClick = value_or_fallback($$props["onOutsideClick"], () => void 0);
  const {
    states: { open: localOpen },
    updateOption,
    ids
  } = setCtx$1({
    closeOnEscape,
    preventScroll: preventScroll2,
    closeOnOutsideClick,
    portal,
    forceVisible: true,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const idValues = derived([ids.content, ids.description, ids.title], ([$contentId, $descriptionId, $titleId]) => ({
    content: $contentId,
    description: $descriptionId,
    title: $titleId
  }));
  open !== void 0 && localOpen.set(open);
  updateOption("preventScroll", preventScroll2);
  updateOption("closeOnEscape", closeOnEscape);
  updateOption("closeOnOutsideClick", closeOnOutsideClick);
  updateOption("portal", portal);
  updateOption("openFocus", openFocus);
  updateOption("closeFocus", closeFocus);
  updateOption("onOutsideClick", onOutsideClick);
  $$payload.out += `<!--[-->`;
  slot(
    $$payload,
    default_slot($$props),
    {
      get ids() {
        return store_get($$store_subs ??= {}, "$idValues", idValues);
      }
    },
    null
  );
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    preventScroll: preventScroll2,
    closeOnEscape,
    closeOnOutsideClick,
    portal,
    open,
    onOpenChange,
    openFocus,
    closeFocus,
    onOutsideClick
  });
  pop();
}
function Dialog_title($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["level", "asChild", "id", "el"]);
  push();
  var $$store_subs;
  let builder;
  let level = value_or_fallback($$props["level"], () => "h2");
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let id = value_or_fallback($$props["id"], () => void 0);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { title }, ids, getAttrs } = getCtx$1();
  const attrs = getAttrs("title");
  if (id) {
    ids.title.set(id);
  }
  builder = store_get($$store_subs ??= {}, "$title", title);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    if (level) element(
      $$payload,
      level,
      () => {
        $$payload.out += `${spread_attributes({ ...builder, ...$$restProps })}`;
      },
      () => {
        $$payload.out += `<!--[-->`;
        slot(
          $$payload,
          default_slot($$props),
          {
            get builder() {
              return builder;
            }
          },
          null
        );
        $$payload.out += `<!--]-->`;
      }
    );
    $$payload.out += `<!---->`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { level, asChild, id, el });
  pop();
}
function Dialog_close($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { close }, getAttrs } = getCtx$1();
  const attrs = getAttrs("close");
  builder = store_get($$store_subs ??= {}, "$close", close);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]--></button>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_portal($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { portalled }, getAttrs } = getCtx$1();
  const attrs = getAttrs("portal");
  builder = store_get($$store_subs ??= {}, "$portalled", portalled);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]--></div>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Dialog_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = value_or_fallback($$props["transition"], () => void 0);
  let transitionConfig = value_or_fallback($$props["transitionConfig"], () => void 0);
  let inTransition = value_or_fallback($$props["inTransition"], () => void 0);
  let inTransitionConfig = value_or_fallback($$props["inTransitionConfig"], () => void 0);
  let outTransition = value_or_fallback($$props["outTransition"], () => void 0);
  let outTransitionConfig = value_or_fallback($$props["outTransitionConfig"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let id = value_or_fallback($$props["id"], () => void 0);
  let el = value_or_fallback($$props["el"], () => void 0);
  const {
    elements: { content },
    states: { open },
    ids,
    getAttrs
  } = getCtx$1();
  const attrs = getAttrs("content");
  if (id) {
    ids.content.set(id);
  }
  builder = store_get($$store_subs ??= {}, "$content", content);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<!--[-->`;
    if (transition && store_get($$store_subs ??= {}, "$open", open)) {
      $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
      slot(
        $$payload,
        default_slot($$props),
        {
          get builder() {
            return builder;
          }
        },
        null
      );
      $$payload.out += `<!--]--></div>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += `<!--[-->`;
      if (inTransition && outTransition && store_get($$store_subs ??= {}, "$open", open)) {
        $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
        slot(
          $$payload,
          default_slot($$props),
          {
            get builder() {
              return builder;
            }
          },
          null
        );
        $$payload.out += `<!--]--></div>`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `<!--[-->`;
        if (inTransition && store_get($$store_subs ??= {}, "$open", open)) {
          $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
          slot(
            $$payload,
            default_slot($$props),
            {
              get builder() {
                return builder;
              }
            },
            null
          );
          $$payload.out += `<!--]--></div>`;
          $$payload.out += "<!--]-->";
        } else {
          $$payload.out += `<!--[-->`;
          if (outTransition && store_get($$store_subs ??= {}, "$open", open)) {
            $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
            slot(
              $$payload,
              default_slot($$props),
              {
                get builder() {
                  return builder;
                }
              },
              null
            );
            $$payload.out += `<!--]--></div>`;
            $$payload.out += "<!--]-->";
          } else {
            $$payload.out += `<!--[-->`;
            if (store_get($$store_subs ??= {}, "$open", open)) {
              $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!--[-->`;
              slot(
                $$payload,
                default_slot($$props),
                {
                  get builder() {
                    return builder;
                  }
                },
                null
              );
              $$payload.out += `<!--]--></div>`;
              $$payload.out += "<!--]-->";
            } else {
              $$payload.out += "<!--]!-->";
            }
            $$payload.out += "<!--]!-->";
          }
          $$payload.out += "<!--]!-->";
        }
        $$payload.out += "<!--]!-->";
      }
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    transition,
    transitionConfig,
    inTransition,
    inTransitionConfig,
    outTransition,
    outTransitionConfig,
    asChild,
    id,
    el
  });
  pop();
}
function Dialog_overlay($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = value_or_fallback($$props["transition"], () => void 0);
  let transitionConfig = value_or_fallback($$props["transitionConfig"], () => void 0);
  let inTransition = value_or_fallback($$props["inTransition"], () => void 0);
  let inTransitionConfig = value_or_fallback($$props["inTransitionConfig"], () => void 0);
  let outTransition = value_or_fallback($$props["outTransition"], () => void 0);
  let outTransitionConfig = value_or_fallback($$props["outTransitionConfig"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const {
    elements: { overlay },
    states: { open },
    getAttrs
  } = getCtx$1();
  const attrs = getAttrs("overlay");
  builder = store_get($$store_subs ??= {}, "$overlay", overlay);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<!--[-->`;
    if (transition && store_get($$store_subs ??= {}, "$open", open)) {
      $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += `<!--[-->`;
      if (inTransition && outTransition && store_get($$store_subs ??= {}, "$open", open)) {
        $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `<!--[-->`;
        if (inTransition && store_get($$store_subs ??= {}, "$open", open)) {
          $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
          $$payload.out += "<!--]-->";
        } else {
          $$payload.out += `<!--[-->`;
          if (outTransition && store_get($$store_subs ??= {}, "$open", open)) {
            $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
            $$payload.out += "<!--]-->";
          } else {
            $$payload.out += `<!--[-->`;
            if (store_get($$store_subs ??= {}, "$open", open)) {
              $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}></div>`;
              $$payload.out += "<!--]-->";
            } else {
              $$payload.out += "<!--]!-->";
            }
            $$payload.out += "<!--]!-->";
          }
          $$payload.out += "<!--]!-->";
        }
        $$payload.out += "<!--]!-->";
      }
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    transition,
    transitionConfig,
    inTransition,
    inTransitionConfig,
    outTransition,
    outTransitionConfig,
    asChild,
    el
  });
  pop();
}
function Dialog_trigger($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { trigger }, getAttrs } = getCtx$1();
  const attrs = getAttrs("trigger");
  builder = store_get($$store_subs ??= {}, "$trigger", trigger);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!--[-->`;
    slot(
      $$payload,
      default_slot($$props),
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]--></button>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function getOptionUpdater(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1]
};
const VELOCITY_THRESHOLD = 0.4;
function effect(stores, fn) {
  if (typeof document === "undefined") {
    return () => {
    };
  }
  const unsub = derivedWithUnsubscribe(stores, (stores2, onUnsubscribe) => {
    return {
      stores: stores2,
      onUnsubscribe
    };
  }).subscribe(({ stores: stores2, onUnsubscribe }) => {
    const returned = fn(stores2);
    if (returned) {
      onUnsubscribe(returned);
    }
  });
  safeOnDestroy(unsub);
  return unsub;
}
function derivedWithUnsubscribe(stores, fn) {
  let unsubscribers = [];
  const onUnsubscribe = (cb) => {
    unsubscribers.push(cb);
  };
  const unsubscribe = () => {
    unsubscribers.forEach((fn2) => fn2());
    unsubscribers = [];
  };
  const derivedStore = derived(stores, ($storeValues) => {
    unsubscribe();
    return fn($storeValues, onUnsubscribe);
  });
  safeOnDestroy(unsubscribe);
  const subscribe = (...args) => {
    const unsub = derivedStore.subscribe(...args);
    return () => {
      unsub();
      unsubscribe();
    };
  };
  return {
    ...derivedStore,
    subscribe
  };
}
const safeOnDestroy = (fn) => {
  try {
    onDestroy(fn);
  } catch {
    return fn();
  }
};
const overridable = (store, onChange) => {
  const update = (updater, sideEffect) => {
    store.update((curr) => {
      const next = updater(curr);
      let res = next;
      if (onChange) {
        res = onChange({ curr, next });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set2 = (curr) => {
    update(() => curr);
  };
  return {
    ...store,
    update,
    set: set2
  };
};
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = writable(value);
  });
  return result;
}
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function removeUndefined(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
const cache = /* @__PURE__ */ new WeakMap();
function set(el, styles, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement) || !styles)
    return;
  const originalStyles = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }
    originalStyles[key] = el.style[key];
    el.style[key] = value;
  });
  if (ignoreCache)
    return;
  cache.set(el, originalStyles);
}
function reset(el, prop) {
  if (!el || !(el instanceof HTMLElement))
    return;
  const originalStyles = cache.get(el);
  if (!originalStyles) {
    return;
  }
  if (prop) {
    el.style[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      el.style[key] = value;
    });
  }
}
function getTranslate(element2, direction) {
  const style = window.getComputedStyle(element2);
  const transform = (
    // @ts-expect-error - vendor prefix
    style.transform || style.webkitTransform || style.mozTransform
  );
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
function noop() {
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
const nonTextInputTypes = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
const isBrowser = typeof document !== "undefined";
function isInput(target) {
  return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}
function isVertical(direction) {
  if (direction === "top" || direction === "bottom")
    return true;
  return false;
}
function isBottomOrRight(direction) {
  if (direction === "bottom" || direction === "right")
    return true;
  return false;
}
function chain(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function handleSnapPoints({ activeSnapPoint, snapPoints, drawerRef, overlayRef, fadeFromIndex, openTime, direction }) {
  const isLastSnapPoint = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => {
    return $activeSnapPoint === $snapPoints?.[$snapPoints.length - 1];
  });
  const shouldFade = derived([snapPoints, fadeFromIndex, activeSnapPoint], ([$snapPoints, $fadeFromIndex, $activeSnapPoint]) => {
    return $snapPoints && $snapPoints.length > 0 && ($fadeFromIndex || $fadeFromIndex === 0) && !Number.isNaN($fadeFromIndex) && $snapPoints[$fadeFromIndex] === $activeSnapPoint || !$snapPoints;
  });
  const activeSnapPointIndex = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? null);
  const snapPointsOffset = derived(snapPoints, ($snapPoints) => {
    if ($snapPoints) {
      return $snapPoints.map((snapPoint) => {
        const hasWindow = typeof window !== "undefined";
        const isPx = typeof snapPoint === "string";
        let snapPointAsNumber = 0;
        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }
        const $direction = get(direction);
        if (isVertical($direction)) {
          const height = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerHeight : 0;
          if (hasWindow) {
            return $direction === "bottom" ? window.innerHeight - height : window.innerHeight + height;
          }
          return height;
        }
        const width = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerWidth : 0;
        if (hasWindow) {
          return $direction === "right" ? window.innerWidth - width : window.innerWidth + width;
        }
        return width;
      });
    }
    return [];
  });
  const activeSnapPointOffset = derived([snapPointsOffset, activeSnapPointIndex], ([$snapPointsOffset, $activeSnapPointIndex]) => $activeSnapPointIndex !== null ? $snapPointsOffset?.[$activeSnapPointIndex] : null);
  effect([activeSnapPoint, drawerRef], ([$activeSnapPoint, $drawerRef]) => {
    if ($activeSnapPoint && $drawerRef) {
      const $snapPoints = get(snapPoints);
      const $snapPointsOffset = get(snapPointsOffset);
      const newIndex = $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? -1;
      if ($snapPointsOffset && newIndex !== -1 && typeof $snapPointsOffset[newIndex] === "number") {
        snapToPoint($snapPointsOffset[newIndex]);
      }
    }
  });
  function snapToPoint(dimension) {
    tick().then(() => {
      const $snapPointsOffset = get(snapPointsOffset);
      const newSnapPointIndex = $snapPointsOffset?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;
      const $drawerRef = get(drawerRef);
      const $direction = get(direction);
      onSnapPointChange(newSnapPointIndex);
      set($drawerRef, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `translate3d(0, ${dimension}px, 0)` : `translate3d(${dimension}px, 0, 0)`
      });
      const $fadeFromIndex = get(fadeFromIndex);
      const $overlayRef = get(overlayRef);
      if (snapPointsOffset && newSnapPointIndex !== $snapPointsOffset.length - 1 && newSnapPointIndex !== $fadeFromIndex) {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "0"
        });
      } else {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "1"
        });
      }
      activeSnapPoint.update(() => {
        const $snapPoints = get(snapPoints);
        if (newSnapPointIndex === null || !$snapPoints)
          return null;
        return $snapPoints[newSnapPointIndex];
      });
    });
  }
  function onRelease({ draggedDistance, closeDrawer, velocity, dismissible }) {
    const $fadeFromIndex = get(fadeFromIndex);
    if ($fadeFromIndex === void 0)
      return;
    const $activeSnapPointOffset = get(activeSnapPointOffset);
    const $activeSnapPointIndex = get(activeSnapPointIndex);
    const $overlayRef = get(overlayRef);
    const $snapPointsOffset = get(snapPointsOffset);
    const $snapPoints = get(snapPoints);
    const $direction = get(direction);
    const currentPosition = $direction === "bottom" || $direction === "right" ? ($activeSnapPointOffset ?? 0) - draggedDistance : ($activeSnapPointOffset ?? 0) + draggedDistance;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isFirst = $activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;
    if (isOverlaySnapPoint) {
      set($overlayRef, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
    if (velocity > 2 && !hasDraggedUp) {
      if (dismissible)
        closeDrawer();
      else
        snapToPoint($snapPointsOffset[0]);
      return;
    }
    if (velocity > 2 && hasDraggedUp && $snapPointsOffset && $snapPoints) {
      snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
      return;
    }
    const closestSnapPoint = $snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== "number" || typeof curr !== "number")
        return prev;
      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1;
      if (dragDirection > 0 && get(isLastSnapPoint) && $snapPoints) {
        snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
        return;
      }
      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }
      if ($activeSnapPointIndex === null)
        return;
      snapToPoint($snapPointsOffset[$activeSnapPointIndex + dragDirection]);
      return;
    }
    snapToPoint(closestSnapPoint);
  }
  function onDrag({ draggedDistance }) {
    const $drawerRef = get(drawerRef);
    const $activeSnapPointOffset = get(activeSnapPointOffset);
    if ($activeSnapPointOffset === null)
      return;
    const $snapPointsOffset = get(snapPointsOffset);
    const $direction = get(direction);
    const newValue = $direction === "bottom" || $direction === "right" ? $activeSnapPointOffset - draggedDistance : $activeSnapPointOffset + draggedDistance;
    const lastSnapPoint = $snapPointsOffset[$snapPointsOffset.length - 1];
    if (isBottomOrRight($direction) && newValue < lastSnapPoint) {
      return;
    }
    if (!isBottomOrRight($direction) && newValue > lastSnapPoint) {
      return;
    }
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${newValue}px, 0)` : `translate3d(${newValue}px, 0, 0)`
    });
  }
  function getPercentageDragged(absDraggedDistance, isDraggingDown) {
    const $activeSnapPointIndex = get(activeSnapPointIndex);
    const $snapPointsOffset = get(snapPointsOffset);
    const $snapPoints = get(snapPoints);
    const $fadeFromIndex = get(fadeFromIndex);
    if (!$snapPoints || typeof $activeSnapPointIndex !== "number" || !$snapPointsOffset || $fadeFromIndex === void 0)
      return null;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = $activeSnapPointIndex >= $fadeFromIndex;
    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }
    if (isOverlaySnapPoint && !isDraggingDown)
      return 1;
    if (!get(shouldFade) && !isOverlaySnapPoint)
      return null;
    const targetSnapPointIndex = isOverlaySnapPoint ? $activeSnapPointIndex + 1 : $activeSnapPointIndex - 1;
    const snapPointDistance = isOverlaySnapPoint ? $snapPointsOffset[targetSnapPointIndex] - $snapPointsOffset[targetSnapPointIndex - 1] : $snapPointsOffset[targetSnapPointIndex + 1] - $snapPointsOffset[targetSnapPointIndex];
    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);
    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }
  function onSnapPointChange(activeSnapPointIndex2) {
    const $snapPoints = get(snapPoints);
    const $snapPointsOffset = get(snapPointsOffset);
    if ($snapPoints && activeSnapPointIndex2 === $snapPointsOffset.length - 1) {
      openTime.set(/* @__PURE__ */ new Date());
    }
  }
  return {
    isLastSnapPoint,
    shouldFade,
    getPercentageDragged,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset
  };
}
function isMac() {
  return testPlatform(/^Mac/);
}
function isIPhone() {
  return testPlatform(/^iPhone/);
}
function isIPad() {
  return testPlatform(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator.platform) : void 0;
}
const visualViewport = typeof document !== "undefined" && window.visualViewport;
function isScrollable(node) {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
function getScrollParent(node) {
  if (isScrollable(node)) {
    node = node.parentElement;
  }
  while (node && !isScrollable(node)) {
    node = node.parentElement;
  }
  return node || document.scrollingElement || document.documentElement;
}
let preventScrollCount = 0;
let restore;
function preventScroll() {
  if (typeof document === "undefined")
    return () => {
    };
  preventScrollCount++;
  if (preventScrollCount === 1) {
    if (isIOS()) {
      restore = preventScrollMobileSafari();
    } else {
      restore = preventScrollStandard();
    }
  }
  return () => {
    preventScrollCount--;
    if (preventScrollCount === 0) {
      restore();
    }
  };
}
function getPaddingProperty(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function setCSSProperty(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function preventScrollStandard() {
  if (typeof document === "undefined")
    return () => {
    };
  const win = document.defaultView ?? window;
  const { documentElement, body } = document;
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  return chain(setScrollbarWidthProperty(), setStyle(body, paddingProperty, `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`), setStyle(body, "overflow", "hidden"));
}
function preventScrollMobileSafari() {
  let scrollable;
  let lastY = 0;
  const { documentElement, body, activeElement } = document;
  function onTouchStart(e) {
    scrollable = getScrollParent(e.target);
    if (scrollable === documentElement && scrollable === body)
      return;
    lastY = e.changedTouches[0].pageY;
  }
  function onTouchMove(e) {
    if (!scrollable || scrollable === documentElement || scrollable === body) {
      e.preventDefault();
      return;
    }
    const y = e.changedTouches[0].pageY;
    const scrollTop = scrollable.scrollTop;
    const bottom = scrollable.scrollHeight - scrollable.clientHeight;
    if (bottom === 0)
      return;
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) {
      e.preventDefault();
    }
    lastY = y;
  }
  function onTouchEnd(e) {
    const target = e.target;
    if (!(isInput(target) && target !== activeElement))
      return;
    e.preventDefault();
    target.style.transform = "translateY(-2000px)";
    target.focus();
    requestAnimationFrame(() => {
      target.style.transform = "";
    });
  }
  function onFocus(e) {
    const target = e.target;
    if (!isInput(target))
      return;
    target.style.transform = "translateY(-2000px)";
    requestAnimationFrame(() => {
      target.style.transform = "";
      if (visualViewport) {
        if (visualViewport.height < window.innerHeight) {
          requestAnimationFrame(() => {
            scrollIntoView(target);
          });
        } else {
          visualViewport.addEventListener("resize", () => scrollIntoView(target), { once: true });
        }
      }
    });
  }
  function onWindowScroll() {
    window.scrollTo(0, 0);
  }
  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;
  const restoreStyles = chain(
    setStyle(documentElement, "paddingRight", `${window.innerWidth - documentElement.clientWidth}px`),
    setStyle(documentElement, "overflow", "hidden")
    // setStyle(document.body, 'marginTop', `-${scrollY}px`),
  );
  window.scrollTo(0, 0);
  const removeEvents = chain(addEventListener(document, "touchstart", onTouchStart, { passive: false, capture: true }), addEventListener(document, "touchmove", onTouchMove, { passive: false, capture: true }), addEventListener(document, "touchend", onTouchEnd, { passive: false, capture: true }), addEventListener(document, "focus", onFocus, true), addEventListener(window, "scroll", onWindowScroll));
  return () => {
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}
function setStyle(element2, style, value) {
  const cur = element2.style[style];
  element2.style[style] = value;
  return () => {
    element2.style[style] = cur;
  };
}
function scrollIntoView(target) {
  const { documentElement, body, scrollingElement } = document;
  const root = scrollingElement || documentElement;
  while (target && target !== root) {
    const scrollable = getScrollParent(target);
    if (scrollable !== documentElement && scrollable !== body && scrollable !== target) {
      const scrollableTop = scrollable.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const targetBottom = target.getBoundingClientRect().bottom;
      const keyboardHeight = scrollable.getBoundingClientRect().bottom;
      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    target = scrollable.parentElement;
  }
}
const documentEscapeKeyStore = readable(void 0, (set2) => {
  function keydown(event) {
    if (event && event.key === "Escape") {
      set2(event);
    }
    set2(void 0);
  }
  const unsubscribe = addEventListener(document, "keydown", keydown, {
    passive: false
  });
  return unsubscribe;
});
function handleEscapeKeydown(node, handler) {
  let unsub = noop;
  function update(handler2) {
    unsub();
    unsub = chain(
      // Handle escape keydowns
      documentEscapeKeyStore.subscribe((e) => {
        if (!e)
          return;
        const target = e.target;
        if (!isHTMLElement(target) || target.closest("[data-escapee]") !== node) {
          return;
        }
        e.preventDefault();
        handler2(e);
      })
    );
    node.setAttribute("data-escapee", "");
  }
  update(handler);
  return () => {
    unsub();
    node.removeAttribute("data-escapee");
  };
}
function isHTMLElement(el) {
  return el instanceof HTMLElement;
}
let previousBodyPosition = null;
function handlePositionFixed({ isOpen, modal, nested, hasBeenOpened }) {
  const activeUrl = writable(typeof window !== "undefined" ? window.location.href : "");
  let scrollPos = 0;
  function setPositionFixed(open) {
    if (!(previousBodyPosition === null && open))
      return;
    previousBodyPosition = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      height: document.body.style.height
    };
    const { scrollX, innerHeight } = window;
    document.body.style.setProperty("position", "fixed", "important");
    document.body.style.top = `${-scrollPos}px`;
    document.body.style.left = `${-scrollX}px`;
    document.body.style.right = "0px";
    document.body.style.height = "auto";
    setTimeout(() => requestAnimationFrame(() => {
      const bottomBarHeight = innerHeight - window.innerHeight;
      if (bottomBarHeight && scrollPos >= innerHeight) {
        document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
      }
    }), 300);
  }
  function restorePositionSetting() {
    if (previousBodyPosition === null)
      return;
    const $activeUrl = get(activeUrl);
    const y = -parseInt(document.body.style.top, 10);
    const x = -parseInt(document.body.style.left, 10);
    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;
    document.body.style.height = previousBodyPosition.height;
    document.body.style.right = "unset";
    requestAnimationFrame(() => {
      if ($activeUrl !== window.location.href) {
        activeUrl.set(window.location.href);
        return;
      }
      window.scrollTo(x, y);
    });
    previousBodyPosition = null;
  }
  effect([isOpen, activeUrl], ([$isOpen, _]) => {
    if (typeof document === "undefined")
      return;
    if (get(nested) || !get(hasBeenOpened))
      return;
    if ($isOpen) {
      setPositionFixed($isOpen);
      if (!get(modal)) {
        setTimeout(() => {
          restorePositionSetting();
        }, 500);
      }
    } else {
      restorePositionSetting();
    }
  });
  return { restorePositionSetting };
}
const CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const BORDER_RADIUS = 8;
const NESTED_DISPLACEMENT = 16;
const WINDOW_TOP_OFFSET = 26;
const DRAG_CLASS = "vaul-dragging";
const openDrawerIds = writable([]);
const defaultProps = {
  closeThreshold: CLOSE_THRESHOLD,
  shouldScaleBackground: true,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
  onDrag: void 0,
  onRelease: void 0,
  snapPoints: void 0,
  fadeFromIndex: void 0,
  defaultActiveSnapPoint: void 0,
  onActiveSnapPointChange: void 0,
  defaultOpen: false,
  onOpenChange: void 0,
  fixed: void 0,
  dismissible: true,
  modal: true,
  nested: false,
  onClose: void 0,
  direction: "bottom"
};
const omittedOptions = [
  "defaultOpen",
  "onOpenChange",
  "defaultActiveSnapPoint",
  "onActiveSnapPointChange",
  "onDrag",
  "onRelease",
  "onClose"
];
function createVaul(props) {
  const { snapPoints: snapPointsProp, fadeFromIndex: fadeFromIndexProp = snapPointsProp && snapPointsProp.length - 1, ...withDefaults } = { ...defaultProps, ...removeUndefined(props) };
  const options = toWritableStores(omit({
    ...withDefaults,
    snapPoints: snapPointsProp,
    fadeFromIndex: fadeFromIndexProp
  }, ...omittedOptions));
  const triggerRef = writable(void 0);
  const { onDrag: onDragProp, onRelease: onReleaseProp, onClose, onOpenChange } = withDefaults;
  const { snapPoints, fadeFromIndex, fixed, dismissible, modal, nested, shouldScaleBackground, scrollLockTimeout, closeThreshold, direction } = options;
  const openStore = writable(withDefaults.defaultOpen);
  const isOpen = overridable(openStore, withDefaults.onOpenChange);
  const hasBeenOpened = writable(false);
  const visible = writable(false);
  const justReleased = writable(false);
  const overlayRef = writable(void 0);
  const openTime = writable(null);
  const keyboardIsOpen = writable(false);
  const drawerRef = writable(void 0);
  const drawerId = writable(void 0);
  let isDragging = false;
  let dragStartTime = null;
  let isClosing = false;
  let pointerStart = 0;
  let dragEndTime = null;
  let lastTimeDragPrevented = null;
  let isAllowedToDrag = false;
  let drawerHeightRef = get(drawerRef)?.getBoundingClientRect().height || 0;
  let previousDiffFromInitial = 0;
  let initialDrawerHeight = 0;
  let nestedOpenChangeTimer = null;
  const activeSnapPoint = overridable(writable(withDefaults.defaultActiveSnapPoint), withDefaults.onActiveSnapPointChange);
  const { activeSnapPointIndex, getPercentageDragged: getSnapPointsPercentageDragged, onDrag: onDragSnapPoints, onRelease: onReleaseSnapPoints, shouldFade, snapPointsOffset } = handleSnapPoints({
    snapPoints,
    activeSnapPoint,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    openTime,
    direction
  });
  const getContentStyle = derived([snapPointsOffset], ([$snapPointsOffset]) => {
    return (style = "") => {
      if ($snapPointsOffset && $snapPointsOffset.length > 0) {
        const styleProp = styleToString({
          "--snap-point-height": `${$snapPointsOffset[0]}px`
        });
        return style + styleProp;
      }
      return style;
    };
  });
  effect([drawerRef], ([$drawerRef]) => {
    if ($drawerRef) {
      drawerId.set($drawerRef.id);
    }
  });
  effect([isOpen], ([$open]) => {
    sleep(100).then(() => {
      const id = get(drawerId);
      if ($open && id) {
        openDrawerIds.update((prev) => {
          if (prev.includes(id)) {
            return prev;
          }
          prev.push(id);
          return prev;
        });
      } else {
        openDrawerIds.update((prev) => prev.filter((id2) => id2 !== id2));
      }
    });
  });
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen && get(shouldScaleBackground)) {
      const id = setTimeout(() => {
        reset(document.body, "background");
      }, 200);
      return () => clearTimeout(id);
    }
  });
  effect([isOpen], ([$isOpen]) => {
    let unsub = () => {
    };
    if ($isOpen) {
      unsub = preventScroll();
    }
    return unsub;
  });
  const { restorePositionSetting } = handlePositionFixed({ isOpen, modal, nested, hasBeenOpened });
  effect([drawerRef], ([$drawerRef]) => {
    let unsub = noop;
    if ($drawerRef) {
      unsub = handleEscapeKeydown($drawerRef, () => {
        closeDrawer(true);
      });
    }
    return () => {
      unsub();
    };
  });
  function openDrawer() {
    if (isClosing)
      return;
    hasBeenOpened.set(true);
    isOpen.set(true);
  }
  function onPress(event) {
    const $drawerRef = get(drawerRef);
    if (!get(dismissible) && !get(snapPoints))
      return;
    if ($drawerRef && !$drawerRef.contains(event.target))
      return;
    drawerHeightRef = $drawerRef?.getBoundingClientRect().height || 0;
    isDragging = true;
    dragStartTime = /* @__PURE__ */ new Date();
    if (isIOS()) {
      window.addEventListener("touchend", () => isAllowedToDrag = false, { once: true });
    }
    event.target.setPointerCapture(event.pointerId);
    pointerStart = isVertical(get(direction)) ? event.screenY : event.screenX;
  }
  function shouldDrag(el, isDraggingInDirection) {
    const $drawerRef = get(drawerRef);
    let element2 = el;
    const highlightedText = window.getSelection()?.toString();
    const $direction = get(direction);
    const swipeAmount = $drawerRef ? getTranslate($drawerRef, $direction) : null;
    const date = /* @__PURE__ */ new Date();
    if (element2.hasAttribute("data-vaul-no-drag") || element2.closest("[data-vaul-no-drag]")) {
      return false;
    }
    const $openTime = get(openTime);
    if ($openTime && date.getTime() - $openTime.getTime() < 500) {
      return false;
    }
    if (swipeAmount !== null) {
      if ($direction === "bottom" || $direction === "right" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }
    if (swipeAmount !== null && swipeAmount > 0) {
      return true;
    }
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }
    const $scrollLockTimeout = get(scrollLockTimeout);
    if (lastTimeDragPrevented && date.getTime() - lastTimeDragPrevented.getTime() < $scrollLockTimeout && swipeAmount === 0) {
      lastTimeDragPrevented = date;
      return false;
    }
    if (isDraggingInDirection) {
      lastTimeDragPrevented = date;
      return false;
    }
    while (element2) {
      if (element2.scrollHeight > element2.clientHeight) {
        if (element2.scrollTop !== 0) {
          lastTimeDragPrevented = /* @__PURE__ */ new Date();
          return false;
        }
        if (element2.getAttribute("role") === "dialog") {
          return true;
        }
      }
      element2 = element2.parentNode;
    }
    return true;
  }
  function onDrag(event) {
    const $drawerRef = get(drawerRef);
    if (!$drawerRef || !isDragging)
      return;
    const $direction = get(direction);
    const directionMultiplier = getDirectionMultiplier($direction);
    const draggedDistance = getDistanceMoved(pointerStart, $direction, event) * directionMultiplier;
    const isDraggingInDirection = draggedDistance > 0;
    const $activeSnapPointIndex = get(activeSnapPointIndex);
    const $snapPoints = get(snapPoints);
    if ($snapPoints && $activeSnapPointIndex === 0 && !get(dismissible))
      return;
    if (!isAllowedToDrag && !shouldDrag(event.target, isDraggingInDirection)) {
      return;
    }
    $drawerRef.classList.add(DRAG_CLASS);
    isAllowedToDrag = true;
    set($drawerRef, {
      transition: "none"
    });
    const $overlayRef = get(overlayRef);
    set($overlayRef, {
      transition: "none"
    });
    if ($snapPoints) {
      onDragSnapPoints({ draggedDistance });
    }
    if (isDraggingInDirection && !$snapPoints) {
      const dampenedDraggedDistance = dampenValue(draggedDistance);
      const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
      return;
    }
    const absDraggedDistance = Math.abs(draggedDistance);
    let percentageDragged = absDraggedDistance / drawerHeightRef;
    const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingInDirection);
    if (snapPointPercentageDragged !== null) {
      percentageDragged = snapPointPercentageDragged;
    }
    const opacityValue = 1 - percentageDragged;
    const $fadeFromIndex = get(fadeFromIndex);
    const $shouldFade = get(shouldFade);
    if ($shouldFade || $fadeFromIndex && $activeSnapPointIndex === $fadeFromIndex - 1) {
      onDragProp?.(event, percentageDragged);
      set($overlayRef, {
        opacity: `${opacityValue}`,
        transition: "none"
      }, true);
    }
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (wrapper && $overlayRef && get(shouldScaleBackground)) {
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
      const borderRadiusValue = 8 - percentageDragged * 8;
      const translateValue = Math.max(0, 14 - percentageDragged * 14);
      set(wrapper, {
        borderRadius: `${borderRadiusValue}px`,
        transform: isVertical($direction) ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)` : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
        transition: "none"
      }, true);
    }
    if (!$snapPoints) {
      const translateValue = absDraggedDistance * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
    }
  }
  function scaleBackground(open, backgroundColor = "black") {
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (!wrapper || !get(shouldScaleBackground))
      return;
    const $direction = get(direction);
    if (open) {
      set(document.body, {
        background: document.body.style.backgroundColor || document.body.style.background
      });
      set(document.body, {
        background: backgroundColor
      }, true);
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    } else {
      reset(wrapper, "overflow");
      reset(wrapper, "transform");
      reset(wrapper, "borderRadius");
      set(wrapper, {
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
  }
  effect([activeSnapPointIndex, snapPoints, snapPointsOffset], ([$activeSnapPointIndex, $snapPoints, $snapPointsOffset]) => {
    function onVisualViewportChange() {
      const $drawerRef = get(drawerRef);
      if (!$drawerRef)
        return;
      const $keyboardIsOpen = get(keyboardIsOpen);
      const focusedElement = document.activeElement;
      if (isInput(focusedElement) || $keyboardIsOpen) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        let diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = $drawerRef.getBoundingClientRect().height || 0;
        if (!initialDrawerHeight) {
          initialDrawerHeight = drawerHeight;
        }
        const offsetFromTop = $drawerRef.getBoundingClientRect().top;
        if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) {
          keyboardIsOpen.set(!$keyboardIsOpen);
        }
        if ($snapPoints && $snapPoints.length > 0 && $snapPointsOffset && $activeSnapPointIndex) {
          const activeSnapPointHeight = $snapPointsOffset[$activeSnapPointIndex] || 0;
          diffFromInitial += activeSnapPointHeight;
        }
        previousDiffFromInitial = diffFromInitial;
        if (drawerHeight > visualViewportHeight || $keyboardIsOpen) {
          const height = $drawerRef.getBoundingClientRect().height;
          let newDrawerHeight = height;
          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
          }
          if (get(fixed)) {
            $drawerRef.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            $drawerRef.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else {
          $drawerRef.style.height = `${initialDrawerHeight}px`;
        }
        if ($snapPoints && $snapPoints.length > 0 && !$keyboardIsOpen) {
          $drawerRef.style.bottom = `0px`;
        } else {
          $drawerRef.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }
    let removeListener = noop;
    if (window.visualViewport) {
      removeListener = addEventListener(window.visualViewport, "resize", onVisualViewportChange);
    }
    return () => {
      removeListener();
    };
  });
  function closeDrawer(withKeyboard = false) {
    if (isClosing)
      return;
    const $drawerRef = get(drawerRef);
    if (!$drawerRef)
      return;
    const $direction = get(direction);
    onClose?.();
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${$direction === "bottom" ? "100%" : "-100%"}, 0)` : `translate3d(${$direction === "right" ? "100%" : "-100%"}, 0, 0)`,
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set(get(overlayRef), {
      opacity: "0",
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    scaleBackground(false);
    isClosing = true;
    setTimeout(() => {
      visible.set(false);
      isOpen.set(false);
      isClosing = false;
      if (withKeyboard) {
        get(triggerRef)?.focus();
      }
    }, 300);
    const $snapPoints = get(snapPoints);
    setTimeout(() => {
      reset(document.documentElement, "scrollBehavior");
      if ($snapPoints) {
        activeSnapPoint.set($snapPoints[0]);
      }
    }, TRANSITIONS.DURATION * 1e3);
  }
  effect([isOpen], ([$isOpen]) => {
    if ($isOpen) {
      hasBeenOpened.set(true);
    } else {
      closeDrawer();
    }
  });
  function resetDrawer() {
    const $drawerRef = get(drawerRef);
    if (!$drawerRef)
      return;
    const $overlayRef = get(overlayRef);
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    const $direction = get(direction);
    const currentSwipeAmount = getTranslate($drawerRef, $direction);
    set($drawerRef, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set($overlayRef, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      opacity: "1"
    });
    const $shouldScaleBackground = get(shouldScaleBackground);
    const $isOpen = get(isOpen);
    if ($shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && $isOpen) {
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      }, true);
    }
  }
  function onRelease(event) {
    const $drawerRef = get(drawerRef);
    if (!isDragging || !$drawerRef)
      return;
    if (isAllowedToDrag && isInput(event.target)) {
      event.target.blur();
    }
    $drawerRef.classList.remove(DRAG_CLASS);
    isAllowedToDrag = false;
    isDragging = false;
    dragEndTime = /* @__PURE__ */ new Date();
    const $direction = get(direction);
    const swipeAmount = getTranslate($drawerRef, $direction);
    if (event.target && !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return;
    if (dragStartTime === null)
      return;
    const timeTaken = dragEndTime.getTime() - dragStartTime.getTime();
    const distMoved = getDistanceMoved(pointerStart, $direction, event);
    const velocity = Math.abs(distMoved) / timeTaken;
    if (velocity > 0.05) {
      justReleased.set(true);
      setTimeout(() => {
        justReleased.set(false);
      }, 200);
    }
    if (get(snapPoints)) {
      onReleaseSnapPoints({
        draggedDistance: distMoved * getDirectionMultiplier($direction),
        closeDrawer,
        velocity,
        dismissible: get(dismissible)
      });
      onReleaseProp?.(event, true);
      return;
    }
    if ($direction === "bottom" || $direction === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      onReleaseProp?.(event, true);
      return;
    }
    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    const visibleDrawerHeight = Math.min(get(drawerRef)?.getBoundingClientRect().height ?? 0, window.innerHeight);
    if (swipeAmount >= visibleDrawerHeight * get(closeThreshold)) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    onReleaseProp?.(event, true);
    resetDrawer();
  }
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen)
      return;
    if (isBrowser) {
      set(document.documentElement, {
        scrollBehavior: "auto"
      });
    }
    openTime.set(/* @__PURE__ */ new Date());
    scaleBackground(true, props.backgroundColor);
  });
  effect([visible], ([$visible]) => {
    if (!$visible)
      return;
    const $drawerRef = get(drawerRef);
    if (!$drawerRef)
      return;
    const children = $drawerRef.querySelectorAll("*");
    children.forEach((child) => {
      const htmlChild = child;
      if (htmlChild.scrollHeight > htmlChild.clientHeight || htmlChild.scrollWidth > htmlChild.clientWidth) {
        htmlChild.classList.add("vaul-scrollable");
      }
    });
  });
  function onNestedOpenChange(o) {
    const $drawerRef = get(drawerRef);
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;
    if (nestedOpenChangeTimer) {
      window.clearTimeout(nestedOpenChangeTimer);
    }
    set($drawerRef, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: `scale(${scale}) translate3d(0, ${y}px, 0)`
    });
    if (!o && $drawerRef) {
      nestedOpenChangeTimer = setTimeout(() => {
        const $direction = get(direction);
        const translateValue = getTranslate($drawerRef, $direction);
        set($drawerRef, {
          transition: "none",
          transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        });
      }, 500);
    }
  }
  function onNestedDrag(_, percentageDragged) {
    if (percentageDragged < 0)
      return;
    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;
    const $direction = get(direction);
    set(get(drawerRef), {
      transform: isVertical($direction) ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)` : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: "none"
    });
  }
  function onNestedRelease(_, o) {
    const $direction = get(direction);
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    const scale = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
    const translate = o ? -NESTED_DISPLACEMENT : 0;
    if (o) {
      set(get(drawerRef), {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `scale(${scale}) translate3d(0, ${translate}px, 0)` : `scale(${scale}) translate3d(${translate}px, 0, 0)`
      });
    }
  }
  return {
    states: {
      isOpen,
      hasBeenOpened,
      snapPoints,
      activeSnapPoint,
      snapPointsOffset,
      keyboardIsOpen,
      shouldFade,
      visible,
      drawerId,
      openDrawerIds
    },
    helpers: {
      getContentStyle
    },
    methods: {
      closeDrawer,
      onOpenChange,
      onPress,
      onRelease,
      onDrag,
      scaleBackground,
      onNestedDrag,
      onNestedOpenChange,
      onNestedRelease,
      restorePositionSetting,
      openDrawer
    },
    refs: {
      drawerRef,
      overlayRef,
      triggerRef
    },
    options
  };
}
function dampenValue(v) {
  return 8 * (Math.log(v + 1) - 2);
}
function getScale() {
  return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
}
function getDistanceMoved(pointerStart, direction, event) {
  if (event.type.startsWith("touch")) {
    return getDistanceMovedForTouch(pointerStart, direction, event);
  } else {
    return getDistanceMovedForPointer(pointerStart, direction, event);
  }
}
function getDistanceMovedForPointer(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.screenY : event.screenX);
}
function getDistanceMovedForTouch(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.changedTouches[0].screenY : event.changedTouches[0].screenX);
}
function getDirectionMultiplier(direction) {
  return direction === "bottom" || direction === "right" ? 1 : -1;
}
const VAUL_ROOT = Symbol("VAUL_ROOT");
function setCtx(props = {}) {
  const vaul = createVaul(props);
  const updateOption = getOptionUpdater(vaul.options);
  setContext(VAUL_ROOT, { ...vaul, updateOption });
  return {
    ...vaul,
    updateOption
  };
}
function getCtx() {
  return getContext(VAUL_ROOT);
}
function Root($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "open",
    "onOpenChange",
    "closeThreshold",
    "scrollLockTimeout",
    "snapPoints",
    "fadeFromIndex",
    "openFocus",
    "onOutsideClick",
    "closeOnOutsideClick",
    "backgroundColor",
    "nested",
    "shouldScaleBackground",
    "activeSnapPoint",
    "onActiveSnapPointChange",
    "onRelease",
    "onDrag",
    "onClose",
    "dismissible",
    "direction"
  ]);
  push();
  var $$store_subs;
  let open = value_or_fallback($$props["open"], () => false);
  let onOpenChange = value_or_fallback($$props["onOpenChange"], () => void 0);
  let closeThreshold = value_or_fallback($$props["closeThreshold"], () => void 0);
  let scrollLockTimeout = value_or_fallback($$props["scrollLockTimeout"], () => void 0);
  let snapPoints = value_or_fallback($$props["snapPoints"], () => void 0);
  let fadeFromIndex = value_or_fallback($$props["fadeFromIndex"], () => void 0);
  let openFocus = value_or_fallback($$props["openFocus"], () => void 0);
  let onOutsideClick = value_or_fallback($$props["onOutsideClick"], () => void 0);
  let closeOnOutsideClick = value_or_fallback($$props["closeOnOutsideClick"], () => true);
  let backgroundColor = value_or_fallback($$props["backgroundColor"], () => "black");
  let nested = value_or_fallback($$props["nested"], () => false);
  let shouldScaleBackground = value_or_fallback($$props["shouldScaleBackground"], () => false);
  let activeSnapPoint = value_or_fallback($$props["activeSnapPoint"], () => void 0);
  let onActiveSnapPointChange = value_or_fallback($$props["onActiveSnapPointChange"], () => void 0);
  let onRelease = value_or_fallback($$props["onRelease"], () => void 0);
  let onDrag = value_or_fallback($$props["onDrag"], () => void 0);
  let onClose = value_or_fallback($$props["onClose"], () => void 0);
  let dismissible = value_or_fallback($$props["dismissible"], () => void 0);
  let direction = value_or_fallback($$props["direction"], () => "bottom");
  const {
    states: {
      keyboardIsOpen,
      activeSnapPoint: localActiveSnapPoint,
      drawerId,
      openDrawerIds: openDrawerIds2,
      isOpen
    },
    methods: { closeDrawer, openDrawer },
    options: { dismissible: localDismissible },
    updateOption
  } = setCtx({
    defaultOpen: open,
    defaultActiveSnapPoint: activeSnapPoint,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    },
    onActiveSnapPointChange: ({ next }) => {
      if (next === void 0 && snapPoints && activeSnapPoint !== next) {
        const newNext = snapPoints[0];
        onActiveSnapPointChange?.(newNext);
        activeSnapPoint = newNext;
        return newNext;
      }
      if (activeSnapPoint !== next) {
        onActiveSnapPointChange?.(next);
        activeSnapPoint = next;
      }
      return next;
    },
    closeThreshold,
    scrollLockTimeout,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapPoints,
    fadeFromIndex,
    nested,
    onDrag,
    onClose,
    onRelease,
    shouldScaleBackground,
    backgroundColor,
    dismissible,
    direction
  });
  activeSnapPoint !== void 0 && localActiveSnapPoint.set(activeSnapPoint);
  updateOption("closeThreshold", closeThreshold);
  updateOption("scrollLockTimeout", scrollLockTimeout);
  updateOption("snapPoints", snapPoints);
  updateOption("fadeFromIndex", fadeFromIndex);
  updateOption("openFocus", openFocus);
  updateOption("shouldScaleBackground", shouldScaleBackground);
  updateOption("backgroundColor", backgroundColor);
  updateOption("dismissible", dismissible);
  updateOption("direction", direction);
  open && !store_get($$store_subs ??= {}, "$isOpen", isOpen) && openDrawer();
  !open && store_get($$store_subs ??= {}, "$isOpen", isOpen) && closeDrawer();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Dialog($$payload2, spread_props([
      {
        closeOnOutsideClick,
        closeOnEscape: false,
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        preventScroll: false,
        onOpenChange: (o) => {
          onOpenChange?.(o);
          if (!o) {
            closeDrawer();
          } else if (o) {
            openDrawer();
          }
        },
        onOutsideClick: (e) => {
          if (!closeOnOutsideClick) return;
          onOutsideClick?.(e);
          if (e?.defaultPrevented) return;
          if (store_get($$store_subs ??= {}, "$keyboardIsOpen", keyboardIsOpen)) {
            keyboardIsOpen.set(false);
          }
          e.preventDefault();
          if (!store_get($$store_subs ??= {}, "$localDismissible", localDismissible)) {
            return;
          }
          const $openDialogIds = get(openDrawerIds2);
          const isLast = $openDialogIds[$openDialogIds.length - 1] === get(drawerId);
          if (isLast) {
            onOpenChange?.(false);
            closeDrawer();
          }
        }
      },
      $$restProps,
      {
        children: ($$payload3, $$slotProps) => {
          $$payload3.out += `<!--[-->`;
          slot($$payload3, default_slot($$props), {}, null);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    open,
    onOpenChange,
    closeThreshold,
    scrollLockTimeout,
    snapPoints,
    fadeFromIndex,
    openFocus,
    onOutsideClick,
    closeOnOutsideClick,
    backgroundColor,
    nested,
    shouldScaleBackground,
    activeSnapPoint,
    onActiveSnapPointChange,
    onRelease,
    onDrag,
    onClose,
    dismissible,
    direction
  });
  pop();
}
function Visible($$payload, $$props) {
  push();
  getCtx();
  pop();
}
function Content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["style"]);
  push();
  var $$store_subs;
  const {
    refs: { drawerRef },
    states: { visible },
    helpers: { getContentStyle },
    methods: { onPress, onDrag, onRelease },
    options: { direction }
  } = getCtx();
  let style = value_or_fallback($$props["style"], () => "");
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Dialog_content($$payload2, spread_props([
      {
        get el() {
          return store_get($$store_subs ??= {}, "$drawerRef", drawerRef);
        },
        set el($$value) {
          store_set(drawerRef, $$value);
          $$settled = false;
        },
        style: store_get($$store_subs ??= {}, "$getContentStyle", getContentStyle)(style),
        "data-vaul-drawer": "",
        "data-vaul-drawer-direction": store_get($$store_subs ??= {}, "$direction", direction),
        "data-vaul-drawer-visible": store_get($$store_subs ??= {}, "$visible", visible) ? "true" : "false"
      },
      $$restProps,
      {
        children: ($$payload3, $$slotProps) => {
          $$payload3.out += `<!--[-->`;
          Visible();
          $$payload3.out += `<!--]--> <!--[-->`;
          slot($$payload3, default_slot($$props), {}, null);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { style });
  pop();
}
function Overlay($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, []);
  push();
  var $$store_subs;
  let hasSnapPoints;
  const {
    refs: { overlayRef },
    states: { isOpen, visible, snapPoints, shouldFade },
    methods: { onRelease }
  } = getCtx();
  hasSnapPoints = store_get($$store_subs ??= {}, "$snapPoints", snapPoints) && store_get($$store_subs ??= {}, "$snapPoints", snapPoints).length > 0;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Dialog_overlay($$payload2, spread_props([
      {
        get el() {
          return store_get($$store_subs ??= {}, "$overlayRef", overlayRef);
        },
        set el($$value) {
          store_set(overlayRef, $$value);
          $$settled = false;
        },
        "data-vaul-drawer-visible": store_get($$store_subs ??= {}, "$visible", visible) ? "true" : "false",
        "data-vaul-overlay": "",
        "data-vaul-snap-points": store_get($$store_subs ??= {}, "$isOpen", isOpen) && hasSnapPoints ? "true" : "false",
        "data-vaul-snap-points-overlay": store_get($$store_subs ??= {}, "$isOpen", isOpen) && store_get($$store_subs ??= {}, "$shouldFade", shouldFade) ? "true" : "false"
      },
      $$restProps
    ]));
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Close_wrapper($$payload, $$props) {
  push();
  let _, rest;
  let meltBuilder = $$props["meltBuilder"];
  const { methods: { closeDrawer } } = getCtx();
  const wrappedAction = (node) => {
    const handleKeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeDrawer(true);
      }
    };
    const handleClick = () => {
      closeDrawer();
    };
    node.addEventListener("keydown", handleKeydown);
    node.addEventListener("click", handleClick);
    return () => {
      node.removeEventListener("keydown", handleKeydown);
      node.removeEventListener("click", handleClick);
    };
  };
  ({ _, ...rest } = meltBuilder);
  Object.assign(rest, { action: wrappedAction });
  $$payload.out += `<!--[-->`;
  slot(
    $$payload,
    default_slot($$props),
    {
      get newBuilder() {
        return rest;
      }
    },
    null
  );
  $$payload.out += `<!--]-->`;
  bind_props($$props, { meltBuilder });
  pop();
}
function Close$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["el", "asChild"]);
  push();
  let el = value_or_fallback($$props["el"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  getCtx();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    if (asChild) {
      $$payload2.out += `<!--[-->`;
      Dialog_close($$payload2, spread_props([
        {
          get el() {
            return el;
          },
          set el($$value) {
            el = $$value;
            $$settled = false;
          }
        },
        $$restProps,
        {
          asChild,
          children: ($$payload3, $$slotProps) => {
            const builder = $$slotProps.builder;
            $$payload3.out += `<!--[-->`;
            Close_wrapper($$payload3, {
              meltBuilder: builder,
              children: ($$payload4, $$slotProps2) => {
                const newBuilder = $$slotProps2.newBuilder;
                $$payload4.out += `<!--[-->`;
                slot(
                  $$payload4,
                  default_slot($$props),
                  {
                    get builder() {
                      return newBuilder;
                    }
                  },
                  null
                );
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload2.out += `<!--]-->`;
      $$payload2.out += "<!--]-->";
    } else {
      $$payload2.out += `<!--[-->`;
      Dialog_close($$payload2, spread_props([
        {
          get el() {
            return el;
          },
          set el($$value) {
            el = $$value;
            $$settled = false;
          }
        },
        $$restProps,
        {
          asChild,
          children: ($$payload3, $$slotProps) => {
            const builder = $$slotProps.builder;
            $$payload3.out += `<!--[-->`;
            slot(
              $$payload3,
              default_slot($$props),
              {
                get builder() {
                  return builder;
                }
              },
              null
            );
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload2.out += `<!--]-->`;
      $$payload2.out += "<!--]!-->";
    }
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { el, asChild });
  pop();
}
function Trigger_wrapper($$payload, $$props) {
  push();
  let action, rest;
  let meltBuilder = $$props["meltBuilder"];
  const { refs: { triggerRef } } = getCtx();
  const wrappedAction = (node) => {
    triggerRef.set(node);
    return action(node);
  };
  ({ action, ...rest } = meltBuilder);
  Object.assign(rest, { action: wrappedAction });
  $$payload.out += `<!--[-->`;
  slot(
    $$payload,
    default_slot($$props),
    {
      get newBuilder() {
        return rest;
      }
    },
    null
  );
  $$payload.out += `<!--]-->`;
  bind_props($$props, { meltBuilder });
  pop();
}
function Trigger$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["el", "asChild"]);
  push();
  const { refs: { triggerRef } } = getCtx();
  let el = value_or_fallback($$props["el"], () => void 0);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  if (el) {
    triggerRef.set(el);
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    if (asChild) {
      $$payload2.out += `<!--[-->`;
      Dialog_trigger($$payload2, spread_props([
        {
          asChild,
          get el() {
            return el;
          },
          set el($$value) {
            el = $$value;
            $$settled = false;
          }
        },
        $$restProps,
        {
          children: ($$payload3, $$slotProps) => {
            const builder = $$slotProps.builder;
            $$payload3.out += `<!--[-->`;
            Trigger_wrapper($$payload3, {
              meltBuilder: builder,
              children: ($$payload4, $$slotProps2) => {
                const newBuilder = $$slotProps2.newBuilder;
                $$payload4.out += `<!--[-->`;
                slot(
                  $$payload4,
                  default_slot($$props),
                  {
                    get builder() {
                      return newBuilder;
                    }
                  },
                  null
                );
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload2.out += `<!--]-->`;
      $$payload2.out += "<!--]-->";
    } else {
      $$payload2.out += `<!--[-->`;
      Dialog_trigger($$payload2, spread_props([
        {
          get el() {
            return el;
          },
          set el($$value) {
            el = $$value;
            $$settled = false;
          }
        },
        $$restProps,
        {
          children: ($$payload3, $$slotProps) => {
            const builder = $$slotProps.builder;
            $$payload3.out += `<!--[-->`;
            slot(
              $$payload3,
              default_slot($$props),
              {
                get builder() {
                  return builder;
                }
              },
              null
            );
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload2.out += `<!--]-->`;
      $$payload2.out += "<!--]!-->";
    }
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { el, asChild });
  pop();
}
const Portal = Dialog_portal;
const Title = Dialog_title;
function Drawer($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "shouldScaleBackground",
    "open",
    "activeSnapPoint"
  ]);
  let shouldScaleBackground = value_or_fallback($$props["shouldScaleBackground"], () => true);
  let open = value_or_fallback($$props["open"], () => false);
  let activeSnapPoint = value_or_fallback($$props["activeSnapPoint"], () => void 0);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Root($$payload2, spread_props([
      {
        closeThreshold: 0.1,
        shouldScaleBackground,
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        get activeSnapPoint() {
          return activeSnapPoint;
        },
        set activeSnapPoint($$value) {
          activeSnapPoint = $$value;
          $$settled = false;
        }
      },
      $$restProps,
      {
        children: ($$payload3, $$slotProps) => {
          $$payload3.out += `<!--[-->`;
          slot($$payload3, default_slot($$props), {}, null);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { shouldScaleBackground, open, activeSnapPoint });
}
function Drawer_overlay($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["el", "class"]);
  push();
  let el = value_or_fallback($$props["el"], () => void 0);
  let className = value_or_fallback($$props["class"], () => void 0);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Overlay($$payload2, spread_props([
      {
        get el() {
          return el;
        },
        set el($$value) {
          el = $$value;
          $$settled = false;
        },
        class: cn("fixed inset-0 z-50 bg-black/40", className)
      },
      $$restProps,
      {
        children: ($$payload3, $$slotProps) => {
          $$payload3.out += `<!--[-->`;
          slot($$payload3, default_slot($$props), {}, null);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { el, class: className });
  pop();
}
function Drawer_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<!--[-->`;
  Portal($$payload, {
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<!--[-->`;
      Drawer_overlay($$payload2, {});
      $$payload2.out += `<!--]--> <!--[-->`;
      Content($$payload2, spread_props([
        {
          class: cn("fixed inset-x-0 bottom-0 top-[25%] z-50 flex flex-col rounded-t-[10px] border-t bg-ds-background-200", className)
        },
        $$restProps,
        {
          children: ($$payload3, $$slotProps2) => {
            $$payload3.out += `<!--[-->`;
            slot($$payload3, default_slot($$props), {}, null);
            $$payload3.out += `<!--]-->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className });
  pop();
}
function Drawer_header($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["el", "class"]);
  push();
  let el = value_or_fallback($$props["el"], () => void 0);
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<div${spread_attributes({
    class: cn("flex items-center gap-1.5 p-4 justify-between border-b", className),
    ...$$restProps
  })}><!--[-->`;
  slot($$payload, default_slot($$props), {}, null);
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { el, class: className });
  pop();
}
function Drawer_title($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["el", "class"]);
  push();
  let el = value_or_fallback($$props["el"], () => void 0);
  let className = value_or_fallback($$props["class"], () => void 0);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!--[-->`;
    Title($$payload2, spread_props([
      {
        get el() {
          return el;
        },
        set el($$value) {
          el = $$value;
          $$settled = false;
        },
        class: cn("text-lg text-ds-gray-1000 font-semibold leading-none", className)
      },
      $$restProps,
      {
        children: ($$payload3, $$slotProps) => {
          $$payload3.out += `<!--[-->`;
          slot($$payload3, default_slot($$props), {}, null);
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { el, class: className });
  pop();
}
const Trigger = Trigger$1;
const Close = Close$1;
function Menu($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      { "x1": "4", "x2": "20", "y1": "6", "y2": "6" }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "menu" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, default_slot($$props), {}, null);
        $$payload2.out += `<!--]-->`;
      },
      $$slots: { default: true }
    }
  ]));
  $$payload.out += `<!--]-->`;
}
function Wallet($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
      }
    ],
    [
      "path",
      {
        "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
      }
    ]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "wallet" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, default_slot($$props), {}, null);
        $$payload2.out += `<!--]-->`;
      },
      $$slots: { default: true }
    }
  ]));
  $$payload.out += `<!--]-->`;
}
function X($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M18 6 6 18" }],
    ["path", { "d": "m6 6 12 12" }]
  ];
  $$payload.out += `<!--[-->`;
  Icon($$payload, spread_props([
    { name: "x" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, default_slot($$props), {}, null);
        $$payload2.out += `<!--]-->`;
      },
      $$slots: { default: true }
    }
  ]));
  $$payload.out += `<!--]-->`;
}
function Skeleton($$payload, $$props) {
  push();
  let {
    class: className,
    show = true,
    children,
    ...rest
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    class: cn("relative rounded-md inline-block", show && "after:absolute after:rounded-md after:inset-0 after:bg-[length:400%_400%] after:bg-skeleton after:animate-skeleton", className),
    ...rest
  })}><!--[-->`;
  if (children) {
    $$payload.out += `<!--[-->`;
    children($$payload);
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += "<!--]!-->";
  }
  $$payload.out += `</div>`;
  pop();
}
function AccountBalance($$payload, $$props) {
  push();
  var $$store_subs;
  const accountInfo = createQuery(derived(isConnected, ($isConnected) => ({
    queryKey: ["accountInfo"],
    queryFn: getAccountInfo,
    refetchInterval: 1e3 * 5,
    enabled: $isConnected
  })));
  $$payload.out += `<!--[-->`;
  Skeleton($$payload, {
    show: store_get($$store_subs ??= {}, "$accountInfo", accountInfo).isLoading,
    children: ($$payload2, $$slotProps) => {
      $$payload2.out += `<div class="inline-flex items-center min-w-10 gap-1"><svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 17 18" width="17"><g fill="none" fill-rule="evenodd" stroke="var(--ds-gray-1000, '#000')" stroke-width="1.5"><path d="m1.84 3h13.3c.28 0 .5.22.5.5 0 .09-.02.17-.06.25l-6.33 11.18c-.27.48-.88.65-1.36.38-.16-.09-.3-.23-.38-.39l-6.11-11.18c-.13-.24-.04-.55.2-.68.08-.04.16-.06.24-.06z"></path><path d="m8.5 15v-12"></path></g></svg> <div class="font-medium text-center">${escape_html(store_get($$store_subs ??= {}, "$accountInfo", accountInfo)?.data?.balance?.slice(0, 5))}</div></div>`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function TonLogo($$payload) {
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 17 18" width="17"><g fill="none" fill-rule="evenodd" stroke="var(--ds-background-100, '#000')" stroke-width="1.7"><path d="m1.84 3h13.3c.28 0 .5.22.5.5 0 .09-.02.17-.06.25l-6.33 11.18c-.27.48-.88.65-1.36.38-.16-.09-.3-.23-.38-.39l-6.11-11.18c-.13-.24-.04-.55.2-.68.08-.04.16-.06.24-.06z"></path><path d="m8.5 15v-12"></path></g></svg>`;
}

export { AccountBalance as A, Close as C, Drawer as D, Menu as M, Skeleton as S, Trigger as T, Wallet as W, X, Drawer_content as a, Drawer_header as b, Drawer_title as c, TonLogo as d };
//# sourceMappingURL=TonLogo-BAVNyTcX.js.map
