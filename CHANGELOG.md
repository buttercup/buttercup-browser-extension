# Buttercup browser extension changelog

## v2.24.2
_2021-05-22_

 * **Bugfix**:
   * ([#381](https://github.com/buttercup/buttercup-browser-extension/issues/381)) Search results not showing most recent result (URL detection)
   * WebDAV connection crashes tab during failed connection attempt (when adding a vault)
   * **Critical auto-update issue**: Core crash when receiving updated vaults in the background

## v2.24.1
_2021-01-06_

 * Remove `activeTab` permission requirement
 * **Bugfix**:
   * ([#393](https://github.com/buttercup/buttercup-browser-extension/issues/393)) Copy to clipboard not working for in-page dialog

## v2.24.0
_2020-12-09_

 * Site icons for results within in-page search dialog
 * Performance improvements regarding search
 * Vault unlock/save performance improvements

## v2.23.1
_2020-11-27_

 * **Bugfix**:
   * ([#368](https://github.com/buttercup/buttercup-browser-extension/issues/368)) Popup / Dialog menus very slow to open (performance bugfix for search)

## v2.23.0
_2020-09-05_

 * Dynamic icons defaults to **enabled**
   * Removed dynamic icons setting popup page
 * **Bugfix**:
   * ([#366](https://github.com/buttercup/buttercup-browser-extension/issues/366)) Google Drive bad refresh-token method call

## v2.22.0
_2020-09-04_

 * Core group/entry lookup performance upgrades
 * **Bugfix**:
   * ([#370](https://github.com/buttercup/buttercup-browser-extension/issues/370)) Critical CPU/memory use after some time
   * Entries not able to be moved from group to group

## v2.21.0
_2020-08-30_

 * **Buttercup Core v5**
   * Improved performance
   * Improved stability
   * Future support for **Vault Format B**
 * Dynamic icons for entries (optional)
 * Reduced extension size (< 50% of the size of 2.20.2)
 * Removed `Buffer` dependencies
 * **Bugfix**:
   * Search wouldn't work (no results)

## v2.20.2
_2020-08-19_

 * **Bugfix**:
   * ([buttercup-core#287](https://github.com/buttercup/buttercup-core/issues/287)) Vaults grow to enormous size

## v2.20.1
_2020-08-03_

 * **Attachments** (My Buttercup)
   * Add, remove, preview and download attachments when using My Buttercup vaults
 * Core memory/stability improvements when merging vault changes from remote sources

## v2.19.0
_2020-07-25_

 * New Buttercup form button behaviour (to improve login form stability)
 * Clipboard-writing permission for certain browsers
 * Improved auto-update stability

## v2.18.0
_2020-07-07_

 * Search results won't show items in trash
 * **Bugfix**:
   * ([#337](https://github.com/buttercup/buttercup-browser-extension/pull/337)) No login-save-prompt when entry selected for login form (includes auto login)

## v2.17.0
_2020-07-05_

 * New search functionality
   * Result scoring per domain
 * Vault type icons on unlock-all-vaults page

## v2.16.2
_2020-07-02_

 * **Bugfix**:
   * Unable to enter form details when selecting entry result in dialog

## v2.16.1
_2020-07-01_

 * **Bugfix**:
   * Unable to select vault in save credentials form
   * No search results in popup dialog
   * Broken vault lock state in menu

## v2.16.0
_2020-06-30_

 * Core version 4
 * My Buttercup datasource support
 * ([#340](https://github.com/buttercup/buttercup-browser-extension/pull/340)) Allow localhost in disabled domains

## v2.15.1
_2020-04-02_

 * **Bugfix**:
   * WebDAV would fail to connect on some services, such as ownCloud

## v2.15.0
_2020-03-18_

 * Disable save prompt for domains
 * Memory for all login form inputs
 * **Bugfix**:
   * Buttons would disappear from some forms (Dropbox)

## v2.14.0
_2020-02-03_

 * Upgrade webdav for reduced application size
 * **Bugfix**:
   * ([#325](https://github.com/buttercup/buttercup-browser-extension/issues/325)) New vaults fail to create
   * ([#286](https://github.com/buttercup/buttercup-browser-extension/issues/286)) Unlock-vaults page not opening in FF after clicking button in on-page dialog

## v2.13.1
_2020-01-24_

 * **Bugfix**:
   * ([#324](https://github.com/buttercup/buttercup-browser-extension/issues/324)) Very slow vault contents navigation
   * ([#323](https://github.com/buttercup/buttercup-browser-extension/issues/323)) OTP (HOTP) failures crashing entire vault management UI
   * ([#322](https://github.com/buttercup/buttercup-browser-extension/issues/322)) Auto-update of search results by URL not working

## v2.13.0
_2020-01-22_

 * Group context menu: creation, renaming, moving and deletion
 * New group in root button
 * Entry field history (basic)
 * **Bugfix**:
   * Credit card entry type would crash application
   * State sync for vault management interface inconsistent

## v2.12.0
_2020-01-18_

 * ([#320](https://github.com/buttercup/buttercup-browser-extension/issues/320)) Open permissions option when adding Google Drive vaults
 * **Bugfix**:
   * ([#270](https://github.com/buttercup/buttercup-browser-extension/issues/270)) _(2nd attempt)_: Support multiple Google accounts
   * ([#319](https://github.com/buttercup/buttercup-browser-extension/issues/319)) Google Drive authentication not working in Microsoft Edge (unofficial patch - pre-release)

## v2.11.1
_2020-01-08_

 * **Bugfix**:
   * ([#316](https://github.com/buttercup/buttercup-browser-extension/issues/316)) `createSession` is not defined (local file host vaults)

## v2.11.0
_2020-01-05_

 * Core integration with App-Env for web-based crypto improvement
 * ([#270](https://github.com/buttercup/buttercup-browser-extension/issues/270)) Prompt for account-selection on Google authentication (Google Drive) to support multiple accounts
 * ([#245](https://github.com/buttercup/buttercup-browser-extension/issues/245)) Google Drive permissions reduced - Only files touched by Buttercup are accessible to the application
 * **Bugfix**:
   * ([#314](https://github.com/buttercup/buttercup-browser-extension/issues/314)) Unable to open Google Drive vault

## v2.10.1
_2019-12-26_

 * **Bugfix**:
   * ([#312](https://github.com/buttercup/buttercup-browser-extension/issues/312)) No login prompt visible on Firefox

## v2.10.0
_2019-12-24_

 * Ability to change vault password
 * **Bugfix**:
   * ([#307](https://github.com/buttercup/buttercup-browser-extension/issues/307)) Cannot save new note-type entry (or any other custom types)

## v2.9.0
_2019-11-12_

 * My Buttercup preparation
 * ownCloud/Nextcloud removed in favour of WebDAV (existing connections should still function)
 * ([#95](https://github.com/buttercup/buttercup-browser-extension/issues/95)) Context menus to choose credentials for form-filling and login

## v2.8.2
_2019-09-01_

 * **Bugfix**:
   * ([#269](https://github.com/buttercup/buttercup-browser-extension/issues/269)) Password field in popup menu not copy-able and always visible

## v2.8.1
_2019-09-01_

 * **Bugfix**:
   * ([#253](https://github.com/buttercup/buttercup-browser-extension/issues/253)) Vault saving via editing UI (second attempt)

## v2.8.0
_2019-07-23_

 * **Bugfix**:
   * ~~([#253](https://github.com/buttercup/buttercup-browser-extension/issues/253)) Vault saving via editing UI~~
 * ([#259](https://github.com/buttercup/buttercup-browser-extension/pull/259)) General improvements to the add-vault page
 * Unlock button on in-page dialog when vaults are locked
 * Unlock button for single-vault now navigates to edit page
 * TOTP / HOTP support via vault UI (display only, no form-fill)
 * Entry value type support via vault UI
 * Updated Dropbox/Google Drive clients for compatibiltiy

## v2.7.0
_2019-04-28_

 * Vault editing interface

## v2.6.0
_2019-04-14_

 * ([#246](https://github.com/buttercup/buttercup-browser-extension/issues/246)) Google Drive refresh token support

## v2.5.1
_2019-03-13_

 * **Bugfix**:
   * ([#244](https://github.com/buttercup/buttercup-browser-extension/issues/244)) Google Drive fetching fails on large directories

## v2.5.0
_2019-03-09_

 * **Google Drive** support
 * Unlock-vaults button in popup

## v2.4.1
_2019-02-05_

 * **Bugfix**:
   * Regression in auto-unlock functionality

## v2.4.0
_2019-02-04_

 * ([#235](https://github.com/buttercup/buttercup-browser-extension/issues/235)) Use local (static) icons and don't request them from remote sources
 * ([#171](https://github.com/buttercup/buttercup-browser-extension/issues/171)) Auto-lock vaults after a configurable time
 * Auto-login button in popup menu

## v2.3.1
_2019-01-19_

 * **Bugfixes**:
   * ([#214](https://github.com/buttercup/buttercup-browser-extension/issues/214)) Popup menu layout broken for long items
 * ([#216](https://github.com/buttercup/buttercup-browser-extension/issues/216)) Autofocus extension popover search input

## v2.3.0
_2018-01-12_

 * **Bugfixes**:
   * ([#217](https://github.com/buttercup/buttercup-browser-extension/issues/217)) Popup menu layout broken
   * ([#218](https://github.com/buttercup/buttercup-browser-extension/issues/218)) Some website forms not recognised
 * Improved entry details UI in popup menus
 * Improved entry results in popup menus
 * What's New section on auto-unlock page
 * Improved login form detection

## v2.2.0
_2019-01-05_

 * ([#212](https://github.com/buttercup/buttercup-browser-extension/issues/212)) Poor search results performance
 * ([#202](https://github.com/buttercup/buttercup-browser-extension/issues/202)) Auto-unlock setting not working

## v2.1.3
_2018-12-16_

 * ([#190](https://github.com/buttercup/buttercup-browser-extension/issues/190)) Dropbox connection never completes loading procedure (UI spinner)

## v2.1.2
_2018-12-08_

 * ([#203](https://github.com/buttercup/buttercup-browser-extension/issues/203)) Failure saving Dropbox changes

## v2.1.1
_2018-11-27_

 * **Bugfix**: ownCloud / Nextcloud / WebDAV vaults could not be added (Chrome)

## v2.1.0
_2018-11-24_

 * ([#91](https://github.com/buttercup/buttercup-browser-extension/issues/91)) Connect through desktop application (local filesystem access)
 * New WebDAV client
 * New Dropbox client

## v2.0.0
_2018-10-29_

 * **Major UI overhaul**
 * ([#180](https://github.com/buttercup/buttercup-browser-extension/issues/180)) Option to disable "save-new" dialog
 * ([#160](https://github.com/buttercup/buttercup-browser-extension/issues/160)) Settings page
 * ([#173](https://github.com/buttercup/buttercup-browser-extension/issues/173)) Source type is empty - display glitches (final cleanup)
 * Dark/Light mode themes
 * Setting for showing the auto-unlock page (default on)
 * Vault/Account sync via Chrome/Firefox's account logins (sync storage)
 * Show/Copy entry properties in dialog/popup menus

## v1.12.1
_2018-10-18_

 * ([#173](https://github.com/buttercup/buttercup-browser-extension/issues/173)) Source type is empty - display glitches
 * ([#182](https://github.com/buttercup/buttercup-browser-extension/issues/182)) Add bundling process for Chrome/Firefox

## v1.12.0
_2018-10-07_

 * ([#110](https://github.com/buttercup/buttercup-browser-extension/issues/110)) Reload archives after some time
 * ([#174](https://github.com/buttercup/buttercup-browser-extension/issues/174)) Unable to access via WebDAV (Seafile)

## v1.11.1
_2018-08-27_

 * ([#164](https://github.com/buttercup/buttercup-browser-extension/issues/164)) `t is null` error when unlocking archives

## v1.11.0
_2018-08-24_

 * ([#136](https://github.com/buttercup/buttercup-browser-extension/issues/136)) Use last generated password form context menu
 * ([#153](https://github.com/buttercup/buttercup-browser-extension/issues/153)) **Bugfix**: Button layout issues
 * Upgraded login form targetting

## v1.10.0
_2018-07-11_

 * New popup menu design
   * Search and open items from the popup

## v1.9.1
_2018-07-08_

 * ([#152](https://github.com/buttercup/buttercup-browser-extension/issues/152)) **Bugfix**: Failure while adding WebDAV archives

## v1.9.0
_2018-06-29_

 * ([#131](https://github.com/buttercup/buttercup-browser-extension/issues/131)) Upgrade core to v2
   * New archive format (supporting future encryption standards)
 * ([#130](https://github.com/buttercup/buttercup-browser-extension/issues/130)) Auto unlock prompt shown when browser is opened
 * ([#147](https://github.com/buttercup/buttercup-browser-extension/issues/147)) Remove settings page link

## v1.8.0
_2018-06-22_

 * Upgrade core to 1.7.1
   * Future proofing for archive format

## v1.7.0
_2018-04-28_

 * ([#124](https://github.com/buttercup/buttercup-browser-extension/issues/124)) Simplify save-new login screen by removing password confirmation
 * ([#141](https://github.com/buttercup/buttercup-browser-extension/issues/141)) Buttercup launch button layout issues
 * Dependency updates

## v1.6.2
_2018-04-24_

 * ([#139](https://github.com/buttercup/buttercup-browser-extension/issues/139)) No "Generate password" option shown when right-clicking inputs (Firefox/Chrome)

## v1.6.1
_2018-04-01_

 * ([#137](https://github.com/buttercup/buttercup-browser-extension/issues/137)) Unable to close save-new dialog

## v1.6.0
_2018-04-01_

 * "password" type input support for Firefox and the password generator
 * ([#134](https://github.com/buttercup/buttercup-browser-extension/issues/134)) Password generator "Use this" button fails on Firefox
 * ([#133](https://github.com/buttercup/buttercup-browser-extension/issues/133)) Password generator bad padding issue

## v1.5.0
_2018-03-31_

 * Password generator
 * Right-click context menu

## v1.4.0
_2018-03-23_

 * ([#126](https://github.com/buttercup/buttercup-browser-extension/issues/126)) Add an attribute to allow inputs and forms to be ignored by Buttercup
 * Support new login forms
 * Update login form detection priorities

## v1.3.1
_2018-02-20_

 * ([#121](https://github.com/buttercup/buttercup-browser-extension/issues/121)) Unable to click "Save" for new logins

## v1.3.0
_2018-02-05_

 * Use `chrome.storage` for better data persistence

## v1.2.1
_2018-02-04_

 * Update code splitting configuration (Firefox submission fixes)

## v1.1.1
_2018-02-04_

 * Improve URL filtering for new credentials saving

## v1.1.0
_2018-02-04_

 * ([#112](https://github.com/buttercup/buttercup-browser-extension/issues/106)) Save newly-entered credentials

## v1.0.7
_2018-01-22_

 * Add data collection event listeners for form attachments

## v1.0.6
_2018-01-21_

 * Fix component communication in Firefox
 * Add storage permission

## v1.0.5
_2018-01-21_

 * ([#106](https://github.com/buttercup/buttercup-browser-extension/issues/106)) Fix Nextcloud archive searching

## v1.0.4
_2018-01-20_

 * First 1.* release for Firefox
 * Fix character encoding
 * Fix button icon not showing on some sites
 * Fix scrollbars in popup

## v1.0.3
_2018-01-19_

 * Fix GitHub login
 * Fix logins that have multiple detected inputs

## v1.0.2
_2018-01-18_

 * ([#97](https://github.com/buttercup/buttercup-browser-extension/issues/97)) Fixed Twitter login bug

## **v1.0.1**
_2018-01-18_

 * Full re-work of the entire extension
 * **Nextcloud** official support
 * ([#92](https://github.com/buttercup/buttercup-browser-extension/issues/92)) Fixed security vulnerability

## v0.14.2
_2017-07-15_

 * Bugfix: [ownCloud subfolder installations: Subfolder ignored](https://github.com/buttercup/buttercup-browser-extension/issues/80)

## v0.14.1
_2017-06-24_

 * Bugfix: [Unable to connect to certain WebDAV services](https://github.com/buttercup/buttercup-desktop/issues/303)

## v0.14.0
_2017-06-07_

 * Bugfix: [Malformed URL error](https://github.com/buttercup/buttercup-browser-extension/issues/71) - old WebDAV client caused issues with special characters in passwords
 * Add back old Buttercup-core-web classes for compatibility

## v0.13.1
_2017-05-27_

 * Bugfix: Archive creation in root level

## v0.13.0
_2017-04-23_

 * Added right-click context menu drilldown for choosing which entry to fill form with
 * Updated hotkey for auto-login (Command+Shift+L for Mac, Ctrl+Shift+L for Windows/Linux)
 * Fixed deprecation warnings during build and updated some packages

## v0.12.1
_2017-04-19_

 * Spring clean:
   * Reduced permissions requirements in manifest
   * Improved last submitted form security

## v0.12.0
_2017-04-15_

 * Bugfix: Popup formatting issues
 * Added hotkey for auto-login (Command+B (Mac) / Ctrl+B (Windows/Linux))

## v0.11.0
_2017-04-14_

 * Bugfix: Clicking "No" on save prompt would not cancel further popups
 * Bugfix: Form submission error when selecting credentials
 * Prefill title when saving new credentials

## v0.10.0
_2017-03-31_

 * Added right-click context menu on form inputs
 * Fixed overflow on remote filesystem explorer when adding archives
 * Finalised styling on unlock-archive form

## v0.9.0
_2017-03-29_

 * Improved UI for popup password list (archive + groups pathing)
 * Bugfix: Fixed wrong-password during unlock sequence breaking state

## v0.8.0
_2017-03-22_

 * Fuzzy searching for entries on login-forms
 * Login-form popup available on password fields

## v0.7.0
_2017-03-15_

 * **Support for Firefox**
 * Auto-submit when selecting credentials on a form
 * Styles normalisation

## v0.6.0
_2017-03-14_

 * Upgrade core
    * Use serialisation for archive properties

## v0.5.0
_2017-03-09_

 * Upgrade core
    * Drastically increase PBKDF2 rounds
    * Improve URI matching

## v0.4.0
_2017-02-11_

 * First alpha release

## v0.3.0

 * Pre-release development build
