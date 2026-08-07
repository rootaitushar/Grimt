# Student Placement Hub

Create a clean, modern, responsive web application for collecting student information for the College Training & Placement Department.

The website should contain a simple student placement data collection form connected directly with Supabase.

The application must work perfectly on mobile phones, tablets, laptops, and desktop screens.

TECH STACK:

- React

- Tailwind CSS

- Supabase

- Use Lovable's recommended project structure

- Use Supabase for permanent database storage

- Do not use dummy data or localStorage for final submissions

PAGE PURPOSE:

The purpose of this page is to collect student details that will be used by the Training & Placement Department.

PAGE TITLE:

Placement Student Information Form

SUBTITLE:

Training & Placement Department

Below the subtitle show:

"Please fill in your details carefully. The information provided will be used for placement-related activities."

--------------------------------------------------

FORM FIELDS

--------------------------------------------------

1. STUDENT NAME

Label:

Name *

Input type:

Text

Requirements:

- Required field

- Placeholder: Enter your full name

- Trim unnecessary spaces

- Do not allow an empty value

Database field:

student_name

2. FATHER'S NAME

Label:

Father's Name *

Input type:

Text

Requirements:

- Required

- Placeholder: Enter father's name

Database field:

father_name

3. ROLL NUMBER

Label:

Roll No. *

Input type:

Text

Requirements:

- Required

- Placeholder: Enter your roll number

- Do NOT use a number input because roll numbers may contain letters, zeros, slashes, or other characters

- Trim spaces before saving

- Roll number should be unique for each student

Database field:

roll_number

4. BRANCH

Label:

Branch *

Input type:

Text

IMPORTANT:

Do NOT use a dropdown.

Students should manually type their branch.

Placeholder:

Enter your branch, e.g. CSE

Examples:

CSE

ECE

Civil

Mechanical

BCA

MCA

B.Tech CSE

B.Tech AI & ML

Requirements:

- Required

- Save exactly as entered after trimming spaces

Database field:

branch

5. SEMESTER

Label:

Semester *

Input type:

Text

IMPORTANT:

Do NOT use a dropdown.

Do NOT provide predefined semester options.

Students must manually enter their semester.

Placeholder:

Enter your semester, e.g. 6th Semester

Possible entries may include:

6th Semester

Semester 6

6th Sem

Final Semester

Requirements:

- Required

- Save as text

Database field:

semester

6. RESULT STATUS

Label:

Result *

Input type:

Select dropdown

Options:

- Clear

- Awaiting Result

- Backlog / Reappear

Default:

Select Result Status

Requirements:

- Required

Database field:

result_status

7. NUMBER OF BACKLOGS

Label:

No. of Backlogs *

Input type:

Number

Requirements:

- Minimum value: 0

- Default value: 0

- Required

Logic:

If Result Status = "Clear":

- Automatically set Number of Backlogs to 0

- Disable or visually lock the backlog field

If Result Status = "Awaiting Result":

- Allow backlog value to remain 0 unless student needs to enter otherwise

If Result Status = "Backlog / Reappear":

- Enable the backlog input

- Student should enter the number of active backlogs

Do not restrict the field to only 1, 2, or 3.

Allow students to enter an appropriate numeric value.

Database field:

backlogs

8. CONTACT NUMBER

Label:

Contact No. *

Input type:

Tel

Placeholder:

Enter 10-digit mobile number

Requirements:

- Required

- Accept Indian mobile number format

- Validate exactly 10 digits for normal Indian mobile numbers

- Only allow numeric characters in the final value

- Store as text, not integer

Database field:

contact_number

9. EMAIL ADDRESS

Label:

Email *

Input type:

Email

Placeholder:

Enter your email address

Requirements:

- Required

- Validate proper email format

- Convert accidental surrounding spaces before submission

Database field:

email

10. ADDRESS

Label:

Address *

Input type:

Textarea

Placeholder:

Enter your complete address

Requirements:

- Required

- Full-width field

