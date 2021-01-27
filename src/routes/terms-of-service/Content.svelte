<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fly } from "svelte/transition";
</script>

<style>
  h3 {
    font-size: 20px;
    margin-bottom: 2em;
    margin-top: 2em;
  }

  h4 {
    font-size: 16px;
    margin-bottom: 0;
    margin-top: 2em;
  }
  h2,
  h3,
  h4 {
    color: var(--color-ink-50);
  }

  h3,
  h4 {
    font-family: "Metropolis", -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
  }

  p,
  ul {
    color: var(--color-marketing-gray-70);
  }

  hr {
    border-top: 1px dashed var(--color-black);
    margin-bottom: 2rem;
  }
</style>

<div in:fly={{ duration: 800, y: 5 }}>
  <h2 class='section-header'>Our Privacy Notice</h2>

  <p style='font-style: italic;'>
    Before you get started, please make sure you're comfortable with our privacy notice.
  </p>

  <hr />

  <h3>Introduction</h3>

  <p>In this notice, we detail what data Mozilla Rally collects and discloses, and why it does so.</p>

  <p>
    Mozilla Rally is a <b>new platform</b> created to empower people to 
    contribute their data towards <b>building a better internet</b>.
  </p>
  <p>
    It is currently available to Firefox users in the U.S. who are 19 or older.
  </p>
  <p>
    <b>This notice only coverss Rally itself</b>, as each study will have a
    unique privacy notice detailing how data is collected and handled in 
    that particular study. We also adhere to the <a href="#FIXME">Mozilla Privacy Policy</a>
    for how we receive, handle, and share information.
  </p>

  <h3>Types of Information We Collect</h3>

  <p>We'll ask for your consent before we collect any of your info, which could include:</p>

  <h4>Your Demographic data</h4>

  <p>
    This includes your <b>age</b>, <b>gender</b>, <b>race/ethnicity</b>, 
    <b>education level</b>, <b>household income</b>, and <b>zip code</b>.
    This is entirely optional.
  </p>

  <h4>Your Device's Technical data</h4>

  <p>
    This includes your device's <b>operating system</b> and <b>IP address</b> (which we'll only hang on to temporarily).
  </p>

  <h4>Your Interaction data</h4>
  <p>
    This includes your <b>interactions with Firefox</b>, like the number and
    type of Firefox Add-ons you have installed, or the duration of your
    active browsing session duration.
  </p>

  <h4>Your Location data</h4>

  <p>
    This includes your <b>country</b>, <b>city</b>, and <b>state</b> location, which is
    determined by your <b>IP address</b>.
  </p>


  <h3>How We Use Your Information</h3>

  <p>
    We may share information with trusted entities that help us fulfill our mission, including:
  </p>

  <ul class="mzp-u-list-styled">
    <li>
      determining which Rally participants could be eligible to participate
      in particular research studies, should they choose to enroll
    </li>
    <li>
      ensuring that the data we collect represents teh diverse communities
      that use the internet
    </li>
    <li>
      improving Mozilla's existing products and services
    </li>
    <li>
      creating and developing new products
    </li>
  </ul>

  <h3>Who We may Share Information With</h3>

  <h4>Our data Storage Provider</h4>

  <p>
    We use Google's cloud storage service to store the data collected
    through Rally. Google only stores Rally data and <b>cannot use that
      data for its own purposes
    </b>.
  </p>

  <h4>Our Research Partners</h4>

  <p>
    Rally patners with trusted third parties to build and release studies. 
    For any studies you join, we may ask you to share the data collected
    under <b>this Privacy Notice</b> with third party researcher(s)
    administering the study. Our research partners are under contracts
    with Mozilla to ensure that <b>your data is protected</b> and handled only
    in ways we've approved.
  </p>

  <h4>People Like You (only aggregated data)</h4>

  <p>
    Our mission is focused on <b>empowering everyday citizens</b>, not just a
    select few. To that end, we may release aggregated, de-identified data sets
    to help further public knowledge on certain issues. These
    data sets will be <b>stripped of any identifiable data</b>, and won't reveal
    anything about individual users.
  </p>

  <h4>How You Can Manage Your Data</h4>

  <p>Our "opt-in" approach to data collection means that you choose which data you share with us.</p>

  <p>Rally operates based on <b>your participation</b> – meaning you can
  choose to disclose the level of information you're comfortable with, either by finding a study
that matches your level of comfort or by declining to share demographic information in your profile. <a href="#FIXME">Learn more about managing your data</a>.</p>

  <p>If you have any other questions regarding our privacy practices, please contact us at <a href='#FIXME'>compliance@mozilla.com</a>.</p>

</div>
