# Buttercup browser extension changelog

## v1.0.3
_2017-01-19_

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
