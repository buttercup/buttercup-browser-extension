# Privacy Policy

This privacy policy concerns the Browser Extension for Buttercup, its use and the data it makes use of.

## About Buttercup

Buttercup is a software suite designed to provide a secure application with which to store highly-sensitive information (such as account credentials) in encrypted vault files. Great care is taken to ensure that all secure data remains protected, with as little information as possible being handled by the application and the Buttercup platform therein.

### Terms

The following terms will appear throughout this document and their meaning is important to grasp for a proper understanding of this policy.

| Term              | Description                                           |
|-------------------|-------------------------------------------------------|
| Archive           | See "vault".                                          |
| Call-to-action    | A button or link that indicates to the user that it performs some kind of action. A button with "Login" on it is a good example. |
| Encryption        | The process of transforming vault contents into a secure, un-readable format for storage that can only be _read_ by providing a master password. |
| Master password   | The highly secure secret password used to lock and unlock vaults, known only to the user. |
| Vault             | An encrypted password vault, stored as a file either locally or remotely (on some kind of service). |

### Types of data

Vaults, in their locked state, contain **encrypted data** which represent secret information that Buttercup uses to function (passwords etc.). When unlocked, the data is **unencrypted** and resides in memory on the user's device.

Buttercup applications may store **unencrypted configuration information** on the device in a standard directory or location. Configuration data does not include any sensitive information. Configuration refers to settings that allow the application to function in a desired manner for the user.

Buttercup for Browsers does not collect any **analytics data**, but the hosting platforms (eg. Mozilla/Google) may collect anonymous analytics with regards to the extension itself (installations vs uninstallations, etc.).

Due to the fact that Buttercup interacts with webpages, the **Document Object Model (DOM)** may be modified by its use.

## Data storage and transfer with regards to 3rd Parties

### Remote vault storage

Buttercup vault files, especially with regards to this browser extension, are stored remotely on hosting services. These services (eg. Dropbox, Nextcloud etc.) utilise their own privacy policies and standards, and are responsible for the files stored within their platform. Vaults transferred from the extension to these services are encrypted **before** they leave the application. No unencrypted data is stored on these remote services, besides the filename itself.

It should be noted that connection logs may be kept on various services. It is the responsibility of the user to take care as to what services they choose to use and connect to, if any.

### DOM (Document Object Model)

The browser extention modifies the DOM of open webpages so that it can track several different items while the page is live:

 * Detected login forms
 * Detected inputs that can be used for login (username/email, password etc.)
 * Submit buttons
 * Potential submit buttons (tracking text that resembles login call-to-actions)

The extension may add attributes to existing elements, as well as adding entirely new elements (eg. buttons to open the Buttercup login menu). These modifications may indicate to the site, as well as to scripts running on the site, the fact that the current user has the Buttercup browser extension installed.

### Analytics

Buttercup does not track any analytics directly. Platforms that Buttercup uses, such as Mozilla (for Firefox addons) or Google (for Chrome extensions), may track analytics that relate to the use of the extension in an anonymous manner. Buttercup makes use of this data for the purpose of analysing product health and potential market expansions.

## Internal data storage and use

### In-memory vaults

When the vaults are decrypted using the user's master password, the contents of the vault are loaded into memory within the browser. The contents of the vaults are stored within the extension and are not accessible outside of the extension's context. Raw credentials may be transferred to webpages not owned by Buttercup at the request of the user when trying to log in to a website.

## Your responsibility as a user

By using Buttercup's applications or services, you acknowledge that Buttercup stores highly-sensitive information for you using a **master password**. This password must not be shared with anyone, and should sufficiently strong to ensure that vault integrity is not broken if a bad actor gains access to it. Both the password and the encrypted vault file are the responsibility of the user, and both should be treated as highly sensitive.

## Our responsibility to you, the user

We provide Buttercup as free-to-use software - we take every reasonable precaution to ensure that the vaults are encrypted in a manner that is secure by industry standards. We must ensure that only encrypted data leaves the user's device when storing vaults. We must ensure that only the bare minimum information is shared with 3rd party services to allow Buttercup to integrate with them.
