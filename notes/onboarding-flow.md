1. user signs up with email + password.

- Their account is created with supabase
- They have onboarding_finished in metadata false + is_email_verified false

2. Onboarding_finished is the dominant redirect in middleware

- Until its done, they are taken through onboarding which is stored via localstorage and context in a form
- First step is asking for first name and last name and if they are a host or sponsor.
- Next step is either joining or creating an organizaiton.
- If they join an organization where the owner has verified their email, the new joinee won't have to verify their email.

3. Once they join/create an organizaiton, they have to verify email, it is a step, or we do verify later?

- if verify later, they can't post/sponsor events, but they can browse the dashboard.
