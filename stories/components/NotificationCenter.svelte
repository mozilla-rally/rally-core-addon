<script>/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import Button from "../../src/components/Button.svelte";
import NotificationCenter from "../../src/routes/NotificationCenter.svelte";
import { notification } from "../../src/routes/notification-store";
let sidebarOffset = false;
</script>

<div style="display: grid; grid-auto-flow: row; justify-content: start; grid-row-gap: .5em;">
<Button secondary on:click={() => { notification.send({code: "SUCCESSFULLY_JOINED_STUDY"}); }}>SUCCESSFULLY_JOINED_STUDY</Button>
<Button secondary on:click={() => { notification.send({code: "SUCCESSFULLY_LEFT_STUDY"}); }}>SUCCESSFULLY_LEFT_STUDY</Button>
<Button secondary on:click={() => { notification.send({code: "SUCCESSFULLY_UPDATED_PROFILE"}); }}>SUCCESSFULLY_UPDATED_PROFILE</Button>
<Button size="sm" product secondary on:click={() => { sidebarOffset = !sidebarOffset }}>sidebarOffset ({sidebarOffset})</Button>
</div>
<NotificationCenter {sidebarOffset} />