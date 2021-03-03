<script>
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import StudyCard from "../../src/components/study-card/StudyCard.svelte";
</script>

{#each [false, true] as joined}
  <StudyCard
    {joined}
    endDate={new Date(2021, 4, 31)}
    joinedDate={new Date(2020, 9, 12)}
    imageSrc="https://addons.cdn.mozilla.net/static/img/addon-icons/default-64.png"
    dataCollectionDetails={['how often you visit news and health websites', 'The amount of time you spend looking at these websites', 'The sources that lead you to visit these websites', 'Whether you shared links to these websites on social media']}
    tags={['social media', 'misinformation']}
    privacyPolicyLink={'/'}>
    <span slot="name">Political & COVID-18 News Information</span>
    <span slot="author">Princeton University</span>
    <p slot="description">
      This study examines political and COVID-19 news information flows across the web.
      Our goal is to understand how web users are exposed to, consume, and share these types of
      information, which can inform effort to distinguish trustworthy and untrustworthy content.
    </p>
    <div slot="details">
      Full study details can be found on the
      <a href="/">University Research Labs website</a>
    </div>
  </StudyCard>
{/each}
{#each [false, true] as joined}
  <StudyCard
    {joined}
    endDate={new Date(2020, 11, 5)}
    joinedDate={new Date(2021, 8, 9)}
    dataCollectionDetails={['the date and time', 'number of browser tabs open', 'the time of day when the browser is first used, additional thoughts', 'the temperature outside near the data center where their data will be stored', 'the date and time', 'number of browser tabs open', 'the time of day when the browser is first used, additional thoughts']}
    tags={['social media', 'misinformation', 'data & privacy', 'devices', 'accessibility', 'other']}
    privacyPolicyLink={'/'}>
    <span slot="name">Very, very long Study 1a.05 (long title, and also this doesn't have study icon)</span>
    <span slot="author">The Mozilla Foundation, The Mozilla Corporation, and
      others</span>
    <p slot="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, ut enim ad minim veniam, ut enim ad minim veniam. Does this
      description just go on and on? I think it does. And in this case, the
      study card will just continue to grow as needed. At a certain point, it'll
      probably become
      <em>too</em>
      big. We can decide what we're going to do at that point. At the moment,
      we'll say – yes, the length of this area will be unconstrained. I could in
      theory see this being a severe problem for studies that have long
      descriptions. How are we even going to handle this situation?
      <br />
      <br />
      The internet’s problems are causing massive society problems.
      Misinformation undermines science, policy and our civic discourse. Biased
      algorithms lead to real world discrimination. Our personal data and our
      spare time are both harvested by advertising companies. The big tech
      companies are not doing enough to control what happens online.
      <br />
      <br />
      By joining this study, you become a member of Mozilla’s Watcher of the Web
      community and help us shine a line on these societal problems. Mozilla
      will update you frequently with public reports of the good, the bad, and
      the bizarre online trends that shape our society. We will also publish
      aggregate, anonymized datasets that allow journalists and third-party
      researchers to scrutinize these issues. As a Watcher, your work will point
      the way to policy and advocacy issues as well as future studies on
      in-depth problems.
    </p>
    <div slot="details">
      Full study details can be found on the
      <a href="/">University Research Labs website</a>
    </div>
  </StudyCard>
{/each}
