# Buttercup browser extension changelog

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
