# Sending emails

Date: 2025-01-27

## Status

🤔 Proposed

## Context

In the future, we may want to email information or documents to users.

## Considerations

We should use GOV.UK Notify, as it is free and has a Node.js client. It adds a layer of official-ness to the email, and
gives a useful dashboard to track email stats. It would also allow us to easily branch out to sending texts or letters
if that was ever desired. It has support for sending documents.

- We would need to consider how we get consent for emailing someone. Would we need them to verify their email prior to
  sending content to them?
- How would we get consent to email a third party?
- If we allow sending content to a third party, we need to be aware that this is an avenue for
  fraud - unless we verify the person filling in the form is who they say they are.

## Decision

We would use GOV.UK Notify to send emails, however there are non-technical considerations raised which will need to be
resolved prior to commiting.