- Provide enough height for 2-4 lines

Database field:

address

11. REMARKS

Label:

Remarks

Input type:

Textarea

Placeholder:

Enter any additional information, if applicable

Requirements:

- Optional

- Full-width field

Database field:

remarks

--------------------------------------------------

SUPABASE DATABASE

--------------------------------------------------

Connect the application completely with Supabase.

Create a table named:

placement_students

Use the following structure:

id

- uuid

- primary key

- default: gen_random_uuid()

student_name

- text

- not null

father_name

- text

- not null

roll_number

- text

- not null

- unique

branch

- text

- not null

semester

- text

- not null

result_status

- text

- not null

backlogs

- integer

- not null

- default 0

contact_number

- text

- not null

email

- text

- not null

address

- text

- not null

remarks

- text

- nullable

created_at

- timestamptz

- default now()

updated_at

- timestamptz

- default now()

Add a UNIQUE constraint on:

roll_number

--------------------------------------------------

SUPABASE SECURITY

--------------------------------------------------

Configure Supabase correctly so students can submit the public form without requiring account login.

Use Row Level Security appropriately.

Students should only be able to INSERT their own submitted form data through the public form.

Do NOT expose an interface on this public page that allows students to:

- View all student records

- Delete records

- Edit other student records

- Browse the database

The public page is only for submitting student details.

Use safe Supabase client-side configuration.

Never expose the Supabase service_role key in frontend code.

Use only the public anon/publishable key where appropriate.

--------------------------------------------------

DUPLICATE ROLL NUMBER HANDLING

--------------------------------------------------

Prevent duplicate student submissions using Roll Number.

The database UNIQUE constraint must be the final protection against duplicate roll numbers.

If a submission fails because the roll number already exists, show:

"Details for this Roll Number have already been submitted."

Do not create duplicate records.

Avoid relying only on a frontend pre-check because two simultaneous submissions could still create a race condition.

--------------------------------------------------

FORM SUBMISSION PROCESS

--------------------------------------------------

When the student clicks:

"Submit Details"

Perform the following steps:

1. Validate all required fields.

2. Validate contact number.

3. Validate email.

4. Ensure backlog count is a valid number.

5. If Result Status is Clear, force backlogs to 0 before submission.

6. Trim unnecessary spaces from text inputs.

7. Disable the Submit button during submission.

8. Change button text temporarily to:

"Submitting..."

9. Show a loading indicator.

10. Insert the data into the Supabase placement_students table.

11. Prevent accidental multiple submissions by disabling the button while request is processing.

12. If successful, show a prominent success state:

"Details Submitted Successfully!"

Below it show:

"Your information has been recorded for placement purposes."

13. Reset the form after successful submission.

14. Keep the success message visible for a few seconds or until the student starts a new submission.

15. If an error occurs, show a clear user-friendly error message.

Do not show raw technical Supabase errors to students.

--------------------------------------------------

FORM VALIDATION MESSAGES

--------------------------------------------------

Show clear inline validation messages.

Examples:

Name:

"Please enter your name."

Father's Name:

"Please enter your father's name."

Roll Number:

"Please enter your roll number."

Branch:

"Please enter your branch."

Semester:

"Please enter your semester."

Result:

"Please select your result status."

Contact Number:

"Please enter a valid 10-digit mobile number."

Email:

"Please enter a valid email address."

Address:

"Please enter your address."

Backlogs:

"Please enter a valid number of backlogs."

--------------------------------------------------

DESIGN STYLE

--------------------------------------------------

Create a simple, professional college placement department design.

Overall style:

- Clean

- Professional

- Minimal

- Easy for students to understand

- Avoid unnecessary animations

- Avoid overly decorative design

PAGE BACKGROUND:

Use a very light grey, white, or off-white background.

FORM CARD:

- White card

- Rounded corners

- Subtle border

- Soft professional shadow

- Maximum width approximately 850px to 950px

- Center horizontally

- Comfortable padding

TOP HEADER:

Add a simple circular or square placeholder for the college logo.

