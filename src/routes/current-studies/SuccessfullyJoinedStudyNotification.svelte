<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import Notification from '../../components/notification/NotificationElement.svelte';
import Check from '../../components/icons/Check.svelte';
export let xOffset;
export let location = "top";

</script>
<Notification {location} {xOffset}>
    <span style="display: contents;" slot="icon">
    <Check />
    </span>
    <span slot="body">successfully joined study</span>
</Notification>
