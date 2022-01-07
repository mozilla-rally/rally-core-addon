/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import PrincetonCovidDisinformationIRB from "./PrincetonCovidDisinformationIRB.svelte";
import RS01Consent from "./RS01Consent.svelte";
import StanfordBeyondThePaywallIRB from "./StanfordBeyondThePaywallIRB.svelte";
import FacebookPixelHuntConsent from "./FacebookPixelHuntConsent.svelte";
import PrincetonSearchUsageIRB from "./PrincetonSearchUsageIRB.svelte";

export default {
    "rally.news.study@princeton.edu": PrincetonCovidDisinformationIRB,
    "rally-study-01@mozilla.org": RS01Consent,
    "beyond-the-paywall@rally.mozilla.org": StanfordBeyondThePaywallIRB,
    "facebook-pixel-hunt@rally.mozilla.org": FacebookPixelHuntConsent,
    "search-engine-usage@rally.mozilla.org": PrincetonSearchUsageIRB,
    "princeton-political-and-covid-19-news-study@rally.mozilla.org": PrincetonCovidDisinformationIRB,
}
