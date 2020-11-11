<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import MainSidebar from "../components/layouts/MainSidebar.svelte";
  import ExternalLink from "../components/icons/ExternalLink.svelte";
</script>

<style>
  a {
    color: var(--color-dark-gray-10);
    font-weight: 700;
    text-decoration: none;
    display: block;
  }

  a.active {
    color: var(--color-dark-gray-90);
    text-decoration: underline;
  }

  ul li + li {
    margin-top: 2rem;
  }

  li a {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .app-controls {
    align-self: end;
  }
</style>

<MainSidebar>
  <ul slot="navigation">
    <li><a class="active" href="/studies">Current Studies</a></li>
    <li>
      <a class="external" href="/studies">Latest News
        <ExternalLink /></a>
    </li>
    <li>
      <a class="external" href="/studies">FAQ
        <ExternalLink /></a>
    </li>
  </ul>
  <ul slot="settings" class="app-controls">
    <ul class="app-controls">
      <li><a href="example.com">Privacy Notice</a></li>
      <li><a href="example.com">Complete Profile</a></li>
      <li><a href="example.com">Leave Mozilla Rally</a></li>
    </ul>
  </ul>
</MainSidebar>