Do not use a random external institution logo.

Below or beside it show:

Training & Placement Department

Main heading:

Placement Student Information Form

Description:

"Please fill in your details carefully. The information provided will be used for placement-related activities."

--------------------------------------------------

DESKTOP FORM LAYOUT

--------------------------------------------------

On desktop and laptop screens, use a two-column layout where appropriate.

Suggested layout:

Row 1:

Name | Father's Name

Row 2:

Roll No. | Branch

Row 3:

Semester | Result

Row 4:

No. of Backlogs | Contact No.

Row 5:

Email | leave remaining space naturally or allow email to span based on best visual design

Row 6:

Address - Full Width

Row 7:

Remarks - Full Width

Row 8:

Submit Button - Full Width

Keep all fields aligned properly.

--------------------------------------------------

MOBILE RESPONSIVENESS

--------------------------------------------------

On smaller screens:

Convert the entire form into a single-column layout.

Order:

Name

Father's Name

Roll No.

Branch

Semester

Result

No. of Backlogs

Contact No.

Email

Address

Remarks

Submit Details

Requirements:

- No horizontal scrolling

- Inputs should fit inside screen

- Comfortable mobile padding

- Touch-friendly button sizes

- Minimum comfortable input height

- Proper spacing between fields

Test the layout for widths around:

320px

375px

390px

430px

768px

1024px

1440px

--------------------------------------------------

INPUT DESIGN

--------------------------------------------------

Every input should have:

- Label above input

- Required fields marked with *

- Rounded border

- Good internal padding

- Clear focus state

- Professional blue focus border

- Proper placeholder text

- Error text below the field

- Consistent height

- Accessible contrast

Textarea fields can be taller.

--------------------------------------------------

SUBMIT BUTTON

--------------------------------------------------

Create a large professional blue button.

Text:

Submit Details

Button should:

- Span full width

- Have rounded corners

- Have a subtle hover effect

- Have clear focus state

- Show loading indicator during submission

- Be disabled while submitting

Add a simple check/send icon if appropriate.

Do not over-design the button.

--------------------------------------------------

SUCCESS MESSAGE

--------------------------------------------------

After successful submission show a clean success alert/card with a check icon.

Title:

Details Submitted Successfully!

Message:

Your information has been recorded for placement purposes.

Use a professional green success state.

--------------------------------------------------

ERROR MESSAGE

--------------------------------------------------

For server/database errors show:

"Unable to submit your details right now. Please try again."

For duplicate roll number show:

"Details for this Roll Number have already been submitted."

--------------------------------------------------

ACCESSIBILITY

--------------------------------------------------

Ensure:

- Every field has a proper HTML label

- Inputs are keyboard accessible

- Visible keyboard focus

- Error messages are associated with corresponding fields

- Good text/background contrast

- Buttons have accessible labels

- Do not use placeholder text as a replacement for field labels

--------------------------------------------------

FOOTER

--------------------------------------------------

At the bottom of the page show:

Training & Placement Department

and below it:

"Student information will be used only for placement-related activities."

Keep footer small and professional.

--------------------------------------------------

IMPORTANT REQUIREMENTS

--------------------------------------------------

1. Semester MUST be a manually entered text field.

2. Branch MUST be a manually entered text field.

3. Do NOT create semester dropdown options.

4. Connect the application completely to Supabase.

5. Form submissions must persist in the Supabase placement_students table.

6. Roll Number must be unique.

7. Do not expose the service role key.

8. Build proper error handling.

9. Build proper loading state.

10. Build proper duplicate submission handling.

11. Make the complete page fully responsive.

12. Do not create unnecessary pages.

13. The main goal is a simple student placement data collection form.

14. Do not require students to create an account or log in.

15. Keep the UI simple enough that a student can complete the form quickly from a phone.

College logo is attached please use the similar colors and take the address of college from the web make it great now

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://placement-form-buddy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/47f2315b-0bad-4e62-a188-5f325f0fcc41).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
