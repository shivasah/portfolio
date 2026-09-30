/* Optional owner-supplied details. Social links are restored as static HTML in
   every footer, using the same destinations as v45. Blank values retain those
   original service-homepage destinations; they are NOT verified personal profiles.
   Add real profile URLs here to override them. Email remains optional. */
window.PORTFOLIO_CONFIG = Object.freeze({
  contact: {
    email: '',
    linkedin: '',
    medium: '',
    github: ''
  },
  // Owner-supplied publication URLs. The print-only entry has no supplied URL.
  writingLinks: {
    'writing-01': 'https://medium.com/design-appd/storytelling-through-analogies-247b9272ce76',
    'writing-02': 'https://medium.com/design-bootcamp/unlocking-emotion-and-engagement-storytelling-techniques-in-ux-design-855afb9cecdf',
    'writing-03': 'https://tedxiitguwahati.medium.com/level-up-720488822d71',
    'writing-04': 'https://uxplanet.org/storytelling-in-ux-design-pres-framework-b39ec7ca91ab?gi=491167e53e9d',
    'writing-05': 'https://medium.com/design-appd/7-takeaways-from-my-internship-at-appdynamics-ab80037c2dd',
    'writing-06': 'https://ieeexplore.ieee.org/abstract/document/9701536',
    'writing-07': ''
  },
  menuAnimation: {
    // Supply a real, licensed Lottie JSON plus a local lottie-web player.
    // No requests or player loading occur until BOTH paths are configured.
    dataPath: '',
    playerPath: '',
    posterPath: 'assets/shiva-sketch-work.webp'
  }
});
