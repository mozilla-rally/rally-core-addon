<!-- This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. -->
<style>
  div {
    min-height: 100vh;
    background: url('img/noise-texture.png');
    display: grid;
    grid-template-columns: max-content auto;
    justify-content: stretch;
    justify-items: stretch;
  }
</style>

<div>
  <slot />
</div>
