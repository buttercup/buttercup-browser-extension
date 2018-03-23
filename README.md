<h1 align="center">
  <br/>
  <img src="https://cdn.rawgit.com/buttercup-pw/buttercup-assets/4bbfd317/badge/browsers.svg" alt="Buttercup for Browsers">
  <br/>
  <br/>
  <br/>
</h1>

# Buttercup Browser Extension
Buttercup credentials manager extension for the browser.

<p align="center">
    <img src="https://raw.githubusercontent.com/buttercup/buttercup-browser-extension/master/chrome-extension.jpg" />
</p>

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![Build Status](https://travis-ci.org/buttercup/buttercup-browser-extension.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-browser-extension) [![Chrome users](https://img.shields.io/chrome-web-store/d/heflipieckodmcppbnembejjmabajjjj.svg?label=Chrome%20users)](https://chrome.google.com/webstore/detail/buttercup/heflipieckodmcppbnembejjmabajjjj?hl=en-GB) [![Firefox users](https://img.shields.io/amo/d/buttercup.svg?label=Firefox%20users&colorB=38c543)](https://addons.mozilla.org/en-US/firefox/addon/buttercup-pw/) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/buttercup)

## About
This browser extension allows users to interface with password archives authored by the [Buttercup password manager](https://github.com/buttercup-pw/buttercup) (though it **does not** require the application to be installed).

The extension can remotely connect to archives via Buttercup's common communication protocols (WebDAV, Dropbox etc.).

### Usage
The browser extension can be controlled from the **popup menu**, which is launched by pressing the Buttercup button in the browser menu. This menu displays a list of archives as well as settings and other items.

When viewing pages that contain login forms, Buttercup can assist logging in when you interact with the login buttons (displayed beside detected login inputs).

Buttercup can also remember new logins, which are detected as they occur.

You can **block** Buttercup from detecting forms and inputs by applying the attribute `data-bcupignore=true`:

```html
<input type="email" data-bcupignore="true" />
```

### Supported browsers
[Chrome](https://chrome.google.com/webstore/detail/buttercup/heflipieckodmcppbnembejjmabajjjj?hl=en-GB), Firefox and [Opera](https://chrome.google.com/webstore/detail/buttercup/heflipieckodmcppbnembejjmabajjjj?hl=en-GB) (with the ["Download Chrome Extension"](https://addons.opera.com/en-gb/extensions/details/download-chrome-extension-9/) installed) are supported.

Other browsers will be supported in order of request/popularity.

#### Supported platforms
The browsers listed above, running on Windows, Mac or Linux on a desktop platform. This extension is not supported on any mobile or tablet devices.

### Adding to Chrome
You can load an **unpacked extension** in Chrome by navigating to [chrome://extensions/](chrome://extensions/). Simply locate the project's directory and use **dist/** as the extension directory.

### Adding to Firefox
You can load an **unpacked extension** in Firefox by navigating to [about:debugging](about:debugging). Click "Load Temporary Add-on" and locate the project's directory, using **dist/** as the extension directory.

## Contributing
Contributions are very welcome and strongly encouraged, though we do ask that you stick to some basic styling parameters:

 - Use **4 spaces** for indentation
 - New line at the end of each file
 - Commas on same line (at end)
 - Semicolons are not optional
 - _(Just follow the editor config and existing styles)_
