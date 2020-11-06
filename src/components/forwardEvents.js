/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// based on https://github.com/hperrin/svelte-material-ui/blob/master/packages/common/forwardEvents.js
// eslint-disable-next-line import/no-extraneous-dependencies
import { bubble, listen } from "svelte/internal";

export function forwardEvents(component, additionalEvents = []) {
  const events = [
    "focus",
    "blur",
    "fullscreenchange",
    "fullscreenerror",
    "scroll",
    "cut",
    "copy",
    "paste",
    "keydown",
    "keypress",
    "keyup",
    "auxclick",
    "click",
    "contextmenu",
    "dblclick",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseover",
    "mouseout",
    "mouseup",
    "pointerlockchange",
    "pointerlockerror",
    "select",
    "wheel",
    "drag",
    "dragend",
    "dragenter",
    "dragstart",
    "dragleave",
    "dragover",
    "drop",
    "touchcancel",
    "touchend",
    "touchmove",
    "touchstart",
    "pointerover",
    "pointerenter",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "pointerout",
    "pointerleave",
    "gotpointercapture",
    "lostpointercapture",
    ...additionalEvents,
  ];

  return (node) => {
    const destructors = events.map((event) => {
      return listen(node, event, (e) => bubble(component, e));
    });

    return {
      destroy: () => {
        destructors.forEach((destructor) => {
          destructor();
        });
      },
    };
  };
}
